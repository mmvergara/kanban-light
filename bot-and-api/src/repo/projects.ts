import type { UserID } from "./users";
import { z } from "zod";
import { supabase } from "../supabase";

export const getProjectsByUserId = async (userId: UserID) => {
  const { data, error } = await supabase
    .from("projects")
    .select("name")
    .eq("owner_id", userId)
    .order("created_at", {
      ascending: true
    });

  if (error) {
    return { error: "An error occurred while fetching your projects" } as const;
  }

  return { projects: data.map(project => project.name) } as const;
};

export const createProject = async (userId: UserID, name: string) => {
  const valid = z.string().min(3).max(50).safeParse(name);
  if (!valid.success) {
    return { error: "The project name must be between 3 and 50 characters" } as const;
  }

  const { error } = await supabase
    .from("projects")
    .insert({
      owner_id: userId,
      name: valid.data
    });

  if (error) {
    return { error: "An error occurred while creating the project" } as const;
  }
};

export const deleteProjectByName = async (userId: UserID, name: string) => {
  const valid = z.string().min(3).max(50).safeParse(name);
  if (!valid.success) {
    return { error: "The project name must be between 3 and 50 characters" } as const;
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("owner_id", userId)
    .eq("name", valid.data);

  if (error) {
    return { error: "An error occurred while deleting the project" } as const;
  }
};
