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
  const { openWorkspace } = usePortal();
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-midnight/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl glass-panel-elevated rounded-2xl border border-glass-border-bright shadow-glass-panel overflow-hidden">
        <div className="flex items-center px-4 py-3 border-b border-glass-border bg-obsidian">
          <Search className="w-4 h-4 text-liquid-silver mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Search students, roll numbers, institutions, AICTE codes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-highlight-silver placeholder:text-liquid-silver focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-liquid-silver hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto p-2 divide-y divide-glass-border/30">
          {query.trim() && results.length === 0 && (
            <p className="text-xs text-liquid-silver text-center py-6">
              No records found matching "{query}"
            </p>
          )}

          {results.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                openWorkspace(item.moduleId);
                onClose();
              }}
              className="p-2.5 rounded-lg hover:bg-graphite/50 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {item.type === 'student' ? (
                  <Users className="w-4 h-4 text-platinum" />
                ) : (
                  <Building className="w-4 h-4 text-platinum" />
                )}
                <div>
                  <div className="text-xs font-semibold text-highlight-silver">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-liquid-silver">{item.subtitle}</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-liquid-silver" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
