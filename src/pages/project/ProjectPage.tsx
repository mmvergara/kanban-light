import { useParams } from "react-router-dom";
import supabase from "../../supabase";
import {
  BoardsTable,
  KanbanBoard,
  TasksTable,
} from "../../supabase/supabase-types";
import { useEffect, useState } from "react";
import Board from "../../components/project/Board";

const ProjectPage = () => {
  const params = useParams();
  const projectId = params.projectId;

  const [boards, setBoards] = useState<BoardsTable[]>([]);
  const [tasks, setTasks] = useState<TasksTable[]>([]);
  const handleGetProjectData = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*,boards(*,tasks(*))")
      .eq("id", projectId!);
    if (error) {
      console.error(error);
      return;
    }
    if (data && data.length == 1) {
      const projectData = data[0] as KanbanBoard;
      setBoards(projectData.boards);
      setTasks(projectData.boards.flatMap((b) => b.tasks));
    }
  };
  useEffect(() => {
    handleGetProjectData();
  }, [projectId]);

  return (
    <div className="m-4 flex overflow-hidden overflow-x-auto">
      {boards.map((board) => {
        return (
          <Board
            board={board}
            key={board.id}
            tasks={tasks}
            setTasks={setTasks}
          />
        );
      })}
    </div>
  );
};

export default ProjectPage;
