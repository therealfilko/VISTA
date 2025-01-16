import React, { useEffect, useState } from "react";
import taskifyLogo from "../assets/taskify_logo.svg";
import TaskColumn from "../components/common/TaskColumn";
import ProgressBar from "../components/common/ProgressBar";
import TaskModal from "../components/common/TaskModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { apiService } from "../services/apiService"; // API Service importieren

// Typen für Aufgaben und Spalten
type Task = {
  id: number;
  title: string;
  category: string;
  assignee: string;
  deadline: string;
  description: string;
};

type ColumnType = {
  name: string;
  items: Task[];
};


const Dashboard: React.FC = () => {
  const [columns, setColumns] = useState<Record<string, ColumnType>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>({
    title: "",
    category: "",
    assignee: "",
    deadline: "",
    description: "",
  });
  const [currentColumn, setCurrentColumn] = useState<string | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);


  // Daten von der API laden
  useEffect(() => {
    const fetchColumns = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getColumns();
        const formattedColumns = data.reduce((acc: any, column: any) => {
          acc[column.id] = {
            name: column.title,
            items: column.todos,
          };
          return acc;
        }, {});
        setColumns(formattedColumns);
      } catch (error) {
        console.error("Fehler beim Laden der Spalten:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchColumns();
  }, []);

  const openModal = (columnId: string, taskId: number | null = null) => {
    setCurrentColumn(columnId);
    setCurrentTaskId(taskId);

    if (taskId !== null) {
      const task = columns[columnId].items.find((item: any) => item.id === taskId);
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
    setCurrentTaskId(null);
  };

  const saveTask = async () => {
    if (!currentColumn || !currentTask.title.trim()) return;

    try {
      if (currentTaskId) {
        // Aufgabe aktualisieren
        await apiService.updateTodo(currentTaskId, currentTask);
      } else {
        // Neue Aufgabe erstellen
        const newTask = await apiService.createTodo({
          ...currentTask,
          column_id: Number(currentColumn),
          position: columns[currentColumn].items.length,
        });
        setColumns((prevColumns: any) => ({
          ...prevColumns,
          [currentColumn]: {
            ...prevColumns[currentColumn],
            items: [...prevColumns[currentColumn].items, newTask],
          },
        }));
      }
    } catch (error) {
      console.error("Fehler beim Speichern der Aufgabe:", error);
    } finally {
      closeModal();
    }
  };

  const deleteTask = async () => {
    if (!currentTaskId || !currentColumn) {
      console.error("Löschen fehlgeschlagen: Spalten-ID oder Task-ID fehlt.");
      return;
    }
  
    console.log("Aktuelle Spalte:", currentColumn);
  
    try {
      await apiService.deleteTodo(currentTaskId);
      setColumns((prevColumns: any) => {
        const updatedItems = prevColumns[currentColumn].items.filter(
          (item: any) => item.id !== currentTaskId
        );
        return {
          ...prevColumns,
          [currentColumn]: { ...prevColumns[currentColumn], items: updatedItems },
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
      (acc: number, column: any) => acc + column.items.length,
      0
    );
    if (totalTasks === 0) return { todo: 0, inProgress: 0, done: 0 };

    const todoWidth = (columns["1"].items.length / totalTasks) * 100; // Beispiel-IDs
    const inProgressWidth = (columns["2"].items.length / totalTasks) * 100;
    const doneWidth = (columns["3"].items.length / totalTasks) * 100;

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
      <header className="flex items-center mb-4">
        <img src={taskifyLogo} alt="Taskify" className="h-12 mr-4" />
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
