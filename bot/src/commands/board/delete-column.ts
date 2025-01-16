import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { errorEmbedReply, successEmbedReply } from "../../messages";
import { getBindingByDiscordUserId, type UserID } from "../../repo/users";
import { columnOrderValidate } from "../../utils/validators";
import { deleteColumn } from "../../repo/columns";

export const data = new SlashCommandBuilder()
  .setName("delete-column")
  .setDescription("Delete column using column number")
  .addNumberOption((option) =>
    option
      .setName("column-number")
      .setDescription("Column number to add the task to")
      .setRequired(true)
  );

export const execute = async (
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  const { binding, error: bindErr } = await getBindingByDiscordUserId(
    interaction.user.id
  );
  if (bindErr) {
    return await interaction.reply(
      errorEmbedReply("An error occured while adding the task")
    );
  }

  if (!binding.active_project) {
    return await interaction.reply(
      errorEmbedReply(
        "You need to set an active project first, use /active-project"
      )
    );
  }

  const valid = columnOrderValidate.safeParse(
    interaction.options.getNumber("column-number")
  );

  if (valid.success) {
    const res = await deleteColumn({
      columnNumber: valid.data,
      ownerId: binding.owner_id as UserID,
      projectId: binding.active_project,
    });
    if (res) {
      return await interaction.reply(errorEmbedReply(res.error));
    }
    return await interaction.reply(
      successEmbedReply("Column deleted successfully")
    );
  } else {
    return await interaction.reply(
      errorEmbedReply("Invalid column number, please try again")
    );
  }
};
