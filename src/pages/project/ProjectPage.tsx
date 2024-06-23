import { Navigate, useParams } from "react-router-dom";
import supabase from "../../supabase";
import {
  BoardsTable,
  BoardWithTasks,
  KanbanBoard,
  TasksTable,
} from "../../supabase/supabase-types";
import { useEffect, useState } from "react";
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
  const params = useParams();
  const projectId = params.projectId!;
  const { user } = useSession();
  const [localBoards, setLocalBoards] = useLocalStorage<KanbanBoard["boards"]>(
    `${projectId}-boards`,
    []
  );
  const [localProjectData, setLocalProjectData] =
    useLocalStorage<KanbanBoard | null>(`${projectId}-projectData`, null);
  const [projectData, setProjectData] = useState<KanbanBoard | null>(
    localProjectData
  );
  const [boards, setBoards] = useState<KanbanBoard["boards"]>(localBoards);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newBoardName, setNewBoardName] = useState<string>("");

  const handleAddNewBoard = async () => {
    if (!user) return;
    if (newBoardName.trim() === "") return;
    const newBoard = {
      name: newBoardName,
      order: boards.length,
      owner_id: user?.id,
      project_id: projectId,
    };
    const { error, data } = await supabase
      .from("boards")
      .insert(newBoard)
      .select("*")
      .maybeSingle();
    if (error) {
      console.error(error);
      toast.error("Failed to create board");
      setBoards(boards);
    }
    if (data) {
      const newBoard: BoardWithTasks = { ...data, tasks: [] };
      setBoards([...boards, newBoard]);
    }
  };

  const handleAddTask = async (task: TasksTable) => {
    const newBoards = boards.map((board) => {
      if (board.id === task.board_id) {
        if (!board.tasks) {
          board.tasks = [];
        }
        board.tasks.push(task);
      }
      return board;
    });

    setBoards(newBoards);

    const { error } = await supabase
      .from("tasks")
      .insert(task)
      .select("*")
      .maybeSingle();
    if (error) {
      console.error(error);
      toast.error("Failed to create task");
      setBoards(boards);
    }
  };

  const handleGetProjectData = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*,boards(*,tasks(*))")
      .eq("id", projectId);
    if (error) {
      console.error(error);
      setIsLoading(false);
      return;
    }
    if (data && data.length == 1) {
      const projectData = data[0] as KanbanBoard;
      setBoards(projectData.boards);
      setProjectData(projectData);
      setIsLoading(false);
    }
  };

  const handleUpdateBoards = async (board: BoardsTable[]) => {
    setIsLoading(true);
    const { error } = await supabase.from("boards").upsert(board);
    if (error) {
      console.error(error);
      toast.error("Failed to update boards");
      setBoards(boards);
    }
    setIsLoading(false);
  };

  const handleUpdateTasks = async (tasks: TasksTable[]) => {
    setIsLoading(true);
    const { error } = await supabase.from("tasks").upsert(tasks);
    if (error) {
      console.error(error);
      toast.error("Failed to update tasks");
      setBoards(boards);
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
    setLocalBoards(boards);
    setLocalProjectData(projectData);
  }, [boards, projectData]);

  useEffect(() => {
    handleGetProjectData();
  }, [projectId]);

  // if (isLoading) return <div>Loading...</div>;
  // if (!boards) {
  //   toast.error("Project not found");
  //   return <Navigate to="/" />;
  // }

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
      const newBoards = reorder(boards, source.index, destination.index).map(
        (board, idx) => {
          return { ...board, order: idx };
        }
      );

      setBoards(newBoards);
      // Trigger Boards update
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
      let newBoardsData = [...boards];
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
        removed.board_id = destination.droppableId;
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
        <h1 className="text-xl">{projectData?.name}</h1>
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
        <Droppable droppableId="boards" type="board" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="h-full flex   gap-1"
            >
              {boards
                .sort((a, b) => a.order - b.order)
                .map((board, idx) => {
                  return (
                    <Board
                      onAddTask={handleAddTask}
                      onDeleteTask={handleDeleteTask}
                      board={board}
                      key={board.id}
                      idx={idx}
                    />
                  );
                })}
              {provided.placeholder}
              <form className="w-[254px] h-fit p-2 flex items-center gap-1">
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  className="w-full focus:bg-[#282828] bg-[#191919] rounded-sm h-full  border-none outline-none text-sm text-zinc-400 p-1 "
                  placeholder="+ New Board"
                />
                {newBoardName.length > 0 && (
                  <button
                    type="button"
                    onClick={handleAddNewBoard}
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
