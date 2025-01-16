import {
  EmbedBuilder,
  MessageFlags,
  type InteractionReplyOptions,
} from "discord.js";

export const errorEmbedReply = (
  title: string,
  description?: string,
  ephemeral: boolean = true
): InteractionReplyOptions => {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description || null)
    .setColor("Red");

  return {
    embeds: [embed],
    flags: ephemeral ? MessageFlags.Ephemeral : undefined,
  };
};

export const successEmbedReply = (
  successMsg: string,
  ephemeral: boolean = true
): InteractionReplyOptions => {
  const embed = new EmbedBuilder().setTitle(successMsg).setColor("Green");
  return {
    embeds: [embed],
    flags: ephemeral ? MessageFlags.Ephemeral : undefined,
  };
};

export const infoEmbedReply = (
  title: string,
  description?: string,
  ephemeral: boolean = true
): InteractionReplyOptions => {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description || null)
    .setColor("Blue");
  return {
    embeds: [embed],
    flags: ephemeral ? MessageFlags.Ephemeral : undefined,
  };
};
