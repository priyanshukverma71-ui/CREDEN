import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { ModuleId } from '../../types';
import {
  Compass,
  Building,
  GraduationCap,
  UploadCloud,
  Fingerprint,
  BarChart3,
  Users,
  ShieldAlert,
  FileCheck2,
  TrendingUp,
  Lock,
  Cpu,
  Layers,
} from 'lucide-react';

interface NavItem {
  id: ModuleId;
  label: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SpatialFloatingRail: React.FC = () => {
  const { activeModule, setActiveModule, openWorkspace } = usePortal();

  const navItems: NavItem[] = [
    { id: 'overview', label: '3D Spatial Overview', category: 'Space', icon: Compass },
    { id: 'institutions', label: 'Institution Oversight', category: 'Institutions', icon: Building },
    { id: 'students', label: 'Student Registry', category: 'Registry', icon: GraduationCap },
    { id: 'submissions', label: 'CSV Data Submission', category: 'Ingestion', icon: UploadCloud },
    { id: 'apaar', label: 'APAAR Validation', category: 'Identity', icon: Fingerprint },
    { id: 'admissions', label: 'Admission Monitoring', category: 'Intake', icon: BarChart3 },
    { id: 'duplicates', label: 'Duplicate Review', category: 'Integrity', icon: Users },
    { id: 'compliance', label: 'Compliance Centre', category: 'Sanctions', icon: ShieldAlert },
    { id: 'verification', label: 'Student Verification', category: 'Attestation', icon: FileCheck2 },
    { id: 'reports', label: 'Reports & Analytics', category: 'Intelligence', icon: TrendingUp },
    { id: 'audit', label: 'Audit Ledger', category: 'Security', icon: Lock },
    { id: 'integration', label: 'System Gateways', category: 'API', icon: Cpu },
  ];

  return (
    <aside
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center py-3 px-2 rounded-full bg-[#13161B]/90 backdrop-blur-xl border border-[#D7DBE2]/20 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_1px_rgba(215,219,226,0.15)] transition-all duration-300"
      aria-label="Spatial Navigation Rail"
    >
      {/* CREDEN Emblem at Top */}
      <button
        onClick={() => setActiveModule('overview')}
        className="w-10 h-10 mb-2 rounded-full flex items-center justify-center bg-[#07080A] border border-[#D7DBE2]/30 text-[#D7DBE2] hover:text-white hover:border-white transition-all shadow-md group relative"
        title="CREDEN - Return to Spatial Overview"
      >
        <div className="w-5 h-5 rounded-full border-2 border-[#D7DBE2] group-hover:scale-105 transition-transform flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D7DBE2]" />
        </div>
        {/* Tooltip */}
        <span className="absolute left-14 px-2.5 py-1 rounded-md bg-[#07080A] text-[#F2F4F7] text-xs font-mono border border-[#303642] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
          CREDEN 3D Space
        </span>
      </button>

      {/* Thin Liquid-Platinum Divider */}
      <div className="w-6 h-[1px] bg-[#303642] mb-2" />

      {/* Navigation Icons Stack */}
      <div className="flex flex-col gap-1.5 max-h-[75vh] overflow-y-auto no-scrollbar py-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'overview') {
                  setActiveModule('overview');
                } else {
                  openWorkspace(item.id);
                }
              }}
              className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all group ${
                isActive
                  ? 'bg-[#D7DBE2] text-[#07080A] shadow-[0_0_15px_rgba(215,219,226,0.4)] scale-105 font-bold'
                  : 'text-[#A6AFBB] hover:text-[#F2F4F7] hover:bg-[#1E232B] hover:scale-105'
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <Icon className="w-4 h-4" />

              {/* Floating Tooltip Pill */}
              <div className="absolute left-12 px-2.5 py-1 rounded-lg bg-[#07080A]/95 text-[#F2F4F7] text-xs border border-[#303642] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none shadow-2xl flex items-center gap-1.5 z-50">
                <span className="font-medium">{item.label}</span>
                <span className="text-[10px] text-[#A6AFBB] font-mono px-1 rounded bg-[#181C22]">
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
