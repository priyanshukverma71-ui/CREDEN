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
  ChevronDown,
  Building2,
  Users,
  FileCheck,
  Scale,
  Search,
} from 'lucide-react';

interface LoginPageProps {
  onSuccess?: () => void;
  onContinueAsGuest?: () => void;
}

interface DemoRoleOption {
  role: UserRole;
  label: string;
  scope: string;
  institutionCode?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onContinueAsGuest }) => {
  const { login, switchDemoRole } = useAuth();

  // Authentication mode: 'SIGN_IN' | 'RECOVERY'
  const [authMode, setAuthMode] = useState<'SIGN_IN' | 'RECOVERY'>('SIGN_IN');

  // Sign-in form state (empty by default as required)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password recovery state
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState<string | null>(null);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  // Demo access state
  const demoRoles: DemoRoleOption[] = [
    {
      role: 'AICTE_ADMIN',
      label: 'AICTE Administrator',
      scope: 'National regulatory oversight and policy enforcement',
    },
    {
      role: 'INSTITUTION_ADMIN',
      label: 'Institution Administrator',
      scope: 'Approved intake management and student data submissions',
      institutionCode: '1-10928371',
    },
    {
      role: 'DATA_ENTRY_OPERATOR',
      label: 'Data Entry Operator',
      scope: 'Batch CSV ingestion, record validation, and error correction',
      institutionCode: '1-10928371',
    },
    {
      role: 'VERIFICATION_OFFICER',
      label: 'Verification Officer',
      scope: 'Duplicate investigation and intake discrepancy review',
    },
    {
      role: 'AUDITOR',
      label: 'Auditor',
      scope: 'Cryptographic SHA-256 audit trail and tamper log inspection',
    },
    {
      role: 'EXTERNAL_VERIFIER',
      label: 'Authorised Verifier',
      scope: 'Zero-knowledge minimal disclosure record checking',
    },
  ];

  const [selectedDemoRole, setSelectedDemoRole] = useState<UserRole>('AICTE_ADMIN');
  const [demoLoading, setDemoLoading] = useState(false);

  // Submit standard institutional login
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both your institutional email and account password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
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

  // Execute demo role access
  const handleEnterDemoRole = async () => {
    const target = demoRoles.find((r) => r.role === selectedDemoRole);
    if (!target) return;

    setDemoLoading(true);
    setErrorMessage(null);

    try {
      await switchDemoRole(target.role, target.institutionCode);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(`Demo access error: ${err.message}`);
    } finally {
      setDemoLoading(false);
    }
  };

  const selectedRoleMeta = demoRoles.find((r) => r.role === selectedDemoRole) || demoRoles[0];

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#0B0C0E] text-[#F1F2F4] select-none font-sans">
      {/* Top Header */}
      <header className="w-full border-b border-[#30343A] bg-[#0B0C0E]">
        <div className="max-w-[1140px] w-full mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          {/* Left: Emblem, Brand & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#141619] border border-[#30343A] flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-[#D9DCE1]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-mono tracking-wider text-[#F1F2F4]">
                  CREDEN
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141619] text-[#9BA1AA] border border-[#30343A]">
                  Institutional Portal
                </span>
              </div>
              <p className="text-xs text-[#9BA1AA] tracking-tight">
                Academic Data Management & Verification
              </p>
            </div>
          </div>

          {/* Right: Public Verification secondary link */}
          {onContinueAsGuest && (
            <button
              onClick={onContinueAsGuest}
              className="text-xs text-[#9BA1AA] hover:text-[#F1F2F4] flex items-center gap-1.5 transition-colors duration-150 py-1 px-2 rounded-md hover:bg-[#141619]"
            >
              <span>Public Verification</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-[1140px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SECTION — SIGN IN (approx 60% / 7 cols) */}
          <div className="lg:col-span-7 bg-[#141619] border border-[#30343A] rounded-xl p-6 sm:p-8 shadow-sm">
            {authMode === 'SIGN_IN' ? (
              <div>
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-2xl font-semibold text-[#F1F2F4] tracking-tight">
                    Sign in to CREDEN
                  </h1>
                  <p className="text-sm text-[#9BA1AA] mt-1">
                    Access your institution’s academic records and verification services.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSignIn} className="space-y-4">
                  {/* Field: Institutional email or officer ID */}
                  <div>
                    <label
                      htmlFor="institutional-email"
                      className="block text-xs font-medium text-[#F1F2F4] mb-1.5"
                    >
                      Institutional email or officer ID
                    </label>
                    <input
                      id="institutional-email"
                      type="text"
                      autoComplete="username"
                      required
                      placeholder="name@institution.ac.in or officer ID"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg bg-[#0B0C0E] border border-[#30343A] text-sm text-[#F1F2F4] placeholder:text-[#5F6672] focus:outline-none focus:border-[#D9DCE1] transition-colors duration-150"
                    />
                  </div>

                  {/* Field: Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="account-password"
                        className="text-xs font-medium text-[#F1F2F4]"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('RECOVERY');
                          setErrorMessage(null);
                        }}
                        className="text-xs text-[#9BA1AA] hover:text-[#F1F2F4] transition-colors duration-150"
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
                        className="w-full h-11 pl-3.5 pr-10 rounded-lg bg-[#0B0C0E] border border-[#30343A] text-sm text-[#F1F2F4] placeholder:text-[#5F6672] focus:outline-none focus:border-[#D9DCE1] transition-colors duration-150"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9BA1AA] hover:text-[#F1F2F4] p-1 transition-colors duration-150"
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
                        className="mt-0.5 w-4 h-4 rounded bg-[#0B0C0E] border-[#30343A] text-[#D9DCE1] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#D9DCE1]"
                      />
                      <div className="text-xs leading-normal">
                        <span className="text-[#F1F2F4] font-medium">Keep me signed in</span>
                        <p className="text-[11px] text-[#9BA1AA] mt-0.5">
                          Maintains an 8-hour authorised session on this trusted institutional device.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 rounded-lg bg-[#D9DCE1] hover:bg-white text-[#0B0C0E] text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-150 shadow-sm disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-[#0B0C0E] border-t-transparent rounded-full animate-spin" />
                          <span>Signing in...</span>
                        </span>
                      ) : (
                        <span>Sign in</span>
                      )}
                    </button>
                  </div>

                  {/* Security Note */}
                  <p className="text-[11px] text-[#9BA1AA] text-center pt-2 leading-relaxed">
                    Access is restricted to authorised institutional and regulatory personnel.
                  </p>
                </form>
              </div>
            ) : (
              /* RECOVERY WORKFLOW */
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-semibold text-[#F1F2F4] tracking-tight">
                    Reset your password
                  </h1>
                  <p className="text-sm text-[#9BA1AA] mt-1">
                    Enter your registered institutional email to receive verification and reset instructions.
                  </p>
                </div>

                {recoverySuccess && (
                  <div className="mb-5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                    <span>{recoverySuccess}</span>
                  </div>
                )}

                {recoveryError && (
                  <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                    <span>{recoveryError}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordRecovery} className="space-y-4">
                  <div>
                    <label
                      htmlFor="recovery-email"
                      className="block text-xs font-medium text-[#F1F2F4] mb-1.5"
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
                      className="w-full h-11 px-3.5 rounded-lg bg-[#0B0C0E] border border-[#30343A] text-sm text-[#F1F2F4] placeholder:text-[#5F6672] focus:outline-none focus:border-[#D9DCE1] transition-colors duration-150"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={recoveryLoading}
                      className="w-full sm:flex-1 h-11 rounded-lg bg-[#D9DCE1] hover:bg-white text-[#0B0C0E] text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-150 disabled:opacity-50"
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
                      className="w-full sm:w-auto px-4 h-11 rounded-lg border border-[#30343A] text-[#F1F2F4] text-xs font-medium hover:bg-[#1C1F24] transition-colors duration-150"
                    >
                      Back to sign in
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* RIGHT SECTION — OPTIONAL DEMO ACCESS (approx 40% / 5 cols) */}
          <div className="lg:col-span-5 bg-[#141619] border border-[#30343A] rounded-xl p-6 sm:p-7 flex flex-col justify-between shadow-sm">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#30343A] mb-4">
                <span className="text-sm font-semibold text-[#F1F2F4]">
                  Demo access
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#1C1F24] text-[#9BA1AA] border border-[#30343A]">
                  Demo environment
                </span>
              </div>

              <p className="text-xs text-[#9BA1AA] leading-relaxed mb-4">
                Select an institutional persona to evaluate role-scoped workflows, compliance monitoring, and verification claims. Entering a demo role does not authenticate a live official account.
              </p>

              {/* Compact Role Selector */}
              <div className="space-y-1.5 mb-5">
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#9BA1AA] font-mono">
                  Select Evaluation Role
                </label>
                <div className="relative">
                  <select
                    value={selectedDemoRole}
                    onChange={(e) => setSelectedDemoRole(e.target.value as UserRole)}
                    className="w-full h-11 px-3.5 pr-8 rounded-lg bg-[#0B0C0E] border border-[#30343A] text-xs font-medium text-[#F1F2F4] focus:outline-none focus:border-[#D9DCE1] transition-colors duration-150 appearance-none cursor-pointer"
                  >
                    {demoRoles.map((r) => (
                      <option key={r.role} value={r.role} className="bg-[#141619] text-[#F1F2F4]">
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#9BA1AA] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Role Scope Description */}
              <div className="p-3 rounded-lg bg-[#0B0C0E] border border-[#30343A] mb-5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#9BA1AA] mb-0.5">
                  Authorised Scope
                </div>
                <div className="text-xs text-[#F1F2F4] leading-snug">
                  {selectedRoleMeta.scope}
                </div>
              </div>
            </div>

            {/* Explicit Action Button */}
            <div>
              <button
                type="button"
                onClick={handleEnterDemoRole}
                disabled={demoLoading}
                className="w-full h-11 rounded-lg bg-[#1C1F24] hover:bg-[#252A32] text-[#F1F2F4] border border-[#30343A] hover:border-[#D9DCE1] text-xs font-semibold flex items-center justify-center gap-2 transition-colors duration-150 disabled:opacity-50"
              >
                {demoLoading ? (
                  <span>Preparing workspace...</span>
                ) : (
                  <>
                    <span>Enter as {selectedRoleMeta.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#9BA1AA]" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Security Footer */}
      <footer className="w-full border-t border-[#30343A] bg-[#0B0C0E]">
        <div className="max-w-[1140px] w-full mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#9BA1AA]">
          <p>© CREDEN Academic Data Management & Verification Portal</p>
          <p className="text-[11px]">
            Restricted access • Authorised educational institutions and regulatory officers only
          </p>
        </div>
      </footer>
    </div>
  );
};
