import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  ChevronRight,
  ChevronDown,
  Building2,
  FolderTree,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  Database,
  Sliders,
  Layers,
  X,
  Sparkles,
} from 'lucide-react';

interface AcademicNavigatorProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const AcademicNavigatorPanel: React.FC<AcademicNavigatorProps> = ({
  isOpen,
  onToggle,
}) => {
  const { activeModule, setActiveModule, openWorkspace } = usePortal();
  const [expandedInst, setExpandedInst] = useState<string>('dtu');

  if (!isOpen) return null;

  return (
    <aside className="w-64 flex-shrink-0 hidden xl:flex flex-col rounded-3xl bg-[#13161B]/90 backdrop-blur-xl border border-[#D7DBE2]/20 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-4 text-xs select-none transition-all duration-300">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#303642] mb-3">
        <div className="flex items-center gap-2 text-[#F2F4F7] font-semibold">
          <FolderTree className="w-4 h-4 text-[#D7DBE2]" />
          <span>Academic Navigator</span>
        </div>
        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-[#1E232B] text-[#A6AFBB] hover:text-[#F2F4F7]"
          title="Collapse Navigator"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Institutional Tree Structure */}
      <div className="space-y-2 overflow-y-auto pr-1 text-xs">
        {/* Level 1: National Central Portal */}
        <div>
          <div className="flex items-center gap-1.5 text-[#A6AFBB] font-mono text-[11px] mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>AICTE Central Portal</span>
          </div>

          {/* Institution: DTU */}
          <div className="ml-2 border-l border-[#303642] pl-2 space-y-1">
            <button
              onClick={() => setExpandedInst(expandedInst === 'dtu' ? '' : 'dtu')}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-[#1C2027] text-left text-[#F2F4F7] font-medium transition-colors"
            >
              <div className="flex items-center gap-1.5 truncate">
                <Building2 className="w-3.5 h-3.5 text-[#D7DBE2]" />
                <span className="truncate">DTU Delhi</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#A6AFBB] transition-transform ${
                  expandedInst === 'dtu' ? '' : '-rotate-90'
                }`}
              />
            </button>

            {expandedInst === 'dtu' && (
              <div className="ml-3 border-l border-[#303642] pl-2 space-y-1 text-[11px] text-[#A6AFBB]">
                <button
                  onClick={() => openWorkspace('admissions')}
                  className="w-full text-left px-2 py-1 rounded-lg hover:bg-[#1E232B] hover:text-[#F2F4F7] flex items-center justify-between"
                >
                  <span className="truncate">B.Tech Computer Science</span>
                  <span className="text-[10px] font-mono text-emerald-400">180/180</span>
                </button>
                <button
                  onClick={() => openWorkspace('compliance')}
                  className="w-full text-left px-2 py-1 rounded-lg hover:bg-[#1E232B] hover:text-[#F2F4F7] flex items-center justify-between"
                >
                  <span className="truncate">Information Technology</span>
                  <span className="text-[10px] font-mono text-amber-400">+4 Over</span>
                </button>
                <button
                  onClick={() => openWorkspace('students')}
                  className="w-full text-left px-2 py-1 rounded-lg hover:bg-[#1E232B] hover:text-[#F2F4F7] flex items-center justify-between"
                >
                  <span className="truncate">Mechanical Eng.</span>
                  <span className="text-[10px] font-mono text-emerald-400">120/120</span>
                </button>
              </div>
            )}

            {/* Institution: COEP Pune */}
            <div className="w-full flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-[#1C2027] text-left text-[#A6AFBB] font-medium transition-colors cursor-pointer">
              <div className="flex items-center gap-1.5 truncate">
                <Building2 className="w-3.5 h-3.5 text-[#A6AFBB]" />
                <span className="truncate">COEP Pune</span>
              </div>
              <span className="text-[10px] font-mono px-1 rounded bg-[#181C22]">96%</span>
            </div>

            {/* Institution: VIT Vellore */}
            <div className="w-full flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-[#1C2027] text-left text-[#A6AFBB] font-medium transition-colors cursor-pointer">
              <div className="flex items-center gap-1.5 truncate">
                <Building2 className="w-3.5 h-3.5 text-[#A6AFBB]" />
                <span className="truncate">VIT Vellore</span>
              </div>
              <span className="text-[10px] font-mono px-1 rounded bg-[#181C22]">99%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Session Pill */}
      <div className="mt-auto pt-3 border-t border-[#303642] flex items-center justify-between text-[11px] text-[#A6AFBB]">
        <span>Academic Session</span>
        <span className="font-mono text-[#D7DBE2] font-semibold">2024-2025</span>
      </div>
    </aside>
  );
};

interface GovernanceInspectorProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const GovernanceInspectorPanel: React.FC<GovernanceInspectorProps> = ({
  isOpen,
  onToggle,
}) => {
  const { openWorkspace } = usePortal();

  if (!isOpen) return null;

  return (
    <aside className="w-68 flex-shrink-0 hidden 2xl:flex flex-col rounded-3xl bg-[#13161B]/90 backdrop-blur-xl border border-[#D7DBE2]/20 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-4 text-xs select-none transition-all duration-300">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#303642] mb-3">
        <div className="flex items-center gap-2 text-[#F2F4F7] font-semibold">
          <ShieldCheck className="w-4 h-4 text-[#D7DBE2]" />
          <span>Governance Inspector</span>
        </div>
        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-[#1E232B] text-[#A6AFBB] hover:text-[#F2F4F7]"
          title="Collapse Inspector"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Inspector Metric Cards */}
      <div className="space-y-3 overflow-y-auto pr-1">
        {/* Metric 1: APAAR Attestation Rate */}
        <div className="p-3 rounded-2xl bg-[#07080A]/60 border border-[#303642]">
          <div className="flex items-center justify-between text-[11px] text-[#A6AFBB] mb-1">
            <span>APAAR Validation</span>
            <span className="font-mono text-emerald-400 font-bold">98.2%</span>
          </div>
          <div className="h-1.5 w-full bg-[#1A1F26] rounded-full overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-[#A6AFBB] to-[#D7DBE2] w-[98.2%]" />
          </div>
          <p className="text-[10px] text-[#A6AFBB]">
            DigiLocker & ABC registry cryptographic attestation confirmed.
          </p>
        </div>

        {/* Metric 2: Excess Intake Discrepancy */}
        <div
          onClick={() => openWorkspace('compliance')}
          className="p-3 rounded-2xl bg-[#07080A]/60 border border-[#303642] hover:border-amber-400/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-[#A6AFBB]">Intake Compliance</span>
            <span className="font-mono text-amber-400 font-bold">+4 Seats</span>
          </div>
          <p className="text-[10px] text-[#A6AFBB] group-hover:text-[#F2F4F7] transition-colors">
            1 active discrepancy under AICTE hearing review for DTU CSE.
          </p>
        </div>

        {/* Metric 3: Cryptographic Ledger State */}
        <div
          onClick={() => openWorkspace('audit')}
          className="p-3 rounded-2xl bg-[#07080A]/60 border border-[#303642] hover:border-[#D7DBE2]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-[#A6AFBB]">Audit Ledger</span>
            <span className="font-mono text-[#D7DBE2] font-bold">#10,482</span>
          </div>
          <p className="text-[10px] text-[#A6AFBB] group-hover:text-[#F2F4F7] transition-colors">
            SHA-256 block chain verified intact. Zero tamper events detected.
          </p>
        </div>
      </div>

      {/* Footer Status */}
      <div className="mt-auto pt-3 border-t border-[#303642] flex items-center justify-between text-[10px] text-[#A6AFBB]">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Registry Active</span>
        </div>
        <span className="font-mono text-[#D7DBE2]">APH 2024-25</span>
      </div>
    </aside>
  );
};
