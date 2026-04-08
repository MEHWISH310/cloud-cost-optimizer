import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar({ user, onLogout, dark, setDark }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { path: "/", label: "Dashboard" },
    { path: "/calculator", label: "Calculator" },
    { path: "/comparison", label: "Comparison" },
    { path: "/recommendation", label: "AI Recommendation" },
    { path: "/education", label: "Learn" },
    { path: "/tips", label: "Tips" },
    { path: "/history", label: "History" },
    { path: "/metrics", label: "ML Metrics" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 shadow-md ${dark ? "bg-gray-900 text-white border-b border-gray-700" : "bg-white text-gray-800 border-b border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <img src="/logo.png" alt="CloudBridge" className="w-8 h-8 rounded-lg" />
        <div className="hidden md:flex gap-1 items-center">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm px-3 py-2 rounded-lg transition ${
                location.pathname === link.path
                  ? "bg-blue-600 text-white font-medium"
                  : dark ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition ${dark ? "bg-gray-700 text-yellow-400 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {dark ? "☀" : "☾"}
          </button>
          <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border-2 border-blue-500" />
          <span className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>{user.displayName}</span>
          <button onClick={onLogout} className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 font-medium">
            Logout
          </button>
        </div>
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className={`w-5 h-0.5 mb-1 ${dark ? "bg-white" : "bg-gray-800"}`}></div>
          <div className={`w-5 h-0.5 mb-1 ${dark ? "bg-white" : "bg-gray-800"}`}></div>
          <div className={`w-5 h-0.5 ${dark ? "bg-white" : "bg-gray-800"}`}></div>
        </button>
      </div>
      {menuOpen && (
        <div className={`md:hidden px-4 pb-4 flex flex-col gap-2 ${dark ? "bg-gray-900" : "bg-white"}`}>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm px-3 py-2 rounded-lg ${dark ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button onClick={onLogout} className="text-sm bg-red-500 text-white px-3 py-2 rounded-lg w-fit">Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;