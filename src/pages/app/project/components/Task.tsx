import { TasksTable } from "../../../../supabase/supabase-types";
import { Draggable } from "@hello-pangea/dnd";
import Pop1Sound from "../../assets/sounds/pop1.wav";
import Pop2Sound from "../../assets/sounds/pop2.wav";
import Pop3Sound from "../../assets/sounds/pop3.wav";
type Props = {
  task: TasksTable;
  idx: number;
  onDeleteTask: (taskId: string) => Promise<void>;
};
const Task = ({ task, idx, onDeleteTask }: Props) => {
  const sounds = [Pop1Sound, Pop2Sound, Pop3Sound];
  const getRandomSound = () => {
    return sounds[Math.floor(Math.random() * sounds.length)];
  };
  const handleDelete = async () => {
    const audio = new Audio(getRandomSound());
    audio.volume = 0.2;
    audio.playbackRate = 1;
    audio.play();
    await onDeleteTask(task.id);
  };

  return (
    <Draggable draggableId={task.id} index={idx}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="bg-[#2f2f2f] group w-full rounded-sm text-sm mt-1 p-2 font-semibold hover:bg-[#3f3f3f] hover:cursor-grab active:cursor-grabbing"
        >
          <div
            {...provided.dragHandleProps}
            className="flex items-center gap-2"
          >
            {task.name}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleDelete}
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
        </div>
      )}
    </Draggable>
  );
};

export default Task;
