// commands/loot.ts
import { BotCommand } from "../types.ts";
import { store, database, saveDatabase } from "../state.ts";
import { lootNow } from "../types/Store.ts";

export const LootCmd: BotCommand = {
  name: "loot",
  helpMessage: "look for loot!",
  callback: async (data, bot) => {
    if (Math.random() < 0.4) {
      bot.sendMsg(`@${data.fromUser} searched everywhere but found nothing.`);
      return;
    }

    const loot = lootNow(store.items);
    const totalGumdrops = Math.floor(Math.random() * 100);
    const randomItem = Math.floor(Math.random() * loot.length);
    const itemName = loot[randomItem];
    const itemDescription = store.items[itemName].description;

    bot.sendMsg(`@${data.fromUser} found something! yeah yeah yeah! ${totalGumdrops} gumdrops and a ${itemName}! ${itemDescription}`);

    database.gumdropCollections[data.fromUser] = (database.gumdropCollections[data.fromUser] ?? 0) + totalGumdrops;
    database.itemCollections[data.fromUser] = [...(database.itemCollections[data.fromUser] ?? []), itemName];

    await saveDatabase();
  }
};
