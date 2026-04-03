import React, { useEffect, useState } from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

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

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {user ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <img src={user.photoURL} alt={user.displayName} className="rounded-full w-16 h-16 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Welcome, {user.displayName}</h2>
          <p className="text-gray-500 mb-4">{user.email}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded shadow text-center">
          <h1 className="text-2xl font-bold mb-4">Cloud Cost Optimizer</h1>
          <p className="text-gray-500 mb-6">Sign in to continue</p>
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
}

export default App;