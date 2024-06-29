import { ColumnTable } from "../../../../supabase/supabase-types";

const TaskDropIndicator = ({
  beforeId,
  taskOrder,
  column,
}: {
  beforeId: string;
  taskOrder: number;
  column: ColumnTable;
}) => {
  return (
    <div
      data-before={beforeId}
      data-column={column.id}
      data-order={taskOrder}
      className="my-0.5 w-full h-0.5 bg-emerald-600 opacity-0"
    />
  );
};

export default TaskDropIndicator;
