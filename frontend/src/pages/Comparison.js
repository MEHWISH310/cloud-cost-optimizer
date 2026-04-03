import React from "react";

function Comparison() {
  const data = {
    AWS: {
      compute: "$0.096/vCPU/hr",
      storage: "$0.023/GB",
      dataTransfer: "$0.09/GB",
      freetier: "Yes",
      sla: "99.99%",
      regions: 31,
      strengths: "Largest ecosystem, most services, mature tooling",
    },
    Azure: {
      compute: "$0.100/vCPU/hr",
      storage: "$0.020/GB",
      dataTransfer: "$0.087/GB",
      freetier: "Yes",
      sla: "99.99%",
      regions: 60,
      strengths: "Best for Microsoft/enterprise, hybrid cloud leader",
    },
    GCP: {
      compute: "$0.095/vCPU/hr",
      storage: "$0.020/GB",
      dataTransfer: "$0.080/GB",
      freetier: "Yes",
      sla: "99.99%",
      regions: 35,
      strengths: "Best for ML/AI workloads, competitive pricing",
    },
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Multi-Cloud Comparison</h1>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="p-4 text-left">Feature</th>
                <th className="p-4 text-center">AWS</th>
                <th className="p-4 text-center">Azure</th>
                <th className="p-4 text-center">GCP</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.key} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="p-4 font-medium text-gray-700">{row.label}</td>
                  <td className="p-4 text-center text-gray-600">{data.AWS[row.key]}</td>
                  <td className="p-4 text-center text-gray-600">{data.Azure[row.key]}</td>
                  <td className="p-4 text-center text-gray-600">{data.GCP[row.key]}</td>
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