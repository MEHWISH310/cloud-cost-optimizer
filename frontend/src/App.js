import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Comparison from "./pages/Comparison";
import Recommendation from "./pages/Recommendation";
import Education from "./pages/Education";
import Tips from "./pages/Tips";
import History from "./pages/History";
import Metrics from "./pages/Metrics";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        try {
          await axios.post("http://localhost:5000/api/history/user", {
            uid: currentUser.uid,
            name: currentUser.displayName,
            email: currentUser.email,
            photo: currentUser.photoURL,
          });
        } catch (err) {
          console.error("User registration error:", err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) return (
    <div className={`flex items-center justify-center h-screen text-base font-medium ${dark ? "bg-gray-950 text-white" : "bg-slate-50 text-gray-700"}`}>
      Loading...
    </div>
  );

  if (!user) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${dark ? "bg-gray-950" : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"}`}>
        <div className={`rounded-3xl shadow-2xl text-center w-[420px] overflow-hidden ${dark ? "bg-gray-900 text-white" : "bg-white"}`}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-10 pt-10 pb-8">
            <img src="/logo.png" alt="CloudBridge" className="w-20 h-20 rounded-2xl mx-auto mb-5 shadow-lg" />
            <h1 className="text-2xl font-bold text-white mb-1">CloudBridge</h1>
            <p className="text-blue-100 text-sm">AI-powered cloud cost optimization</p>
          </div>
          <div className="px-10 py-8">
            <p className={`text-sm mb-6 ${dark ? "text-gray-400" : "text-gray-500"}`}>Sign in with your Google account to get started</p>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-medium flex items-center justify-center gap-3 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"/></svg>
              Continue with Google
            </button>
            <button onClick={() => setDark(!dark)} className={`mt-4 text-xs hover:underline ${dark ? "text-gray-500" : "text-gray-400"}`}>
              {dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} dark={dark} setDark={setDark} />
      <div className={`pt-16 min-h-screen ${dark ? "bg-gray-950 text-white" : "bg-slate-50"}`}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} dark={dark} />} />
          <Route path="/comparison" element={<Comparison dark={dark} />} />
          <Route path="/recommendation" element={<Recommendation dark={dark} />} />
          <Route path="/education" element={<Education dark={dark} />} />
          <Route path="/tips" element={<Tips dark={dark} />} />
          <Route path="/history" element={<History dark={dark} />} />
          <Route path="/metrics" element={<Metrics dark={dark} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;