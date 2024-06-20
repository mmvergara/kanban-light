import { FormEvent, useState } from "react";
import supabase from "../../supabase";
import { BoardsTable, TasksTable } from "../../supabase/supabase-types";
import { useSession } from "../../context/SessionContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

type Props = {
  board: BoardsTable;
  tasks: TasksTable[];
  onNewTask: (newTask: TasksTable) => void;
};

const CreateTask = ({ board, tasks, onNewTask }: Props) => {
  const { user } = useSession();
  const [taskName, setTaskName] = useState<string>("");
  const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false);

  const handleCreateTask = async (e: FormEvent) => {
    e.preventDefault();
    if (taskName.trim() === "") return;
    if (!user) return;
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        board_id: board.id,
        name: taskName,
        owner_id: user.id,
        order:
          Math.max(
            ...tasks.filter((t) => t.board_id === board.id).map((t) => t.order),
            1
          ) + 1000,
      })
      .select("*")
      .maybeSingle();
    if (error) {
      toast.error("Error Creating Task");
      console.log(error);
      return;
    }
    if (data) {
      onNewTask(data);
      setTaskName("");
    }
  };
  return (
    <motion.div>
      {isCreatingTask ? (
        <form onSubmit={handleCreateTask}>
          <input
            autoFocus
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full bg-[#191919] rounded-sm p-1 h-full max-h-[80px]  border-none outline-none text-sm text-zinc-400"
            placeholder="Task Name"
          />
          <div className="w-[50%] ml-auto flex gap-1 mt-1">
            <button
              type="submit"
              className="text-sm p-1 w-[50%] hover:bg-[#191919] hover:text-emerald-500"
            >
              add
            </button>
            <button
              type="button"
              className="text-sm p-1 w-[50%] hover:bg-[#191919] hover:text-red-500"
              onClick={() => setIsCreatingTask(false)}
            >
              close
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsCreatingTask(true)}
          className="text-xs w-full text-left p-2 rounded-sm hover:bg-[#3f3f3f]"
        >
          + Create Task
        </button>
      )}
    </motion.div>
  );
};

export default CreateTask;
