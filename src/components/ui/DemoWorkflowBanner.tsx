import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { useAuth } from '../../context/AuthContext';
import {
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export const DemoWorkflowBanner: React.FC = () => {
  const { sihStep, setSihStep, advanceSihStep, openWorkspace } = usePortal();
  const { switchDemoRole } = useAuth();

  const steps = [
    {
      num: 1,
      title: 'Sign in as Institution Administrator',
      desc: 'Assume DTU Institution Admin persona to manage intake & student data.',
      action: async () => {
        await switchDemoRole('INSTITUTION_ADMIN', '1-10928371');
        openWorkspace('institutions');
      },
      actionLabel: 'Switch to DTU Admin',
    },
    {
      num: 2,
      title: 'Upload Synthetic Student Batch',
      desc: 'Open Bulk Upload Assistant to inspect file schema, mapping & validation.',
      action: () => {
        openWorkspace('students');
      },
      actionLabel: 'Open Upload Assistant',
    },
    {
      num: 3,
      title: 'Inspect APAAR Field Validation',
      desc: 'Review syntax check, checksum verification and multi-tier duplicate flags.',
      action: () => {
        openWorkspace('apaar');
      },
      actionLabel: 'Inspect APAAR Engine',
    },
    {
      num: 4,
      title: 'Identify Intake Discrepancy Alert',
      desc: 'Detect +4 excess admissions breach in B.Tech CSE against approved sanction limit.',
      action: () => {
        openWorkspace('admissions');
      },
      actionLabel: 'View Admission Discrepancy',
    },
    {
      num: 5,
      title: 'Submit Correction or Review',
      desc: 'Correct invalid student record or submit explanation for compliance audit.',
      action: () => {
        openWorkspace('students');
      },
      actionLabel: 'View Correction Queue',
    },
    {
      num: 6,
      title: 'Sign in as Verification Officer',
      desc: 'Assume AICTE Central Verification Officer role to review flagged cases.',
      action: async () => {
        await switchDemoRole('VERIFICATION_OFFICER');
        openWorkspace('compliance');
      },
      actionLabel: 'Switch to Officer',
    },
    {
      num: 7,
      title: 'Review Evidence & Resolve Duplicate',
      desc: 'Inspect Priya Sharma concurrent enrolment across DTU & COEP; apply resolution.',
      action: () => {
        openWorkspace('duplicates');
      },
      actionLabel: 'Inspect Duplicate Case',
    },
    {
      num: 8,
      title: 'Inspect Updated Dashboard Metrics',
      desc: 'Verify that resolution updates national KPI metrics and capacity utilization in real time.',
      action: () => {
        openWorkspace('overview');
      },
      actionLabel: 'Check Overview HUD',
    },
    {
      num: 9,
      title: 'Verify Permitted Record Claim (QR)',
      desc: 'Scan or query student QR code with minimal disclosure of sensitive data.',
      action: () => {
        openWorkspace('verification');
      },
      actionLabel: 'Open Verification Portal',
    },
    {
      num: 10,
      title: 'Review Tamper-Evident Audit Trail',
      desc: 'Inspect SHA-256 cryptographic hash-chain across all recorded actions.',
      action: () => {
        openWorkspace('audit');
      },
      actionLabel: 'Inspect Audit Chain',
    },
    {
      num: 11,
      title: 'Export Compliance & Enrolment Report',
      desc: 'Generate authorized CSV export with full institutional and quota provenance.',
      action: () => {
        openWorkspace('reports');
      },
      actionLabel: 'Export AICTE Report',
    },
  ];

  const current = steps[sihStep - 1] || steps[0];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl glass-panel-elevated rounded-2xl px-5 py-3 border border-glass-border shadow-glass-panel">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Step Info */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-platinum text-midnight font-bold text-xs flex items-center justify-center font-mono shadow-[0_0_10px_rgba(212,215,220,0.4)]">
            {current.num}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-highlight-silver">
                {current.title}
              </span>
              <span className="text-[10px] text-liquid-silver font-mono">
                [Step {current.num} of 11]
              </span>
            </div>
            <p className="text-[11px] text-liquid-silver line-clamp-1 max-w-lg">
              {current.desc}
            </p>
          </div>
        </div>

        {/* Action button & navigation */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={current.action}
            className="px-3.5 py-1.5 rounded-lg bg-platinum hover:bg-white text-midnight font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>{current.actionLabel}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center border border-glass-border rounded-lg overflow-hidden bg-obsidian">
            <button
              disabled={sihStep <= 1}
              onClick={() => setSihStep(Math.max(1, sihStep - 1))}
              className="p-1.5 text-liquid-silver hover:text-highlight-silver hover:bg-graphite/40 disabled:opacity-30"
              title="Previous demonstration step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-[10px] text-liquid-silver font-mono">
              {sihStep}/11
            </span>
            <button
              disabled={sihStep >= 11}
              onClick={() => setSihStep(Math.min(11, sihStep + 1))}
              className="p-1.5 text-liquid-silver hover:text-highlight-silver hover:bg-graphite/40 disabled:opacity-30"
              title="Next demonstration step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
