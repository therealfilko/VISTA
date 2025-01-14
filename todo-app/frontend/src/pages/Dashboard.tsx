import React, { useState } from "react";
import taskifyLogo from "../assets/taskify_logo.svg";
import TaskColumn from "../components/common/TaskColumn";
import ProgressBar from "../components/common/ProgressBar";
import TaskModal from "../components/common/TaskModal";
import ConfirmationModal from "../components/common/ConfirmationModal";

type ColumnType = {
  [key: string]: {
    name: string;
    items: {
      title: string;
      category: string;
      assignee: string;
      deadline: string;
      description: string;
    }[];
  };
};

const Dashboard: React.FC = () => {
  const [columns, setColumns] = useState<ColumnType>({
    "column-1": { name: "To Do", items: [] },
    "column-2": { name: "In Progress", items: [] },
    "column-3": { name: "Done", items: [] },
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<{
    title: string;
    category: string;
    assignee: string;
    deadline: string;
    description: string;
  }>({
    title: "",
    category: "",
    assignee: "",
    deadline: "",
    description: "",
  });
  const [currentColumn, setCurrentColumn] = useState<string | null>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number | null>(null);
  const [originalColumn, setOriginalColumn] = useState<string | null>(null);

  const openModal = (columnId: string, taskIndex: number | null = null) => {
    setCurrentColumn(columnId);
    setOriginalColumn(columnId);
    setCurrentTaskIndex(taskIndex);

    if (taskIndex !== null) {
      const task = columns[columnId].items[taskIndex];
      setCurrentTask(task);
    } else {
      setCurrentTask({
        title: "",
        category: "",
        assignee: "",
        deadline: "",
        description: "",
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setDeleteConfirmOpen(false);
    setCurrentTask({
      title: "",
      category: "",
      assignee: "",
      deadline: "",
      description: "",
    });
    setCurrentColumn(null);
    setCurrentTaskIndex(null);
    setOriginalColumn(null);
  };

  const saveTask = () => {
    if (!currentColumn || !currentTask.title.trim()) return;

    setColumns((prevColumns) => {
      const updatedColumns = { ...prevColumns };

      if (
        originalColumn &&
        originalColumn !== currentColumn &&
        currentTaskIndex !== null
      ) {
        updatedColumns[originalColumn].items.splice(currentTaskIndex, 1);
      } else if (
        originalColumn === currentColumn &&
        currentTaskIndex !== null
      ) {
        updatedColumns[currentColumn].items[currentTaskIndex] = {
          ...currentTask,
        };
        return updatedColumns;
      }

      const taskExists = updatedColumns[currentColumn].items.some(
        (item) => JSON.stringify(item) === JSON.stringify(currentTask),
      );
      if (!taskExists) {
        updatedColumns[currentColumn].items.push({ ...currentTask });
      }

      return updatedColumns;
    });

    closeModal();
  };

  const deleteTask = () => {
    if (currentColumn === null || currentTaskIndex === null) return;

    setColumns((prevColumns) => {
      const updatedColumns = { ...prevColumns };
      updatedColumns[currentColumn].items.splice(currentTaskIndex, 1);
      return updatedColumns;
    });

    setDeleteConfirmOpen(false);
    closeModal();
  };

  const calculateProgressWidths = () => {
    const totalTasks =
      columns["column-1"].items.length +
      columns["column-2"].items.length +
      columns["column-3"].items.length;
    if (totalTasks === 0) return { todo: 0, inProgress: 0, done: 0 };

    const todoWidth = (columns["column-1"].items.length / totalTasks) * 100;
    const inProgressWidth =
      (columns["column-2"].items.length / totalTasks) * 100;
    const doneWidth = (columns["column-3"].items.length / totalTasks) * 100;

    return { todo: todoWidth, inProgress: inProgressWidth, done: doneWidth };
  };

  const progressWidths = calculateProgressWidths();
  const progressSections = [
    { value: progressWidths.todo, color: "bg-gray-400" },
    { value: progressWidths.inProgress, color: "bg-yellow-500" },
    { value: progressWidths.done, color: "bg-green-500" },
  ];

  return (
    <div className="p-4 bg-neutral-950 text-white min-h-screen">
      <header className="flex items-center mb-4">
        <img src={taskifyLogo} alt="Taskify Logo" className="h-12 mr-4" />
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(columns).map(([columnId, column]) => (
          <TaskColumn
            key={columnId}
            columnId={columnId}
            column={column}
            onTaskClick={(columnId, index) => openModal(columnId, index)}
            onDeleteClick={(columnId, index) => {
              setCurrentColumn(columnId);
              setCurrentTaskIndex(index);
              setDeleteConfirmOpen(true);
            }}
            onAddTask={(columnId) => openModal(columnId)}
          />
        ))}
      </div>

      <div className="mt-8">
        <ProgressBar sections={progressSections} />
      </div>

      <TaskModal
        isOpen={isModalOpen}
        task={currentTask}
        columns={columns}
        currentColumn={currentColumn}
        onClose={closeModal}
        onSave={saveTask}
        onDelete={() => setDeleteConfirmOpen(true)}
        onTaskChange={setCurrentTask}
        onColumnChange={setCurrentColumn}
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        title="Möchten Sie das wirklich löschen?"
        onConfirm={deleteTask}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
