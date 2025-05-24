import { Socket, io } from "https://esm.sh/socket.io-client@4.7.5";
import { TwobladeMessage } from "./Twoblade.ts";
import { database, refreshDatabase } from "../state.ts";

export type BotCommand = {
    name: string;
    helpMessage: string;
    callback: (data: TwobladeMessage, bot: TwoBBot) => unknown;
}

export class TwoBBot {

    socket: Socket;
    uniqueness: boolean;
    prefix: string;
    commands: BotCommand[];
    startDate: Date;
    messagesSent: number;
    rubyAIContext: TwobladeMessage[]

    constructor(authToken: string, uniqueness: boolean, commands: BotCommand[], prefix: string) {
        this.socket = io("wss://twoblade.com", {
          path: "/ws/socket.io",
          transports: ["websocket"],
          auth: {
            token: authToken
          },
          extraHeaders: {
            Cookie: "cf_clearance=tzDgleVMWiqSyrtRiJbyJg4kxNpESRinfWrPtSY588Y-1747721703-1.2.1.1-0v8Bk48Th8mhjgpjkCDJAiRCGGt_32PoofPemGCHiwlFbztZ1trv5ttPDvvdXbVCWbND5W7paPszrM4nGrwT6yJwWZi5BLyYFFz3dDFjDzlSgPdhMAAvimlopToWWV_EO5HexDHHUSBaQu9wGVHid8MfgKN9m_F0m2Tmh3CT80IXVbz4VHkDmqAoQ4IpNtevcNQsfRJOSFWyDGQXaYkDCxkJyzhLgL_qUnTY5WEf418Lz869lfkD3jK2saNgakfUf1nXFtyP1RZe.93llJndthIkt4J.Q32QC1nCV8k_ryfOgHor2o3KbJbwkE0CY51THIfDdZc4tUhqfYuBbc4GCtEdzGfoszMaEIdkNfIIViI"
          }
        });

        this.uniqueness = uniqueness;
        this.startDate = new Date();
        this.commands = commands;
        this.rubyAIContext = [];
        const HelpCmd: BotCommand = {
            name: "help",
            helpMessage: "this command. right here. how do you not know what help does?",
            callback: (data, bot) => {
                const helpMessages = new Map(bot.commands.map(cmd => [cmd.name, cmd.helpMessage]));
                if (data.text == "ruby help") bot.sendMsg(`say "ruby help <cmd>" to get more info! ${Array.from(helpMessages.keys()).join(", ")}`);
                else {
                    const cmd = data.text.slice("ruby help ".length);
        
                    if (!helpMessages.has(cmd)) {
                        bot.sendMsg("that's not a command!");
                    } else {
                        bot.sendMsg(helpMessages.get(cmd) || "something happened...")
                    }
                }
                bot.messagesSent++;
            }
        }
        commands.push(HelpCmd)

        this.prefix = prefix;
        this.messagesSent = 0;
        this.socket.on("connect", () => {
            console.log("we've connected! yeah yeah yeah!")
            this.socket.emit("message", "RubyBot v2.0.0 - now with modularity!")
            this.messagesSent++
        })
        refreshDatabase();
        this.socket.on("message", async (data: TwobladeMessage) => {
            if (!data.text.startsWith(prefix)) return;
            if (database.banlist.includes(data.fromUser) && data.text.startsWith(prefix)) {
                const insults = [
                    "hey, isn't that like, *USER*? nah, just the air.",
                    "*USER* sux",
                    "thank yo-oh, ew. it's you. AAAAAAAAAAAAAAAAAAAAAHHH",
                    "socket.emit('user_banned', '*USER*')",
                    "*USER* should go back to reddit",
                    "*USER* was slain by Banlist with Ban Hammer"
                ]

                this.sendMsg(insults[Math.floor(Math.random() * insults.length)].replaceAll("*USER*", data.fromUser))
                return;
            }

            this.rubyAIContext.push(data);

            if (this.rubyAIContext.length > 20) {
                this.rubyAIContext.shift();
            }
            const content = data.text.slice(prefix.length + 1).trim();

            // Try to find the longest matching command name
            const command = this.commands
                .filter(cmd => content.startsWith(cmd.name + " "))
                .sort((a, b) => b.name.length - a.name.length)[0];

            if (command) {
                await command.callback(data, this);
            }
        });
    }

    sendMsg(msg: string) {
        this.socket.emit("message", `${msg}${this.uniqueness ? ` [UQ-${crypto.randomUUID()}]` : ''}`)
    }

    sendPingMsg(msg: string, user: string) {
        this.socket.emit("message", `[ @${user} ] ${msg}${this.uniqueness ? ` [UQ-${crypto.randomUUID()}]` : ''}`)
    }
} 