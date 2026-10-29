import React from 'react';
import { usePortal, MODULE_COORDINATES } from '../../context/PortalContext';
import { ModuleId } from '../../types';
import {
  Compass,
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
} from 'lucide-react';

interface NavItem {
  id: ModuleId;
  label: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SpatialFloatingRail: React.FC = () => {
  const { activeModule, setActiveModule, openWorkspace, setCameraTargetX, setScrollProgress } = usePortal();

  const navItems: NavItem[] = [
    { id: 'overview', label: '3D Application Launcher', category: 'Launcher', icon: Compass },
    { id: 'institutions', label: 'Institution Management', category: 'Oversight', icon: Building2 },
    { id: 'submissions', label: 'Student Data Submission', category: 'Ingestion', icon: FileSpreadsheet },
    { id: 'apaar', label: 'APAAR ID Validation', category: 'Identity', icon: IdCard },
    { id: 'admissions', label: 'Admission Monitoring', category: 'Intake', icon: TrendingUp },
    { id: 'duplicates', label: 'Duplicate Record Detection', category: 'Integrity', icon: CopyCheck },
    { id: 'compliance', label: 'Compliance Monitoring', category: 'Regulatory', icon: ShieldAlert },
    { id: 'verification', label: 'Student Record Verification', category: 'Attestation', icon: FileCheck2 },
    { id: 'reports', label: 'Reports and Analytics', category: 'Intelligence', icon: PieChart },
    { id: 'audit', label: 'Audit and Security', category: 'Security', icon: Lock },
    { id: 'integration', label: 'System Integration', category: 'Gateways', icon: Network },
  ];

  return (
    <aside
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center py-3 px-2 rounded-full bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_10px_35px_rgba(15,23,42,0.08)] transition-all duration-300"
      aria-label="Application Rail"
    >
      {/* 3D Launcher Home Button */}
      <button
        onClick={() => {
          setActiveModule('overview');
          setCameraTargetX(0);
          setScrollProgress(0.5);
        }}
        className="w-10 h-10 mb-2 rounded-2xl flex items-center justify-center bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all shadow-2xs group relative"
        title="CREDEN - Return to 3D Launcher"
      >
        <Compass className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
        {/* Tooltip */}
        <span className="absolute left-14 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
          CREDEN 3D Launcher
        </span>
      </button>

      {/* Hairline Divider */}
      <div className="w-6 h-[1px] bg-slate-200 mb-2" />

      {/* Navigation Icons Stack */}
      <div className="flex flex-col gap-1.5 max-h-[72vh] overflow-y-auto no-scrollbar py-0.5">
        {navItems.slice(1).map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                const targetX = MODULE_COORDINATES[item.id] ?? 0;
                setCameraTargetX(targetX);
                setScrollProgress((targetX + 18) / 36);
                openWorkspace(item.id);
              }}
              className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm scale-105'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 hover:scale-105'
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <Icon className="w-4 h-4" />

              {/* Floating Tooltip Pill */}
              <div className="absolute left-12 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none shadow-xl flex items-center gap-2 z-50">
                <span className="font-semibold">{item.label}</span>
                <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.2 rounded bg-slate-800">
                  {item.category}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
