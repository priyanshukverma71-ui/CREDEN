import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
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
} from 'lucide-react';

export const InstitutionWorkspace: React.FC = () => {
  const { token, user } = useAuth();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedInst, setSelectedInst] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // New Course modal state
  const [newCourseOpen, setNewCourseOpen] = useState(false);
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [approvedIntake, setApprovedIntake] = useState(60);

  const fetchInstitutions = async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/institutions?search=${encodeURIComponent(search)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInstitutions(data.data || []);
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
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchInstitutions();
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

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-liquid-silver absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, AICTE code, state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-obsidian border border-glass-border text-highlight-silver placeholder:text-liquid-silver focus:outline-none focus:border-platinum transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-liquid-silver">
          <span>{institutions.length} AICTE Institutions Listed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Institution List */}
        <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {loading ? (
            <p className="text-xs text-liquid-silver py-8 text-center">Loading registry...</p>
          ) : institutions.length === 0 ? (
            <p className="text-xs text-liquid-silver py-8 text-center">No institutions matched query.</p>
          ) : (
            institutions.map((inst) => {
              const isSelected = selectedInst?.id === inst.id;
              return (
                <div
                  key={inst.id}
                  onClick={() => fetchDetail(inst.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-graphite/80 border-platinum shadow-active-pod'
                      : 'bg-obsidian/60 border-glass-border hover:border-liquid-silver hover:bg-graphite/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-highlight-silver leading-snug">
                      {inst.name}
                    </h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-midnight text-liquid-silver border border-glass-border flex-shrink-0">
                      {inst.code}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-[11px] text-liquid-silver">
                    <MapPin className="w-3 h-3 text-platinum" />
                    <span>{inst.state} • {inst.type.replace('_', ' ')}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-glass-border/40 text-[11px]">
                    <span className="text-liquid-silver">{inst.totalCourses || 0} Programmes</span>
                    <span className="font-mono text-platinum font-medium">
                      {(inst.totalStudents || 0).toLocaleString()} Enrolled
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Institution Details & Programmes */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-glass-border space-y-6">
          {selectedInst ? (
            <>
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-glass-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-highlight-silver">
                      {selectedInst.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-platinum/10 text-platinum border border-platinum/30 font-medium">
                      {selectedInst.approvalStatus}
                    </span>
                  </div>
                  <p className="text-xs text-liquid-silver mt-1">{selectedInst.address}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-liquid-silver mt-2">
                    <span>Code: <strong className="font-mono text-highlight-silver">{selectedInst.code}</strong></span>
                    <span>•</span>
                    <span>Accreditation: <strong className="text-highlight-silver">{selectedInst.accreditedBy || 'AICTE NBA'}</strong></span>
                    <span>•</span>
                    <span>Est: <strong className="font-mono text-highlight-silver">{selectedInst.establishedYear}</strong></span>
                  </div>
                </div>

                {['AICTE_ADMIN', 'INSTITUTION_ADMIN'].includes(user?.role || '') && (
                  <button
                    onClick={() => setNewCourseOpen(true)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-platinum hover:bg-white text-midnight text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Programme</span>
                  </button>
                )}
              </div>

              {/* Programme / Courses Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-xs font-semibold text-highlight-silver uppercase tracking-wider font-mono">
                    Approved Programmes & Intake Configurations
                  </h5>
                  <span className="text-xs text-liquid-silver">Session 2024-2025</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-glass-border text-liquid-silver text-[11px] font-mono">
                        <th className="py-2.5 px-3">Course Code</th>
                        <th className="py-2.5 px-3">Programme Title</th>
                        <th className="py-2.5 px-3">Level</th>
                        <th className="py-2.5 px-3 text-right">Approved Intake</th>
                        <th className="py-2.5 px-3 text-right">Admitted</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-glass-border/40">
                      {selectedInst.courses?.map((course: Course) => {
                        const enrolled = course._count?.students || 0;
                        const isOver = enrolled > course.approvedIntake;
                        return (
                          <tr key={course.id} className="hover:bg-graphite/30 transition-colors">
                            <td className="py-2.5 px-3 font-mono text-liquid-silver">{course.courseCode}</td>
                            <td className="py-2.5 px-3 font-medium text-highlight-silver">{course.courseName}</td>
                            <td className="py-2.5 px-3 text-liquid-silver">{course.degreeLevel} ({course.durationYears} Yrs)</td>
                            <td className="py-2.5 px-3 text-right font-mono text-platinum">{course.approvedIntake}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-highlight-silver">{enrolled}</td>
                            <td className="py-2.5 px-3 text-center">
                              {isOver ? (
                                <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/60 text-platinum border border-glass-border font-medium">
                                  +{enrolled - course.approvedIntake} Over
                                </span>
                              ) : (
                                <span className="text-[10px] px-2 py-0.5 rounded bg-graphite text-liquid-silver border border-glass-border">
                                  Compliant
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
