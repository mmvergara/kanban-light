import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { errorEmbedReply, infoEmbedReply } from "../../messages";
import { getProjectsByUserId } from "../../repo/projects";
import { checkBinding } from "../../repo/users";

export const data = new SlashCommandBuilder()
  .setName("list-projects")
  .setDescription("List all projects");

export const execute = async (
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  const binding = await checkBinding(interaction);
  if (!binding) {
    return;
  }
  const { projects, error: projectsError } = await getProjectsByUserId(
    binding.owner_id
  );
  if (projectsError) {
    await interaction.reply(errorEmbedReply(projectsError));
    return;
  }

  if (projects) {
    if (projects.length === 0) {
      await interaction.reply(infoEmbedReply("You don't have any projects"));
      return;
    }

    const projectsStr = projects
      .map((project) => {
        return `• **${project.name}**${project.id === binding.active_project ? " (Active)" : ""}`;
      })
      .join("\n");

    await interaction.reply(infoEmbedReply("Your Projects:", projectsStr));
    return;
  }

  await interaction.reply(
    errorEmbedReply("An error occurred while fetching your projects")
  );
};
