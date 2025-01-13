import { type CacheType, type ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { z } from "zod";
import { errorEmbedReply, successEmbedReply } from "../../messages";
import { bindDiscordUser } from "../../repo/users";

export const data = new SlashCommandBuilder()
  .setName("bind")
  .setDescription("Bind your account to the bot using a binding key")
  .addStringOption(option => option.setName("key").setDescription("The binding key you received from the bot").setRequired(true));

export const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const key = interaction.options.getString("key");
  const valid = z.string().uuid().safeParse(key);
  if (!valid.success) {
    await interaction.reply(errorEmbedReply("The binding key you provided is invalid"));
    return;
  }

  if (valid.data) {
    const binded = await bindDiscordUser(interaction.user.id, valid.data);
    if (binded) {
      await interaction.reply(successEmbedReply("Your account has been successfully binded"));
      return;
    }
  }

  await interaction.reply(errorEmbedReply("There was an error while binding your account"));
};
