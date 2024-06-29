import { BoardWithTasks, TasksTable } from "../../supabase/supabase-types";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import Task from "./Task";
import CreateTask from "./CreateTask";
type Props = {
  idx: number;
  board: BoardWithTasks;
  onDeleteTask: (taskId: string) => Promise<void>;
  onDeleteBoard: (boardId: string) => Promise<void>;
  onAddTask: (task: TasksTable) => Promise<void>;
};

const Board = ({
  board,
  idx,
  onDeleteTask,
  onAddTask,
  onDeleteBoard,
}: Props) => {
  return (
    <Draggable draggableId={board.id} index={idx}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="h-full flex py-2  px-2 gap-1 active:border-opacity-100 border-[1px] border-[#2f2f2f] rounded-md border-opacity-0"
        >
          <div {...provided.dragHandleProps} className="">
            <div className="mb-1 rounded-sm px-1 group flex justify-between items-center w-full">
              <h4 className="text-md  font-semibold">{board.name}</h4>
              <button
                onClick={() => onDeleteBoard(board.id)}
                className="text-xs group-hover:opacity-100 p-1 opacity-0 text-gray-500 ml-auto hover:text-red-500 hover:font-semibold"
              >
                delete
              </button>
            </div>
            <Droppable droppableId={board.id} type="task">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className=" bg-[#202020] w-[270px] rounded-sm p-2 pt-[2px]"
                >
                  {board.tasks.map((task, idx) => {
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
                    tasks={board.tasks}
                    column_id={board.id}
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

export default Board;
