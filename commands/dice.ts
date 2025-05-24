import { BotCommand } from "../types.ts";

export const DiceCmd: BotCommand = {
    name: "dice",
    helpMessage: "i have a bunch of dices! just give me a number and i'll find the corresponding dice!",
    callback: (data, bot) => {
        const dice = data.text.slice("ruby dice ".length)
        bot.sendMsg(`ruby's d${dice} rolled a ${Math.ceil(Math.random() * parseInt(dice))}!`)
    }
}