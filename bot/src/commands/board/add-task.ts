import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { z } from "zod";
import { errorEmbedReply, successEmbedReply } from "../../messages";
import { checkBinding, type UserID } from "../../repo/users";
import { columnOrderValidate, taskNameValidate } from "../../utils/validators";
import { addTask } from "../../repo/tasks";

const addTaskSchema = z.object({
  columnNumber: columnOrderValidate,
  taskName: taskNameValidate,
});

export const data = new SlashCommandBuilder()
  .setName("add-task")
  .setDescription("Add a task using column number")
  .addNumberOption((option) =>
    option
      .setName("column-number")
      .setDescription("Column number to add the task to")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("task-name").setDescription("Task name").setRequired(true)
  );

export const execute = async (
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  const binding = await checkBinding(interaction);
  if (!binding) {
    return;
  }

  const { data, success, error } = addTaskSchema.safeParse({
    columnNumber: interaction.options.getNumber("column-number"),
    taskName: interaction.options.getString("task-name"),
  });
  if (success) {
    const res = await addTask({
      realColumnOrder: data.columnNumber - 1,
      ownerId: binding.owner_id as UserID,
      projectId: binding.active_project,
      taskName: data.taskName,
    });
    if (res) {
      return await interaction.reply(errorEmbedReply(res.error));
    }
    await interaction.reply(successEmbedReply("Task added successfully"));
  } else {
    return await interaction.reply(errorEmbedReply("Invalid input"));
  }
};
