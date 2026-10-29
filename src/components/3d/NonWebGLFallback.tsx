import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { ModuleId } from '../../types';
import { OverviewHUD } from '../ui/OverviewHUD';
import {
  Building2,
  FileUp,
  IdCard,
  BarChart3,
  Users,
  ShieldCheck,
  FileCheck2,
  TrendingUp,
  Lock,
  Cpu,
  ArrowRight,
} from 'lucide-react';

export const NonWebGLFallback: React.FC = () => {
  const { openWorkspace } = usePortal();

  const modules = [
    {
      id: 'institutions' as ModuleId,
      title: 'Institution Management',
      subtitle: 'Manage approved institutions, programmes and authorized users',
      icon: Building2,
    },
    {
      id: 'students' as ModuleId,
      title: 'Student Data Submission',
      subtitle: 'Upload and manage student admission records',
      icon: FileUp,
    },
    {
      id: 'apaar' as ModuleId,
      title: 'APAAR ID Validation',
      subtitle: 'Validate APAAR IDs and check authenticity',
      icon: IdCard,
    },
    {
      id: 'admissions' as ModuleId,
      title: 'Admission Monitoring',
      subtitle: 'Track intake and enrolment status',
      icon: BarChart3,
    },
    {
      id: 'duplicates' as ModuleId,
      title: 'Duplicate Record Detection',
      subtitle: 'Identify and resolve duplicate entries',
      icon: Users,
    },
    {
      id: 'compliance' as ModuleId,
      title: 'Compliance Monitoring',
      subtitle: 'Monitor regulatory compliance and discrepancies',
      icon: ShieldCheck,
    },
    {
      id: 'verification' as ModuleId,
      title: 'Student Verification',
      subtitle: 'Verify student records and documentation',
      icon: FileCheck2,
    },
    {
      id: 'reports' as ModuleId,
      title: 'Reports & Analytics',
      subtitle: 'Generate reports and visual insights',
      icon: TrendingUp,
    },
    {
      id: 'audit' as ModuleId,
      title: 'Audit & Security',
      subtitle: 'Track system activities and verify integrity',
      icon: Lock,
    },
    {
      id: 'integration' as ModuleId,
      title: 'System Integration',
      subtitle: 'Manage external integrations and API gateways',
      icon: Cpu,
    },
  ];

  return (
    <div className="pt-24 pb-28 px-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Overview HUD */}
      <OverviewHUD />

      {/* Grid of Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase font-mono">
            National Technical Governance Modules
          </h3>
          <span className="text-xs text-slate-500 font-mono">11 Active AICTE Bureaus</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => openWorkspace(m.id)}
                className="liquid-glass-panel rounded-3xl p-5 border border-white/80 hover:border-blue-400 transition-all cursor-pointer group hover:-translate-y-1 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:text-white group-hover:bg-slate-900 transition-all shadow-xs">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-950 group-hover:text-blue-600 transition-colors">
                  {m.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {m.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
