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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0D1016]/95 border border-[#2B313C] shadow-2xl overflow-hidden backdrop-blur-xl animate-in zoom-in-95 slide-in-from-bottom-5 duration-250 ease-out">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#22262C] bg-[#11141B]/90 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#929AA5] hover:text-[#F1F3F5] hover:bg-[#1A1E24] transition-colors flex-shrink-0"
              title="Return to 3D Space (Esc)"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[#F1F3F5] tracking-tight truncate">
                  {title}
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#1C2027] text-[#D2D6DC] border border-[#2B313C] flex-shrink-0">
                  AICTE Platform
                </span>
              </div>
              {subtitle && (
                <p className="text-xs text-[#929AA5] mt-0.5 truncate hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#929AA5] hover:text-white hover:bg-[#1C2027] transition-colors flex-shrink-0 ml-2"
            title="Close workspace (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
