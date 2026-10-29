import React, { useEffect, useState, Suspense } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePortal } from '../../context/PortalContext';
import {
  Building2,
  Users,
  ShieldCheck,
  Clock,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  FileUp,
  IdCard,
  CopyCheck,
  FileCheck2,
  Lock,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';

interface OverviewMetrics {
  registeredInstitutions: number;
  studentRecords: number;
  apaarValidated: number;
  pendingVerification: number;
  correctionRequired: number;
  potentialDuplicates: number;
  intakeDiscrepancies: number;
}

// Crisp, Lightweight Liquid Glass Cockpit Emblem (Zero WebGL overhead)
const CockpitEmblem: React.FC = () => {
  return (
    <div className="w-full h-40 relative rounded-2xl overflow-hidden bg-gradient-to-tr from-slate-50 to-blue-50/50 border border-slate-200/80 flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 blur-xl absolute -inset-2" />
        <div className="relative w-18 h-18 rounded-2xl bg-white/95 border border-slate-200 shadow-md flex items-center justify-center">
          <ShieldCheck className="w-9 h-9 text-blue-600" />
        </div>
      </div>
      <div className="absolute top-2.5 left-3 flex items-center gap-1.5 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-mono tracking-wider text-slate-600 font-semibold uppercase">
          Trust Engine
        </span>
      </div>
    </div>
  );
};

export const ExecutiveCockpit: React.FC = () => {
  const { token, user } = useAuth();
  const { setActiveModule, toggleViewMode } = usePortal();

  const [metrics, setMetrics] = useState<OverviewMetrics>({
    registeredInstitutions: 12486,
    studentRecords: 324560,
    apaarValidated: 92314,
    pendingVerification: 1278,
    correctionRequired: 412,
    potentialDuplicates: 38,
    intakeDiscrepancies: 14,
  });

  const [topInstitutions, setTopInstitutions] = useState<any[]>([
    { rank: 1, name: 'Delhi Technological University', code: 'DTU-01', enrolmentCount: 12450, compliance: 'FLAGGED' },
    { rank: 2, name: 'College of Engineering Pune', code: 'COEP-02', enrolmentCount: 10320, compliance: 'COMPLIANT' },
    { rank: 3, name: 'Vellore Institute of Technology', code: 'VIT-03', enrolmentCount: 8970, compliance: 'COMPLIANT' },
    { rank: 4, name: 'NIT Karnataka Surathkal', code: 'NITK-04', enrolmentCount: 7430, compliance: 'COMPLIANT' },
    { rank: 5, name: 'Government Polytechnic Delhi', code: 'GPD-05', enrolmentCount: 6780, compliance: 'COMPLIANT' },
  ]);

  useEffect(() => {
    if (!token) return;
    const fetchOverview = async () => {
      try {
        const res = await fetch('/api/analytics/overview', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.metrics) setMetrics(data.metrics);
          if (data.topInstitutions) {
            setTopInstitutions(
              data.topInstitutions.map((inst: any, idx: number) => ({
                ...inst,
                rank: idx + 1,
                compliance: inst.name.includes('Delhi Technological') ? 'FLAGGED' : 'COMPLIANT',
              }))
            );
          }
        }
      } catch (e) {
        console.warn('Using baseline national metrics');
      }
    };
    fetchOverview();
  }, [token]);

  return (
    <div className="space-y-5 text-slate-900">
      {/* Top Statutory Alert Banner (Immediate Attention) */}
      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600 border border-rose-200 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-700 font-mono tracking-wide uppercase">
                Regulatory Intake Violation Detected
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Delhi Technological University (DTU) admitted <span className="font-bold text-rose-700">184</span> students into B.Tech CSE against an approved intake limit of <span className="font-bold text-slate-900">180</span> (+4 excess admissions).
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveModule('compliance')}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex-shrink-0"
        >
          <span>Adjudicate Discrepancy</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Cards: 4 Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1 */}
        <div className="surface-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">
              Registered Institutions
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-950 tracking-tight font-mono">
              {metrics.registeredInstitutions.toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
              <span>Technical & Polytechnics</span>
              <span className="text-emerald-600 font-semibold font-mono">+18.4% YoY</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="surface-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">
              Student Records
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-950 tracking-tight font-mono">
              {metrics.studentRecords.toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
              <span>National Academic Ingestion</span>
              <span className="text-slate-700 font-medium font-mono">28 States / 8 UTs</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="surface-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">
              APAAR Validated
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-600 tracking-tight font-mono">
              {metrics.apaarValidated.toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
              <span>Verhoeff + ABC Verified</span>
              <span className="text-emerald-600 font-semibold font-mono">78.2% Authenticated</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="surface-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">
              Action Required
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-600 tracking-tight font-mono">
              {(metrics.potentialDuplicates + metrics.intakeDiscrepancies).toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
              <span>{metrics.potentialDuplicates} Duplicates · {metrics.intakeDiscrepancies} Quota Breaches</span>
              <span className="text-amber-600 font-semibold font-mono">Pending Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Analytical Visualisations & 3D Spatial Emblem */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (2 Cols): Admission Trend & Validation Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          {/* Trend Area */}
          <div className="surface-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                  National Technical Admission Trend
                </h3>
              </div>
            </div>

            {/* SVG Trend Line / Area */}
            <div className="h-44 w-full relative pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 140" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal reference grid lines */}
                <line x1="0" y1="20" x2="600" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="600" y2="60" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="#E2E8F0" strokeDasharray="3 3" />

                {/* Area under curve */}
                <path
                  d="M 0 110 Q 75 95 150 90 T 300 70 T 450 40 T 600 25 L 600 135 L 0 135 Z"
                  fill="url(#trendGradient)"
                />
                {/* Smooth Curve */}
                <path
                  d="M 0 110 Q 75 95 150 90 T 300 70 T 450 40 T 600 25"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                />
                {/* Data points */}
                <circle cx="0" cy="110" r="3.5" fill="#2563EB" />
                <circle cx="150" cy="90" r="3.5" fill="#2563EB" />
                <circle cx="300" cy="70" r="3.5" fill="#2563EB" />
                <circle cx="450" cy="40" r="3.5" fill="#2563EB" />
                <circle cx="600" cy="25" r="4.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
              </svg>

              {/* X-Axis Labels */}
              <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
                <span>2020-21 (2.10L)</span>
                <span>2021-22 (2.35L)</span>
                <span>2022-23 (2.68L)</span>
                <span>2023-24 (2.95L)</span>
                <span className="text-slate-900 font-bold">2024-25 (3.24L)</span>
              </div>
            </div>
          </div>

          {/* Validation Breakdown & Quick Launcher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status Breakdown */}
            <div className="surface-card p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                  APAAR Integrity Ratio
                </span>
                <span className="text-[10px] text-emerald-600 font-mono font-semibold">High Quality</span>
              </div>
              <div className="space-y-3 py-1">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-700 font-medium">Validated (Verhoeff + ABC)</span>
                    <span className="font-mono text-emerald-600 font-bold">78%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Pending Officer Review</span>
                    <span className="font-mono text-amber-600 font-bold">15%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Flagged / Format Error</span>
                    <span className="font-mono text-rose-600 font-bold">7%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '7%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="surface-card p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                  Quick Actions
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Workflows</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setActiveModule('submissions')}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors shadow-2xs group"
                >
                  <FileUp className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="truncate">Ingest Batch</span>
                </button>
                <button
                  onClick={() => setActiveModule('apaar')}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors shadow-2xs group"
                >
                  <IdCard className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span className="truncate">Validate APAAR</span>
                </button>
                <button
                  onClick={() => setActiveModule('duplicates')}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors shadow-2xs group"
                >
                  <CopyCheck className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                  <span className="truncate">De-Duplicate</span>
                </button>
                <button
                  onClick={() => setActiveModule('audit')}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors shadow-2xs group"
                >
                  <Lock className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="truncate">Verify Hash</span>
                </button>
              </div>
            </div>
          </div>
        </div>

          {/* Cockpit Emblem & Top Institutions */}
          <div className="space-y-4">
            <div className="surface-card p-4 relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                  Trust Architecture
                </span>
                <button
                  onClick={toggleViewMode}
                  className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-700 font-mono font-semibold hover:underline"
                  title="Expand to Fullscreen 3D Panoramic Environment"
                >
                  <span>Fullscreen 3D</span>
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>
              <CockpitEmblem />
            </div>

          {/* Top Institutions Table */}
          <div className="surface-card p-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                Top Institutions (Enrolment)
              </span>
              <button
                onClick={() => setActiveModule('institutions')}
                className="text-[10px] text-blue-600 hover:underline font-mono font-semibold flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {topInstitutions.map((inst) => (
                <div
                  key={inst.rank}
                  onClick={() => setActiveModule('institutions')}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-mono font-semibold text-slate-400 w-5">
                      #{inst.rank}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">
                        {inst.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {inst.enrolmentCount.toLocaleString()} Admissions
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                      inst.compliance === 'FLAGGED'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {inst.compliance}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
