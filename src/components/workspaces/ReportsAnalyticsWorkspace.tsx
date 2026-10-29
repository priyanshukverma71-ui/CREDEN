import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  TrendingUp,
  Download,
  Award,
  PieChart,
  CheckCircle2,
  Sliders,
  Layers,
  Sparkles,
  BarChart2,
} from 'lucide-react';

export const ReportsAnalyticsWorkspace: React.FC = () => {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics/overview', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [token]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-highlight-silver">
            National Technical Education Analytics & Insights
          </h4>
          <p className="text-xs text-liquid-silver">
            Authoritative metrics aggregated from active institution enrolments, APAAR authentications, and compliance audits.
          </p>
        </div>

        <a
          href="/api/analytics/export-csv?type=students"
          className="px-4 py-2 rounded-xl bg-platinum hover:bg-white text-midnight text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export National Dataset (CSV)</span>
        </a>
      </div>

      {analytics && (
        <>
          {/* Data Quality Score Card (Explainable Intelligence) */}
          <div className="glass-panel rounded-2xl p-6 border border-glass-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-glass-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-platinum/10 border border-platinum/40 flex items-center justify-center font-mono font-bold text-xl text-platinum">
                  {analytics.dataQuality?.overallScore || 94.2}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-bold text-highlight-silver">
                      Transparent Institutional Data Quality Score
                    </h5>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-graphite text-platinum font-mono">
                      Deterministic
                    </span>
                  </div>
                  <p className="text-xs text-liquid-silver">
                    Weighted evaluation index of registry completeness, APAAR format validity, and zero duplicate tolerance.
                  </p>
                </div>
              </div>

              <span className="text-xs text-liquid-silver font-mono">Benchmark: 90.0+ / 100</span>
            </div>

            {/* Factors Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {analytics.dataQuality?.factors?.map((f: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-obsidian border border-glass-border">
                  <div className="text-[11px] text-liquid-silver truncate">{f.name}</div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-base font-bold font-mono text-platinum">{f.score} pts</span>
                    <span className="text-[10px] text-liquid-silver">Weight: {f.weight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid: Trends & Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 5-Year Admission Trends */}
            <div className="glass-panel rounded-2xl p-6 border border-glass-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-glass-border">
                <span className="text-xs font-semibold text-highlight-silver uppercase tracking-wider font-mono">
                  5-Year Longitudinal Admission Enrolment
                </span>
                <TrendingUp className="w-4 h-4 text-platinum" />
              </div>

              <div className="h-48 flex items-end gap-3 pt-6 px-2">
                {analytics.admissionTrends?.map((item: any, idx: number) => {
                  const maxCount = 350000;
                  const heightPercent = Math.min(100, Math.round((item.count / maxCount) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="text-[10px] font-mono text-liquid-silver group-hover:text-highlight-silver opacity-0 group-hover:opacity-100 transition-opacity">
                        {(item.count / 1000).toFixed(0)}k
                      </div>
                      <div className="w-full bg-graphite/40 rounded-t h-36 flex items-end overflow-hidden">
                        <div
                          className="w-full bg-gradient-to-t from-graphite via-liquid-silver to-platinum rounded-t transition-all duration-700 group-hover:bg-white"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-liquid-silver">{item.year}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Ranked Technical Institutions */}
            <div className="glass-panel rounded-2xl p-6 border border-glass-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-glass-border">
                <span className="text-xs font-semibold text-highlight-silver uppercase tracking-wider font-mono">
                  Top Institutions by Verified Enrolment
                </span>
                <Award className="w-4 h-4 text-platinum" />
              </div>

              <div className="space-y-2.5">
                {analytics.topInstitutions?.map((inst: any, idx: number) => (
                  <div
                    key={inst.id || idx}
                    className="p-2.5 rounded-xl bg-obsidian border border-glass-border flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-graphite text-platinum font-mono text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-highlight-silver truncate max-w-[220px]">
                          {inst.name}
                        </div>
                        <div className="text-[10px] text-liquid-silver font-mono">
                          {inst.code} • {inst.state}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-platinum">
                        {inst.enrolmentCount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-liquid-silver">Admitted</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
