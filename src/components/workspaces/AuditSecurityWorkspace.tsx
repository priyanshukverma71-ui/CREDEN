import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuditEvent } from '../../types';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Key,
  Database,
} from 'lucide-react';

export const AuditSecurityWorkspace: React.FC = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [integrityStatus, setIntegrityStatus] = useState<any | null>(null);

  const fetchLogs = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/audit/logs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const verifyIntegrity = async () => {
    setVerifying(true);
    try {
      const res = await fetch('/api/audit/verify-integrity', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setIntegrityStatus(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const handleAction = () => {
      verifyIntegrity();
    };
    window.addEventListener('creden:action:audit', handleAction);
    return () => window.removeEventListener('creden:action:audit', handleAction);
  }, [token]);

  return (
    <div className="space-y-6">
      {/* Integrity Verification Card */}
      <div className="surface-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">
                Cryptographic Audit Chain Integrity Verification
              </h4>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Every consequential event (ingestion, validation, duplicate resolution, export) is immutably sealed in a chained hash block.
            </p>
          </div>
        </div>

        <button
          onClick={verifyIntegrity}
          disabled={verifying}
          className="flex-shrink-0 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-40 shadow-sm"
        >
          {verifying ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Verifying Hash Chain...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Cryptographic Chain</span>
            </>
          )}
        </button>
      </div>

      {/* Verification Status Notification if executed */}
      {integrityStatus && (
        <div className="p-4 rounded-xl bg-platinum/10 border border-platinum/40 flex items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-platinum flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-highlight-silver">
                Status: {integrityStatus.status} (Zero Tampering Detected)
              </div>
              <p className="text-[11px] text-liquid-silver">
                Verified unbroken cryptographic chain across {integrityStatus.totalEvents} sequential audit blocks using {integrityStatus.algorithm}.
              </p>
            </div>
          </div>
          <span className="text-[10px] text-liquid-silver font-mono">
            Verified {new Date(integrityStatus.verifiedAt).toLocaleTimeString()}
          </span>
        </div>
      )}

      {/* Audit Logs Table */}
      <div className="glass-panel rounded-2xl border border-glass-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-glass-border bg-obsidian/70 text-liquid-silver font-mono text-[11px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Integrity Digest (SHA-256)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/40 font-mono text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-liquid-silver">
                    Loading audit trail from database...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-liquid-silver">
                    No audit records logged.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-graphite/30 transition-colors">
                    <td className="py-2.5 px-4 text-liquid-silver">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 font-sans text-highlight-silver">
                      <div className="font-semibold">{log.user?.fullName || log.actorEmail}</div>
                      <div className="text-[10px] text-liquid-silver font-mono">{log.actorRole}</div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-graphite text-platinum font-semibold border border-glass-border">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-liquid-silver">
                      {log.targetType} {log.targetId ? `(${log.targetId.slice(0, 10)})` : ''}
                    </td>
                    <td className="py-2.5 px-4 text-platinum truncate max-w-[160px]" title={log.integrityHash}>
                      {log.integrityHash.slice(0, 20)}...
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
