import React, { useState } from "react";
import axios from "axios";
import { auth } from "../firebase";

const WORKLOAD_OPTIONS = [
  { value: "startup", label: "Startup", desc: "Lean, cost-sensitive" },
  { value: "enterprise", label: "Enterprise", desc: "High availability" },
  { value: "ml", label: "ML / AI", desc: "GPU, pipelines" },
  { value: "webapp", label: "Web App", desc: "Variable traffic" },
];

const REGION_OPTIONS = [
  { value: "us", label: "United States" },
  { value: "eu", label: "Europe" },
  { value: "asia", label: "Asia Pacific" },
];

const SCALE_OPTIONS = [
  { value: "low", label: "Low", desc: "Stable load" },
  { value: "medium", label: "Medium", desc: "Occasional spikes" },
  { value: "high", label: "High", desc: "Frequent spikes" },
];

const SECURITY_OPTIONS = [
  { value: "basic", label: "Basic", desc: "Standard" },
  { value: "moderate", label: "Moderate", desc: "Enhanced" },
  { value: "high", label: "High", desc: "Strict" },
];

const TOGGLES = [
  { field: "compliance_required", label: "Compliance required", desc: "GDPR, HIPAA or similar regulations apply" },
  { field: "existing_infra", label: "Existing on-premise infra", desc: "You already have on-premise infrastructure" },
  { field: "uses_microsoft_stack", label: "Microsoft stack", desc: "Windows Server, .NET, Active Directory in use" },
  { field: "uses_google_workspace", label: "Google Workspace", desc: "Gmail, Drive, Docs used across the team" },
  { field: "multi_region", label: "Multi-region deployment", desc: "Services need to run across multiple regions" },
  { field: "serverless_preference", label: "Prefer serverless", desc: "Lambda/Functions preferred over managed VMs" },
];

function SegmentedControl({ options, value, onChange, dark }) {
  return (
    <div className={`flex rounded-lg p-0.5 gap-0.5 ${dark ? "bg-gray-700" : "bg-gray-100"}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 flex flex-col items-center py-2 px-1 rounded-md text-center transition-all ${
            value === opt.value
              ? dark ? "bg-gray-600 text-white shadow-sm" : "bg-white text-gray-900 shadow-sm"
              : dark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span className="text-xs font-semibold">{opt.label}</span>
          {opt.desc && (
            <span className={`text-xs mt-0.5 leading-tight hidden sm:block ${
              value === opt.value
                ? dark ? "text-gray-300" : "text-gray-500"
                : dark ? "text-gray-600" : "text-gray-400"
            }`}>
              {opt.desc}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function ToggleRow({ field, label, desc, value, onChange, dark }) {
  return (
    <div
      onClick={() => onChange(field, value === 1 ? 0 : 1)}
      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none ${
        value === 1
          ? dark ? "bg-blue-900/20 border-blue-700" : "bg-blue-50 border-blue-200"
          : dark ? "border-gray-700 hover:border-gray-600" : "bg-white border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className={`mt-0.5 w-9 h-5 rounded-full flex-shrink-0 relative transition-colors ${value === 1 ? "bg-blue-600" : dark ? "bg-gray-600" : "bg-gray-300"}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value === 1 ? "translate-x-4" : "translate-x-0.5"}`} />
      </div>
      <div>
        <p className={`text-sm font-medium leading-none mb-1 ${dark ? "text-gray-200" : "text-gray-800"}`}>{label}</p>
        <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>{desc}</p>
      </div>
    </div>
  );
}

function Recommendation({ dark }) {
  const [form, setForm] = useState({
    budget: "",
    workload: "startup",
    scalability: "low",
    security: "basic",
    region: "us",
    team_size: "",
    data_volume_gb: "",
    uptime_requirement: "99.9",
    compliance_required: 0,
    existing_infra: 0,
    uses_microsoft_stack: 0,
    uses_google_workspace: 0,
    multi_region: 0,
    serverless_preference: 0,
  });
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.budget || parseFloat(form.budget) <= 0) e.budget = "Enter a valid monthly budget";
    if (!form.team_size || parseFloat(form.team_size) <= 0) e.team_size = "Enter your team size";
    if (!form.data_volume_gb || parseFloat(form.data_volume_gb) <= 0) e.data_volume_gb = "Enter expected data volume";
    const u = parseFloat(form.uptime_requirement);
    if (!form.uptime_requirement || u < 90 || u > 100) e.uptime_requirement = "Must be between 90 and 100";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      const payload = {
        ...form,
        budget: parseFloat(form.budget),
        team_size: parseFloat(form.team_size),
        data_volume_gb: parseFloat(form.data_volume_gb),
        uptime_requirement: parseFloat(form.uptime_requirement),
      };
      const res = await axios.post("http://localhost:5001/recommend", payload);
      setResult(res.data);
      await axios.post("http://localhost:5000/api/history/save", {
        uid: (await auth.currentUser).uid,
        type: "recommendation",
        input: payload,
        output: res.data,
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const setToggle = (field, val) => setForm((f) => ({ ...f, [field]: val }));
  const setField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const bg = dark ? "bg-gray-900" : "bg-gray-50";
  const card = `rounded-xl border p-6 ${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`;
  const text = dark ? "text-white" : "text-gray-900";
  const sub = dark ? "text-gray-400" : "text-gray-500";
  const divider = dark ? "border-gray-700" : "border-gray-100";
  const sectionLabel = `text-xs font-semibold uppercase tracking-widest mb-3 ${dark ? "text-gray-500" : "text-gray-400"}`;
  const labelCls = `block text-xs font-medium mb-1.5 ${dark ? "text-gray-400" : "text-gray-600"}`;

  const inputBase = `w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors ${
    dark ? "bg-gray-700 text-white placeholder-gray-500" : "bg-white text-gray-900 placeholder-gray-400"
  }`;
  const inp = (err) => err
    ? `${inputBase} border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400`
    : `${inputBase} ${dark ? "border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"}`;

  const ErrMsg = ({ msg }) => msg ? (
    <p className="flex items-center gap-1 text-xs mt-1.5 text-red-500">
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5.5" stroke="currentColor"/><path d="M6 3.5v3M6 8v.5" stroke="currentColor" strokeLinecap="round"/></svg>
      {msg}
    </p>
  ) : null;

  const providerBg = !result ? "" :
    result.provider === "AWS" ? dark ? "bg-orange-900/20 border-orange-800" : "bg-orange-50 border-orange-200"
    : result.provider === "Azure" ? dark ? "bg-blue-900/20 border-blue-800" : "bg-blue-50 border-blue-200"
    : dark ? "bg-green-900/20 border-green-800" : "bg-green-50 border-green-200";

  const providerColor = !result ? "" :
    result.provider === "AWS" ? "text-orange-500"
    : result.provider === "Azure" ? "text-blue-500"
    : "text-green-500";

  return (
    <div className={`min-h-screen ${bg}`}>
      <div className="max-w-2xl mx-auto px-5 py-8">

        <div className="mb-6">
          <h1 className={`text-xl font-semibold ${text}`}>AI Recommendation Engine</h1>
          <p className={`text-sm mt-1 ${sub}`}>Answer a few questions about your workload and the ML model will recommend the optimal cloud configuration.</p>
        </div>

        <div className={card}>


          <p className={sectionLabel}>1 · Workload type</p>
          <SegmentedControl options={WORKLOAD_OPTIONS} value={form.workload} onChange={(v) => setField("workload", v)} dark={dark} />

          <div className={`my-5 border-t ${divider}`} />

          <p className={sectionLabel}>2 · Budget & team</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Monthly budget (USD) <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${sub}`}>$</span>
                <input type="number" min="0" className={`${inp(errors.budget)} pl-7`} placeholder="500"
                  value={form.budget} onChange={(e) => setField("budget", e.target.value)} />
              </div>
              <ErrMsg msg={errors.budget} />
              {!errors.budget && <p className={`text-xs mt-1 ${sub}`}>Total expected cloud spend per month</p>}
            </div>
            <div>
              <label className={labelCls}>Team size <span className="text-red-500">*</span></label>
              <input type="number" min="1" className={inp(errors.team_size)} placeholder="10"
                value={form.team_size} onChange={(e) => setField("team_size", e.target.value)} />
              <ErrMsg msg={errors.team_size} />
              {!errors.team_size && <p className={`text-xs mt-1 ${sub}`}>Number of engineers on your team</p>}
            </div>
          </div>

          <div className={`my-5 border-t ${divider}`} />

          <p className={sectionLabel}>3 · Infrastructure requirements</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Data volume (GB) <span className="text-red-500">*</span></label>
              <input type="number" min="0" className={inp(errors.data_volume_gb)} placeholder="100"
                value={form.data_volume_gb} onChange={(e) => setField("data_volume_gb", e.target.value)} />
              <ErrMsg msg={errors.data_volume_gb} />
              {!errors.data_volume_gb && <p className={`text-xs mt-1 ${sub}`}>Total data to store or process</p>}
            </div>
            <div>
              <label className={labelCls}>Uptime requirement (%) <span className="text-red-500">*</span></label>
              <input type="number" min="90" max="100" step="0.1" className={inp(errors.uptime_requirement)} placeholder="99.9"
                value={form.uptime_requirement} onChange={(e) => setField("uptime_requirement", e.target.value)} />
              <ErrMsg msg={errors.uptime_requirement} />
              {!errors.uptime_requirement && <p className={`text-xs mt-1 ${sub}`}>e.g. 99.9 for three-nines SLA</p>}
            </div>
          </div>

          <div className="mb-4">
            <p className={labelCls}>Scalability need</p>
            <SegmentedControl options={SCALE_OPTIONS} value={form.scalability} onChange={(v) => setField("scalability", v)} dark={dark} />
          </div>

          <div>
            <p className={labelCls}>Security requirement</p>
            <SegmentedControl options={SECURITY_OPTIONS} value={form.security} onChange={(v) => setField("security", v)} dark={dark} />
          </div>

          <div className={`my-5 border-t ${divider}`} />

          <p className={sectionLabel}>4 · Deployment region</p>
          <div className="flex gap-2">
            {REGION_OPTIONS.map((opt) => (
              <button key={opt.value} type="button" onClick={() => setField("region", opt.value)}
                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  form.region === opt.value
                    ? "bg-blue-600 border-blue-600 text-white"
                    : dark ? "bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500" : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className={`my-5 border-t ${divider}`} />
          <p className={sectionLabel}>5 · Additional factors</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TOGGLES.map((t) => (
              <ToggleRow key={t.field} field={t.field} label={t.label} desc={t.desc} value={form[t.field]} onChange={setToggle} dark={dark} />
            ))}
          </div>

          <div className={`my-5 border-t ${divider}`} />

          <button onClick={handleSubmit} disabled={loading}
            className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
              loading ? "bg-purple-400 text-white cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white"
            }`}
          >
            {loading ? (
              <>
                
                Analyzing your requirements…
              </>
            ) : (
              <>
                Get AI recommendation
              </>
            )}
          </button>
        </div>

        {result && (
          <div className={`mt-4 ${card}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className={`text-xs font-semibold uppercase tracking-widest ${dark ? "text-gray-500" : "text-gray-400"}`}>Recommendation</p>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className={`rounded-lg border p-4 text-center ${providerBg}`}>
                <p className={`text-xs mb-1.5 ${sub}`}>Cloud provider</p>
                <p className={`text-base font-bold ${providerColor}`}>{result.provider}</p>
              </div>
              <div className={`rounded-lg border p-4 text-center ${dark ? "bg-purple-900/20 border-purple-800" : "bg-purple-50 border-purple-200"}`}>
                <p className={`text-xs mb-1.5 ${sub}`}>Service model</p>
                <p className="text-base font-bold text-purple-500">{result.serviceModel}</p>
              </div>
              <div className={`rounded-lg border p-4 text-center ${dark ? "bg-green-900/20 border-green-800" : "bg-green-50 border-green-200"}`}>
                <p className={`text-xs mb-1.5 ${sub}`}>Deployment</p>
                <p className="text-base font-bold text-green-500">{result.deploymentModel}</p>
              </div>
            </div>
            <div className={`rounded-lg p-4 ${dark ? "bg-gray-700" : "bg-gray-50"}`}>
              <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${dark ? "text-gray-400" : "text-gray-500"}`}>Why this recommendation</p>
              <p className={`text-sm leading-relaxed ${sub}`}>{result.reason}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Recommendation;