import { Draggable, Droppable } from "@hello-pangea/dnd";
import Task from "./Task";
import CreateTask from "./CreateTask";
import {
  BoardWithTasks,
  TasksTable,
} from "../../../../supabase/supabase-types";
type Props = {
  idx: number;
  column: BoardWithTasks;
  onDeleteTask: (taskId: string) => Promise<void>;
  onDeleteBoard: (boardId: string) => Promise<void>;
  onAddTask: (task: TasksTable) => Promise<void>;
};

const Column = ({
  column,
  idx,
  onDeleteTask,
  onAddTask,
  onDeleteBoard,
}: Props) => {
  return (
    <Draggable draggableId={column.id} index={idx}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="h-full flex py-2  px-2 gap-1 active:border-opacity-100 border-[1px] border-[#2f2f2f] rounded-md border-opacity-0"
        >
          <div {...provided.dragHandleProps} className="">
            <div className="mb-1 rounded-sm px-1 group flex justify-between items-center w-full">
              <h4 className="text-md  font-semibold">{column.name}</h4>
              <button
                onClick={() => onDeleteBoard(column.id)}
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
            <Droppable droppableId={column.id} type="task">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className=" bg-[#202020] w-[270px] rounded-sm p-2 pt-[2px]"
                >
                  {column.tasks.map((task, idx) => {
                    return (
                      <Task
                        onDeleteTask={onDeleteTask}
                        idx={idx}
                        task={task}
                        key={task.id}
                      />
                    );
                  })}
                  {provided.placeholder}
                  <CreateTask
                    tasks={column.tasks}
                    column_id={column.id}
                    onAddTask={onAddTask}
                  />
                </div>
              )}
            </Droppable>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
