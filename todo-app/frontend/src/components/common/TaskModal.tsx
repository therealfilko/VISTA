import React from "react";

interface TaskModalProps {
  isOpen: boolean;
  task: {
    title: string;
    category: string;
    assignee: string;
    deadline: string;
    description: string;
  };
  columns: Record<string, { name: string }>;
  currentColumn: string | null;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
  onTaskChange: (updatedTask: any) => void;
  onColumnChange: (columnId: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  task,
  columns,
  currentColumn,
  onClose,
  onSave,
  onDelete,
  onTaskChange,
  onColumnChange,
}) => {
  if (!isOpen) return null;

  return (
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
              value={task.title}
              onChange={(e) => onTaskChange({ ...task, title: e.target.value })}
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
              onChange={(e) => onColumnChange(e.target.value)}
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
              value={task.assignee}
              onChange={(e) =>
                onTaskChange({ ...task, assignee: e.target.value })
              }
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
              value={task.deadline}
              onChange={(e) =>
                onTaskChange({ ...task, deadline: e.target.value })
              }
              className="w-full p-2 bg-neutral-950 border border-neutral-400 rounded text-white"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-400 mb-1">
            Beschreibung
          </label>
          <textarea
            value={task.description}
            onChange={(e) =>
              onTaskChange({
                ...task,
                description: e.target.value,
              })
            }
            className="w-full p-2 bg-neutral-950 border border-neutral-400 rounded text-white"
            placeholder="Beschreibung"
            rows={4}
          />
        </div>
        <div className="flex justify-between items-center">
          <button onClick={onDelete} className="text-red-500 flex items-center">
            Löschen
          </button>
          <div>
            <button
              onClick={onClose}
              className="bg-neutral-950 text-neutral-400 px-4 py-2 rounded mr-2 border border-neutral-400"
            >
              Schließen
            </button>
            <button
              onClick={onSave}
              className={`bg-info text-white px-4 py-2 rounded ${
                !task.title.trim() ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!task.title.trim()}
            >
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
