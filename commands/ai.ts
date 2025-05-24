import { BotCommand, TwobladeMessage } from "../types.ts";
import token from "../token.json" with {
    type: "json"
};


async function callGemini(prompt: string): Promise<string> {
  const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  const headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": token.aiKey,
  };

  const body = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ]
  };

  const response = await fetch(`${endpoint}?key=${token.aiKey}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} ${response.statusText}\n${error}`);
  }

  const result = await response.json();

  // Extract the text response
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return text;
}

export const RubyAI: BotCommand = {
    name: "ai",
    helpMessage: "rubyAI",
    callback: async (data, bot) => {
        if (token.aiKey == 'gemini-off') {
          bot.sendMsg("rubyAI is currently off.")
        }
        const dataToMsg = (d: TwobladeMessage) => {
            return `${d.fromUser} | ${d.fromIQ} - ${d.text}`
        }

        const readableContext = bot.rubyAIContext
            .map((entry: TwobladeMessage) => dataToMsg(entry))
            .join('\n');

        bot.sendMsg("ruby is thinking...")
        const response = await callGemini(`you are a twoblade messaging bot named rubyAI. the person asking this query will be provided, in the format of (name)#(domain) | (IQ from 0-150) - (query). refer to the user as (name), not (name)#(domain). answer in a silly way, lowercase letters. (just don't get too silly, like 65%) your response is limited to 445 characters and one line only, no emojis. you have no real set personality, you're just rubyAI (also, gumdrops are awesome)\n\nhere is the context:\n${readableContext}\n\nyour query is: ${data.fromUser} | ${data.fromIQ} - ${data.text.slice(12)}`)
        bot.sendMsg(`RubyAI: ${response}`)
    }
}