import React from 'react';
import { usePortal, CAROUSEL_MODULES_LIST } from '../../context/PortalContext';
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
  Share2,
} from 'lucide-react';

export const SpatialBottomDock: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    openWorkspace,
    carouselIndex,
    setCarouselIndex,
  } = usePortal();

  // 10 Functional CREDEN Application Launcher Modules in Material OS Colors
  const dockItems: {
    id: ModuleId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    bgGradient: string;
  }[] = [
    {
      id: 'overview',
      label: '3D Launcher',
      icon: Compass,
      bgGradient: 'bg-gradient-to-tr from-slate-700 to-slate-900',
    },
    {
      id: 'trustgraph',
      label: 'CREDEN TrustGraph',
      icon: Share2,
      bgGradient: 'bg-gradient-to-tr from-cyan-500 to-blue-600',
    },
    {
      id: 'institutions',
      label: 'Institution Management',
      icon: Building2,
      bgGradient: 'bg-gradient-to-tr from-blue-600 to-blue-500',
    },
    {
      id: 'submissions',
      label: 'Student Data Submission',
      icon: FileSpreadsheet,
      bgGradient: 'bg-gradient-to-tr from-emerald-600 to-green-500',
    },
    {
      id: 'apaar',
      label: 'APAAR ID Validation',
      icon: IdCard,
      bgGradient: 'bg-gradient-to-tr from-purple-700 to-violet-500',
    },
    {
      id: 'admissions',
      label: 'Admission Monitoring',
      icon: TrendingUp,
      bgGradient: 'bg-gradient-to-tr from-amber-500 to-yellow-400',
    },
    {
      id: 'duplicates',
      label: 'Duplicate Detection',
      icon: CopyCheck,
      bgGradient: 'bg-gradient-to-tr from-rose-600 to-red-500',
    },
    {
      id: 'compliance',
      label: 'Compliance Monitoring',
      icon: ShieldAlert,
      bgGradient: 'bg-gradient-to-tr from-teal-600 to-teal-400',
    },
    {
      id: 'verification',
      label: 'Record Verification',
      icon: FileCheck2,
      bgGradient: 'bg-gradient-to-tr from-indigo-600 to-blue-500',
    },
    {
      id: 'reports',
      label: 'Reports and Analytics',
      icon: PieChart,
      bgGradient: 'bg-gradient-to-tr from-blue-500 via-green-500 to-amber-500',
    },
    {
      id: 'audit',
      label: 'Audit and Security',
      icon: Lock,
      bgGradient: 'bg-gradient-to-tr from-blue-900 to-indigo-800',
    },
    {
      id: 'integration',
      label: 'System Integration',
      icon: Network,
      bgGradient: 'bg-gradient-to-tr from-emerald-500 to-teal-400',
    },
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1.5 pointer-events-none select-none">
      {/* Floating OS Dock Surface */}
      <nav
        className="pointer-events-auto px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-2xl border border-slate-200/90 flex items-center gap-2.5 shadow-[0_20px_50px_rgba(15,23,42,0.1),0_1px_3px_rgba(15,23,42,0.06)] transition-all"
        aria-label="Application Dock"
      >
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isCurrentInCarousel =
            activeModule === 'overview' &&
            item.id !== 'overview' &&
            CAROUSEL_MODULES_LIST[carouselIndex]?.id === item.id;
          const isActive = activeModule === item.id || isCurrentInCarousel;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'overview') {
                  setActiveModule('overview');
                } else if (activeModule === 'overview') {
                  const targetIdx = CAROUSEL_MODULES_LIST.findIndex(
                    (m) => m.id === item.id
                  );
                  if (targetIdx !== -1) {
                    if (targetIdx === carouselIndex) {
                      openWorkspace(item.id);
                    } else {
                      setCarouselIndex(targetIdx);
                    }
                  } else {
                    openWorkspace(item.id);
                  }
                } else {
                  openWorkspace(item.id);
                }
              }}
              className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 group ${
                item.bgGradient
              } text-white shadow-sm ${
                isActive
                  ? 'scale-110 ring-2 ring-blue-600 ring-offset-2 ring-offset-white shadow-md'
                  : 'hover:scale-115 hover:-translate-y-1 opacity-92 hover:opacity-100'
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5 drop-shadow-xs" />

              {/* Active Indicator Dot */}
              {isActive && (
                <span className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 shadow-xs" />
              )}

              {/* Front-Facing Sharp Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 shadow-md">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Dock Grab Handle Pill */}
      <div className="w-16 h-1 rounded-full bg-slate-300/80 pointer-events-auto" />
    </div>
  );
};
