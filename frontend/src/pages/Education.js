import React, { useState } from "react";

function Education({ dark }) {
  const [activeTab, setActiveTab] = useState("service");

  const serviceModels = [
    {
      title: "IaaS - Infrastructure as a Service",
      desc: "Infrastructure as a Service provides virtualized computing resources over the internet. The cloud provider manages the physical hardware, networking, and virtualization layer, while the user is responsible for the operating system, middleware, runtime, data, and applications.",
      examples: "AWS EC2, Azure Virtual Machines, Google Compute Engine, IBM Cloud, DigitalOcean",
      useCase: "Best for: Organizations needing full control over their infrastructure, running custom or legacy applications, disaster recovery setups, and high-performance computing workloads.",
      advantages: "Maximum flexibility and control, ability to run any OS or software, cost-effective for large scale, easy to scale up or down.",
      disadvantages: "Requires skilled IT staff to manage OS and middleware, more responsibility on the user, longer setup time compared to PaaS or SaaS.",
      responsibility: "User manages: OS, middleware, runtime, data, applications. Provider manages: hardware, networking, virtualization.",
    },
    {
      title: "PaaS - Platform as a Service",
      desc: "Platform as a Service provides a complete development and deployment environment in the cloud. Developers can build, test, deploy, and manage applications without worrying about the underlying infrastructure. The provider manages servers, storage, networking, and the OS.",
      examples: "AWS Elastic Beanstalk, Azure App Service, Google App Engine, Heroku, Red Hat OpenShift",
      useCase: "Best for: Development teams focused on building applications quickly, startups that cannot afford dedicated DevOps teams, API development, and microservices.",
      advantages: "Faster time to market, reduced complexity, built-in scalability, developer-focused tooling, automatic OS updates.",
      disadvantages: "Less control over infrastructure, potential vendor lock-in, limited customization of the underlying platform.",
      responsibility: "User manages: data and applications. Provider manages: everything below the application layer.",
    },
    {
      title: "SaaS - Software as a Service",
      desc: "Software as a Service delivers complete software applications over the internet on a subscription basis. The cloud provider manages everything from infrastructure to application updates. Users simply access the software through a web browser or API.",
      examples: "Google Workspace, Microsoft 365, Salesforce, Zoom, Slack, Dropbox, ServiceNow",
      useCase: "Best for: Business users who need ready-to-use software, small businesses without IT teams, collaboration tools, CRM systems, and productivity applications.",
      advantages: "No installation or maintenance required, accessible from anywhere, automatic updates, predictable subscription pricing, easy for non-technical users.",
      disadvantages: "Least control over the software and data, dependent on internet connectivity, potential data privacy concerns, limited customization.",
      responsibility: "User manages: only their data and user access. Provider manages: everything else.",
    },
  ];

  const deploymentModels = [
    {
      title: "Public Cloud",
      desc: "In the public cloud model, computing resources such as servers, storage, and applications are owned and operated by a third-party cloud service provider and delivered over the internet. Multiple organizations share the same physical infrastructure, though their data and applications remain isolated and secure.",
      examples: "Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform (GCP), IBM Cloud, Oracle Cloud",
      useCase: "Best for: Startups, variable or unpredictable workloads, web applications, development and testing environments, and businesses looking for low upfront investment.",
      advantages: "No upfront capital expenditure, pay-as-you-go pricing, global availability, unlimited scalability, managed by the provider.",
      disadvantages: "Less control over data location, potential compliance issues in regulated industries, shared infrastructure even if logically isolated.",
      security: "Security is handled by the provider at the infrastructure level. Customers are responsible for securing their data and applications.",
    },
    {
      title: "Private Cloud",
      desc: "A private cloud is a cloud computing environment dedicated exclusively to one organization. It can be hosted on-premises in the organization's own data center or by a third-party provider. All infrastructure is used only by that single organization, offering greater control and security.",
      examples: "VMware vSphere, OpenStack, Microsoft Azure Stack, AWS Outposts, HPE GreenLake",
      useCase: "Best for: Banking, healthcare, government, and other industries with strict data privacy and compliance requirements. Also suited for organizations with consistent, predictable workloads.",
      advantages: "Maximum security and control, customizable to specific needs, compliance with strict regulations, dedicated resources with no sharing.",
      disadvantages: "High upfront capital cost, requires in-house IT expertise to manage, limited scalability compared to public cloud, slower to provision.",
      security: "Full control over security policies, firewalls, and data access. Ideal for sensitive or classified data.",
    },
    {
      title: "Hybrid Cloud",
      desc: "Hybrid cloud combines public and private cloud environments, allowing data and applications to move between them based on business needs. Organizations can run sensitive workloads on a private cloud while using the public cloud for scalable, less critical operations.",
      examples: "AWS Outposts + AWS Public Cloud, Azure Arc, Google Anthos, IBM Cloud Satellite",
      useCase: "Best for: Large enterprises that need both security and scalability, organizations with seasonal workload spikes, businesses undergoing cloud migration, and those needing data residency compliance.",
      advantages: "Flexibility to choose where each workload runs, cost optimization by bursting to public cloud only when needed, maintains compliance for sensitive data.",
      disadvantages: "Complex to manage and integrate, requires strong networking and security expertise, higher management overhead than single-cloud deployments.",
      security: "Sensitive workloads stay on private infrastructure while public cloud handles less sensitive tasks. Requires careful security policy alignment across both environments.",
    },
    {
      title: "Multi-Cloud",
      desc: "Multi-cloud refers to using services from two or more public cloud providers simultaneously. Unlike hybrid cloud which mixes public and private, multi-cloud uses multiple public clouds to avoid vendor lock-in, improve redundancy, or leverage best-in-class services from different providers.",
      examples: "AWS + Azure, GCP + AWS, Azure + GCP, combination of any major public cloud providers",
      useCase: "Best for: Large enterprises wanting to avoid vendor lock-in, organizations needing geographic redundancy, teams using specialized services from different providers like AWS for compute and GCP for ML.",
      advantages: "Avoids vendor lock-in, increased resilience and availability, ability to use best services from each provider, geographic flexibility.",
      disadvantages: "Increased complexity in management, higher skill requirements, data transfer costs between clouds, difficult to maintain consistent security policies.",
      security: "Each provider maintains its own security standards. Organizations must implement unified security and monitoring across all cloud environments.",
    },
  ];

  const items = activeTab === "service" ? serviceModels : deploymentModels;
  const card = `rounded-xl shadow p-6 mb-4 ${dark ? "bg-gray-800" : "bg-white"}`;

  return (
    <div className={`min-h-screen p-6 ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-2xl font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>Learn Cloud Models</h1>
        <p className={`text-sm mb-6 ${dark ? "text-gray-400" : "text-gray-500"}`}>Understand the different cloud service and deployment models to make informed decisions.</p>
        <div className="flex gap-3 mb-6">
          <button onClick={() => setActiveTab("service")} className={`px-5 py-2 rounded-lg text-sm font-medium transition ${activeTab === "service" ? "bg-blue-600 text-white" : dark ? "bg-gray-800 text-gray-300 border border-gray-700" : "bg-white text-gray-700 border"}`}>
            Service Models (IaaS / PaaS / SaaS)
          </button>
          <button onClick={() => setActiveTab("deployment")} className={`px-5 py-2 rounded-lg text-sm font-medium transition ${activeTab === "deployment" ? "bg-blue-600 text-white" : dark ? "bg-gray-800 text-gray-300 border border-gray-700" : "bg-white text-gray-700 border"}`}>
            Deployment Models
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {items.map((item) => (
            <div key={item.title} className={card}>
              <h2 className={`text-lg font-bold mb-3 ${dark ? "text-white" : "text-gray-800"}`}>{item.title}</h2>
              <p className={`text-sm mb-4 leading-relaxed ${dark ? "text-gray-300" : "text-gray-600"}`}>{item.desc}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className={`rounded-lg p-3 ${dark ? "bg-gray-700" : "bg-gray-50"}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${dark ? "text-gray-400" : "text-gray-500"}`}>Examples</p>
                  <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}>{item.examples}</p>
                </div>
                <div className={`rounded-lg p-3 ${dark ? "bg-blue-900" : "bg-blue-50"}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${dark ? "text-blue-300" : "text-blue-600"}`}>Use Case</p>
                  <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}>{item.useCase}</p>
                </div>
                <div className={`rounded-lg p-3 ${dark ? "bg-green-900" : "bg-green-50"}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${dark ? "text-green-300" : "text-green-600"}`}>Advantages</p>
                  <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}>{item.advantages}</p>
                </div>
                <div className={`rounded-lg p-3 ${dark ? "bg-red-900" : "bg-red-50"}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${dark ? "text-red-300" : "text-red-600"}`}>Disadvantages</p>
                  <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}>{item.disadvantages}</p>
                </div>
              </div>
              <div className={`rounded-lg p-3 mt-3 ${dark ? "bg-gray-700" : "bg-gray-50"}`}>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${dark ? "text-gray-400" : "text-gray-500"}`}>{item.responsibility ? "Responsibility" : "Security"}</p>
                <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}>{item.responsibility || item.security}</p>
              </div>
            </div>
          ))}
        </div>

        {activeTab === "service" && (
          <div className={`rounded-xl shadow p-6 mt-2 ${dark ? "bg-gray-800" : "bg-white"}`}>
            <h2 className={`text-lg font-bold mb-4 ${dark ? "text-white" : "text-gray-800"}`}>Shared Responsibility Matrix</h2>
            <p className={`text-sm mb-4 ${dark ? "text-gray-400" : "text-gray-500"}`}>
              This matrix shows who is responsible for each layer of the cloud stack across different service models. "Provider" means the cloud vendor manages it. "User" means you are responsible. "Shared" means both parties have responsibilities.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-3 text-left">Layer</th>
                    <th className="p-3 text-center">On-Premise</th>
                    <th className="p-3 text-center">IaaS</th>
                    <th className="p-3 text-center">PaaS</th>
                    <th className="p-3 text-center">SaaS</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { layer: "Physical Hardware", onprem: "User", iaas: "Provider", paas: "Provider", saas: "Provider" },
                    { layer: "Networking", onprem: "User", iaas: "Provider", paas: "Provider", saas: "Provider" },
                    { layer: "Virtualization", onprem: "User", iaas: "Provider", paas: "Provider", saas: "Provider" },
                    { layer: "Operating System", onprem: "User", iaas: "User", paas: "Provider", saas: "Provider" },
                    { layer: "Middleware / Runtime", onprem: "User", iaas: "User", paas: "Provider", saas: "Provider" },
                    { layer: "Application", onprem: "User", iaas: "User", paas: "User", saas: "Provider" },
                    { layer: "Data", onprem: "User", iaas: "User", paas: "User", saas: "Shared" },
                    { layer: "Identity & Access", onprem: "User", iaas: "Shared", paas: "Shared", saas: "Shared" },
                    { layer: "Security Configuration", onprem: "User", iaas: "Shared", paas: "Shared", saas: "Shared" },
                  ].map((row, i) => (
                    <tr key={row.layer} className={i % 2 === 0 ? dark ? "bg-gray-700" : "bg-gray-50" : dark ? "bg-gray-800" : "bg-white"}>
                      <td className={`p-3 font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>{row.layer}</td>
                      {[row.onprem, row.iaas, row.paas, row.saas].map((val, j) => (
                        <td key={j} className="p-3 text-center">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            val === "Provider" ? "bg-blue-100 text-blue-700" :
                            val === "User" ? "bg-orange-100 text-orange-700" :
                            "bg-green-100 text-green-700"
                          }`}>{val}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Education;