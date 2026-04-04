import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebase";

function History({ dark }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const res = await axios.get(`http://localhost:5000/api/history/${user.uid}`);
          setHistory(res.data);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/history/${id}`);
      setHistory(history.filter((h) => h._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = filter === "all" ? history : history.filter((h) => h.type === filter);

  const card = `rounded-xl shadow p-5 ${dark ? "bg-gray-800" : "bg-white"}`;

  return (
    <div className={`min-h-screen p-6 ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-2xl font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>History</h1>
        <p className={`text-sm mb-6 ${dark ? "text-gray-400" : "text-gray-500"}`}>Your past calculations and recommendations.</p>

        <div className="flex gap-3 mb-6">
          {["all", "calculation", "recommendation"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${filter === f ? "bg-blue-600 text-white" : dark ? "bg-gray-800 text-gray-300 border border-gray-700" : "bg-white text-gray-700 border"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>Loading...</p>
        ) : filtered.length === 0 ? (
          <div className={`${card} text-center py-12`}>
            <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>No history found. Use the Calculator or AI Recommendation to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((item) => (
              <div key={item._id} className={card}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${item.type === "calculation" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                    {item.type}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs ${dark ? "text-gray-400" : "text-gray-400"}`}>
                      {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <button onClick={() => handleDelete(item._id)} className="text-xs text-red-500 hover:text-red-600 font-medium">
                      Delete
                    </button>
                  </div>
                </div>

                {item.type === "calculation" ? (
                  <div>
                    <p className={`text-sm font-medium mb-2 ${dark ? "text-gray-300" : "text-gray-700"}`}>
                      Compute: {item.input.compute} vCPUs, Storage: {item.input.storage} GB, Transfer: {item.input.dataTransfer} GB
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(item.output).map(([provider, cost]) => (
                        <div key={provider} className={`rounded-lg p-3 text-center ${dark ? "bg-gray-700" : "bg-gray-50"}`}>
                          <p className={`text-xs font-semibold mb-1 ${dark ? "text-gray-400" : "text-gray-500"}`}>{provider}</p>
                          <p className="text-sm font-bold text-blue-500">${cost.monthly}/mo</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className={`text-sm font-medium mb-2 ${dark ? "text-gray-300" : "text-gray-700"}`}>
                      Workload: {item.input.workload}, Budget: ${item.input.budget}, Security: {item.input.security}
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className={`rounded-lg p-3 text-center ${dark ? "bg-blue-900" : "bg-blue-50"}`}>
                        <p className={`text-xs mb-1 ${dark ? "text-blue-300" : "text-gray-500"}`}>Provider</p>
                        <p className="font-bold text-blue-500 text-sm">{item.output.provider}</p>
                      </div>
                      <div className={`rounded-lg p-3 text-center ${dark ? "bg-purple-900" : "bg-purple-50"}`}>
                        <p className={`text-xs mb-1 ${dark ? "text-purple-300" : "text-gray-500"}`}>Service Model</p>
                        <p className="font-bold text-purple-500 text-sm">{item.output.serviceModel}</p>
                      </div>
                      <div className={`rounded-lg p-3 text-center ${dark ? "bg-green-900" : "bg-green-50"}`}>
                        <p className={`text-xs mb-1 ${dark ? "text-green-300" : "text-gray-500"}`}>Deployment</p>
                        <p className="font-bold text-green-500 text-sm">{item.output.deploymentModel}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;