import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { ModuleId } from '../../types';
import {
  Building2,
  FileSpreadsheet,
  IdCard,
  TrendingUp,
  CopyCheck,
  ShieldAlert,
  FileCheck2,
  PieChart,
  Lock,
  Network,
  ArrowRight,
} from 'lucide-react';

export const NonWebGLFallback: React.FC = () => {
  const { openWorkspace } = usePortal();

  const modules: {
    id: ModuleId;
    title: string;
    subtitle: string;
    category: string;
    icon: React.ComponentType<{ className?: string }>;
    colorClass: string;
  }[] = [
    {
      id: 'institutions',
      title: 'Institution Management',
      subtitle: 'Approved technical institutions, programmes & statutory capacity',
      category: 'Institutional Oversight',
      icon: Building2,
      colorClass: 'bg-gradient-to-tr from-blue-600 to-blue-500',
    },
    {
      id: 'submissions',
      title: 'Student Data Submission',
      subtitle: 'Batch CSV ingestion, Verhoeff checksum engine & quota verification',
      category: 'Student Data Ops',
      icon: FileSpreadsheet,
      colorClass: 'bg-gradient-to-tr from-emerald-600 to-green-500',
    },
    {
      id: 'apaar',
      title: 'APAAR ID Validation',
      subtitle: '12-digit Verhoeff structural verification & ABC gateway',
      category: 'Verification & Integrity',
      icon: IdCard,
      colorClass: 'bg-gradient-to-tr from-purple-700 to-violet-500',
    },
    {
      id: 'admissions',
      title: 'Admission Monitoring',
      subtitle: 'Approved capacity sanctions vs real-time actual student enrolments',
      category: 'Institutional Oversight',
      icon: TrendingUp,
      colorClass: 'bg-gradient-to-tr from-amber-500 to-yellow-400',
    },
    {
      id: 'duplicates',
      title: 'Duplicate Record Detection',
      subtitle: 'Cross-institution concurrent enrolment & fuzzy identity conflicts',
      category: 'Verification & Integrity',
      icon: CopyCheck,
      colorClass: 'bg-gradient-to-tr from-rose-600 to-red-500',
    },
    {
      id: 'compliance',
      title: 'Compliance Monitoring',
      subtitle: 'APH 2024-25 regulatory discrepancies, hearings & sanctions',
      category: 'Regulatory Oversight',
      icon: ShieldAlert,
      colorClass: 'bg-gradient-to-tr from-teal-600 to-teal-400',
    },
    {
      id: 'verification',
      title: 'Student Record Verification',
      subtitle: 'Zero-knowledge verification & SHA-256 QR attestation checking',
      category: 'Public Attestation',
      icon: FileCheck2,
      colorClass: 'bg-gradient-to-tr from-indigo-600 to-blue-500',
    },
    {
      id: 'reports',
      title: 'Reports and Analytics',
      subtitle: 'National data quality index & longitudinal enrolment analytics',
      category: 'Assurance & Integration',
      icon: PieChart,
      colorClass: 'bg-gradient-to-tr from-blue-500 via-green-500 to-amber-500',
    },
    {
      id: 'audit',
      title: 'Audit and Security',
      subtitle: 'Cryptographically chained SHA-256 tamper-evident security ledger',
      category: 'Security Assurance',
      icon: Lock,
      colorClass: 'bg-gradient-to-tr from-blue-900 to-indigo-800',
    },
    {
      id: 'integration',
      title: 'System Integration',
      subtitle: 'Government registry gateways (DigiLocker, ABC) & OpenAPI specs',
      category: 'System Gateways',
      icon: Network,
      colorClass: 'bg-gradient-to-tr from-emerald-500 to-teal-400',
    },
  ];

  return (
    <div className="pt-24 pb-28 px-6 max-w-7xl mx-auto space-y-6 select-none animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-950 font-sans">
            CREDEN Application Launcher
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select an academic governance module to launch its workspace.
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shadow-xs">
          10 Active Modules
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              onClick={() => openWorkspace(m.id)}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-400 transition-all cursor-pointer group hover:-translate-y-1 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl ${m.colorClass} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-white group-hover:bg-blue-600 group-hover:border-blue-600 transition-all shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400 mb-1">
                  {m.category}
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                  {m.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-700 group-hover:text-blue-600">
                <span>Open module</span>
                <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
