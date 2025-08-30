import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

/**
 * CreditHistorySection
 * Single-file, industry-style credit history section.
 * - Dynamic speedometer (300–900) with animated needle on click
 * - 4-week score trend chart with green (increase) / red (decrease) bars
 * - Credit cards status table (Card | Balance | Status | EMI Due Date)
 * - Week 4 details with reason chips
 *
 * Tech: React + TailwindCSS + Recharts + Framer Motion
 *
 * Usage:
 * <CreditHistorySection userName="KRRISH BHARDWAJ" />
 */

const MIN_SCORE = 300;
const MAX_SCORE = 900;

const defaultWeeklyScores = [702, 702, 705, 705]; // Week1..Week4

const defaultCards = [
  { card: "HDFC Regalia", balance: 15000, status: "Active", due: "05 Jan 2025" },
  { card: "SBI SimplySAVE", balance: 0, status: "Closed", due: "—" },
  { card: "ICICI Amazon Pay", balance: 4200, status: "Active", due: "12 Jan 2025" },
];

export default function CreditHistorySection({
  userName = "KRRISH BHARDWAJ",
  weeklyScores = defaultWeeklyScores,
  cards = defaultCards,
  week4Reasons = [
    { type: "positive", text: "On‑time EMI payments" },
    { type: "positive", text: "Reduced utilization compared to Week 3" },
    { type: "neutral", text: "No new hard inquiries" },
  ],
}) {
  // Data prep
  const data = useMemo(() => {
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    return weeks.map((w, i) => ({
      week: w,
      score: weeklyScores[i],
      delta: i === 0 ? 0 : weeklyScores[i] - weeklyScores[i - 1],
    }));
  }, [weeklyScores]);

  const currentScore = weeklyScores[weeklyScores.length - 1] ?? 0;
  const [animateGauge, setAnimateGauge] = useState(false);

  // Optional auto-animate once on first mount
  useEffect(() => {
    setTimeout(() => setAnimateGauge(true), 400);
  }, []);

  // Compute needle angle
  const angle = useMemo(() => {
    const clamped = Math.min(MAX_SCORE, Math.max(MIN_SCORE, currentScore));
    const pct = (clamped - MIN_SCORE) / (MAX_SCORE - MIN_SCORE); // 0..1
    return -90 + pct * 180; // -90 (left) to +90 (right)
  }, [currentScore]);

  const category = useMemo(() => {
    if (currentScore >= 750) return { label: "Excellent", color: "text-green-600" };
    if (currentScore >= 650) return { label: "Good", color: "text-emerald-600" };
    if (currentScore >= 600) return { label: "Fair", color: "text-amber-600" };
    return { label: "Poor", color: "text-red-600" };
  }, [currentScore]);

  // Theme helpers
  const cardClass =
    "bg-white border border-blue-100 shadow-sm rounded-2xl p-5 md:p-6";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 md:py-10 text-slate-800">
      {/* Header / CTA */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Credit History – <span className="text-blue-700">{userName}</span>
          </h1>
          <p className="text-slate-500">Light blue & white theme with red/green accents</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setAnimateGauge(false);
              // Allow the needle to jump back left then animate to right
              setTimeout(() => setAnimateGauge(true), 80);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Open Credit History
          </button>
        </div>
      </div>

      {/* Summary + Gauge */}
      <div className={`${cardClass} bg-gradient-to-b from-blue-50 to-white`}>        
        <div className="grid md:grid-cols-3 gap-6 items-center">
          {/* Gauge */}
          <div className="col-span-2">
            <Gauge score={currentScore} animate={animateGauge} />
          </div>

          {/* Score Stats */}
          <div className="flex flex-col justify-center gap-3">
            <SummaryStat label="Current Score" value={currentScore} />
            <SummaryStat label="Range" value={`${MIN_SCORE} – ${MAX_SCORE}`} />
            <SummaryStat label="Category" value={category.label} className={category.color} />
            <div className="text-sm text-slate-500">Normalized credit score</div>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className={`${cardClass} mt-6`}>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">4‑Week Score Trend</h2>
          <p className="text-sm text-slate-500">Green = increase, Red = decrease</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 0, left: -10 }}>
              <CartesianGrid stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: "#334155" }} axisLine={{ stroke: "#bfdbfe" }} tickLine={false} />
              <YAxis domain={[MIN_SCORE - 10, MAX_SCORE]} tick={{ fill: "#334155" }} axisLine={{ stroke: "#bfdbfe" }} tickLine={false} />
              <Tooltip formatter={(v, n) => (n === "delta" ? `${v > 0 ? "+" : ""}${v}` : v)} />
              <Bar dataKey="delta" barSize={24} radius={[6, 6, 6, 6]}>
                {data.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.delta > 0 ? "#16a34a" : entry.delta < 0 ? "#dc2626" : "#94a3b8"} />
                ))}
              </Bar>
              <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Credit Cards Status */}
      <div className={`${cardClass} mt-6`}>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">Credit Cards Status</h2>
          <p className="text-sm text-slate-500">Signed‑in user accounts</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-slate-600 text-sm border-b border-blue-100">
                <th className="py-3 pr-4">Card</th>
                <th className="py-3 pr-4">Balance (₹)</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">EMI Due Date</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((c, i) => (
                <tr key={i} className="border-b last:border-0 border-blue-50">
                  <td className="py-3 pr-4 font-medium">{c.card}</td>
                  <td className="py-3 pr-4">{formatINR(c.balance)}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        c.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : c.status === "Closed"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4">{c.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Week 4 Details */}
      <div className={`${cardClass} mt-6`}>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">Week 4 Details</h2>
          <span className={`text-sm ${data[3]?.delta > 0 ? "text-green-600" : data[3]?.delta < 0 ? "text-red-600" : "text-slate-500"}`}>
            {data[3]?.delta > 0 ? `Increased by +${data[3].delta}` : data[3]?.delta < 0 ? `Decreased by ${data[3].delta}` : "No change"}
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {week4Reasons.map((r, idx) => (
              <span
                key={idx}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                  r.type === "positive"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : r.type === "negative"
                    ? "bg-red-50 text-red-700 border-red-100"
                    : "bg-blue-50 text-blue-700 border-blue-100"
                }`}
              >
                {r.text}
              </span>
            ))}
          </div>

          <ul className="list-disc pl-6 text-slate-700 text-sm">
            <li>Keep credit utilization under 30% for a higher chance to cross 720.</li>
            <li>Continue on‑time payments; avoid new hard inquiries this month.</li>
            <li>Maintain low balances across active cards to stabilize the score.</li>
          </ul>
        </div>
      </div>

      <footer className="text-center text-xs text-slate-400 mt-8">
        * Demo data shown. Replace props with real user data from your backend.
      </footer>
    </div>
  );
}

function SummaryStat({ label, value, className = "" }) {
  return (
    <div className="flex items-center justify-between bg-white/70 border border-blue-100 rounded-xl px-4 py-3">
      <span className="text-slate-600 text-sm">{label}</span>
      <span className={`text-slate-900 font-semibold ${className}`}>{value}</span>
    </div>
  );
}

function formatINR(n) {
  try {
    return new Intl.NumberFormat("en-IN").format(n);
  } catch (e) {
    return n;
  }
}

/**
 * Gauge Component – 300..900 semicircle with animated needle
 */
function Gauge({ score, animate }) {
  const radius = 140; // px
  const stroke = 18;
  const viewBoxSize = 2 * (radius + stroke);

  const pct = (Math.min(MAX_SCORE, Math.max(MIN_SCORE, score)) - MIN_SCORE) / (MAX_SCORE - MIN_SCORE);
  const angle = -90 + pct * 180; // for label marker

  return (
    <div className="w-full">
      <div className="text-slate-900 font-semibold mb-2">Credit Score Meter</div>
      <svg
        width="100%"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize / 2 + stroke}`}
        className="drop-shadow-sm"
      >
        {/* Background track */}
        <path
          d={describeArc(viewBoxSize / 2, viewBoxSize / 2, radius, 180, 360)}
          fill="none"
          stroke="#dbeafe" // blue-100
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Red zone */}
        <path
          d={describeArc(viewBoxSize / 2, viewBoxSize / 2, radius, 180, 225)}
          fill="none"
          stroke="#fca5a5" // red-300
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Amber zone */}
        <path
          d={describeArc(viewBoxSize / 2, viewBoxSize / 2, radius, 225, 270)}
          fill="none"
          stroke="#fde68a" // amber-300
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Green zone */}
        <path
          d={describeArc(viewBoxSize / 2, viewBoxSize / 2, radius, 270, 360)}
          fill="none"
          stroke="#86efac" // green-300
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        {/* Needle (animated) */}
        <g transform={`translate(${viewBoxSize / 2}, ${viewBoxSize / 2})`}>
          <motion.line
            x1="0"
            y1="0"
            x2={radius - 12}
            y2="0"
            stroke="#1d4ed8"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ rotate: -90 }}
            animate={{ rotate: animate ? angle : -90 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
          />
          {/* Needle hub */}
          <circle r="8" fill="#1d4ed8" />
        </g>

        {/* Ticks / labels */}
        <GaugeTick cx={viewBoxSize / 2} cy={viewBoxSize / 2} r={radius} angle={180} label={MIN_SCORE} />
        <GaugeTick cx={viewBoxSize / 2} cy={viewBoxSize / 2} r={radius} angle={270} label={(MIN_SCORE + MAX_SCORE) / 2} />
        <GaugeTick cx={viewBoxSize / 2} cy={viewBoxSize / 2} r={radius} angle={360} label={MAX_SCORE} />

        {/* Active label dot */}
        <circle
          cx={polarToX(viewBoxSize / 2, radius, angle + 180)}
          cy={polarToY(viewBoxSize / 2, radius, angle + 180)}
          r="5"
          fill="#2563eb"
        />

        {/* Score number */}
        <text x="50%" y="78%" textAnchor="middle" className="fill-slate-900" style={{ fontSize: 28, fontWeight: 700 }}>
          {score}
        </text>
        <text x="50%" y="90%" textAnchor="middle" className="fill-slate-500" style={{ fontSize: 12 }}>
          Normalized Score (300–900)
        </text>
      </svg>
    </div>
  );
}

function GaugeTick({ cx, cy, r, angle, label }) {
  const x1 = polarToX(cx, r - 4, angle);
  const y1 = polarToY(cy, r - 4, angle);
  const x2 = polarToX(cx, r + 10, angle);
  const y2 = polarToY(cy, r + 10, angle);
  const lx = polarToX(cx, r + 26, angle);
  const ly = polarToY(cy, r + 26, angle);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#93c5fd" strokeWidth={2} />
      <text x={lx} y={ly} textAnchor="middle" alignmentBaseline="middle" className="fill-slate-600" style={{ fontSize: 12 }}>
        {label}
      </text>
    </g>
  );
}

// --- SVG math helpers ---
function polarToX(cx, r, angle) {
  return cx + r * Math.cos((Math.PI * angle) / 180);
}
function polarToY(cy, r, angle) {
  return cy + r * Math.sin((Math.PI * angle) / 180);
}
function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polar(startAngle, r, cx, cy);
  const end = polar(endAngle, r, cx, cy);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M",
    start.x,
    start.y,
    "A",
    r,
    r,
    0,
    largeArcFlag,
    1,
    end.x,
    end.y,
  ].join(" ");
}
function polar(angle, radius, cx, cy) {
  const rad = ((angle - 90) * Math.PI) / 180.0;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}