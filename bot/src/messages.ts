import { EmbedBuilder, MessageFlags } from "discord.js";

export const errorEmbedReply = (title: string, description?: string, ephemeral: boolean = true) => {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description || null)
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

export const tableEmbedReply = (
  data: { [columnName: string]: string[] }[],
  title: string,
  description?: string,
  ephemeral: boolean = true
) => {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description || null)
    .setColor("Aqua");

  let colI = 0;
  for (const row of data) {
    for (const [columnName, values] of Object.entries(row)) {
      embed.addFields({
        name: `${colI + 1}. ${columnName}   `,
        value: values.map((t, i) => `${i}. ${t}   `).join("\n"),
        inline: true
      });
      colI++;
    }
  }

  console.log("Table embed", embed.toJSON());

  return {
    embeds: [embed],
    options: {
      flags: ephemeral ? MessageFlags.Ephemeral : undefined
    }
  };
};
