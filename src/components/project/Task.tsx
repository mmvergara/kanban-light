import { TasksTable } from "../../supabase/supabase-types";
import { Draggable } from "@hello-pangea/dnd";
type Props = {
  task: TasksTable;
  idx: number;
  onDeleteTask: (taskId: string) => Promise<void>;
};
const Task = ({ task, idx, onDeleteTask }: Props) => {
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
              onClick={() => onDeleteTask(task.id)}
              className="text-xs group-hover:opacity-100 p-1 opacity-0 text-gray-500 ml-auto  hover:text-red-500 hover:font-semibold"
            >
              delete
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
