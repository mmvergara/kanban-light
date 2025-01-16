import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  type CacheType,
  EmbedBuilder,
} from "discord.js";
import { getCommands } from "../../utils/getCommands";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("See all available commands");

export const execute = async (
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  const commands = await getCommands();

  const commandList = commands.map((command) => {
    return {
      name: "/" + command.name,
      value: command.description,
    };
  });

  const embed = new EmbedBuilder()
    .setTitle("Available Commands")
    .setDescription("Here are all available commands:")
    .setColor("Aqua")
    .addFields(commandList)
    .setFooter({
      text: "Use /<command> for more details on a specific command.",
    });

  await interaction.reply({ embeds: [embed] });
};
