import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  Building,
  Layers,
  UserCheck,
  SlidersHorizontal,
  CheckCircle2,
  GraduationCap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  KeyRound,
  RotateCcw,
} from 'lucide-react';

interface LoginPageProps {
  onSuccess?: () => void;
  onContinueAsGuest?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onContinueAsGuest }) => {
  const { login, switchDemoRole } = useAuth();

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'RECOVERY'>('LOGIN');
  const [email, setEmail] = useState('aicte.admin@aicte-india.org');
  const [password, setPassword] = useState('CredenSecure#2024');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Recovery state
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const demoAccounts = [
    {
      role: 'AICTE_ADMIN' as UserRole,
      title: 'AICTE Administrator',
      subtitle: 'Dr. Rajiv V. (National Oversight)',
      email: 'aicte.admin@aicte-india.org',
      icon: ShieldCheck,
    },
    {
      role: 'INSTITUTION_ADMIN' as UserRole,
      title: 'Institution Admin (DTU)',
      subtitle: 'Prof. S. K. Raman (Dean Academic)',
      email: 'admin@dtu.ac.in',
      icon: Building,
    },
    {
      role: 'DATA_ENTRY_OPERATOR' as UserRole,
      title: 'Data Entry Operator',
      subtitle: 'Meera Joshi (DTU Academic Officer)',
      email: 'operator@dtu.ac.in',
      icon: Layers,
    },
    {
      role: 'VERIFICATION_OFFICER' as UserRole,
      title: 'Verification Officer',
      subtitle: 'S. Chandrasekhar (AICTE Verification Bureau)',
      email: 'officer@aicte.gov.in',
      icon: UserCheck,
    },
    {
      role: 'AUDITOR' as UserRole,
      title: 'National Auditor (CAG)',
      subtitle: 'R. K. Mukherjee (Academic Audit)',
      email: 'auditor@cag.gov.in',
      icon: SlidersHorizontal,
    },
    {
      role: 'EXTERNAL_VERIFIER' as UserRole,
      title: 'Authorized Verifier',
      subtitle: 'Vikramaditya Roy (TCS Background Screening)',
      email: 'hr@tcs.com',
      icon: CheckCircle2,
    },
    {
      role: 'STUDENT' as UserRole,
      title: 'Student Profile',
      subtitle: 'Aarav Sharma (B.Tech CSE DTU)',
      email: 'student@aicte.gov.in',
      icon: GraduationCap,
    },
  ];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
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
        setErrorMessage(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to connect to authentication bureau.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (account: typeof demoAccounts[0]) => {
    setEmail(account.email);
    setPassword('CredenSecure#2024');
    setLoading(true);
    setErrorMessage(null);

    try {
      await switchDemoRole(account.role);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage('Failed to sign in demo account: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryMessage(null);
    setRecoveryLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail.trim() }),
      });

      const data = await res.json();
      setRecoveryMessage(data.message || 'Recovery instructions dispatched.');
    } catch (err: any) {
      setRecoveryMessage('Service unavailable. Try again later.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-8 bg-[#08090B] text-[#F1F3F5] overflow-y-auto selection:bg-platinum selection:text-midnight">
      {/* Background ambient radial gradients matching the visual identity */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-b from-graphite/30 via-obsidian/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-obsidian/40 to-transparent blur-2xl" />
      </div>

      {/* Top Header Branding */}
      <header className="relative z-10 flex items-center justify-between max-w-6xl w-full mx-auto pb-6 border-b border-glass-border">
        <div className="flex items-center gap-3.5">
          <img
            src="/emblem.svg"
            alt="National Emblem of India"
            className="w-10 h-12 object-contain drop-shadow-[0_0_12px_rgba(212,215,220,0.3)]"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-mono platinum-gradient-text tracking-wider">
                CREDEN
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-graphite border border-glass-border text-platinum">
                AICTE Official
              </span>
            </div>
            <p className="text-xs text-liquid-silver tracking-tight">
              APAAR Based Student Data Management & Verification Portal
            </p>
          </div>
        </div>

        {onContinueAsGuest && (
          <button
            onClick={onContinueAsGuest}
            className="text-xs text-liquid-silver hover:text-platinum flex items-center gap-1.5 transition-colors"
          >
            <span>Explore as Public Verifier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </header>

      {/* Center Authentication Console */}
      <main className="relative z-10 max-w-5xl w-full mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Sign-in / Recovery Box (7 cols) */}
        <div className="lg:col-span-7 glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-glass-border-bright shadow-glass-panel relative">
          {/* Tabs */}
          <div className="flex items-center justify-between pb-4 border-b border-glass-border mb-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('LOGIN');
                  setErrorMessage(null);
                }}
                className={`text-xs font-semibold uppercase tracking-wider pb-1 transition-colors relative ${
                  activeTab === 'LOGIN'
                    ? 'text-highlight-silver'
                    : 'text-liquid-silver hover:text-highlight-silver'
                }`}
              >
                Institutional Sign In
                {activeTab === 'LOGIN' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-platinum" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('RECOVERY');
                  setErrorMessage(null);
                }}
                className={`text-xs font-semibold uppercase tracking-wider pb-1 transition-colors relative ${
                  activeTab === 'RECOVERY'
                    ? 'text-highlight-silver'
                    : 'text-liquid-silver hover:text-highlight-silver'
                }`}
              >
                Credential Recovery
                {activeTab === 'RECOVERY' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-platinum" />
                )}
              </button>
            </div>

            <span className="text-[10px] text-liquid-silver font-mono">
              AICTE-AUTH-V2.1
            </span>
          </div>

          {/* Form 1: LOGIN */}
          {activeTab === 'LOGIN' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-glass-border flex items-start gap-2.5 text-xs text-highlight-silver animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-platinum flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="text-xs text-liquid-silver block mb-1.5 font-medium">
                  Registered Institutional Email / Officer ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-liquid-silver absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. aicte.admin@aicte-india.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-obsidian border border-glass-border text-highlight-silver placeholder:text-liquid-silver/50 focus:border-platinum outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-liquid-silver font-medium">
                    Account Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('RECOVERY')}
                    className="text-[11px] text-liquid-silver hover:text-platinum hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-liquid-silver absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-obsidian border border-glass-border text-highlight-silver placeholder:text-liquid-silver/50 focus:border-platinum outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-liquid-silver hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-liquid-silver pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-3.5 h-3.5 rounded bg-obsidian border-glass-border accent-platinum"
                  />
                  <span>Maintain 8-hour authorized session</span>
                </label>
                <span className="font-mono text-[10px]">TLS 1.3 / AES-256</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-platinum hover:bg-white text-midnight font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-platinum-glow disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <span>Authenticating Credentials...</span>
                ) : (
                  <>
                    <span>Sign In to Academic Governance Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Form 2: RECOVERY */}
          {activeTab === 'RECOVERY' && (
            <form onSubmit={handleRecoverySubmit} className="space-y-4">
              <p className="text-xs text-liquid-silver leading-relaxed">
                Enter your institutional email registered with the All India Council for Technical Education. A secure recovery OTP and cryptographic identity link will be dispatched.
              </p>

              {recoveryMessage && (
                <div className="p-3.5 rounded-xl bg-platinum/10 border border-platinum/30 text-xs text-highlight-silver">
                  {recoveryMessage}
                </div>
              )}

              <div>
                <label className="text-xs text-liquid-silver block mb-1.5 font-medium">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-liquid-silver absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. dean@dtu.ac.in"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-obsidian border border-glass-border text-highlight-silver placeholder:text-liquid-silver/50 focus:border-platinum outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('LOGIN')}
                  className="text-xs text-liquid-silver hover:text-white"
                >
                  Return to Sign In
                </button>
                <button
                  type="submit"
                  disabled={recoveryLoading || !recoveryEmail.trim()}
                  className="px-5 py-2.5 rounded-xl bg-platinum hover:bg-white text-midnight font-bold text-xs transition-colors disabled:opacity-40"
                >
                  {recoveryLoading ? 'Dispatching...' : 'Dispatch Recovery Token'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Pre-Configured Personas for Evaluators (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-glass-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-glass-border">
            <span className="text-xs font-semibold text-highlight-silver uppercase tracking-wider font-mono">
              Evaluator 1-Click Personas
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-graphite text-platinum font-mono">
              SIH Testing
            </span>
          </div>

          <p className="text-xs text-liquid-silver">
            Click any authenticated role below to test institution-scoped permissions, audit access, or intake compliance:
          </p>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {demoAccounts.map((account) => {
              const Icon = account.icon;
              return (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => handleQuickLogin(account)}
                  className="w-full text-left p-2.5 rounded-xl bg-obsidian hover:bg-graphite/60 border border-glass-border hover:border-platinum transition-all group flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-graphite flex items-center justify-center flex-shrink-0 border border-glass-border group-hover:border-platinum transition-colors">
                    <Icon className="w-4 h-4 text-platinum" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-highlight-silver group-hover:text-white flex items-center justify-between">
                      <span className="truncate">{account.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-liquid-silver group-hover:text-platinum group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </div>
                    <div className="text-[11px] text-liquid-silver truncate mt-0.5">
                      {account.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-glass-border text-[10px] text-liquid-silver text-center">
            Default development password for all roles: <code className="font-mono text-platinum">CredenSecure#2024</code>
          </div>
        </div>
      </main>

      {/* Security Footer */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto pt-6 border-t border-glass-border text-center space-y-1 text-[11px] text-liquid-silver">
        <p>
          Official AICTE Academic Governance Platform • Under the Purview of the Ministry of Education, Government of India
        </p>
        <p className="text-[10px] opacity-70">
          Compliant with Digital Personal Data Protection (DPDP) Act 2023 • All actions immutably logged with SHA-256 integrity hash
        </p>
      </footer>
    </div>
  );
};
