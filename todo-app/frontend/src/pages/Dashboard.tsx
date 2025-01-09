import React, { useState } from "react";

type ColumnType = {
  [key: string]: {
    name: string;
    items: { title: string; category: string; assignee: string; deadline: string; description: string }[];
  };
};

const Dashboard: React.FC = () => {
  const [columns, setColumns] = useState<ColumnType>({
    "column-1": { name: "To Do", items: [] },
    "column-2": { name: "In Progress", items: [] },
    "column-3": { name: "Done", items: [] },
  });

  const [isModalOpen, setModalOpen] = useState(false);
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

  const openModal = (columnId: string, taskIndex: number | null = null) => {
    setCurrentColumn(columnId);
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
    setCurrentTask({
      title: "",
      category: "",
      assignee: "",
      deadline: "",
      description: "",
    });
    setCurrentColumn(null);
    setCurrentTaskIndex(null);
  };

  const saveTask = () => {
    if (!currentColumn) return;

    setColumns((prevColumns) => {
      const updatedColumns = { ...prevColumns };

      if (currentTaskIndex !== null) {
        // Update an existing task
        updatedColumns[currentColumn].items[currentTaskIndex] = { ...currentTask };
      } else {
        // Add a new task (ensure no duplicate addition)
        updatedColumns[currentColumn].items = [
          ...updatedColumns[currentColumn].items,
          { ...currentTask },
        ];
      }

      return updatedColumns;
    });

    closeModal();
  };

  return (
    <div className="p-4 bg-neutral-950 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-info">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(columns).map(([columnId, column]) => (
          <div
            key={columnId}
            className="bg-neutral-900 p-4 rounded shadow-md text-white"
          >
            <h2 className="font-semibold mb-2 text-info">{column.name}</h2>
            <ul>
              {column.items.map((item, index) => (
                <li
                  key={index}
                  className="bg-neutral-950 p-2 mb-2 rounded shadow hover:bg-neutral-900 cursor-pointer"
                  onClick={() => openModal(columnId, index)}
                >
                  {item.title}
                </li>
              ))}
            </ul>
            <button
              className="mt-2 bg-info text-white px-4 py-2 rounded"
              onClick={() => openModal(columnId)}
            >
              + Neue Aufgabe
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-neutral-900 p-6 rounded shadow-md w-2/3 text-white">
            <h2 className="text-xl font-bold mb-4 text-info">Ticket</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-neutral-400">Titel</label>
                <input
                  type="text"
                  value={currentTask.title}
                  onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                  className="w-full p-2 border rounded bg-neutral-950 text-white placeholder-neutral-400"
                  placeholder="Titel der Aufgabe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-neutral-400">Kategorie</label>
                <input
                  type="text"
                  value={currentTask.category}
                  onChange={(e) => setCurrentTask({ ...currentTask, category: e.target.value })}
                  className="w-full p-2 border rounded bg-neutral-950 text-white placeholder-neutral-400"
                  placeholder="Kategorie"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-neutral-400">Bearbeiter</label>
                <select
                  value={currentTask.assignee}
                  onChange={(e) => setCurrentTask({ ...currentTask, assignee: e.target.value })}
                  className="w-full p-2 border rounded bg-neutral-950 text-white placeholder-neutral-400"
                >
                  <option value="">Wähle Bearbeiter</option>
                  <option value="Mitarbeiter 1">Mitarbeiter 1</option>
                  <option value="Mitarbeiter 2">Mitarbeiter 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-neutral-400">Deadline</label>
                <input
                  type="date"
                  value={currentTask.deadline}
                  onChange={(e) => setCurrentTask({ ...currentTask, deadline: e.target.value })}
                  className="w-full p-2 border rounded bg-neutral-950 text-white placeholder-neutral-400"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-neutral-400">Beschreibung</label>
              <textarea
                value={currentTask.description}
                onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                className="w-full p-2 border rounded bg-neutral-950 text-white placeholder-neutral-400"
                placeholder="Beschreibung"
                rows={4}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-neutral-400 text-neutral-950 px-4 py-2 rounded mr-2"
              >
                Schließen
              </button>
              <button
                onClick={saveTask}
                className="bg-info text-white px-4 py-2 rounded"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;