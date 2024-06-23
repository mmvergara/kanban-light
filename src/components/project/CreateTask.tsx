import { FormEvent, useState } from "react";
import { TasksTable } from "../../supabase/supabase-types";
import { useSession } from "../../context/SessionContext";
import { v4 as uuidv4 } from "uuid";
type Props = {
  tasks: TasksTable[];
  board_id: string;
  onAddTask: (task: TasksTable) => Promise<void>;
};

const CreateTask = ({ tasks, board_id, onAddTask }: Props) => {
  const { user } = useSession();
  const [taskName, setTaskName] = useState<string>("");
  const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false);

  const handleCreateTask = async (e: FormEvent) => {
    e.preventDefault();
    if (taskName.trim() === "") return;
    if (!user) return;
    const newTask: TasksTable = {
      id: uuidv4(),
      board_id: board_id,
      name: taskName,
      owner_id: user.id,
      order: tasks.length,
      created_at: new Date().toISOString(),
    };
    onAddTask(newTask);
    setTaskName("");
  };
  return (
    <>
      {isCreatingTask ? (
        <form onSubmit={handleCreateTask}>
          <input
            autoFocus
            onBlurCapture={() => {
              if (taskName.trim() === "") {
                setIsCreatingTask(false);
              }
            }}
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full mt-1 bg-[#191919] rounded-sm p-1 h-full max-h-[80px]  border-none outline-none text-sm text-zinc-400"
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
          className="text-xs w-full text-left p-2 rounded-sm mt-1 hover:bg-[#3f3f3f]"
        >
          + Create Task
        </button>
      )}
    </>
  );
};

export default CreateTask;
