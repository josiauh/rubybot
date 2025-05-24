import { BotCommand } from "../types.ts";

function formatTimeDiff(start: Date, end: Date): string {
  let diffMs = Math.abs(end.getTime() - start.getTime());

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  diffMs %= 1000 * 60 * 60;

  const minutes = Math.floor(diffMs / (1000 * 60));
  diffMs %= 1000 * 60;

  const seconds = Math.floor(diffMs / 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export const StatCmd: BotCommand = {
    name: "stat",
    helpMessage: "placeholder",
    callback: (_, bot) => {
        bot.sendMsg(`ruby's uptime is ${formatTimeDiff(new Date(bot.startDate), new Date())}, sending ${bot.messagesSent} bot messages up until now!`);
        bot.messagesSent++;
    }
}