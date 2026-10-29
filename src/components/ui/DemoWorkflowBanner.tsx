import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { useAuth } from '../../context/AuthContext';
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const DemoWorkflowBanner: React.FC = () => {
  const { sihStep, setSihStep, advanceSihStep, openWorkspace, setActiveModule } = usePortal();
  const { switchDemoRole } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const steps = [
    {
      num: 1,
      title: 'Sign in as Institution Administrator',
      desc: 'Assume DTU Institution Admin persona to manage intake & student data.',
      action: async () => {
        await switchDemoRole('INSTITUTION_ADMIN', '1-10928371');
        setActiveModule('institutions');
      },
      actionLabel: 'Switch to DTU Admin',
    },
    {
      num: 2,
      title: 'Upload Synthetic Student Batch',
      desc: 'Open Bulk Upload Assistant to inspect file schema, mapping & validation.',
      action: () => {
        setActiveModule('submissions');
      },
      actionLabel: 'Open Upload Assistant',
    },
    {
      num: 3,
      title: 'Inspect APAAR Field Validation',
      desc: 'Review syntax check, checksum verification and multi-tier duplicate flags.',
      action: () => {
        setActiveModule('apaar');
      },
      actionLabel: 'Inspect APAAR Engine',
    },
    {
      num: 4,
      title: 'Identify Intake Discrepancy Alert',
      desc: 'Detect +4 excess admissions breach in B.Tech CSE against approved sanction limit.',
      action: () => {
        setActiveModule('admissions');
      },
      actionLabel: 'View Admission Discrepancy',
    },
    {
      num: 5,
      title: 'Submit Correction or Review',
      desc: 'Correct invalid student record or submit explanation for compliance audit.',
      action: () => {
        setActiveModule('students');
      },
      actionLabel: 'View Correction Queue',
    },
    {
      num: 6,
      title: 'Sign in as Verification Officer',
      desc: 'Assume AICTE Central Verification Officer role to review flagged cases.',
      action: async () => {
        await switchDemoRole('VERIFICATION_OFFICER');
        setActiveModule('compliance');
      },
      actionLabel: 'Switch to Officer',
    },
    {
      num: 7,
      title: 'Review Evidence & Resolve Duplicate',
      desc: 'Inspect Priya Sharma concurrent enrolment across DTU & COEP; apply resolution.',
      action: () => {
        setActiveModule('duplicates');
      },
      actionLabel: 'Inspect Duplicate Case',
    },
    {
      num: 8,
      title: 'Inspect Updated Dashboard Metrics',
      desc: 'Verify that resolution updates national KPI metrics and capacity utilization in real time.',
      action: () => {
        setActiveModule('overview');
      },
      actionLabel: 'Check Executive Cockpit',
    },
    {
      num: 9,
      title: 'Verify Permitted Record Claim (QR)',
      desc: 'Scan or query student QR code with minimal disclosure of sensitive data.',
      action: () => {
        setActiveModule('verification');
      },
      actionLabel: 'Open Verification Portal',
    },
    {
      num: 10,
      title: 'Review Tamper-Evident Audit Trail',
      desc: 'Inspect SHA-256 cryptographic hash-chain across all recorded actions.',
      action: () => {
        setActiveModule('audit');
      },
      actionLabel: 'Inspect Audit Chain',
    },
    {
      num: 11,
      title: 'Export Compliance & Enrolment Report',
      desc: 'Generate authorized CSV export with full institutional and quota provenance.',
      action: () => {
        setActiveModule('reports');
      },
      actionLabel: 'Export AICTE Report',
    },
  ];

  const current = steps[sihStep - 1] || steps[0];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl select-none">
      <div className="surface-elevated rounded-xl px-4 py-2.5 border border-[#2B313C] shadow-2xl transition-all">
        <div className="flex items-center justify-between gap-3">
          {/* Step Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#D2D6DC] text-[#08090B] font-bold text-xs flex items-center justify-center font-mono shadow-sm">
              {current.num}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#F1F3F5] truncate">
                    {current.title}
                  </span>
                  <span className="text-[10px] text-[#929AA5] font-mono whitespace-nowrap">
                    [Evaluation Step {current.num}/11]
                  </span>
                </div>
                <p className="text-[11px] text-[#929AA5] truncate max-w-lg hidden sm:block">
                  {current.desc}
                </p>
              </div>
            )}
            {collapsed && (
              <span className="text-xs text-[#929AA5] font-mono">
                Evaluation Step {current.num}/11: {current.title}
              </span>
            )}
          </div>

          {/* Action button & navigation */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {!collapsed && (
              <button
                onClick={current.action}
                className="px-3 py-1.5 rounded-lg bg-[#D2D6DC] hover:bg-white text-[#08090B] font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>{current.actionLabel}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="flex items-center border border-[#262C36] rounded-lg overflow-hidden bg-[#111317]">
              <button
                disabled={sihStep <= 1}
                onClick={() => setSihStep(Math.max(1, sihStep - 1))}
                className="p-1.5 text-[#929AA5] hover:text-[#F1F3F5] hover:bg-[#1A1E24] disabled:opacity-30"
                title="Previous evaluation step"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-[10px] text-[#929AA5] font-mono">
                {sihStep}/11
              </span>
              <button
                disabled={sihStep >= 11}
                onClick={() => setSihStep(Math.min(11, sihStep + 1))}
                className="p-1.5 text-[#929AA5] hover:text-[#F1F3F5] hover:bg-[#1A1E24] disabled:opacity-30"
                title="Next evaluation step"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Collapse toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-md text-[#929AA5] hover:text-[#F1F3F5] hover:bg-[#1A1E24]"
              title={collapsed ? 'Expand guide' : 'Minimize guide'}
            >
              {collapsed ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
