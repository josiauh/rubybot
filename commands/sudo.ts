import { database, refreshDatabase } from "../state.ts";
import { BotCommand } from "../types.ts";

function removeOne<T>(arr: T[], keyToRemove: T): T[] {
  const index = arr.indexOf(keyToRemove);
  if (index === -1) return arr.slice(); // key not found, return copy
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export const SudoCollections: BotCommand = {
    name: "sudo",
    helpMessage: "sudo",
    callback: async (data, bot) => {
        // PLEASE CHANGE THIS
        const admins = ["freesmart#twoblade.com", "rubybot#twoblade.com"];
        // ruby sudo
        if (data.text.startsWith("ruby sudo") && !admins.includes(data.fromUser)) {
        bot.sendMsg("youre not an admin idiot")
        }

        if (data.text.startsWith("ruby sudo refresh") && admins.includes(data.fromUser)) {

            await refreshDatabase()

            bot.sendMsg("Refreshed database!");
            bot.messagesSent++;
        }

        if (data.text.startsWith("ruby sudo eval") && admins.includes(data.fromUser)) {
            const code = data.text.slice("ruby sudo eval ".length);
            console.log(`[RUBY EVAL] inflicted from sudo`);
            console.log(`[CODE]\n${code}`);
            console.log(`[USER] inflicted from sudo`);

            const result = eval(code);

            bot.sendMsg(`${result}`);
            bot.messagesSent++;
        }

        if (data.text.startsWith("ruby sudo ban") && admins.includes(data.fromUser)) {
            const user = data.text.slice("ruby sudo ban ".length);
            database.banlist.push(user);

            bot.sendMsg(`EW EW EW IT'S ${user}!!!!!! AAAAAAAAHHHH!!!!`)
        }

        if (data.text.startsWith("ruby sudo unban") && admins.includes(data.fromUser)) {
            const user = data.text.slice("ruby sudo unban ".length);
            removeOne(database.banlist, user);

            bot.sendMsg(`EW EW EW IT'S ${user}!!!!!! AAAAAAAAHHHH!!!!`)
        }
    }
}