// commands/shop.ts
import { BotCommand } from "../types.ts";
import { database } from "../state.ts";

export const ShopCmd: BotCommand = {
  name: "shop",
  helpMessage: "the ruby shop is open! see what you can buy today!",
  callback: (_, bot) => {
    const shopItems = database.dailyStoreItems.items
      .map(item => `${item.name} (${item.data.price}) - ${item.data.description}`)
      .join("; ");
    bot.sendMsg(`Store for 2day: ${shopItems}`);
  }
};
