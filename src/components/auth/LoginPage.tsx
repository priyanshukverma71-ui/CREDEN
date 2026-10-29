import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  Copy,
  Check,
  Building2,
  Users,
  FileCheck,
  Scale,
  Search,
  Sparkles,
  GraduationCap,
} from 'lucide-react';

interface LoginPageProps {
  onSuccess?: () => void;
  onContinueAsGuest?: () => void;
}

interface DemoRoleOption {
  role: UserRole;
  label: string;
  email: string;
  password: string;
  scope: string;
  icon: React.ComponentType<{ className?: string }>;
  institutionCode?: string;
  badge: string;
}

const DEMO_PASSWORD = 'CredenSecure#2024';

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onContinueAsGuest }) => {
  const { login, switchDemoRole } = useAuth();

  // Authentication mode: 'SIGN_IN' | 'RECOVERY'
  const [authMode, setAuthMode] = useState<'SIGN_IN' | 'RECOVERY'>('SIGN_IN');

  // Sign-in form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Password recovery state
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState<string | null>(null);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  // Demo access personas with verified credentials
  const demoRoles: DemoRoleOption[] = [
    {
      role: 'AICTE_ADMIN',
      label: 'AICTE Administrator',
      email: 'aicte.admin@aicte-india.org',
      password: DEMO_PASSWORD,
      scope: 'National regulatory oversight, TrustGraph intelligence & sanctions',
      badge: 'National Director',
      icon: Shield,
    },
    {
      role: 'INSTITUTION_ADMIN',
      label: 'Institution Administrator',
      email: 'admin@dtu.ac.in',
      password: DEMO_PASSWORD,
      scope: 'DTU intake capacity management, admissions and roster oversight',
      badge: 'DTU Dean Academic',
      institutionCode: '1-10928371',
      icon: Building2,
    },
    {
      role: 'DATA_ENTRY_OPERATOR',
      label: 'Data Entry Operator',
      email: 'operator@dtu.ac.in',
      password: DEMO_PASSWORD,
      scope: 'Batch CSV ingestion, Verhoeff checksum validation & error remediation',
      badge: 'DTU Academic Officer',
      institutionCode: '1-10928371',
      icon: FileCheck,
    },
    {
      role: 'VERIFICATION_OFFICER',
      label: 'Verification Officer',
      email: 'officer@aicte.gov.in',
      password: DEMO_PASSWORD,
      scope: 'TrustGraph duplicate conflict adjudication & hearing decisions',
      badge: 'Verification Bureau',
      icon: Scale,
    },
    {
      role: 'AUDITOR',
      label: 'Auditor (CAG)',
      email: 'auditor@cag.gov.in',
      password: DEMO_PASSWORD,
      scope: 'Tamper-evident SHA-256 cryptographic security ledger & audit chain',
      badge: 'CAG Academic Audit',
      icon: Lock,
    },
    {
      role: 'EXTERNAL_VERIFIER',
      label: 'Authorised Verifier',
      email: 'hr@tcs.com',
      password: DEMO_PASSWORD,
      scope: 'Zero-knowledge minimal disclosure record & QR attestation checking',
      badge: 'TCS Background Screening',
      icon: Search,
    },
    {
      role: 'STUDENT',
      label: 'Student Enrollee',
      email: 'student@aicte.gov.in',
      password: DEMO_PASSWORD,
      scope: 'Student credential vault, APAAR profile & official QR certificate',
      badge: 'Verified Student',
      icon: GraduationCap,
    },
  ];

  // Submit standard institutional login
  const handleSignIn = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const loginEmail = customEmail !== undefined ? customEmail : email;
    const loginPassword = customPassword !== undefined ? customPassword : password;

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMessage('Please provide both your institutional email and account password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        login(data.token, data.user);
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(data.error || 'Invalid institutional credentials. Please verify and try again.');
      }
    } catch (err: any) {
      setErrorMessage('Authentication service temporarily unreachable. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Quick-fill credentials into form
  const handleAutoFill = (roleItem: DemoRoleOption, autoSubmit = false) => {
    setEmail(roleItem.email);
    setPassword(roleItem.password);
    setErrorMessage(null);

    if (autoSubmit) {
      handleSignIn(undefined, roleItem.email, roleItem.password);
    }
  };

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Submit password recovery
  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError(null);
    setRecoverySuccess(null);

    if (!recoveryEmail.trim()) {
      setRecoveryError('Please enter your registered institutional email address.');
      return;
    }

    setRecoveryLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setRecoverySuccess(
          data.message || 'If an account exists for this address, password reset instructions have been dispatched.'
        );
      } else {
        setRecoveryError(data.error || 'Unable to process recovery request.');
      }
    } catch (err: any) {
      setRecoveryError('Recovery service unavailable. Please contact institutional support.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between spatial-ambient-bg text-[#0F172A] select-none font-sans">
      {/* Top Header */}
      <header className="w-full border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
        <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Left: Emblem, Brand & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-white/50 flex items-center justify-center flex-shrink-0 shadow-sm text-white">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-mono tracking-wider text-slate-950">
                  CREDEN
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Institutional Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 tracking-tight">
                Academic Data Management & APAAR TrustGraph Verification
              </p>
            </div>
          </div>

          {/* Right: Public Verification link */}
          {onContinueAsGuest && (
            <button
              onClick={onContinueAsGuest}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors duration-150 py-1.5 px-3 rounded-full bg-white/80 hover:bg-white border border-slate-200 shadow-xs"
            >
              <span>Public Verification</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-[1240px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SECTION — SIGN IN (5 cols) */}
          <div className="lg:col-span-5 liquid-glass-window rounded-3xl p-6 sm:p-8">
            {authMode === 'SIGN_IN' ? (
              <div>
                {/* Header */}
                <div className="mb-5">
                  <h1 className="text-2xl font-bold text-slate-950 tracking-tight">
                    Sign in to CREDEN
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Enter institutional credentials or pick any role from the demo credentials panel.
                  </p>
                </div>

                {/* Quick Hint Pill */}
                <div className="mb-5 p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 text-blue-900 text-xs flex items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-2 truncate">
                    <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="truncate">Demo Password: <strong className="font-mono text-slate-900 font-semibold">{DEMO_PASSWORD}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(DEMO_PASSWORD, 'pwd')}
                    className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-100/70 transition-colors"
                    title="Copy demo password"
                  >
                    {copiedKey === 'pwd' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 shadow-xs"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={(e) => handleSignIn(e)} className="space-y-4">
                  {/* Field: Email */}
                  <div>
                    <label
                      htmlFor="institutional-email"
                      className="block text-xs font-semibold text-slate-800 mb-1.5"
                    >
                      Institutional Email / User ID
                    </label>
                    <div className="relative">
                      <input
                        id="institutional-email"
                        type="text"
                        autoComplete="username"
                        required
                        placeholder="e.g. aicte.admin@aicte-india.org"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-white/90 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Field: Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="account-password"
                        className="text-xs font-semibold text-slate-800"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('RECOVERY');
                          setErrorMessage(null);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors duration-150"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="account-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-11 pl-10 pr-10 rounded-xl bg-white/90 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 transition-colors duration-150"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Session Persistence Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={keepSignedIn}
                        onChange={(e) => setKeepSignedIn(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded bg-white border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                      />
                      <div className="text-xs leading-normal">
                        <span className="text-slate-800 font-semibold">Keep me signed in</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Maintains an 8-hour authorised session on this institutional device.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 shadow-md disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Signing in...</span>
                        </span>
                      ) : (
                        <span>Sign in</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* RECOVERY WORKFLOW */
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-slate-950 tracking-tight">
                    Reset your password
                  </h1>
                  <p className="text-sm text-slate-600 mt-1">
                    Enter your registered institutional email to receive verification and reset instructions.
                  </p>
                </div>

                {recoverySuccess && (
                  <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
                    <span>{recoverySuccess}</span>
                  </div>
                )}

                {recoveryError && (
                  <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 shadow-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                    <span>{recoveryError}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordRecovery} className="space-y-4">
                  <div>
                    <label
                      htmlFor="recovery-email"
                      className="block text-xs font-semibold text-slate-800 mb-1.5"
                    >
                      Registered institutional email
                    </label>
                    <input
                      id="recovery-email"
                      type="email"
                      required
                      placeholder="e.g. administrator@institution.ac.in"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-white/90 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={recoveryLoading}
                      className="w-full sm:flex-1 h-11 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 shadow-md disabled:opacity-50"
                    >
                      {recoveryLoading ? 'Sending...' : 'Send reset instructions'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('SIGN_IN');
                        setRecoveryError(null);
                        setRecoverySuccess(null);
                      }}
                      className="w-full sm:w-auto px-4 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors duration-150"
                    >
                      Back to sign in
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* RIGHT SECTION — DEMO LOGIN IDS & PASSWORDS (7 cols) */}
          <div className="lg:col-span-7 liquid-glass-panel rounded-3xl p-6 sm:p-7">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-slate-950">
                  Demo Login IDs & Passwords
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
                  1-Click Ready
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                Password: <span className="font-semibold text-slate-800">{DEMO_PASSWORD}</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Click any persona card below to <strong>auto-fill</strong> or <strong>instantly sign in</strong> with pre-configured institutional permissions, test duplicate adjudication, and explore <strong>TrustGraph</strong>.
            </p>

            {/* Persona Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
              {demoRoles.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.role}
                    className="p-3 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/90 hover:border-blue-400 transition-all duration-150 shadow-2xs hover:shadow-xs group flex flex-col justify-between"
                  >
                    <div>
                      {/* Top row: Icon, Label, Badge */}
                      <div className="flex items-start justify-between gap-1.5 mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-600 flex items-center justify-center flex-shrink-0 transition-colors">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-slate-900 leading-tight">
                              {item.label}
                            </h3>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {item.badge}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Credentials display */}
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-1 mb-2 font-mono text-[11px]">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-slate-400 text-[10px]">ID:</span>
                          <span className="text-slate-800 font-medium truncate select-all">{item.email}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.email, item.email)}
                            className="text-slate-400 hover:text-slate-700 flex-shrink-0"
                            title="Copy email"
                          >
                            {copiedKey === item.email ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-slate-400 text-[10px]">PWD:</span>
                          <span className="text-slate-800 font-medium select-all">{item.password}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.password, `${item.email}_pwd`)}
                            className="text-slate-400 hover:text-slate-700 flex-shrink-0"
                            title="Copy password"
                          >
                            {copiedKey === `${item.email}_pwd` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>

                      {/* Scope excerpt */}
                      <p className="text-[10px] text-slate-500 line-clamp-1 mb-2 leading-relaxed">
                        {item.scope}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleAutoFill(item, false)}
                        className="flex-1 py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium transition-colors"
                      >
                        Fill Form
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAutoFill(item, true)}
                        className="flex-1 py-1 px-2 rounded-lg bg-slate-900 hover:bg-black text-white text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <span>Sign In</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Security Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white/60 backdrop-blur-md">
        <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© CREDEN Academic Data Management & APAAR TrustGraph Verification Portal</p>
          <p className="text-[11px]">
            AICTE Approved Standard • Demo environment with pre-seeded statutory scenarios
          </p>
        </div>
      </footer>
    </div>
  );
};
