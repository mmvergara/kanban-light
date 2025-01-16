import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { errorEmbedReply, infoEmbedReply } from "../../messages";
import { createProject } from "../../repo/projects";
import { checkBinding, type UserID } from "../../repo/users";

export const data = new SlashCommandBuilder()
  .setName("create-project")
  .setDescription("Create a new project")
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("The name of the project")
      .setRequired(true)
  );

export const execute = async (
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  const projectName = interaction.options.getString("name")!;

  const binding = await checkBinding(interaction);
  if (!binding) {
    return;
  }

  const userId = binding.owner_id as UserID;

  const res = await createProject(userId, projectName);
  if (res?.error) {
    await interaction.reply(errorEmbedReply(res.error));
    return;
  }

  await interaction.reply(infoEmbedReply("Project added successfully"));
};
