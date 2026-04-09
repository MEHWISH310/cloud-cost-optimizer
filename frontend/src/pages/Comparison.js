import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { auth } from "../firebase";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function SliderField({ label, min, max, step, value, onChange, dark, unit = "" }) {
  const labelCls = `block text-xs font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-600"}`;
  const valCls = `text-xs font-semibold ${dark ? "text-white" : "text-gray-900"}`;
  const mutedCls = `text-xs ${dark ? "text-gray-500" : "text-gray-400"}`;

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex items-center justify-between mb-1.5">
        <span className={mutedCls}>{min}{unit}</span>
        <span className={valCls}>
          {value}{unit}
        </span>
        <span className={mutedCls}>{max}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-blue-500"
        style={{
          background: dark
            ? `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, #374151 ${((value - min) / (max - min)) * 100}%, #374151 100%)`
            : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, #d1d5db ${((value - min) / (max - min)) * 100}%, #d1d5db 100%)`,
        }}
      />
    </div>
  );
}

function Comparison({ dark }) {
  const [inputs, setInputs] = useState({ cpu: 4, storage: 100, dataTransfer: 50, region: "us" });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pricingType, setPricingType] = useState("onDemand");

  const regions = [
    { value: "us", label: "United States" },
    { value: "eu", label: "Europe" },
    { value: "asia", label: "Asia Pacific" },
  ];

  const pricingOptions = [
    { value: "onDemand", label: "On-Demand" },
    { value: "spot", label: "Spot (Best for interruption-tolerant)" },
    { value: "reserved", label: "Reserved (1-3 year commitment)" },
    { value: "savingsPlan", label: "Savings Plan" },
  ];

  const bg = dark ? "bg-gray-950" : "bg-gray-50";
  const card = `rounded-xl p-6 shadow-sm border ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`;
  const th = dark ? "text-white" : "text-gray-900";
  const ts = dark ? "text-gray-400" : "text-gray-500";
  const inputCls = `w-full border rounded-lg px-3 py-2 text-sm ${dark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"}`;
  const labelCls = `block text-xs font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-600"}`;
  const tableHead = dark ? "bg-gray-800 text-gray-300" : "bg-gray-50 text-gray-500";
  const tableBorder = dark ? "border-gray-800" : "border-gray-100";
  const tableText = dark ? "text-gray-400" : "text-gray-600";

  const calculate = async () => {
    const { cpu, storage, dataTransfer, region } = inputs;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/pricing/calculate", {
        cpu,
        ram: cpu * 4,
        storage,
        region,
        pricingType,
      });

      const d = res.data;
      const storageCosts = { aws: 0.023, azure: 0.02, gcp: 0.02 };
      const transferCosts = { aws: 0.09, azure: 0.087, gcp: 0.08 };

      const makeEntry = (provider, providerKey, instanceName, colorHex, source, pricingData) => {
        const computeCost = pricingData.monthlyPrice;
        const storageCost = storage * storageCosts[providerKey];
        const transferCost = dataTransfer * transferCosts[providerKey];
        const monthly = (computeCost + storageCost + transferCost).toFixed(2);
        return {
          instance: instanceName,
          vcpu: pricingData.vcpu,
          ram: pricingData.memory,
          pricePerHour: pricingData.pricePerHour,
          compute: computeCost.toFixed(2),
          storage: storageCost.toFixed(2),
          transfer: transferCost.toFixed(2),
          monthly,
          yearly: (parseFloat(monthly) * 12).toFixed(2),
          source,
          color: colorHex,
        };
      };

      const final = {
        AWS: makeEntry("AWS", "aws", d.details.aws.instanceType, "#FF9900", d.details.aws.source, d.details.aws),
        Azure: makeEntry("Azure", "azure", d.details.azure.skuName, "#008AD7", d.details.azure.source, d.details.azure),
        GCP: makeEntry("GCP", "gcp", d.details.gcp.machineType, "#34A853", d.details.gcp.source, d.details.gcp),
      };

      setResults(final);

      const user = auth.currentUser;
      if (user) {
        await axios.post("http://localhost:5000/api/history/save", {
          uid: user.uid,
          type: "calculation",
          input: { ...inputs, pricingType },
          output: final,
        });
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const cheapest = results && Object.entries(results).sort((a, b) => parseFloat(a[1].monthly) - parseFloat(b[1].monthly))[0][0];

  const chartDefaults = {
    plugins: {
      legend: {
        labels: { color: dark ? "#fff" : "#333", font: { size: 11 } },
      },
    },
  };

  const barData = results && {
    labels: ["AWS", "Azure", "GCP"],
    datasets: [
      {
        label: `Monthly Cost (USD) - ${pricingOptions.find(p => p.value === pricingType)?.label || "On-Demand"}`,
        data: [parseFloat(results.AWS.monthly), parseFloat(results.Azure.monthly), parseFloat(results.GCP.monthly)],
        backgroundColor: ["#FF9900", "#008AD7", "#34A853"],
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const tableRows = results
    ? [
        { label: "Recommended Instance", aws: results.AWS.instance, azure: results.Azure.instance, gcp: results.GCP.instance },
        { label: "vCPU / RAM", aws: `${results.AWS.vcpu} / ${results.AWS.ram}GB`, azure: `${results.Azure.vcpu} / ${results.Azure.ram}GB`, gcp: `${results.GCP.vcpu} / ${results.GCP.ram}GB` },
        { label: "Price per Hour", aws: `$${results.AWS.pricePerHour}`, azure: `$${results.Azure.pricePerHour}`, gcp: `$${results.GCP.pricePerHour}` },
        { label: "Compute Cost/mo", aws: `$${results.AWS.compute}`, azure: `$${results.Azure.compute}`, gcp: `$${results.GCP.compute}` },
        { label: "Storage Cost/mo", aws: `$${results.AWS.storage}`, azure: `$${results.Azure.storage}`, gcp: `$${results.GCP.storage}` },
        { label: "Transfer Cost/mo", aws: `$${results.AWS.transfer}`, azure: `$${results.Azure.transfer}`, gcp: `$${results.GCP.transfer}` },
        { label: "Monthly Total", aws: `$${results.AWS.monthly}`, azure: `$${results.Azure.monthly}`, gcp: `$${results.GCP.monthly}`, highlight: true },
        { label: "Yearly Total", aws: `$${results.AWS.yearly}`, azure: `$${results.Azure.yearly}`, gcp: `$${results.GCP.yearly}`, highlight: true },
        { label: "Free Tier", aws: "Yes", azure: "Yes", gcp: "Yes" },
        { label: "SLA Uptime", aws: "99.99%", azure: "99.99%", gcp: "99.99%" },
        { label: "Global Regions", aws: "31", azure: "60", gcp: "35" },
        { label: "Pricing Source", aws: results.AWS.source, azure: results.Azure.source, gcp: results.GCP.source },
      ]
    : [];

  return (
    <div className={`min-h-screen p-6 ${bg}`}>
      <div className="max-w-5xl mx-auto">
        <h1 className={`text-xl font-bold mb-1 ${th}`}>Cloud Cost Calculator</h1>
        <p className={`text-xs mb-6 ${ts}`}>
          Adjust sliders to get real pricing with instance recommendations across AWS, Azure, and GCP.
        </p>

        <div className={`${card} mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mb-5">
            <SliderField
              label="vCPUs"
              min={1} max={64} step={1}
              value={inputs.cpu}
              onChange={(v) => setInputs({ ...inputs, cpu: v })}
              dark={dark}
            />
            <SliderField
              label="Storage (GB)"
              min={0} max={2000} step={10}
              value={inputs.storage}
              onChange={(v) => setInputs({ ...inputs, storage: v })}
              dark={dark}
              unit=" GB"
            />
            <SliderField
              label="Data Transfer (GB)"
              min={0} max={1000} step={10}
              value={inputs.dataTransfer}
              onChange={(v) => setInputs({ ...inputs, dataTransfer: v })}
              dark={dark}
              unit=" GB"
            />
            <div>
              <label className={labelCls}>Region</label>
              <select
                className={inputCls}
                value={inputs.region}
                onChange={(e) => setInputs({ ...inputs, region: e.target.value })}
              >
                {regions.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Pricing Type</label>
              <select
                className={inputCls}
                value={pricingType}
                onChange={(e) => setPricingType(e.target.value)}
              >
                {pricingOptions.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={calculate}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium text-sm transition disabled:opacity-50"
          >
            {loading ? "Calculating..." : "Calculate and Compare"}
          </button>
        </div>

        {results && (
          <>
            <div
              className={`mb-4 p-3 rounded-lg text-xs font-medium ${
                dark
                  ? "bg-green-900/40 text-green-300 border border-green-800"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              Cheapest option: <strong>{cheapest}</strong> at ${results[cheapest].monthly}/month — saves $
              {(
                Math.max(...Object.values(results).map((r) => parseFloat(r.monthly))) -
                parseFloat(results[cheapest].monthly)
              ).toFixed(2)}
              /month vs most expensive ({pricingOptions.find(p => p.value === pricingType)?.label} pricing)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {Object.entries(results).map(([provider, data]) => (
                <div
                  key={provider}
                  className={`${card} border-2 ${
                    provider === cheapest ? "border-green-500" : dark ? "border-gray-800" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className={`font-bold text-sm ${th}`}>{provider}</h2>
                    {provider === cheapest && (
                      <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-medium">
                        Best Value
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-blue-500 mb-0.5">${data.monthly}</p>
                  <p className={`text-xs mb-1 ${ts}`}>per month ({pricingOptions.find(p => p.value === pricingType)?.label})</p>
                  <p className={`text-sm font-medium mb-4 ${dark ? "text-gray-300" : "text-gray-700"}`}>
                    ${data.yearly}/year
                  </p>
                  <div className="mb-4 space-y-2">
                    {[
                      { label: "Compute", value: data.compute, color: data.color },
                      { label: "Storage", value: data.storage, color: "#8b5cf6" },
                      { label: "Transfer", value: data.transfer, color: "#f59e0b" },
                    ].map(({ label, value, color }) => {
                      const pct = Math.round((parseFloat(value) / parseFloat(data.monthly)) * 100);
                      return (
                        <div key={label}>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className={ts}>{label}</span>
                            <span className={dark ? "text-gray-300" : "text-gray-600"}>${value}</span>
                          </div>
                          <div className={`h-1.5 rounded-full ${dark ? "bg-gray-700" : "bg-gray-100"}`}>
                            <div
                              className="h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className={`rounded-lg p-3 ${dark ? "bg-gray-800" : "bg-gray-50"}`}>
                    <p className={`text-xs font-semibold mb-2 ${dark ? "text-gray-300" : "text-gray-600"}`}>
                      Recommended Instance
                    </p>
                    <p className="text-xs font-mono font-bold text-blue-500">{data.instance}</p>
                    <p className={`text-xs mt-1 ${ts}`}>
                      {data.vcpu} vCPU / {data.ram} GB RAM · ${data.pricePerHour}/hr
                    </p>
                  </div>
                  <p className={`text-xs mt-2 ${ts}`}>Source: {data.source}</p>
                </div>
              ))}
            </div>

            <div className={`${card} mb-6`}>
              <div className="w-full md:w-2/3 lg:w-1/2 mx-auto">
                <h2 className={`text-sm font-semibold mb-4 text-center ${th}`}>
                  Monthly Cost Comparison ({pricingOptions.find(p => p.value === pricingType)?.label})
                </h2>
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      ...chartDefaults.plugins,
                      tooltip: { callbacks: { label: (ctx) => `$${ctx.parsed.y}` } },
                    },
                    scales: {
                      x: {
                        ticks: { color: dark ? "#ccc" : "#555", font: { size: 11 } },
                        grid: { display: false },
                      },
                      y: {
                        ticks: {
                          color: dark ? "#ccc" : "#555",
                          font: { size: 11 },
                          callback: (v) => `$${v}`,
                        },
                        grid: { color: dark ? "#374151" : "#f3f4f6" },
                      },
                    },
                  }}
                />
              </div>
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
                    {tableRows.map((row, i) => (
                      <tr
                        key={row.label}
                        className={`border-t ${tableBorder} ${
                          i % 2 === 0
                            ? dark ? "bg-gray-900" : "bg-white"
                            : dark ? "bg-gray-800/50" : "bg-gray-50"
                        }`}
                      >
                        <td className={`p-3 font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>
                          {row.label}
                        </td>
                        <td className={`p-3 text-center font-mono ${row.highlight ? "font-bold text-blue-500" : tableText}`}>
                          {row.aws}
                        </td>
                        <td className={`p-3 text-center font-mono ${row.highlight ? "font-bold text-blue-500" : tableText}`}>
                          {row.azure}
                        </td>
                        <td className={`p-3 text-center font-mono ${row.highlight ? "font-bold text-blue-500" : tableText}`}>
                          {row.gcp}
                        </td>
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