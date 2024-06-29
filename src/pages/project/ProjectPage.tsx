import { Navigate, useNavigate, useParams } from "react-router-dom";
import supabase from "../../supabase";
import {
  BoardsTable,
  BoardWithTasks,
  KanbanBoard,
  TasksTable,
} from "../../supabase/supabase-types";
import { FormEvent, useEffect, useState } from "react";
import Board from "../../components/project/Board";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { toast } from "react-toastify";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useSession } from "../../context/SessionContext";

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
  const [localBoards, setLocalBoards] = useLocalStorage<KanbanBoard["columns"]>(
    `${projectId}-columns`,
    []
  );
  const [localProjectData, setLocalProjectData] =
    useLocalStorage<KanbanBoard | null>(`${projectId}-projectData`, null);
  const [projectData, setProjectData] = useState<KanbanBoard | null>(
    localProjectData
  );
  const [columns, setBoards] = useState<KanbanBoard["columns"]>(localBoards);
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
    setLocalBoards([]);
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
      toast.error("Failed to create board");
      setBoards(columns);
    }
    if (data) {
      const newBoard: BoardWithTasks = { ...data, tasks: [] };
      setBoards([...columns, newBoard]);
    }
    setNewBoardName("");
  };
  const handleDeleteBoard = async (boardId: string) => {
    setBoards((prevBoards) => {
      const newBoards = prevBoards.filter((board) => board.id !== boardId);
      return newBoards;
    });

    setIsLoading(true);
    const { error } = await supabase.from("columns").delete().eq("id", boardId);
    setIsLoading(false);
    if (error) {
      console.error(error);
      toast.error("Failed to delete board");
      return;
    }
  };
  const handleAddTask = async (task: TasksTable) => {
    const newBoards = columns.map((board) => {
      if (board.id === task.column_id) {
        if (!board.tasks) {
          board.tasks = [];
        }
        board.tasks.push(task);
      }
      return board;
    });

    setBoards(newBoards);

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
      setBoards(columns);
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
      setBoards(projectData.columns);
      setProjectData(projectData);
    }
  };
  const handleUpdateBoards = async (board: BoardsTable[]) => {
    setIsLoading(true);
    const { error } = await supabase.from("columns").upsert(board);
    if (error) {
      console.error(error);
      toast.error("Failed to update columns");
      setBoards(columns);
    }
    setIsLoading(false);
  };
  const handleUpdateTasks = async (tasks: TasksTable[]) => {
    setIsLoading(true);
    const { error } = await supabase.from("tasks").upsert(tasks);
    if (error) {
      console.error(error);
      toast.error("Failed to update tasks");
      setBoards(columns);
      setIsLoading(false);
    }
    setIsLoading(false);
  };
  const handleDeleteTask = async (taskId: string) => {
    setBoards((prevBoards) => {
      const newBoards = prevBoards.map((board) => {
        if (!board.tasks) return board;
        const newTasks = board.tasks.filter((task) => task.id !== taskId);
        return { ...board, tasks: newTasks };
      });
      return newBoards;
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
    setLocalBoards(columns);
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

    // User moves a board
    if (type === "board") {
      console.log("board move");
      const newBoards = reorder(columns, source.index, destination.index).map(
        (board, idx) => {
          return { ...board, order: idx };
        }
      );

      setBoards(newBoards);
      // Trigger columns update
      const newBoardsData: BoardsTable[] = newBoards.map((board) => {
        return {
          id: board.id,
          name: board.name,
          order: board.order,
          owner_id: board.owner_id,
          project_id: board.project_id,
          created_at: board.created_at,
        };
      });

      handleUpdateBoards(newBoardsData);
    }

    // User moves a task
    if (type === "task") {
      let newBoardsData = [...columns];
      const sourceBoard = newBoardsData.find(
        (board) => board.id === source.droppableId
      );

      const destinationBoard = newBoardsData.find(
        (board) => board.id === destination.droppableId
      );

      if (!sourceBoard || !destinationBoard) {
        console.log("Board not found");
        return;
      }

      // Check if tasks exists on the source board
      if (!sourceBoard.tasks) {
        console.log("No tasks found");
        sourceBoard.tasks = [];
      }

      // Check if tasks exists on the destination board
      if (!destinationBoard.tasks) {
        console.log("No tasks found");
        destinationBoard.tasks = [];
      }

      // Moving task within the same board
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
        setBoards(newBoardsData);

        // Trigger Tasks update

        handleUpdateTasks(sourceBoard.tasks);
      } else {
        // Moving task to another board
        const [removed] = sourceBoard.tasks.splice(source.index, 1);
        removed.column_id = destination.droppableId;
        removed.order = destination.index;
        destinationBoard.tasks.splice(destination.index, 0, removed);

        // Update order of source board
        sourceBoard.tasks.forEach((task, idx) => {
          task.order = idx;
        });

        // Update order of destination board
        destinationBoard.tasks.forEach((task, idx) => {
          task.order = idx;
        });

        setBoards(newBoardsData);

        // Trigger Tasks update for source board
        handleUpdateTasks(sourceBoard.tasks);

        // Trigger Tasks update for destination board
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
        <Droppable droppableId="columns" type="board" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="h-full flex   gap-1"
            >
              {columns
                .sort((a, b) => a.order - b.order)
                .map((board, idx) => {
                  return (
                    <Board
                      onDeleteBoard={handleDeleteBoard}
                      onAddTask={handleAddTask}
                      onDeleteTask={handleDeleteTask}
                      board={board}
                      key={board.id}
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
                  placeholder="+ New Board"
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
