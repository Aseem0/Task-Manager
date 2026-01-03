import { Routes, Route } from "react-router-dom";
import "./App.css";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Admin from "./pages/admin";
import Manager from "./pages/manager";

import ManagerLayout from "./Components/managerlayout";
import ManagerDashboard from "./Components/managerdashboard";
import ManagerAnalytics from "./Components/manageranalytics";
import ManagerProject from "./Components/managerproject";
import ManagerTasks from "./Components/managertasks";
import ManagerEmployees from "./Components/manageremployees";
import ManagerSettings from "./Components/managersettings";

function App() {
  return (
    <>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        {/* MANAGER ROUTES */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<ManagerDashboard />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="analytics" element={<ManagerAnalytics />} />
          <Route path="project" element={<ManagerProject />} />
          <Route path="tasks" element={<ManagerTasks />} />
          <Route path="employees" element={<ManagerEmployees />} />
          <Route path="settings" element={<ManagerSettings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
