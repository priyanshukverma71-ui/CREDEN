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
import { Canvas } from '@react-three/fiber';
import { Float, MeshReflectorMaterial } from '@react-three/drei';

interface OverviewMetrics {
  registeredInstitutions: number;
  studentRecords: number;
  apaarValidated: number;
  pendingVerification: number;
  correctionRequired: number;
  potentialDuplicates: number;
  intakeDiscrepancies: number;
}

// Compact Studio 3D Emblem with realistic platinum metallic materials
const Cockpit3DEmblem: React.FC = () => {
  return (
    <div className="w-full h-44 relative rounded-xl overflow-hidden bg-[#0A0C0F] border border-[#22262C]">
      <Canvas
        camera={{ position: [0, 1.2, 4.2], fov: 40 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#0A0C0F']} />
        <ambientLight intensity={0.7} color="#D4D7DC" />
        <directionalLight position={[5, 10, 5]} intensity={1.5} color="#FFFFFF" />
        <directionalLight position={[-5, 4, -2]} intensity={0.5} color="#929AA5" />

        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            {/* Platinum Central Geometric Emblem */}
            <mesh position={[0, 0.4, 0]} rotation={[0.2, 0.4, 0]}>
              <octahedronGeometry args={[1.1, 0]} />
              <meshStandardMaterial
                color="#D4D7DC"
                metalness={0.92}
                roughness={0.15}
                envMapIntensity={1.2}
              />
            </mesh>
            {/* Outer Orbital Ring */}
            <mesh position={[0, 0.4, 0]} rotation={[1.1, 0.3, 0]}>
              <torusGeometry args={[1.7, 0.04, 16, 64]} />
              <meshStandardMaterial
                color="#F1F3F5"
                metalness={0.95}
                roughness={0.1}
              />
            </mesh>
          </Float>

          {/* Distant Reflective Obsidian Base */}
          <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial
              color="#08090B"
              metalness={0.9}
              roughness={0.3}
            />
          </mesh>
        </Suspense>
      </Canvas>

      {/* Floating subtle overlay */}
      <div className="absolute top-2.5 left-3 flex items-center gap-1.5 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#D2D6DC]">
          Spatial Trust Engine
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
    <div className="space-y-5">
      {/* Top Statutory Alert Banner (Immediate Attention) */}
      <div className="p-3.5 rounded-xl bg-[#1B1416] border border-rose-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-300 font-mono tracking-wide uppercase">
                Regulatory Intake Violation Detected
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                APH 2024-25 §4.2
              </span>
            </div>
            <p className="text-xs text-[#D2D6DC] mt-0.5">
              Delhi Technological University (DTU) admitted <span className="font-semibold text-rose-300">184</span> students into B.Tech CSE against an approved intake limit of <span className="font-semibold text-[#F1F3F5]">180</span> (+4 excess admissions).
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveModule('compliance')}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors shadow-sm flex-shrink-0"
        >
          <span>Adjudicate Discrepancy</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Cards: 4 Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1 */}
        <div className="surface-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#929AA5]">
            <span className="text-xs font-medium uppercase tracking-wider font-mono">
              Registered Institutions
            </span>
            <Building2 className="w-4 h-4 text-[#D2D6DC]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#F1F3F5] tracking-tight font-mono">
              {metrics.registeredInstitutions.toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#929AA5] mt-1">
              <span>Technical & Polytechnics</span>
              <span className="text-emerald-400 font-mono">+18.4% YoY</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="surface-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#929AA5]">
            <span className="text-xs font-medium uppercase tracking-wider font-mono">
              Student Records
            </span>
            <Users className="w-4 h-4 text-[#D2D6DC]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#F1F3F5] tracking-tight font-mono">
              {metrics.studentRecords.toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#929AA5] mt-1">
              <span>National Academic Ingestion</span>
              <span className="text-[#D2D6DC] font-mono">28 States / 8 UTs</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="surface-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#929AA5]">
            <span className="text-xs font-medium uppercase tracking-wider font-mono">
              APAAR Validated
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-300 tracking-tight font-mono">
              {metrics.apaarValidated.toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#929AA5] mt-1">
              <span>Verhoeff + ABC Verified</span>
              <span className="text-emerald-400 font-mono">78.2% Authenticated</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="surface-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#929AA5]">
            <span className="text-xs font-medium uppercase tracking-wider font-mono">
              Action Required
            </span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-300 tracking-tight font-mono">
              {(metrics.potentialDuplicates + metrics.intakeDiscrepancies).toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#929AA5] mt-1">
              <span>{metrics.potentialDuplicates} Duplicates · {metrics.intakeDiscrepancies} Quota Breaches</span>
              <span className="text-amber-400 font-mono">Pending Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Analytical Visualisations & 3D Spatial Emblem */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (2 Cols): Admission Trend & Validation Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          {/* Trend Area */}
          <div className="surface-card p-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#22262C] mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#D2D6DC]" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F1F3F5] font-mono">
                  National Technical Admission Trend (5-Year Academic Sessions)
                </h3>
              </div>
              <span className="text-[10px] text-[#929AA5] font-mono">
                Source: AICTE Regulatory Ingestion
              </span>
            </div>

            {/* SVG Trend Line / Area */}
            <div className="h-44 w-full relative pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 140" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4D7DC" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#D4D7DC" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal reference grid lines */}
                <line x1="0" y1="20" x2="600" y2="20" stroke="#22262C" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="600" y2="60" stroke="#22262C" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="#22262C" strokeDasharray="3 3" />

                {/* Area under curve */}
                <path
                  d="M 0 110 Q 75 95 150 90 T 300 70 T 450 40 T 600 25 L 600 135 L 0 135 Z"
                  fill="url(#trendGradient)"
                />
                {/* Smooth Curve */}
                <path
                  d="M 0 110 Q 75 95 150 90 T 300 70 T 450 40 T 600 25"
                  fill="none"
                  stroke="#F1F3F5"
                  strokeWidth="2.5"
                />
                {/* Data points */}
                <circle cx="0" cy="110" r="3.5" fill="#D4D7DC" />
                <circle cx="150" cy="90" r="3.5" fill="#D4D7DC" />
                <circle cx="300" cy="70" r="3.5" fill="#D4D7DC" />
                <circle cx="450" cy="40" r="3.5" fill="#D4D7DC" />
                <circle cx="600" cy="25" r="4" fill="#FFFFFF" stroke="#08090B" strokeWidth="2" />
              </svg>

              {/* X-Axis Labels */}
              <div className="flex justify-between text-[11px] text-[#929AA5] mt-2 font-mono">
                <span>2020-21 (2.10L)</span>
                <span>2021-22 (2.35L)</span>
                <span>2022-23 (2.68L)</span>
                <span>2023-24 (2.95L)</span>
                <span className="text-[#F1F3F5] font-semibold">2024-25 (3.24L)</span>
              </div>
            </div>
          </div>

          {/* Validation Breakdown & Quick Launcher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status Breakdown */}
            <div className="surface-card p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-[#22262C] mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#F1F3F5] font-mono">
                  APAAR Integrity Ratio
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">High Quality</span>
              </div>
              <div className="space-y-2 py-1">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#D2D6DC]">Validated (Verhoeff + ABC)</span>
                    <span className="font-mono text-emerald-400 font-semibold">78%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1C2027] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#929AA5]">Pending Officer Review</span>
                    <span className="font-mono text-amber-400 font-semibold">15%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1C2027] rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#929AA5]">Flagged / Format Error</span>
                    <span className="font-mono text-rose-400 font-semibold">7%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1C2027] rounded-full overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full" style={{ width: '7%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="surface-card p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-[#22262C] mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#F1F3F5] font-mono">
                  Quick Actions
                </span>
                <span className="text-[10px] text-[#929AA5] font-mono">Workflows</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveModule('submissions')}
                  className="flex items-center gap-1.5 p-2 rounded-lg bg-[#181B22] hover:bg-[#20252E] border border-[#262C36] text-[11px] text-[#D2D6DC] transition-colors"
                >
                  <FileUp className="w-3.5 h-3.5 text-[#D2D6DC]" />
                  <span className="truncate">Ingest Batch</span>
                </button>
                <button
                  onClick={() => setActiveModule('apaar')}
                  className="flex items-center gap-1.5 p-2 rounded-lg bg-[#181B22] hover:bg-[#20252E] border border-[#262C36] text-[11px] text-[#D2D6DC] transition-colors"
                >
                  <IdCard className="w-3.5 h-3.5 text-[#D2D6DC]" />
                  <span className="truncate">Validate APAAR</span>
                </button>
                <button
                  onClick={() => setActiveModule('duplicates')}
                  className="flex items-center gap-1.5 p-2 rounded-lg bg-[#181B22] hover:bg-[#20252E] border border-[#262C36] text-[11px] text-[#D2D6DC] transition-colors"
                >
                  <CopyCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate">De-Duplicate</span>
                </button>
                <button
                  onClick={() => setActiveModule('audit')}
                  className="flex items-center gap-1.5 p-2 rounded-lg bg-[#181B22] hover:bg-[#20252E] border border-[#262C36] text-[11px] text-[#D2D6DC] transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-[#D2D6DC]" />
                  <span className="truncate">Verify Hash</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Studio 3D Emblem & Top Institutions */}
        <div className="space-y-4">
          {/* Studio 3D Emblem with toggle */}
          <div className="surface-card p-3 relative">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#22262C]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#F1F3F5] font-mono">
                3D Spatial Cockpit
              </span>
              <button
                onClick={toggleViewMode}
                className="flex items-center gap-1 text-[10px] text-[#D2D6DC] hover:text-white font-mono hover:underline"
                title="Expand to Fullscreen 3D Panoramic Environment"
              >
                <span>Fullscreen</span>
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>
            <Cockpit3DEmblem />
            <div className="mt-2 text-[11px] text-[#929AA5] text-center">
              Restrained metallic platinum architecture & obsidian floor.
            </div>
          </div>

          {/* Top Institutions Table */}
          <div className="surface-card p-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#22262C] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#F1F3F5] font-mono">
                Top Institutions (Enrolment)
              </span>
              <button
                onClick={() => setActiveModule('institutions')}
                className="text-[10px] text-[#D2D6DC] hover:underline font-mono flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="divide-y divide-[#1D2128]">
              {topInstitutions.map((inst) => (
                <div
                  key={inst.rank}
                  onClick={() => setActiveModule('institutions')}
                  className="py-2 flex items-center justify-between hover:bg-[#181B21] px-1 rounded cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-mono text-[#7B8390] w-4">
                      #{inst.rank}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[#F1F3F5] truncate">
                        {inst.name}
                      </div>
                      <div className="text-[10px] text-[#929AA5] font-mono">
                        {inst.enrolmentCount.toLocaleString()} Admissions
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                      inst.compliance === 'FLAGGED'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
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
