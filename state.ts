import { Database, Store } from "./types.ts";

export const lastSpammer = {
    username: "thetime#twoblade.com",
    messageLength: 0,
    recordSetter: false
}
export let record = 0;
export let lastSetter = "thetime#twoblade.com"
export let lastPMessage = new Date();
export let pMessageSender = "thetime#twoblade.com";
export let lastMessage = new Date();

export let database: Database;
export let store: Store;

export function setPreviousSender(sender: string) {
    lastPMessage = lastMessage;
    pMessageSender = sender;
}

export function setRecord(setter: string, newrecord: number) {
    record = newrecord
    lastSetter = setter;
}

export function setLastMessage() {
    lastMessage = new Date()
}

export async function saveDatabase(): Promise<void> {
  const jsonString = JSON.stringify(database, null, 2); // Pretty-printed
  await Deno.writeTextFile("database.json", jsonString);
}

export async function refreshDatabase(): Promise<void> {
  database = structuredClone((await import(`./database.json?cachebust=${Date.now()}`, {
    with: { type: "json" }
  })).default);

  store = (await import(`./store.json?cachebust=${Date.now()}`, {
    with: { type: "json" }
  })).default;
}