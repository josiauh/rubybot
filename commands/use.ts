import { BotCommand } from "../types.ts";
import { database, saveDatabase, store } from "../state.ts";
import { removeOne } from "../types/Store.ts";

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function findMostSimilarItem(target: string, items: string[]): string | null {
  if (items.length === 0) return null;

  let bestMatch = items[0];
  let smallestDistance = levenshteinDistance(target, bestMatch);

  for (let i = 1; i < items.length; i++) {
    const distance = levenshteinDistance(target, items[i]);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      bestMatch = items[i];
    }
  }

  return bestMatch;
}

export const UseCmd: BotCommand = {
  name: "use",
  helpMessage: "do you have an item to use ya pinhead?",
  callback: (data, bot) => {
    const itemName = data.text.slice("ruby use ".length).trim();
    const items = database.itemCollections[data.fromUser] ?? [];

    if (!items.includes(itemName)) {
      bot.sendMsg(`you don't have that item! ${items.length !== 0 ? `did you want your ${findMostSimilarItem(itemName, items)}` : 'get an item before using this'}`);
      return;
    }

    bot.sendMsg(`you use your ${itemName}`);

    const item = store.items[itemName];

    if (item.privilege) {
        bot.sendPingMsg("that's a privilege.", data.fromUser)
        return;
    }

    if (item.useMessage) {
        bot.sendPingMsg(item.useMessage, data.fromUser)
        if (itemName == "haxx") {
            bot.socket.disconnect()
            setTimeout(() => {
                bot.socket.connect()
            }, 20_000);
        }
    } else {
        if (itemName == "duplicate object key") {
            item.keep = true;
            bot.sendPingMsg("use ruby duplicate bro, we cant take another argument", data.fromUser);
        }
    }

    if (!item.keep) database.itemCollections[data.fromUser] = removeOne(items, itemName);

    saveDatabase();
  }
};
