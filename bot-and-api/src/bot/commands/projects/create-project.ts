import { type CacheType, type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { createProject } from "../../../repo/projects";
import { getUserIdByDiscordUserId } from "../../../repo/users";
import { errorEmbedReply, infoEmbedReply } from "../../messages";

export const data = new SlashCommandBuilder()
  .setName("create-project")
  .setDescription("Create a new project")
  .addStringOption(option => option.setName("name").setDescription("The name of the project").setRequired(true));

export const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const discordUserId = interaction.user.id;
  const projectName = interaction.options.getString("name")!;

  const { userId, error } = await getUserIdByDiscordUserId(discordUserId);
  if (error) {
    await interaction.reply(errorEmbedReply(error));
    return;
  }

  const res = await createProject(userId, projectName);
  if (res?.error) {
    await interaction.reply(errorEmbedReply(res.error));
    return;
  }

  await interaction.reply(infoEmbedReply("Project added successfully"));
};
