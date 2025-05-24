import { database, saveDatabase } from "../state.ts";

export type StoreItem = {
  description: string;
  privilege: boolean;
  price: number;
  rarity: number;
  keep?: boolean;
  useMessage?: string;
};

export type Store = {
  items: Record<string, StoreItem>;
};

export function removeOne<T>(arr: T[], keyToRemove: T): T[] {
  const index = arr.indexOf(keyToRemove);
  if (index === -1) return arr.slice(); // key not found, return copy
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export function lootNow(items: Record<string, StoreItem>) {
  const pool: string[] = [];

  for (const [itemName, { rarity }] of Object.entries(items)) {
    if (rarity === 0) continue;
    const weight = rarity;
    for (let i = 0; i < weight; i++) {
      pool.push(itemName);
    }
  }

  return pool;
}

export function pickDailyItems(store: Store, count: number = 4): { name: string, data: StoreItem }[] {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  if (database.dailyStoreItems?.date === today && Array.isArray(database.dailyStoreItems)) {
    return database.dailyStoreItems.items;
  }

  const itemNames = Object.keys(store.items);
  const selectedNames: Set<string> = new Set();

  while (selectedNames.size < Math.min(count, itemNames.length)) {
    const randomIndex = Math.floor(Math.random() * itemNames.length);
    selectedNames.add(itemNames[randomIndex]);
  }

  const selectedItems = Array.from(selectedNames).map(name => ({
    name,
    data: store.items[name]
  }));

  database.dailyStoreItems = {
    date: today,
    items: selectedItems
  };

  saveDatabase();

  return selectedItems;
}