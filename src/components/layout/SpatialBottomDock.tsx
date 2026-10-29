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
  Lock,
} from 'lucide-react';

export const SpatialBottomDock: React.FC = () => {
  const { activeModule, setActiveModule, openWorkspace } = usePortal();

  const dockItems: { id: ModuleId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: '3D Space', icon: Compass },
    { id: 'institutions', label: 'Institutions', icon: Building },
    { id: 'students', label: 'Registry', icon: GraduationCap },
    { id: 'submissions', label: 'CSV Upload', icon: UploadCloud },
    { id: 'apaar', label: 'APAAR ID', icon: Fingerprint },
    { id: 'admissions', label: 'Admissions', icon: BarChart3 },
    { id: 'duplicates', label: 'Duplicates', icon: Users },
    { id: 'compliance', label: 'Compliance', icon: ShieldAlert },
    { id: 'verification', label: 'Verification', icon: FileCheck2 },
    { id: 'audit', label: 'Audit Log', icon: Lock },
  ];

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-full bg-[#13161B]/90 backdrop-blur-2xl border border-[#D7DBE2]/20 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_1px_rgba(215,219,226,0.15)] flex items-center gap-1.5 transition-all select-none"
      aria-label="Spatial Quick Dock"
    >
      {dockItems.map((item) => {
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
            className={`relative p-2 rounded-full transition-all group ${
              isActive
                ? 'bg-[#D7DBE2] text-[#07080A] shadow-[0_0_12px_rgba(215,219,226,0.5)] scale-110 font-bold'
                : 'text-[#A6AFBB] hover:text-[#F2F4F7] hover:bg-[#1E232B] hover:scale-110'
            }`}
            title={item.label}
            aria-label={item.label}
          >
            <Icon className="w-4 h-4" />

            {/* Micro Tooltip */}
            <div className="absolute bottom-11 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[#07080A] text-[#F2F4F7] text-[10px] font-medium border border-[#303642] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
              {item.label}
            </div>
          </button>
        );
      })}
    </nav>
  );
};
