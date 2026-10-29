import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DuplicateCase } from '../../types';
import {
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  FileText,
  Clock,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

export const DuplicateDetectionWorkspace: React.FC = () => {
  const { token, user } = useAuth();
  const [cases, setCases] = useState<DuplicateCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<DuplicateCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Resolution modal state
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolutionStatus, setResolutionStatus] = useState('CONFIRMED_DUPLICATE');
  const [resolutionReason, setResolutionReason] = useState('');
  const [deDupAction, setDeDupAction] = useState('REVOKE_SECONDARY');
  const [submitting, setSubmitting] = useState(false);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      let url = '/api/duplicates';
      if (statusFilter) url += `?status=${statusFilter}`;
      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        setCases(data || []);
        if (data.length > 0 && !selectedCase) {
          setSelectedCase(data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [token, statusFilter]);

  const handleResolveCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/duplicates/${selectedCase.id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: resolutionStatus,
          resolutionReason,
          deDupAction,
        }),
      });

      if (res.ok) {
        setResolveModalOpen(false);
        setResolutionReason('');
        fetchCases();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top filter header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-highlight-silver">
            Intelligent Multi-Institution Duplicate Detection Engine
          </h4>
          <p className="text-xs text-liquid-silver">
            Detects exact APAAR collisions, cross-institution concurrent enrolments, and fuzzy demographic identity matches.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-xl bg-obsidian border border-glass-border text-highlight-silver outline-none"
        >
          <option value="">All Case Statuses</option>
          <option value="OPEN">Open Cases</option>
          <option value="INVESTIGATING">Under Investigation</option>
          <option value="CONFIRMED_DUPLICATE">Confirmed Duplicate</option>
          <option value="FALSE_POSITIVE">False Positive</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Case List */}
        <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {loading ? (
            <p className="text-xs text-liquid-silver py-8 text-center">Loading cases...</p>
          ) : cases.length === 0 ? (
            <p className="text-xs text-liquid-silver py-8 text-center">No duplicate cases found.</p>
          ) : (
            cases.map((c) => {
              const isSelected = selectedCase?.id === c.id;
              const isConcurrent = c.matchType === 'CONCURRENT_ENROLMENT';
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-graphite/80 border-platinum shadow-active-pod'
                      : 'bg-obsidian/60 border-glass-border hover:border-liquid-silver hover:bg-graphite/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-highlight-silver">
                      {c.caseReference}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-graphite text-platinum font-mono">
                      {(c.confidenceScore * 100).toFixed(0)}% Match
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-highlight-silver mt-1.5">
                    {c.studentA.firstName} {c.studentA.lastName}
                  </div>

                  <div className="text-[11px] text-liquid-silver mt-1 flex items-center gap-1.5">
                    <span className="truncate">{c.matchType.replace('_', ' ')}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-glass-border/40 text-[10px]">
                    <span className="text-liquid-silver">Status: {c.status}</span>
                    <span className="font-mono text-liquid-silver">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Side-by-Side Comparison Case Dossier */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-glass-border space-y-6">
          {selectedCase ? (
            <>
              {/* Header Dossier */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-glass-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-highlight-silver font-mono">
                      Case {selectedCase.caseReference}
                    </span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-graphite text-platinum border border-glass-border font-mono font-semibold">
                      {selectedCase.matchType}
                    </span>
                  </div>
                  <p className="text-xs text-liquid-silver mt-1">
                    Confidence Score: <strong className="text-platinum font-mono">{(selectedCase.confidenceScore * 100).toFixed(1)}%</strong> • Status: <strong className="text-highlight-silver font-mono">{selectedCase.status}</strong>
                  </p>
                </div>

                {['AICTE_ADMIN', 'VERIFICATION_OFFICER'].includes(user?.role || '') && (
                  <button
                    onClick={() => setResolveModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-platinum hover:bg-white text-midnight text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Officer Adjudication</span>
                  </button>
                )}
              </div>

              {/* Evidence Notes */}
              <div className="p-3.5 rounded-xl bg-graphite/40 border border-glass-border text-xs text-highlight-silver space-y-1">
                <div className="text-[10px] uppercase font-semibold text-platinum font-mono tracking-wider">
                  Audited Investigation Evidence
                </div>
                <p className="text-liquid-silver leading-relaxed">
                  {selectedCase.evidenceNotes || 'Flagged by deterministic similarity query and concurrent enrolment check across AICTE institutions.'}
                </p>
              </div>

              {/* Side-by-Side Record Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Record A */}
                <div className="p-4 rounded-xl bg-obsidian/80 border border-glass-border space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-glass-border">
                    <span className="text-xs font-bold text-highlight-silver">Primary Record (Candidate A)</span>
                    <span className="text-[10px] font-mono text-liquid-silver">{selectedCase.studentA.studentRollNumber}</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-liquid-silver">Full Name:</span>
                      <strong className="text-highlight-silver">{selectedCase.studentA.firstName} {selectedCase.studentA.lastName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-liquid-silver">APAAR ID:</span>
                      <strong className="font-mono text-platinum">{selectedCase.studentA.maskedApaarId}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-liquid-silver">Date of Birth:</span>
                      <strong className="font-mono text-highlight-silver">{selectedCase.studentA.dateOfBirth}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-liquid-silver">Gender:</span>
                      <strong className="text-highlight-silver">{selectedCase.studentA.gender}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-liquid-silver">Institution:</span>
                      <strong className="text-highlight-silver truncate max-w-[150px]">{selectedCase.studentA.institution?.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-liquid-silver">Programme:</span>
                      <strong className="text-highlight-silver truncate max-w-[150px]">{selectedCase.studentA.course?.courseName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-liquid-silver">Session:</span>
                      <strong className="font-mono text-highlight-silver">{selectedCase.studentA.academicSession}</strong>
                    </div>
                  </div>
                </div>

                {/* Record B */}
                <div className="p-4 rounded-xl bg-obsidian/80 border border-glass-border space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-glass-border">
                    <span className="text-xs font-bold text-highlight-silver">Conflicting Record (Candidate B)</span>
                    <span className="text-[10px] font-mono text-liquid-silver">{selectedCase.studentB.studentRollNumber}</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-liquid-silver">Full Name:</span>
                      <strong className="text-highlight-silver">{selectedCase.studentB.firstName} {selectedCase.studentB.lastName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-liquid-silver">APAAR ID:</span>
                      <strong className="font-mono text-platinum">{selectedCase.studentB.maskedApaarId}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-liquid-silver">Date of Birth:</span>
                      <strong className="font-mono text-highlight-silver">{selectedCase.studentB.dateOfBirth}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-liquid-silver">Gender:</span>
                      <strong className="text-highlight-silver">{selectedCase.studentB.gender}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-liquid-silver">Institution:</span>
                      <strong className="text-highlight-silver truncate max-w-[150px]">{selectedCase.studentB.institution?.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-liquid-silver">Programme:</span>
                      <strong className="text-highlight-silver truncate max-w-[150px]">{selectedCase.studentB.course?.courseName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-liquid-silver">Session:</span>
                      <strong className="font-mono text-highlight-silver">{selectedCase.studentB.academicSession}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {selectedCase.resolutionReason && (
                <div className="p-3.5 rounded-xl bg-obsidian border border-glass-border text-xs text-liquid-silver space-y-1">
                  <div className="text-[10px] uppercase font-semibold text-platinum font-mono">
                    Officer Resolution Adjudication Record
                  </div>
                  <p className="text-highlight-silver whitespace-pre-line leading-relaxed">
                    {selectedCase.resolutionReason}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center space-y-2">
              <Users className="w-10 h-10 text-liquid-silver mx-auto opacity-50" />
              <p className="text-xs text-liquid-silver">
                Select a duplicate investigation case to inspect side-by-side demographic proof and resolution options.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RESOLUTION ADJUDICATION MODAL */}
      {resolveModalOpen && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-panel-elevated rounded-2xl p-6 border border-glass-border-bright space-y-4">
            <h4 className="text-sm font-bold text-highlight-silver">
              Officer Adjudication: Case {selectedCase.caseReference}
            </h4>

            <form onSubmit={handleResolveCase} className="space-y-4">
              <div>
                <label className="text-xs text-liquid-silver block mb-1">Determination Decision</label>
                <select
                  value={resolutionStatus}
                  onChange={(e) => setResolutionStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-obsidian border border-glass-border text-highlight-silver outline-none"
                >
                  <option value="CONFIRMED_DUPLICATE">Confirmed Duplicate Enrolment</option>
                  <option value="FALSE_POSITIVE">False Positive (Independent Distinct Individuals)</option>
                  <option value="INVESTIGATING">Keep Under Active Hearing</option>
                  <option value="RESOLVED">Resolved with Correction</option>
                </select>
              </div>

              {resolutionStatus === 'CONFIRMED_DUPLICATE' && (
                <div>
                  <label className="text-xs text-liquid-silver block mb-1">System Action</label>
                  <select
                    value={deDupAction}
                    onChange={(e) => setDeDupAction(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-obsidian border border-glass-border text-highlight-silver outline-none"
                  >
                    <option value="REVOKE_SECONDARY">Revoke Secondary Admission (Candidate B)</option>
                    <option value="FLAG_BOTH">Flag Both for Institutional Council Hearing</option>
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs text-liquid-silver block mb-1">Reasoned Adjudication Note</label>
                <textarea
                  rows={3}
                  required
                  placeholder="State evidence examined (e.g. Verified candidate confirmed admission at DTU and cancelled COEP seat)..."
                  value={resolutionReason}
                  onChange={(e) => setResolutionReason(e.target.value)}
                  className="w-full p-3 text-xs rounded-lg bg-obsidian border border-glass-border text-highlight-silver outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-glass-border">
                <button
                  type="button"
                  onClick={() => setResolveModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-liquid-silver hover:bg-graphite"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !resolutionReason.trim()}
                  className="px-4 py-1.5 rounded-lg bg-platinum hover:bg-white text-midnight text-xs font-bold disabled:opacity-40"
                >
                  {submitting ? 'Applying Decision...' : 'Commit Adjudication Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
