import React, { useState } from "react";
import axios from "axios";

function Comparison({ dark }) {
  const [loading, setLoading] = useState(false);
  const [pricingData, setPricingData] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedVM, setSelectedVM] = useState("");
  const [showResults, setShowResults] = useState(false);

  const regions = [
    { value: "us", label: "United States" },
    { value: "eu", label: "Europe" },
    { value: "asia", label: "Asia Pacific" }
  ];

  const vmSizes = [
    { value: "small", label: "Small (2 vCPU, 8GB RAM)", cpu: 2, ram: 8, storage: 100 },
    { value: "medium", label: "Medium (4 vCPU, 16GB RAM)", cpu: 4, ram: 16, storage: 250 },
    { value: "large", label: "Large (8 vCPU, 32GB RAM)", cpu: 8, ram: 32, storage: 500 },
    { value: "xlarge", label: "X-Large (16 vCPU, 64GB RAM)", cpu: 16, ram: 64, storage: 1000 }
  ];

  const handleCompare = async () => {
    if (!selectedRegion || !selectedVM) {
      alert("Please select both Region and VM Size");
      return;
    }
    
    setLoading(true);
    setShowResults(false);
    
    try {
      const vmConfig = vmSizes.find(vm => vm.value === selectedVM);
      
      const response = await axios.post("http://localhost:5000/api/pricing/calculate", {
        cpu: vmConfig.cpu,
        ram: vmConfig.ram,
        storage: vmConfig.storage,
        region: selectedRegion
      });
      
      const data = response.data;
      
      setPricingData({
        aws: {
          instanceType: data.details.aws.instanceType,
          computePrice: `$${data.details.aws.pricePerHour}/vCPU/hr`,
          storagePrice: "$0.10/GB",
          dataTransfer: "$0.09/GB",
          monthlyCost: `$${data.monthlyCosts.aws}`,
          yearlyCost: `$${data.yearlyCosts.aws}`,
          freetier: "Yes",
          sla: "99.99%",
          regions: 31,
          strengths: "Largest ecosystem, most services, mature tooling"
        },
        azure: {
          skuName: data.details.azure.skuName,
          computePrice: `$${data.details.azure.pricePerHour}/vCPU/hr`,
          storagePrice: "$0.09/GB",
          dataTransfer: "$0.087/GB",
          monthlyCost: `$${data.monthlyCosts.azure}`,
          yearlyCost: `$${data.yearlyCosts.azure}`,
          freetier: "Yes",
          sla: "99.99%",
          regions: 60,
          strengths: "Best for Microsoft/enterprise, hybrid cloud leader"
        },
        gcp: {
          machineType: data.details.gcp.machineType,
          computePrice: `$${data.details.gcp.pricePerHour}/vCPU/hr`,
          storagePrice: "$0.085/GB",
          dataTransfer: "$0.08/GB",
          monthlyCost: `$${data.monthlyCosts.gcp}`,
          yearlyCost: `$${data.yearlyCosts.gcp}`,
          freetier: "Yes",
          sla: "99.99%",
          regions: 35,
          strengths: "Best for ML/AI workloads, competitive pricing"
        }
      });
      
      setShowResults(true);
      
    } catch (error) {
      console.error("Failed to fetch pricing:", error);
      alert("Error fetching prices. Please try again.");
    }
    
    setLoading(false);
  };

  const rows = [
    { label: "Instance / SKU / Machine Type", key: "instanceType", awsKey: "instanceType", azureKey: "skuName", gcpKey: "machineType" },
    { label: "Compute Price", key: "computePrice" },
    { label: "Storage Price", key: "storagePrice" },
    { label: "Data Transfer", key: "dataTransfer" },
    { label: "Monthly Cost", key: "monthlyCost" },
    { label: "Yearly Cost", key: "yearlyCost" },
    { label: "Free Tier", key: "freetier" },
    { label: "SLA Uptime", key: "sla" },
    { label: "Global Regions", key: "regions" },
    { label: "Key Strengths", key: "strengths" }
  ];

  const getValue = (provider, row) => {
    if (provider === "AWS") {
      if (row.awsKey) return pricingData?.aws[row.awsKey] || "-";
      return pricingData?.aws[row.key] || "-";
    }
    if (provider === "Azure") {
      if (row.azureKey) return pricingData?.azure[row.azureKey] || "-";
      return pricingData?.azure[row.key] || "-";
    }
    if (provider === "GCP") {
      if (row.gcpKey) return pricingData?.gcp[row.gcpKey] || "-";
      return pricingData?.gcp[row.key] || "-";
    }
    return "-";
  };

  const getCheapestProvider = () => {
    if (!pricingData) return null;
    const costs = {
      AWS: parseFloat(pricingData.aws.monthlyCost.replace("$", "")),
      Azure: parseFloat(pricingData.azure.monthlyCost.replace("$", "")),
      GCP: parseFloat(pricingData.gcp.monthlyCost.replace("$", ""))
    };
    return Object.entries(costs).sort((a, b) => a[1] - b[1])[0][0];
  };

  const card = `rounded-xl shadow p-6 ${dark ? "bg-gray-800" : "bg-white"}`;
  const select = `w-full border rounded-lg px-3 py-2 text-sm ${dark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`;
  const button = `w-full py-3 rounded-lg font-medium text-white transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`;

  const cheapestProvider = getCheapestProvider();

  return (
    <div className={`min-h-screen p-6 ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-2xl font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>Multi-Cloud Comparison</h1>
        <p className={`text-sm mb-6 ${dark ? "text-gray-400" : "text-gray-500"}`}>Compare real-time pricing across AWS, Azure, and GCP</p>

        <div className={`${card} mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${dark ? "text-gray-300" : "text-gray-700"}`}>Select Region</label>
              <select 
                className={select} 
                value={selectedRegion} 
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="">-- Select Region --</option>
                {regions.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${dark ? "text-gray-300" : "text-gray-700"}`}>Select VM Size</label>
              <select 
                className={select} 
                value={selectedVM} 
                onChange={(e) => setSelectedVM(e.target.value)}
              >
                <option value="">-- Select VM Size --</option>
                {vmSizes.map(vm => (
                  <option key={vm.value} value={vm.value}>{vm.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button 
            onClick={handleCompare} 
            disabled={loading || !selectedRegion || !selectedVM}
            className={`${button} mt-6`}
          >
            {loading ? "Fetching Real-Time Prices..." : "Compare Prices"}
          </button>
        </div>

        {showResults && pricingData && (
          <>
            {cheapestProvider && (
              <div className={`mb-4 p-3 rounded-lg text-sm font-medium text-center ${dark ? "bg-green-900 text-green-200" : "bg-green-100 text-green-800"}`}>
                Cheapest Provider: {cheapestProvider} (based on your selected configuration)
              </div>
            )}
            
            <div className={`rounded-xl shadow overflow-x-auto ${dark ? "bg-gray-800" : "bg-white"}`}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-4 text-left">Feature</th>
                    <th className="p-4 text-center">AWS</th>
                    <th className="p-4 text-center">Azure</th>
                    <th className="p-4 text-center">GCP</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    let isCheapestRow = row.key === "monthlyCost" || row.key === "yearlyCost";
                    return (
                      <tr key={row.key} className={i % 2 === 0 ? dark ? "bg-gray-800" : "bg-white" : dark ? "bg-gray-750" : "bg-gray-50"}>
                        <td className={`p-4 font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>{row.label}</td>
                        <td className={`p-4 text-center ${dark ? "text-gray-400" : "text-gray-600"} ${isCheapestRow && cheapestProvider === "AWS" ? "font-bold text-green-500" : ""}`}>
                          {getValue("AWS", row)}
                        </td>
                        <td className={`p-4 text-center ${dark ? "text-gray-400" : "text-gray-600"} ${isCheapestRow && cheapestProvider === "Azure" ? "font-bold text-green-500" : ""}`}>
                          {getValue("Azure", row)}
                        </td>
                        <td className={`p-4 text-center ${dark ? "text-gray-400" : "text-gray-600"} ${isCheapestRow && cheapestProvider === "GCP" ? "font-bold text-green-500" : ""}`}>
                          {getValue("GCP", row)}
                        </td>
                       </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className={`mt-4 p-3 rounded-lg text-xs text-center ${dark ? "text-gray-500" : "text-gray-400"}`}>
              Prices are fetched in real-time from cloud provider APIs. Source: {pricingData.aws.computePrice.includes("Real") ? "Real-time API" : "Fallback"} data
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Comparison;