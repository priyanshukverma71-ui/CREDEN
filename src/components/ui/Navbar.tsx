import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePortal } from '../../context/PortalContext';
import { ModuleId, UserRole } from '../../types';
import {
  Bell,
  Search,
  UserCheck,
  ChevronDown,
  LogOut,
  Sparkles,
  Eye,
  SlidersHorizontal,
  Layers,
  Building,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const Navbar: React.FC<{ onSearchClick: () => void; onOpenLogin: () => void }> = ({ onSearchClick, onOpenLogin }) => {
  const { user, switchDemoRole, logout } = useAuth();
  const {
    activeModule,
    openWorkspace,
    unreadNotificationCount,
    notifications,
    markNotificationsAsRead,
    isReducedMotion,
    toggleReducedMotion,
    sihStep,
    setSihStep,
  } = usePortal();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navItems: { label: string; moduleId: ModuleId }[] = [
    { label: 'Home', moduleId: 'overview' },
    { label: 'Institutions', moduleId: 'institutions' },
    { label: 'Student Data', moduleId: 'students' },
    { label: 'APAAR', moduleId: 'apaar' },
    { label: 'Admissions', moduleId: 'admissions' },
    { label: 'Verification', moduleId: 'verification' },
    { label: 'Compliance', moduleId: 'compliance' },
    { label: 'Reports', moduleId: 'reports' },
    { label: 'Audit', moduleId: 'audit' },
    { label: 'Integration', moduleId: 'integration' },
  ];

  const roles: { role: UserRole; title: string; subtitle: string; icon: any }[] = [
    {
      role: 'AICTE_ADMIN',
      title: 'AICTE Administrator',
      subtitle: 'National oversight, policy & dispute resolution',
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
      subtitle: 'Upload CSV, correct student rows & resubmit',
      icon: Layers,
    },
    {
      role: 'VERIFICATION_OFFICER',
      title: 'Verification Officer',
      subtitle: 'Review duplicates & intake discrepancies',
      icon: UserCheck,
    },
    {
      role: 'AUDITOR',
      title: 'National Auditor (CAG)',
      subtitle: 'Inspect immutable logs & tamper evidence',
      icon: SlidersHorizontal,
    },
    {
      role: 'EXTERNAL_VERIFIER',
      title: 'Authorized Verifier (TCS)',
      subtitle: 'Check student claims with minimal disclosure',
      icon: CheckCircle2,
    },
    {
      role: 'STUDENT',
      title: 'Student (Aarav Sharma)',
      subtitle: 'View own APAAR record & digital credential QR',
      icon: GraduationCap,
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 py-3 border-b border-glass-border bg-midnight/70 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & State Emblem */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => openWorkspace('overview')}
        >
          <img
            src="/emblem.svg"
            alt="National Emblem of India"
            className="w-8 h-10 object-contain drop-shadow-[0_0_8px_rgba(212,215,220,0.3)] group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-wider platinum-gradient-text font-mono">
                CREDEN
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-graphite/80 text-liquid-silver border border-glass-border">
                AICTE
              </span>
            </div>
            <p className="text-[11px] text-liquid-silver tracking-tight">
              AICTE Student Data Portal
            </p>
          </div>
        </div>

        {/* Center Pill Nav (Matches Reference Image) */}
        <nav className="hidden lg:flex items-center bg-obsidian/80 border border-glass-border rounded-full p-1 shadow-glass-panel">
          {navItems.map((item) => {
            const isActive = activeModule === item.moduleId;
            return (
              <button
                key={item.moduleId}
                onClick={() => openWorkspace(item.moduleId)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-platinum text-midnight shadow-[0_0_15px_rgba(212,215,220,0.3)] font-semibold'
                    : 'text-liquid-silver hover:text-highlight-silver hover:bg-graphite/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Tools: Demo Role Switcher, Bell, Motion, Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setRoleMenuOpen(!roleMenuOpen);
                setNotifMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-graphite/70 hover:bg-graphite border border-glass-border text-highlight-silver transition-all"
              title="Switch role for evaluation"
            >
              <div className="w-2 h-2 rounded-full bg-platinum animate-pulse" />
              <span className="font-medium hidden sm:inline">
                {user?.role.replace('_', ' ')}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-liquid-silver" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-obsidian/95 border border-glass-border-bright backdrop-blur-2xl shadow-glass-panel p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-glass-border mb-1 text-[11px] text-liquid-silver uppercase font-semibold">
                  Switch Active Persona
                </div>
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
                      className={`w-full text-left p-2 rounded-lg flex items-start gap-2.5 transition-colors ${
                        isCurrent
                          ? 'bg-graphite/90 border border-glass-border'
                          : 'hover:bg-graphite/50'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-platinum mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-highlight-silver flex items-center gap-1.5">
                          {r.title}
                          {isCurrent && (
                            <span className="text-[10px] text-platinum font-mono">
                              (Active)
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-liquid-silver leading-tight mt-0.5">
                          {r.subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search Trigger */}
          <button
            onClick={onSearchClick}
            className="p-2 rounded-full text-liquid-silver hover:text-highlight-silver hover:bg-graphite/50 transition-colors"
            title="Search records or modules"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifMenuOpen(!notifMenuOpen);
                setRoleMenuOpen(false);
                if (unreadNotificationCount > 0) {
                  markNotificationsAsRead();
                }
              }}
              className="p-2 rounded-full text-liquid-silver hover:text-highlight-silver hover:bg-graphite/50 transition-colors relative"
              title="System Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-platinum ring-2 ring-midnight" />
              )}
            </button>

            {notifMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-obsidian/95 border border-glass-border-bright backdrop-blur-2xl shadow-glass-panel p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-glass-border mb-2">
                  <span className="text-xs font-semibold text-highlight-silver">
                    Alerts & Governance Notices
                  </span>
                  <span className="text-[10px] text-liquid-silver">
                    {notifications.length} recent
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-liquid-silver text-center py-4">
                      No new operational alerts.
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2 rounded-lg bg-graphite/40 border border-glass-border text-left hover:bg-graphite/70 transition-colors"
                      >
                        <div className="text-xs font-medium text-highlight-silver flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-platinum" />
                          {n.title}
                        </div>
                        <p className="text-[11px] text-liquid-silver mt-1 leading-snug">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Reduced Motion Toggle (Spatial vs Accessible 2D view) */}
          <button
            onClick={toggleReducedMotion}
            className={`p-2 rounded-full border border-glass-border transition-colors ${
              isReducedMotion
                ? 'bg-platinum text-midnight'
                : 'text-liquid-silver hover:text-highlight-silver hover:bg-graphite/50'
            }`}
            title={isReducedMotion ? 'Switch to 3D Spatial Environment' : 'Switch to 2D Accessible Layout'}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* User Profile / Login Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setProfileMenuOpen(!profileMenuOpen);
                  setRoleMenuOpen(false);
                  setNotifMenuOpen(false);
                }}
                className="flex items-center gap-2 p-1 pl-2.5 rounded-full bg-graphite/80 hover:bg-graphite border border-glass-border transition-all"
                title="User profile & authentication"
              >
                <span className="text-xs font-semibold text-highlight-silver max-w-[100px] truncate hidden md:inline">
                  {user.fullName.split(' ')[0]}
                </span>
                <div className="w-7 h-7 rounded-full bg-platinum text-midnight font-bold text-xs flex items-center justify-center font-mono">
                  {user.fullName.charAt(0)}
                </div>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-obsidian/95 border border-glass-border-bright backdrop-blur-2xl shadow-glass-panel p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="pb-2.5 border-b border-glass-border mb-2">
                    <div className="text-xs font-bold text-highlight-silver truncate">
                      {user.fullName}
                    </div>
                    <div className="text-[11px] text-liquid-silver font-mono truncate">
                      {user.email}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-graphite text-platinum border border-glass-border">
                        {user.role}
                      </span>
                      {user.institutionName && (
                        <span className="text-[10px] text-liquid-silver truncate">
                          {user.institutionName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onOpenLogin();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-liquid-silver hover:text-highlight-silver hover:bg-graphite/60 flex items-center gap-2 transition-colors"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-platinum" />
                      <span>Switch Account</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        logout();
                        onOpenLogin();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3 py-1.5 rounded-full bg-platinum hover:bg-white text-midnight font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
