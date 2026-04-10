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

// ── Segmented Control ──────────────────────────────────────────────────────────
function SegmentedControl({ options, value, onChange, dark }) {
  return (
    <div className={`flex rounded-lg overflow-hidden border ${dark ? "border-gray-700 bg-gray-950" : "border-gray-200 bg-gray-100"}`}>
      {options.map((opt, i) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-semibold transition-all duration-150
              ${i > 0 ? (dark ? "border-l border-gray-700" : "border-l border-gray-200") : ""}
              ${selected
                ? dark
                  ? "bg-blue-600/20 text-blue-400 shadow-inner ring-inset ring-1 ring-blue-500"
                  : "bg-white text-blue-600 shadow ring-inset ring-1 ring-blue-500"
                : dark
                  ? "bg-transparent text-gray-300 hover:text-white"
                  : "bg-transparent text-gray-600 hover:text-gray-900"
              }`}
          >
            <span className="leading-none mb-0.5">{opt.label}</span>
            {opt.desc && (
               <span className={`text-[10px] leading-tight ${selected ? (dark ? "text-blue-500" : "text-blue-400") : dark ? "text-gray-400" : "text-gray-500"}`}>
                {opt.desc}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Toggle Row ────────────────────────────────────────────────────────────────
function ToggleRow({ field, label, desc, value, onChange, dark }) {
  const active = value === 1;
  return (
    <div
      onClick={() => onChange(field, active ? 0 : 1)}
      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all duration-150
        ${active
          ? dark
            ? "border-blue-500/40 bg-blue-600/10"
            : "border-blue-400/40 bg-blue-50"
          : dark
            ? "border-gray-800 bg-gray-900 hover:border-gray-700"
            : "border-gray-100 bg-gray-50 hover:border-gray-200"
        }`}
    >
      {/* pill toggle */}
      <div className={`mt-0.5 w-9 h-5 rounded-full flex-shrink-0 relative transition-colors duration-150
        ${active ? "bg-blue-500" : dark ? "bg-gray-700" : "bg-gray-300"}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-150
          ${active ? "left-[18px]" : "left-0.5"}`} />
      </div>
      <div>
        <p className={`text-xs font-medium leading-tight mb-0.5 ${dark ? "text-gray-200" : "text-gray-700"}`}>{label}</p>
        <p className={`text-[11px] leading-tight ${dark ? "text-gray-500" : "text-gray-400"}`}>{desc}</p>
      </div>
    </div>
  );
}

// ── Section Card ──────────────────────────────────────────────────────────────
function Section({ title, dark, children }) {
  return (
    <div className={`rounded-xl p-6 border shadow-sm ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
      <p className={`text-[10px] font-bold tracking-widest uppercase mb-4 ${dark ? "text-blue-400" : "text-blue-600"}`}>
        {title}
      </p>
      {children}
    </div>
  );
}

function ErrMsg({ msg }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-[11px] mt-1.5 text-red-400">
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
        <path d="M6 3.5v3M6 8v.5" stroke="currentColor" strokeLinecap="round" />
      </svg>
      {msg}
    </p>
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
    if (!form.uptime_requirement || u < 90 || u > 100) e.uptime_requirement = "Must be between 90–100";
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
      const user = auth.currentUser;
      if (user) {
        await axios.post("http://localhost:5000/api/history/save", {
          uid: user.uid,
          type: "recommendation",
          input: payload,
          output: res.data,
        });
      }
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

  const inputCls = (err) =>
    `w-full border rounded-lg px-3 py-2 text-sm outline-none transition focus:ring-2
    ${dark
      ? "bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
      : "bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
    }
    ${err ? (dark ? "border-red-500" : "border-red-400") : ""}`;

  const labelCls = `block text-xs font-medium mb-1.5 ${dark ? "text-gray-200" : "text-gray-700"}`;
  const hintCls = `text-[11px] mt-1.5 ${dark ? "text-gray-500" : "text-gray-400"}`;

  // Provider accent colours
  const providerMeta = !result ? {} : {
    AWS:   { color: "text-orange-400",  ring: "ring-orange-500/30",  bg: dark ? "bg-orange-500/10"  : "bg-orange-50"  },
    Azure: { color: "text-blue-400",    ring: "ring-blue-500/30",    bg: dark ? "bg-blue-500/10"    : "bg-blue-50"    },
    GCP:   { color: "text-emerald-400", ring: "ring-emerald-500/30", bg: dark ? "bg-emerald-500/10" : "bg-emerald-50" },
  }[result?.provider] || { color: "text-blue-400", ring: "ring-blue-500/30", bg: dark ? "bg-blue-500/10" : "bg-blue-50" };

  return (
    <div className={`min-h-screen p-6 ${dark ? "bg-gray-950" : "bg-gray-50"}`}>
      <div className="max-w-5xl mx-auto">

        {/* Header — matches Comparison.jsx header */}
        <h1 className={`text-xl font-bold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>
          AI Recommendation Engine
        </h1>
        <p className={`text-xs mb-6 ${dark ? "text-gray-400" : "text-gray-500"}`}>
          Answer a few questions about your workload and the ML model will recommend the optimal cloud configuration.
        </p>

        {/* ── Section 1 · Workload ─────────────────────────── */}
        <div className="space-y-4">
          <Section title="1 · Workload type" dark={dark}>
            <SegmentedControl
              options={WORKLOAD_OPTIONS}
              value={form.workload}
              onChange={(v) => setField("workload", v)}
              dark={dark}
            />
          </Section>

          {/* ── Section 2 · Budget & Team ────────────────────── */}
          <Section title="2 · Budget & team" dark={dark}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Monthly budget (USD) <span className="text-red-400">*</span></label>
                <div className="relative">
                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none ${dark ? "text-gray-500" : "text-gray-400"}`}>$</span>
                  <input
                    type="number" min="0"
                    className={inputCls(errors.budget) + " pl-7"}
                    placeholder="500"
                    value={form.budget}
                    onChange={(e) => setField("budget", e.target.value)}
                  />
                </div>
                <ErrMsg msg={errors.budget} />
                {!errors.budget && <p className={hintCls}>Total expected cloud spend per month</p>}
              </div>
              <div>
                <label className={labelCls}>Team size <span className="text-red-400">*</span></label>
                <input
                  type="number" min="1"
                  className={inputCls(errors.team_size)}
                  placeholder="10"
                  value={form.team_size}
                  onChange={(e) => setField("team_size", e.target.value)}
                />
                <ErrMsg msg={errors.team_size} />
                {!errors.team_size && <p className={hintCls}>Number of engineers on your team</p>}
              </div>
            </div>
          </Section>

          {/* ── Section 3 · Infrastructure ───────────────────── */}
          <Section title="3 · Infrastructure requirements" dark={dark}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelCls}>Data volume (GB) <span className="text-red-400">*</span></label>
                <input
                  type="number" min="0"
                  className={inputCls(errors.data_volume_gb)}
                  placeholder="100"
                  value={form.data_volume_gb}
                  onChange={(e) => setField("data_volume_gb", e.target.value)}
                />
                <ErrMsg msg={errors.data_volume_gb} />
                {!errors.data_volume_gb && <p className={hintCls}>Total data to store or process</p>}
              </div>
              <div>
                <label className={labelCls}>Uptime requirement (%) <span className="text-red-400">*</span></label>
                <input
                  type="number" min="90" max="100" step="0.1"
                  className={inputCls(errors.uptime_requirement)}
                  placeholder="99.9"
                  value={form.uptime_requirement}
                  onChange={(e) => setField("uptime_requirement", e.target.value)}
                />
                <ErrMsg msg={errors.uptime_requirement} />
                {!errors.uptime_requirement && <p className={hintCls}>e.g. 99.9 for three-nines SLA</p>}
              </div>
            </div>

            <div className="mb-4">
              <label className={`${labelCls} mb-2`}>Scalability need</label>
              <SegmentedControl
                options={SCALE_OPTIONS}
                value={form.scalability}
                onChange={(v) => setField("scalability", v)}
                dark={dark}
              />
            </div>
            <div>
              <label className={`${labelCls} mb-2`}>Security requirement</label>
              <SegmentedControl
                options={SECURITY_OPTIONS}
                value={form.security}
                onChange={(v) => setField("security", v)}
                dark={dark}
              />
            </div>
          </Section>

          {/* ── Section 4 · Region ───────────────────────────── */}
          <Section title="4 · Deployment region" dark={dark}>
            <div className="flex gap-3">
              {REGION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setField("region", opt.value)}
                  className={`flex-1 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all duration-150
                    ${form.region === opt.value
                      ? "bg-blue-600 border-blue-600 text-white"
                      : dark
                        ? "bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Section>

          {/* ── Section 5 · Additional Factors ──────────────── */}
          <Section title="5 · Additional factors" dark={dark}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {TOGGLES.map((t) => (
                <ToggleRow
                  key={t.field}
                  field={t.field}
                  label={t.label}
                  desc={t.desc}
                  value={form[t.field]}
                  onChange={setToggle}
                  dark={dark}
                />
              ))}
            </div>
          </Section>

          {/* ── Submit Button ────────────────────────────────── */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm
              hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a8 8 0 00-8 8h4z" />
                </svg>
                Analyzing your requirements…
              </>
            ) : (
              "Get AI Recommendation"
            )}
          </button>

          {/* ── Result Card ──────────────────────────────────── */}
          {result && (
            <div className={`rounded-xl border shadow-sm ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>

              {/* Result header */}
              <div className={`flex items-center gap-2 px-6 py-4 border-b ${dark ? "border-gray-800" : "border-gray-100"}`}>
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <p className={`text-[10px] font-bold tracking-widest uppercase ${dark ? "text-gray-500" : "text-gray-400"}`}>
                  Recommendation
                </p>
              </div>

              <div className="p-6">
                {/* 3 stat tiles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                  {[
                    {
                      label: "Cloud Provider",
                      value: result.provider,
                      cls: providerMeta.color,
                      bg: providerMeta.bg,
                      ring: providerMeta.ring,
                    },
                    {
                      label: "Service Model",
                      value: result.serviceModel,
                      cls: dark ? "text-violet-400" : "text-violet-600",
                      bg: dark ? "bg-violet-500/10" : "bg-violet-50",
                      ring: "ring-violet-500/30",
                    },
                    {
                      label: "Deployment",
                      value: result.deploymentModel,
                      cls: dark ? "text-emerald-400" : "text-emerald-600",
                      bg: dark ? "bg-emerald-500/10" : "bg-emerald-50",
                      ring: "ring-emerald-500/30",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`rounded-lg p-4 text-center ring-1 ${item.bg} ${item.ring}`}
                    >
                      <p className={`text-[11px] mb-1.5 ${dark ? "text-gray-500" : "text-gray-400"}`}>{item.label}</p>
                      <p className={`text-base font-bold ${item.cls}`}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Reasoning box */}
                <div className={`rounded-lg p-4 ${dark ? "bg-gray-950 border border-gray-800" : "bg-gray-50 border border-gray-100"}`}>
                  <p className={`text-[10px] font-bold tracking-widest uppercase mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                    Why this recommendation
                  </p>
                  <p className={`text-xs leading-relaxed ${dark ? "text-gray-300" : "text-gray-600"}`}>
                    {result.reason}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recommendation;