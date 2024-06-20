import { BoardsTable, TasksTable } from "../../supabase/supabase-types";

import Task from "./Task";
import TaskDropIndicator from "./TaskDropIndicator";
import CreateTask from "./CreateTask";
type Props = {
  board: BoardsTable;
  tasks: TasksTable[];
  setTasks: React.Dispatch<React.SetStateAction<TasksTable[]>>;
};

const Board = ({ tasks, setTasks, board }: Props) => {
  const handleNewTask = async (newTask: TasksTable) =>
    setTasks([...tasks, newTask]);
  const handleDragStart = (e: DragEvent, task: TasksTable) => {
    if (!e.dataTransfer) return;
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    highlightIndicator(e);
  };

  const highlightIndicator = (e: React.DragEvent<HTMLDivElement>) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const nearestIndicator = getNearestIndicator(e, indicators);
    if (nearestIndicator) {
      nearestIndicator.classList.remove("opacity-0");
    }
  };

  const clearHighlights = (elements?: Element[]) => {
    if (!elements) {
      elements = getIndicators();
    }
    elements.forEach((el) => {
      el.classList.add("opacity-0");
    });
  };

  const handleDragLeave = () => {
    clearHighlights();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    clearHighlights();

    const taskId = e.dataTransfer.getData("taskId") as string;

    const indicators = getIndicators();

    const nearestIndicator = getNearestIndicator(e, indicators);

    const before = nearestIndicator.dataset.before || "-1";
    const nearestIndicatorOrder =
      Number(nearestIndicator.dataset.order) || 1000;

    if (taskId !== before) {
      let task = [...tasks].find((t) => t.id === taskId);
      console.log(task);
      if (!task) return;

      // Update the task column

      const moveToEnd = before === "-1";
      const newOrder = moveToEnd
        ? Math.max(
            ...tasks.filter((t) => t.board_id === board.id).map((t) => t.order),
            1
          ) + 1000
        : nearestIndicatorOrder - 1;

      const taskWithNewColumn: TasksTable = {
        ...task,
        board_id: board.id,
        order: newOrder,
      };
      const updatedTasks = tasks
        .map((t) => (t.id === taskId ? taskWithNewColumn : t))
        .sort((a, b) => a.order - b.order);
      setTasks(updatedTasks);
    }
  };

  const getNearestIndicator = (
    e: React.DragEvent<HTMLDivElement>,
    indicators: HTMLElement[]
  ) => {
    const DISTANCE_OFFSET = 50;
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el.element;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(`[data-board="${board.id}"]`)
    ) as HTMLElement[];
  };

  const boardTasks = tasks.filter((t) => t.board_id === board.id);
  return (
    <div className="h-full flex py-4 px-2 gap-1">
      <div className="w-[1.5px] bg-emerald-500 opacity-0 h-full"></div>
      <div className="h-full">
        <h4 className="text-md mb-1 rounded-sm w-fit px-1 font-semibold">
          {board.name}
        </h4>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="h-full bg-[#202020] w-[270px] rounded-sm p-2 pt-[2px]"
        >
          {boardTasks
            .sort((a, b) => a.order - b.order)
            .map((task) => {
              return (
                <Task
                  onDragStart={handleDragStart}
                  board={board}
                  task={task}
                  key={task.id}
                />
              );
            })}
          <TaskDropIndicator
            taskOrder={
              Math.max(
                ...tasks
                  .filter((t) => t.board_id === board.id)
                  .map((t) => t.order),
                1
              ) + 1000
            }
            board={board}
            beforeId="-1"
          />
          <CreateTask board={board} onNewTask={handleNewTask} tasks={tasks} />
        </div>
      </div>
      <div className="w-[1.5px] bg-emerald-500 opacity-0 h-full"></div>
    </div>
  );
};

export default Board;
