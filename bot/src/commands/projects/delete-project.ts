import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { errorEmbedReply, infoEmbedReply } from "../../messages";
import { deleteProjectById } from "../../repo/projects";
import { getBindingByDiscordUserId, type UserID } from "../../repo/users";

export const data = new SlashCommandBuilder()
  .setName("delete-project")
  .setDescription("Delete active project");

export const execute = async (
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  const discordUserId = interaction.user.id;

  const { binding, error } = await getBindingByDiscordUserId(discordUserId);
  if (error) {
    await interaction.reply(errorEmbedReply(error));
    return;
  }
  const userId = binding.owner_id as UserID;
  if (!binding.active_project) {
    await interaction.reply(
      errorEmbedReply(
        "No active project found, use /activate-project to activate a project"
      )
    );
    return;
  }
  const res = await deleteProjectById(userId, binding.active_project);
  if (res?.error) {
    await interaction.reply(errorEmbedReply(res.error));
    return;
  }

  await interaction.reply(
    infoEmbedReply(
      "Project deleted successfully",
      "Your active project has been deleted, select a new project with /activate-project"
    )
  );
};
