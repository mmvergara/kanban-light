import { Navigate, useParams } from "react-router-dom";
import supabase from "../../supabase";
import { KanbanBoard } from "../../supabase/supabase-types";
import { useEffect, useState } from "react";
import Board from "../../components/project/Board";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { toast } from "react-toastify";

const reorder = <T,>(list: T[], startIdx: number, endIdx: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIdx, 1);
  result.splice(endIdx, 0, removed);
  return result;
};
const ProjectPage = () => {
  const params = useParams();
  const projectId = params.projectId!;
  const [projectData, setProjectData] = useState<KanbanBoard | null>(null);
  const [boards, setBoards] = useState<KanbanBoard["boards"] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
  useEffect(() => {
    handleGetProjectData();
  }, [projectId]);

  if (isLoading) return <div>Loading...</div>;
  if (!boards) {
    toast.error("Project not found");
    return <Navigate to="/" />;
  }

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
      //TODO: Trigger server update

      // NewBoards with tasks removed
      const newBoardsData = newBoards.map((board) => {
        return {
          id: board.id,
          name: board.name,
          order: board.order,
          owner_id: board.owner_id,
          project_id: board.project_id,
        };
      });

      supabase
        .from("boards")
        .upsert(newBoardsData)
        .then((res) => {
          if (res.error) {
            console.error(res.error);
            toast.error("Failed to update boards");
            setBoards(boards);
          }
        });
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
        console.log(reorderedCards);

        sourceBoard.tasks = reorderedCards;
        setBoards(newBoardsData);
        // TODO Trigger server update

        supabase
          .from("tasks")
          .upsert(sourceBoard.tasks)
          .then((res) => {
            if (res.error) {
              console.error(res.error);
              toast.error("Failed to update tasks");
              setBoards(boards);
            }
          });
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

        supabase
          .from("tasks")
          .upsert(sourceBoard.tasks)
          .then((res) => {
            if (res.error) {
              console.error(res.error);
              toast.error("Failed to update tasks");
              setBoards(boards);
            }
          });

        supabase
          .from("tasks")
          .upsert(destinationBoard.tasks)
          .then((res) => {
            if (res.error) {
              console.error(res.error);
              toast.error("Failed to update tasks");
              setBoards(boards);
            }
          });
      }
    }
  };
  return (
    <div className="m-4 flex flex-col overflow-hidden overflow-x-auto">
      <h1 className="pl-1 text-xl">{projectData?.name}</h1>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="boards" type="board" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="h-full flex   gap-1"
            >
              {boards.map((board, idx) => {
                return <Board board={board} key={board.id} idx={idx} />;
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ProjectPage;
