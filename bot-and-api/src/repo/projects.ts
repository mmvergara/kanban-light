import { supabase } from "../supabase";

export const getProjectsByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return null;
  }

  return data;
};

export const deleteProjectById = async (projectId: string, userId: string) => {
  const { data, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("owner_id", userId);

  if (error) {
    return null;
  }

  return data;
};

export const createProject = async (userId: string, name: string) => {
  const { data, error } = await supabase
    .from("projects")
    .insert({ owner_id: userId, name });

  if (error) {
    return null;
  }

  return data;
};
