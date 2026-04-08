import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar({ user, onLogout, dark, setDark }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const links = [
  { path: "/", label: "Dashboard" },
  { path: "/comparison", label: "Cost Calculator" },
  { path: "/recommendation", label: "AI Recommendation" },
  { path: "/education", label: "Learn" },
  { path: "/tips", label: "Tips" },
  { path: "/history", label: "History" },
  { path: "/metrics", label: "ML Metrics" },
];

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const SunIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );

  const MoonIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${dark ? "bg-gray-900 border-b border-gray-800" : "bg-white border-b border-gray-200"} shadow-sm`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[64px]">

        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src="/logo.png" alt="CloudBridge" className="w-10 h-10 rounded-xl" />
          <span className={`font-bold text-lg tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>CloudBridge</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1 mx-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                location.pathname === link.path
                  ? "bg-blue-600 text-white"
                  : dark
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <button
            onClick={() => setDark(!dark)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
              dark ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                dark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <img src={user.photoURL} alt={user.displayName} className="w-7 h-7 rounded-full" />
              <span className={`text-sm font-medium ${dark ? "text-gray-200" : "text-gray-800"}`}>
                {user.displayName.split(" ")[0]}
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={dark ? "text-gray-400" : "text-gray-500"}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {profileOpen && (
              <div className={`absolute right-0 mt-2 w-60 rounded-xl shadow-lg border py-2 ${dark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
                <div className={`px-4 py-3 border-b ${dark ? "border-gray-700" : "border-gray-100"}`}>
                  <p className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{user.displayName}</p>
                  <p className={`text-xs mt-0.5 ${dark ? "text-gray-400" : "text-gray-500"}`}>{user.email}</p>
                </div>
                <button
                  onClick={() => { setProfileOpen(false); onLogout(); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>

        <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className={`w-5 h-0.5 mb-1.5 ${dark ? "bg-white" : "bg-gray-700"}`}></div>
          <div className={`w-5 h-0.5 mb-1.5 ${dark ? "bg-white" : "bg-gray-700"}`}></div>
          <div className={`w-5 h-0.5 ${dark ? "bg-white" : "bg-gray-700"}`}></div>
        </button>
      </div>

      {menuOpen && (
        <div className={`lg:hidden px-4 pb-4 flex flex-col gap-1 ${dark ? "bg-gray-900" : "bg-white"}`}>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm px-3 py-2 rounded-lg ${
                location.pathname === link.path
                  ? "bg-blue-600 text-white"
                  : dark ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button onClick={onLogout} className="text-sm text-red-500 px-3 py-2 rounded-lg text-left hover:bg-red-50 mt-1">
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;