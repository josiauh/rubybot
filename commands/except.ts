import { BotCommand } from "../types.ts";

export const ExceptCmd: BotCommand = {
    name: "except",
    helpMessage: "apply for a spam exception in case you are a bot or a real person!",
    callback: async (data, bot) => {
        bot.sendMsg(`Your request has been sent! freesmart will determine the fate of your exception. You will get a sharp if you were accepted!`);
        await Deno.writeTextFile("spamExceptions.log", `Request recieved from ${data.fromUser}, wait for review!\n`, { append: true });
        bot.messagesSent++;
    }
}