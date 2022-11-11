import discord
from discord.ext import commands, tasks

from datetime import datetime
from bs4 import BeautifulSoup

import requests


class Daily(commands.Cog):
    def __init__(self, bot: discord.Bot, *args, **kwargs):
        super().__init__(
            *args,
            **kwargs)
        self.bot = bot

    @staticmethod
    def get_daily_holidays(date: datetime) -> dict[str, str]:
        link = f'https://www.checkiday.com/{date.month}/{date.day}/{date.year}'

        try:
            site = requests.get(link)
        except Exception:
            return None

        soup = BeautifulSoup(site.content, 'html.parser')

        links = []
        for link in soup.find(
                id='magicGrid').find_all(
                class_='mdl-card__title-text'):
            links.append(link.a)

        for a in links:
            yield {'title': a.text, 'link': a['href']}

        # Start a background task that will send a daily message in
        # pre-configured channels
    @tasks.loop(minutes=1)
    def daily_check(self):
        pass

    @daily_check.before_loop
    async def before_daily_check(self):
        await self.bot.wait_until_ready()
        print('Starting daily loop')


def setup(bot: discord.Bot):
    bot.add_cog(Daily(bot))
    print("Loaded Daily Cog")
