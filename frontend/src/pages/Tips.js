import React, { useState } from "react";

const TIPS = [
  {
    category: "Right Sizing",
    accent: "#3b82f6",
    accentDim: "rgba(59,130,246,0.08)",
    accentBorder: "rgba(59,130,246,0.15)",
    items: [
      "Analyze CPU and memory utilization over a 2–4 week period before selecting an instance size. Most teams over-provision by 30–40%.",
      "Downsize instances that consistently run below 40% average CPU utilization. Tools like AWS Compute Optimizer, Azure Advisor, and GCP Recommender automate this.",
      "Use memory-optimized instances only for workloads that actually require high RAM. General-purpose instances are more cost-effective for typical web workloads.",
      "Regularly audit your instance inventory. Unused or idle instances continue to incur charges even when no workload is running.",
    ],
  },
  {
    category: "Reserved Instances & Savings Plans",
    accent: "#22c55e",
    accentDim: "rgba(34,197,94,0.08)",
    accentBorder: "rgba(34,197,94,0.15)",
    items: [
      "Purchase 1-year or 3-year reserved instances for predictable, steady-state workloads. This can save up to 72% compared to on-demand pricing.",
      "AWS Savings Plans offer flexible savings of up to 66% and apply across different instance families and regions, unlike standard reserved instances.",
      "Azure Reservations and GCP Committed Use Discounts follow a similar model. Analyze 90-day usage trends before committing.",
      "Use a mix of reserved instances for baseline load and on-demand or spot instances for variable peaks to balance cost and flexibility.",
    ],
  },
  {
    category: "Storage Optimization",
    accent: "#f59e0b",
    accentDim: "rgba(245,158,11,0.08)",
    accentBorder: "rgba(245,158,11,0.15)",
    items: [
      "Move infrequently accessed data to cheaper storage tiers. S3 Glacier, Azure Cool Blob, and GCP Nearline are significantly cheaper than hot storage.",
      "Enable lifecycle policies to automatically transition objects to cheaper tiers — e.g. after 30 days to infrequent access, after 90 days to archival.",
      "Delete unattached EBS volumes, old snapshots, unused AMIs, and orphaned disks. These are a common source of silent cost waste.",
      "Use compression and deduplication to reduce total data stored, especially for backup and log data.",
      "Evaluate whether object storage like S3 or Azure Blob is more appropriate than block storage — it's significantly cheaper for many workloads.",
    ],
  },
  {
    category: "Network Cost Reduction",
    accent: "#a855f7",
    accentDim: "rgba(168,85,247,0.08)",
    accentBorder: "rgba(168,85,247,0.15)",
    items: [
      "Data transfer within the same availability zone is free on most providers. Design your architecture to keep high-volume traffic local to a single zone.",
      "Cross-region data transfer is expensive. Avoid replicating large data volumes across regions unless required for compliance or disaster recovery.",
      "Use a CDN like AWS CloudFront, Azure CDN, or GCP Cloud CDN to cache content at edge locations and reduce origin data transfer costs.",
      "Replace NAT Gateways with VPC endpoints for accessing AWS services internally — NAT Gateway data processing charges can be surprisingly high at scale.",
      "Monitor and alert on data transfer costs using cost explorer tools, as these can grow unexpectedly with traffic spikes.",
    ],
  },
  {
    category: "Auto Scaling & Spot Instances",
    accent: "#ef4444",
    accentDim: "rgba(239,68,68,0.08)",
    accentBorder: "rgba(239,68,68,0.15)",
    items: [
      "Configure auto scaling groups to add capacity during traffic spikes and remove it during low-traffic periods — pay only for what you use.",
      "Schedule scale-down for dev and test environments during nights and weekends. These don't need to run 24 hours a day.",
      "Use spot instances (AWS), preemptible VMs (GCP), or spot VMs (Azure) for fault-tolerant batch jobs and CI/CD pipelines. Savings can reach 90%.",
      "Implement shutdown schedules for non-production environments using instance scheduler tools to avoid paying for idle resources.",
    ],
  },
  {
    category: "Monitoring & Cost Governance",
    accent: "#6366f1",
    accentDim: "rgba(99,102,241,0.08)",
    accentBorder: "rgba(99,102,241,0.15)",
    items: [
      "Set up budget alerts in AWS Cost Explorer, Azure Cost Management, or GCP Billing to get notified when spending exceeds defined thresholds.",
      "Use tagging strategies to attribute cloud costs to specific teams, projects, or environments. Without tags it's nearly impossible to identify where money is spent.",
      "Review your cloud bill monthly. Look for cost anomalies, unused reserved instances, and services provisioned for testing but never cleaned up.",
      "Establish a FinOps culture where engineering teams are aware of and accountable for the cloud costs their services generate.",
      "Consider third-party tools like Spot.io, Apptio Cloudability, or CloudHealth for advanced multi-cloud cost analytics.",
    ],
  },
];

const GLOBAL_CSS = `
  .tip-card { transition: border-color 0.2s ease; }
  .tip-btn { transition: background 0.15s ease; }
  .tip-btn:hover { opacity: 0.85; }
  .expand-btn:hover { opacity: 0.75; }
`;

function TipCard({ tip, dark, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen ?? true);

  return (
    <div
      className="tip-card"
      style={{
        background: dark ? "#171c2b" : "#ffffff",
        border: dark ? "1px solid #222b3a" : "1px solid #e2e8f0",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <button
        type="button"
        className="tip-btn"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          background: "transparent",
          border: "none",
          borderBottom: open
            ? dark ? "1px solid #222b3a" : "1px solid #f1f5f9"
            : "none",
          cursor: "pointer",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Color accent bar */}
          <div style={{
            width: "3px",
            height: "18px",
            borderRadius: "2px",
            background: tip.accent,
            flexShrink: 0,
          }} />
          <p style={{
            fontSize: "14px",
            fontWeight: 600,
            color: dark ? "#e2e8f0" : "#0f172a",
            margin: 0,
          }}>{tip.category}</p>
          <span style={{
            fontSize: "11px",
            color: dark ? "#4a6080" : "#94a3b8",
            fontWeight: 400,
          }}>{tip.items.length} tips</span>
        </div>
        {/* Chevron */}
        <svg
          width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke={dark ? "#4a6080" : "#94a3b8"} strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Body */}
      {open && (
        <div style={{ padding: "8px 20px 16px" }}>
          {tip.items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "14px",
                padding: "10px 0",
                borderBottom: i < tip.items.length - 1
                  ? dark ? "1px solid #1a2030" : "1px solid #f8fafc"
                  : "none",
              }}
            >
              <span style={{
                flexShrink: 0,
                fontSize: "12px",
                fontWeight: 700,
                color: tip.accent,
                minWidth: "16px",
                marginTop: "1px",
              }}>
                {i + 1}.
              </span>
              <p style={{
                fontSize: "13px",
                lineHeight: 1.7,
                color: dark ? "#94a3b8" : "#475569",
                margin: 0,
              }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Tips({ dark }) {
  const [allOpen, setAllOpen] = useState(true);
  const [key, setKey] = useState(0);

  const toggleAll = (val) => {
    setAllOpen(val);
    setKey((k) => k + 1);
  };

  return (
    <div style={{ minHeight: "100vh", background: dark ? "#0f1420" : "#f1f5f9", padding: "32px 24px" }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "24px",
          gap: "16px",
        }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 6px 0" }}>
              Cost Optimization Tips
            </h1>
            <p style={{ fontSize: "13px", color: dark ? "#64748b" : "#64748b", margin: 0 }}>
              Practical strategies to reduce your cloud spending without sacrificing performance.
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px", flexShrink: 0, marginTop: "2px" }}>
            <button
              type="button"
              className="expand-btn"
              onClick={() => toggleAll(true)}
              style={{
                padding: "7px 12px",
                borderRadius: "7px",
                border: dark ? "1px solid #222b3a" : "1px solid #e2e8f0",
                background: dark ? "#171c2b" : "#ffffff",
                color: dark ? "#94a3b8" : "#475569",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Expand all
            </button>
            <button
              type="button"
              className="expand-btn"
              onClick={() => toggleAll(false)}
              style={{
                padding: "7px 12px",
                borderRadius: "7px",
                border: dark ? "1px solid #222b3a" : "1px solid #e2e8f0",
                background: dark ? "#171c2b" : "#ffffff",
                color: dark ? "#94a3b8" : "#475569",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Collapse all
            </button>
          </div>
        </div>

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }} key={key}>
          {TIPS.map((tip) => (
            <TipCard key={tip.category} tip={tip} dark={dark} defaultOpen={allOpen} />
          ))}
        </div>

      </div>
    </div>
  );
}

export default Tips;