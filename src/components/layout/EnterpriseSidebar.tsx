import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePortal } from '../../context/PortalContext';
import { ModuleId } from '../../types';
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  GraduationCap,
  UploadCloud,
  IdCard,
  CopyCheck,
  AlertTriangle,
  FileCheck2,
  PieChart,
  Lock,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  id: ModuleId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

interface NavGroup {
  groupLabel: string;
  items: NavItem[];
}

export const EnterpriseSidebar: React.FC = () => {
  const { user } = useAuth();
  const {
    activeModule,
    setActiveModule,
    sidebarCollapsed,
    toggleSidebar,
    unreadNotificationCount,
  } = usePortal();

  const navGroups: NavGroup[] = [
    {
      groupLabel: 'Core Governance',
      items: [
        { id: 'overview', label: 'Executive Cockpit', icon: LayoutDashboard },
      ],
    },
    {
      groupLabel: 'Institutional Oversight',
      items: [
        { id: 'institutions', label: 'Institution Management', icon: Building2 },
        { id: 'admissions', label: 'Admission & Intake Monitoring', icon: TrendingUp },
      ],
    },
    {
      groupLabel: 'Student Data Ops',
      items: [
        { id: 'students', label: 'Student Registry', icon: GraduationCap },
        { id: 'submissions', label: 'Student Data Submission', icon: UploadCloud },
      ],
    },
    {
      groupLabel: 'Verification & Integrity',
      items: [
        { id: 'apaar', label: 'APAAR ID Validation', icon: IdCard },
        { id: 'duplicates', label: 'Duplicate Record Review', icon: CopyCheck, badge: '38', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
        { id: 'compliance', label: 'Compliance Action Centre', icon: AlertTriangle, badge: '14', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
        { id: 'verification', label: 'Verification Bureau', icon: FileCheck2 },
      ],
    },
    {
      groupLabel: 'Assurance & Integration',
      items: [
        { id: 'reports', label: 'Reports & Analytics', icon: PieChart },
        { id: 'audit', label: 'Audit & Tamper Logs', icon: Lock },
        { id: 'integration', label: 'Integration Settings', icon: Cpu },
      ],
    },
  ];

  const handleSelectModule = (id: ModuleId) => {
    setActiveModule(id);
  };

  return (
    <aside
      className={`relative flex flex-col h-screen border-r border-[#22262C] bg-[#0E1014] text-[#F1F3F5] transition-all duration-200 z-30 select-none ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-14 px-3.5 border-b border-[#22262C] bg-[#111317]">
        <div
          onClick={() => handleSelectModule('overview')}
          className="flex items-center gap-2.5 cursor-pointer overflow-hidden text-left"
          title="CREDEN - AICTE Student Data Platform"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#1A1E24] border border-[#2D333D] flex items-center justify-center shadow-inner">
            {/* Minimal Ashoka Stambh / Emblem representation */}
            <div className="flex flex-col items-center justify-center">
              <Shield className="w-4 h-4 text-[#D2D6DC]" />
            </div>
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col leading-tight min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-wide text-[#F1F3F5] font-mono">
                  CREDEN
                </span>
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#1F242C] text-[#D2D6DC] border border-[#2B313C] font-mono">
                  AICTE
                </span>
              </div>
              <span className="text-[10px] text-[#929AA5] truncate">
                Academic Data Governance
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1 rounded-md text-[#929AA5] hover:text-[#F1F3F5] hover:bg-[#1A1E24] transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-0.5">
            {!sidebarCollapsed && (
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#929AA5]/80 font-mono">
                {group.groupLabel}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectModule(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all text-left group relative ${
                    isActive
                      ? 'bg-[#1C2027] text-[#F1F3F5] shadow-sm border border-[#2D333D]'
                      : 'text-[#929AA5] hover:text-[#F1F3F5] hover:bg-[#15181E] border border-transparent'
                  }`}
                >
                  {/* Active highlight bar on left */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#D2D6DC] rounded-r-full" />
                  )}
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-[#D2D6DC]' : 'text-[#7B8390] group-hover:text-[#D2D6DC]'
                    }`}
                  />
                  {!sidebarCollapsed && (
                    <span className="truncate flex-1 tracking-tight">
                      {item.label}
                    </span>
                  )}
                  {!sidebarCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full border ${item.badgeColor || 'bg-[#22262C] text-[#D2D6DC] border-[#313742]'}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Institutional Compliance Status & User Pill */}
      <div className="p-2.5 border-t border-[#22262C] bg-[#111317]">
        {!sidebarCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] text-[#929AA5] px-1 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                APH 2024-25
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1A1E24] text-[#D2D6DC] border border-[#282E37]">
                SYNTHETIC SANDBOX
              </span>
            </div>
            {user?.institutionName && (
              <div className="p-2 rounded-md bg-[#16191F] border border-[#22262C] text-[11px] truncate text-[#D2D6DC]">
                <div className="text-[9px] uppercase tracking-wider text-[#7B8390] font-mono">
                  Affiliated Institution
                </div>
                <div className="truncate font-medium text-[#F1F3F5]">
                  {user.institutionName}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center" title="APH 2024-25 Rules Enforced">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
        )}
      </div>
    </aside>
  );
};
