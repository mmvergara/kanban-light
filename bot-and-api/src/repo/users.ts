import { supabase } from "../supabase";

export type UserID = string & { readonly brand: unique symbol };

export const getUserIdByDiscordUserId = async (discordUserId: string) => {
  const { data, error } = await supabase
    .from("binding")
    .select("owner_id")
    .eq("discord_user_id", Number.parseInt(discordUserId))
    .single();

  if (error || !data) {
    if (error.code === "PGRST116") {
      return { error: "You are not binded to an account, use /bind command to bind" } as const; ;
    }
    return { error: "An error occurred while fetching your projects" } as const; ;
  }
  return { userId: data.owner_id as UserID } as const;
};

export const bindDiscordUser = async (discordUserId: string, bindingKey: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("binding")
      .update({ discord_user_id: Number.parseInt(discordUserId) })
      .eq("key", bindingKey);

    return !error;
  }
  catch {
    return false;
  }
};
