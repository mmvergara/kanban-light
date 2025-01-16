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

export const tableEmbedReply = (
  data: { [columnName: string]: string[] }[],
  title: string,
  description?: string,
  ephemeral: boolean = true
): InteractionReplyOptions => {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description || null)
    .setColor("Aqua");

  let colI = 0;
  for (const row of data) {
    for (const [columnName, values] of Object.entries(row)) {
      const taskList =
        values.length > 0
          ? values.map((t, i) => `${i + 1}. ${t}`).join("\n")
          : "No tasks available";

      embed.addFields({
        name: `${colI + 1}. ${columnName}`,
        value: taskList,
        inline: true,
      });
      colI++;
    }
  }

  console.log("Table embed", embed.toJSON());

  return {
    embeds: [embed],
    flags: ephemeral ? MessageFlags.Ephemeral : undefined,
  };
};
