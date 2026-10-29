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

  // VisionOS Style Colorful Icon Badges (Exact match to Reference Image dock)
  const dockItems: {
    id: ModuleId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    bgGradient: string;
  }[] = [
    {
      id: 'overview',
      label: '3D Space',
      icon: Compass,
      bgGradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    },
    {
      id: 'institutions',
      label: 'Institutions',
      icon: Building,
      bgGradient: 'bg-gradient-to-br from-slate-600 to-slate-800',
    },
    {
      id: 'students',
      label: 'Student Registry',
      icon: GraduationCap,
      bgGradient: 'bg-gradient-to-br from-emerald-500 to-teal-700',
    },
    {
      id: 'submissions',
      label: 'CSV Upload',
      icon: UploadCloud,
      bgGradient: 'bg-gradient-to-br from-sky-400 to-blue-600',
    },
    {
      id: 'apaar',
      label: 'APAAR ID',
      icon: Fingerprint,
      bgGradient: 'bg-gradient-to-br from-purple-500 to-indigo-700',
    },
    {
      id: 'admissions',
      label: 'Admissions',
      icon: BarChart3,
      bgGradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
    },
    {
      id: 'duplicates',
      label: 'Duplicates',
      icon: Users,
      bgGradient: 'bg-gradient-to-br from-rose-500 to-pink-700',
    },
    {
      id: 'compliance',
      label: 'Compliance',
      icon: ShieldAlert,
      bgGradient: 'bg-gradient-to-br from-red-600 to-amber-700',
    },
    {
      id: 'verification',
      label: 'Verification',
      icon: FileCheck2,
      bgGradient: 'bg-gradient-to-br from-teal-400 to-emerald-600',
    },
    {
      id: 'audit',
      label: 'Audit Ledger',
      icon: Lock,
      bgGradient: 'bg-gradient-to-br from-gray-700 to-gray-900',
    },
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1.5 pointer-events-none select-none">
      {/* VisionOS Frosted Light Liquid Glass Dock Capsule */}
      <nav
        className="pointer-events-auto px-3.5 py-2.5 rounded-full liquid-glass-pill flex items-center gap-2 shadow-[0_20px_45px_rgba(15,23,42,0.08),inset_0_1px_2px_rgba(255,255,255,1)] transition-all"
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
              className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 group ${
                item.bgGradient
              } text-white shadow-md ${
                isActive
                  ? 'scale-110 ring-2 ring-slate-900 ring-offset-2 ring-offset-white shadow-lg'
                  : 'hover:scale-115 hover:-translate-y-1 opacity-90 hover:opacity-100'
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5 drop-shadow-sm" />

              {/* VisionOS Floating Light Tooltip Pill */}
              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl liquid-glass-panel text-slate-900 text-xs font-semibold border border-white/90 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none shadow-xl z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      {/* VisionOS Spatial Grab Bar Pill */}
      <div className="w-16 h-1 rounded-full bg-slate-400/40 shadow-xs" />
    </div>
  );
};
