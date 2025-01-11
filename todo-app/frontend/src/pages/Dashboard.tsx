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
    if (!currentColumn || !currentTask.title.trim()) return; // Prevent saving without a title

    setColumns((prevColumns) => {
      const updatedColumns = { ...prevColumns };

      // Entfernen des Tickets aus der ursprünglichen Spalte, falls nötig
      if (originalColumn && originalColumn !== currentColumn && currentTaskIndex !== null) {
        updatedColumns[originalColumn].items.splice(currentTaskIndex, 1);
      } else if (originalColumn === currentColumn && currentTaskIndex !== null) {
        // Überschreiben des Tickets, falls es bearbeitet wird
        updatedColumns[currentColumn].items[currentTaskIndex] = { ...currentTask };
        return updatedColumns;
      }

      // Sicherstellen, dass das Ticket nicht doppelt hinzugefügt wird
      const taskExists = updatedColumns[currentColumn].items.some(
        (item) => JSON.stringify(item) === JSON.stringify(currentTask)
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

  return (
    <div className="p-4 bg-neutral-950 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(columns).map(([columnId, column]) => (
          <div key={columnId} className="bg-neutral-900 p-4 rounded shadow-md">
            <h2 className="font-semibold mb-2">{column.name}</h2>
            <ul>
              {column.items.map((item, index) => (
                <li
                  key={index}
                  className="bg-neutral-950 text-neutral-400 p-2 mb-2 rounded shadow flex justify-between items-center hover:bg-neutral-900 cursor-pointer"
                >
                  <span onClick={() => openModal(columnId, index)}>{item.title}</span>
                  <button
                    onClick={() => {
                      setCurrentColumn(columnId);
                      setCurrentTaskIndex(index);
                      setDeleteConfirmOpen(true);
                    }}
                    className="text-red-500"
                  >
                    X
                  </button>
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
            <h2 className="text-xl font-bold mb-4">Ticket</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">
                  Titel <span className="text-info">*</span>
                </label>
                <input
                  type="text"
                  value={currentTask.title}
                  onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                  className="w-full p-2 bg-neutral-950 border border-neutral-400 rounded text-white"
                  placeholder="Titel der Aufgabe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">
                  Verschiebe in Spalte
                </label>
                <select
                  value={currentColumn || ""}
                  onChange={(e) => setCurrentColumn(e.target.value)}
                  className="w-full p-2 bg-neutral-950 border border-neutral-400 rounded text-white"
                >
                  {Object.entries(columns).map(([columnId, column]) => (
                    <option key={columnId} value={columnId}>
                      {column.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">
                  Bearbeiter
                </label>
                <select
                  value={currentTask.assignee}
                  onChange={(e) => setCurrentTask({ ...currentTask, assignee: e.target.value })}
                  className="w-full p-2 bg-neutral-950 border border-neutral-400 rounded text-white"
                >
                  <option value="">Wähle Bearbeiter</option>
                  <option value="Mitarbeiter 1">Mitarbeiter 1</option>
                  <option value="Mitarbeiter 2">Mitarbeiter 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={currentTask.deadline}
                  onChange={(e) => setCurrentTask({ ...currentTask, deadline: e.target.value })}
                  className="w-full p-2 bg-neutral-950 border border-neutral-400 rounded text-white"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-400 mb-1">
                Beschreibung
              </label>
              <textarea
                value={currentTask.description}
                onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                className="w-full p-2 bg-neutral-950 border border-neutral-400 rounded text-white"
                placeholder="Beschreibung"
                rows={4}
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="text-red-500 flex items-center"
              >
                Löschen
              </button>
              <div>
                <button
                  onClick={closeModal}
                  className="bg-neutral-950 text-neutral-400 px-4 py-2 rounded mr-2 border border-neutral-400"
                >
                  Schließen
                </button>
                <button
                  onClick={saveTask}
                  className={`bg-info text-white px-4 py-2 rounded ${!currentTask.title.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={!currentTask.title.trim()}
                >
                  Speichern
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bestätigungsmodal für Löschen */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-neutral-900 p-6 rounded shadow-md w-1/3 text-white">
            <h2 className="text-xl font-bold mb-4">Möchten Sie das wirklich löschen?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={deleteTask}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Ja
              </button>
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="bg-neutral-950 text-neutral-400 px-4 py-2 rounded border border-neutral-400"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
