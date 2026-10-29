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
  Search,
  Users,
  HelpCircle,
  Maximize2,
  Minimize2,
  Check,
} from 'lucide-react';

interface AcademicNavigatorProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const AcademicNavigatorPanel: React.FC<AcademicNavigatorProps> = ({
  isOpen,
  onToggle,
}) => {
  const { activeModule, openWorkspace } = usePortal();
  const [expandedDTU, setExpandedDTU] = useState(true);
  const [expandedCSE, setExpandedCSE] = useState(true);

  if (!isOpen) return null;

  return (
    <aside className="w-72 flex-shrink-0 hidden xl:flex flex-col rounded-[28px] liquid-glass-panel p-4 text-xs select-none transition-all duration-300 shadow-2xl">
      {/* Navigator Header (Exact match to Reference Image) */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
        <div className="flex items-center gap-2 text-white font-medium">
          <FolderTree className="w-4 h-4 text-white/80" />
          <span className="font-semibold tracking-tight">Navigator</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggle}
            className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            title="Close Navigator"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tree Hierarchy (Matches Reference Image Navigator structure) */}
      <div className="flex-1 overflow-y-auto space-y-1 py-1 pr-1 font-mono text-[11px]">
        {/* Root Node: AICTE Central */}
        <div className="flex items-center gap-1.5 py-1 px-1.5 rounded-lg text-white/90 hover:bg-white/10 cursor-pointer">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold">Central Academic Registry</span>
        </div>

        {/* Level 1: DTU */}
        <div className="ml-2.5 border-l border-white/15 pl-2 space-y-1">
          <div
            onClick={() => setExpandedDTU(!expandedDTU)}
            className="flex items-center justify-between py-1 px-1.5 rounded-lg text-white hover:bg-white/10 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-1.5 truncate">
              {expandedDTU ? <ChevronDown className="w-3 h-3 text-white/60" /> : <ChevronRight className="w-3 h-3 text-white/60" />}
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="truncate">DTU Delhi</span>
            </div>
            <span className="text-[9px] px-1 rounded bg-white/10 text-white/80">Code 101</span>
          </div>

          {/* Level 2: Departments */}
          {expandedDTU && (
            <div className="ml-3 border-l border-white/15 pl-2 space-y-1">
              {/* Department: CSE */}
              <div>
                <div
                  onClick={() => setExpandedCSE(!expandedCSE)}
                  className="flex items-center justify-between py-1 px-1 rounded-lg text-white/90 hover:bg-white/10 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {expandedCSE ? <ChevronDown className="w-3 h-3 text-white/60" /> : <ChevronRight className="w-3 h-3 text-white/60" />}
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span className="truncate">Dept. of Computer Science</span>
                  </div>
                </div>

                {expandedCSE && (
                  <div className="ml-3 border-l border-white/15 pl-2 space-y-0.5 text-[10px]">
                    <button
                      onClick={() => openWorkspace('students')}
                      className="w-full text-left py-1 px-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-between"
                    >
                      <span className="truncate">• B.Tech CSE (2024-25)</span>
                      <span className="text-emerald-400 font-bold">180/180</span>
                    </button>
                    <button
                      onClick={() => openWorkspace('compliance')}
                      className="w-full text-left py-1 px-1.5 rounded hover:bg-amber-500/20 text-amber-300 flex items-center justify-between"
                    >
                      <span className="truncate">• Excess Quota Case</span>
                      <span className="bg-amber-500/30 px-1 rounded">+4 Over</span>
                    </button>
                    <button
                      onClick={() => openWorkspace('submissions')}
                      className="w-full text-left py-1 px-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-between"
                    >
                      <span className="truncate">• M.Tech Software</span>
                      <span className="text-white/60">36/36</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Department: IT */}
              <div
                onClick={() => openWorkspace('admissions')}
                className="flex items-center justify-between py-1 px-1.5 rounded-lg text-white/80 hover:bg-white/10 cursor-pointer"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span className="truncate">Information Tech.</span>
                </div>
                <span className="text-[10px] text-white/60">120 Seats</span>
              </div>
            </div>
          )}

          {/* Level 1: Other Institutions */}
          <div
            onClick={() => openWorkspace('institutions')}
            className="flex items-center justify-between py-1 px-1.5 rounded-lg text-white/80 hover:bg-white/10 cursor-pointer"
          >
            <div className="flex items-center gap-1.5 truncate">
              <ChevronRight className="w-3 h-3 text-white/60" />
              <Building2 className="w-3.5 h-3.5 text-white/60" />
              <span className="truncate">COEP Pune</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">96%</span>
          </div>

          <div
            onClick={() => openWorkspace('institutions')}
            className="flex items-center justify-between py-1 px-1.5 rounded-lg text-white/80 hover:bg-white/10 cursor-pointer"
          >
            <div className="flex items-center gap-1.5 truncate">
              <ChevronRight className="w-3 h-3 text-white/60" />
              <Building2 className="w-3.5 h-3.5 text-white/60" />
              <span className="truncate">VIT Vellore</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">99%</span>
          </div>
        </div>
      </div>

      {/* Navigator Bottom Bar (Exact match to Reference Image) */}
      <div className="pt-2.5 border-t border-white/10 mt-auto flex items-center justify-between text-white/60 text-xs">
        <button className="p-1 rounded-lg hover:bg-white/10 hover:text-white" title="Filter Tree">
          <Search className="w-3.5 h-3.5" />
        </button>
        <button className="p-1 rounded-lg hover:bg-white/10 hover:text-white" title="Collaborators">
          <Users className="w-3.5 h-3.5" />
        </button>
        <button className="p-1 rounded-lg hover:bg-white/10 hover:text-white" title="Documentation">
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
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
    <aside className="w-72 flex-shrink-0 hidden 2xl:flex flex-col rounded-[28px] liquid-glass-panel p-4 text-xs select-none transition-all duration-300 shadow-2xl">
      {/* Inspector Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2 text-white font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="tracking-tight">Governance Inspector</span>
        </div>
        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          title="Close Inspector"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Inspector Cards (Matches Reference Image right sidebar structure) */}
      <div className="space-y-3 overflow-y-auto pr-1">
        {/* Card 1: Element Trigger / Verification Status */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-white/70 mb-2">
            <span className="font-semibold text-white">APAAR Attestation</span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded-full">
              98.2% Valid
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-white w-[98.2%]" />
          </div>
          <p className="text-[11px] text-white/60 leading-relaxed">
            DigiLocker API attestation and Verhoeff checksum verified for 2024-25 session.
          </p>
        </div>

        {/* Card 2: Regulatory Intake Limit */}
        <div
          onClick={() => openWorkspace('compliance')}
          className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-white">Intake Trigger</span>
            <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full font-bold">
              +4 Over Limit
            </span>
          </div>
          <p className="text-[11px] text-white/60 group-hover:text-white/90 transition-colors leading-relaxed">
            AICTE Approval Process Handbook (APH 2024-25) compliance discrepancy hearing scheduled.
          </p>
        </div>

        {/* Card 3: Audit Ledger State */}
        <div
          onClick={() => openWorkspace('audit')}
          className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-white">Chained Ledger</span>
            <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full">
              Block #10,482
            </span>
          </div>
          <p className="text-[11px] text-white/60 group-hover:text-white/90 transition-colors leading-relaxed">
            SHA-256 cryptographic chain validated intact.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>APH 2024-25</span>
        </span>
        <span className="text-white">Live Sync</span>
      </div>
    </aside>
  );
};
