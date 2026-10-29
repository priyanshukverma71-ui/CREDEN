import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePortal } from '../../context/PortalContext';
import { ApiService } from '../../services/apiService';
import {
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Shield,
  Layers,
  ChevronRight,
  Info,
  Sliders,
  Sparkles,
  Play,
  RotateCcw,
} from 'lucide-react';

export const AdmissionMonitoringWorkspace: React.FC = () => {
  const { token } = useAuth();
  const { openWorkspace } = usePortal();
  const [reports, setReports] = useState<any[]>([]);
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Policy Simulator State (Alpha Parity)
  const [warningThreshold, setWarningThreshold] = useState(85);
  const [excessThreshold, setExcessThreshold] = useState(100);
  const [simulating, setSimulating] = useState(false);
  const [simResults, setSimResults] = useState<any | null>(null);

  const fetchCompliance = async () => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/compliance/summary?academicSession=2024-2025', { headers });
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
        setReports(data.reports || []);
      } else {
        // Fallback to sample compliance summary
        setSummary({
          academicSession: '2024-2025',
          totalCoursesAudited: 48,
          totalApprovedSeats: 3240,
          totalEnrolledStudents: 3462,
          nationalUtilizationRate: 106.8,
          flaggedOverIntakeCourses: 2,
          totalExcessAdmissions: 12,
        });
      }
    } catch (e) {
      console.error(e);
      setSummary({
        academicSession: '2024-2025',
        totalCoursesAudited: 48,
        totalApprovedSeats: 3240,
        totalEnrolledStudents: 3462,
        nationalUtilizationRate: 106.8,
        flaggedOverIntakeCourses: 2,
        totalExcessAdmissions: 12,
      });
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const res = await ApiService.simulatePolicy({ warningThreshold, excessThreshold });
      if (res.success && res.results) {
        setSimResults(res.results);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    fetchCompliance();
    runSimulation();
  }, [token]);

  return (
    <div className="space-y-6">
      {/* Top Compliance Alert Banner if excess admissions found */}
      {summary && summary.flaggedOverIntakeCourses > 0 && (
        <div className="p-4 rounded-2xl bg-red-950/30 border border-glass-border flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-platinum flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-highlight-silver flex items-center gap-2">
                <span>AICTE Intake Sanction Breach Detected</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-graphite text-platinum font-mono">
                  APH Clause 4.2
                </span>
              </div>
              <p className="text-xs text-liquid-silver mt-1">
                {summary.flaggedOverIntakeCourses} programme(s) have admitted {summary.totalExcessAdmissions} excess students beyond the approved intake sanction limit. Immediate review required in Compliance Action Centre.
              </p>
            </div>
          </div>

          <button
            onClick={() => openWorkspace('compliance')}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-platinum hover:bg-white text-midnight text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Review Actions</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Overview Stat Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="glass-panel p-3.5 rounded-xl border border-glass-border">
            <div className="text-xs text-liquid-silver">Total Sanctioned Intake</div>
            <div className="text-xl font-bold font-mono platinum-gradient-text mt-1">
              {summary.totalApprovedSeats.toLocaleString()}
            </div>
            <div className="text-[10px] text-liquid-silver mt-0.5">Across {summary.totalCoursesAudited} programmes</div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl border border-glass-border">
            <div className="text-xs text-liquid-silver">Actual Admissions Ingested</div>
            <div className="text-xl font-bold font-mono text-highlight-silver mt-1">
              {summary.totalEnrolledStudents.toLocaleString()}
            </div>
            <div className="text-[10px] text-liquid-silver mt-0.5">Session 2024-2025</div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl border border-glass-border">
            <div className="text-xs text-liquid-silver">National Capacity Utilization</div>
            <div className="text-xl font-bold font-mono text-platinum mt-1">
              {summary.nationalUtilizationRate}%
            </div>
            <div className="text-[10px] text-liquid-silver mt-0.5">Sanctioned seats filled</div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl border border-glass-border">
            <div className="text-xs text-liquid-silver">Excess Intake Alerts</div>
            <div className="text-xl font-bold font-mono text-platinum mt-1">
              +{summary.totalExcessAdmissions}
            </div>
            <div className="text-[10px] text-liquid-silver mt-0.5">Non-compliant admissions</div>
          </div>
        </div>
      )}

      {/* Interactive Policy Simulator Panel (Alpha Parity Feature) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                  Interactive Policy Simulator & Regulatory What-If Engine
                </h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  APH Clause 4.3 Simulation
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust regulatory threshold sensitivities to simulate national over-intake warnings and proactive capacity reviews before enacting official administrative orders.
              </p>
            </div>
          </div>

          <button
            onClick={runSimulation}
            disabled={simulating}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-all hover:scale-102 active:scale-98 disabled:opacity-50 flex-shrink-0 cursor-pointer"
          >
            {simulating ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Policy Simulation</span>
              </>
            )}
          </button>
        </div>

        {/* Dual Slider Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/70 p-4 rounded-xl border border-slate-200/60">
          {/* Warning Threshold Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <span>Warning Sensitivity Threshold</span>
                <span className="text-[10px] text-slate-400 font-normal">(Capacity Fill %)</span>
              </span>
              <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {warningThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="70"
              max="98"
              step="1"
              value={warningThreshold}
              onChange={(e) => setWarningThreshold(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>70% (Aggressive)</span>
              <span>85% (Recommended)</span>
              <span>98% (Conservative)</span>
            </div>
          </div>

          {/* Excess Threshold Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <span>Strict Excess Breach Ceiling</span>
                <span className="text-[10px] text-slate-400 font-normal">(Hard Ceiling %)</span>
              </span>
              <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {excessThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="95"
              max="115"
              step="1"
              value={excessThreshold}
              onChange={(e) => setExcessThreshold(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>95% (Zero Margin)</span>
              <span>100% (Strict Sanction)</span>
              <span>115% (Flexible)</span>
            </div>
          </div>
        </div>

        {/* Live Simulation Projection Results */}
        {simResults && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 block">Evaluated Programmes</span>
                <span className="text-lg font-extrabold font-mono text-slate-900 mt-0.5 block">
                  {simResults.programmesEvaluated}
                </span>
                <span className="text-[10px] text-slate-400">Total national batch audit</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 shadow-xs">
                <span className="text-[11px] text-emerald-700 block font-medium">Compliant</span>
                <span className="text-lg font-extrabold font-mono text-emerald-800 mt-0.5 block">
                  {simResults.normalCount}
                </span>
                <span className="text-[10px] text-emerald-600">Within permissible quota</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 shadow-xs">
                <span className="text-[11px] text-amber-700 block font-medium">Near Capacity Alert</span>
                <span className="text-lg font-extrabold font-mono text-amber-800 mt-0.5 block">
                  {simResults.nearCapacityCount}
                </span>
                <span className="text-[10px] text-amber-600">≥ {warningThreshold}% threshold</span>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/80 shadow-xs">
                <span className="text-[11px] text-rose-700 block font-medium">Breach Violations</span>
                <span className="text-lg font-extrabold font-mono text-rose-800 mt-0.5 block">
                  {simResults.excessCount}
                </span>
                <span className="text-[10px] text-rose-600">≥ {excessThreshold}% ceiling</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs text-indigo-950 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Simulated Regulatory Determination:</strong>
                <p className="text-indigo-900 mt-0.5 leading-relaxed">{simResults.impactAnalysis}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Course Compliance Table */}
      <div className="glass-panel rounded-2xl border border-glass-border overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-glass-border">
          <h4 className="text-xs font-semibold text-highlight-silver uppercase tracking-wider font-mono">
            Course-Wise Approved Intake vs Actual Admissions
          </h4>
          <span className="text-[11px] text-liquid-silver">Policy: AICTE-APH-2024-25-RULES-V2.1</span>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-xs text-liquid-silver text-center py-8">Auditing admission records...</p>
          ) : reports.length === 0 ? (
            <p className="text-xs text-liquid-silver text-center py-8">No programmes found.</p>
          ) : (
            reports.map((rep) => {
              const isOver = rep.isOverIntake;
              return (
                <div
                  key={rep.courseId}
                  className={`p-4 rounded-xl border transition-all ${
                    isOver
                      ? 'bg-red-950/20 border-glass-border'
                      : 'bg-obsidian/60 border-glass-border/70 hover:border-glass-border'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-highlight-silver">
                          {rep.courseName}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-graphite text-liquid-silver">
                          {rep.courseCode}
                        </span>
                      </div>
                      <span className="text-[11px] text-liquid-silver">
                        Approved Intake: <strong className="text-highlight-silver font-mono">{rep.approvedIntake}</strong> | Admitted: <strong className="text-platinum font-mono">{rep.actualEnrolment}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-highlight-silver">
                        {rep.capacityUtilization}% Capacity
                      </span>
                      {isOver ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-graphite text-platinum font-semibold border border-glass-border">
                          OVER INTAKE (+{rep.excessCount})
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-platinum/10 text-platinum font-semibold border border-platinum/20">
                          COMPLIANT
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-obsidian rounded-full overflow-hidden border border-glass-border mb-3">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isOver ? 'bg-platinum' : 'bg-gradient-to-r from-liquid-silver to-platinum'
                      }`}
                      style={{ width: `${Math.min(100, rep.capacityUtilization)}%` }}
                    />
                  </div>

                  {/* Breakdown Quotas */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-glass-border/40 text-[11px] text-liquid-silver">
                    <div>
                      General: <strong className="text-highlight-silver font-mono">{rep.categoryBreakdown.general.actual}/{rep.categoryBreakdown.general.approved}</strong>
                    </div>
                    <div>
                      OBC: <strong className="text-highlight-silver font-mono">{rep.categoryBreakdown.obc.actual}/{rep.categoryBreakdown.obc.approved}</strong>
                    </div>
                    <div>
                      SC/ST: <strong className="text-highlight-silver font-mono">{rep.categoryBreakdown.sc.actual + rep.categoryBreakdown.st.actual}/{rep.categoryBreakdown.sc.approved + rep.categoryBreakdown.st.approved}</strong>
                    </div>
                    <div>
                      Supernumerary TFW (5%): <strong className="text-highlight-silver font-mono">{rep.supernumeraryBreakdown.tfw.actual}/{rep.supernumeraryBreakdown.tfw.allowed}</strong>
                    </div>
                  </div>

                  {rep.actionRequired && (
                    <div className="mt-3 p-2 rounded-lg bg-graphite/40 border border-glass-border text-[11px] text-highlight-silver flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-platinum flex-shrink-0 mt-0.5" />
                      <span>{rep.actionRequired}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
