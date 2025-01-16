import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import {
  errorEmbedReply,
  infoEmbedReply,
  tableEmbedReply,
} from "../../messages";
import { getProjectColumnsWithTasks } from "../../repo/projects";
import { getBindingByDiscordUserId } from "../../repo/users";

export const data = new SlashCommandBuilder()
  .setName("board")
  .setDescription("Show the board of the active project");

export const execute = async (
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  const { binding, error: bindErr } = await getBindingByDiscordUserId(
    interaction.user.id
  );
  if (bindErr) {
    return await interaction.reply(
      errorEmbedReply("An error occurred while fetching your active project")
    );
  }

  if (!binding.active_project) {
    return await interaction.reply(
      infoEmbedReply("You don't have an active project")
    );
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
