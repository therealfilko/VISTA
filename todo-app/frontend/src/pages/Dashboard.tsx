import React, { useState } from 'react';

type ColumnType = {
  [key: string]: {
    name: string;
    items: string[];
  };
};

const Dashboard: React.FC = () => {
  const [columns, setColumns] = useState<ColumnType>({
    'column-1': { name: 'Zu Erledigen', items: [] },
    'column-2': { name: 'In Arbeit', items: [] },
    'column-3': { name: 'Fertig', items: [] },
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [currentColumn, setCurrentColumn] = useState<string | null>(null);

  // Öffnet das Modal für eine bestimmte Spalte
  const openModal = (columnId: string) => {
    setCurrentColumn(columnId);
    setModalOpen(true);
  };

  // Schließt das Modal
  const closeModal = () => {
    setModalOpen(false);
    setNewTaskTitle('');
    setCurrentColumn(null);
  };

  // Fügt eine neue Aufgabe zu einer bestimmten Spalte hinzu
  const addTask = () => {
    if (!currentColumn) return;

    setColumns((prevColumns) => {
      const column = prevColumns[currentColumn!]; // Type Assertion
      return {
        ...prevColumns,
        [currentColumn]: {
          ...column,
          items: [...column.items, newTaskTitle],
        },
      };
    });

    closeModal();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(columns).map(([columnId, column]) => (
          <div key={columnId} className="bg-gray-100 p-4 rounded shadow-md">
            <h2 className="font-semibold mb-2">{column.name}</h2>
            <ul>
              {column.items.map((item, index) => (
                <li key={index} className="bg-white p-2 mb-2 rounded shadow">
                  {item}
                </li>
              ))}
            </ul>
            <button
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
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
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Neue Aufgabe hinzufügen</h2>
            <input
              type="text"
              placeholder="Titel der Aufgabe"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
              >
                Abbrechen
              </button>
              <button
                onClick={addTask}
                className="bg-blue-500 text-white px-4 py-2 rounded"
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

