import { supabase } from "../supabase";

export const getUserIdByBindingKey = async (bindingKey: string) => {
  const { data, error } = await supabase.from("binding_keys").select("owner_id").eq("key", bindingKey).single();
  if (error) {
    return null;
  }
  return data.owner_id;
};
