import type { UserID } from "./users";
import { supabase } from "../supabase";

export const addColumn = async ({
  colName,
  ownerId,
  projectId,
}: {
  colName: string;
  projectId: string;
  ownerId: UserID;
}) => {
  const { data: lastColOrder, error } = await supabase
    .from("columns")
    .select("order")
    .eq("project_id", projectId)
    .order("order", { ascending: false })
    .limit(1)
    .single();
  if (error) {
    if (error.code !== "PGRST116") {
      return {
        error:
          "Failed to fetch last column order, does the project still exist?",
      };
    }
  }

  const { error: insertErr } = await supabase.from("columns").insert({
    name: colName,
    project_id: projectId,
    owner_id: ownerId,
    order: (lastColOrder?.order ?? -1) + 1,
  });
  if (insertErr) {
    return { error: "Failed to insert column, does the project still exist?" };
  }
};

export const deleteColumn = async ({
  columnNumber,
  ownerId,
  projectId,
}: {
  columnNumber: number;
  projectId: string;
  ownerId: UserID;
}) => {
  const { data: columnToDelete, error } = await supabase
    .from("columns")
    .select("id")
    .eq("owner_id", ownerId)
    .eq("project_id", projectId)
    .eq('"order"', columnNumber - 1)
    .single();
  if (error) {
    console.error("Error fetching column to delete", error);
    return { error: "Failed to fetch column to delete" };
  }

  if (!columnToDelete) {
    return { error: "Column not found" };
  }

  const { error: deleteErr } = await supabase
    .from("columns")
    .delete()
    .eq("id", columnToDelete.id);
  if (deleteErr) {
    console.error("Error deleting column", deleteErr);
    return { error: "Failed to delete column" };
  }
};
