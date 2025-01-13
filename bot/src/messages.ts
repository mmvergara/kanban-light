import { EmbedBuilder, MessageFlags } from "discord.js";

export const errorEmbedReply = (errorMsg: string, ephemeral: boolean = true) => {
  const embed = new EmbedBuilder()
    .setTitle("Error")
    .setDescription(errorMsg)
    .setColor("Red");

  return {
    embeds: [embed],
    options: {
      flags: ephemeral ? MessageFlags.Ephemeral : undefined
    }
  };
};

export const successEmbedReply = (successMsg: string, ephemeral: boolean = true) => {
  const embed = new EmbedBuilder()
    .setTitle(successMsg)
    .setColor("Green");
  return {
    embeds: [embed],
    options: {
      flags: ephemeral ? MessageFlags.Ephemeral : undefined
    }
  };
};

export const infoEmbedReply = (title: string, description?: string, ephemeral: boolean = true) => {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description || null)
    .setColor("Blue");
  return {
    embeds: [embed],
    options: {
      flags: ephemeral ? MessageFlags.Ephemeral : undefined
    }
  };
};
