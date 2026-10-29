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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl surface-elevated rounded-xl border border-[#2B313C] shadow-2xl overflow-hidden">
        <div className="flex items-center px-4 py-3 border-b border-[#22262C] bg-[#111317]">
          <Search className="w-4 h-4 text-[#929AA5] mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Search students, roll numbers, institutions, AICTE codes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-[#F1F3F5] placeholder:text-[#7B8390] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-[#929AA5] hover:text-[#F1F3F5] hover:bg-[#1A1E24]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto p-2 divide-y divide-[#1D2128]">
          {query.trim() && results.length === 0 && (
            <p className="text-xs text-[#7B8390] text-center py-6 font-mono">
              No records found matching "{query}"
            </p>
          )}

          {!query.trim() && (
            <div className="p-4 text-center text-xs text-[#7B8390]">
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
              className="p-2.5 rounded-lg hover:bg-[#1A1E24] transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-[#16191F] border border-[#262C36] text-[#D2D6DC]">
                  {item.type === 'student' ? (
                    <Users className="w-3.5 h-3.5" />
                  ) : (
                    <Building className="w-3.5 h-3.5" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#F1F3F5]">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#929AA5] font-mono">{item.subtitle}</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#7B8390]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
