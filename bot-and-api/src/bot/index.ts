import fs from "node:fs";
import path from "node:path";
import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  type InteractionReplyOptions,
  MessageFlags,
} from "discord.js";

declare module "discord.js" {
  export interface Client {
    commands: Collection<
      string,
      {
        data: import("discord.js").SlashCommandBuilder;
        execute: (
          interaction: import("discord.js").ChatInputCommandInteraction
        ) => Promise<void>;
      }
    >;
  }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const loadCommands = async () => {
  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  const clientLoadedCommands: string[] = [];
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter(file => file.endsWith(".ts"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(filePath);

      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
        clientLoadedCommands.push(command.data.name);
      }
      else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }

  console.log(`Loaded ${clientLoadedCommands.length} commands: ${clientLoadedCommands.join(", ")}`);
};

client.on(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

const response = {
  content: "There was an error while executing this command!",
  flags: MessageFlags.Ephemeral,
} as InteractionReplyOptions;

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

// Load commands when the client is ready
client.once(Events.ClientReady, async () => {
  await loadCommands();
});

export default client;
