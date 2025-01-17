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
      <div className="bg-[#121212] p-6 rounded shadow-md w-2/3 text-white">
        <h2 className="text-xl font-bold mb-4">Ticket</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-[#b3b3b3] mb-1">
              Titel <span className="text-[#20d760]">*</span>
            </label>
            <input
              type="text"
              value={task.title}
              onChange={(e) => onTaskChange({ ...task, title: e.target.value })}
              className="w-full p-2 bg-[#000000] border border-[#1f1f1f] rounded text-white
                       placeholder-[#b3b3b3] focus:border-[#20d760] focus:ring-1 focus:ring-[#20d760]
                       transition-colors duration-200"
              placeholder="Titel der Aufgabe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#b3b3b3] mb-1">
              Verschiebe in Spalte
            </label>
            <select
              value={currentColumn || ""}
              onChange={(e) => onColumnChange(e.target.value)}
              className="w-full p-2 bg-[#000000] border border-[#1f1f1f] rounded text-white
                       focus:border-[#20d760] focus:ring-1 focus:ring-[#20d760]
                       transition-colors duration-200"
            >
              {Object.entries(columns).map(([columnId, column]) => (
                <option key={columnId} value={columnId}>
                  {column.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#b3b3b3] mb-1">
              Bearbeiter
            </label>
            <select
              value={task.assignee}
              onChange={(e) =>
                onTaskChange({ ...task, assignee: e.target.value })
              }
              className="w-full p-2 bg-[#000000] border border-[#1f1f1f] rounded text-white
                       focus:border-[#20d760] focus:ring-1 focus:ring-[#20d760]
                       transition-colors duration-200"
            >
              <option value="">Wähle Bearbeiter</option>
              <option value="Mitarbeiter 1">Mitarbeiter 1</option>
              <option value="Mitarbeiter 2">Mitarbeiter 2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#b3b3b3] mb-1">
              Deadline
            </label>
            <input
              type="date"
              value={task.deadline}
              onChange={(e) =>
                onTaskChange({ ...task, deadline: e.target.value })
              }
              className="w-full p-2 bg-[#000000] border border-[#1f1f1f] rounded text-white
                       focus:border-[#20d760] focus:ring-1 focus:ring-[#20d760]
                       transition-colors duration-200"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#b3b3b3] mb-1">
            Beschreibung
          </label>
          <textarea
            value={task.description}
            onChange={(e) =>
              onTaskChange({ ...task, description: e.target.value })
            }
            className="w-full p-2 bg-[#000000] border border-[#1f1f1f] rounded text-white
                     placeholder-[#b3b3b3] focus:border-[#20d760] focus:ring-1 focus:ring-[#20d760]
                     transition-colors duration-200"
            placeholder="Beschreibung"
            rows={4}
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-600 transition-colors duration-200"
          >
            Löschen
          </button>
          <div>
            <button
              onClick={onClose}
              className="bg-[#000000] text-[#b3b3b3] px-4 py-2 rounded mr-2
                       border border-[#1f1f1f] hover:bg-[#1f1f1f]
                       transition-colors duration-200"
            >
              Schließen
            </button>
            <button
              onClick={onSave}
              className={`bg-[#20d760] text-white px-4 py-2 rounded
                      hover:bg-[#2bec6f] transition-colors duration-200
                      ${!task.title.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
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
