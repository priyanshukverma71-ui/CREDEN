import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';
import {
  FileUp,
  Plus,
  Search,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  FileCheck,
  ChevronRight,
  RefreshCw,
  Edit2,
  FileText,
} from 'lucide-react';
import { StudentCertificateModal } from './StudentCertificateModal';

export const StudentDataWorkspace: React.FC = () => {
  const { token, user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Bulk Upload Wizard State
  const [uploadWizardOpen, setUploadWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [csvText, setCsvText] = useState('');
  const [previewData, setPreviewData] = useState<any | null>(null);
  const [batchResult, setBatchResult] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Manual Creation State
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [newApaar, setNewApaar] = useState('');
  const [newRoll, setNewRoll] = useState('');
  const [newFname, setNewFname] = useState('');
  const [newLname, setNewLname] = useState('');
  const [newDob, setNewDob] = useState('2005-05-15');
  const [newGender, setNewGender] = useState('MALE');
  const [newCategory, setNewCategory] = useState('GENERAL');
  const [newCourseId, setNewCourseId] = useState('');

  // Selected Student Detail & Certificate
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [certModalOpen, setCertModalOpen] = useState(false);

  // Correction Modal State
  const [correctingStudent, setCorrectingStudent] = useState<Student | null>(null);
  const [correctedApaar, setCorrectedApaar] = useState('');

  const fetchStudents = async () => {
    if (!token) return;
    setLoading(true);
    try {
      let url = `/api/students?search=${encodeURIComponent(search)}`;
      if (statusFilter) url += `&recordStatus=${statusFilter}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [token, search, statusFilter]);

  // Load sample synthetic CSV
  const loadSampleCsv = () => {
    const sample = `apaarId,studentRollNumber,firstName,lastName,dateOfBirth,gender,category,admissionCategory,supernumeraryQuota,nriOciStatus,courseCode,academicSession,admissionDate
9481-2091-8841,2024-CSE-111,Ishita,Rao,2005-09-12,FEMALE,GENERAL,MERIT,NONE,NONE,DTU-CSE-101,2024-2025,2024-07-26
8372-1982-7730,2024-CSE-112,Mihir,Kapadia,2005-04-03,MALE,OBC,MERIT,TFW,NONE,DTU-CSE-101,2024-2025,2024-07-26
7261-0871-6629,2024-CSE-113,Sanya,Bansal,2005-11-20,FEMALE,SC,MERIT,NONE,NONE,DTU-CSE-101,2024-2025,2024-07-27
1234,2024-CSE-114,Tarun,Verma,2004-12-01,MALE,GENERAL,MERIT,NONE,NONE,DTU-CSE-101,2024-2025,2024-07-27`;
    setCsvText(sample);
  };

  // Step 2 & 3: Parse CSV for preview
  const handleParsePreview = async () => {
    if (!csvText.trim()) return;
    try {
      const res = await fetch('/api/uploads/parse-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ csvText }),
      });
      if (res.ok) {
        const data = await res.json();
        setPreviewData(data);
        setWizardStep(3); // Go to preview records
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Step 5 & 6: Submit Batch for ingestion
  const handleSubmitBatch = async () => {
    if (!previewData) return;
    setWizardStep(6); // Tracking processing
    setIsProcessing(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((p) => Math.min(90, p + 25));
    }, 300);

    try {
      const records = previewData.sampleRows.map((r: any) => r.data);
      const res = await fetch('/api/uploads/submit-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          records,
          academicSession: '2024-2025',
          fileName: 'synthetic_admissions_round2.csv',
        }),
      });

      clearInterval(interval);
      setUploadProgress(100);
      setIsProcessing(false);

      if (res.ok) {
        const data = await res.json();
        setBatchResult(data);
        setWizardStep(7); // Review results
        fetchStudents();
      }
    } catch (e) {
      clearInterval(interval);
      setIsProcessing(false);
      console.error(e);
    }
  };

  // Correct student record
  const handleSaveCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctingStudent) return;

    try {
      const res = await fetch(`/api/students/${correctingStudent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          apaarId: correctedApaar,
          reason: 'Corrected invalid repetitive APAAR ID syntax as per UIDAI MoE standard',
        }),
      });

      if (res.ok) {
        setCorrectingStudent(null);
        fetchStudents();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-liquid-silver absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, roll no, APAAR ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-obsidian border border-glass-border text-highlight-silver placeholder:text-liquid-silver focus:border-platinum outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-obsidian border border-glass-border text-highlight-silver outline-none"
          >
            <option value="">All Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="CORRECTION_REQUIRED">Correction Required</option>
            <option value="VALIDATING">Validating</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <a
            href="/api/analytics/export-csv?type=students"
            className="px-3 py-1.5 rounded-lg bg-obsidian hover:bg-graphite border border-glass-border text-xs text-liquid-silver hover:text-highlight-silver flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>

          <button
            onClick={() => {
              setWizardStep(1);
              setBatchResult(null);
              setPreviewData(null);
              setUploadWizardOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-platinum hover:bg-white text-midnight text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Bulk Upload Assistant</span>
          </button>
        </div>
      </div>

      {/* Main Student Data Table */}
      <div className="glass-panel rounded-2xl border border-glass-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-glass-border bg-obsidian/60 text-liquid-silver font-mono text-[11px]">
                <th className="py-3 px-4">Student Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">APAAR Identifier</th>
                <th className="py-3 px-4">Institution / Programme</th>
                <th className="py-3 px-4">Category / Quota</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/40">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-liquid-silver">
                    Loading student records from database...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-liquid-silver">
                    No student records found matching filter.
                  </td>
                </tr>
              ) : (
                students.map((student) => {
                  const isVerified = student.recordStatus === 'VERIFIED';
                  const isCorrection = student.recordStatus === 'CORRECTION_REQUIRED';
                  const isReview = student.recordStatus === 'UNDER_REVIEW';

                  return (
                    <tr key={student.id} className="hover:bg-graphite/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-highlight-silver">
                        {student.studentRollNumber}
                      </td>
                      <td className="py-3 px-4 font-medium text-highlight-silver">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="py-3 px-4 font-mono text-liquid-silver">
                        {student.maskedApaarId || student.apaarId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-highlight-silver font-medium truncate max-w-[200px]">
                          {student.course?.courseName || 'B.Tech Engineering'}
                        </div>
                        <div className="text-[10px] text-liquid-silver truncate max-w-[200px]">
                          {student.institution?.name}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-liquid-silver">{student.category}</span>
                        {student.supernumeraryQuota !== 'NONE' && (
                          <span className="ml-1.5 text-[10px] px-1.5 py-0.2 rounded bg-graphite text-platinum font-mono">
                            {student.supernumeraryQuota}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isVerified && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-platinum/10 text-platinum border border-platinum/30 font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                        {isCorrection && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-950/60 text-platinum border border-glass-border font-medium">
                            <AlertTriangle className="w-3 h-3 text-platinum" />
                            Correction Req.
                          </span>
                        )}
                        {isReview && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-graphite text-highlight-silver border border-glass-border font-medium">
                            <Clock className="w-3 h-3 text-liquid-silver" />
                            Under Review
                          </span>
                        )}
                        {!isVerified && !isCorrection && !isReview && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-graphite text-liquid-silver">
                            {student.recordStatus}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isCorrection ? (
                            <button
                              onClick={() => {
                                setCorrectingStudent(student);
                                setCorrectedApaar('9874-5612-9901'); // suggested valid APAAR
                              }}
                              className="px-2 py-1 rounded bg-graphite hover:bg-platinum hover:text-midnight text-highlight-silver text-[11px] font-medium flex items-center gap-1 transition-colors"
                              title="Resolve correction"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Fix Error</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedStudent(student);
                                setCertModalOpen(true);
                              }}
                              className="px-2 py-1 rounded bg-graphite/70 hover:bg-graphite text-liquid-silver hover:text-highlight-silver text-[11px] flex items-center gap-1 transition-colors"
                              title="View and print verifiable credential certificate"
                            >
                              <FileCheck className="w-3.5 h-3.5 text-platinum" />
                              <span>Certificate</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SMART BULK UPLOAD WIZARD MODAL */}
      {uploadWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/85 backdrop-blur-md">
          <div className="w-full max-w-3xl glass-panel-elevated rounded-3xl p-6 border border-glass-border-bright space-y-6">
            {/* Wizard Step Indicator */}
            <div className="flex items-center justify-between pb-4 border-b border-glass-border">
              <div>
                <h4 className="text-sm font-bold text-highlight-silver">
                  Smart Bulk Upload Assistant
                </h4>
                <p className="text-xs text-liquid-silver">
                  Step {wizardStep} of 7: {
                    wizardStep === 1 ? 'Select File' :
                    wizardStep === 2 ? 'Map Columns' :
                    wizardStep === 3 ? 'Preview Records & Validation' :
                    wizardStep === 4 ? 'Review Errors & Warnings' :
                    wizardStep === 5 ? 'Confirm Ingestion Submission' :
                    wizardStep === 6 ? 'Background Processing Queue' :
                    'Ingestion Results & Verification'
                  }
                </p>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-mono text-liquid-silver">
                {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                  <div
                    key={s}
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      s === wizardStep
                        ? 'bg-platinum text-midnight font-bold'
                        : s < wizardStep
                        ? 'bg-graphite text-platinum'
                        : 'bg-obsidian text-liquid-silver/40'
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1 & 2: Select / Paste CSV */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-liquid-silver">Paste CSV data or load synthetic demo template:</span>
                  <div className="flex items-center gap-2">
                    <a
                      href="/api/uploads/template-csv"
                      className="text-xs text-platinum hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download AICTE CSV Template</span>
                    </a>
                    <button
                      type="button"
                      onClick={loadSampleCsv}
                      className="px-2.5 py-1 rounded bg-graphite text-xs text-highlight-silver hover:bg-graphite/80"
                    >
                      Load Sample Demo Batch
                    </button>
                  </div>
                </div>

                <textarea
                  rows={8}
                  placeholder="Paste CSV rows here..."
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full p-3 font-mono text-xs rounded-xl bg-obsidian border border-glass-border text-highlight-silver focus:border-platinum outline-none"
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setUploadWizardOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-liquid-silver hover:bg-graphite"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!csvText.trim()}
                    onClick={handleParsePreview}
                    className="px-4 py-1.5 rounded-lg bg-platinum hover:bg-white text-midnight text-xs font-semibold disabled:opacity-40"
                  >
                    Parse & Preview (Step 2/3)
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Preview Records & Schema Validation */}
            {wizardStep === 3 && previewData && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-liquid-silver">
                    Total Records Detected: <strong className="font-mono text-highlight-silver">{previewData.totalRows}</strong>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-platinum">✓ {previewData.previewSummary.validInPreview} Valid</span>
                    <span className="text-liquid-silver">⚠ {previewData.previewSummary.errorsInPreview} Flagged</span>
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto border border-glass-border rounded-xl">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-obsidian border-b border-glass-border text-liquid-silver font-mono">
                      <tr>
                        <th className="p-2">Row</th>
                        <th className="p-2">Roll No</th>
                        <th className="p-2">APAAR ID</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Validation Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-glass-border/30">
                      {previewData.sampleRows.map((r: any) => (
                        <tr key={r.rowIndex} className={r.isValid ? '' : 'bg-red-950/20'}>
                          <td className="p-2 font-mono text-liquid-silver">{r.rowIndex}</td>
                          <td className="p-2 font-mono text-highlight-silver">{r.data.studentRollNumber || r.data.rollNo}</td>
                          <td className="p-2 font-mono text-liquid-silver">{r.data.apaarId}</td>
                          <td className="p-2 text-highlight-silver">{r.data.firstName} {r.data.lastName}</td>
                          <td className="p-2">
                            {r.isValid ? (
                              <span className="text-[10px] text-platinum">Valid Syntax</span>
                            ) : (
                              <span className="text-[10px] text-platinum">{r.errors.join('; ')}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setWizardStep(1)}
                    className="px-3 py-1.5 rounded-lg text-xs text-liquid-silver hover:bg-graphite"
                  >
                    Back to File
                  </button>
                  <button
                    onClick={() => setWizardStep(5)}
                    className="px-4 py-1.5 rounded-lg bg-platinum hover:bg-white text-midnight text-xs font-semibold"
                  >
                    Proceed to Ingestion (Step 5)
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Confirm Ingestion */}
            {wizardStep === 5 && (
              <div className="space-y-4 text-center py-6">
                <FileCheck className="w-12 h-12 text-platinum mx-auto opacity-80" />
                <div>
                  <h5 className="text-base font-bold text-highlight-silver">
                    Confirm Submission of Batch Ingestion
                  </h5>
                  <p className="text-xs text-liquid-silver max-w-md mx-auto mt-1">
                    Valid records will be ingested and mapped to institution approved intake. Any rows with syntax errors will be flagged for partial review without blocking valid records.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-4">
                  <button
                    onClick={() => setWizardStep(3)}
                    className="px-4 py-2 rounded-xl text-xs text-liquid-silver hover:bg-graphite"
                  >
                    Back to Preview
                  </button>
                  <button
                    onClick={handleSubmitBatch}
                    className="px-6 py-2 rounded-xl bg-platinum hover:bg-white text-midnight text-xs font-bold shadow-platinum-glow"
                  >
                    Submit Batch to AICTE Queue
                  </button>
                </div>
              </div>
            )}

            {/* Step 6: Tracking Processing */}
            {wizardStep === 6 && (
              <div className="space-y-4 text-center py-10">
                <RefreshCw className="w-8 h-8 text-platinum mx-auto animate-spin" />
                <h5 className="text-sm font-bold text-highlight-silver">
                  Processing Batch & Ingestion Queue...
                </h5>
                <div className="w-64 h-2 bg-obsidian rounded-full mx-auto overflow-hidden border border-glass-border">
                  <div
                    className="h-full bg-platinum transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-liquid-silver">
                  Running APAAR syntax checks, duplicate detection & course compliance calculations...
                </p>
              </div>
            )}

            {/* Step 7: Review Results */}
            {wizardStep === 7 && batchResult && (
              <div className="space-y-4">
                <div className="text-center pb-2">
                  <CheckCircle2 className="w-10 h-10 text-platinum mx-auto mb-2" />
                  <h5 className="text-base font-bold text-highlight-silver">
                    Batch Processed: {batchResult.batchNumber}
                  </h5>
                  <p className="text-xs text-liquid-silver">
                    Status: <strong className="text-platinum">{batchResult.status}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="glass-panel p-3 rounded-xl border border-glass-border">
                    <div className="text-xs text-liquid-silver">Valid Ingested</div>
                    <div className="text-xl font-bold font-mono text-platinum mt-1">
                      {batchResult.validRecords}
                    </div>
                  </div>
                  <div className="glass-panel p-3 rounded-xl border border-glass-border">
                    <div className="text-xs text-liquid-silver">Flagged / Review</div>
                    <div className="text-xl font-bold font-mono text-highlight-silver mt-1">
                      {batchResult.flaggedRecords}
                    </div>
                  </div>
                  <div className="glass-panel p-3 rounded-xl border border-glass-border">
                    <div className="text-xs text-liquid-silver">Rejected / Syntax</div>
                    <div className="text-xl font-bold font-mono text-liquid-silver mt-1">
                      {batchResult.rejectedRecords}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setUploadWizardOpen(false)}
                    className="px-5 py-2 rounded-xl bg-platinum text-midnight text-xs font-bold"
                  >
                    Done & View Records
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CORRECTION MODAL */}
      {correctingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel-elevated rounded-2xl p-6 border border-glass-border space-y-4">
            <h4 className="text-sm font-bold text-highlight-silver">
              Correct Student APAAR Identifier
            </h4>
            <p className="text-xs text-liquid-silver">
              Student: <strong className="text-highlight-silver">{correctingStudent.firstName} {correctingStudent.lastName}</strong> ({correctingStudent.studentRollNumber})
            </p>

            <form onSubmit={handleSaveCorrection} className="space-y-3">
              <div>
                <label className="text-xs text-liquid-silver block mb-1">Enter Valid 12-digit APAAR ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9874-5612-9901"
                  value={correctedApaar}
                  onChange={(e) => setCorrectedApaar(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-obsidian border border-glass-border text-highlight-silver focus:border-platinum outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-glass-border">
                <button
                  type="button"
                  onClick={() => setCorrectingStudent(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-liquid-silver hover:bg-graphite"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-platinum hover:bg-white text-midnight text-xs font-semibold"
                >
                  Save & Re-validate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verifiable Credential Certificate Modal */}
      {certModalOpen && selectedStudent && (
        <StudentCertificateModal
          studentId={selectedStudent.id}
          onClose={() => setCertModalOpen(false)}
        />
      )}
    </div>
  );
};
