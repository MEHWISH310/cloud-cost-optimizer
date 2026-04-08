import React from "react";
import { Link } from "react-router-dom";

function Dashboard({ user, dark }) {
  const cards = [
    { title: "Cost Calculator", desc: "Estimate real-time cloud costs for AWS, Azure, and GCP", path: "/calculator", color: "from-blue-500 to-blue-600" },
    { title: "Cloud Comparison", desc: "Compare providers side by side to find the best option", path: "/comparison", color: "from-green-500 to-green-600" },
    { title: "AI Recommendation", desc: "Get intelligent recommendations based on your needs", path: "/recommendation", color: "from-purple-500 to-purple-600" },
    { title: "Learn Cloud Models", desc: "Understand IaaS, PaaS, SaaS and deployment models", path: "/education", color: "from-yellow-500 to-orange-500" },
    { title: "Optimization Tips", desc: "Reduce costs with smart resource optimization strategies", path: "/tips", color: "from-red-500 to-pink-500" },
    { title: "History", desc: "View your past calculations and AI recommendations", path: "/history", color: "from-indigo-500 to-indigo-600" },
    { title: "ML Metrics", desc: "View model accuracy, confusion matrix and classification report", path: "/metrics", color: "from-teal-500 to-teal-600" },
  ];

  const cardStyle = `rounded-xl shadow hover:shadow-lg transition-all duration-200 hover:-translate-y-1 p-6 ${dark ? "bg-gray-800 hover:bg-gray-750" : "bg-white"}`;
  const sectionStyle = `rounded-xl shadow p-6 mb-6 ${dark ? "bg-gray-800" : "bg-white"}`;
  const tableHeaderStyle = `p-3 text-left font-semibold ${dark ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"}`;
  const tableCellStyle = `p-3 ${dark ? "text-gray-300 border-gray-700" : "text-gray-600 border-gray-200"} border-b`;

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {cards.map((card) => (
            <Link to={card.path} key={card.path}>
              <div className={cardStyle}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} mb-4`}></div>
                <h2 className={`text-base font-semibold mb-1 ${dark ? "text-white" : "text-gray-800"}`}>{card.title}</h2>
                <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className={sectionStyle}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-800"}`}>System Architecture</h2>
          </div>
          <p className={`text-sm mb-4 leading-relaxed ${dark ? "text-gray-300" : "text-gray-600"}`}>
            The Cloud Cost Optimizer is built with a modern three-tier architecture. The frontend uses React.js with Tailwind CSS for responsive design and Chart.js for data visualization. The backend is powered by Node.js and Express.js, providing REST APIs for user management, history storage, and pricing calculations. The AI service runs on FastAPI with scikit-learn models for cloud recommendations. Data persistence is handled by MongoDB Atlas, and authentication is managed through Firebase Google OAuth. Real-time pricing is fetched from AWS, Azure, and GCP public APIs.
          </p>
          
          <h3 className={`text-md font-semibold mt-4 mb-3 ${dark ? "text-gray-200" : "text-gray-700"}`}>Technology Stack</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className={tableHeaderStyle}>Layer</th>
                  <th className={tableHeaderStyle}>Technology</th>
                  <th className={tableHeaderStyle}>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={tableCellStyle}>Frontend</td><td className={tableCellStyle}>React.js, Tailwind CSS, Chart.js</td><td className={tableCellStyle}>User interface, routing, data visualization</td></tr>
                <tr><td className={tableCellStyle}>Backend</td><td className={tableCellStyle}>Node.js, Express.js</td><td className={tableCellStyle}>REST API, business logic, database interaction</td></tr>
                <tr><td className={tableCellStyle}>AI Service</td><td className={tableCellStyle}>Python, FastAPI, Scikit-learn</td><td className={tableCellStyle}>ML model serving, recommendation engine</td></tr>
                <tr><td className={tableCellStyle}>Database</td><td className={tableCellStyle}>MongoDB Atlas</td><td className={tableCellStyle}>User profiles and history persistence</td></tr>
                <tr><td className={tableCellStyle}>Authentication</td><td className={tableCellStyle}>Firebase, Google OAuth 2.0</td><td className={tableCellStyle}>Secure user login and session management</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className={`text-md font-semibold mt-4 mb-3 ${dark ? "text-gray-200" : "text-gray-700"}`}>ML Model Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className={tableHeaderStyle}>Model</th>
                  <th className={tableHeaderStyle}>Best Algorithm</th>
                  <th className={tableHeaderStyle}>Accuracy</th>
                  <th className={tableHeaderStyle}>Precision</th>
                  <th className={tableHeaderStyle}>Recall</th>
                  <th className={tableHeaderStyle}>F1 Score</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={tableCellStyle}>Service Model</td><td className={tableCellStyle}>Gradient Boosting</td><td className={tableCellStyle}>94.50%</td><td className={tableCellStyle}>94.44%</td><td className={tableCellStyle}>94.50%</td><td className={tableCellStyle}>94.45%</td></tr>
                <tr><td className={tableCellStyle}>Deployment Model</td><td className={tableCellStyle}>Random Forest</td><td className={tableCellStyle}>88.25%</td><td className={tableCellStyle}>88.77%</td><td className={tableCellStyle}>88.25%</td><td className={tableCellStyle}>87.16%</td></tr>
                <tr><td className={tableCellStyle}>Cloud Provider</td><td className={tableCellStyle}>Gradient Boosting</td><td className={tableCellStyle}>93.50%</td><td className={tableCellStyle}>93.49%</td><td className={tableCellStyle}>93.50%</td><td className={tableCellStyle}>93.48%</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={sectionStyle}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-800"}`}>About This Project</h2>
          </div>
          <p className={`text-sm mb-3 leading-relaxed ${dark ? "text-gray-300" : "text-gray-600"}`}>
            Cloud Cost Optimizer is an AI-powered platform designed to help organizations reduce their cloud spending by providing real-time cost estimates, multi-cloud comparisons, and intelligent recommendations. The project addresses the growing challenge of cloud cost management across AWS, Azure, and Google Cloud Platform.
          </p>
          <p className={`text-sm mb-3 leading-relaxed ${dark ? "text-gray-300" : "text-gray-600"}`}>
            Key features include real-time cost calculation, multi-cloud comparison engine, ML-based recommendation system, user history tracking, and educational resources on cloud computing models. The platform is built with scalability and ease of use in mind, making cloud cost optimization accessible to both small startups and large enterprises.
          </p>
          
          <h3 className={`text-md font-semibold mt-4 mb-3 ${dark ? "text-gray-200" : "text-gray-700"}`}>Key Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className={`p-3 rounded-lg text-center ${dark ? "bg-gray-700" : "bg-gray-50"}`}><p className="text-sm font-medium">Real-time Cost Calculator</p></div>
            <div className={`p-3 rounded-lg text-center ${dark ? "bg-gray-700" : "bg-gray-50"}`}><p className="text-sm font-medium">Multi-Cloud Comparison</p></div>
            <div className={`p-3 rounded-lg text-center ${dark ? "bg-gray-700" : "bg-gray-50"}`}><p className="text-sm font-medium">AI Recommendations</p></div>
            <div className={`p-3 rounded-lg text-center ${dark ? "bg-gray-700" : "bg-gray-50"}`}><p className="text-sm font-medium">User History Tracking</p></div>
          </div>
        </div>

        <div className={sectionStyle}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-800"}`}>Contact Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${dark ? "bg-gray-700" : "bg-gray-50"}`}>
              <h3 className={`font-semibold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>Project Team</h3>
              <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>Student: Mehwish</p>
              <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>Supervisor: Dr. Anil Kumar Kakelli</p>
            </div>
            <div className={`p-4 rounded-lg ${dark ? "bg-gray-700" : "bg-gray-50"}`}>
              <h3 className={`font-semibold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>Reach Us</h3>
              <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>Email: mehwish310@gmail.com</p>
              <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>GitHub: github.com/MEHWISH310/cloud-cost-optimizer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;