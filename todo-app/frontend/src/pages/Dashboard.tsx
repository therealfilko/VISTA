import React, { useEffect, useState } from "react";
import taskifyLogo from "../assets/taskify_logo.svg";
import TaskColumn from "../components/common/TaskColumn";
import ProgressBar from "../components/common/ProgressBar";
import TaskModal from "../components/common/TaskModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import {
  apiService,
  type Column as APIColumn,
  type Todo as APITodo,
} from "../services/apiService";
import { useAuth } from "../hooks/use-auth";

interface TaskFormData {
  title: string;
  category: string;
  assignee: string;
  deadline: string;
  description: string;
  done: boolean;
}

interface Task extends APITodo {
  category: string;
  assignee: string;
  deadline: string;
}

interface ColumnType {
  name: string;
  items: Task[];
}

// Hilfsfunktion zum Mapping von APITodo zu Task
const mapAPITodoToTask = (todo: APITodo): Task => ({
  ...todo,
  category: "",
  assignee: "",
  deadline: "",
});

const Dashboard: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [columns, setColumns] = useState<Record<string, ColumnType>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskFormData>({
    title: "",
    category: "",
    assignee: "",
    deadline: "",
    description: "",
    done: false,
  });
  const [currentColumn, setCurrentColumn] = useState<string | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);

  useEffect(() => {
    const fetchColumns = async () => {
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        const data = await apiService.getColumns();

        // Stelle sicher, dass wir immer drei Spalten haben
        const defaultColumns = {
          "1": { name: "To Do", items: [] },
          "2": { name: "In Progress", items: [] },
          "3": { name: "Done", items: [] },
        };

        // Fülle die existierenden Spalten mit den Daten von der API
        const formattedColumns = data.reduce(
          (acc: Record<string, ColumnType>, column: APIColumn) => {
            acc[column.id.toString()] = {
              name: column.title,
              items: Array.isArray(column.todos) ? column.todos.map(mapAPITodoToTask) : [],
            };
            return acc;
          },
          defaultColumns,
        );

        setColumns(formattedColumns);
      } catch (error) {
        console.error("Fehler beim Laden der Spalten:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchColumns();
  }, [isAuthenticated]);

  const openModal = (columnId: string, taskId: number | null = null) => {
    setCurrentColumn(columnId);
    setCurrentTaskId(taskId);

    if (taskId !== null) {
      const task = columns[columnId].items.find((item) => item.id === taskId);
      if (task) {
        setCurrentTask({
          title: task.title,
          category: task.category,
          assignee: task.assignee,
          deadline: task.deadline,
          description: task.description,
          done: task.done,
        });
      }
    } else {
      setCurrentTask({
        title: "",
        category: "",
        assignee: "",
        deadline: "",
        description: "",
        done: false,
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
      done: false,
    });
    setCurrentColumn(null);
    setCurrentTaskId(null);
  };

  const saveTask = async () => {
    if (!currentColumn || !currentTask.title.trim()) return;

    try {
      if (currentTaskId) {
        const updatedTask = await apiService.updateTodo(currentTaskId, {
          title: currentTask.title,
          description: currentTask.description,
          done: currentTask.done,
        });

        setColumns((prevColumns) => {
          const updatedColumns = { ...prevColumns };
          Object.keys(updatedColumns).forEach((columnId) => {
            const column = updatedColumns[columnId];
            const taskIndex = column.items.findIndex((item) => item.id === currentTaskId);
            if (taskIndex !== -1) {
              column.items[taskIndex] = {
                ...column.items[taskIndex],
                ...updatedTask,
                category: currentTask.category,
                assignee: currentTask.assignee,
                deadline: currentTask.deadline,
              };
            }
          });
          return updatedColumns;
        });
      } else {
        const newTask = await apiService.createTodo({
          title: currentTask.title,
          description: currentTask.description,
          column_id: Number(currentColumn),
          position: columns[currentColumn].items.length,
        });

        const newTaskWithExtras: Task = {
          ...newTask,
          category: currentTask.category,
          assignee: currentTask.assignee,
          deadline: currentTask.deadline,
        };

        setColumns((prevColumns) => ({
          ...prevColumns,
          [currentColumn]: {
            ...prevColumns[currentColumn],
            items: [...prevColumns[currentColumn].items, newTaskWithExtras],
          },
        }));
      }
    } catch (error) {
      console.error("Fehler beim Speichern der Aufgabe:", error);
    } finally {
      closeModal();
    }
  };

  const handleColumnChange = async (newColumnId: string) => {
    if (!currentTaskId || !currentColumn) return;

    try {
      const updateData = {
        todo_id: currentTaskId,
        column_id: Number(newColumnId),
        position: columns[newColumnId].items.length,
      };
      console.log('Update Position Data:', updateData);
      await apiService.updateTodoPosition(currentTaskId, updateData);

      setColumns((prevColumns) => {
        const task = prevColumns[currentColumn].items.find(
          (item) => item.id === currentTaskId
        );
        if (!task) return prevColumns;

        const sourceItems = prevColumns[currentColumn].items.filter(
          (item) => item.id !== currentTaskId
        );
        const targetItems = [...prevColumns[newColumnId].items, task];

        return {
          ...prevColumns,
          [currentColumn]: {
            ...prevColumns[currentColumn],
            items: sourceItems,
          },
          [newColumnId]: {
            ...prevColumns[newColumnId],
            items: targetItems,
          },
        };
      });

      setCurrentColumn(newColumnId);
    } catch (error) {
      console.error("Fehler beim Verschieben der Aufgabe:", error);
    }
  };

  const deleteTask = async () => {
    if (!currentTaskId || !currentColumn) {
      console.error("Löschen fehlgeschlagen: Spalten-ID oder Task-ID fehlt.");
      return;
    }

    try {
      await apiService.deleteTodo(currentTaskId);
      setColumns((prevColumns: Record<string, ColumnType>) => {
        const updatedItems = prevColumns[currentColumn].items.filter(
          (item: Task) => item.id !== currentTaskId,
        );
        return {
          ...prevColumns,
          [currentColumn]: {
            ...prevColumns[currentColumn],
            items: updatedItems,
          },
        };
      });
    } catch (error) {
      console.error("Fehler beim Löschen der Aufgabe:", error);
    } finally {
      closeModal();
    }
  };

  const calculateProgressWidths = () => {
    const totalTasks = Object.values(columns).reduce(
      (acc: number, column: ColumnType) => acc + column.items.length,
      0,
    );
    if (totalTasks === 0) return { todo: 0, inProgress: 0, done: 0 };

    const todoWidth = ((columns["1"]?.items.length || 0) / totalTasks) * 100;
    const inProgressWidth =
      ((columns["2"]?.items.length || 0) / totalTasks) * 100;
    const doneWidth = ((columns["3"]?.items.length || 0) / totalTasks) * 100;

    return { todo: todoWidth, inProgress: inProgressWidth, done: doneWidth };
  };

  const progressWidths = calculateProgressWidths();
  const progressSections = [
    { value: progressWidths.todo, color: "bg-gray-400" },
    { value: progressWidths.inProgress, color: "bg-yellow-500" },
    { value: progressWidths.done, color: "bg-green-500" },
  ];

  if (isLoading) {
    return <p>Laden...</p>;
  }

  return (
    <div className="p-4 bg-neutral-950 text-white min-h-screen">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img src={taskifyLogo} alt="Taskify" className="h-12 mr-4" />
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        {user && (
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700"
            >
              <span>
                {user.first_name} {user.last_name}
              </span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-neutral-800 rounded-lg shadow-xl">
                <div className="border-t border-neutral-700" />
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-neutral-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
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
              setCurrentTaskId(index);
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
        onColumnChange={handleColumnChange}
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
