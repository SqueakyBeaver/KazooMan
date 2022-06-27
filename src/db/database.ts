import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

export interface GuildData {
    id: string;
    daily?: string;
    reports?: string;
    disabled?: string[];
}

export class DBInstance {
    guildSchema: mongoose.Schema;
    GuildConfigs;

    constructor() {
        this.guildSchema = new mongoose.Schema({
            _id: String,
            daily_channel: String,
            report_channel: String,
            disabled_commands: Array<string>()
        });
        this.GuildConfigs = mongoose.model('Guilds', this.guildSchema);
    }

    async init() {
        dotenv.config();
        await mongoose.connect(String(process.env.DB_CONN_STR));

        this.GuildConfigs = mongoose.model('Guilds', this.guildSchema);
    }
    
    async writeConfig(guild: GuildData) {
        const guildRes = await this.GuildConfigs.findById(guild.id);
        // If it doesn't exist already, create it, else update it
        if (!guildRes) {
            return await this.GuildConfigs.create({
                _id: guild.id,
                daily_channel: guild.daily,
                report_channel: guild.reports,
                disabled_commands: guild.disabled
            });

        } else {
            guildRes.updateOne({
                daily_channel: guild.daily,
                report_channel: guild.reports,
                disabled_commands: guild.disabled
            }).exec();
        }
    }

    async getGuildInfo(id: string): Promise<GuildData> {
        let res: any = await this.GuildConfigs.findById(id);

        if (!res) res = await this.writeConfig({ id: id });
        return {
            id: res._id,
            daily: res.daily_channel,
            reports: res.report_channel,
            disabled: res.disabled_commands
        };
    }
}

// async function test() {
//     const database = new DBInstance();
//     await database.init();
//     await database.createConfig(new GuildData('2234'));
//     return database.getGuildInfo('2234');
// }

// test().then(console.log);