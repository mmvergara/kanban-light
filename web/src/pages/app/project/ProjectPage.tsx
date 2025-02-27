import { Navigate, useNavigate, useParams } from "react-router-dom";
import supabase from "../../../supabase";
import {
  ColumnTable,
  BoardWithTasks,
  KanbanBoard,
  TasksTable,
} from "../../../supabase/supabase-types";
import { FormEvent, useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { toast } from "react-toastify";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { useSession } from "../../../context/SessionContext";
import { playPopSound } from "../../../utils/soundfx";
import Column from "../../../components/Column";

const reorder = <T,>(list: T[], startIdx: number, endIdx: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIdx, 1);
  result.splice(endIdx, 0, removed);
  return result;
};

const ProjectPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;
  const { user } = useSession();
  const [localColumn, setLocalColumn] = useLocalStorage<KanbanBoard["columns"]>(
    `${projectId}-columns`,
    []
  );
  const [localProjectData, setLocalProjectData] =
    useLocalStorage<KanbanBoard | null>(`${projectId}-projectData`, null);
  const [projectData, setProjectData] = useState<KanbanBoard | null>(
    localProjectData
  );
  const [columns, setColumn] = useState<KanbanBoard["columns"]>(localColumn);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newBoardName, setNewBoardName] = useState<string>("");
  const [projectExists, setProjectExists] = useState<boolean>(true);

  const handleDeleteProject = async () => {
    if (!user) return;
    setIsLoading(true);
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);
    setIsLoading(false);
    if (error) {
      console.error(error);
      toast.error("Failed to delete project");
      return;
    }
    // reload page
    setLocalColumn([]);
    setLocalProjectData(null);
    navigate("/app");
    window.location.reload();
    toast.success("Project deleted successfully");
  };
  const handleAddNewBoard = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (newBoardName.trim() === "") return;
    const newBoard = {
      name: newBoardName,
      order: columns.length,
      owner_id: user?.id,
      project_id: projectId,
    };
    const { data, error } = await supabase
      .from("columns")
      .insert(newBoard)
      .select("*")
      .maybeSingle();
    if (error) {
      console.error(error);
      toast.error("Failed to create column");
      setColumn(columns);
    }
    if (data) {
      const newBoard: BoardWithTasks = { ...data, tasks: [] };
      setColumn([...columns, newBoard]);
    }
    setNewBoardName("");
  };
  const handleDeleteBoard = async (boardId: string) => {
    setColumn((prevColumn) => {
      const newColumn = prevColumn.filter((column) => column.id !== boardId);
      return newColumn;
    });
    playPopSound();
    setIsLoading(true);
    const { error } = await supabase.from("columns").delete().eq("id", boardId);
    setIsLoading(false);
    if (error) {
      console.error(error);
      toast.error("Failed to delete column");
      return;
    }
  };
  const handleAddTask = async (task: TasksTable) => {
    const newColumn = columns.map((column) => {
      if (column.id === task.column_id) {
        if (!column.tasks) {
          column.tasks = [];
        }
        column.tasks.push(task);
      }
      return column;
    });

    setColumn(newColumn);

    setIsLoading(true);
    const { error } = await supabase
      .from("tasks")
      .insert(task)
      .select("*")
      .maybeSingle();
    setIsLoading(false);
    if (error) {
      console.error(error);
      toast.error("Failed to create task");
      setColumn(columns);
    }
  };
  const handleGetProjectData = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*,columns(*,tasks(*))")
      .eq("id", projectId);
    setIsLoading(false);
    if (error) {
      setProjectExists(false);
      return;
    }
    if (data && data.length == 1) {
      const projectData = data[0] as KanbanBoard;
      setColumn(projectData.columns);
      setProjectData(projectData);
    }
  };
  const handleUpdateColumn = async (column: ColumnTable[]) => {
    setIsLoading(true);
    const { error } = await supabase.from("columns").upsert(column);
    if (error) {
      console.error(error);
      toast.error("Failed to update columns");
      setColumn(columns);
    }
    setIsLoading(false);
  };
  const handleUpdateTasks = async (tasks: TasksTable[]) => {
    setIsLoading(true);
    const { error } = await supabase.from("tasks").upsert(tasks);
    if (error) {
      console.error(error);
      toast.error("Failed to update tasks");
      setColumn(columns);
      setIsLoading(false);
    }
    setIsLoading(false);
  };
  const handleDeleteTask = async (taskId: string) => {
    playPopSound();
    setColumn((prevColumn) => {
      const newColumn = prevColumn.map((column) => {
        if (!column.tasks) return column;
        const newTasks = column.tasks.filter((task) => task.id !== taskId);
        return { ...column, tasks: newTasks };
      });
      return newColumn;
    });

    setIsLoading(true);
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    setIsLoading(false);
    if (error) {
      console.error(error);
      toast.error("Failed to delete task");
      return;
    }
  };

  useEffect(() => {
    setLocalColumn(columns);
    setLocalProjectData(projectData);
  }, [columns, projectData]);

  useEffect(() => {
    handleGetProjectData();
  }, [projectId]);

  if (!isLoading && !projectExists) {
    toast.error("Project not found");
    return <Navigate to="/" />;
  }

  if (!isLoading && !projectData) return <Navigate to="/" />;

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // User moves a column
    if (type === "column") {
      console.log("column move");
      const newColumn = reorder(columns, source.index, destination.index).map(
        (column, idx) => {
          return { ...column, order: idx };
        }
      );

      setColumn(newColumn);
      // Trigger columns update
      const newColumnData: ColumnTable[] = newColumn.map((column) => {
        return {
          id: column.id,
          name: column.name,
          order: column.order,
          owner_id: column.owner_id,
          project_id: column.project_id,
          created_at: column.created_at,
        };
      });

      handleUpdateColumn(newColumnData);
    }

    // User moves a task
    if (type === "task") {
      const newColumnData = [...columns];
      const sourceBoard = newColumnData.find(
        (column) => column.id === source.droppableId
      );

      const destinationBoard = newColumnData.find(
        (column) => column.id === destination.droppableId
      );

      if (!sourceBoard || !destinationBoard) {
        console.log("column not found");
        return;
      }

      // Check if tasks exists on the source column
      if (!sourceBoard.tasks) {
        console.log("No tasks found");
        sourceBoard.tasks = [];
      }

      // Check if tasks exists on the destination column
      if (!destinationBoard.tasks) {
        console.log("No tasks found");
        destinationBoard.tasks = [];
      }

      // Moving task within the same column
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceBoard.tasks,
          source.index,
          destination.index
        );

        reorderedCards.forEach((task, idx) => {
          task.order = idx;
        });

        sourceBoard.tasks = reorderedCards;
        setColumn(newColumnData);

        // Trigger Tasks update

        handleUpdateTasks(sourceBoard.tasks);
      } else {
        // Moving task to another column
        const [removed] = sourceBoard.tasks.splice(source.index, 1);
        removed.column_id = destination.droppableId;
        removed.order = destination.index;
        destinationBoard.tasks.splice(destination.index, 0, removed);

        // Update order of source column
        sourceBoard.tasks.forEach((task, idx) => {
          task.order = idx;
        });

        // Update order of destination column
        destinationBoard.tasks.forEach((task, idx) => {
          task.order = idx;
        });

        setColumn(newColumnData);

        // Trigger Tasks update for source column
        handleUpdateTasks(sourceBoard.tasks);

        // Trigger Tasks update for destination column
        handleUpdateTasks(destinationBoard.tasks);
      }
    }
  };

  return (
    <div className="m-4 flex flex-col overflow-hidden overflow-x-auto">
      <div className="flex flex-col pl-1 ">
        <div className="flex gap-2 hover:cursor-pointer items-end w-fit p-1 px-2 rounded-sm group hover:bg-[#282828]">
          <h1 className="text-xl">{projectData?.name}</h1>
          <button
            onClick={handleDeleteProject}
            className="text-xs group-hover:opacity-100 p-1 opacity-0 ml-auto  text-red-500 hover:font-semibold transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="hover-fill-red"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          </button>
        </div>
        <span
          className="text-xs text-gray-600 font-medium"
          style={{
            opacity: isLoading ? 1 : 0,
          }}
        >
          syncing...
        </span>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="columns" type="column" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="h-full flex   gap-1"
            >
              {columns
                .sort((a, b) => a.order - b.order)
                .map((column, idx) => {
                  return (
                    <Column
                      onDeleteBoard={handleDeleteBoard}
                      onAddTask={handleAddTask}
                      onDeleteTask={handleDeleteTask}
                      column={column}
                      key={column.id}
                      idx={idx}
                    />
                  );
                })}
              {provided.placeholder}
              <form
                onSubmit={handleAddNewBoard}
                className="w-[254px] h-fit p-2 flex items-center gap-1"
              >
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  className="w-full focus:bg-[#282828] bg-[#191919] rounded-sm h-full  border-none outline-none text-sm text-zinc-400 p-1 placeholder-zinc-200"
                  placeholder="+ New column"
                />
                {newBoardName.length > 0 && (
                  <button
                    type="submit"
                    className="p-[5px] px-[8px] text-xs rounded-sm  bg-[#282828] hover:text-emerald-500"
                  >
                    add
                  </button>
                )}
              </form>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ProjectPage;
