from contextlib import redirect_stdout
import textwrap
import traceback
import discord
import orjson
import io

from discord.ext import commands
from discord.commands import option


class Dev(commands.Cog):
    def __init__(self, bot: discord.Bot):
        self.bot = bot
        print("Loaded dev cog")

    async def cog_check(self, ctx: discord.ApplicationContext):
        if ctx.author.id == self.bot.owner_id:
            await ctx.respond("Don't even think about it")
            return False
        return True

    @discord.slash_command(name="eval", description="Evaluate code on the bot")
    @option("code", str, description="Code to evaluate")
    async def eval(self, ctx: discord.ApplicationContext, code: str):

        # set some variables to make it easier to eval code
        env = {
            "bot": self.bot,
            "ctx": ctx,
            "channel": ctx.channel,
            "author": ctx.author,
            "guild": ctx.guild,
            "message": ctx.message,
        }
        # also add the globals
        env.update(globals())

        code = code.replace("\"", "'")

        # To send output to user
        stdout = io.StringIO()

        to_run = f"async def func():\n{textwrap.indent(code, '    ')}"

        # Turn it into an actual function
        try:
            exec(to_run, env)
        except Exception as e:
            return await ctx.respond(f"Error:\n```py\n{e.__clas__.__name__}: {e}```")

        func = env["func"]

        # Actually run it with stdout going to the response
        try:
            with redirect_stdout(stdout):
                ret = await func()
        except Exception:
            # Get the contents of stdout
            value = stdout.getvalue()
            return await ctx.respond(f"```py\n{value}{traceback.format_exc()}```")
        else:
            value = stdout.getvalue()

            if ret is None:
                if value:
                    return await ctx.respond(f"```py\n{value}```")

            else:
                return await ctx.respond(f"```py\n{value}\n{ret}```")

    @discord.slash_command(name="reload", description="Reload cog(s)")
    @option("cog", str, description="Cog to reload", required=False)
    async def reload(self, ctx: discord.ApplicationContext, cog: str = None):
        with open("src/cogs.json", "rb") as f:
            cogs_list = orjson.loads(f.read())["cogs"]

        if not cog:
            return await ctx.respond(
                f"The cogs available to reload are: `{[x for x in cogs_list]}`",
                ephemeral=True,
            )

        if cog.lower() == "all":
            for cog in cogs_list:
                self.bot.reload_extension(f"cogs.{cog}")
            return await ctx.respond("Successfully reloaded all cogs", ephemeral=True)

        if not (cog.lower() in cogs_list):
            return await ctx.respond("There is no such cog", ephemeral=True)

        self.bot.reload_extension(f"cogs.{cog.lower()}")
        return await ctx.respond(f"Successfully reloaded the `{cog.lower()}` cog", ephemeral=True)


def setup(bot):
    bot.add_cog(Dev(bot))
