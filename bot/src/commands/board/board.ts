import {
  type CacheType,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  type InteractionReplyOptions,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { errorEmbedReply, infoEmbedReply } from "../../messages";
import { getProjectColumnsWithTasks } from "../../repo/projects";
import { checkBinding } from "../../repo/users";
export type Board = { [columnName: string]: string[] }[];

export const data = new SlashCommandBuilder()
  .setName("board")
  .setDescription("Show the board of the active project");

export const execute = async (
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  const binding = await checkBinding(interaction);
  if (!binding) {
    return;
  }

  const { board, error } = await getProjectColumnsWithTasks(
    binding.active_project
  );
  if (error) {
    return await interaction.reply(
      errorEmbedReply("An error occurred while fetching the board data")
    );
  }

  return await interaction.reply(
    tableEmbedReply(board, "Board", "The board of the active project", true)
  );
};

const tableEmbedReply = (
  data: { [columnName: string]: string[] }[],
  title: string,
  description?: string,
  ephemeral: boolean = true
): InteractionReplyOptions => {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description || null)
    .setColor("Aqua");
  for (const row of data) {
    for (const [columnName, values] of Object.entries(row)) {
      const taskList =
        values.length > 0 ? values.join("\n") : "No tasks available";
      embed.addFields({
        name: columnName,
        value: taskList,
        inline: true,
      });
    }
  }
  return {
    embeds: [embed],
    flags: ephemeral ? MessageFlags.Ephemeral : undefined,
  };
};
