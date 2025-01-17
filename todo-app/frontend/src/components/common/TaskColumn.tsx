import React from "react";
import { FiTrash2 } from "react-icons/fi";

interface Task {
  id: number;
  title: string;
  category: string;
  assignee: string;
  deadline: string;
  description: string;
  done: boolean;
}

interface TaskColumnProps {
  columnId: string;
  column: {
    name: string;
    items: Task[];
  };
  onTaskClick: (columnId: string, taskId: number) => void;
  onDeleteClick: (columnId: string, taskId: number) => void;
  onAddTask: (columnId: string) => void;
  onToggleDone: (taskId: number) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  columnId,
  column,
  onTaskClick,
  onDeleteClick,
  onAddTask,
  onToggleDone,
}) => (
  <div className="bg-[#1a1a1a] p-4 rounded shadow-md">
    <h2 className="font-semibold mb-2 text-white">{column.name}</h2>
    <ul>
      {column.items.map((item) => (
        <li
          key={item.id}
          className="bg-[#2a2a2a] text-[#b3b3b3] p-2 mb-2 rounded shadow flex justify-between items-center hover:bg-[#1f1f1f] cursor-pointer"
        >
          <span onClick={() => onTaskClick(columnId, item.id)}>
            {item.title}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onToggleDone(item.id)}
              className={`p-1 rounded ${
                item.done ? "bg-[#20d760]" : "bg-[#1f1f1f]"
              } hover:opacity-80`}
            >
              ✓
            </button>
            <button
              onClick={() => onDeleteClick(columnId, item.id)}
              className="text-red-500 hover:text-red-600"
            >
              <FiTrash2 />
            </button>
          </div>
        </li>
      ))}
    </ul>
    <button
      className="mt-2 bg-[#2a2a2a] text-white px-4 py-2 rounded hover:bg-[#20D760] transition-colors duration-200"
      onClick={() => onAddTask(columnId)}
    >
      + Neue Aufgabe
    </button>
  </div>
);

export default TaskColumn;
