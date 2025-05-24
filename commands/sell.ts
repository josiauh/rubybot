// commands/sell.ts
import { BotCommand } from "../types.ts";
import { database, store } from "../state.ts";
import { removeOne } from "../types/Store.ts";

export const SellCmd: BotCommand = {
  name: "sell",
  helpMessage: "Sell an item from your collection. Usage: ruby sell <item>",
  callback: (data, bot) => {
    const itemName = data.text.slice("ruby sell ".length).trim();
    const items = database.itemCollections[data.fromUser] ?? [];

    if (!items.includes(itemName)) {
      bot.sendMsg("you don't have that item!");
      return;
    }

    const gumdropValue = store.items[itemName]?.price ?? 0;
    database.itemCollections[data.fromUser] = removeOne(items, itemName);
    database.gumdropCollections[data.fromUser] = (database.gumdropCollections[data.fromUser] ?? 0) + gumdropValue;

    bot.sendMsg("sold!");
  }
};
