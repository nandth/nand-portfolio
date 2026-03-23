import { useEffect } from 'react';
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// ── demo data ────────────────────────────────────────────────────────────────

const tierData = [
  { tier: 'Cheap',  requests: 1847, fill: 'rgba(255,255,255,0.72)' },
  { tier: 'Mid',    requests: 634,  fill: 'rgba(255,255,255,0.38)' },
  { tier: 'Best',   requests: 219,  fill: 'rgba(255,255,255,0.18)' },
];

const savingsData = [
  { day: 'Jan 8',  saved: 12400 },
  { day: 'Jan 9',  saved: 18900 },
  { day: 'Jan 10', saved: 14200 },
  { day: 'Jan 11', saved: 22100 },
  { day: 'Jan 12', saved: 19800 },
  { day: 'Jan 13', saved: 8300  },
  { day: 'Jan 14', saved: 26700 },
  { day: 'Jan 15', saved: 31200 },
  { day: 'Jan 16', saved: 28400 },
  { day: 'Jan 17', saved: 35100 },
  { day: 'Jan 18', saved: 29600 },
  { day: 'Jan 19', saved: 11200 },
  { day: 'Jan 20', saved: 38900 },
  { day: 'Jan 21', saved: 42300 },
];

const latencyData = [
  { tier: 'Cheap', p50: 284, p95: 520  },
  { tier: 'Mid',   p50: 810, p95: 1340 },
  { tier: 'Best',  p50: 1420, p95: 2180 },
];

const scoreData = [
  { range: '0–10',   count: 312 },
  { range: '10–20',  count: 487 },
  { range: '20–30',  count: 534 },
  { range: '30–40',  count: 418 },
  { range: '40–50',  count: 311 },
  { range: '50–60',  count: 243 },
  { range: '60–70',  count: 178 },
  { range: '70–80',  count: 132 },
  { range: '80–90',  count: 71  },
  { range: '90–100', count: 14  },
];

const tierConfig = {
  requests: { label: 'Requests' },
};

const savingsConfig = {
  saved: { label: 'Tokens saved', color: 'rgba(255,255,255,0.7)' },
};

const latencyConfig = {
  p50: { label: 'p50 ms', color: 'rgba(255,255,255,0.72)' },
  p95: { label: 'p95 ms', color: 'rgba(255,255,255,0.28)' },
};

const scoreConfig = {
  count: { label: 'Requests', color: 'rgba(255,255,255,0.55)' },
};

// ── stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-white/8 bg-white/4 px-5 py-4">
      <p className="text-[0.65rem] uppercase tracking-[0.22em] text-white/40">{label}</p>
      <p className="text-2xl font-medium text-white">{value}</p>
      {sub && <p className="text-[0.72rem] text-white/38">{sub}</p>}
    </div>
  );
}

// ── custom tooltip ────────────────────────────────────────────────────────────

function DarkTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-xs text-white/80 shadow-xl">
      {label && <p className="mb-1 text-white/40">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || 'rgba(255,255,255,0.8)' }}>
          {formatter ? formatter(p.name, p.value) : `${p.name}: ${p.value.toLocaleString()}`}
        </p>
      ))}
    </div>
  );
}

// ── modal ────────────────────────────────────────────────────────────────────

export default function AnalyticsModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const totalRequests = tierData.reduce((s, d) => s + d.requests, 0);
  const totalSaved = savingsData.reduce((s, d) => s + d.saved, 0);
  const cheapPct = Math.round((tierData[0].requests / totalRequests) * 100);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div
        className="relative flex h-full w-full max-w-5xl max-h-[92vh] flex-col overflow-hidden rounded-xl border"
        style={{ borderColor: 'rgba(255,255,255,0.1)', background: '#0d0d0d' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div
          className="flex shrink-0 items-center justify-between border-b px-5 py-3"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-[0.72rem] uppercase tracking-[0.22em] text-white/50">
              Model Router Analytics
            </span>
            <span className="rounded-full bg-white/8 px-2 py-0.5 text-[0.6rem] uppercase tracking-widest text-white/35">
              Demo data
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close analytics"
            className="text-white/40 transition hover:text-white"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 md:px-6 md:py-6">
          {/* stat row */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard label="Total Requests"  value={totalRequests.toLocaleString()} sub="Last 14 days" />
            <StatCard label="Tokens Saved"    value={`${(totalSaved / 1000).toFixed(0)}k`} sub="vs. always best" />
            <StatCard label="Cheap Route"     value={`${cheapPct}%`} sub="of all requests" />
            <StatCard label="Avg Latency"     value="384 ms" sub="across all tiers" />
          </div>

          {/* charts grid */}
          <div className="mt-5 grid gap-4 md:grid-cols-2">

            {/* Tokens saved — area */}
            <Card className="border-white/8 bg-white/3 text-white col-span-full md:col-span-2">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-sm font-medium text-white/80">Tokens saved per day</CardTitle>
                <CardDescription className="text-xs text-white/35">Estimated savings vs. routing every request to GPT-4</CardDescription>
              </CardHeader>
              <CardContent className="px-2 pb-4">
                <ChartContainer config={savingsConfig} className="h-[180px] w-full">
                  <AreaChart data={savingsData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="rgba(255,255,255,0.18)" />
                        <stop offset="95%" stopColor="rgba(255,255,255,0)" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<DarkTooltip formatter={(name, val) => `${val.toLocaleString()} tokens`} />} />
                    <Area type="monotone" dataKey="saved" stroke="rgba(255,255,255,0.55)" strokeWidth={1.5} fill="url(#savingsGrad)" dot={false} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Tier distribution — pie */}
            <Card className="border-white/8 bg-white/3 text-white">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-sm font-medium text-white/80">Routing tier distribution</CardTitle>
                <CardDescription className="text-xs text-white/35">{totalRequests.toLocaleString()} total requests</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-6 px-5 pb-4">
                <ChartContainer config={tierConfig} className="h-[160px] w-[160px] shrink-0">
                  <PieChart>
                    <Pie data={tierData} dataKey="requests" nameKey="tier" cx="50%" cy="50%" innerRadius={46} outerRadius={72} strokeWidth={0}>
                      {tierData.map((entry) => (
                        <Cell key={entry.tier} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<DarkTooltip formatter={(name, val) => `${val.toLocaleString()} requests`} />} />
                  </PieChart>
                </ChartContainer>
                <div className="flex flex-col gap-3">
                  {tierData.map((d) => (
                    <div key={d.tier} className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full shrink-0" style={{ background: d.fill }} />
                      <span className="text-xs text-white/55">{d.tier}</span>
                      <span className="ml-auto text-xs font-medium text-white/80">
                        {Math.round((d.requests / totalRequests) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Latency by tier — bar */}
            <Card className="border-white/8 bg-white/3 text-white">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-sm font-medium text-white/80">Latency by tier (ms)</CardTitle>
                <CardDescription className="text-xs text-white/35">p50 and p95 response times</CardDescription>
              </CardHeader>
              <CardContent className="px-2 pb-4">
                <ChartContainer config={latencyConfig} className="h-[160px] w-full">
                  <BarChart data={latencyData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }} barGap={3}>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="tier" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}`} />
                    <Tooltip content={<DarkTooltip formatter={(name, val) => `${name}: ${val} ms`} />} />
                    <Bar dataKey="p50" fill="rgba(255,255,255,0.65)" radius={[3,3,0,0]} />
                    <Bar dataKey="p95" fill="rgba(255,255,255,0.2)"  radius={[3,3,0,0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Score distribution — bar */}
            <Card className="border-white/8 bg-white/3 text-white col-span-full md:col-span-2">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-sm font-medium text-white/80">Routing score distribution</CardTitle>
                <CardDescription className="text-xs text-white/35">Prompt difficulty score (0 = trivial, 100 = hard) — most prompts are simple</CardDescription>
              </CardHeader>
              <CardContent className="px-2 pb-4">
                <ChartContainer config={scoreConfig} className="h-[160px] w-full">
                  <BarChart data={scoreData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="range" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<DarkTooltip formatter={(name, val) => `${val} requests`} />} />
                    <Bar dataKey="count" fill="rgba(255,255,255,0.45)" radius={[3,3,0,0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
