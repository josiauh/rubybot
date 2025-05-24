// commands/balance.ts
import { BotCommand } from "../types.ts";
import { database } from "../state.ts";

export const BalanceCmd: BotCommand = {
  name: "balance",
  helpMessage: "wanna see how many gumdrops you have?",
  callback: (data, bot) => {
    const gumdrops = database.gumdropCollections[data.fromUser] ?? -2763;
    const items = database.itemCollections[data.fromUser] ?? [];

    bot.sendMsg(`@${data.fromUser} has ${items.join(", ") || "no items"}, and ${gumdrops !== -2763 ? gumdrops : 'no'} gumdrops! ${gumdrops === -2763 ? 'dude, just find some around! use ruby loot' : ''}`);
  }
};
