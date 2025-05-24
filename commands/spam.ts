import { lastSetter, lastSpammer, record } from "../state.ts";
import { BotCommand } from "../types.ts";

export const SpamCmd: BotCommand = {
    name: "spam",
    helpMessage: "stupidity",
    callback: (_, bot) => {
        bot.sendMsg(`last time, ${lastSpammer.username} spammed ${lastSpammer.messageLength} characters. ${lastSpammer.recordSetter ? 'a record high for this session!' : 'the record is set by ' + lastSetter + ', with ' + record.toString() + ' chars!'}`);
        bot.messagesSent++;
    }
}