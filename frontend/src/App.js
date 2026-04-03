import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import Comparison from "./pages/Comparison";
import Recommendation from "./pages/Recommendation";
import Education from "./pages/Education";
import Tips from "./pages/Tips";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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

  if (loading) return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <h1 className="text-2xl font-bold mb-4">Cloud Cost Optimizer</h1>
          <p className="text-gray-500 mb-6">Sign in to continue</p>
          <button onClick={handleLogin} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/recommendation" element={<Recommendation />} />
          <Route path="/education" element={<Education />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;