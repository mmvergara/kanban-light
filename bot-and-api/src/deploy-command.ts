import { REST, Routes } from "discord.js";
import config from "./config";
import { getCommands } from "./utils/getCommands";

const rest = new REST({ version: "10" }).setToken(config.BOT_TOKEN);
const deployCommands = async () => {
  const commands = await getCommands();
  const commandDatas = commands.map(command => command.dataJson);
  console.log(commandDatas);
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    const data = await rest.put(Routes.applicationCommands(config.BOT_APPLICATION_ID), { body: commandDatas }) as [];
    console.log(`Successfully reloaded ${data.length} application (/) commanads.`);
  }
  catch (error) {
    console.error(error);
  }
};

deployCommands();
