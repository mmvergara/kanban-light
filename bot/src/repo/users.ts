import type { CacheType, ChatInputCommandInteraction } from "discord.js";
import { errorEmbedReply } from "../messages";
import { supabase } from "../supabase";

export type UserID = string & { readonly brand: unique symbol };

export const checkBinding = async (
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  const discordUserId = interaction.user.id;
  const { data, error } = await supabase
    .from("binding")
    .select("owner_id, discord_user_id, active_project")
    .eq("discord_user_id", Number.parseInt(discordUserId))
    .single();

  if (error || !data) {
    if (error.code === "PGRST116") {
      await interaction.reply(
        errorEmbedReply(
          "You are not binded to an account, use /bind command to bind"
        )
      );
    } else {
      await interaction.reply(
        errorEmbedReply("An error occurred while fetching your projects")
      );
    }
    return null;
  }

  if (!data.active_project) {
    await interaction.reply(
      errorEmbedReply(
        "No active project found, use /activate-project to activate a project"
      )
    );
    return null;
  }

  const verifiedBinding = data as {
    owner_id: UserID;
    active_project: string;
    discord_user_id: number;
  };

  return verifiedBinding;
};

export const bindDiscordUser = async (
  discordUserId: string,
  bindingKey: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("binding")
      .update({ discord_user_id: Number.parseInt(discordUserId) })
      .eq("key", bindingKey);

    return !error;
  } catch {
    return false;
  }
};
