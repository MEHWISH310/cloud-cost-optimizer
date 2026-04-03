import React from "react";

function Comparison({ dark }) {
  const data = {
    AWS: { compute: "$0.096/vCPU/hr", storage: "$0.023/GB", dataTransfer: "$0.09/GB", freetier: "Yes", sla: "99.99%", regions: 31, strengths: "Largest ecosystem, most services, mature tooling" },
    Azure: { compute: "$0.100/vCPU/hr", storage: "$0.020/GB", dataTransfer: "$0.087/GB", freetier: "Yes", sla: "99.99%", regions: 60, strengths: "Best for Microsoft/enterprise, hybrid cloud leader" },
    GCP: { compute: "$0.095/vCPU/hr", storage: "$0.020/GB", dataTransfer: "$0.080/GB", freetier: "Yes", sla: "99.99%", regions: 35, strengths: "Best for ML/AI workloads, competitive pricing" },
  };

  const rows = [
    { label: "Compute Price", key: "compute" },
    { label: "Storage Price", key: "storage" },
    { label: "Data Transfer", key: "dataTransfer" },
    { label: "Free Tier", key: "freetier" },
    { label: "SLA Uptime", key: "sla" },
    { label: "Global Regions", key: "regions" },
    { label: "Key Strengths", key: "strengths" },
  ];

  return (
    <div className={`min-h-screen p-6 ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-5xl mx-auto">
        <h1 className={`text-2xl font-bold mb-6 ${dark ? "text-white" : "text-gray-800"}`}>Multi-Cloud Comparison</h1>
        <div className={`rounded-xl shadow overflow-x-auto ${dark ? "bg-gray-800" : "bg-white"}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-4 text-left">Feature</th>
                <th className="p-4 text-center">☁️ AWS</th>
                <th className="p-4 text-center">☁️ Azure</th>
                <th className="p-4 text-center">☁️ GCP</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.key} className={i % 2 === 0 ? dark ? "bg-gray-800" : "bg-white" : dark ? "bg-gray-750" : "bg-gray-50"}>
                  <td className={`p-4 font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>{row.label}</td>
                  <td className={`p-4 text-center ${dark ? "text-gray-400" : "text-gray-600"}`}>{data.AWS[row.key]}</td>
                  <td className={`p-4 text-center ${dark ? "text-gray-400" : "text-gray-600"}`}>{data.Azure[row.key]}</td>
                  <td className={`p-4 text-center ${dark ? "text-gray-400" : "text-gray-600"}`}>{data.GCP[row.key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Comparison;