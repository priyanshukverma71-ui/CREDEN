import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/apiService';
import { Institution, Course } from '../../types';
import {
  Building2,
  Search,
  Plus,
  ExternalLink,
  BookOpen,
  MapPin,
  CheckCircle2,
  Shield,
  Layers,
  Award,
  AlertTriangle,
  FileText,
  Filter,
  Check,
} from 'lucide-react';

export const InstitutionWorkspace: React.FC = () => {
  const { token, user } = useAuth();
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [selectedInst, setSelectedInst] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // New Course modal state
  const [newCourseOpen, setNewCourseOpen] = useState(false);
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [approvedIntake, setApprovedIntake] = useState(60);

  const fetchInstitutions = async () => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/institutions?search=${encodeURIComponent(search)}`, { headers });
      if (res.ok) {
        const data = await res.json();
        const list = data.data || [];
        if (list.length > 0) {
          setInstitutions(list);
          if (!selectedInst) fetchDetail(list[0].id);
          return;
        }
      }

      // Fallback to ApiService
      const apiData = await ApiService.getInstitutions({ search });
      if (apiData.success && apiData.institutions) {
        setInstitutions(apiData.institutions);
        if (!selectedInst && apiData.institutions.length > 0) {
          fetchDetail(apiData.institutions[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async (id: string) => {
    try {
      const res = await fetch(`/api/institutions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedInst(data);
        return;
      }

      // Fallback to ApiService detail
      const apiDetail = await ApiService.getInstitutionById(id);
      if (apiDetail.success) {
        setSelectedInst({
          ...apiDetail.institution,
          metrics: apiDetail.metrics,
          programmeIntakes: apiDetail.programmeIntakes,
          recentBatches: apiDetail.recentBatches,
          activeIssues: apiDetail.activeIssues,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchInstitutions();
    const handleAction = () => {
      setNewCourseOpen(true);
    };
    window.addEventListener('creden:action:institutions', handleAction);
    return () => window.removeEventListener('creden:action:institutions', handleAction);
  }, [token, search]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInst) return;

    try {
      const res = await fetch(`/api/institutions/${selectedInst.id}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseCode,
          courseName,
          approvedIntake,
          academicSession: '2024-2025',
        }),
      });
      if (res.ok) {
        setNewCourseOpen(false);
        setCourseCode('');
        setCourseName('');
        fetchDetail(selectedInst.id);
        fetchInstitutions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredInstitutions = institutions.filter((inst) => {
    if (stateFilter !== 'ALL' && inst.state !== stateFilter) return false;
    if (typeFilter !== 'ALL' && inst.institutionType !== typeFilter && inst.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, AICTE code, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* State Filter */}
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-2.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All States</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-indigo-500 hidden md:block"
          >
            <option value="ALL">All Types</option>
            <option value="STATE_TECHNICAL_UNIVERSITY">State Tech Univ</option>
            <option value="CENTRAL_UNIVERSITY">Central Univ</option>
            <option value="AUTONOMOUS_COLLEGE">Autonomous College</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 flex-shrink-0">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span>{filteredInstitutions.length} Institutions Listed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Institution List */}
        <div className="lg:col-span-1 space-y-3 max-h-[650px] overflow-y-auto pr-1">
          {loading ? (
            <p className="text-xs text-slate-400 py-8 text-center">Loading registry...</p>
          ) : filteredInstitutions.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No institutions matched query.</p>
          ) : (
            filteredInstitutions.map((inst) => {
              const isSelected = selectedInst?.id === inst.id;
              return (
                <div
                  key={inst.id}
                  onClick={() => fetchDetail(inst.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/60 border-indigo-300 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {inst.name}
                    </h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 flex-shrink-0">
                      {inst.institutionCode || inst.code}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3 text-indigo-500" />
                    <span>{inst.state} • {(inst.institutionType || inst.type || '').replace(/_/g, ' ')}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500">{inst.totalCourses || 3} Programmes</span>
                    <span className="font-mono text-slate-900 font-semibold">
                      {(inst.totalStudents || 128).toLocaleString()} Enrolled
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Institution Details, Metrics & Programmes */}
        <div className="lg:col-span-2 rounded-2xl p-6 border border-slate-200/80 bg-white shadow-xs space-y-6">
          {selectedInst ? (
            <>
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200/70">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">
                      {selectedInst.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                      {selectedInst.status || 'ACTIVE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{selectedInst.address || `${selectedInst.city}, ${selectedInst.state}`}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2 font-mono">
                    <span>Code: <strong className="text-slate-800">{selectedInst.institutionCode || selectedInst.code}</strong></span>
                    <span>•</span>
                    <span>Accreditation: <strong className="text-slate-800">{selectedInst.accreditedBy || 'NAAC A++ / NBA'}</strong></span>
                    <span>•</span>
                    <span>Est: <strong className="text-slate-800">{selectedInst.approvedYear || selectedInst.establishedYear || 1854}</strong></span>
                  </div>
                </div>

                {['AICTE_ADMIN', 'INSTITUTION_ADMIN'].includes(user?.role || '') && (
                  <button
                    onClick={() => setNewCourseOpen(true)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Programme</span>
                  </button>
                )}
              </div>

              {/* Institution KPI Metrics (Alpha Parity) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Total Students</span>
                  <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                    {selectedInst.metrics?.totalStudents || selectedInst.totalStudents || 128}
                  </span>
                  <span className="text-[10px] text-slate-400">AY 2025-26 Enrolment</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Intake Capacity</span>
                  <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                    {selectedInst.metrics?.intakeCapacity || 120}
                  </span>
                  <span className="text-[10px] text-slate-400">Sanctioned Seats</span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                  <span className="text-[11px] text-amber-700 block font-medium">Utilization Rate</span>
                  <span className="text-base font-bold font-mono text-amber-800 mt-0.5 block">
                    {selectedInst.metrics?.utilizationRate || 106.7}%
                  </span>
                  <span className="text-[10px] text-amber-600">Capacity filled</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <span className="text-[11px] text-emerald-700 block font-medium">Validation Score</span>
                  <span className="text-base font-bold font-mono text-emerald-800 mt-0.5 block">
                    {selectedInst.metrics?.validationScore || 98.4}%
                  </span>
                  <span className="text-[10px] text-emerald-600">APAAR pass rate</span>
                </div>
              </div>

              {/* Programme / Courses Table with Status */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-xs font-semibold text-slate-900 uppercase tracking-wider font-mono">
                    Approved Programmes & Intake Configurations
                  </h5>
                  <span className="text-xs text-slate-400 font-mono">Session 2024-2025</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-[11px] font-mono bg-slate-50/70">
                        <th className="py-2.5 px-3">Course Code</th>
                        <th className="py-2.5 px-3">Programme Title</th>
                        <th className="py-2.5 px-3 text-right">Approved Intake</th>
                        <th className="py-2.5 px-3 text-right">Admitted</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedInst.programmeIntakes || [
                        { programmeCode: 'BTECH-CSE', programmeName: 'B.Tech in Computer Science & Engineering', approvedSeatCount: 120, enrolled: 128, status: 'EXCEEDED' },
                        { programmeCode: 'BTECH-ECE', programmeName: 'B.Tech in Electronics & Communication Engg', approvedSeatCount: 90, enrolled: 84, status: 'NORMAL' },
                        { programmeCode: 'BTECH-MECH', programmeName: 'B.Tech in Mechanical Engineering', approvedSeatCount: 90, enrolled: 72, status: 'NORMAL' },
                      ]).map((course: any, idx: number) => {
                        const approved = course.approvedSeatCount || course.approvedIntake || 60;
                        const enrolled = course.enrolled || (course._count?.students) || 0;
                        const isOver = course.status === 'EXCEEDED' || enrolled > approved;
                        return (
                          <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-2.5 px-3 font-mono text-slate-600">{course.programmeCode || course.courseCode}</td>
                            <td className="py-2.5 px-3 font-medium text-slate-900">{course.programmeName || course.courseName}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-slate-700">{approved}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{enrolled}</td>
                            <td className="py-2.5 px-3 text-center">
                              {isOver ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold border border-rose-200">
                                  EXCEEDED (+{enrolled - approved})
                                </span>
                              ) : (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200">
                                  NORMAL
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Ingestion Batches (Alpha Parity) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-semibold text-slate-900 uppercase tracking-wider font-mono">
                    Recent Ingestion Batches
                  </h5>
                  <span className="text-[10px] font-mono text-slate-400">Verhoeff Validated</span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-[11px] font-mono bg-slate-50/70">
                        <th className="py-2 px-3">Batch ID</th>
                        <th className="py-2 px-3">Academic Session</th>
                        <th className="py-2 px-3 text-right">Total Records</th>
                        <th className="py-2 px-3 text-right">Valid Passes</th>
                        <th className="py-2 px-3 text-center">Review Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedInst.recentBatches || [
                        { batchId: 'BATCH-2025-01', academicYear: '2025-2026', totalRecords: 128, validCount: 126, issueCount: 2, status: 'NEEDS_REVIEW' },
                      ]).map((b: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 font-mono font-semibold text-slate-900">{b.batchId}</td>
                          <td className="py-2 px-3 text-slate-600">{b.academicYear}</td>
                          <td className="py-2 px-3 text-right font-mono">{b.totalRecords}</td>
                          <td className="py-2 px-3 text-right font-mono text-emerald-600 font-semibold">{b.validCount}</td>
                          <td className="py-2 px-3 text-center">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center space-y-2">
              <Building2 className="w-10 h-10 text-liquid-silver mx-auto opacity-50" />
              <p className="text-xs text-liquid-silver">
                Select an institution from the left registry to inspect courses, intake rules, and compliance status.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Programme */}
      {newCourseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel-elevated rounded-2xl p-6 border border-glass-border-bright space-y-4">
            <h4 className="text-sm font-bold text-highlight-silver">
              Add Approved Programme to {selectedInst?.name}
            </h4>
            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div>
                <label className="text-xs text-liquid-silver block mb-1">Course Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DTU-CSE-103"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-obsidian border border-glass-border text-highlight-silver focus:border-platinum outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-liquid-silver block mb-1">Course / Programme Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Tech Cyber Physical Systems"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-obsidian border border-glass-border text-highlight-silver focus:border-platinum outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-liquid-silver block mb-1">AICTE Sanctioned Approved Intake</label>
                <input
                  type="number"
                  required
                  min={10}
                  max={600}
                  value={approvedIntake}
                  onChange={(e) => setApprovedIntake(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-obsidian border border-glass-border text-highlight-silver focus:border-platinum outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-glass-border">
                <button
                  type="button"
                  onClick={() => setNewCourseOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-liquid-silver hover:bg-graphite"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-platinum hover:bg-white text-midnight text-xs font-semibold"
                >
                  Create Programme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
