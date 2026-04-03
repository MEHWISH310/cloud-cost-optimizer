import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {isAuthenticated ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <img src={user.picture} alt={user.name} className="rounded-full w-16 h-16 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Welcome, {user.name}</h2>
          <p className="text-gray-500 mb-4">{user.email}</p>
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
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
            onClick={() => loginWithRedirect()}
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