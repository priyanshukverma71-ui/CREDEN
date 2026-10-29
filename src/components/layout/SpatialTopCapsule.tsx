import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePortal } from '../../context/PortalContext';
import { UserRole } from '../../types';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  ShieldCheck,
  Building,
  Layers,
  UserCheck,
  CheckCircle2,
  Eye,
  GraduationCap,
  LogOut,
  ChevronDown,
} from 'lucide-react';

interface SpatialTopCapsuleProps {
  onSearchClick: () => void;
  onOpenLogin: () => void;
}

export const SpatialTopCapsule: React.FC<SpatialTopCapsuleProps> = ({
  onSearchClick,
  onOpenLogin,
}) => {
  const { user, switchDemoRole, logout } = useAuth();
  const {
    activeModule,
    setActiveModule,
    unreadNotificationCount,
    notifications,
    markNotificationsAsRead,
  } = usePortal();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const roleMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setNotifMenuOpen(false);
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

  return (
    <header className="fixed top-3 inset-x-0 z-40 px-4 pointer-events-none flex justify-center select-none">
      <div className="pointer-events-auto flex items-center justify-between gap-3 w-full max-w-7xl px-4 py-2 rounded-full liquid-glass-pill transition-all">
        {/* Left: Navigation Pill (< >) & Brand in Light Glass */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100/90 rounded-full p-0.5 border border-slate-200">
            <button
              onClick={() => setActiveModule('overview')}
              disabled={activeModule === 'overview'}
              className="p-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Return to 3D Space (Esc)"
              aria-label="Back to 3D Space"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (activeModule === 'overview') setActiveModule('institutions');
              }}
              disabled={activeModule !== 'overview'}
              className="p-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Enter Spatial Workspace"
              aria-label="Forward to Workspace"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

          {/* CREDEN Wordmark */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-slate-950">
              CREDEN
            </span>
          </div>
        </div>

        {/* Right Controls: Search, Persona, Notifications, Profile */}
        <div className="flex items-center gap-2">
          {/* TrustGraph 1-Click Launch Pill */}
          <button
            onClick={() => setActiveModule('trustgraph')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${
              activeModule === 'trustgraph'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-white/90 hover:bg-cyan-50 text-slate-800 hover:text-cyan-900 border border-slate-200 hover:border-cyan-300'
            }`}
            title="Open CREDEN TrustGraph"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="hidden sm:inline font-mono">TrustGraph</span>
          </button>

          {/* Quick Search Trigger */}
          <button
            onClick={onSearchClick}
            className="p-2 rounded-full bg-slate-100/90 hover:bg-white border border-slate-200 text-slate-700 hover:text-slate-950 transition-all shadow-sm"
            title="Search"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Persona Dropdown */}
          <div className="relative" ref={roleMenuRef}>
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 hover:bg-white border border-slate-200 text-xs text-slate-900 transition-all shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline font-semibold text-xs max-w-[120px] truncate">
                {user ? user.role.replace(/_/g, ' ') : 'AICTE Admin'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-3xl liquid-glass-panel p-2 z-50 animate-in fade-in zoom-in-95 duration-150 shadow-2xl">
                <div className="px-3 py-1.5 border-b border-slate-200 mb-1">
                  <div className="text-xs font-semibold text-slate-900">Switch Role</div>
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto">
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
                        className={`w-full text-left px-3 py-2 rounded-2xl text-xs flex items-center gap-2.5 transition-colors ${
                          isCurrent
                            ? 'bg-slate-900 text-white font-semibold shadow-md'
                            : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                        <div className="truncate">
                          <div>{r.title}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => {
                setNotifMenuOpen(!notifMenuOpen);
                if (!notifMenuOpen) markNotificationsAsRead();
              }}
              className="p-2 rounded-full bg-slate-100/90 hover:bg-white border border-slate-200 text-slate-700 hover:text-slate-950 transition-all relative"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shadow-md">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {notifMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-3xl liquid-glass-panel p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 shadow-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                  <span className="text-xs font-semibold text-slate-900">Notifications</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">No new notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-2 rounded-xl bg-white/80 border border-slate-200/80 text-xs shadow-xs">
                        <div className="font-semibold text-slate-900">{n.title}</div>
                        <div className="text-[11px] text-slate-600 mt-0.5">{n.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Sign In / Profile */}
          {user ? (
            <button
              onClick={logout}
              className="p-2 rounded-full bg-slate-100/90 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-black text-white font-semibold text-xs transition-all shadow-md"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
