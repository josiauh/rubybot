import { BotCommand } from "../types.ts";

export const UniqueToggle: BotCommand = {
    name: "unique",
    helpMessage: "do you ever just think my messages are boring? well, this will still have boring messages, but with cool uuids!",
    callback: (_, bot) => {
        bot.uniqueness = !bot.uniqueness
        bot.sendMsg(bot.uniqueness ? 'i have uniqueness now!' : 'sending messages normally');
        bot.messagesSent++;
    }
}