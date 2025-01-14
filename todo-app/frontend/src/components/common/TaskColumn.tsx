// components/common/TaskColumn.tsx
import React from "react";
import { FiTrash2 } from "react-icons/fi";

interface TaskColumnProps {
  columnId: string;
  column: {
    name: string;
    items: Array<{
      title: string;
      category: string;
      assignee: string;
      deadline: string;
      description: string;
    }>;
  };
  onTaskClick: (columnId: string, index: number) => void;
  onDeleteClick: (columnId: string, index: number) => void;
  onAddTask: (columnId: string) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  columnId,
  column,
  onTaskClick,
  onDeleteClick,
  onAddTask,
}) => (
  <div className="bg-neutral-900 p-4 rounded shadow-md">
    <h2 className="font-semibold mb-2">{column.name}</h2>
    <ul>
      {column.items.map((item, index) => (
        <li
          key={index}
          className="bg-neutral-950 text-neutral-400 p-2 mb-2 rounded shadow flex justify-between items-center hover:bg-neutral-900 cursor-pointer"
        >
          <span onClick={() => onTaskClick(columnId, index)}>{item.title}</span>
          <button
            onClick={() => onDeleteClick(columnId, index)}
            className="text-red-500 hover:text-red-600 transition-colors"
          >
            <FiTrash2 />
          </button>
        </li>
      ))}
    </ul>
    <button
      className="mt-2 bg-info text-white px-4 py-2 rounded"
      onClick={() => onAddTask(columnId)}
    >
      + Neue Aufgabe
    </button>
  </div>
);

export default TaskColumn;
