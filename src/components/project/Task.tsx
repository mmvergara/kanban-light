import { TasksTable } from "../../supabase/supabase-types";
import { Draggable } from "@hello-pangea/dnd";
const Task = ({ task, idx }: { task: TasksTable; idx: number }) => {
  return (
    <Draggable draggableId={task.id} index={idx}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="bg-[#2f2f2f] rounded-sm text-sm mt-1 p-2 font-semibold hover:bg-[#3f3f3f] hover:cursor-grab active:cursor-grabbing"
        >
          <div
            {...provided.dragHandleProps}
            className="flex items-center gap-2"
          >
            {task.name}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
