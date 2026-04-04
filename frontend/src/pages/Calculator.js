import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { auth } from "../firebase";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Calculator({ dark }) {
  const [inputs, setInputs] = useState({ compute: "", storage: "", dataTransfer: "" });
  const [results, setResults] = useState(null);

  const pricing = {
    AWS: { compute: 0.096, storage: 0.023, dataTransfer: 0.09 },
    Azure: { compute: 0.1, storage: 0.02, dataTransfer: 0.087 },
    GCP: { compute: 0.095, storage: 0.02, dataTransfer: 0.08 },
  };

  const calculate = async () => {
    const c = parseFloat(inputs.compute) || 0;
    const s = parseFloat(inputs.storage) || 0;
    const d = parseFloat(inputs.dataTransfer) || 0;
    const computed = {};
    for (const provider in pricing) {
      const monthly = c * pricing[provider].compute * 730 + s * pricing[provider].storage + d * pricing[provider].dataTransfer;
      computed[provider] = { monthly: monthly.toFixed(2), yearly: (monthly * 12).toFixed(2) };
    }
    setResults(computed);
    try {
      const user = auth.currentUser;
      if (user) {
        await axios.post("http://localhost:5000/api/history/save", {
          uid: user.uid,
          type: "calculation",
          input: inputs,
          output: computed,
        });
      }
    } catch (err) {
      console.error("History save error:", err);
    }
  };

  const cheapest = results && Object.entries(results).sort((a, b) => a[1].monthly - b[1].monthly)[0][0];

  const chartData = results && {
    labels: ["AWS", "Azure", "GCP"],
    datasets: [
      {
        label: "Monthly Cost (USD)",
        data: [results.AWS.monthly, results.Azure.monthly, results.GCP.monthly],
        backgroundColor: ["#FF9900", "#008AD7", "#34A853"],
        borderRadius: 8,
      },
    ],
  };

  const card = `rounded-xl p-6 shadow ${dark ? "bg-gray-800" : "bg-white"}`;
  const label = `block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`;
  const input = `w-full border rounded-lg px-3 py-2 text-sm ${dark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-800"}`;

  return (
    <div className={`min-h-screen p-6 ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-3xl mx-auto">
        <h1 className={`text-2xl font-bold mb-6 ${dark ? "text-white" : "text-gray-800"}`}>Cloud Cost Calculator</h1>
        <div className={`${card} mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={label}>Compute (vCPUs)</label>
              <input type="number" className={input} placeholder="e.g. 4" value={inputs.compute} onChange={(e) => setInputs({ ...inputs, compute: e.target.value })} />
            </div>
            <div>
              <label className={label}>Storage (GB)</label>
              <input type="number" className={input} placeholder="e.g. 100" value={inputs.storage} onChange={(e) => setInputs({ ...inputs, storage: e.target.value })} />
            </div>
            <div>
              <label className={label}>Data Transfer (GB)</label>
              <input type="number" className={input} placeholder="e.g. 50" value={inputs.dataTransfer} onChange={(e) => setInputs({ ...inputs, dataTransfer: e.target.value })} />
            </div>
          </div>
          <button onClick={calculate} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium text-sm">
            Calculate Cost
          </button>
        </div>

        {results && (
          <>
            <div className={`mb-4 p-3 rounded-lg text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>
              Cheapest option: {cheapest} at ${results[cheapest].monthly}/month
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {Object.entries(results).map(([provider, cost]) => (
                <div key={provider} className={`${card} text-center border-2 ${provider === cheapest ? "border-green-500" : "border-transparent"}`}>
                  <h2 className={`font-bold mb-2 ${dark ? "text-white" : "text-gray-700"}`}>{provider}</h2>
                  <p className="text-2xl font-bold text-blue-500">${cost.monthly}</p>
                  <p className={`text-xs mt-1 ${dark ? "text-gray-400" : "text-gray-500"}`}>per month</p>
                  <p className={`text-sm mt-1 font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>${cost.yearly}/year</p>
                  {provider === cheapest && <span className="inline-block mt-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Best Value</span>}
                </div>
              ))}
            </div>
            <div className={card}>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: { legend: { labels: { color: dark ? "#fff" : "#333" } } },
                  scales: {
                    x: { ticks: { color: dark ? "#ccc" : "#555" } },
                    y: { ticks: { color: dark ? "#ccc" : "#555" } },
                  },
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Calculator;