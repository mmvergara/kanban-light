import { motion } from "framer-motion";
import TaskDropIndicator from "./TaskDropIndicator";
import { BoardsTable, TasksTable } from "../../supabase/supabase-types";

const Task = ({
  task,
  board,
  onDragStart,
}: {
  task: TasksTable;
  board: BoardsTable;
  onDragStart: (e: any, task: TasksTable) => void;
}) => {
  return (
    <>
      <TaskDropIndicator taskOrder={task.order} board={board} beforeId="1" />
      <motion.article
        layout
        layoutId={task.id}
        draggable="true"
        onDragStart={(e) => onDragStart(e, task)}
        className="bg-[#2f2f2f] rounded-sm text-sm p-2 font-semibold hover:bg-[#3f3f3f] hover:cursor-grab active:cursor-grabbing"
        key={task.id}
      >
        {task.name}
      </motion.article>
    </>
  );
};

export default Task;
