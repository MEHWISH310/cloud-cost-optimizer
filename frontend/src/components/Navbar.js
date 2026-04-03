import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { path: "/", label: "Dashboard" },
    { path: "/calculator", label: "Calculator" },
    { path: "/comparison", label: "Comparison" },
    { path: "/recommendation", label: "AI Recommendation" },
    { path: "/education", label: "Learn" },
    { path: "/tips", label: "Tips" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue-700 text-white z-50 shadow">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <span className="font-bold text-lg">CloudOptimizer</span>
        <div className="hidden md:flex gap-6 items-center">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm hover:text-yellow-300 ${location.pathname === link.path ? "text-yellow-300 font-semibold" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
          <span className="text-sm">{user.displayName}</span>
          <button onClick={onLogout} className="text-sm bg-white text-blue-700 px-3 py-1 rounded hover:bg-gray-100">
            Logout
          </button>
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          Menu
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-blue-800 px-4 pb-4 flex flex-col gap-3">
          {links.map((link) => (
            <Link key={link.path} to={link.path} className="text-sm hover:text-yellow-300" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <button onClick={onLogout} className="text-sm bg-white text-blue-700 px-3 py-1 rounded w-fit">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;