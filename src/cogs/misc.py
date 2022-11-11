import discord
from discord.ext import commands


class Misc(commands.Cog):
    def __init__(self, bot: discord.Bot, *args, **kwargs):
        super().__init__(
            *args,
            **kwargs)
        self.bot = bot  # So we have a copy of the bot object
        print("loaded misc cog")

    @discord.slash_command(name="ping", description="Get the ping of the bot")
    async def ping(self, ctx: discord.ApplicationContext):
        await ctx.respond(f"The ping is **{round(self.bot.latency * 1000)}ms**")

    @discord.slash_command(name="echo",
                           description="Make the bot say something")
    async def echo(self, ctx: discord.ApplicationContext, content: discord.Option(str)):
        # Will send a message to the channel without the
        # interaction reply thingy for seemless echoes
        await ctx.send(content)
        # Will reply to the interaction
        await ctx.respond(f"Saying {content}", ephemeral=True)


def setup(bot: discord.Bot):
    bot.add_cog(Misc(bot))
    print("Loaded Misc Cog")
