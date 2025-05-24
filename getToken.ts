import login from "./loginInfo.json" with {
    type: "json"
}

const body = new URLSearchParams(login).toString();

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

// Extract auth_token.value from Set-Cookie
const rawSetCookie = response.headers.get("set-cookie");
if (!rawSetCookie) {
  console.error("No Set-Cookie header received.");
  Deno.exit(1);
}

const authTokenMatch = rawSetCookie.match(/auth_token\=([^;]+)/);
if (!authTokenMatch) {
  console.error("auth_token.value not found in Set-Cookie.");
  console.error(rawSetCookie)
  Deno.exit(1);
}
const token = authTokenMatch[1];
console.log("auth_token.value:", token);

// Load token.json
let tokenJson: {
    authToken?: string;
} = {};
try {
  const file = await Deno.readTextFile("token.json");
  tokenJson = JSON.parse(file);
} catch (err) {
  if (err instanceof Deno.errors.NotFound) {
    console.warn("token.json not found, creating a new one.");
  } else {
    throw err;
  }
}

// Set authToken
tokenJson.authToken = token;

// Save back to token.json
await Deno.writeTextFile("token.json", JSON.stringify(tokenJson, null, 2));
console.log("auth_token.value saved to token.json as authToken");