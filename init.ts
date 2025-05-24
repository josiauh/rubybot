// setup.ts
import {
  Input,
  Confirm,
  Secret,
} from "https://deno.land/x/cliffy@v1.0.0-rc.4/prompt/mod.ts";
import { exists } from "https://deno.land/std@0.224.0/fs/exists.ts";

// Check for existing config files
const configFiles = ["database.json"];
const existingFiles: string[] = [];

for (const file of configFiles) {
  if (await exists(file)) {
    existingFiles.push(file);
  }
}

let overwriteDatabase = false;

if (existingFiles.length > 0) {
  const overwrite = await Confirm.prompt(
    `A database currently exists!!!! Want to overwrite it?`
  );
  if (!overwrite) {
    console.log("okay, i wont");
  }
  overwriteDatabase = overwrite
}

// Begin prompts
const enableGemini = await Confirm.prompt("Enable Gemini?");
let geminiApiKey: string | undefined = undefined;
if (enableGemini) {
  geminiApiKey = await Input.prompt("Gemini API Key:");
}

// Prompt for login credentials
console.log("\nEnter your TwoBlade login credentials:");
const username = await Input.prompt("Username:");
const password = await Secret.prompt("Password (hidden):");

// Perform login to retrieve auth_token.value
const body = new URLSearchParams({ username, password }).toString();
const response = await fetch("https://twoblade.com/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0",
    "Referer": "https://twoblade.com/login",
    "Origin": "https://twoblade.com",
    "x-sveltekit-action": "true"
  },
  body,
});

// Extract token from Set-Cookie
const rawSetCookie = response.headers.get("set-cookie");
if (!rawSetCookie) {
  console.error("we didn't get a set cookie header. shurg");
  Deno.exit(1);
}

const match = rawSetCookie.match(/auth_token\=([^;]+)/);
if (!match) {
  console.error("auth token not found :shrug:");
  Deno.exit(1);
}

const authToken = match[1];
console.log("2b login successful");

// Write config.json
await Deno.writeTextFile("token.json", JSON.stringify({
  authToken,
  aiKey: geminiApiKey || "gemini-off"
}, null, 2));

await Deno.writeTextFile("loginInfo.json", JSON.stringify({
  username,
  password
}, null, 2));

// Write database.json
if (overwriteDatabase && existingFiles.length > 1) {
  await Deno.writeTextFile("database.json", JSON.stringify({
    echoBlacklist: [],
    acceptedExceptions: [],
    gumdropCollections: {},
    itemCollections: {},
    dailyStoreItems: {}
  }, null, 2));
}



console.log("setup complete! you deserve a gumdrop!");
