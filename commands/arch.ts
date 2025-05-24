import { BotCommand } from "../types.ts";

export const ArchCmd: BotCommand = {
    name: "arch",
    helpMessage: "placeholder",
    callback: async (data, bot) => {
        bot.sendMsg("hey! this is a docker powered command. docker takes a bit to get started, and nothing you do to the root filesystem (except  /global) saves.")
        const code = data.text.slice("ruby arch ".length);

        const cmd = new Deno.Command("docker", {
            args: [
            "run",
            "--rm",
            "--memory", "1g",
            "--cpus", "6",
            "-v", `${Deno.cwd()}/globalfs:/global`,
            "archlinux/archlinux:latest",
            "/bin/bash",
            "-c",
            code,
            ],
            stdout: "piped",
            stderr: "piped",
        });

        const { stdout, stderr } = await cmd.output();

        const outStr = new TextDecoder().decode(stdout);
        const errStr = new TextDecoder().decode(stderr);

        bot.sendMsg(`ruby is done! here's stdout:\n${outStr}`);
        bot.sendMsg(`and stderr:\n${errStr}`);
    }
}