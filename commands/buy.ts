// commands/buy.ts
import { BotCommand } from "../types.ts";
import { database, saveDatabase } from "../state.ts";

export const BuyCmd: BotCommand = {
  name: "buy",
  helpMessage: "plushies? gumdrops? fish? you want it? it's yours my friend! as long as you have enough gumdrops!",
  callback: async (data, bot) => {
    const itemName = data.text.slice("ruby buy ".length).trim();
    const foundItem = database.dailyStoreItems.items.find(i => i.name === itemName);

    if (!foundItem) {
      bot.sendMsg(`we don't have a '${itemName}' in stock. wait until tomorrow, or suggest the item to freesmart#twoblade.com`);
      return;
    }

    const currentGumdrops = database.gumdropCollections[data.fromUser] ?? 0;
    if (currentGumdrops < foundItem.data.price) {
      bot.sendMsg(`you can't get a ${itemName}! you'll need ${foundItem.data.price - currentGumdrops} more gumdrops!`);
      return;
    }

    database.itemCollections[data.fromUser] = [...(database.itemCollections[data.fromUser] ?? []), itemName];
    database.gumdropCollections[data.fromUser] = currentGumdrops - foundItem.data.price;

    bot.sendMsg(`here's your ${itemName}! your current balance is ${database.gumdropCollections[data.fromUser]}`);
    await saveDatabase();
  }
};
