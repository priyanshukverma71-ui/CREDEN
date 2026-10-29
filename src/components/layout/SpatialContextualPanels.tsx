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
    <aside className="w-72 flex-shrink-0 hidden xl:flex flex-col rounded-[28px] liquid-glass-panel p-4 text-xs select-none transition-all duration-300 shadow-xl">
      {/* Navigator Header (Exact match to Reference Image in Light Mode) */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-2">
        <div className="flex items-center gap-2 text-slate-900 font-medium">
          <FolderTree className="w-4 h-4 text-blue-600" />
          <span className="font-bold tracking-tight text-slate-950">Navigator</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggle}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
            title="Close Navigator"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tree Hierarchy (Matches Reference Image Navigator structure in Light Mode) */}
      <div className="flex-1 overflow-y-auto space-y-1 py-1 pr-1 font-mono text-[11px]">
        {/* Root Node: AICTE Central */}
        <div className="flex items-center gap-1.5 py-1 px-1.5 rounded-lg text-slate-900 hover:bg-slate-100/80 cursor-pointer">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
          <span className="font-bold">Central Academic Registry</span>
        </div>

        {/* Level 1: DTU */}
        <div className="ml-2.5 border-l border-slate-200 pl-2 space-y-1">
          <div
            onClick={() => setExpandedDTU(!expandedDTU)}
            className="flex items-center justify-between py-1 px-1.5 rounded-lg text-slate-900 hover:bg-slate-100/80 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-1.5 truncate">
              {expandedDTU ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="truncate font-semibold">DTU Delhi</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 border border-slate-200">Code 101</span>
          </div>

          {/* Level 2: Departments */}
          {expandedDTU && (
            <div className="ml-3 border-l border-slate-200 pl-2 space-y-1">
              {/* Department: CSE */}
              <div>
                <div
                  onClick={() => setExpandedCSE(!expandedCSE)}
                  className="flex items-center justify-between py-1 px-1 rounded-lg text-slate-800 hover:bg-slate-100/80 cursor-pointer font-medium"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {expandedCSE ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                    <span className="truncate">Dept. of Computer Science</span>
                  </div>
                </div>

                {expandedCSE && (
                  <div className="ml-3 border-l border-slate-200 pl-2 space-y-0.5 text-[10px]">
                    <button
                      onClick={() => openWorkspace('students')}
                      className="w-full text-left py-1 px-1.5 rounded hover:bg-slate-100 text-slate-700 hover:text-slate-950 flex items-center justify-between"
                    >
                      <span className="truncate font-medium">• B.Tech CSE (2024-25)</span>
                      <span className="text-emerald-600 font-bold">180/180</span>
                    </button>
                    <button
                      onClick={() => openWorkspace('compliance')}
                      className="w-full text-left py-1 px-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 flex items-center justify-between"
                    >
                      <span className="truncate font-semibold">• Excess Quota Case</span>
                      <span className="bg-amber-200/80 text-amber-900 px-1 rounded font-bold">+4 Over</span>
                    </button>
                    <button
                      onClick={() => openWorkspace('submissions')}
                      className="w-full text-left py-1 px-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-950 flex items-center justify-between"
                    >
                      <span className="truncate">• M.Tech Software</span>
                      <span className="text-slate-500">36/36</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Department: IT */}
              <div
                onClick={() => openWorkspace('admissions')}
                className="flex items-center justify-between py-1 px-1.5 rounded-lg text-slate-700 hover:bg-slate-100/80 cursor-pointer"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span className="truncate">Information Tech.</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">120 Seats</span>
              </div>
            </div>
          )}

          {/* Other Institutions */}
          <div
            onClick={() => openWorkspace('institutions')}
            className="flex items-center justify-between py-1 px-1.5 rounded-lg text-slate-700 hover:bg-slate-100/80 cursor-pointer"
          >
            <div className="flex items-center gap-1.5 truncate">
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">COEP Pune</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">96%</span>
          </div>

          <div
            onClick={() => openWorkspace('institutions')}
            className="flex items-center justify-between py-1 px-1.5 rounded-lg text-slate-700 hover:bg-slate-100/80 cursor-pointer"
          >
            <div className="flex items-center gap-1.5 truncate">
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">VIT Vellore</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">99%</span>
          </div>
        </div>
      </div>

      {/* Navigator Bottom Bar (Exact match to Reference Image in Light Mode) */}
      <div className="pt-2.5 border-t border-slate-200/80 mt-auto flex items-center justify-between text-slate-500 text-xs">
        <button className="p-1 rounded-lg hover:bg-slate-100 hover:text-slate-900" title="Filter Tree">
          <Search className="w-3.5 h-3.5" />
        </button>
        <button className="p-1 rounded-lg hover:bg-slate-100 hover:text-slate-900" title="Collaborators">
          <Users className="w-3.5 h-3.5" />
        </button>
        <button className="p-1 rounded-lg hover:bg-slate-100 hover:text-slate-900" title="Documentation">
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
    <aside className="w-72 flex-shrink-0 hidden 2xl:flex flex-col rounded-[28px] liquid-glass-panel p-4 text-xs select-none transition-all duration-300 shadow-xl">
      {/* Inspector Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
        <div className="flex items-center gap-2 text-slate-950 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="tracking-tight">Governance Inspector</span>
        </div>
        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
          title="Close Inspector"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Inspector Cards (Matches Reference Image right sidebar structure in Light Mode) */}
      <div className="space-y-3 overflow-y-auto pr-1">
        {/* Card 1: APAAR Attestation */}
        <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-700 mb-2">
            <span className="font-bold text-slate-900">APAAR Attestation</span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              98.2% Valid
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-[98.2%]" />
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            DigiLocker API attestation & Verhoeff checksum confirmed for active session.
          </p>
        </div>

        {/* Card 2: Regulatory Intake Limit */}
        <div
          onClick={() => openWorkspace('compliance')}
          className="p-3.5 rounded-2xl bg-white/90 border border-amber-200 hover:border-amber-400 transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-900">Intake Trigger</span>
            <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold border border-amber-300">
              +4 Over Limit
            </span>
          </div>
          <p className="text-[11px] text-slate-600 group-hover:text-slate-900 transition-colors leading-relaxed">
            AICTE Approval Process Handbook (APH 2024-25) compliance hearing scheduled.
          </p>
        </div>

        {/* Card 3: Audit Ledger State */}
        <div
          onClick={() => openWorkspace('audit')}
          className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 hover:border-blue-400 transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-900">Chained Ledger</span>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200 font-bold">
              Block #10,482
            </span>
          </div>
          <p className="text-[11px] text-slate-600 group-hover:text-slate-900 transition-colors leading-relaxed">
            SHA-256 cryptographic chain validated intact.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>APH 2024-25</span>
        </span>
        <span className="text-slate-900 font-semibold">Live Sync</span>
      </div>
    </aside>
  );
};
