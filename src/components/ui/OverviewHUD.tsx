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
  Sparkles,
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
  const { openWorkspace } = usePortal();

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
    { rank: 5, name: 'Government Polytechnic Delhi', enrolmentCount: 6780 },
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

  return (
    <div className="w-full max-w-5xl mx-auto glass-panel-elevated rounded-3xl p-5 border border-glass-border-bright shadow-glass-panel relative overflow-hidden backdrop-blur-2xl">
      {/* HUD Header */}
      <div className="flex items-center justify-between pb-3 border-b border-glass-border mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-platinum animate-pulse" />
          <h2 className="text-sm font-semibold tracking-wider text-highlight-silver uppercase font-mono">
            CREDEN Overview — National Academic Data Cockpit
          </h2>
        </div>
        <button
          onClick={() => openWorkspace('reports')}
          className="text-xs text-liquid-silver hover:text-platinum flex items-center gap-1 transition-colors"
        >
          <span>Detailed Analytics</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Primary KPI Metric Cards (Matches Reference Image) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {/* Metric 1 */}
        <div
          onClick={() => openWorkspace('institutions')}
          className="glass-panel rounded-xl p-3 border border-glass-border hover:border-platinum transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-liquid-silver mb-1.5">
            <span className="text-[11px] font-medium tracking-tight">Registered Institutions</span>
            <Building2 className="w-4 h-4 text-platinum group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono platinum-gradient-text">
            {metrics.registeredInstitutions.toLocaleString()}
          </div>
          <div className="text-[10px] text-liquid-silver mt-0.5">Approved under AICTE APH</div>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => openWorkspace('students')}
          className="glass-panel rounded-xl p-3 border border-glass-border hover:border-platinum transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-liquid-silver mb-1.5">
            <span className="text-[11px] font-medium tracking-tight">Student Records</span>
            <Users className="w-4 h-4 text-platinum group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono platinum-gradient-text">
            {metrics.studentRecords.toLocaleString()}
          </div>
          <div className="text-[10px] text-liquid-silver mt-0.5">Enrolled Session 2024-25</div>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => openWorkspace('apaar')}
          className="glass-panel rounded-xl p-3 border border-glass-border hover:border-platinum transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-liquid-silver mb-1.5">
            <span className="text-[11px] font-medium tracking-tight">APAAR Validated</span>
            <ShieldCheck className="w-4 h-4 text-platinum group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono platinum-gradient-text">
            {metrics.apaarValidated.toLocaleString()}
          </div>
          <div className="text-[10px] text-liquid-silver mt-0.5">DigiLocker / ABC Attested</div>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => openWorkspace('compliance')}
          className="glass-panel rounded-xl p-3 border border-glass-border hover:border-platinum transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-liquid-silver mb-1.5">
            <span className="text-[11px] font-medium tracking-tight">Pending Verification</span>
            <Clock className="w-4 h-4 text-platinum group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono text-highlight-silver">
            {metrics.pendingVerification.toLocaleString()}
          </div>
          <div className="text-[10px] text-liquid-silver mt-0.5">Under Officer Review</div>
        </div>
      </div>

      {/* Sub-panels row: Trend Chart + Doughnut + Top Institutions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Sub-panel 1: Admission Trend (Last 5 Years) */}
        <div className="glass-panel rounded-xl p-3 border border-glass-border">
          <div className="flex items-center justify-between text-xs font-semibold text-highlight-silver mb-2">
            <span>Admission Trend (Last 5 Years)</span>
            <TrendingUp className="w-3.5 h-3.5 text-platinum" />
          </div>
          <div className="h-28 flex items-end gap-2 pt-2 px-1">
            {[
              { year: '2020', h: '45%' },
              { year: '2021', h: '55%' },
              { year: '2022', h: '70%' },
              { year: '2023', h: '82%' },
              { year: '2024', h: '95%' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="w-full bg-graphite/60 rounded-t group-hover:bg-platinum/40 transition-all relative overflow-hidden flex items-end" style={{ height: '80px' }}>
                  <div
                    className="w-full bg-gradient-to-t from-graphite via-liquid-silver to-platinum rounded-t transition-all duration-700"
                    style={{ height: bar.h }}
                  />
                </div>
                <span className="text-[10px] text-liquid-silver font-mono">{bar.year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-panel 2: Validation Status Doughnut */}
        <div className="glass-panel rounded-xl p-3 border border-glass-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-highlight-silver mb-2">
            <span>Validation Status</span>
            <PieChart className="w-3.5 h-3.5 text-platinum" />
          </div>
          <div className="flex items-center justify-around py-1">
            {/* Visual Circular Meter */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-graphite"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-platinum"
                  strokeDasharray={`${statusBreakdown.validatedPercent}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xs font-bold font-mono platinum-gradient-text">
                  {statusBreakdown.validatedPercent}%
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-platinum" />
                <span className="text-liquid-silver">Validated:</span>
                <span className="font-mono text-highlight-silver">{statusBreakdown.validatedPercent}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-liquid-silver" />
                <span className="text-liquid-silver">Pending:</span>
                <span className="font-mono text-highlight-silver">{statusBreakdown.pendingPercent}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-graphite" />
                <span className="text-liquid-silver">Failed:</span>
                <span className="font-mono text-highlight-silver">{statusBreakdown.failedPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-panel 3: Top Institutions (By Enrolment) */}
        <div className="glass-panel rounded-xl p-3 border border-glass-border">
          <div className="flex items-center justify-between text-xs font-semibold text-highlight-silver mb-2">
            <span>Top Institutions (By Enrolment)</span>
            <Award className="w-3.5 h-3.5 text-platinum" />
          </div>
          <div className="space-y-1.5 text-xs">
            {topInstitutions.slice(0, 4).map((inst, idx) => (
              <div
                key={inst.id || idx}
                className="flex items-center justify-between text-[11px] py-0.5 border-b border-glass-border/40 last:border-0"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-liquid-silver font-mono w-3">{idx + 1}</span>
                  <span className="text-highlight-silver truncate max-w-[140px]">
                    {inst.name}
                  </span>
                </div>
                <span className="font-mono text-platinum">
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
