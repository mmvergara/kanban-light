import { Database } from "./supabase-raw-types";

export type ProjectsTable = Database["public"]["Tables"]["projects"]["Row"];
export type BoardsTable = Database["public"]["Tables"]["boards"]["Row"];
export type TasksTable = Database["public"]["Tables"]["tasks"]["Row"];
