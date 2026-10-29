import React, { useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';

interface SmokedGlassModalProps {
  title: string;
  subtitle?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const SmokedGlassModal: React.FC<SmokedGlassModalProps> = ({
  title,
  subtitle,
  isOpen,
  onClose,
  children,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        // Close when clicking directly on the backdrop outside the modal
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-900/30 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl liquid-glass-window shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-250 ease-out border border-white/80">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 bg-white/70 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex-shrink-0"
              title="Return to 3D Space (Esc)"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-950 tracking-tight truncate">
                  {title}
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex-shrink-0">
                  AICTE Platform
                </span>
              </div>
              {subtitle && (
                <p className="text-xs text-slate-500 mt-0.5 truncate hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors flex-shrink-0 ml-2"
            title="Close workspace (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {children}
        </div>
      </div>
    </div>
  );
};
