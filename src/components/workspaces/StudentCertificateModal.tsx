import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Download, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface StudentCertificateModalProps {
  studentId: string;
  onClose: () => void;
}

export const StudentCertificateModal: React.FC<StudentCertificateModalProps> = ({
  studentId,
  onClose,
}) => {
  const { token } = useAuth();
  const [cert, setCert] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !studentId) return;
    const fetchCert = async () => {
      try {
        const res = await fetch(`/api/students/${studentId}/certificate`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCert(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [token, studentId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md">
        <div className="liquid-glass-panel rounded-2xl p-6 text-center text-xs text-slate-600">
          Loading certificate verification data...
        </div>
      </div>
    );
  }

  if (!cert) return null;

  const qrPayload = JSON.stringify({
    ref: cert.verificationRef,
    apaar: cert.maskedApaarId,
    name: cert.studentName,
    roll: cert.studentRollNumber,
    sig: cert.digitalSignature,
    auth: 'AICTE-GOV-IN'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white text-slate-900 rounded-3xl border border-slate-200 p-8 shadow-2xl relative space-y-6">
        {/* Controls Header (Hidden in print) */}
        <div className="flex items-center justify-between no-print pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-bold text-slate-950">
              AICTE Academic Credential Attestation
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Body */}
        <div className="border-2 border-slate-300 rounded-2xl p-8 relative overflow-hidden bg-slate-50/50">
          {/* Subtle AICTE watermark stamp */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <img src="/emblem.svg" alt="" className="w-80 h-80" />
          </div>

          {/* Certificate Header */}
          <div className="text-center space-y-2 pb-6 border-b border-slate-200 relative">
            <img src="/emblem.svg" alt="Emblem" className="w-12 h-14 mx-auto drop-shadow" />
            <h2 className="text-sm font-bold tracking-widest uppercase text-slate-950 font-mono">
              All India Council for Technical Education
            </h2>
            <p className="text-[11px] text-slate-500 uppercase tracking-wider">
              Ministry of Education • Government of India
            </p>
            <div className="inline-block px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] text-slate-700 font-mono mt-1">
              Ref: {cert.certificateReferenceNumber}
            </div>
          </div>

          {/* Recipient Details */}
          <div className="py-6 space-y-4 text-center">
            <p className="text-xs text-slate-500 italic">
              This is to certify that the academic enrolment record of
            </p>
            <h3 className="text-2xl font-bold text-slate-950 tracking-wide font-mono">
              {cert.studentName}
            </h3>
            <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
              bearing Institution Roll Number <strong className="text-slate-900 font-mono">{cert.studentRollNumber}</strong> and Government APAAR ID <strong className="text-slate-900 font-mono">{cert.maskedApaarId}</strong> is officially registered and verified in
            </p>
            <div className="text-sm font-semibold text-slate-900">
              {cert.courseName}
            </div>
            <div className="text-xs text-slate-600">
              at <strong className="text-slate-900">{cert.institutionName}</strong> (AICTE Code: {cert.institutionCode})
            </div>
            <div className="text-[11px] text-slate-500">
              Academic Session: <strong className="text-slate-800 font-mono">{cert.academicSession}</strong> • Accredited: {cert.accreditationStatus}
            </div>
          </div>

          {/* Footer: QR Code & Cryptographic Attestation */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
            {/* Dynamic Verifiable QR Code */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs flex-shrink-0">
                <QRCodeSVG value={qrPayload} size={64} level="M" />
              </div>
              <div className="text-left text-[10px] text-slate-600 space-y-0.5">
                <div className="font-semibold text-slate-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Scan to Verify Claim</span>
                </div>
                <div className="font-mono text-slate-800">VRF Ref: {cert.verificationRef}</div>
                <div className="text-[9px] text-slate-400">Server Cryptographic Attestation</div>
              </div>
            </div>

            {/* Signature & Seal */}
            <div className="text-right text-[10px] space-y-1">
              <div className="font-mono text-slate-500 text-[9px] truncate max-w-[180px]">
                HMAC-SHA256: {cert.digitalSignature.slice(0, 18)}...
              </div>
              <div className="text-slate-900 font-semibold">AICTE Approvals Bureau</div>
              <div className="text-slate-500">Attested on: {cert.issuedDate}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
