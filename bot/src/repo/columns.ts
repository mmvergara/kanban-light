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
    console.error("Error fetching last column order", error);
    if (error.code !== "PGRST116") {
      return { error: "Failed to fetch last column order" };
    }
  }

  const { error: insertErr } = await supabase.from("columns").insert({
    name: colName,
    project_id: projectId,
    owner_id: ownerId,
    order: (lastColOrder?.order ?? -1) + 1,
  });
  if (insertErr) {
    console.error("Error inserting column", insertErr);
    return { error: "Failed to insert column" };
  }
};
