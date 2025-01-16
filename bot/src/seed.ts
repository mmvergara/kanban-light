import { v4 as uuid } from "uuid";
import { supabase } from "./supabase";

export const seed = async () => {
  const userId = "7f9216e7-bb40-4cf8-bf60-6f45c9957664";
  const projectId = "0ac9c202-83d5-4b6e-b8af-5bed0686f101";

  const col1Id = uuid();
  const col2Id = uuid();
  const col3Id = uuid();
  const col4Id = uuid();
  const col5Id = uuid();

  await supabase.from("columns").insert([
    { id: col1Id, name: "Backlog", project_id: projectId, order: 0, owner_id: userId },
    { id: col2Id, name: "In Progress", project_id: projectId, order: 1, owner_id: userId },
    { id: col3Id, name: "Review", project_id: projectId, order: 2, owner_id: userId },
    { id: col4Id, name: "Testing", project_id: projectId, order: 3, owner_id: userId },
    { id: col5Id, name: "Completed", project_id: projectId, order: 4, owner_id: userId },
  ]);

  await supabase.from("tasks").insert([
    { id: uuid(), name: "Define project scope", column_id: col1Id, order: 0, owner_id: userId },
    { id: uuid(), name: "Gather requirements", column_id: col1Id, order: 1, owner_id: userId },
    { id: uuid(), name: "Create wireframes", column_id: col1Id, order: 2, owner_id: userId },
    { id: uuid(), name: "Develop initial prototype", column_id: col1Id, order: 3, owner_id: userId },
    { id: uuid(), name: "Conduct stakeholder review", column_id: col1Id, order: 4, owner_id: userId },
    { id: uuid(), name: "Implement user feedback", column_id: col2Id, order: 0, owner_id: userId },
    { id: uuid(), name: "Set up database", column_id: col2Id, order: 1, owner_id: userId },
    { id: uuid(), name: "Develop API endpoints", column_id: col2Id, order: 2, owner_id: userId },
    { id: uuid(), name: "Create frontend components", column_id: col2Id, order: 3, owner_id: userId },
    { id: uuid(), name: "Integrate frontend", column_id: col2Id, order: 4, owner_id: userId },
    { id: uuid(), name: "Code review", column_id: col3Id, order: 0, owner_id: userId },
    { id: uuid(), name: "UI/UX review", column_id: col3Id, order: 1, owner_id: userId },
    { id: uuid(), name: "Prepare for testing", column_id: col3Id, order: 2, owner_id: userId },
    { id: uuid(), name: "Conduct user testing", column_id: col3Id, order: 3, owner_id: userId },
    { id: uuid(), name: "Gather testing feedback", column_id: col3Id, order: 4, owner_id: userId },
    { id: uuid(), name: "Fix bugs", column_id: col4Id, order: 0, owner_id: userId },
    { id: uuid(), name: "Optimize performance", column_id: col4Id, order: 1, owner_id: userId },
    { id: uuid(), name: "Prepare deployment", column_id: col4Id, order: 2, owner_id: userId },
    { id: uuid(), name: "Deploy to production", column_id: col4Id, order: 3, owner_id: userId },
    { id: uuid(), name: "Post-deployment review", column_id: col4Id, order: 4, owner_id: userId },
    { id: uuid(), name: "Document project", column_id: col5Id, order: 0, owner_id: userId },
    { id: uuid(), name: "Conduct retrospective", column_id: col5Id, order: 1, owner_id: userId },
    { id: uuid(), name: "Celebrate success", column_id: col5Id, order: 2, owner_id: userId },
    { id: uuid(), name: "Plan next steps", column_id: col5Id, order: 3, owner_id: userId },
    { id: uuid(), name: "Archive project materials", column_id: col5Id, order: 4, owner_id: userId },
  ]);
};

seed();
