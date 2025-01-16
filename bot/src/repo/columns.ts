import type { User } from "discord.js";
import type { UserID } from "./users";
import { supabase } from "../supabase";

export const addColumn = async ({ colName, ownerId, projectId }: {
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

addColumn({
  colName: "To Do",
  projectId: "52b3a86f-e153-4b2c-9fd2-c9df3d758140",
  ownerId: "7f9216e7-bb40-4cf8-bf60-6f45c9957664" as UserID,
});
