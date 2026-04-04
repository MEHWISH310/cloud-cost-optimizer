import React from "react";
import { Link } from "react-router-dom";

function Dashboard({ user, dark }) {
  const cards = [
    { title: "System Architecture", desc: "View the complete system architecture and technology stack", path: "/architecture", color: "from-gray-500 to-gray-600" },
    { title: "Cost Calculator", desc: "Estimate real-time cloud costs for AWS, Azure, and GCP", path: "/calculator", color: "from-blue-500 to-blue-600" },
    { title: "Cloud Comparison", desc: "Compare providers side by side to find the best option", path: "/comparison", color: "from-green-500 to-green-600" },
    { title: "AI Recommendation", desc: "Get intelligent recommendations based on your needs", path: "/recommendation", color: "from-purple-500 to-purple-600" },
    { title: "Learn Cloud Models", desc: "Understand IaaS, PaaS, SaaS and deployment models", path: "/education", color: "from-yellow-500 to-orange-500" },
    { title: "Optimization Tips", desc: "Reduce costs with smart resource optimization strategies", path: "/tips", color: "from-red-500 to-pink-500" },
    { title: "History", desc: "View your past calculations and AI recommendations", path: "/history", color: "from-indigo-500 to-indigo-600" },
    { title: "ML Metrics", desc: "View model accuracy, confusion matrix and classification report", path: "/metrics", color: "from-teal-500 to-teal-600" },
  ];

  return (
    <div className={`min-h-screen p-6 ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-5xl mx-auto">
        <div className={`rounded-2xl p-8 mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg`}>
          <div className="flex items-center gap-4">
            <img src={user.photoURL} alt={user.displayName} className="w-14 h-14 rounded-full border-4 border-white/30" />
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user.displayName}</h1>
              <p className="text-blue-100 text-sm mt-1">Your cloud cost optimization dashboard</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card) => (
            <Link to={card.path} key={card.path}>
              <div className={`rounded-xl shadow hover:shadow-lg transition-all duration-200 hover:-translate-y-1 p-6 ${dark ? "bg-gray-800 hover:bg-gray-750" : "bg-white"}`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-xl mb-4`}>
                  {card.icon}
                </div>
                <h2 className={`text-base font-semibold mb-1 ${dark ? "text-white" : "text-gray-800"}`}>{card.title}</h2>
                <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;