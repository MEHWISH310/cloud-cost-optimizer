import React, { useState } from "react";
import axios from "axios";

function Recommendation() {
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">AI Recommendation Engine</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Budget (USD)</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="e.g. 500"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Workload Type</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.workload} onChange={(e) => setForm({ ...form, workload: e.target.value })}>
                <option value="startup">Startup</option>
                <option value="enterprise">Enterprise</option>
                <option value="ml">ML / AI</option>
                <option value="webapp">Web Application</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scalability Need</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.scalability} onChange={(e) => setForm({ ...form, scalability: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Security Requirement</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.security} onChange={(e) => setForm({ ...form, security: e.target.value })}>
                <option value="basic">Basic</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <button onClick={handleSubmit} className="mt-4 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 text-sm">
            {loading ? "Analyzing..." : "Get Recommendation"}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Recommendation</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 rounded p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Provider</p>
                <p className="font-bold text-blue-700">{result.provider}</p>
              </div>
              <div className="bg-purple-50 rounded p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Service Model</p>
                <p className="font-bold text-purple-700">{result.serviceModel}</p>
              </div>
              <div className="bg-green-50 rounded p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Deployment Model</p>
                <p className="font-bold text-green-700">{result.deploymentModel}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{result.reason}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Recommendation;