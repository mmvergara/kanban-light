import {
  type CacheType,
  type ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { successEmbedReply } from "../../messages";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export const execute = async (
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  await interaction.reply(successEmbedReply("Pong!"));
};
