import React from "react";
import { Link } from "react-router-dom";

function Dashboard({ user }) {
  const cards = [
    { title: "Cost Calculator", desc: "Estimate real-time cloud costs for AWS, Azure, and GCP", path: "/calculator", color: "bg-blue-500" },
    { title: "Cloud Comparison", desc: "Compare providers side by side to find the best option", path: "/comparison", color: "bg-green-500" },
    { title: "AI Recommendation", desc: "Get intelligent recommendations based on your needs", path: "/recommendation", color: "bg-purple-500" },
    { title: "Learn Cloud Models", desc: "Understand IaaS, PaaS, SaaS and deployment models", path: "/education", color: "bg-yellow-500" },
    { title: "Optimization Tips", desc: "Reduce costs with smart resource optimization strategies", path: "/tips", color: "bg-red-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user.displayName}</h1>
        <p className="text-gray-500 mb-8">Your cloud cost optimization dashboard</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link to={card.path} key={card.path}>
              <div className="bg-white rounded-lg shadow hover:shadow-md transition p-6">
                <div className={`w-10 h-10 rounded-full ${card.color} mb-4`}></div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">{card.title}</h2>
                <p className="text-sm text-gray-500">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;