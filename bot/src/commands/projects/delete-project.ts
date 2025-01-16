import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { errorEmbedReply, infoEmbedReply } from "../../messages";
import { deleteProjectById } from "../../repo/projects";
import { checkBinding } from "../../repo/users";

export const data = new SlashCommandBuilder()
  .setName("delete-project")
  .setDescription("Delete active project");

export const execute = async (
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  const binding = await checkBinding(interaction);
  if (!binding) {
    return;
  }

  const res = await deleteProjectById(binding.owner_id, binding.active_project);
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
