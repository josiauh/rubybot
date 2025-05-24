import { BotCommand } from "../types.ts";
import { database } from "../state.ts";

export const EchoCmd: BotCommand = {
    name: "echo",
    helpMessage: "say it back",
    callback: async (data, bot) => {
        if (database.echoBlacklist.includes(data.fromUser)) {
            bot.sendMsg(`you cannot use echo.`);
        }
        bot.sendMsg(`Ruby echoed: ${data.text.slice("ruby echo ".length)}`);
        await Deno.writeTextFile("echoes.log", `${data.fromUser}: ${data.text.slice("ruby echo ".length)}\n`, { append: true });
        bot.messagesSent++;
    }
}