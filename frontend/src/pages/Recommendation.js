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

// Inject global styles once
const GLOBAL_CSS = `
  .rec-input {
    width: 100%;
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 13px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }
  .rec-input::placeholder { opacity: 1; }
  .rec-input:focus { box-shadow: 0 0 0 3px rgba(59,130,246,0.2); }
  .rec-input.err:focus { box-shadow: 0 0 0 3px rgba(248,113,113,0.2); }
  .rec-input-dark {
    background: #1e2433;
    color: #f1f5f9;
    border: 1px solid #2d3748;
  }
  .rec-input-dark::placeholder { color: #64748b; }
  .rec-input-dark:focus { border-color: #3b82f6; }
  .rec-input-dark.err { border-color: #f87171; }
  .rec-input-light {
    background: #ffffff;
    color: #0f172a;
    border: 1px solid #cbd5e1;
  }
  .rec-input-light::placeholder { color: #94a3b8; }
  .rec-input-light:focus { border-color: #3b82f6; }
  .rec-input-light.err { border-color: #f87171; }
  .region-btn:hover { opacity: 0.85; }
  @keyframes rec-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .rec-spin { animation: rec-spin 1s linear infinite; }
`;

function SegmentedControl({ options, value, onChange, dark }) {
  return (
    <div style={{
      display: "flex",
      borderRadius: "10px",
      overflow: "hidden",
      border: dark ? "1px solid #2d3748" : "1px solid #cbd5e1",
      background: dark ? "#151a27" : "#f1f5f9",
    }}>
      {options.map((opt, i) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "11px 8px",
              border: "none",
              borderLeft: i > 0 ? (dark ? "1px solid #2d3748" : "1px solid #cbd5e1") : "none",
              cursor: "pointer",
              transition: "all 0.15s ease",
              background: selected
                ? dark ? "#1a2d52" : "#ffffff"
                : "transparent",
              boxShadow: selected
                ? dark ? "inset 0 0 0 1.5px #3b82f6" : "inset 0 0 0 1.5px #3b82f6"
                : "none",
            }}
          >
            <span style={{
              fontSize: "12px",
              fontWeight: 600,
              color: selected
                ? dark ? "#93b4ff" : "#1d4ed8"
                : dark ? "#94a3b8" : "#64748b",
              lineHeight: 1,
              marginBottom: opt.desc ? "4px" : 0,
            }}>
              {opt.label}
            </span>
            {opt.desc && (
              <span style={{
                fontSize: "11px",
                color: selected
                  ? dark ? "#6490e8" : "#3b82f6"
                  : dark ? "#4b5a70" : "#94a3b8",
                lineHeight: 1.2,
              }}>
                {opt.desc}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function ToggleRow({ field, label, desc, value, onChange, dark }) {
  return (
    <div
      onClick={() => onChange(field, value === 1 ? 0 : 1)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "12px",
        borderRadius: "8px",
        border: value === 1
          ? "1px solid rgba(59,130,246,0.45)"
          : dark ? "1px solid #222b3a" : "1px solid #e2e8f0",
        background: value === 1
          ? dark ? "rgba(59,130,246,0.1)" : "rgba(59,130,246,0.05)"
          : dark ? "#181e2c" : "#f8fafc",
        cursor: "pointer",
        userSelect: "none",
        transition: "all 0.15s ease",
      }}
    >
      <div style={{
        marginTop: "2px",
        width: "36px",
        height: "20px",
        borderRadius: "10px",
        flexShrink: 0,
        position: "relative",
        background: value === 1 ? "#3b82f6" : dark ? "#2d3748" : "#cbd5e1",
        transition: "background 0.15s ease",
      }}>
        <div style={{
          position: "absolute",
          top: "2px",
          left: value === 1 ? "18px" : "2px",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          transition: "left 0.15s ease",
        }} />
      </div>
      <div>
        <p style={{
          fontSize: "13px",
          fontWeight: 500,
          color: dark ? "#e2e8f0" : "#1e293b",
          marginBottom: "3px",
          lineHeight: 1.2,
        }}>{label}</p>
        <p style={{
          fontSize: "11px",
          color: dark ? "#64748b" : "#94a3b8",
          lineHeight: 1.3,
        }}>{desc}</p>
      </div>
    </div>
  );
}

function Section({ title, dark, children, first }) {
  return (
    <div style={{
      background: dark ? "#171c2b" : "#ffffff",
      border: dark ? "1px solid #222b3a" : "1px solid #e2e8f0",
      borderRadius: "12px",
      padding: "24px",
      marginTop: first ? 0 : "14px",
    }}>
      <p style={{
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: dark ? "#4a6080" : "#94a3b8",
        marginBottom: "18px",
        margin: "0 0 18px 0",
      }}>{title}</p>
      {children}
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

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    marginBottom: "7px",
    color: dark ? "#cbd5e1" : "#334155",
  };

  const hintStyle = {
    fontSize: "11px",
    marginTop: "6px",
    color: dark ? "#4a6080" : "#94a3b8",
  };

  const inputCls = (err) =>
    `rec-input ${dark ? "rec-input-dark" : "rec-input-light"}${err ? " err" : ""}`;

  const ErrMsg = ({ msg }) =>
    msg ? (
      <p style={{ fontSize: "11px", marginTop: "5px", color: "#f87171", display: "flex", alignItems: "center", gap: "4px" }}>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
          <path d="M6 3.5v3M6 8v.5" stroke="currentColor" strokeLinecap="round" />
        </svg>
        {msg}
      </p>
    ) : null;

  const providerColor =
    !result ? "" :
    result.provider === "AWS" ? "#fb923c" :
    result.provider === "Azure" ? "#60a5fa" : "#34d399";

  const providerBg =
    !result ? "" :
    result.provider === "AWS"
      ? dark ? "rgba(251,146,60,0.08)" : "rgba(251,146,60,0.06)"
      : result.provider === "Azure"
      ? dark ? "rgba(96,165,250,0.08)" : "rgba(96,165,250,0.06)"
      : dark ? "rgba(52,211,153,0.08)" : "rgba(52,211,153,0.06)";

  const providerBorder =
    !result ? "" :
    result.provider === "AWS" ? "rgba(251,146,60,0.3)" :
    result.provider === "Azure" ? "rgba(96,165,250,0.3)" : "rgba(52,211,153,0.3)";

  return (
    <div style={{ minHeight: "100vh", background: dark ? "#0f1420" : "#f1f5f9", padding: "32px 24px" }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 6px 0" }}>
            AI Recommendation Engine
          </h1>
          <p style={{ fontSize: "13px", color: dark ? "#64748b" : "#64748b", margin: 0 }}>
            Answer a few questions about your workload and the ML model will recommend the optimal cloud configuration.
          </p>
        </div>

        {/* Section 1 */}
        <Section title="1 · Workload type" dark={dark} first>
          <SegmentedControl
            options={WORKLOAD_OPTIONS}
            value={form.workload}
            onChange={(v) => setField("workload", v)}
            dark={dark}
          />
        </Section>

        {/* Section 2 */}
        <Section title="2 · Budget & team" dark={dark}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={labelStyle}>
                Monthly budget (USD) <span style={{ color: "#f87171" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: "12px", top: "50%",
                  transform: "translateY(-50%)", fontSize: "13px",
                  color: dark ? "#64748b" : "#94a3b8", pointerEvents: "none",
                }}>$</span>
                <input
                  type="number" min="0"
                  className={inputCls(errors.budget)}
                  style={{ paddingLeft: "26px" }}
                  placeholder="500"
                  value={form.budget}
                  onChange={(e) => setField("budget", e.target.value)}
                />
              </div>
              <ErrMsg msg={errors.budget} />
              {!errors.budget && <p style={hintStyle}>Total expected cloud spend per month</p>}
            </div>
            <div>
              <label style={labelStyle}>
                Team size <span style={{ color: "#f87171" }}>*</span>
              </label>
              <input
                type="number" min="1"
                className={inputCls(errors.team_size)}
                placeholder="10"
                value={form.team_size}
                onChange={(e) => setField("team_size", e.target.value)}
              />
              <ErrMsg msg={errors.team_size} />
              {!errors.team_size && <p style={hintStyle}>Number of engineers on your team</p>}
            </div>
          </div>
        </Section>

        {/* Section 3 */}
        <Section title="3 · Infrastructure requirements" dark={dark}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={labelStyle}>
                Data volume (GB) <span style={{ color: "#f87171" }}>*</span>
              </label>
              <input
                type="number" min="0"
                className={inputCls(errors.data_volume_gb)}
                placeholder="100"
                value={form.data_volume_gb}
                onChange={(e) => setField("data_volume_gb", e.target.value)}
              />
              <ErrMsg msg={errors.data_volume_gb} />
              {!errors.data_volume_gb && <p style={hintStyle}>Total data to store or process</p>}
            </div>
            <div>
              <label style={labelStyle}>
                Uptime requirement (%) <span style={{ color: "#f87171" }}>*</span>
              </label>
              <input
                type="number" min="90" max="100" step="0.1"
                className={inputCls(errors.uptime_requirement)}
                placeholder="99.9"
                value={form.uptime_requirement}
                onChange={(e) => setField("uptime_requirement", e.target.value)}
              />
              <ErrMsg msg={errors.uptime_requirement} />
              {!errors.uptime_requirement && <p style={hintStyle}>e.g. 99.9 for three-nines SLA</p>}
            </div>
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ ...labelStyle, marginBottom: "8px" }}>Scalability need</label>
            <SegmentedControl
              options={SCALE_OPTIONS}
              value={form.scalability}
              onChange={(v) => setField("scalability", v)}
              dark={dark}
            />
          </div>
          <div>
            <label style={{ ...labelStyle, marginBottom: "8px" }}>Security requirement</label>
            <SegmentedControl
              options={SECURITY_OPTIONS}
              value={form.security}
              onChange={(v) => setField("security", v)}
              dark={dark}
            />
          </div>
        </Section>

        {/* Section 4 */}
        <Section title="4 · Deployment region" dark={dark}>
          <div style={{ display: "flex", gap: "10px" }}>
            {REGION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className="region-btn"
                onClick={() => setField("region", opt.value)}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: form.region === opt.value
                    ? "1px solid #3b82f6"
                    : dark ? "1px solid #222b3a" : "1px solid #cbd5e1",
                  background: form.region === opt.value
                    ? "#3b82f6"
                    : dark ? "#181e2c" : "#f8fafc",
                  color: form.region === opt.value
                    ? "#ffffff"
                    : dark ? "#94a3b8" : "#475569",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Section>

        {/* Section 5 */}
        <Section title="5 · Additional factors" dark={dark}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
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

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: "14px",
            padding: "13px",
            borderRadius: "10px",
            border: "none",
            background: loading ? "#60a5fa" : "#3b82f6",
            color: "white",
            fontSize: "14px",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#2563eb"; }}
          onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#3b82f6"; }}
        >
          {loading ? (
            <>
              <svg className="rec-spin" style={{ width: "16px", height: "16px" }} viewBox="0 0 24 24" fill="none">
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v4a8 8 0 00-8 8h4z" />
              </svg>
              Analyzing your requirements…
            </>
          ) : (
            "Get AI recommendation"
          )}
        </button>

        {/* Result */}
        {result && (
          <div style={{
            marginTop: "14px",
            background: dark ? "#171c2b" : "#ffffff",
            border: dark ? "1px solid #222b3a" : "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "24px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} />
              <p style={{
                fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: dark ? "#4a6080" : "#94a3b8", margin: 0,
              }}>
                Recommendation
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              {[
                { label: "Cloud provider", value: result.provider, color: providerColor, bg: providerBg, border: providerBorder },
                { label: "Service model", value: result.serviceModel, color: dark ? "#a78bfa" : "#7c3aed", bg: dark ? "rgba(167,139,250,0.08)" : "rgba(124,58,237,0.06)", border: "rgba(167,139,250,0.3)" },
                { label: "Deployment", value: result.deploymentModel, color: dark ? "#34d399" : "#059669", bg: dark ? "rgba(52,211,153,0.08)" : "rgba(5,150,105,0.06)", border: "rgba(52,211,153,0.3)" },
              ].map((item) => (
                <div key={item.label} style={{
                  borderRadius: "8px",
                  border: `1px solid ${item.border}`,
                  padding: "16px",
                  textAlign: "center",
                  background: item.bg,
                }}>
                  <p style={{ fontSize: "11px", marginBottom: "6px", color: dark ? "#64748b" : "#94a3b8", margin: "0 0 6px 0" }}>{item.label}</p>
                  <p style={{ fontSize: "15px", fontWeight: 700, color: item.color, margin: 0 }}>{item.value}</p>
                </div>
              ))}
            </div>

            <div style={{
              borderRadius: "8px",
              padding: "16px",
              background: dark ? "#0f1420" : "#f8fafc",
              border: dark ? "1px solid #222b3a" : "1px solid #e2e8f0",
            }}>
              <p style={{
                fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", marginBottom: "8px",
                color: dark ? "#4a6080" : "#94a3b8", margin: "0 0 8px 0",
              }}>
                Why this recommendation
              </p>
              <p style={{ fontSize: "13px", lineHeight: 1.7, color: dark ? "#94a3b8" : "#475569", margin: 0 }}>
                {result.reason}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Recommendation;