import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  IdCard,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Cpu,
  Fingerprint,
} from 'lucide-react';

export const ApaarValidationWorkspace: React.FC = () => {
  const { token } = useAuth();
  const [testApaar, setTestApaar] = useState('9874-5612-3450');
  const [testStudentName, setTestStudentName] = useState('Aarav Sharma');
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);

  // Pre-configured test presets for judges
  const presets = [
    { label: 'Valid APAAR', apaar: '9874-5612-3450', name: 'Aarav Sharma' },
    { label: 'Repetitive Invalid', apaar: '0000-0000-0000', name: 'Kabir Verma' },
    { label: 'Name Mismatch (End 8)', apaar: '9874-5612-3458', name: 'Rohan Sharma' },
    { label: 'Not Found in Registry (End 9)', apaar: '9874-5612-3459', name: 'Unknown Student' },
  ];

  const handleRunTest = async (apaar: string, name: string) => {
    setTestLoading(true);
    setTestApaar(apaar);
    setTestStudentName(name);

    try {
      const res = await fetch('/api/integration/simulate-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ apaarId: apaar, studentName: name }),
      });

      if (res.ok) {
        const data = await res.json();
        setTestResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header explanation */}
      <div className="glass-panel rounded-2xl p-5 border border-glass-border">
        <div className="flex items-center gap-3 mb-2">
          <IdCard className="w-5 h-5 text-platinum" />
          <h4 className="text-sm font-bold text-highlight-silver">
            Automated Multi-Tier APAAR Validation Engine
          </h4>
        </div>
        <p className="text-xs text-liquid-silver leading-relaxed">
          The validation service separates deterministic structural syntax checks (Verhoeff 12-digit algorithm, non-repetitive integrity) from cross-institution concurrent duplicate scans and authorized DigiLocker / NDEAR Academic Bank of Credits (ABC) verification adapters.
        </p>
      </div>

      {/* Interactive Testing Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input & Presets */}
        <div className="glass-panel rounded-2xl p-6 border border-glass-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-glass-border">
            <span className="text-xs font-semibold text-highlight-silver uppercase tracking-wider font-mono">
              Live Validation Sandbox
            </span>
            <span className="text-[10px] text-platinum font-mono">AICTE-APAAR-VAL-2.1</span>
          </div>

          {/* Quick preset buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-liquid-silver">Preset Test Scenarios:</span>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRunTest(p.apaar, p.name)}
                  className="px-2.5 py-1 rounded-lg bg-obsidian hover:bg-graphite border border-glass-border text-[11px] text-highlight-silver hover:text-white transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="text-xs text-liquid-silver block mb-1">APAAR Identifier (12 Digits)</label>
              <input
                type="text"
                value={testApaar}
                onChange={(e) => setTestApaar(e.target.value)}
                placeholder="XXXX-XXXX-XXXX"
                className="w-full px-3 py-2 font-mono text-xs rounded-xl bg-obsidian border border-glass-border text-highlight-silver focus:border-platinum outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-liquid-silver block mb-1">Student Declared Name</label>
              <input
                type="text"
                value={testStudentName}
                onChange={(e) => setTestStudentName(e.target.value)}
                placeholder="Student Name"
                className="w-full px-3 py-2 text-xs rounded-xl bg-obsidian border border-glass-border text-highlight-silver focus:border-platinum outline-none"
              />
            </div>

            <button
              disabled={testLoading || !testApaar.trim()}
              onClick={() => handleRunTest(testApaar, testStudentName)}
              className="w-full py-2.5 rounded-xl bg-platinum hover:bg-white text-midnight font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-40 shadow-sm"
            >
              {testLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validating Against Registry...</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4" />
                  <span>Run Deterministic & Registry Check</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Validation Output & Rule Explanation */}
        <div className="glass-panel rounded-2xl p-6 border border-glass-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-glass-border mb-4">
              <span className="text-xs font-semibold text-highlight-silver uppercase tracking-wider font-mono">
                Validation Assessment
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-graphite text-liquid-silver">
                Explainable Signals
              </span>
            </div>

            {testResult ? (
              <div className="space-y-4">
                {/* Status Banner */}
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    testResult.authoritativeStatus === 'VERIFIED'
                      ? 'bg-platinum/5 border-platinum/40 text-platinum'
                      : 'bg-red-950/20 border-glass-border text-highlight-silver'
                  }`}
                >
                  {testResult.authoritativeStatus === 'VERIFIED' ? (
                    <CheckCircle2 className="w-5 h-5 text-platinum flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-liquid-silver flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">
                      Status: {testResult.authoritativeStatus}
                    </div>
                    <p className="text-xs text-liquid-silver mt-1 leading-relaxed">
                      {testResult.explanation}
                    </p>
                  </div>
                </div>

                {/* Audit Evidence Fields */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-glass-border/40">
                    <span className="text-liquid-silver">Adapter Gateway:</span>
                    <span className="font-mono text-highlight-silver">{testResult.authority}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-glass-border/40">
                    <span className="text-liquid-silver">Registry Transaction Token:</span>
                    <span className="font-mono text-platinum">{testResult.registryToken}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-glass-border/40">
                    <span className="text-liquid-silver">Simulation Mode Indicator:</span>
                    <span className="font-mono text-liquid-silver">Active (Synthetic SIH Testbed)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-liquid-silver">Timestamp:</span>
                    <span className="font-mono text-highlight-silver">{new Date(testResult.verificationTimestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-liquid-silver space-y-2">
                <ShieldCheck className="w-8 h-8 text-liquid-silver mx-auto opacity-40" />
                <p>Run a check using the input controls or select a preset scenario above.</p>
              </div>
            )}
          </div>

          <div className="text-[10px] text-liquid-silver pt-4 border-t border-glass-border/50">
            * All live calls are routed through the configured NDEAR/DigiLocker sandbox adapter with verifiable nonces.
          </div>
        </div>
      </div>
    </div>
  );
};
