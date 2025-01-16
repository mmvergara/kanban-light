import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { errorEmbedReply, successEmbedReply } from "../../messages";
import { addColumn } from "../../repo/columns";
import {
  checkBinding,
  type UserID,
} from "../../repo/users";
import { columnNameValidate } from "../../utils/validators";

export const data = new SlashCommandBuilder()
  .setName("add-column")
  .setDescription("Add a column to the active project")
  .addStringOption((option) =>
    option
      .setName("column-name")
      .setDescription("Column name")
      .setRequired(true)
  );

export const execute = async (
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  console.log("add-column command executed");

  const binding = await checkBinding(interaction);
  if (!binding) {
    return;
  }

  const { data, error } = columnNameValidate.safeParse(
    interaction.options.getString("column-name")
  );
  if (error) {
    return await interaction.reply(errorEmbedReply(error.errors[0].message));
  }

  const res = await addColumn({
    colName: data,
    projectId: binding.active_project,
    ownerId: binding.owner_id as UserID,
  });

  if (res) {
    return await interaction.reply(errorEmbedReply(res.error));
  }

  return await interaction.reply(
    successEmbedReply(`Column ${data} added successfully to the project`)
  );
};
