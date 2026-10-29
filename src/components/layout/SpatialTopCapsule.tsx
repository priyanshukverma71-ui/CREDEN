import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePortal } from '../../context/PortalContext';
import { UserRole } from '../../types';
import {
  ChevronLeft,
  ChevronRight,
  Lock,
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
  RotateCw,
  Share2,
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
    <header className="fixed top-3 inset-x-0 z-40 px-4 pointer-events-none flex justify-center">
      <div className="pointer-events-auto flex items-center justify-between gap-3 w-full max-w-7xl px-4 py-2 rounded-full liquid-glass-pill transition-all">
        {/* Left: VisionOS Style Navigation Pill (< >) & Brand */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/10 rounded-full p-0.5 border border-white/15">
            <button
              onClick={() => setActiveModule('overview')}
              disabled={activeModule === 'overview'}
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
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
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Enter Spatial Workspace"
              aria-label="Forward to Workspace"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-white/20 hidden sm:block" />

          {/* CREDEN Wordmark */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-white drop-shadow-sm">
              CREDEN
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/15 text-white/90 border border-white/20 hidden sm:inline">
              AICTE
            </span>
          </div>
        </div>

        {/* Center: VisionOS Verified Address Capsule (Exact Match to Reference Image) */}
        <div className="hidden md:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/40 border border-white/15 text-xs font-mono text-white/80 shadow-inner max-w-md w-full justify-center">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-white/60 truncate">https://creden.aicte-india.org/</span>
          <span className="text-white font-medium truncate capitalize">
            {activeModule}
          </span>
          <button
            onClick={() => window.location.reload()}
            className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white ml-auto transition-colors"
            title="Reload Environment"
          >
            <RotateCw className="w-3 h-3" />
          </button>
        </div>

        {/* Right Controls: Search, Persona, Notifications, Profile */}
        <div className="flex items-center gap-2">
          {/* Quick Search Trigger */}
          <button
            onClick={onSearchClick}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white/80 hover:text-white transition-all shadow-sm"
            title="Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <kbd className="hidden lg:inline-block px-1.5 py-0.2 text-[9px] font-mono bg-black/30 text-white/70 rounded-md border border-white/10">
              Ctrl+K
            </kbd>
          </button>

          {/* Persona Dropdown */}
          <div className="relative" ref={roleMenuRef}>
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white transition-all shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline font-medium text-xs max-w-[120px] truncate">
                {user ? user.role.replace(/_/g, ' ') : 'AICTE Admin'}
              </span>
              <ChevronDown className="w-3 h-3 text-white/60" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-3xl liquid-glass-panel p-2 z-50 animate-in fade-in zoom-in-95 duration-150 shadow-2xl">
                <div className="px-3 py-1.5 border-b border-white/10 mb-1">
                  <div className="text-xs font-semibold text-white">Evaluation Role</div>
                  <div className="text-[10px] text-white/60">Instant role-scoped access</div>
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
                            ? 'bg-white text-black font-semibold shadow-md'
                            : 'text-white/80 hover:text-white hover:bg-white/15'
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
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white transition-all relative"
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
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                  <span className="text-xs font-semibold text-white">System Notifications</span>
                  <span className="text-[10px] text-white/60 font-mono">Live</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-white/60 py-4 text-center">No new notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                        <div className="font-medium text-white">{n.title}</div>
                        <div className="text-[11px] text-white/70 mt-0.5">{n.message}</div>
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
              className="p-2 rounded-full bg-white/10 hover:bg-red-500/30 border border-white/15 text-white/80 hover:text-red-300 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-white/90 text-black font-semibold text-xs transition-all shadow-md"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
