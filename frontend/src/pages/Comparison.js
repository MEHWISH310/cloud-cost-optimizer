import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { auth } from "../firebase";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Comparison({ dark }) {
  const [inputs, setInputs] = useState({ cpu: "", storage: "", dataTransfer: "", region: "us" });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const regions = [
    { value: "us", label: "United States" },
    { value: "eu", label: "Europe" },
    { value: "asia", label: "Asia Pacific" },
  ];

  const bg = dark ? "bg-gray-950" : "bg-gray-50";
  const card = `rounded-xl p-6 shadow-sm border ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`;
  const th = dark ? "text-white" : "text-gray-900";
  const ts = dark ? "text-gray-400" : "text-gray-500";
  const inputCls = `w-full border rounded-lg px-3 py-2 text-sm ${dark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-white border-gray-200 text-gray-800"}`;
  const labelCls = `block text-xs font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-600"}`;
  const tableHead = dark ? "bg-gray-800 text-gray-300" : "bg-gray-50 text-gray-500";
  const tableBorder = dark ? "border-gray-800" : "border-gray-100";
  const tableText = dark ? "text-gray-400" : "text-gray-600";

  const calculate = async () => {
    const cpu = parseFloat(inputs.cpu) || 4;
    const storage = parseFloat(inputs.storage) || 0;
    const dataTransfer = parseFloat(inputs.dataTransfer) || 0;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/pricing/calculate", {
        cpu,
        ram: cpu * 4,
        storage,
        region: inputs.region,
      });

      const d = res.data;
      const storageCosts = { aws: 0.023, azure: 0.02, gcp: 0.02 };
      const transferCosts = { aws: 0.09, azure: 0.087, gcp: 0.08 };

      const final = {
        AWS: {
          instance: d.details.aws.instanceType,
          vcpu: d.inputs.cpu,
          ram: cpu * 4,
          pricePerHour: d.details.aws.pricePerHour,
          monthly: (d.monthlyCosts.aws + storage * storageCosts.aws + dataTransfer * transferCosts.aws).toFixed(2),
          yearly: ((d.monthlyCosts.aws + storage * storageCosts.aws + dataTransfer * transferCosts.aws) * 12).toFixed(2),
          source: d.details.aws.source,
          color: "#FF9900",
        },
        Azure: {
          instance: d.details.azure.skuName,
          vcpu: d.inputs.cpu,
          ram: cpu * 4,
          pricePerHour: d.details.azure.pricePerHour,
          monthly: (d.monthlyCosts.azure + storage * storageCosts.azure + dataTransfer * transferCosts.azure).toFixed(2),
          yearly: ((d.monthlyCosts.azure + storage * storageCosts.azure + dataTransfer * transferCosts.azure) * 12).toFixed(2),
          source: d.details.azure.source,
          color: "#008AD7",
        },
        GCP: {
          instance: d.details.gcp.machineType,
          vcpu: d.inputs.cpu,
          ram: cpu * 4,
          pricePerHour: d.details.gcp.pricePerHour,
          monthly: (d.monthlyCosts.gcp + storage * storageCosts.gcp + dataTransfer * transferCosts.gcp).toFixed(2),
          yearly: ((d.monthlyCosts.gcp + storage * storageCosts.gcp + dataTransfer * transferCosts.gcp) * 12).toFixed(2),
          source: d.details.gcp.source,
          color: "#34A853",
        },
      };

      setResults(final);

      const user = auth.currentUser;
      if (user) {
        await axios.post("http://localhost:5000/api/history/save", {
          uid: user.uid,
          type: "calculation",
          input: inputs,
          output: final,
        });
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const cheapest = results && Object.entries(results).sort((a, b) => a[1].monthly - b[1].monthly)[0][0];

  const chartData = results && {
    labels: ["AWS", "Azure", "GCP"],
    datasets: [{
      label: "Monthly Cost (USD)",
      data: [results.AWS.monthly, results.Azure.monthly, results.GCP.monthly],
      backgroundColor: ["#FF9900", "#008AD7", "#34A853"],
      borderRadius: 6,
    }],
  };

  return (
    <div className={`min-h-screen p-6 ${bg}`}>
      <div className="max-w-5xl mx-auto">
        <h1 className={`text-xl font-bold mb-1 ${th}`}>Cloud Cost Calculator</h1>
        <p className={`text-xs mb-6 ${ts}`}>Enter your requirements to get real pricing with instance recommendations across AWS, Azure, and GCP.</p>

        <div className={`${card} mb-6`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className={labelCls}>vCPUs</label>
              <input type="number" className={inputCls} placeholder="e.g. 4" value={inputs.cpu} onChange={(e) => setInputs({ ...inputs, cpu: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Storage (GB)</label>
              <input type="number" className={inputCls} placeholder="e.g. 100" value={inputs.storage} onChange={(e) => setInputs({ ...inputs, storage: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Data Transfer (GB)</label>
              <input type="number" className={inputCls} placeholder="e.g. 50" value={inputs.dataTransfer} onChange={(e) => setInputs({ ...inputs, dataTransfer: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Region</label>
              <select className={inputCls} value={inputs.region} onChange={(e) => setInputs({ ...inputs, region: e.target.value })}>
                {regions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
          </div>
          <button onClick={calculate} disabled={loading} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium text-sm transition disabled:opacity-50">
            {loading ? "Calculating..." : "Calculate and Compare"}
          </button>
        </div>

        {results && (
          <>
            <div className={`mb-4 p-3 rounded-lg text-xs font-medium ${dark ? "bg-green-900/40 text-green-300 border border-green-800" : "bg-green-50 text-green-700 border border-green-200"}`}>
              Cheapest option: {cheapest} at ${results[cheapest].monthly}/month — saves ${(Math.max(...Object.values(results).map(r => parseFloat(r.monthly))) - parseFloat(results[cheapest].monthly)).toFixed(2)}/month vs most expensive
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {Object.entries(results).map(([provider, data]) => (
                <div key={provider} className={`${card} border-2 ${provider === cheapest ? "border-green-500" : dark ? "border-gray-800" : "border-gray-100"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className={`font-bold text-sm ${th}`}>{provider}</h2>
                    {provider === cheapest && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-medium">Best Value</span>}
                  </div>
                  <p className="text-2xl font-bold text-blue-500 mb-0.5">${data.monthly}</p>
                  <p className={`text-xs mb-3 ${ts}`}>per month</p>
                  <p className={`text-sm font-medium mb-4 ${dark ? "text-gray-300" : "text-gray-700"}`}>${data.yearly}/year</p>
                  <div className={`rounded-lg p-3 ${dark ? "bg-gray-800" : "bg-gray-50"}`}>
                    <p className={`text-xs font-semibold mb-2 ${dark ? "text-gray-300" : "text-gray-600"}`}>Recommended Instance</p>
                    <p className="text-xs font-mono font-bold text-blue-500">{data.instance}</p>
                    <p className={`text-xs mt-1 ${ts}`}>{data.vcpu} vCPU / {data.ram} GB RAM</p>
                    <p className={`text-xs mt-1 ${ts}`}>${data.pricePerHour}/hr</p>
                  </div>
                  <p className={`text-xs mt-2 ${ts}`}>Source: {data.source}</p>
                </div>
              ))}
            </div>

            <div className={`${card} mb-6`}>
              <h2 className={`text-sm font-semibold mb-4 ${th}`}>Monthly Cost Comparison</h2>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: { legend: { labels: { color: dark ? "#fff" : "#333", font: { size: 12 } } } },
                  scales: {
                    x: { ticks: { color: dark ? "#ccc" : "#555" }, grid: { color: dark ? "#374151" : "#f3f4f6" } },
                    y: { ticks: { color: dark ? "#ccc" : "#555" }, grid: { color: dark ? "#374151" : "#f3f4f6" } },
                  },
                }}
              />
            </div>

            <div className={card}>
              <h2 className={`text-sm font-semibold mb-4 ${th}`}>Detailed Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className={tableHead}>
                      <th className="p-3 text-left font-semibold">Feature</th>
                      <th className="p-3 text-center font-semibold">AWS</th>
                      <th className="p-3 text-center font-semibold">Azure</th>
                      <th className="p-3 text-center font-semibold">GCP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Recommended Instance", aws: results.AWS.instance, azure: results.Azure.instance, gcp: results.GCP.instance },
                      { label: "Price per Hour", aws: `$${results.AWS.pricePerHour}`, azure: `$${results.Azure.pricePerHour}`, gcp: `$${results.GCP.pricePerHour}` },
                      { label: "Monthly Cost", aws: `$${results.AWS.monthly}`, azure: `$${results.Azure.monthly}`, gcp: `$${results.GCP.monthly}` },
                      { label: "Yearly Cost", aws: `$${results.AWS.yearly}`, azure: `$${results.Azure.yearly}`, gcp: `$${results.GCP.yearly}` },
                      { label: "Free Tier", aws: "Yes", azure: "Yes", gcp: "Yes" },
                      { label: "SLA Uptime", aws: "99.99%", azure: "99.99%", gcp: "99.99%" },
                      { label: "Global Regions", aws: "31", azure: "60", gcp: "35" },
                      { label: "Pricing Source", aws: results.AWS.source, azure: results.Azure.source, gcp: results.GCP.source },
                    ].map((row, i) => (
                      <tr key={row.label} className={`border-t ${tableBorder} ${i % 2 === 0 ? dark ? "bg-gray-900" : "bg-white" : dark ? "bg-gray-800/50" : "bg-gray-50"}`}>
                        <td className={`p-3 font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>{row.label}</td>
                        <td className={`p-3 text-center font-mono ${row.label === "Monthly Cost" || row.label === "Yearly Cost" ? "font-bold text-blue-500" : tableText}`}>{row.aws}</td>
                        <td className={`p-3 text-center font-mono ${row.label === "Monthly Cost" || row.label === "Yearly Cost" ? "font-bold text-blue-500" : tableText}`}>{row.azure}</td>
                        <td className={`p-3 text-center font-mono ${row.label === "Monthly Cost" || row.label === "Yearly Cost" ? "font-bold text-blue-500" : tableText}`}>{row.gcp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Comparison;