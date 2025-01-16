import type { Board } from "../utils/types";
import type { UserID } from "./users";
import { z } from "zod";
import { supabase } from "../supabase";
import {
  EmbedBuilder,
  MessageFlags,
  type InteractionReplyOptions,
} from "discord.js";

export const getProjectsByUserId = async (userId: UserID) => {
  const { data, error } = await supabase
    .from("projects")
    .select("name,id")
    .eq("owner_id", userId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    return { error: "An error occurred while fetching your projects" } as const;
  }

  return { projects: data } as const;
};

export const activateProject = async (userId: UserID, name: string) => {
  const valid = z.string().min(3).max(50).safeParse(name);
  if (!valid.success) {
    return {
      error: "The project name must be between 3 and 50 characters",
    } as const;
  }

  const { data: project, error } = await supabase
    .from("projects")
    .select("id")
    .eq("owner_id", userId)
    .eq("name", valid.data)
    .single();
  if (error) {
    console.log("Error in activate Project", error);
    if (error.code === "PGRST116") {
      return { error: "The project does not exist" } as const;
    }
    return { error: "An error occurred while activating the project" } as const;
  }

  const res = await supabase
    .from("binding")
    .update({ active_project: project.id })
    .eq("owner_id", userId);

  if (res.error) {
    console.log("Error in activate Project", res.error);
    return { error: "An error occurred while activating the project" } as const;
  }
};

export const createProject = async (userId: UserID, name: string) => {
  const valid = z.string().min(3).max(50).safeParse(name);
  if (!valid.success) {
    return {
      error: "The project name must be between 3 and 50 characters",
    } as const;
  }

  const { error } = await supabase.from("projects").insert({
    owner_id: userId,
    name: valid.data,
  });

  if (error) {
    return { error: "An error occurred while creating the project" } as const;
  }
};

export const deleteProjectById = async (userId: UserID, projectId: string) => {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("owner_id", userId)
    .eq("id", projectId);

  if (error) {
    console.log("Error deleting project", error);
    return { error: "An error occurred while deleting the project" } as const;
  }
};

export const getProjectColumnsWithTasks = async (projectId: string) => {
  const { data: columns, error } = await supabase
    .from("columns")
    .select("id, name,order, tasks(name, order)")
    .eq("project_id", projectId)
    .order("order", {
      ascending: true,
    });

  if (error) {
    console.log("Error in getProjectColumnsWithTasks", error);
    return { error: "An error occurred while fetching the columns" } as const;
  }

  const board: Board = columns.map((column) => {
    return {
      [`${column.order}. ${column.name}`]: column.tasks
        .sort((a, b) => a.order - b.order)
        .map((task) => `**${task.order}.** ${task.name}`),
    };
  });

  return { board } as const;
};
