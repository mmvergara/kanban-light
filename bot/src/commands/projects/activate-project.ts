import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { errorEmbedReply, infoEmbedReply } from "../../messages";
import { activateProject } from "../../repo/projects";
import { checkBinding, type UserID } from "../../repo/users";
import { projectNameValidate } from "../../utils/validators";

export const data = new SlashCommandBuilder()
  .setName("activate-project")
  .setDescription(
    "Activate a project this will be the default project for all column operations"
  )
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
    await interaction.reply(errorEmbedReply(valid.error.errors[0].message));
    return;
  }

  const projectName = valid.data;
  const res = await activateProject(binding.owner_id, projectName);
  if (res?.error) {
    await interaction.reply(errorEmbedReply(res.error));
    return;
  }

  await interaction.reply(
    infoEmbedReply(
      `Project ${projectName} is now active`,
      "All column operations will be performed on this project"
    )
  );
};
