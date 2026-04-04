import React from "react";

function Architecture({ dark }) {
  const card = `rounded-xl shadow p-6 ${dark ? "bg-gray-800" : "bg-white"}`;
  const text = dark ? "text-white" : "text-gray-800";
  const subtext = dark ? "text-gray-400" : "text-gray-500";
  const box = (color) => `rounded-xl p-4 text-white text-center text-sm font-semibold ${color}`;
  const arrow = `text-center text-2xl ${dark ? "text-gray-400" : "text-gray-400"}`;

  return (
    <div className={`min-h-screen p-6 ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-2xl font-bold mb-2 ${text}`}>System Architecture</h1>
        <p className={`text-sm mb-6 ${subtext}`}>End-to-end architecture of the Cloud Cost Optimizer platform.</p>

        <div className={`${card} mb-6`}>
          <h2 className={`text-base font-bold mb-6 ${text}`}>Fig 1: System Architecture Diagram</h2>
          <div className="flex flex-col items-center gap-2">
            <div className="w-full max-w-2xl">
              <div className={box("bg-blue-600")}>
                User Browser (React.js Frontend)
                <div className="text-xs font-normal mt-1 opacity-80">Dashboard, Calculator, Comparison, AI Recommendation, Education, Tips, History, Metrics</div>
              </div>
            </div>
            <div className={arrow}>↓ ↑</div>
            <div className="w-full max-w-2xl grid grid-cols-2 gap-4">
              <div className={box("bg-indigo-600")}>
                Node.js Backend (Express)
                <div className="text-xs font-normal mt-1 opacity-80">Port 5000 | REST APIs | User & History Management</div>
              </div>
              <div className={box("bg-purple-600")}>
                Python AI Service (FastAPI)
                <div className="text-xs font-normal mt-1 opacity-80">Port 5001 | ML Models | Recommendation Engine</div>
              </div>
            </div>
            <div className="w-full max-w-2xl grid grid-cols-3 gap-4">
              <div className={arrow}>↓ ↑</div>
              <div className={arrow}>↓ ↑</div>
              <div className={arrow}>↓ ↑</div>
            </div>
            <div className="w-full max-w-2xl grid grid-cols-3 gap-4">
              <div className={box("bg-green-600")}>
                MongoDB Atlas
                <div className="text-xs font-normal mt-1 opacity-80">User profiles & History storage</div>
              </div>
              <div className={box("bg-orange-500")}>
                ML Models
                <div className="text-xs font-normal mt-1 opacity-80">Gradient Boosting, Random Forest, Decision Tree</div>
              </div>
              <div className={box("bg-red-500")}>
                Firebase Auth
                <div className="text-xs font-normal mt-1 opacity-80">Google OAuth 2.0 Authentication</div>
              </div>
            </div>
            <div className={arrow}>↓ ↑</div>
            <div className="w-full max-w-2xl">
              <div className={box("bg-teal-600")}>
                Cloud Pricing Data (AWS, Azure, GCP)
                <div className="text-xs font-normal mt-1 opacity-80">Real-time pricing rates for compute, storage, and data transfer</div>
              </div>
            </div>
          </div>
        </div>

        <div className={`${card} mb-6`}>
          <h2 className={`text-base font-bold mb-4 ${text}`}>Component Description</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "React.js Frontend", desc: "Single page application with Tailwind CSS for styling. Handles all user interactions, form inputs, chart rendering using Chart.js, and routing using React Router.", color: "bg-blue-600" },
              { title: "Node.js Backend", desc: "Express.js REST API running on port 5000. Handles user registration, history storage and retrieval, and acts as the middleware between frontend and database.", color: "bg-indigo-600" },
              { title: "Python AI Service", desc: "FastAPI service running on port 5001. Hosts three trained ML models for predicting service model, deployment model, and cloud provider. Returns recommendations with explanations.", color: "bg-purple-600" },
              { title: "MongoDB Atlas", desc: "Cloud-hosted NoSQL database storing user profiles and activity history. Accessed via Mongoose ODM from the Node.js backend.", color: "bg-green-600" },
              { title: "ML Models", desc: "Three Gradient Boosting classifiers trained on 2000 synthetic cloud workload records. Achieves 94.5% accuracy for service model, 88.25% for deployment model, and 93.5% for provider prediction.", color: "bg-orange-500" },
              { title: "Firebase Authentication", desc: "Google OAuth 2.0 authentication via Firebase. Handles sign-in, session management, and user identity. No passwords stored in our database.", color: "bg-red-500" },
            ].map((item) => (
              <div key={item.title} className={`rounded-lg p-4 ${dark ? "bg-gray-700" : "bg-gray-50"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <h3 className={`text-sm font-bold ${text}`}>{item.title}</h3>
                </div>
                <p className={`text-sm ${subtext}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={card}>
          <h2 className={`text-base font-bold mb-4 ${text}`}>Technology Stack Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3 text-left">Layer</th>
                  <th className="p-3 text-left">Technology</th>
                  <th className="p-3 text-left">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { layer: "Frontend", tech: "React.js, Tailwind CSS, Chart.js", purpose: "User interface, routing, data visualization" },
                  { layer: "Backend", tech: "Node.js, Express.js", purpose: "REST API, business logic, database interaction" },
                  { layer: "AI Service", tech: "Python, FastAPI, Scikit-learn", purpose: "ML model serving, recommendation engine" },
                  { layer: "Database", tech: "MongoDB Atlas", purpose: "User profiles and history persistence" },
                  { layer: "Authentication", tech: "Firebase, Google OAuth 2.0", purpose: "Secure user login and session management" },
                  { layer: "ML Models", tech: "Gradient Boosting, Random Forest, Decision Tree", purpose: "Cloud configuration prediction" },
                  { layer: "Version Control", tech: "Git, GitHub", purpose: "Source code management and collaboration" },
                ].map((row, i) => (
                  <tr key={row.layer} className={i % 2 === 0 ? dark ? "bg-gray-700" : "bg-gray-50" : dark ? "bg-gray-800" : "bg-white"}>
                    <td className={`p-3 font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>{row.layer}</td>
                    <td className={`p-3 ${dark ? "text-gray-300" : "text-gray-600"}`}>{row.tech}</td>
                    <td className={`p-3 ${dark ? "text-gray-400" : "text-gray-500"}`}>{row.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Architecture;