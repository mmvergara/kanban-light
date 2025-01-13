import { type CacheType, type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { errorEmbedReply, infoEmbedReply, } from "../../messages";
import { getProjectsByUserId } from "../../repo/projects";
import { getUserIdByDiscordUserId } from "../../repo/users";

export const data = new SlashCommandBuilder().setName("list-projects").setDescription("List all projects");

export const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const discordUserId = interaction.user.id;
  const { userId, error } = await getUserIdByDiscordUserId(discordUserId);
  if (error) {
    await interaction.reply(errorEmbedReply(error));
    return;
  }

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
    await interaction.reply(infoEmbedReply("Projects:", projects.join("\n")));
    return;
  }

  await interaction.reply(errorEmbedReply("An error occurred while fetching your projects"));
};
