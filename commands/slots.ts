// deno-lint-ignore-file no-inner-declarations
import { database } from "../state.ts";
import { BotCommand } from "../types.ts";

export const SlotsCmd: BotCommand = {
    name: "slots",
    helpMessage: "requires the slots privilege.",
    callback: (data, bot) => {
        const bet = data.text.slice("ruby slots ".length);
              if (database.itemCollections[data.fromUser as keyof typeof database.itemCollections]?.includes("slots")) {
                if (parseInt(bet) > database.gumdropCollections[data.fromUser as keyof typeof database.gumdropCollections]) {
                  bot.sendMsg("you bet way more than you have now! try betting lower.")
                  return;
                }
                const slotMachineEmojis = [
                  "🍒", // cherry
                  "🍋", // lemon
                  "🍊", // orange
                  "🍉", // watermelon
                  "🍇", // grapes
                  "🍓", // strawberry
                  "7️⃣", // lucky seven
                  "⭐", // star
                  "🔔", // bell
                  "🍀", // four-leaf clover
                  "💎", // diamond
                  "🍌", // banana
                  "🥝", // kiwi
                  "🍍", // pineapple
                ];
        
                // Spin mechanism: pick 3 random emojis
                function spinSlots() {
                  const result = [];
                  for (let i = 0; i < 3; i++) {
                    const randomIndex = Math.floor(Math.random() * slotMachineEmojis.length);
                    result.push(slotMachineEmojis[randomIndex]);
                  }
                  return result;
                }
        
                const spinResult = spinSlots();
                bot.sendMsg(`here it comes: ${spinResult.join("|")}`);
        
                // Optional: check if all three match
                if (spinResult[0] === spinResult[1] && spinResult[1] === spinResult[2]) {
                  bot.sendMsg(`yaaaaaaaaaay!!! that's 3 of those things!!! here's ${bet} gumdrops!`);
                  database.gumdropCollections[data.fromUser as keyof typeof database.gumdropCollections] += parseInt(bet);
                } else {
                  bot.sendMsg(`uhh... whoops. looks like you lost! your bet of ${bet} gumdrops will be collected`);
                  database.gumdropCollections[data.fromUser as keyof typeof database.gumdropCollections] -= parseInt(bet);
                }
        
                bot.sendMsg('thanks for playing!')
              } else {
                bot.sendMsg("woah, you can't come in here! you don't have the slots privilege! you need to buy that or get it from loot.");
              }
    }
}