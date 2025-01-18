import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PatientInfoPage from "./pages/PatientInfoPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [mode, setMode] = useState("adult"); // Default mode is 'Adult Mode'

  // Handle mode changes from the Navbar
  const handleModeChange = (selectedMode) => {
    setMode(selectedMode); // Update the mode based on the user's selection
  };

  return (
    <Router>
      <Navbar onModeChange={handleModeChange} /> {/* Pass the mode change handler to Navbar */}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage mode={mode} /> {/* Pass the selected mode to HomePage */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-info"
          element={
            <ProtectedRoute>
              <PatientInfoPage mode={mode} /> {/* Pass the selected mode to PatientInfoPage */}
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
