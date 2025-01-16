import { type CacheType, type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { errorEmbedReply, infoEmbedReply, } from "../../messages";
import { getProjectsByUserId } from "../../repo/projects";
import { getBindingByDiscordUserId, type UserID } from "../../repo/users";

export const data = new SlashCommandBuilder().setName("list-columns").setDescription("List all columns");

export const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const discordUserId = interaction.user.id;
  const { binding, error } = await getBindingByDiscordUserId(discordUserId);
  if (error) {
    await interaction.reply(errorEmbedReply(error));
    return;
  }
  const userId = binding.owner_id as UserID;

  const { projects, error: projectsError } = await getProjectsByUserId(userId);
  if (projectsError) {
    await interaction.reply(errorEmbedReply(projectsError));
    return;
  }

  if (projects) {
    if (projects.length === 0) {
      await interaction.reply(infoEmbedReply("You don't have any projects"));
      return;
    }
    const projectsStr = projects.map((project) => {
      return `${project.name}${project.id === binding.active_project ? "<- Active" : ""}`;
    }).join("\n");
    await interaction.reply(infoEmbedReply("Projects:", projectsStr));
    return;
  }

  await interaction.reply(errorEmbedReply("An error occurred while fetching your projects"));
};
