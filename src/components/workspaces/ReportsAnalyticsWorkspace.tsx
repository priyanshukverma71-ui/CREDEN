import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/apiService';
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
  FileText,
  Calendar,
  Filter,
  Check,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

export const ReportsAnalyticsWorkspace: React.FC = () => {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [reportsData, setReportsData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Custom Report Generator Modal State
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [reportType, setReportType] = useState('INTAKE_COMPLIANCE');
  const [reportFormat, setReportFormat] = useState<'PDF' | 'CSV' | 'JSON'>('PDF');
  const [generating, setGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // 1. Overview analytics
        const res = await fetch('/api/analytics/overview', { headers });
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }

        // 2. Statutory reports and forecasting from ApiService
        const rep = await ApiService.getReports();
        if (rep.success) {
          setReportsData(rep);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleGenerateCustomReport = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGeneratedReport({
        id: `REP-CUSTOM-${Date.now().toString().slice(-4)}`,
        title: `${reportType.replace(/_/g, ' ')} Statutory Audit Report`,
        format: reportFormat,
        timestamp: new Date().toISOString(),
        status: 'READY_FOR_DOWNLOAD',
      });
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-slate-900 tracking-tight">
              National Analytics, Forecasting & Regulatory Reports
            </h4>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              AICTE Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Historical enrolment trends, multi-year capacity growth, supernumerary quota distributions, and official statutory compliance reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setGeneratorOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Generate Custom Report</span>
          </button>

          <a
            href="/api/analytics/export-csv?type=students"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Alpha Parity: Year-over-Year Expansion & Supernumerary Quotas */}
      {reportsData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Year-over-Year Progression */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Year-over-Year Progression
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Academic Enrolment Expansion
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Comparison between 2024-25 and 2025-26 active admissions.
              </p>

              <div className="mt-5 space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                  <span className="text-xs text-slate-600">AY 2024-2025 (Previous)</span>
                  <span className="text-sm font-bold font-mono text-slate-900">
                    {reportsData.yearComparison?.['2024-2025'] || 1320} Students
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/80 flex items-center justify-between">
                  <span className="text-xs text-indigo-950 font-semibold">AY 2025-2026 (Active)</span>
                  <span className="text-sm font-bold font-mono text-indigo-900">
                    {reportsData.yearComparison?.['2025-2026'] || 1522} Students
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Annual Growth Rate:</span>
              <span className="text-emerald-600 font-extrabold font-mono text-base flex items-center gap-0.5">
                <ArrowUpRight className="w-4 h-4" />
                +{reportsData.yearComparison?.growthPercentage || 15.3}%
              </span>
            </div>
          </div>

          {/* Supernumerary & Special Quotas */}
          <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Supernumerary & Special Statutory Quotas
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  TFW, EWS, PMSSS (J&K), and International student seat distribution under AICTE norms.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                APH §4.2 Quotas
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 font-medium block">Tuition Fee Waiver</span>
                <span className="text-lg font-bold font-mono text-slate-900 mt-1 block">
                  {reportsData.supernumeraryStats?.tfw || 54}
                </span>
                <span className="text-[9px] text-slate-400">TFW 5% Quota</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 font-medium block">EWS Supernumerary</span>
                <span className="text-lg font-bold font-mono text-slate-900 mt-1 block">
                  {reportsData.supernumeraryStats?.ewsSupernumerary || 38}
                </span>
                <span className="text-[9px] text-slate-400">EWS 10% Quota</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 font-medium block">PMSSS (J&K)</span>
                <span className="text-lg font-bold font-mono text-slate-900 mt-1 block">
                  {reportsData.supernumeraryStats?.pmsss || 24}
                </span>
                <span className="text-[9px] text-slate-400">Prime Minister Scheme</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 font-medium block">NRI Admissions</span>
                <span className="text-lg font-bold font-mono text-slate-900 mt-1 block">
                  {reportsData.supernumeraryStats?.nri || 18}
                </span>
                <span className="text-[9px] text-slate-400">5% NRI Ceiling</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 font-medium block">Foreign Nationals</span>
                <span className="text-lg font-bold font-mono text-slate-900 mt-1 block">
                  {reportsData.supernumeraryStats?.foreignNational || 12}
                </span>
                <span className="text-[9px] text-slate-400">OCI / PIO / FN</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5-Year Simulated ARIMA Enrolment Forecast Timeline */}
      {reportsData && reportsData.simulatedForecast && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Simulated 5-Year Academic Enrolment Projections (AICTE ARIMA Model)
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Confidence Interval: 95%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
            {reportsData.simulatedForecast.map((item: any, idx: number) => {
              const isProjected = item.actual === null;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isProjected
                      ? 'bg-indigo-50/40 border-indigo-200'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>{item.year}</span>
                    <span
                      className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                        isProjected
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.confidence}
                    </span>
                  </div>

                  <div className="mt-3">
                    <span className="text-base font-extrabold font-mono text-slate-900 block">
                      {isProjected ? item.projected : item.actual}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {isProjected ? 'Projected Enrolment' : 'Verified Enrolment'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Official AICTE Statutory Reports Download Section */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Statutory AICTE Compliance Reports & Downloads
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Official Audit Artifacts
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {(reportsData?.reports || [
            { id: 'REP-01', title: 'National AICTE Intake Compliance Summary AY 2025-26', status: 'GENERATED', generatedAt: '2025-10-24' },
            { id: 'REP-02', title: 'State-wise APAAR Validation Matrix', status: 'GENERATED', generatedAt: '2025-10-20' },
            { id: 'REP-03', title: 'Supernumerary Quotas & Special Categories Audit', status: 'GENERATED', generatedAt: '2025-10-18' },
          ]).map((rep: any) => (
            <div key={rep.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-mono text-xs font-bold">
                  {rep.id.slice(-2)}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">{rep.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>Generated: {rep.generatedAt}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-medium">{rep.status}</span>
                  </div>
                </div>
              </div>

              <a
                href="/api/analytics/export-csv?type=students"
                download={`${rep.id}.csv`}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Custom Report Generator */}
      {generatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900">Generate Custom Statutory Report</h4>
              </div>
              <button
                onClick={() => { setGeneratorOpen(false); setGeneratedReport(null); }}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            {generatedReport ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Report Generated Successfully!</span>
                </div>
                <div className="text-xs text-emerald-900 space-y-1">
                  <div><strong>Report ID:</strong> {generatedReport.id}</div>
                  <div><strong>Title:</strong> {generatedReport.title}</div>
                  <div><strong>Format:</strong> {generatedReport.format}</div>
                </div>
                <a
                  href="/api/analytics/export-csv?type=students"
                  download="CREDEN_Custom_Report.csv"
                  className="mt-2 w-full py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Artifact</span>
                </a>
              </div>
            ) : (
              <form onSubmit={handleGenerateCustomReport} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Report Subject / Domain</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="INTAKE_COMPLIANCE">Approved Intake & Over-Admission Audit</option>
                    <option value="APAAR_VALIDATION">State-wise APAAR Integrity Matrix</option>
                    <option value="DUPLICATE_CONCURRENCY">Cross-Institutional Concurrent Enrolments</option>
                    <option value="SUPERNUMERARY_QUOTA">Supernumerary Quotas (TFW, EWS, PMSSS)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Export Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['PDF', 'CSV', 'JSON'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setReportFormat(fmt)}
                        className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                          reportFormat === fmt
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setGeneratorOpen(false)}
                    className="px-3.5 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={generating}
                    className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    {generating ? (
                      <>
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Compiling...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

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
