import React, { useState } from "react";

function Education() {
  const [activeTab, setActiveTab] = useState("service");

  const serviceModels = [
    {
      title: "IaaS - Infrastructure as a Service",
      desc: "Provides virtualized computing resources over the internet. The user manages OS, middleware, and applications.",
      examples: "AWS EC2, Azure Virtual Machines, GCP Compute Engine",
      useCase: "Best for: Full control over infrastructure, custom environments, legacy app migration",
    },
    {
      title: "PaaS - Platform as a Service",
      desc: "Provides a platform for developers to build, deploy, and manage applications without managing infrastructure.",
      examples: "AWS Elastic Beanstalk, Azure App Service, GCP App Engine",
      useCase: "Best for: Rapid development, startups, web apps without infrastructure management",
    },
    {
      title: "SaaS - Software as a Service",
      desc: "Delivers software applications over the internet on a subscription basis. Everything is managed by the provider.",
      examples: "Google Workspace, Microsoft 365, Salesforce",
      useCase: "Best for: End users who need ready-to-use software with no maintenance",
    },
  ];

  const deploymentModels = [
    {
      title: "Public Cloud",
      desc: "Resources are owned and operated by a third-party cloud provider and shared among multiple customers.",
      examples: "AWS, Azure, GCP",
      useCase: "Best for: Startups, variable workloads, cost efficiency",
    },
    {
      title: "Private Cloud",
      desc: "Cloud infrastructure operated solely for a single organization. Can be on-premises or hosted by a provider.",
      examples: "VMware, OpenStack, Azure Stack",
      useCase: "Best for: High security needs, compliance-heavy industries like banking and healthcare",
    },
    {
      title: "Hybrid Cloud",
      desc: "Combines public and private clouds allowing data and applications to be shared between them.",
      examples: "AWS Outposts, Azure Arc, GCP Anthos",
      useCase: "Best for: Enterprises needing flexibility, data sovereignty with scalability",
    },
  ];

  const items = activeTab === "service" ? serviceModels : deploymentModels;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Learn Cloud Models</h1>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("service")}
            className={`px-4 py-2 rounded text-sm font-medium ${activeTab === "service" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border"}`}
          >
            Service Models
          </button>
          <button
            onClick={() => setActiveTab("deployment")}
            className={`px-4 py-2 rounded text-sm font-medium ${activeTab === "deployment" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border"}`}
          >
            Deployment Models
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {items.map((item) => (
            <div key={item.title} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h2>
              <p className="text-sm text-gray-600 mb-3">{item.desc}</p>
              <p className="text-sm text-gray-500 mb-1"><span className="font-medium">Examples:</span> {item.examples}</p>
              <p className="text-sm text-blue-600 font-medium">{item.useCase}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Education;