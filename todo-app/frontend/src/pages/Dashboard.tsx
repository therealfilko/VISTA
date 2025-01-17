import React, { useEffect, useState } from "react";
import Logo from "../components/common/Logo"; 
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

        const defaultColumns = {
          "1": { name: "To Do", items: [] },
          "2": { name: "In Progress", items: [] },
          "3": { name: "Done", items: [] },
        };

        const formattedColumns = data.reduce(
          (acc: Record<string, ColumnType>, column: APIColumn) => {
            acc[column.id.toString()] = {
              name: column.title,
              items: Array.isArray(column.todos)
                ? column.todos.map(mapAPITodoToTask)
                : [],
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
            const taskIndex = column.items.findIndex(
              (item) => item.id === currentTaskId,
            );
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
      console.log("Update Position Data:", updateData);
      await apiService.updateTodoPosition(currentTaskId, updateData);

      setColumns((prevColumns) => {
        const task = prevColumns[currentColumn].items.find(
          (item) => item.id === currentTaskId,
        );
        if (!task) return prevColumns;

        const sourceItems = prevColumns[currentColumn].items.filter(
          (item) => item.id !== currentTaskId,
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

  const handleToggleDone = async (taskId: number) => {
    try {
      const updatedTask = await apiService.toggleTodoDone(taskId);

      setColumns((prevColumns) => {
        const newColumns = { ...prevColumns };

        Object.keys(newColumns).forEach((columnId) => {
          const taskIndex = newColumns[columnId].items.findIndex(
            (item) => item.id === taskId,
          );

          if (taskIndex !== -1) {
            if (updatedTask.done && columnId !== "3") {
              const [task] = newColumns[columnId].items.splice(taskIndex, 1);
              newColumns["3"].items.push({
                ...task,
                done: true,
                column_id: 3,
              });
            } else {
              newColumns[columnId].items[taskIndex].done = updatedTask.done;
            }
          }
        });

        return newColumns;
      });
    } catch (error) {
      console.error("Fehler beim Ändern des Task-Status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-info"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <header className="bg-neutral-950 border-b border-neutral-800">
        <div className="container mx-auto px-4 py-6">
          {" "}
          <div className="flex items-center justify-between">
            <div className="w-[75px]">
              {" "}
              <Logo />
            </div>

            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-3 px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-info flex items-center justify-center text-white font-medium">
                    {user.first_name[0]}
                  </div>
                  <span className="text-white">
                    {user.first_name} {user.last_name}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isProfileMenuOpen ? "rotate-180" : ""
                    }`}
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
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-neutral-800 rounded-lg shadow-xl border border-neutral-700">
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-neutral-700 transition-colors duration-200 flex items-center space-x-2"
                    >
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
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
            <h2 className="text-xl font-semibold text-white mb-4">
              Fortschritt Übersicht
            </h2>
            <ProgressBar sections={progressSections} />
            <div className="flex justify-between mt-2 text-sm text-neutral-400">
              <span>To Do: {columns["1"]?.items.length || 0} Aufgaben</span>
              <span>
                In Progress: {columns["2"]?.items.length || 0} Aufgaben
              </span>
              <span>Erledigt: {columns["3"]?.items.length || 0} Aufgaben</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              onToggleDone={handleToggleDone}
            />
          ))}
        </div>
      </main>

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
