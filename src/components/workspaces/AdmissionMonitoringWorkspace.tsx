import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePortal } from '../../context/PortalContext';
import {
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Shield,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';

export const AdmissionMonitoringWorkspace: React.FC = () => {
  const { token } = useAuth();
  const { openWorkspace } = usePortal();
  const [reports, setReports] = useState<any[]>([]);
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCompliance = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/compliance/summary?academicSession=2024-2025', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
        setReports(data.reports || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompliance();
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
