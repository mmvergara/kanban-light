import { Database } from "./supabase-raw-types";

export type ProjectsTable = Database["public"]["Tables"]["projects"]["Row"];
export type BoardsTable = Database["public"]["Tables"]["boards"]["Row"];
export type TasksTable = Database["public"]["Tables"]["tasks"]["Row"];

export type BoardWithTasks = {
  created_at: string;
  id: string;
  name: string;
  order: number;
  owner_id: string;
  project_id: string;
  tasks: TasksTable[];
};

export type KanbanBoard = {
  created_at: string;
  id: string;
  name: string;
  order: number;
  owner: string;
  boards: BoardWithTasks[];
};

export const dummyKanbanBoard: KanbanBoard = {
  created_at: "2024-01-01T00:00:00Z",
  id: "kanban_board_1",
  name: "Main Kanban Board",
  order: 1,
  owner: "user_1",
  boards: [
    {
      created_at: "2024-01-01T00:00:00Z",
      id: "board_1",
      name: "To Do",
      order: 1,
      owner_id: "user_1",
      project_id: "project_1",
      tasks: [
        {
          board_id: "board_1",
          created_at: "2024-01-01T00:00:00Z",
          id: "task_1_1",
          name: "Task 1.1",
          order: 1,
          owner_id: "user_1",
        },
        {
          board_id: "board_1",
          created_at: "2024-01-01T00:00:00Z",
          id: "task_1_2",
          name: "Task 1.2",
          order: 2,
          owner_id: "user_2",
        },
        {
          board_id: "board_1",
          created_at: "2024-01-01T00:00:00Z",
          id: "task_1_3",
          name: "Task 1.3",
          order: 3,
          owner_id: "user_3",
        },
      ],
    },
    {
      created_at: "2024-01-01T00:00:00Z",
      id: "board_2",
      name: "In Progress",
      order: 2,
      owner_id: "user_1",
      project_id: "project_1",
      tasks: [
        {
          board_id: "board_2",
          created_at: "2024-01-01T00:00:00Z",
          id: "task_2_1",
          name: "Task 2.1",
          order: 1,
          owner_id: "user_1",
        },
        {
          board_id: "board_2",
          created_at: "2024-01-01T00:00:00Z",
          id: "task_2_2",
          name: "Task 2.2",
          order: 2,
          owner_id: "user_2",
        },
        {
          board_id: "board_2",
          created_at: "2024-01-01T00:00:00Z",
          id: "task_2_3",
          name: "Task 2.3",
          order: 3,
          owner_id: "user_3",
        },
      ],
    },
    {
      created_at: "2024-01-01T00:00:00Z",
      id: "board_3",
      name: "Done",
      order: 3,
      owner_id: "user_1",
      project_id: "project_1",
      tasks: [
        {
          board_id: "board_3",
          created_at: "2024-01-01T00:00:00Z",
          id: "task_3_1",
          name: "Task 3.1",
          order: 1,
          owner_id: "user_1",
        },
        {
          board_id: "board_3",
          created_at: "2024-01-01T00:00:00Z",
          id: "task_3_2",
          name: "Task 3.2",
          order: 2,
          owner_id: "user_2",
        },
        {
          board_id: "board_3",
          created_at: "2024-01-01T00:00:00Z",
          id: "task_3_3",
          name: "Task 3.3",
          order: 3,
          owner_id: "user_3",
        },
      ],
    },
  ],
};
