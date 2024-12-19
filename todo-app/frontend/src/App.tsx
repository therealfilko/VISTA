import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/register"; // Registrierungsseite importieren

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Neue Route */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Dashboard />} /> {/* Fallback */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
