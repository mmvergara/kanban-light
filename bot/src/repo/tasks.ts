import { supabase } from "../supabase";
import type { UserID } from "./users";

export const addTask = async ({
  taskName,
  realColumnOrder,
  ownerId,
  projectId,
}: {
  taskName: string;
  realColumnOrder: number;
  ownerId: UserID;
  projectId: string;
}) => {
  console.log("Adding task", taskName, realColumnOrder, ownerId, projectId);
  const { data: col, error: colErr } = await supabase
    .from("columns")
    .select("id")
    .eq('"order"', realColumnOrder)
    .eq("project_id", projectId)
    .single();

  if (colErr) {
    console.error("Error fetching column", colErr);
    return {
      error: "Something wen't wrong fetching the column, does it still exist?",
    };
  }
  if (!col) {
    return { error: "Column not found" };
  }

  const { data: lastTaskOrder, error } = await supabase
    .from("tasks")
    .select("order")
    .eq("owner_id", ownerId)
    .eq("column_id", col.id)
    .order("order", { ascending: false })
    .limit(1)
    .single();
  if (error) {
    console.log("Error fetching last task order", error);
    if (error.code !== "PGRST116") {
      return {
        error: "Failed to fetch last task order, does this column exist?",
      };
    }
  }

  const { error: insertErr } = await supabase.from("tasks").insert({
    name: taskName,
    column_id: col.id,
    owner_id: ownerId,
    order: (lastTaskOrder?.order ?? -1) + 1,
  });

  if (insertErr) {
    console.error("Error inserting task", insertErr);
    return { error: "Failed to insert task" };
  }
};
