import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePortal } from '../../context/PortalContext';
import {
  Building2,
  Users,
  ShieldCheck,
  Clock,
  TrendingUp,
  PieChart,
  Award,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
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

export const OverviewHUD: React.FC = () => {
  const { token } = useAuth();
  const { openWorkspace, setActiveModule } = usePortal();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    { rank: 1, name: 'Delhi Technological University', enrolmentCount: 12450 },
    { rank: 2, name: 'College of Engineering Pune', enrolmentCount: 10320 },
    { rank: 3, name: 'Vellore Institute of Technology', enrolmentCount: 8970 },
    { rank: 4, name: 'NIT Karnataka Surathkal', enrolmentCount: 7430 },
  ]);

  const [statusBreakdown, setStatusBreakdown] = useState({
    validatedPercent: 78,
    pendingPercent: 15,
    failedPercent: 7,
  });

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
          if (data.topInstitutions) setTopInstitutions(data.topInstitutions);
          if (data.statusBreakdown) setStatusBreakdown(data.statusBreakdown);
        }
      } catch (e) {
        console.warn('Using baseline national metrics');
      }
    };
    fetchOverview();
  }, [token]);

  if (isCollapsed) {
    return (
      <div className="w-full max-w-3xl mx-auto flex items-center justify-between px-4 py-2 rounded-xl bg-[#0F1218]/90 border border-[#2B313C] backdrop-blur-xl shadow-2xl select-none animate-in fade-in duration-200">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold uppercase text-[#F1F3F5] tracking-wider">
            CREDEN Overview
          </span>
          <span className="text-[11px] text-[#929AA5] font-mono hidden sm:inline">
            · {metrics.registeredInstitutions.toLocaleString()} Institutions · {metrics.studentRecords.toLocaleString()} Students · {statusBreakdown.validatedPercent}% Validated
          </span>
        </div>

        <button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1C2027] hover:bg-[#252B35] border border-[#313742] text-xs font-medium text-[#D2D6DC] transition-colors"
        >
          <span>Expand Cockpit HUD</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl p-4 sm:p-5 bg-[#0D1016]/85 border border-[#2B313C] shadow-2xl relative overflow-hidden backdrop-blur-xl select-none transition-all">
      {/* HUD Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#22262C] mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-[#F1F3F5] uppercase font-mono">
            CREDEN OVERVIEW — NATIONAL ACADEMIC DATA COCKPIT
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModule('reports')}
            className="text-xs text-[#929AA5] hover:text-[#F1F3F5] flex items-center gap-1 transition-colors font-mono"
          >
            <span>Detailed Analytics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded text-[#929AA5] hover:text-[#F1F3F5] hover:bg-[#1A1E24] transition-colors"
            title="Minimize HUD to view full 3D scene"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Metric Cards (Matches Reference Image) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-3.5">
        {/* Metric 1 */}
        <div
          onClick={() => setActiveModule('institutions')}
          className="p-3 rounded-xl bg-[#14171E]/90 border border-[#22262C] hover:border-[#D2D6DC] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#929AA5] mb-1">
            <span className="text-[11px] font-medium tracking-tight">Registered Institutions</span>
            <Building2 className="w-4 h-4 text-[#D2D6DC] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono text-[#F1F3F5]">
            {metrics.registeredInstitutions.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#929AA5] mt-0.5">Approved under AICTE APH</div>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => setActiveModule('students')}
          className="p-3 rounded-xl bg-[#14171E]/90 border border-[#22262C] hover:border-[#D2D6DC] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#929AA5] mb-1">
            <span className="text-[11px] font-medium tracking-tight">Student Records</span>
            <Users className="w-4 h-4 text-[#D2D6DC] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono text-[#F1F3F5]">
            {metrics.studentRecords.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#929AA5] mt-0.5">Enrolled Session 2024-25</div>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => setActiveModule('apaar')}
          className="p-3 rounded-xl bg-[#14171E]/90 border border-[#22262C] hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#929AA5] mb-1">
            <span className="text-[11px] font-medium tracking-tight">APAAR Validated</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono text-emerald-300">
            {metrics.apaarValidated.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#929AA5] mt-0.5">DigiLocker / ABC Attested</div>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => setActiveModule('compliance')}
          className="p-3 rounded-xl bg-[#14171E]/90 border border-[#22262C] hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#929AA5] mb-1">
            <span className="text-[11px] font-medium tracking-tight">Pending Verification</span>
            <Clock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono text-amber-300">
            {metrics.pendingVerification.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#929AA5] mt-0.5">Under Officer Review</div>
        </div>
      </div>

      {/* Sub-panels row: Trend Chart + Doughnut + Top Institutions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {/* Sub-panel 1: Admission Trend (Last 5 Years) */}
        <div className="p-3 rounded-xl bg-[#14171E]/90 border border-[#22262C]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#F1F3F5] mb-2 font-mono">
            <span>Admission Trend (Last 5 Years)</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#D2D6DC]" />
          </div>
          <div className="h-24 flex items-end gap-2 pt-1 px-1">
            {[
              { year: '2020', h: '45%' },
              { year: '2021', h: '55%' },
              { year: '2022', h: '70%' },
              { year: '2023', h: '82%' },
              { year: '2024', h: '95%' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full bg-[#1C2027] rounded-t group-hover:bg-[#2B313C] transition-all relative overflow-hidden flex items-end" style={{ height: '70px' }}>
                  <div
                    className="w-full bg-gradient-to-t from-[#22262C] via-[#929AA5] to-[#F1F3F5] rounded-t transition-all duration-700"
                    style={{ height: bar.h }}
                  />
                </div>
                <span className="text-[10px] text-[#929AA5] font-mono">{bar.year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-panel 2: Validation Status Doughnut */}
        <div className="p-3 rounded-xl bg-[#14171E]/90 border border-[#22262C] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-[#F1F3F5] mb-1 font-mono">
            <span>Validation Status</span>
            <PieChart className="w-3.5 h-3.5 text-[#D2D6DC]" />
          </div>
          <div className="flex items-center justify-around py-0.5">
            {/* Visual Circular Meter */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#1C2027]"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#D2D6DC]"
                  strokeDasharray={`${statusBreakdown.validatedPercent}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xs font-bold font-mono text-[#F1F3F5]">
                  {statusBreakdown.validatedPercent}%
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#D2D6DC]" />
                <span className="text-[#929AA5]">Validated:</span>
                <span className="font-mono text-[#F1F3F5]">{statusBreakdown.validatedPercent}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#64748B]" />
                <span className="text-[#929AA5]">Pending:</span>
                <span className="font-mono text-[#F1F3F5]">{statusBreakdown.pendingPercent}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-[#929AA5]">Failed:</span>
                <span className="font-mono text-[#F1F3F5]">{statusBreakdown.failedPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-panel 3: Top Institutions (By Enrolment) */}
        <div className="p-3 rounded-xl bg-[#14171E]/90 border border-[#22262C]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#F1F3F5] mb-1.5 font-mono">
            <span>Top Institutions (Enrolment)</span>
            <Award className="w-3.5 h-3.5 text-[#D2D6DC]" />
          </div>
          <div className="space-y-1 text-xs">
            {topInstitutions.slice(0, 4).map((inst, idx) => (
              <div
                key={inst.id || idx}
                onClick={() => setActiveModule('institutions')}
                className="flex items-center justify-between text-[11px] py-0.5 border-b border-[#1E232B] last:border-0 hover:bg-[#1C2027] px-1 rounded cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="text-[#64748B] font-mono w-3">{idx + 1}</span>
                  <span className="text-[#D2D6DC] truncate max-w-[150px]">
                    {inst.name}
                  </span>
                </div>
                <span className="font-mono text-[#F1F3F5]">
                  {inst.enrolmentCount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
