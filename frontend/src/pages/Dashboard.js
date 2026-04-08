import React from "react";
import { Link } from "react-router-dom";

function Dashboard({ user, dark }) {
  const cards = [
  { title: "Cost Calculator", desc: "Get real-time instance recommendations and pricing across AWS, Azure, and GCP", path: "/comparison", accent: "from-blue-500 to-blue-700", tag: "Calculator" },
  { title: "AI Recommendation", desc: "Get intelligent cloud setup recommendations tailored to your workload", path: "/recommendation", accent: "from-violet-500 to-violet-700", tag: "AI" },
  { title: "Learn Cloud Models", desc: "Understand IaaS, PaaS, SaaS and cloud deployment models in depth", path: "/education", accent: "from-amber-500 to-orange-600", tag: "Education" },
  { title: "Optimization Tips", desc: "Practical strategies to reduce cloud spending without sacrificing performance", path: "/tips", accent: "from-rose-500 to-rose-700", tag: "Tips" },
  { title: "History", desc: "Review and manage your past calculations and AI recommendations", path: "/history", accent: "from-indigo-500 to-indigo-700", tag: "History" },
  { title: "ML Metrics", desc: "Explore model accuracy, confusion matrix and classification performance", path: "/metrics", accent: "from-teal-500 to-teal-700", tag: "Metrics" },
];

  const bg = dark ? "bg-gray-950" : "bg-gray-50";
  const th = dark ? "text-white" : "text-gray-900";
  const ts = dark ? "text-gray-400" : "text-gray-500";
  const sectionBg = dark ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-100";
  const tableHead = dark ? "bg-gray-800 text-gray-300 text-sm" : "bg-gray-50 text-gray-500 text-sm";
  const tableBorder = dark ? "border-gray-800" : "border-gray-100";
  const tableText = dark ? "text-gray-400" : "text-gray-600";
  const innerBg = dark ? "bg-gray-800" : "bg-gray-50";

  return (
    <div className={`min-h-screen p-6 ${bg}`}>
      <div className="max-w-5xl mx-auto">

          <div className="rounded-2xl bg-blue-600 p-7 mb-6 shadow-lg">
          <div className="flex items-center gap-4">
            <img src={user.photoURL} alt={user.displayName} className="w-14 h-14 rounded-full border-2 border-white/30 shadow" />
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, {user.displayName}</h1>
              <p className="text-blue-100 text-sm mt-0.5">Your cloud cost optimization platform</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {cards.map((card) => (
            <Link to={card.path} key={card.path}>
              <div className={`group rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${dark ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-100 shadow-sm"}`}>
                <div className={`h-1.5 w-full bg-gradient-to-r ${card.accent}`}></div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className={`text-sm font-semibold leading-tight ${th}`}>{card.title}</h2>
                    <span className={`text-sm px-2 py-0.5 rounded-full font-medium ml-2 shrink-0 ${dark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>{card.tag}</span>
                  </div>
                  <p className={`text-sm leading-relaxed ${ts}`}>{card.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className={`rounded-xl p-6 mb-4 shadow-sm ${sectionBg}`}>
          <h2 className={`text-base font-semibold mb-1 ${th}`}>System Architecture</h2>
          <p className={`text-sm leading-relaxed mb-5 ${ts}`}>
            CloudBridge is built with a three-tier architecture. The frontend uses React.js with Tailwind CSS and Chart.js for data visualization. The backend is powered by Node.js and Express.js, providing REST APIs for user management, history storage, and real-time pricing. The AI service runs on FastAPI with scikit-learn models for cloud recommendations. Data persistence is handled by MongoDB Atlas, and authentication is managed through Firebase Google OAuth.
          </p>

          <h3 className={`text-sm font-semibold mb-2 uppercase tracking-wide ${ts}`}>Technology Stack</h3>
          <div className={`rounded-lg overflow-hidden border mb-5 ${tableBorder}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className={tableHead}>
                  <th className="p-3 text-left font-semibold">Layer</th>
                  <th className="p-3 text-left font-semibold">Technology</th>
                  <th className="p-3 text-left font-semibold">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Frontend", "React.js, Tailwind CSS, Chart.js", "User interface, routing, data visualization"],
                  ["Backend", "Node.js, Express.js", "REST API, business logic, database interaction"],
                  ["AI Service", "Python, FastAPI, Scikit-learn", "ML model serving, recommendation engine"],
                  ["Database", "MongoDB Atlas", "User profiles and history persistence"],
                  ["Authentication", "Firebase, Google OAuth 2.0", "Secure user login and session management"],
                ].map(([layer, tech, purpose]) => (
                  <tr key={layer} className={`border-t ${tableBorder}`}>
                    <td className={`p-3 font-semibold ${th}`}>{layer}</td>
                    <td className={`p-3 ${tableText}`}>{tech}</td>
                    <td className={`p-3 ${tableText}`}>{purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className={`text-sm font-semibold mb-2 uppercase tracking-wide ${ts}`}>ML Model Performance</h3>
          <div className={`rounded-lg overflow-hidden border ${tableBorder}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className={tableHead}>
                  <th className="p-3 text-left font-semibold">Prediction Target</th>
                  <th className="p-3 text-left font-semibold">Best Algorithm</th>
                  <th className="p-3 text-left font-semibold">Accuracy</th>
                  <th className="p-3 text-left font-semibold">Precision</th>
                  <th className="p-3 text-left font-semibold">Recall</th>
                  <th className="p-3 text-left font-semibold">F1 Score</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Service Model", "Gradient Boosting", "94.50%", "94.44%", "94.50%", "94.45%"],
                  ["Deployment Model", "Random Forest", "88.25%", "88.77%", "88.25%", "87.16%"],
                  ["Cloud Provider", "Gradient Boosting", "93.50%", "93.49%", "93.50%", "93.48%"],
                ].map(([model, algo, acc, prec, rec, f1]) => (
                  <tr key={model} className={`border-t ${tableBorder}`}>
                    <td className={`p-3 font-semibold ${th}`}>{model}</td>
                    <td className={`p-3 ${tableText}`}>{algo}</td>
                    <td className="p-3 font-bold text-green-500">{acc}</td>
                    <td className={`p-3 ${tableText}`}>{prec}</td>
                    <td className={`p-3 ${tableText}`}>{rec}</td>
                    <td className={`p-3 ${tableText}`}>{f1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`rounded-xl p-6 mb-4 shadow-sm ${sectionBg}`}>
          <h2 className={`text-base font-semibold mb-2 ${th}`}>About CloudBridge</h2>
          <p className={`text-sm leading-relaxed mb-3 ${ts}`}>
            CloudBridge is an AI-powered platform designed to help organizations reduce their cloud spending by providing real-time cost estimates, multi-cloud comparisons, and intelligent recommendations. The project addresses the growing challenge of cloud cost management across AWS, Azure, and Google Cloud Platform.
          </p>
          <p className={`text-sm leading-relaxed mb-4 ${ts}`}>
            The platform combines real-time pricing data from cloud provider APIs with machine learning models trained on 2000 cloud workload records to deliver actionable recommendations tailored to each user's specific requirements.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Real-time Cost Calculator", "Multi-Cloud Comparison", "AI Recommendations", "User History Tracking"].map((f) => (
              <div key={f} className={`p-3 rounded-lg text-center border ${dark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
                <p className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>{f}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-xl p-6 shadow-sm ${sectionBg}`}>
          <h2 className={`text-base font-semibold mb-4 ${th}`}>Project Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className={`p-4 rounded-lg ${innerBg}`}>
              <h3 className={`text-sm font-semibold uppercase tracking-wide mb-2 ${ts}`}>Team</h3>
              <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}>Student: Mehwish</p>
              <p className={`text-sm mt-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>Supervisor: Dr. Anil Kumar Kakelli</p>
            </div>
            <div className={`p-4 rounded-lg ${innerBg}`}>
              <h3 className={`text-sm font-semibold uppercase tracking-wide mb-2 ${ts}`}>Links</h3>
              <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}>mehwish310@gmail.com</p>
              <p className={`text-sm mt-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>github.com/MEHWISH310/cloud-cost-optimizer</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;