import { Routes, Route } from "react-router-dom";
import "./App.css";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Admin from "./pages/admin";
import Manager from "./pages/manager";

import ManagerLayout from "./Components/managerlayout";
import ManagerDashboard from "./Components/managerdashboard";
import ManagerAnalytics from "./Components/manageranalytics";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        {/* MANAGER ROUTES */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<ManagerDashboard />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="analytics" element={<ManagerAnalytics />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
