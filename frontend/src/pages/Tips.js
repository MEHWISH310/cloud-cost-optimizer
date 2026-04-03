import React from "react";

function Tips() {
  const tips = [
    {
      category: "Right Sizing",
      color: "bg-blue-100 text-blue-800",
      items: [
        "Analyze CPU and memory utilization over 2-4 weeks before choosing instance size",
        "Downsize instances running below 40% average CPU utilization",
        "Use AWS Compute Optimizer or Azure Advisor for automated right-sizing suggestions",
      ],
    },
    {
      category: "Reserved Instances",
      color: "bg-green-100 text-green-800",
      items: [
        "Purchase 1-year or 3-year reserved instances for predictable workloads to save up to 72%",
        "Use Savings Plans on AWS for flexible compute usage across instance families",
        "Azure Reservations and GCP Committed Use Discounts offer similar savings",
      ],
    },
    {
      category: "Storage Optimization",
      color: "bg-yellow-100 text-yellow-800",
      items: [
        "Move infrequently accessed data to cheaper storage tiers (S3 Glacier, Azure Cool Blob)",
        "Enable lifecycle policies to automatically transition data between storage classes",
        "Delete unattached volumes, old snapshots, and unused AMIs regularly",
      ],
    },
    {
      category: "Network Cost Reduction",
      color: "bg-purple-100 text-purple-800",
      items: [
        "Keep traffic within the same region and availability zone to avoid transfer costs",
        "Use CDN (CloudFront, Azure CDN) to reduce origin data transfer",
        "Consolidate VPN connections and use VPC endpoints instead of NAT gateways where possible",
      ],
    },
    {
      category: "Auto Scaling",
      color: "bg-red-100 text-red-800",
      items: [
        "Set up auto scaling groups to match capacity with actual demand",
        "Schedule scale-down during off-peak hours for dev and test environments",
        "Use spot or preemptible instances for fault-tolerant batch workloads to save up to 90%",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Cost Optimization Tips</h1>
        <div className="grid grid-cols-1 gap-6">
          {tips.map((tip) => (
            <div key={tip.category} className="bg-white rounded-lg shadow p-6">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${tip.color}`}>
                {tip.category}
              </span>
              <ul className="list-disc list-inside space-y-2">
                {tip.items.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tips;