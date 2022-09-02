from contextlib import redirect_stdout
import textwrap
import traceback
import discord
import orjson
import io

from discord.ext import commands
from discord.commands import option


# The Modal sent when using the eval command
class CodeModal(discord.ui.Modal):
    def __init__(self, ctx: discord.ApplicationContext, *args, **kwargs):
        super().__init__(
            *args,
            **kwargs)
        self.ctx = ctx

    async def callback(self, interaction: discord.Interaction):
        await interaction.response.send_message("Running code...")
        # Get the code that was inputed (pls work)
        code = interaction.data['components'][0]['components'][0]['value']

        # ngl don't know how this works
        env = {
            "bot": self.ctx.bot,
            "ctx": self.ctx,
            "channel": self.ctx.channel,
            "author": self.ctx.author,
            "guild": self.ctx.guild,
            "message": self.ctx.message,
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
            return await self.ctx.respond(f"Error:\n```py\n{e.__clas__.__name__}: {e}```")

        func = env["func"]

        # Actually run it with stdout going to the response
        try:
            with redirect_stdout(stdout):
                ret = await func()
        except Exception:
            # Get the contents of stdout
            value = stdout.getvalue()
            return await self.ctx.respond(f"```py\n{value}{traceback.format_exc()}```")
        else:
            value = stdout.getvalue()

            if ret is None:
                if value:
                    return await self.ctx.respond(f"```py\n{value}```")

            else:
                return await self.ctx.respond(f"```py\n{value}\n{ret}```")


class Dev(commands.Cog):
    def __init__(self, bot: discord.Bot):
        self.bot = bot
        print("Loaded dev cog")

    async def cog_check(self, ctx: discord.ApplicationContext):
        if ctx.author.id == self.bot.owner_id:
            await ctx.respond("Don't even think about it")
            return False
        return True

    @ discord.slash_command(name="eval",
                            description="Evaluate code on the bot")
    # @ option("code", str, description="Code to evaluate")
    async def eval(self, ctx: discord.ApplicationContext, code: str):
        codeIn = discord.ui.InputText(
            style=discord.InputTextStyle.long, label="Code input")

        return await ctx.send_modal(CodeModal(ctx, codeIn, title="Code to Evaluate"))
        # set some variables to make it easier to eval code

    @ discord.slash_command(name="reload", description="Reload cog(s)")
    @ option("cog", str, description="Cog to reload", required=False)
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
