import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded shadow-md" id="column-1">
          <h2 className="font-semibold mb-2">To Do</h2>
          {/* Tickets */}
        </div>
        <div className="bg-gray-100 p-4 rounded shadow-md" id="column-2">
          <h2 className="font-semibold mb-2">In Progress</h2>
          {/* Tickets */}
        </div>
        <div className="bg-gray-100 p-4 rounded shadow-md" id="column-3">
          <h2 className="font-semibold mb-2">Done</h2>
          {/* Tickets */}
        </div>
      </div>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => console.log('Ticket hinzufügen')}
      >
        Ticket hinzufügen
      </button>
    </div>
  );
};

export default Dashboard;
