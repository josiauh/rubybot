// bot.ts
import {
  DiceCmd,
} from "./commands/dice.ts";
import { TwoBBot } from "./types/Bot.ts";
import { findCmd } from "./commands/find.ts";
import { ArchCmd } from "./commands/arch.ts";
import { StatCmd } from "./commands/stat.ts";
import { EvalCmd } from "./commands/eval.ts";
import { EchoCmd } from "./commands/echo.ts";
import {
  database,
  lastMessage,
  lastPMessage,
  lastSetter,
  lastSpammer,
  pMessageSender,
  record,
  setPreviousSender,
  setRecord
} from "./state.ts";
import { TwobladeMessage } from "./types.ts";
import { SpamCmd } from "./commands/spam.ts";
import { SudoCollections } from "./commands/sudo.ts";
import { RubyAI } from "./commands/ai.ts";
import { ExceptCmd } from "./commands/except.ts";
import { UniqueToggle } from "./commands/unique.ts";
import { BuyCmd } from "./commands/buy.ts";
import { SellCmd } from "./commands/sell.ts";
import { ShopCmd } from "./commands/shop.ts";
import { LootCmd } from "./commands/loot.ts";
import { BalanceCmd } from "./commands/balance.ts";
import { SlotsCmd } from "./commands/slots.ts";
import { UseCmd } from "./commands/use.ts";

const cmds = [
  DiceCmd,
  findCmd,
  ArchCmd,
  StatCmd,
  EvalCmd,
  EchoCmd,
  SpamCmd,
  SudoCollections,
  RubyAI,
  ExceptCmd,
  UniqueToggle,
  SellCmd,
  BuyCmd,
  ShopCmd,
  LootCmd,
  BalanceCmd,
  SlotsCmd,
  UseCmd
];

// Read login credentials from loginInfo.json
const loginInfoRaw = await Deno.readTextFile("loginInfo.json");
const { username, password } = JSON.parse(loginInfoRaw);

// Authenticate and extract auth_token.value
const body = new URLSearchParams({ username, password }).toString();
const response = await fetch("https://twoblade.com/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0",
    "Referer": "https://twoblade.com/login",
    "Origin": "https://twoblade.com",
    "x-sveltekit-action": "true",
  },
  body,
});
console.log("can i haz token? (ruby)")
const setCookieHeader = response.headers.get("set-cookie");
if (!setCookieHeader) {
  console.error("response cookies not found???");
  Deno.exit(1);
}

const match = setCookieHeader.match(/auth_token\=([^;]+)/);
if (!match) {
  console.error("couldnt find the token...");
  Deno.exit(1);
}

const authToken = match[1];
console.log("ruby can haz token!");
console.log(authToken);

// Instantiate bot with retrieved token
const Bot: TwoBBot = new TwoBBot(authToken, false, cmds, "ruby");

Bot.socket.on("message", (data: TwobladeMessage) => {
  if (performSpamCheck(data.fromUser)) {
    lastSpammer["username"] = data.fromUser;
    lastSpammer["messageLength"] = data.text.length;
    lastSpammer["recordSetter"] =
      data.text.length > record || lastSetter == data.fromUser;
    if (data.text.length > record) {
      setRecord(data.fromUser, data.text.length);
    }
  }
});

function performSpamCheck(sender: string): boolean {
  const knownWellBots = database.acceptedExceptions;
  const diff = Math.abs(lastMessage.getTime() - lastPMessage.getTime());
  const threshold = 1500;

  if (knownWellBots.includes(sender)) return false;

  if (diff < threshold) {
    Deno.writeTextFileSync(
      "spam.log",
      `SPAM FOUND: ${sender} and ${pMessageSender} (ruby's patented time checker, may be inaccurate, but you have 1.5 seconds to not spam)\n`,
      { append: true },
    );
    return true;
  } else if (
    sender.startsWith("bot_") ||
    sender.startsWith("time_") ||
    sender.startsWith("amber_")
  ) {
    Deno.writeTextFileSync(
      "spam.log",
      `SPAM FOUND: ${sender} ${
        sender.startsWith("time_") ? "(time should make better bots)" : ""
      } (ruby's patented prefix checker)\n`,
      { append: true },
    );
    return true;
  }

  setPreviousSender(sender);
  return false;
}
