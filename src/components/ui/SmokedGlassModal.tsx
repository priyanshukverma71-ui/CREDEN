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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-midnight/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl glass-panel-elevated border border-glass-border-bright shadow-glass-panel overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-glass-border bg-obsidian/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-liquid-silver hover:text-highlight-silver hover:bg-graphite/50 transition-colors"
              title="Return to spatial flight overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-highlight-silver tracking-tight">
                  {title}
                </h3>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-graphite/80 text-platinum border border-glass-border">
                  AICTE Portal
                </span>
              </div>
              {subtitle && (
                <p className="text-xs text-liquid-silver mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-liquid-silver hover:text-white hover:bg-graphite/60 transition-colors"
            title="Close workspace (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};
