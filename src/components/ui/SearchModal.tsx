import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePortal } from '../../context/PortalContext';
import { ModuleId } from '../../types';
import { Search, X, Building, Users, FileText, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const { setActiveModule } = usePortal();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || !token) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const [studRes, instRes] = await Promise.all([
          fetch(`/api/students?search=${encodeURIComponent(query)}&limit=5`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`/api/institutions?search=${encodeURIComponent(query)}&limit=5`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const items: any[] = [];
        if (studRes.ok) {
          const sData = await studRes.json();
          sData.data?.forEach((s: any) =>
            items.push({
              type: 'student',
              title: `${s.firstName} ${s.lastName}`,
              subtitle: `Roll: ${s.studentRollNumber} • APAAR: ${s.maskedApaarId || s.apaarId}`,
              moduleId: 'students' as ModuleId,
            })
          );
        }

        if (instRes.ok) {
          const iData = await instRes.json();
          iData.data?.forEach((i: any) =>
            items.push({
              type: 'institution',
              title: i.name,
              subtitle: `Code: ${i.code} • ${i.state}`,
              moduleId: 'institutions' as ModuleId,
            })
          );
        }

        setResults(items);
      } catch (e) {
        console.error(e);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, token]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/30 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl liquid-glass-window rounded-2xl shadow-2xl overflow-hidden border border-white/80">
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200/80 bg-white/70">
          <Search className="w-4 h-4 text-slate-500 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Search students, roll numbers, institutions, AICTE codes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto p-2 divide-y divide-slate-100 bg-white/50">
          {query.trim() && results.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-6 font-mono">
              No records found matching "{query}"
            </p>
          )}

          {!query.trim() && (
            <div className="p-5 text-center text-xs text-slate-500">
              Type an APAAR ID, student name, or institution code to search...
            </div>
          )}

          {results.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                setActiveModule(item.moduleId);
                onClose();
              }}
              className="p-3 rounded-xl hover:bg-white/90 transition-all flex items-center justify-between cursor-pointer group shadow-2xs hover:shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
                  {item.type === 'student' ? (
                    <Users className="w-4 h-4" />
                  ) : (
                    <Building className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">{item.subtitle}</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-0.5 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
