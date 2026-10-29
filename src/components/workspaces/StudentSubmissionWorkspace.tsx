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
    <div className="space-y-4">
      {/* Workspace Header */}
      <div className="surface-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-[#D2D6DC]" />
            <h2 className="text-base font-bold text-[#F1F3F5] tracking-tight">
              Student Data Submission & Ingestion Gateway
            </h2>
          </div>
          <p className="text-xs text-[#929AA5] mt-1">
            Standardised AICTE academic session ingestion, automated Verhoeff checksum validation, and statutory intake compliance checks.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="/api/uploads/template-csv"
            download="aicte_student_upload_template.csv"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181B22] hover:bg-[#20252E] border border-[#282E37] text-xs text-[#D2D6DC] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Template</span>
          </a>

          {/* Tab buttons */}
          <div className="flex items-center p-1 rounded-lg bg-[#111317] border border-[#22262C]">
            <button
              onClick={() => setActiveTab('wizard')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'wizard'
                  ? 'bg-[#1C2027] text-[#F1F3F5] shadow-sm'
                  : 'text-[#929AA5] hover:text-[#D2D6DC]'
              }`}
            >
              Batch Wizard
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-[#1C2027] text-[#F1F3F5] shadow-sm'
                  : 'text-[#929AA5] hover:text-[#D2D6DC]'
              }`}
            >
              Batch History
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'manual'
                  ? 'bg-[#1C2027] text-[#F1F3F5] shadow-sm'
                  : 'text-[#929AA5] hover:text-[#D2D6DC]'
              }`}
            >
              Single Entry
            </button>
          </div>
        </div>
      </div>

      {/* Error / Success Banners */}
      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-xs hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {manualSuccessMsg && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{manualSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActiveModule('students')}
            className="text-xs underline font-mono ml-4"
          >
            View in Student Registry
          </button>
        </div>
      )}

      {/* TAB 1: BATCH INGESTION WIZARD */}
      {activeTab === 'wizard' && (
        <div className="surface-card p-5 space-y-5">
          {/* Stepper Progress Bar */}
          <div className="flex items-center justify-between border-b border-[#22262C] pb-4">
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
                  wizardStep >= s.num ? 'text-[#F1F3F5]' : 'text-[#5A6270]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    wizardStep === s.num
                      ? 'bg-[#D2D6DC] text-[#08090B]'
                      : wizardStep > s.num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#1A1E24] text-[#7B8390] border border-[#282E37]'
                  }`}
                >
                  {wizardStep > s.num ? '✓' : s.num}
                </div>
                <span className="hidden sm:inline font-medium">{s.title}</span>
                {s.num < 5 && <div className="hidden md:block w-8 h-[1px] bg-[#22262C] ml-2" />}
              </div>
            ))}
          </div>

          {/* Step 1: Session & Intake Selection */}
          {wizardStep === 1 && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h3 className="text-sm font-semibold text-[#F1F3F5]">
                  Select Academic Session & Regulatory Quota
                </h3>
                <p className="text-xs text-[#929AA5] mt-0.5">
                  Records will be validated against AICTE Approved Intake for this academic session.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#D2D6DC] mb-1">
                    Academic Session
                  </label>
                  <select
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#16191F] border border-[#282E37] text-xs text-[#F1F3F5] focus:outline-none"
                  >
                    <option value="2024-2025">2024-2025 (Current Enrolment)</option>
                    <option value="2023-2024">2023-2024 (Prior Session)</option>
                    <option value="2022-2023">2022-2023 (Historical)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#D2D6DC] mb-1">
                    Regulatory Standard
                  </label>
                  <div className="px-3 py-2 rounded-lg bg-[#111317] border border-[#22262C] text-xs text-[#929AA5] font-mono">
                    AICTE APH 2024-25 §4
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setWizardStep(2)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D2D6DC] hover:bg-white text-[#08090B] text-xs font-bold transition-colors"
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
                  <h3 className="text-sm font-semibold text-[#F1F3F5]">
                    Upload Student Data (CSV)
                  </h3>
                  <p className="text-xs text-[#929AA5]">
                    Upload an exported CSV or paste raw comma-separated records directly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLoadSampleData}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1E24] hover:bg-[#222730] border border-[#2E3541] text-xs text-[#D2D6DC] font-mono transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
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
                  className="w-full p-3 rounded-xl bg-[#0D0F12] border border-[#22262C] font-mono text-xs text-[#F1F3F5] focus:outline-none focus:border-[#D2D6DC]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setWizardStep(1)}
                  className="flex items-center gap-1 text-xs text-[#929AA5] hover:text-[#F1F3F5]"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Session</span>
                </button>

                <button
                  onClick={handleParseAndPreview}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D2D6DC] hover:bg-white text-[#08090B] text-xs font-bold transition-colors disabled:opacity-50"
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
                <h3 className="text-sm font-semibold text-[#F1F3F5]">
                  Automated Column Mapping Verification
                </h3>
                <p className="text-xs text-[#929AA5]">
                  Confirm that the fields in your file correspond accurately to mandatory AICTE statutory schema attributes.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {Object.entries(previewData.detectedMapping || {}).map(([expected, source]: any) => (
                  <div key={expected} className="p-2.5 rounded-lg bg-[#111317] border border-[#22262C]">
                    <div className="text-[10px] text-[#929AA5] uppercase font-mono">{expected}</div>
                    <div className="text-xs font-semibold text-emerald-400 font-mono mt-0.5 truncate">
                      ✓ {source}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setWizardStep(2)}
                  className="flex items-center gap-1 text-xs text-[#929AA5] hover:text-[#F1F3F5]"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to File</span>
                </button>

                <button
                  onClick={() => setWizardStep(4)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D2D6DC] hover:bg-white text-[#08090B] text-xs font-bold transition-colors"
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
                  <h3 className="text-sm font-semibold text-[#F1F3F5]">
                    Pre-Ingestion Validation Inspection
                  </h3>
                  <p className="text-xs text-[#929AA5]">
                    Inspecting {previewData.totalRows} candidate rows for Verhoeff syntax, format integrity, and duplicate flags.
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {previewData.validCount} Structural Valid
                  </span>
                  {previewData.errorCount > 0 && (
                    <span className="px-2 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {previewData.errorCount} Flagged
                    </span>
                  )}
                </div>
              </div>

              {/* Preview Table */}
              <div className="overflow-x-auto rounded-xl border border-[#22262C] bg-[#111317]">
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
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                              <CheckCircle2 className="w-3 h-3" /> Valid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 font-mono">
                              <AlertTriangle className="w-3 h-3" /> Flagged
                            </span>
                          )}
                        </td>
                        <td className="font-mono text-xs">{row.studentRollNumber}</td>
                        <td className="font-medium text-[#F1F3F5]">
                          {row.firstName} {row.lastName}
                        </td>
                        <td className="font-mono text-xs text-[#D2D6DC]">{row.apaarId}</td>
                        <td className="font-mono text-xs text-[#929AA5]">{row.courseCode}</td>
                        <td>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1C2027] text-[#D2D6DC] border border-[#2B313C] font-mono">
                            {row.category}
                          </span>
                        </td>
                        <td className="text-[11px] text-[#929AA5]">
                          {row.validationError || 'Verhoeff checksum passed'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {isProcessing && (
                <div className="space-y-1 py-2">
                  <div className="flex justify-between text-xs text-[#929AA5] font-mono">
                    <span>Committing Batch to Database Ledger...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1A1E24] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setWizardStep(3)}
                  disabled={isProcessing}
                  className="flex items-center gap-1 text-xs text-[#929AA5] hover:text-[#F1F3F5]"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Mapping</span>
                </button>

                <button
                  onClick={handleCommitBatch}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
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
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F1F3F5]">
                  Batch Submission Confirmed & Anchored
                </h3>
                <p className="text-xs text-[#929AA5] mt-1 font-mono">
                  Batch Reference: {batchResult.batchNumber}
                </p>
              </div>

              <div className="surface-subtle p-3 rounded-xl border border-[#22262C] text-left space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-[#929AA5]">
                  <span>Total Records Ingested:</span>
                  <span className="text-[#F1F3F5] font-bold">{batchResult.totalRecords}</span>
                </div>
                <div className="flex justify-between text-[#929AA5]">
                  <span>Valid Records Activated:</span>
                  <span className="text-emerald-400 font-bold">{batchResult.validRecords}</span>
                </div>
                <div className="flex justify-between text-[#929AA5]">
                  <span>Flagged for Review:</span>
                  <span className="text-amber-400 font-bold">{batchResult.flaggedRecords}</span>
                </div>
                <div className="flex justify-between text-[#929AA5]">
                  <span>Cryptographic Ledger Hash:</span>
                  <span className="text-[#D2D6DC] truncate max-w-[180px]">
                    {batchResult.integrityHash?.slice(0, 16)}...
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveModule('students')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D2D6DC] hover:bg-white text-[#08090B] text-xs font-bold transition-colors"
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
                  className="px-4 py-2 rounded-lg bg-[#181B22] hover:bg-[#20252E] border border-[#282E37] text-xs text-[#D2D6DC] transition-colors"
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
        <div className="surface-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#22262C]">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#D2D6DC]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F1F3F5] font-mono">
                Historical Academic Ingestion Batches
              </h3>
            </div>
            <button
              onClick={fetchBatchHistory}
              className="p-1 rounded text-[#929AA5] hover:text-[#F1F3F5]"
              title="Refresh History"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${historyLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#22262C] bg-[#111317]">
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
                    <td colSpan={7} className="text-center py-6 text-xs text-[#7B8390]">
                      No historical batches recorded yet.
                    </td>
                  </tr>
                ) : (
                  batches.map((b) => (
                    <tr key={b.id}>
                      <td className="font-mono font-semibold text-xs text-[#D2D6DC]">
                        {b.batchNumber}
                      </td>
                      <td className="font-mono text-xs">{b.academicSession}</td>
                      <td className="font-mono text-xs">{b.totalRecords}</td>
                      <td className="font-mono text-xs text-emerald-400">{b.validRecords}</td>
                      <td className="font-mono text-xs text-amber-400">{b.flaggedRecords}</td>
                      <td>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                            b.status === 'VALIDATED' || b.status === 'APPROVED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="text-xs text-[#929AA5] font-mono">
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
        <div className="surface-card p-5 max-w-2xl mx-auto space-y-4">
          <div className="pb-3 border-b border-[#22262C]">
            <h3 className="text-sm font-semibold text-[#F1F3F5]">
              Single Student Admission Registration
            </h3>
            <p className="text-xs text-[#929AA5] mt-0.5">
              Directly enrol a single student with instant Verhoeff checksum validation and intake quota verification.
            </p>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#D2D6DC] mb-1">
                  12-Digit APAAR ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="9874-5612-3450"
                  value={manualApaar}
                  onChange={(e) => setManualApaar(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#16191F] border border-[#282E37] text-xs font-mono text-[#F1F3F5] focus:outline-none focus:border-[#D2D6DC]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#D2D6DC] mb-1">
                  Institutional Roll Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="2024-CSE-099"
                  value={manualRoll}
                  onChange={(e) => setManualRoll(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#16191F] border border-[#282E37] text-xs font-mono text-[#F1F3F5] focus:outline-none focus:border-[#D2D6DC]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D2D6DC] mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="First name"
                  value={manualFname}
                  onChange={(e) => setManualFname(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#16191F] border border-[#282E37] text-xs text-[#F1F3F5] focus:outline-none focus:border-[#D2D6DC]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#D2D6DC] mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Last name"
                  value={manualLname}
                  onChange={(e) => setManualLname(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#16191F] border border-[#282E37] text-xs text-[#F1F3F5] focus:outline-none focus:border-[#D2D6DC]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D2D6DC] mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={manualDob}
                  onChange={(e) => setManualDob(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#16191F] border border-[#282E37] text-xs font-mono text-[#F1F3F5] focus:outline-none focus:border-[#D2D6DC]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#D2D6DC] mb-1">
                  Gender *
                </label>
                <select
                  value={manualGender}
                  onChange={(e) => setManualGender(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#16191F] border border-[#282E37] text-xs text-[#F1F3F5] focus:outline-none"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="TRANSGENDER">Transgender</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D2D6DC] mb-1">
                  Social Category *
                </label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#16191F] border border-[#282E37] text-xs text-[#F1F3F5] focus:outline-none"
                >
                  <option value="GENERAL">General</option>
                  <option value="OBC">OBC (Non-Creamy Layer)</option>
                  <option value="SC">Scheduled Caste (SC)</option>
                  <option value="ST">Scheduled Tribe (ST)</option>
                  <option value="EWS">Economically Weaker Section (EWS)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#D2D6DC] mb-1">
                  Approved Course Code *
                </label>
                <input
                  type="text"
                  required
                  value={manualCourseCode}
                  onChange={(e) => setManualCourseCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#16191F] border border-[#282E37] text-xs font-mono text-[#F1F3F5] focus:outline-none focus:border-[#D2D6DC]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={manualSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D2D6DC] hover:bg-white text-[#08090B] text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
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
