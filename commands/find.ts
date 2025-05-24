import { BotCommand } from "../types.ts";

export const findCmd: BotCommand = {
    name: "find a",
    callback: (data, bot) => {
        const lengthUnitsPlural = [
          // Metric system (pluralized)
          "nanometers", "micrometers", "millimeters", "centimeters", "decimeters",
          "meters", "dekameters", "hectometers", "kilometers", "megameters", "gigameters",

          // Imperial system (pluralized)
          "thous",         // plural of thou (aka mils)
          "inches",
          "feet",          // irregular plural of foot
          "yards",
          "chains",
          "furlongs",
          "miles",
          "leagues",

          // Nautical units (pluralized)
          "fathoms",
          "cables",
          "nautical miles",

          "lightyears",
          "blocks",
          "bananas"
        ];
        const object = data.text.slice("ruby find a ".length)
        bot.sendMsg(`your ${object} is about ${Math.ceil(Math.random() * 2763)} ${lengthUnitsPlural[Math.floor(Math.random() * lengthUnitsPlural.length)]} away!`)
    },
    helpMessage: "send me scouring for one of your things! this takes one argument"
}