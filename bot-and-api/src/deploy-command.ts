import fs from "node:fs";
import path from "node:path";
import { REST, Routes } from "discord.js";
import { BOT_APPLICATION_ID, BOT_TOKEN } from "./config";

const commands: string[] = [];

const foldersPath = path.join(__dirname, "bot", "commands");
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".ts"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    }
    else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property. command not added.`);
    }
  }
}

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);
const deployCommands = async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    const data = await rest.put(Routes.applicationCommands(BOT_APPLICATION_ID), { body: commands });
    console.log(`Successfully reloaded ${JSON.stringify(data)} application (/) commanads.`);
  }
  catch (error) {
    console.error(error);
  }
};

deployCommands();
