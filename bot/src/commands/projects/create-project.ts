import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { errorEmbedReply, infoEmbedReply } from "../../messages";
import { createProject } from "../../repo/projects";
import { checkBinding, type UserID } from "../../repo/users";
import { projectNameValidate } from "../../utils/validators";

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
  const binding = await checkBinding(interaction);
  if (!binding) {
    return;
  }
  const valid = projectNameValidate.safeParse(
    interaction.options.getString("name")
  );
  if (valid.error) {
    return await interaction.reply(errorEmbedReply(valid.error.message));
  }

  const res = await createProject(binding.owner_id, valid.data);
  if (res?.error) {
    await interaction.reply(errorEmbedReply(res.error));
    return;
  }

  await interaction.reply(infoEmbedReply("Project added successfully"));
};
