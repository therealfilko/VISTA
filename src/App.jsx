import React, { useState, useEffect } from "react";
import FormComponent from "./components/FormComponent";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hello World!
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Willkommen zu unserer Formular-Validierungs-Demo
        </p>
        <FormComponent />
      </div>
    </div>
  );
}

export default App;
