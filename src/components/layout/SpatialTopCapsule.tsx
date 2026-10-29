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

  // Close menus when clicking outside
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
      <div className="pointer-events-auto flex items-center justify-between gap-3 w-full max-w-7xl px-4 py-2 rounded-2xl bg-[#13161B]/85 backdrop-blur-xl border border-[#D7DBE2]/20 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_1px_rgba(215,219,226,0.15)] transition-all">
        {/* Left: Back / Forward Spatial Navigation & Brand */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#07080A]/60 rounded-xl p-0.5 border border-[#303642]">
            <button
              onClick={() => setActiveModule('overview')}
              disabled={activeModule === 'overview'}
              className="p-1.5 rounded-lg text-[#A6AFBB] hover:text-[#F2F4F7] hover:bg-[#1E232B] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
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
              className="p-1.5 rounded-lg text-[#A6AFBB] hover:text-[#F2F4F7] hover:bg-[#1E232B] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Enter Spatial Workspace"
              aria-label="Forward to Workspace"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="h-5 w-[1px] bg-[#303642] hidden sm:block" />

          {/* CREDEN Wordmark */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-[#F2F4F7]">
              CREDEN
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1A1F27] text-[#D7DBE2] border border-[#303642] hidden sm:inline">
              AICTE
            </span>
          </div>
        </div>

        {/* Center: VisionOS-Style Verified Address Capsule */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#07080A]/80 border border-[#303642] text-xs font-mono text-[#A6AFBB] shadow-inner max-w-md w-full justify-center">
          <Lock className="w-3 h-3 text-[#D7DBE2]" />
          <span className="text-[#A6AFBB] truncate">creden.aicte-india.org</span>
          <span className="text-[#4B5563]">/</span>
          <span className="text-[#F2F4F7] font-medium truncate capitalize">
            {activeModule}
          </span>
          <span className="text-[9px] px-1 rounded bg-[#13161B] text-[#D7DBE2] border border-[#2B313C] ml-auto">
            TLS 1.3
          </span>
        </div>

        {/* Right Controls: Search, Persona, Notifications, Profile */}
        <div className="flex items-center gap-2">
          {/* Quick Search Trigger */}
          <button
            onClick={onSearchClick}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#07080A]/60 hover:bg-[#1E232B] border border-[#303642] text-xs text-[#A6AFBB] hover:text-[#F2F4F7] transition-all"
            title="Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <kbd className="hidden lg:inline-block px-1 py-0.2 text-[9px] font-mono bg-[#181C22] text-[#A6AFBB] rounded border border-[#2B313C]">
              Ctrl+K
            </kbd>
          </button>

          {/* Persona Dropdown */}
          <div className="relative" ref={roleMenuRef}>
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#07080A]/60 hover:bg-[#1E232B] border border-[#303642] text-xs text-[#F2F4F7] transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D7DBE2]" />
              <span className="hidden sm:inline font-medium text-xs max-w-[120px] truncate">
                {user ? user.role.replace(/_/g, ' ') : 'AICTE Admin'}
              </span>
              <ChevronDown className="w-3 h-3 text-[#A6AFBB]" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#13161B] border border-[#303642] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 border-b border-[#222730] mb-1">
                  <div className="text-xs font-semibold text-[#F2F4F7]">Evaluation Role</div>
                  <div className="text-[10px] text-[#A6AFBB]">Instant role-scoped access</div>
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
                        className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors ${
                          isCurrent
                            ? 'bg-[#1E232B] text-[#FFFFFF] font-semibold border border-[#D7DBE2]/30'
                            : 'text-[#A6AFBB] hover:text-[#F2F4F7] hover:bg-[#181C22]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 text-[#D7DBE2] flex-shrink-0" />
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
              className="p-1.5 rounded-xl bg-[#07080A]/60 hover:bg-[#1E232B] border border-[#303642] text-[#A6AFBB] hover:text-[#F2F4F7] transition-all relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D7DBE2] text-[#07080A] text-[9px] font-bold flex items-center justify-center">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {notifMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#13161B] border border-[#303642] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#222730] mb-2">
                  <span className="text-xs font-semibold text-[#F2F4F7]">System Notifications</span>
                  <span className="text-[10px] text-[#A6AFBB] font-mono">APH Live</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-[#A6AFBB] py-4 text-center">No new notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-2 rounded-xl bg-[#07080A]/60 border border-[#222730] text-xs">
                        <div className="font-medium text-[#F2F4F7]">{n.title}</div>
                        <div className="text-[11px] text-[#A6AFBB] mt-0.5">{n.message}</div>
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
              className="p-1.5 rounded-xl bg-[#07080A]/60 hover:bg-[#1E232B] border border-[#303642] text-[#A6AFBB] hover:text-rose-400 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3 py-1.5 rounded-xl bg-[#D7DBE2] hover:bg-white text-[#07080A] font-semibold text-xs transition-all shadow-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
