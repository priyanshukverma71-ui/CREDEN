import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Cpu,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Code2,
  Database,
  RotateCcw,
  Sparkles,
  Server,
} from 'lucide-react';

export const SystemIntegrationWorkspace: React.FC = () => {
  const { token, user } = useAuth();
  const [statusData, setStatusData] = useState<any | null>(null);
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/integration/status');
      if (res.ok) {
        const data = await res.json();
        setStatusData(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStatus();
    const handleAction = () => {
      handleResetSeed();
    };
    window.addEventListener('creden:action:integration', handleAction);
    return () => window.removeEventListener('creden:action:integration', handleAction);
  }, [token]);

  const handleResetSeed = async () => {
    if (!token) return;
    setResetting(true);
    setResetMsg(null);

    try {
      const res = await fetch('/api/integration/reset-seed', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setResetMsg('Demonstration database successfully reset and re-seeded with reproducible synthetic AICTE data.');
      } else {
        setResetMsg('Reset failed: ' + data.error);
      }
    } catch (e: any) {
      setResetMsg('Reset error: ' + e.message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Demonstration Seed & Reset Card */}
      <div className="surface-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0">
            <RotateCcw className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">
                Demonstration Database Reset & Re-Seed
              </h4>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Restores standard verified student records, cross-institution duplicate test cases, and admission quota discrepancies.
            </p>
          </div>
        </div>

        {['AICTE_ADMIN'].includes(user?.role || '') && (
          <button
            onClick={handleResetSeed}
            disabled={resetting}
            className="flex-shrink-0 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-40 shadow-sm"
          >
            {resetting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Re-Seeding Database...</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>Reset Demo Dataset</span>
              </>
            )}
          </button>
        )}
      </div>

      {resetMsg && (
        <div className="p-4 rounded-xl bg-platinum/10 border border-platinum/40 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-platinum flex-shrink-0" />
          <span className="text-xs text-highlight-silver">{resetMsg}</span>
        </div>
      )}

      {/* Integration Gateway Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xs font-semibold text-highlight-silver uppercase tracking-wider font-mono">
            Active External Integration Gateways & Adapters
          </h5>
          <a
            href="/api/integration/openapi.json"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-platinum hover:underline flex items-center gap-1 font-mono"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>OpenAPI 3.0 Specification</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statusData?.adapters?.map((adapter: any) => (
            <div
              key={adapter.id}
              className="glass-panel rounded-2xl p-5 border border-glass-border space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-graphite text-liquid-silver border border-glass-border">
                  {adapter.protocol}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-platinum font-mono">
                  <span className="w-2 h-2 rounded-full bg-platinum animate-pulse" />
                  {adapter.status}
                </span>
              </div>

              <div>
                <h6 className="text-xs font-bold text-highlight-silver">{adapter.name}</h6>
                <p className="text-[11px] text-liquid-silver font-mono truncate mt-1" title={adapter.endpoint}>
                  {adapter.endpoint}
                </p>
              </div>

              <div className="pt-2 border-t border-glass-border/40 flex items-center justify-between text-[11px] text-liquid-silver">
                <span>Latency: <strong className="text-highlight-silver font-mono">{adapter.latencyMs}ms</strong></span>
                <span className="font-mono text-platinum">
                  {adapter.isSimulation ? 'Sandbox Mode' : 'Direct API'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
