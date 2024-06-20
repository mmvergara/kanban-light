import { BoardsTable } from "../../supabase/supabase-types";

const TaskDropIndicator = ({
  beforeId,
  taskOrder,
  board,
}: {
  beforeId: string;
  taskOrder: number;
  board: BoardsTable;
}) => {
  return (
    <div
      data-before={beforeId}
      data-board={board.id}
      data-order={taskOrder}
      className="my-0.5 w-full h-0.5 bg-emerald-600 opacity-0"
    />
  );
};

export default TaskDropIndicator;
