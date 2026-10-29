import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePortal } from '../../context/PortalContext';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Plus,
  RefreshCw,
  FileCheck,
  ChevronRight,
  ChevronLeft,
  Eye,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Database,
  History,
} from 'lucide-react';

interface BatchHistoryItem {
  id: string;
  batchNumber: string;
  academicSession: string;
  totalRecords: number;
  validRecords: number;
  flaggedRecords: number;
  rejectedRecords: number;
  status: string;
  createdAt: string;
  fileName?: string;
  institution?: { name: string; code: string };
}

export const StudentSubmissionWorkspace: React.FC = () => {
  const { token, user } = useAuth();
  const { setActiveModule } = usePortal();

  // Active Tab: 'wizard' | 'history' | 'manual'
  const [activeTab, setActiveTab] = useState<'wizard' | 'history' | 'manual'>('wizard');

  // Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedSession, setSelectedSession] = useState('2024-2025');
  const [csvText, setCsvText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any | null>(null);
  const [batchResult, setBatchResult] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // Batch History State
  const [batches, setBatches] = useState<BatchHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Manual Form State
  const [manualApaar, setManualApaar] = useState('');
  const [manualRoll, setManualRoll] = useState('');
  const [manualFname, setManualFname] = useState('');
  const [manualLname, setManualLname] = useState('');
  const [manualDob, setManualDob] = useState('2005-04-12');
  const [manualGender, setManualGender] = useState('MALE');
  const [manualCategory, setManualCategory] = useState('GENERAL');
  const [manualCourseCode, setManualCourseCode] = useState('CSE-UG-101');
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [manualSuccessMsg, setManualSuccessMsg] = useState('');

  // Load sample synthetic data
  const handleLoadSampleData = () => {
    const sample = `apaarId,studentRollNumber,firstName,lastName,dateOfBirth,gender,category,admissionCategory,supernumeraryQuota,nriOciStatus,courseCode,academicSession,admissionDate
9874-5612-3450,2024-CSE-001,Aarav,Sharma,2005-04-12,MALE,GENERAL,MERIT,NONE,NONE,CSE-UG-101,2024-2025,2024-07-15
8763-4521-9872,2024-CSE-002,Diya,Patel,2005-08-23,FEMALE,OBC,MERIT,TFW,NONE,CSE-UG-101,2024-2025,2024-07-16
7652-3410-8761,2024-CSE-003,Vikram,Singh,2004-11-30,MALE,SC,MERIT,NONE,NONE,CSE-UG-101,2024-2025,2024-07-16
0000-0000-0000,2024-CSE-004,Kabir,Verma,2005-01-14,MALE,GENERAL,MANAGEMENT,NONE,NONE,CSE-UG-101,2024-2025,2024-07-17
6541-2309-7654,2024-CSE-005,Ananya,Iyer,2005-06-19,FEMALE,GENERAL,MERIT,NONE,NONE,CSE-UG-101,2024-2025,2024-07-18`;
    setCsvText(sample);
    setErrorMessage('');
  };

  // Step 2 -> 3: Parse and preview
  const handleParseAndPreview = async () => {
    if (!csvText.trim() && !file) {
      setErrorMessage('Please provide a CSV file or paste student records.');
      return;
    }
    setErrorMessage('');
    setIsProcessing(true);

    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      } else {
        formData.append('csvText', csvText);
      }

      const res = await fetch('/api/uploads/parse-preview', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setPreviewData(data);
        setWizardStep(3); // Proceed to preview/mapping
      } else {
        const err = await res.json();
        setErrorMessage(err.error || 'Failed to parse file.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Error uploading file.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 4 -> 5: Commit batch
  const handleCommitBatch = async () => {
    if (!previewData) return;
    setIsProcessing(true);
    setUploadProgress(10);

    const progressInterval = setInterval(() => {
      setUploadProgress((p) => (p < 90 ? p + 20 : p));
    }, 200);

    try {
      const res = await fetch('/api/uploads/commit-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          academicSession: selectedSession,
          records: previewData.records,
          fileName: file ? file.name : 'pasted_records.csv',
        }),
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (res.ok) {
        const data = await res.json();
        setBatchResult(data);
        setWizardStep(5); // Success step
      } else {
        const err = await res.json();
        setErrorMessage(err.error || 'Batch commit failed.');
      }
    } catch (e: any) {
      clearInterval(progressInterval);
      setErrorMessage(e.message || 'Error submitting batch.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Fetch historical batches
  const fetchBatchHistory = async () => {
    if (!token) return;
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/uploads/batches', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBatches(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchBatchHistory();
    }
  }, [activeTab, token]);

  // Single manual registration
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualSubmitting(true);
    setManualSuccessMsg('');
    setErrorMessage('');

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          apaarId: manualApaar,
          studentRollNumber: manualRoll,
          firstName: manualFname,
          lastName: manualLname,
          dateOfBirth: manualDob,
          gender: manualGender,
          category: manualCategory,
          academicSession: selectedSession,
          admissionCategory: 'MERIT',
          supernumeraryQuota: 'NONE',
          nriOciStatus: 'NONE',
          courseCode: manualCourseCode,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setManualSuccessMsg(`Student record successfully registered: ${manualFname} ${manualLname} (${manualRoll})`);
        setManualApaar('');
        setManualRoll('');
        setManualFname('');
        setManualLname('');
      } else {
        const err = await res.json();
        setErrorMessage(err.error || 'Failed to register student record.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Network error.');
    } finally {
      setManualSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 text-slate-900">
      {/* Workspace Header */}
      <div className="surface-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-950 tracking-tight">
              Student Data Submission & Ingestion Gateway
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardised AICTE academic session ingestion, automated Verhoeff checksum validation, and statutory intake compliance checks.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="/api/uploads/template-csv"
            download="aicte_student_upload_template.csv"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Template</span>
          </a>

          {/* Tab buttons */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100/90 border border-slate-200/80">
            <button
              onClick={() => setActiveTab('wizard')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'wizard'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Batch Wizard
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Batch History
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'manual'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Single Entry
            </button>
          </div>
        </div>
      </div>

      {/* Error / Success Banners */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-xs hover:underline font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {manualSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{manualSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActiveModule('students')}
            className="text-xs underline font-mono ml-4 font-semibold text-emerald-700"
          >
            View in Student Registry
          </button>
        </div>
      )}

      {/* TAB 1: BATCH INGESTION WIZARD */}
      {activeTab === 'wizard' && (
        <div className="surface-card p-6 space-y-6">
          {/* Stepper Progress Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            {[
              { num: 1, title: 'Session & Intake' },
              { num: 2, title: 'Upload & Parse' },
              { num: 3, title: 'Column Mapping' },
              { num: 4, title: 'Pre-Validation' },
              { num: 5, title: 'Commit & Ledger' },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-2 text-xs font-mono ${
                  wizardStep >= s.num ? 'text-slate-900 font-bold' : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    wizardStep === s.num
                      ? 'bg-slate-900 text-white'
                      : wizardStep > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {wizardStep > s.num ? '✓' : s.num}
                </div>
                <span className="hidden sm:inline font-medium">{s.title}</span>
                {s.num < 5 && <div className="hidden md:block w-8 h-[1px] bg-slate-200 ml-2" />}
              </div>
            ))}
          </div>

          {/* Step 1: Session & Intake Selection */}
          {wizardStep === 1 && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h3 className="text-sm font-bold text-slate-950">
                  Select Academic Session & Regulatory Quota
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Records will be validated against AICTE Approved Intake for this academic session.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Academic Session
                  </label>
                  <select
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-2xs"
                  >
                    <option value="2024-2025">2024-2025 (Current Enrolment)</option>
                    <option value="2023-2024">2023-2024 (Prior Session)</option>
                    <option value="2022-2023">2022-2023 (Historical)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Regulatory Standard
                  </label>
                  <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono">
                    AICTE APH 2024-25 §4
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setWizardStep(2)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <span>Continue to Upload Data</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Upload Data */}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-950">
                    Upload Student Data (CSV)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Upload an exported CSV or paste raw comma-separated records directly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLoadSampleData}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs text-blue-700 font-semibold font-mono transition-colors shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Load AICTE Synthetic Test Batch</span>
                </button>
              </div>

              {/* Paste or Drop Zone */}
              <div className="space-y-2">
                <textarea
                  rows={8}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder="Paste CSV rows here (including header row: apaarId,studentRollNumber,firstName,lastName,dateOfBirth,gender,category,courseCode)..."
                  className="w-full p-3.5 rounded-xl bg-white border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setWizardStep(1)}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-semibold"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Session</span>
                </button>

                <button
                  onClick={handleParseAndPreview}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Parsing & Detecting Columns...</span>
                    </>
                  ) : (
                    <>
                      <span>Parse & Validate Structure</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Column Mapping Review */}
          {wizardStep === 3 && previewData && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-950">
                  Automated Column Mapping Verification
                </h3>
                <p className="text-xs text-slate-500">
                  Confirm that the fields in your file correspond accurately to mandatory AICTE statutory schema attributes.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {Object.entries(previewData.detectedMapping || {}).map(([expected, source]: any) => (
                  <div key={expected} className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">{expected}</div>
                    <div className="text-xs font-bold text-emerald-700 font-mono mt-0.5 truncate">
                      ✓ {source}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setWizardStep(2)}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-semibold"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to File</span>
                </button>

                <button
                  onClick={() => setWizardStep(4)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <span>Review Pre-Validation Results</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Pre-validation & Preview */}
          {wizardStep === 4 && previewData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-950">
                    Pre-Ingestion Validation Inspection
                  </h3>
                  <p className="text-xs text-slate-500">
                    Inspecting {previewData.totalRows} candidate rows for Verhoeff syntax, format integrity, and duplicate flags.
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    {previewData.validCount} Structural Valid
                  </span>
                  {previewData.errorCount > 0 && (
                    <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                      {previewData.errorCount} Flagged
                    </span>
                  )}
                </div>
              </div>

              {/* Preview Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full enterprise-table text-left">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Roll Number</th>
                      <th>Student Name</th>
                      <th>APAAR ID</th>
                      <th>Course</th>
                      <th>Category</th>
                      <th>Validation Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.evaluatedRows?.slice(0, 8).map((row: any, idx: number) => (
                      <tr key={idx}>
                        <td>
                          {row.isValid ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-mono font-semibold">
                              <CheckCircle2 className="w-3 h-3" /> Valid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-rose-600 font-mono font-semibold">
                              <AlertTriangle className="w-3 h-3" /> Flagged
                            </span>
                          )}
                        </td>
                        <td className="font-mono text-xs text-slate-800">{row.studentRollNumber}</td>
                        <td className="font-semibold text-slate-950">
                          {row.firstName} {row.lastName}
                        </td>
                        <td className="font-mono text-xs text-slate-700">{row.apaarId}</td>
                        <td className="font-mono text-xs text-slate-500">{row.courseCode}</td>
                        <td>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                            {row.category}
                          </span>
                        </td>
                        <td className="text-[11px] text-slate-600">
                          {row.validationError || 'Verhoeff checksum passed'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {isProcessing && (
                <div className="space-y-1.5 py-2">
                  <div className="flex justify-between text-xs text-slate-600 font-mono">
                    <span>Committing Batch to Database Ledger...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setWizardStep(3)}
                  disabled={isProcessing}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-semibold"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Mapping</span>
                </button>

                <button
                  onClick={handleCommitBatch}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Commit Batch & Register Ledger</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Batch Success & Ledger Confirmation */}
          {wizardStep === 5 && batchResult && (
            <div className="space-y-4 py-4 text-center max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-950">
                  Batch Submission Confirmed & Anchored
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  Batch Reference: {batchResult.batchNumber}
                </p>
              </div>

              <div className="surface-subtle p-4 rounded-2xl border border-slate-200 text-left space-y-2 font-mono text-xs shadow-2xs">
                <div className="flex justify-between text-slate-600">
                  <span>Total Records Ingested:</span>
                  <span className="text-slate-950 font-bold">{batchResult.totalRecords}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Valid Records Activated:</span>
                  <span className="text-emerald-600 font-bold">{batchResult.validRecords}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Flagged for Review:</span>
                  <span className="text-amber-600 font-bold">{batchResult.flaggedRecords}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Cryptographic Ledger Hash:</span>
                  <span className="text-slate-800 truncate max-w-[180px]">
                    {batchResult.integrityHash?.slice(0, 16)}...
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveModule('students')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <span>Open Student Registry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setWizardStep(1);
                    setCsvText('');
                    setPreviewData(null);
                    setBatchResult(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-800 transition-colors shadow-2xs"
                >
                  Upload Another Batch
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BATCH HISTORY TABLE */}
      {activeTab === 'history' && (
        <div className="surface-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                Historical Academic Ingestion Batches
              </h3>
            </div>
            <button
              onClick={fetchBatchHistory}
              className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Refresh History"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${historyLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full enterprise-table text-left">
              <thead>
                <tr>
                  <th>Batch Reference</th>
                  <th>Session</th>
                  <th>Total</th>
                  <th>Valid</th>
                  <th>Flagged</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {batches.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-xs text-slate-500">
                      No historical batches recorded yet.
                    </td>
                  </tr>
                ) : (
                  batches.map((b) => (
                    <tr key={b.id}>
                      <td className="font-mono font-bold text-xs text-slate-950">
                        {b.batchNumber}
                      </td>
                      <td className="font-mono text-xs text-slate-600">{b.academicSession}</td>
                      <td className="font-mono text-xs text-slate-800">{b.totalRecords}</td>
                      <td className="font-mono text-xs text-emerald-600 font-semibold">{b.validRecords}</td>
                      <td className="font-mono text-xs text-amber-600 font-semibold">{b.flaggedRecords}</td>
                      <td>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                            b.status === 'VALIDATED' || b.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="text-xs text-slate-500 font-mono">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SINGLE MANUAL ENTRY */}
      {activeTab === 'manual' && (
        <div className="surface-card p-6 max-w-2xl mx-auto space-y-5">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-950">
              Single Student Admission Registration
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Directly enrol a single student with instant Verhoeff checksum validation and intake quota verification.
            </p>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  12-Digit APAAR ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="9874-5612-3450"
                  value={manualApaar}
                  onChange={(e) => setManualApaar(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Institutional Roll Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="2024-CSE-099"
                  value={manualRoll}
                  onChange={(e) => setManualRoll(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="First name"
                  value={manualFname}
                  onChange={(e) => setManualFname(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Last name"
                  value={manualLname}
                  onChange={(e) => setManualLname(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={manualDob}
                  onChange={(e) => setManualDob(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Gender *
                </label>
                <select
                  value={manualGender}
                  onChange={(e) => setManualGender(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-2xs"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="TRANSGENDER">Transgender</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Social Category *
                </label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-2xs"
                >
                  <option value="GENERAL">General</option>
                  <option value="OBC">OBC (Non-Creamy Layer)</option>
                  <option value="SC">Scheduled Caste (SC)</option>
                  <option value="ST">Scheduled Tribe (ST)</option>
                  <option value="EWS">Economically Weaker Section (EWS)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Approved Course Code *
                </label>
                <input
                  type="text"
                  required
                  value={manualCourseCode}
                  onChange={(e) => setManualCourseCode(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-2xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={manualSubmitting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
              >
                {manualSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Enrolling Record...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Submit & Register Record</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
