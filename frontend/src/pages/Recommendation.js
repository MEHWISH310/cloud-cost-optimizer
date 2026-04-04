import React, { useState } from "react";
import axios from "axios";
import { auth } from "../firebase";

function Recommendation({ dark }) {
  const [form, setForm] = useState({
    budget: "",
    workload: "startup",
    scalability: "low",
    security: "basic",
    region: "us",
    team_size: "",
    data_volume_gb: "",
    uptime_requirement: "99.9",
    compliance_required: 0,
    existing_infra: 0,
    uses_microsoft_stack: 0,
    uses_google_workspace: 0,
    multi_region: 0,
    serverless_preference: 0,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        budget: parseFloat(form.budget) || 500,
        team_size: parseFloat(form.team_size) || 10,
        data_volume_gb: parseFloat(form.data_volume_gb) || 100,
        uptime_requirement: parseFloat(form.uptime_requirement) || 99.9,
      };
      const res = await axios.post("http://localhost:5001/recommend", payload);
      setResult(res.data);
      await axios.post("http://localhost:5000/api/history/save", {
  uid: (await auth.currentUser).uid,
  type: "recommendation",
  input: payload,
  output: res.data,
});
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const card = `rounded-xl shadow p-6 ${dark ? "bg-gray-800" : "bg-white"}`;
  const label = `block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`;
  const select = `w-full border rounded-lg px-3 py-2 text-sm ${dark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`;
  const input = `w-full border rounded-lg px-3 py-2 text-sm ${dark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-800"}`;
  const checkboxLabel = `flex items-center gap-2 text-sm ${dark ? "text-gray-300" : "text-gray-700"}`;

  return (
    <div className={`min-h-screen p-6 ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-2xl mx-auto">
        <h1 className={`text-2xl font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>AI Recommendation Engine</h1>
        <p className={`text-sm mb-6 ${dark ? "text-gray-400" : "text-gray-500"}`}>Fill in your requirements and the AI model will recommend the best cloud setup for you.</p>

        <div className={`${card} mb-6`}>
          <h2 className={`text-sm font-semibold uppercase tracking-wide mb-4 ${dark ? "text-gray-400" : "text-gray-500"}`}>Basic Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={label}>Monthly Budget (USD)</label>
              <input type="number" className={input} placeholder="e.g. 500" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            </div>
            <div>
              <label className={label}>Team Size</label>
              <input type="number" className={input} placeholder="e.g. 10" value={form.team_size} onChange={(e) => setForm({ ...form, team_size: e.target.value })} />
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
              <label className={label}>Region</label>
              <select className={select} value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
                <option value="us">United States</option>
                <option value="eu">Europe</option>
                <option value="asia">Asia Pacific</option>
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
            <div>
              <label className={label}>Data Volume (GB)</label>
              <input type="number" className={input} placeholder="e.g. 100" value={form.data_volume_gb} onChange={(e) => setForm({ ...form, data_volume_gb: e.target.value })} />
            </div>
            <div>
              <label className={label}>Uptime Requirement (%)</label>
              <input type="number" className={input} placeholder="e.g. 99.9" value={form.uptime_requirement} onChange={(e) => setForm({ ...form, uptime_requirement: e.target.value })} />
            </div>
          </div>

          <h2 className={`text-sm font-semibold uppercase tracking-wide mb-3 mt-2 ${dark ? "text-gray-400" : "text-gray-500"}`}>Additional Factors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className={checkboxLabel}>
              <input type="checkbox" checked={form.compliance_required === 1} onChange={(e) => setForm({ ...form, compliance_required: e.target.checked ? 1 : 0 })} />
              Compliance Required (GDPR, HIPAA)
            </label>
            <label className={checkboxLabel}>
              <input type="checkbox" checked={form.existing_infra === 1} onChange={(e) => setForm({ ...form, existing_infra: e.target.checked ? 1 : 0 })} />
              Existing On-Premise Infrastructure
            </label>
            <label className={checkboxLabel}>
              <input type="checkbox" checked={form.uses_microsoft_stack === 1} onChange={(e) => setForm({ ...form, uses_microsoft_stack: e.target.checked ? 1 : 0 })} />
              Uses Microsoft Stack (Windows, .NET, AD)
            </label>
            <label className={checkboxLabel}>
              <input type="checkbox" checked={form.uses_google_workspace === 1} onChange={(e) => setForm({ ...form, uses_google_workspace: e.target.checked ? 1 : 0 })} />
              Uses Google Workspace
            </label>
            <label className={checkboxLabel}>
              <input type="checkbox" checked={form.multi_region === 1} onChange={(e) => setForm({ ...form, multi_region: e.target.checked ? 1 : 0 })} />
              Multi-Region Deployment Needed
            </label>
            <label className={checkboxLabel}>
              <input type="checkbox" checked={form.serverless_preference === 1} onChange={(e) => setForm({ ...form, serverless_preference: e.target.checked ? 1 : 0 })} />
              Prefer Serverless Architecture
            </label>
          </div>

          <button onClick={handleSubmit} className="mt-6 bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 font-medium text-sm w-full">
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
            <p className={`text-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>{result.reason}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Recommendation;