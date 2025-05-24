# RubyBot 2.0
written by freesmart#twoblade.com [123 IQ] (that's only because of the brainrot!!!)

# Modularity
index.ts is literally imports, two variable definitions, and 1 socket event

the absolute girth of code goes to the commands!

# Feature Requests
please sharp either:
* freesmart#twoblade.com
* or rubybot#twoblade.com

# Running Locally
**PLEASE PLEASE PLEASE DO NOT IMPERSONATE AS RUBYBOT!!!! THE SOURCE CODE IS UP FOR LEARNING AND STUFF!!!**

Here's what you'll need:
## Geting rubyAI
rubyAI is powered by the Gemini API

Go to the Google AI Studio and grab an API key

## sudo admins
Change the admins definition in [sudo.ts](commands/sudo.ts)!!!


## Running

This bot requires Deno, this was written in Deno 2.3.3

To set up rubybot, run the following:
```bash
$ deno run --allow-read --allow-write --allow-net init.ts
```
Follow the prompts.
**THIS WILL ASK YOU FOR YOUR USERNAME AND PASSWORD, THAT WILL BE SAVED IN JSON FORMAT IN loginInfo.json. DON'T SEND IT SOMEWHERE YOU DONT TRUST.**

To actually run RubyBot, run the following command:
```bash
$ deno run --allow-net --allow-env --allow-read --allow-write --allow-run index.ts
```