import React from "react";

function Tips({ dark }) {
  const tips = [
    {
      category: "Right Sizing",
      color: "bg-blue-600",
      items: [
        "Analyze CPU and memory utilization over a 2 to 4 week period before selecting an instance size. Most teams over-provision by 30 to 40 percent.",
        "Downsize instances that consistently run below 40 percent average CPU utilization. Tools like AWS Compute Optimizer, Azure Advisor, and GCP Recommender automate this.",
        "Use memory-optimized instances only for workloads that actually require high RAM. General-purpose instances are more cost-effective for typical web workloads.",
        "Regularly audit your instance inventory. Unused or idle instances continue to incur charges even when no workload is running on them.",
      ],
    },
    {
      category: "Reserved Instances and Savings Plans",
      color: "bg-green-600",
      items: [
        "Purchase 1-year or 3-year reserved instances for predictable, steady-state workloads. This can save up to 72 percent compared to on-demand pricing.",
        "AWS Savings Plans offer flexible savings of up to 66 percent and apply across different instance families and regions, unlike standard reserved instances.",
        "Azure Reservations and GCP Committed Use Discounts follow a similar model. Analyze 90-day usage trends before committing to a reservation.",
        "Use a mix of reserved instances for baseline load and on-demand or spot instances for variable peaks to balance cost and flexibility.",
      ],
    },
    {
      category: "Storage Optimization",
      color: "bg-yellow-600",
      items: [
        "Move infrequently accessed data to cheaper storage tiers. AWS S3 Glacier, Azure Cool Blob Storage, and GCP Nearline are significantly cheaper than hot storage.",
        "Enable lifecycle policies to automatically transition objects to cheaper tiers after a defined period, for example after 30 days move to infrequent access and after 90 days to archival.",
        "Delete unattached EBS volumes, old snapshots, unused AMIs, and orphaned disks. These are a common source of silent cost waste.",
        "Use compression and deduplication where possible to reduce the total volume of data stored, especially for backup and log data.",
        "Evaluate whether object storage like S3 or Azure Blob is more appropriate than block storage for specific workloads, as it is significantly cheaper.",
      ],
    },
    {
      category: "Network Cost Reduction",
      color: "bg-purple-600",
      items: [
        "Data transfer within the same availability zone is free on most providers. Design your architecture to keep high-volume traffic local to a single zone.",
        "Cross-region data transfer is expensive. Avoid replicating large volumes of data across regions unless required for compliance or disaster recovery.",
        "Use a Content Delivery Network like AWS CloudFront, Azure CDN, or GCP Cloud CDN to cache content at edge locations and reduce origin data transfer costs.",
        "Replace NAT Gateways with VPC endpoints for accessing AWS services internally. NAT Gateway data processing charges can be surprisingly high at scale.",
        "Monitor and set alerts for data transfer costs using cost explorer tools, as these can grow unexpectedly with traffic spikes.",
      ],
    },
    {
      category: "Auto Scaling and Spot Instances",
      color: "bg-red-600",
      items: [
        "Configure auto scaling groups to automatically add capacity during traffic spikes and remove it during low-traffic periods to pay only for what you use.",
        "Schedule scale-down actions for development and testing environments during nights and weekends. These environments do not need to run 24 hours a day.",
        "Use spot instances on AWS, preemptible VMs on GCP, or spot VMs on Azure for fault-tolerant batch jobs, data processing, and CI/CD pipelines. Savings can reach 90 percent.",
        "Implement proper shutdown schedules for non-production environments using instance scheduler tools to avoid paying for idle resources.",
      ],
    },
    {
      category: "Monitoring and Cost Governance",
      color: "bg-indigo-600",
      items: [
        "Set up budget alerts in AWS Cost Explorer, Azure Cost Management, or GCP Billing to receive notifications when spending exceeds a defined threshold.",
        "Use tagging strategies to attribute cloud costs to specific teams, projects, or environments. Without tags it is very difficult to identify where money is being spent.",
        "Review your cloud bill monthly and look for cost anomalies, unused reserved instances, and services that were provisioned for testing but never cleaned up.",
        "Establish a FinOps culture where engineering teams are aware of and accountable for the cloud costs their services generate.",
        "Use third-party tools like Spot.io, Apptio Cloudability, or CloudHealth for advanced cost analytics and multi-cloud cost management.",
      ],
    },
  ];

  return (
    <div className={`min-h-screen p-6 ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-2xl font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>Cost Optimization Tips</h1>
        <p className={`text-sm mb-6 ${dark ? "text-gray-400" : "text-gray-500"}`}>Practical strategies to reduce your cloud spending without sacrificing performance.</p>
        <div className="grid grid-cols-1 gap-5">
          {tips.map((tip) => (
            <div key={tip.category} className={`rounded-xl shadow p-6 ${dark ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-2 h-8 rounded-full ${tip.color}`}></div>
                <h2 className={`font-bold text-base ${dark ? "text-white" : "text-gray-800"}`}>{tip.category}</h2>
              </div>
              <ul className="space-y-3">
                {tip.items.map((item, i) => (
                  <li key={i} className={`text-sm flex gap-3 leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>
                    <span className={`font-bold mt-0.5 text-xs ${tip.color.replace("bg-", "text-")}`}>{i + 1}.</span>
                    {item}
                  </li>
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