import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

function Metrics({ dark }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTarget, setActiveTarget] = useState("service_model");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get("http://localhost:5001/metrics");
        setMetrics(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchMetrics();
  }, []);

  const card = `rounded-xl shadow p-6 ${dark ? "bg-gray-800" : "bg-white"}`;
  const label = `text-xs font-semibold uppercase tracking-wide mb-1 ${dark ? "text-gray-400" : "text-gray-500"}`;

  const targetLabels = {
    service_model: "Service Model",
    deployment_model: "Deployment Model",
    provider: "Cloud Provider",
  };

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${dark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
      Loading metrics...
    </div>
  );

  if (!metrics) return (
    <div className={`min-h-screen flex items-center justify-center ${dark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
      Could not load metrics. Make sure the AI service is running.
    </div>
  );

  const current = metrics[activeTarget];

  const modelNames = Object.keys(current.model_comparison);
  const accuracies = modelNames.map((m) => (current.model_comparison[m].accuracy * 100).toFixed(2));
  const precisions = modelNames.map((m) => (current.model_comparison[m].precision * 100).toFixed(2));
  const recalls = modelNames.map((m) => (current.model_comparison[m].recall * 100).toFixed(2));
  const f1s = modelNames.map((m) => (current.model_comparison[m].f1_score * 100).toFixed(2));

  const barData = {
    labels: modelNames,
    datasets: [
      { label: "Accuracy (%)", data: accuracies, backgroundColor: "#3B82F6", borderRadius: 6 },
      { label: "Precision (%)", data: precisions, backgroundColor: "#8B5CF6", borderRadius: 6 },
      { label: "Recall (%)", data: recalls, backgroundColor: "#10B981", borderRadius: 6 },
      { label: "F1 Score (%)", data: f1s, backgroundColor: "#F59E0B", borderRadius: 6 },
    ],
  };

  const radarData = {
    labels: ["Accuracy", "Precision", "Recall", "F1 Score"],
    datasets: modelNames.map((m, i) => ({
      label: m,
      data: [
        current.model_comparison[m].accuracy * 100,
        current.model_comparison[m].precision * 100,
        current.model_comparison[m].recall * 100,
        current.model_comparison[m].f1_score * 100,
      ],
      backgroundColor: [`rgba(59,130,246,0.2)`, `rgba(139,92,246,0.2)`, `rgba(16,185,129,0.2)`, `rgba(245,158,11,0.2)`][i],
      borderColor: [`#3B82F6`, `#8B5CF6`, `#10B981`, `#F59E0B`][i],
      borderWidth: 2,
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: dark ? "#fff" : "#333" } },
    },
    scales: {
      x: { ticks: { color: dark ? "#ccc" : "#555" } },
      y: { ticks: { color: dark ? "#ccc" : "#555" }, min: 50, max: 100 },
    },
  };

  const radarOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: dark ? "#fff" : "#333" } } },
    scales: {
      r: {
        min: 50,
        max: 100,
        ticks: { color: dark ? "#ccc" : "#555", backdropColor: "transparent" },
        pointLabels: { color: dark ? "#ccc" : "#555" },
        grid: { color: dark ? "#374151" : "#e5e7eb" },
      },
    },
  };

  const classReport = current.classification_report;
  const reportClasses = current.classes;

  return (
    <div className={`min-h-screen p-6 ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-2xl font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>ML Model Metrics</h1>
        <p className={`text-sm mb-6 ${dark ? "text-gray-400" : "text-gray-500"}`}>
          Performance analysis of the AI recommendation models trained on 2000 cloud workload records.
        </p>

        <div className="flex gap-3 mb-6 flex-wrap">
          {Object.keys(metrics).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTarget(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTarget === t ? "bg-blue-600 text-white" : dark ? "bg-gray-800 text-gray-300 border border-gray-700" : "bg-white text-gray-700 border"}`}
            >
              {targetLabels[t]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Best Model", value: current.best_model.replace("Classifier", "").replace("Regression", " Reg."), color: "text-blue-500" },
            { label: "Accuracy", value: `${(current.accuracy * 100).toFixed(2)}%`, color: "text-green-500" },
            { label: "Dataset Size", value: "2,000 records", color: "text-purple-500" },
            { label: "Classes", value: current.classes.join(", "), color: "text-yellow-500" },
          ].map((stat) => (
            <div key={stat.label} className={card}>
              <p className={label}>{stat.label}</p>
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className={card}>
            <h2 className={`text-base font-bold mb-4 ${dark ? "text-white" : "text-gray-800"}`}>Model Comparison - Bar Chart</h2>
            <Bar data={barData} options={chartOptions} />
          </div>
          <div className={card}>
            <h2 className={`text-base font-bold mb-4 ${dark ? "text-white" : "text-gray-800"}`}>Model Comparison - Radar Chart</h2>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        <div className={`${card} mb-6`}>
          <h2 className={`text-base font-bold mb-4 ${dark ? "text-white" : "text-gray-800"}`}>Model Comparison Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3 text-left rounded-tl-lg">Model</th>
                  <th className="p-3 text-center">Accuracy</th>
                  <th className="p-3 text-center">Precision</th>
                  <th className="p-3 text-center">Recall</th>
                  <th className="p-3 text-center rounded-tr-lg">F1 Score</th>
                </tr>
              </thead>
              <tbody>
                {modelNames.map((m, i) => (
                  <tr key={m} className={`${i % 2 === 0 ? dark ? "bg-gray-700" : "bg-gray-50" : dark ? "bg-gray-800" : "bg-white"} ${m === current.best_model ? "ring-2 ring-green-500" : ""}`}>
                    <td className={`p-3 font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>
                      {m} {m === current.best_model && <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Best</span>}
                    </td>
                    <td className={`p-3 text-center ${dark ? "text-gray-300" : "text-gray-600"}`}>{(current.model_comparison[m].accuracy * 100).toFixed(2)}%</td>
                    <td className={`p-3 text-center ${dark ? "text-gray-300" : "text-gray-600"}`}>{(current.model_comparison[m].precision * 100).toFixed(2)}%</td>
                    <td className={`p-3 text-center ${dark ? "text-gray-300" : "text-gray-600"}`}>{(current.model_comparison[m].recall * 100).toFixed(2)}%</td>
                    <td className={`p-3 text-center ${dark ? "text-gray-300" : "text-gray-600"}`}>{(current.model_comparison[m].f1_score * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${card} mb-6`}>
          <h2 className={`text-base font-bold mb-4 ${dark ? "text-white" : "text-gray-800"}`}>Classification Report</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-purple-600 text-white">
                  <th className="p-3 text-left rounded-tl-lg">Class</th>
                  <th className="p-3 text-center">Precision</th>
                  <th className="p-3 text-center">Recall</th>
                  <th className="p-3 text-center">F1 Score</th>
                  <th className="p-3 text-center rounded-tr-lg">Support</th>
                </tr>
              </thead>
              <tbody>
                {reportClasses.map((cls, i) => (
                  <tr key={cls} className={i % 2 === 0 ? dark ? "bg-gray-700" : "bg-gray-50" : dark ? "bg-gray-800" : "bg-white"}>
                    <td className={`p-3 font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>{cls}</td>
                    <td className={`p-3 text-center ${dark ? "text-gray-300" : "text-gray-600"}`}>{(classReport[cls]?.precision * 100).toFixed(2)}%</td>
                    <td className={`p-3 text-center ${dark ? "text-gray-300" : "text-gray-600"}`}>{(classReport[cls]?.recall * 100).toFixed(2)}%</td>
                    <td className={`p-3 text-center ${dark ? "text-gray-300" : "text-gray-600"}`}>{(classReport[cls]?.["f1-score"] * 100).toFixed(2)}%</td>
                    <td className={`p-3 text-center ${dark ? "text-gray-300" : "text-gray-600"}`}>{classReport[cls]?.support}</td>
                  </tr>
                ))}
                <tr className={`font-bold ${dark ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"}`}>
                  <td className="p-3">Weighted Avg</td>
                  <td className="p-3 text-center">{(classReport["weighted avg"]?.precision * 100).toFixed(2)}%</td>
                  <td className="p-3 text-center">{(classReport["weighted avg"]?.recall * 100).toFixed(2)}%</td>
                  <td className="p-3 text-center">{(classReport["weighted avg"]?.["f1-score"] * 100).toFixed(2)}%</td>
                  <td className="p-3 text-center">{classReport["weighted avg"]?.support}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={card}>
          <h2 className={`text-base font-bold mb-4 ${dark ? "text-white" : "text-gray-800"}`}>Confusion Matrix</h2>
          <div className="overflow-x-auto">
            <table className="text-sm mx-auto">
              <thead>
                <tr>
                  <th className={`p-3 ${dark ? "text-gray-400" : "text-gray-500"}`}>Actual / Predicted</th>
                  {current.classes.map((cls) => (
                    <th key={cls} className="p-3 text-blue-500 font-semibold">{cls}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {current.confusion_matrix.map((row, i) => (
                  <tr key={i}>
                    <td className={`p-3 font-semibold text-purple-500`}>{current.classes[i]}</td>
                    {row.map((val, j) => (
                      <td
                        key={j}
                        className={`p-3 text-center rounded font-medium ${i === j
                          ? "bg-green-500 text-white"
                          : val > 0
                          ? dark ? "bg-red-900 text-red-300" : "bg-red-100 text-red-700"
                          : dark ? "bg-gray-700 text-gray-400" : "bg-gray-50 text-gray-400"
                        }`}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`text-xs mt-3 ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Green diagonal = correct predictions. Red = misclassifications.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Metrics;