import { BotCommand } from "../types.ts";
import { join } from "https://deno.land/std@0.224.0/path/mod.ts";

export const EvalCmd: BotCommand = {
    name: "eval",
    helpMessage: "it's just node.js",
    callback: async (data, bot) => {
      bot.sendMsg("hey! this is a docker powered command. docker takes a bit to get started, and nothing you do to the root filesystem (except /sandbox and /global) saves.")
      const code = data.text.slice("ruby eval ".length);
      console.log(`[RUBY EVAL] Eval requested by ${data.fromUser}`);
      console.log(`[CODE]\n${code}`);

      const userId = data.fromUser;
      const id = crypto.randomUUID();

      const userSandboxRoot = `./sandbox/${userId}`;
      const tempDir = `${userSandboxRoot}/${id}`;
      const filename = "index.js";

      // Ensure user root and temp dir exist
      await Deno.mkdir(tempDir, { recursive: true });

      const template = await Deno.readTextFile("./template.js")

      await Deno.writeTextFile(join(tempDir, filename), template + '\n\n// User injected code goes here\n\n' + code);

      const absPath = Deno.realPathSync(tempDir);
      const sandBox = Deno.realPathSync(userSandboxRoot);

      const absGFS = Deno.realPathSync("./globalfs")

      const dockerCmd = new Deno.Command("docker", {
        args: [
          "run", "--rm",
          "--memory", "1g",
          "--cpus", "2",
          "-v", `${absPath}:/codeFile:ro`,
          "-v", `${sandBox}:/sandbox:rw`,
          "-v", `${absGFS}:/global:rw`,
          "node:20-slim",
          "node", `/codeFile/${filename}`,
        ],
        stdout: "piped",
        stderr: "piped",
      });

      const { stdout, stderr } = await dockerCmd.output();

      const output = new TextDecoder().decode(stdout).trim();
      const error = new TextDecoder().decode(stderr).trim();

      if (error) {
        console.error("Sandbox error:", error);
        bot.sendMsg(`ruby is... oh. ${error}`);
      } else {
        console.log("Sandbox result:", output);
        bot.sendMsg(`ruby has completed! ${output}  ${output == '' ? '(use console.log to get the output)': ''}`);
      }

      // Do not delete the user root dir, only the per-eval temp directory
      setTimeout(async () => {
        await Deno.remove(tempDir, { recursive: true });
      }, 30_000);

      bot.messagesSent++;
    }
}