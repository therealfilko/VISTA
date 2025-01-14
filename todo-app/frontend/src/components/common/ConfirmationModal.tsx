// components/common/ConfirmationModal.tsx
import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-neutral-900 p-6 rounded shadow-md w-1/3 text-white">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Ja
          </button>
          <button
            onClick={onCancel}
            className="bg-neutral-950 text-neutral-400 px-4 py-2 rounded border border-neutral-400"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
