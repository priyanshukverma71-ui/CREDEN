import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePortal } from '../../context/PortalContext';
import { ModuleId, UserRole } from '../../types';
import {
  Search,
  Bell,
  UserCheck,
  ChevronDown,
  LogOut,
  Layers,
  Building,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Compass,
  SlidersHorizontal,
  ExternalLink,
  ChevronRight,
  Shield,
  Eye,
  Activity,
} from 'lucide-react';

interface EnterpriseTopNavProps {
  onSearchClick: () => void;
  onOpenLogin: () => void;
}

export const EnterpriseTopNav: React.FC<EnterpriseTopNavProps> = ({
  onSearchClick,
  onOpenLogin,
}) => {
  const { user, switchDemoRole, logout } = useAuth();
  const {
    activeModule,
    setActiveModule,
    viewMode,
    toggleViewMode,
    unreadNotificationCount,
    notifications,
    markNotificationsAsRead,
    sihStep,
    advanceSihStep,
  } = usePortal();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setNotifMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: { role: UserRole; title: string; subtitle: string; icon: any }[] = [
    {
      role: 'AICTE_ADMIN',
      title: 'AICTE Administrator',
      subtitle: 'National oversight, policy enforcement & dispute resolution',
      icon: ShieldCheck,
    },
    {
      role: 'INSTITUTION_ADMIN',
      title: 'Institution Admin (DTU)',
      subtitle: 'Manage institution, courses & batch submissions',
      icon: Building,
    },
    {
      role: 'DATA_ENTRY_OPERATOR',
      title: 'Data Entry Operator',
      subtitle: 'Upload CSV, correct student records & re-submit',
      icon: Layers,
    },
    {
      role: 'VERIFICATION_OFFICER',
      title: 'Verification Officer',
      subtitle: 'Adjudicate duplicate cases & intake discrepancies',
      icon: UserCheck,
    },
    {
      role: 'AUDITOR',
      title: 'National Auditor (CAG)',
      subtitle: 'Inspect immutable cryptographic audit logs',
      icon: CheckCircle2,
    },
    {
      role: 'EXTERNAL_VERIFIER',
      title: 'External Verifier / Employer',
      subtitle: 'Zero-knowledge minimal disclosure record checking',
      icon: Eye,
    },
    {
      role: 'STUDENT',
      title: 'Student (Aarav Sharma)',
      subtitle: 'View APAAR verification & digital credentials',
      icon: GraduationCap,
    },
  ];

  // Breadcrumb metadata mapping
  const getModuleBreadcrumb = () => {
    switch (activeModule) {
      case 'overview':
        return { group: 'Governance', label: 'Executive Cockpit' };
      case 'institutions':
        return { group: 'Institutional Oversight', label: 'Institution Management' };
      case 'admissions':
        return { group: 'Institutional Oversight', label: 'Admission & Intake Monitoring' };
      case 'students':
        return { group: 'Student Data', label: 'Student Registry' };
      case 'submissions':
        return { group: 'Student Data', label: 'Student Data Submission' };
      case 'apaar':
        return { group: 'Verification & Integrity', label: 'APAAR ID Validation' };
      case 'duplicates':
        return { group: 'Verification & Integrity', label: 'Duplicate Record Review' };
      case 'compliance':
        return { group: 'Verification & Integrity', label: 'Compliance Action Centre' };
      case 'verification':
        return { group: 'Verification & Integrity', label: 'Verification Bureau' };
      case 'reports':
        return { group: 'Assurance & Integration', label: 'Reports & Analytics' };
      case 'audit':
        return { group: 'Assurance & Integration', label: 'Audit & Tamper Logs' };
      case 'integration':
        return { group: 'Assurance & Integration', label: 'Integration Settings' };
      default:
        return { group: 'Portal', label: 'Dashboard' };
    }
  };

  const breadcrumb = getModuleBreadcrumb();

  return (
    <header className="h-14 border-b border-[#22262C] bg-[#111317] flex items-center justify-between px-4 z-20 select-none">
      {/* Left: Breadcrumbs & Page title */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#929AA5]">
          <span
            onClick={() => setActiveModule('overview')}
            className="hover:text-[#F1F3F5] cursor-pointer transition-colors"
          >
            AICTE CREDEN
          </span>
          <ChevronRight className="w-3 h-3 text-[#5A6270]" />
          <span>{breadcrumb.group}</span>
          <ChevronRight className="w-3 h-3 text-[#5A6270]" />
        </div>
        <h1 className="text-sm font-semibold text-[#F1F3F5] truncate tracking-tight">
          {breadcrumb.label}
        </h1>
      </div>

      {/* Center: Command Palette Trigger */}
      <div className="hidden md:flex items-center justify-center flex-1 max-w-md px-4">
        <button
          onClick={onSearchClick}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#16191F] border border-[#262C36] text-xs text-[#929AA5] hover:border-[#38404E] hover:text-[#D2D6DC] transition-all group shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#7B8390] group-hover:text-[#D2D6DC]" />
            <span className="truncate">Search students, APAAR, institutions...</span>
          </div>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#1C2027] text-[#929AA5] rounded border border-[#2B313C]">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* 3D Spatial Cockpit vs Data View Switcher */}
        <button
          onClick={toggleViewMode}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all border ${
            viewMode === 'panoramic'
              ? 'bg-[#22262C] text-[#F1F3F5] border-[#D2D6DC]/40 shadow-sm'
              : 'bg-[#16191F] text-[#929AA5] border-[#22262C] hover:text-[#D2D6DC] hover:border-[#2D333D]'
          }`}
          title="Toggle between 3D Spatial Panoramic view and Enterprise Data Grid"
        >
          <Compass className="w-3.5 h-3.5 text-[#D2D6DC]" />
          <span className="hidden sm:inline">
            {viewMode === 'panoramic' ? '3D Panoramic' : '3D View'}
          </span>
        </button>

        {/* Role Persona Quick Switcher */}
        <div className="relative" ref={roleMenuRef}>
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#16191F] hover:bg-[#1C2027] border border-[#22262C] hover:border-[#2D333D] text-xs transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#D2D6DC]" />
            <span className="hidden lg:inline text-[#929AA5]">Persona:</span>
            <span className="font-medium text-[#F1F3F5] max-w-[130px] truncate">
              {user ? user.role.replace(/_/g, ' ') : 'Guest'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#7B8390]" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#14171B] border border-[#282D35] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1.5 border-b border-[#22262C] mb-1.5">
                <div className="text-xs font-semibold text-[#F1F3F5]">
                  Select Evaluation Persona
                </div>
                <div className="text-[11px] text-[#929AA5]">
                  Instant role-based authorization switching
                </div>
              </div>
              <div className="space-y-1 max-h-80 overflow-y-auto">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isCurrent = user?.role === r.role;
                  return (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchDemoRole(r.role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors ${
                        isCurrent
                          ? 'bg-[#1C2027] border border-[#313742]'
                          : 'hover:bg-[#181B21] border border-transparent'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isCurrent ? 'text-[#D2D6DC]' : 'text-[#7B8390]'}`} />
                      <div className="min-w-0 flex-1">
                        <div className={`text-xs font-medium ${isCurrent ? 'text-[#F1F3F5]' : 'text-[#D2D6DC]'}`}>
                          {r.title}
                        </div>
                        <div className="text-[10px] text-[#929AA5] leading-tight line-clamp-1">
                          {r.subtitle}
                        </div>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] text-emerald-400 font-mono">Active</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setNotifMenuOpen(!notifMenuOpen)}
            className="relative p-2 rounded-lg bg-[#16191F] hover:bg-[#1C2027] border border-[#22262C] hover:border-[#2D333D] text-[#929AA5] hover:text-[#F1F3F5] transition-colors"
            title="System Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow-sm animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {notifMenuOpen && (
            <div className="absolute right-0 mt-2 w-88 max-w-[90vw] rounded-xl bg-[#14171B] border border-[#282D35] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-2.5 py-2 border-b border-[#22262C]">
                <div>
                  <div className="text-xs font-semibold text-[#F1F3F5]">System Notifications</div>
                  <div className="text-[10px] text-[#929AA5]">Real-time compliance & audit events</div>
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={markNotificationsAsRead}
                    className="text-[10px] text-[#D2D6DC] hover:underline font-mono"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#1D2128]">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#7B8390]">
                    No unread notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-2.5 hover:bg-[#181B21] transition-colors rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-medium text-[#F1F3F5] leading-tight">
                          {n.title}
                        </div>
                        <span className="text-[9px] text-[#7B8390] whitespace-nowrap">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#929AA5] mt-1 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account / Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 pl-2 rounded-lg bg-[#16191F] hover:bg-[#1C2027] border border-[#22262C] hover:border-[#2D333D] transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-[#20252E] border border-[#2D333D] flex items-center justify-center text-[10px] font-bold text-[#D2D6DC]">
              {user?.fullName ? user.fullName[0] : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-medium text-[#F1F3F5] leading-none max-w-[100px] truncate">
                {user?.fullName || 'Guest User'}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-[#7B8390]" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#14171B] border border-[#282D35] shadow-2xl p-2 z-50">
              <div className="p-2 border-b border-[#22262C] mb-1">
                <div className="text-xs font-medium text-[#F1F3F5]">{user?.fullName}</div>
                <div className="text-[11px] text-[#929AA5] truncate">{user?.email}</div>
                <div className="mt-1 text-[10px] font-mono text-[#D2D6DC] bg-[#1A1E24] px-1.5 py-0.5 rounded inline-block border border-[#282E37]">
                  {user?.role}
                </div>
              </div>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-[#929AA5] hover:text-[#F1F3F5] hover:bg-[#1A1E24] transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Switch Credentials / Login</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  setUserMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
