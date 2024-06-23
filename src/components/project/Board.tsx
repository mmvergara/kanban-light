import { BoardWithTasks, TasksTable } from "../../supabase/supabase-types";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import Task from "./Task";
import CreateTask from "./CreateTask";
type Props = {
  idx: number;
  board: BoardWithTasks;
  onDeleteTask: (taskId: string) => Promise<void>;
  onAddTask: (task: TasksTable) => Promise<void>;
};

const Board = ({ board, idx, onDeleteTask, onAddTask }: Props) => {
  return (
    <Draggable draggableId={board.id} index={idx}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="h-full flex py-2  px-2 gap-1 active:border-opacity-100 border-[1px] border-[#2f2f2f] rounded-md border-opacity-0"
        >
          <div {...provided.dragHandleProps} className="">
            <h4 className="text-md mb-1 rounded-sm w-fit px-1 font-semibold">
              {board.name}
            </h4>
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
                    board_id={board.id}
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
