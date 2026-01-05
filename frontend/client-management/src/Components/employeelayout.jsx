import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const EmployeeLayout = () => {
  const location = useLocation();

  const pageTitles = {
    dashboard: "Manager Dashboard",
    analytics: "Manager Analytics",
    project: "Manager Projects",
    tasks: "Manager Tasks",
    employees: "Manager Employees",
    settings: "Manager Settings",
  };

  // get last part of the URL
  const currentPath = location.pathname.split("/").pop();

  // fallback title
  const pageTitle = pageTitles[currentPath] || "Manager Dashboard";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="bg-slate-800 text-white w-64 min-h-screen p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold">ClientX</h1>
        </div>

        <nav className="space-y-2">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              `block items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="analytics"
            className={({ isActive }) =>
              `block items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            Analytics
          </NavLink>
          <NavLink
            to="project"
            className={({ isActive }) =>
              `block items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            Project
          </NavLink>
          <NavLink
            to="tasks"
            className={({ isActive }) =>
              `block items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            Tasks
          </NavLink>
          <NavLink
            to="employees"
            className={({ isActive }) =>
              `block items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            Employees
          </NavLink>
          <NavLink
            to="settings"
            className={({ isActive }) =>
              `block items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            Settings
          </NavLink>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-slate-800 text-white p-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">{pageTitle}</h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="search"
                placeholder="Search..."
                className="bg-slate-700 text-white px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-slate-700 rounded-md">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-gray-50">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-blue-900 text-white p-8 m-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ClientX</h3>
              <p className="text-blue-100 text-sm mb-4">
                ClientX is a task management system to help manage client tasks
                and projects efficiently.
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center hover:bg-blue-400"
                >
                  <span className="text-sm">f</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-red-500 rounded flex items-center justify-center hover:bg-red-400"
                >
                  <span className="text-sm">@</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-gray-700"
                >
                  <span className="text-sm">#</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center hover:bg-blue-600"
                >
                  <span className="text-sm">in</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Join Us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact us</h4>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>clientx@example.com</li>
                <li>+1 234 567 890</li>
                <li>www.clientx.com/contact</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-500 mt-8 pt-4 flex justify-between items-center text-sm text-blue-100">
            <p>clientx@example.com</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">
                Privacy
              </a>
              <a href="#" className="hover:text-white">
                Terms
              </a>
              <a href="#" className="hover:text-white">
                Sitemap
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default EmployeeLayout;
