import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  type InteractionReplyOptions,
  MessageFlags,
} from "discord.js";
import config from "./config";
import { pingDb } from "./supabase";
import { getCommands } from "./utils/getCommands";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const loadCommands = async () => {
  const commands = await getCommands();
  commands.forEach((command) => {
    console.log("Loaded Command:", command.name);
    client.commands.set(command.name, command.command);
  });
};

const response: InteractionReplyOptions = {
  content: "There was an error while executing this command!",
  flags: MessageFlags.Ephemeral,
};

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  }
  catch (error) {
    console.error("CAUGHT ERROR", error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(response);
    }
    else {
      await interaction.reply(response);
    }
  }
});

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
  pingDb();
  await loadCommands();
});

client.login(config.BOT_TOKEN);
