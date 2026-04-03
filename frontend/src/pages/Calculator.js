import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Calculator() {
  const [inputs, setInputs] = useState({ compute: "", storage: "", dataTransfer: "" });
  const [results, setResults] = useState(null);

  const pricing = {
    AWS: { compute: 0.096, storage: 0.023, dataTransfer: 0.09 },
    Azure: { compute: 0.1, storage: 0.02, dataTransfer: 0.087 },
    GCP: { compute: 0.095, storage: 0.02, dataTransfer: 0.08 },
  };

  const calculate = () => {
    const c = parseFloat(inputs.compute) || 0;
    const s = parseFloat(inputs.storage) || 0;
    const d = parseFloat(inputs.dataTransfer) || 0;
    const computed = {};
    for (const provider in pricing) {
      const monthly =
        c * pricing[provider].compute * 730 +
        s * pricing[provider].storage +
        d * pricing[provider].dataTransfer;
      computed[provider] = { monthly: monthly.toFixed(2), yearly: (monthly * 12).toFixed(2) };
    }
    setResults(computed);
  };

  const chartData = results && {
    labels: ["AWS", "Azure", "GCP"],
    datasets: [
      {
        label: "Monthly Cost (USD)",
        data: [results.AWS.monthly, results.Azure.monthly, results.GCP.monthly],
        backgroundColor: ["#FF9900", "#008AD7", "#34A853"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Cloud Cost Calculator</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compute (vCPUs)</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="e.g. 4"
                value={inputs.compute}
                onChange={(e) => setInputs({ ...inputs, compute: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Storage (GB)</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="e.g. 100"
                value={inputs.storage}
                onChange={(e) => setInputs({ ...inputs, storage: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Transfer (GB)</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="e.g. 50"
                value={inputs.dataTransfer}
                onChange={(e) => setInputs({ ...inputs, dataTransfer: e.target.value })}
              />
            </div>
          </div>
          <button onClick={calculate} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-sm">
            Calculate
          </button>
        </div>

        {results && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {Object.entries(results).map(([provider, cost]) => (
                <div key={provider} className="bg-white rounded-lg shadow p-4 text-center">
                  <h2 className="font-bold text-gray-700 mb-2">{provider}</h2>
                  <p className="text-2xl font-bold text-blue-600">${cost.monthly}</p>
                  <p className="text-sm text-gray-500">per month</p>
                  <p className="text-sm text-gray-700 mt-1">${cost.yearly} / year</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Calculator;