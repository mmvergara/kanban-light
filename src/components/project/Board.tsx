import { BoardWithTasks } from "../../supabase/supabase-types";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import Task from "./Task";
type Props = {
  idx: number;
  board: BoardWithTasks;
};

const Board = ({ board, idx }: Props) => {
  return (
    <Draggable draggableId={board.id} index={idx}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="h-full flex py-4 px-2 gap-1"
        >
          <div {...provided.dragHandleProps} className="h-full">
            <h4 className="text-md mb-1 rounded-sm w-fit px-1 font-semibold">
              {board.name}
            </h4>
            <Droppable droppableId={board.id} type="task">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="h-full bg-[#202020] w-[270px] rounded-sm p-2 pt-[2px]"
                >
                  {board.tasks.map((task, idx) => {
                    return <Task idx={idx} task={task} key={task.id} />;
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            {/* <CreateTask board={board} /> */}
          </div>
          <div className="w-[1.5px] bg-emerald-500 opacity-0 h-full"></div>
        </div>
      )}
    </Draggable>
  );
};

export default Board;
