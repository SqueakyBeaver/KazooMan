import * as dotenv from 'dotenv';
import mongoose from 'mongoose';


export class GuildData {
    constructor(public guild_id: string, public daily: string = '', public reports: string = '', public disabled: string[] = []) {
        this.id = guild_id;
        this.daily = String(daily);
        this.report_channel = String(reports);
        this.disabled_commands = disabled;
    }
    id: string;
    daily_channel = '';
    report_channel = '';
    disabled_commands: string[] = [];
}

export class DBInstance {
    guildSchema: mongoose.Schema;
    GuildConfigs;
    constructor() {
        this.guildSchema = new mongoose.Schema({
            _id: String,
            daily_channel: String,
            report_channel: String,
            disabled_commands: Array<string>
        });
        this.GuildConfigs = mongoose.model('Guilds', this.guildSchema);
    }
    async init() {
        dotenv.config();
        await mongoose.connect(String(process.env.DB_CONN_STR));

        this.GuildConfigs = mongoose.model('Guilds', this.guildSchema);
    }
    async createConfig(guild: GuildData) {
        this.GuildConfigs.create({
            _id: guild.id,
            daily_channel: guild.daily_channel,
            report_channel: guild.report_channel,
            disabled_commands: guild.disabled_commands
        });

    }
}