import discord
import os
import logging
import orjson

from discord.ext import commands
from dotenv import load_dotenv


# Get the env vars from the .env file
load_dotenv()

# Output logs to discord.log so as to not clutter the console
logger = logging.getLogger("discord")
logger.setLevel(logging.DEBUG)
handler = logging.FileHandler(
    filename="discord.log", encoding="utf-8", mode="w")
handler.setFormatter(
    logging.Formatter("%(asctime)s:%(levelname)s:%(name)s: %(message)s")
)
logger.addHandler(handler)


class GooseBot(discord.Bot):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Create the bot
        with open("src/cogs.json", "rb") as f:
            self.cogs_list = orjson.loads(f.read())["cogs"]

        for cog in self.cogs_list:
            self.load_extension(f"cogs.{cog}")

    async def on_ready(self):
        print(f"Logged in as {self.user}")

    async def on_application_command_error(
        self, ctx: discord.ApplicationContext, error: discord.DiscordException
    ):
        if isinstance(error, commands.CommandOnCooldown):
            await ctx.respond("This command is currently on cooldown!")
        else:
            raise error  # Here we raise other errors to ensure they aren't ignored


if __name__ == "__main__":
    bot = GooseBot(debug_guilds=[637316662801989658])
    bot.run(os.getenv("DEV_TOKEN"))
