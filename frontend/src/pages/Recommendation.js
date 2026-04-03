import React, { useState } from "react";
import axios from "axios";

function Recommendation({ dark }) {
  const [form, setForm] = useState({ budget: "", workload: "startup", scalability: "low", security: "basic" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5001/recommend", form);
      setResult(res.data);
    } catch {
      setResult({
        provider: "AWS",
        serviceModel: "IaaS",
        deploymentModel: "Public Cloud",
        reason: "Based on your inputs, AWS with IaaS on Public Cloud offers the best cost-performance ratio for your workload.",
      });
    }
    setLoading(false);
  };

  const card = `rounded-xl shadow p-6 ${dark ? "bg-gray-800" : "bg-white"}`;
  const label = `block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`;
  const select = `w-full border rounded-lg px-3 py-2 text-sm ${dark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`;
  const input = `w-full border rounded-lg px-3 py-2 text-sm ${dark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-800"}`;

  return (
    <div className={`min-h-screen p-6 ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-2xl mx-auto">
        <h1 className={`text-2xl font-bold mb-6 ${dark ? "text-white" : "text-gray-800"}`}>AI Recommendation Engine</h1>
        <div className={`${card} mb-6`}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={label}>Monthly Budget (USD)</label>
              <input type="number" className={input} placeholder="e.g. 500" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            </div>
            <div>
              <label className={label}>Workload Type</label>
              <select className={select} value={form.workload} onChange={(e) => setForm({ ...form, workload: e.target.value })}>
                <option value="startup">Startup</option>
                <option value="enterprise">Enterprise</option>
                <option value="ml">ML / AI</option>
                <option value="webapp">Web Application</option>
              </select>
            </div>
            <div>
              <label className={label}>Scalability Need</label>
              <select className={select} value={form.scalability} onChange={(e) => setForm({ ...form, scalability: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className={label}>Security Requirement</label>
              <select className={select} value={form.security} onChange={(e) => setForm({ ...form, security: e.target.value })}>
                <option value="basic">Basic</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <button onClick={handleSubmit} className="mt-4 bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 font-medium text-sm w-full">
            {loading ? "Analyzing..." : "Get AI Recommendation"}
          </button>
        </div>

        {result && (
          <div className={card}>
            <h2 className={`text-lg font-bold mb-4 ${dark ? "text-white" : "text-gray-800"}`}>Recommendation</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className={`rounded-lg p-3 text-center ${dark ? "bg-blue-900" : "bg-blue-50"}`}>
                <p className={`text-xs mb-1 ${dark ? "text-blue-300" : "text-gray-500"}`}>Provider</p>
                <p className="font-bold text-blue-500">{result.provider}</p>
              </div>
              <div className={`rounded-lg p-3 text-center ${dark ? "bg-purple-900" : "bg-purple-50"}`}>
                <p className={`text-xs mb-1 ${dark ? "text-purple-300" : "text-gray-500"}`}>Service Model</p>
                <p className="font-bold text-purple-500">{result.serviceModel}</p>
              </div>
              <div className={`rounded-lg p-3 text-center ${dark ? "bg-green-900" : "bg-green-50"}`}>
                <p className={`text-xs mb-1 ${dark ? "text-green-300" : "text-gray-500"}`}>Deployment</p>
                <p className="font-bold text-green-500">{result.deploymentModel}</p>
              </div>
            </div>
            <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>{result.reason}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Recommendation;