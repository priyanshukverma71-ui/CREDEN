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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-sm">
        <div className="glass-panel rounded-2xl p-6 text-center text-xs text-liquid-silver">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0F1115] text-[#F1F3F5] rounded-3xl border border-glass-border-bright p-8 shadow-glass-panel relative space-y-6">
        {/* Controls Header (Hidden in print) */}
        <div className="flex items-center justify-between no-print pb-3 border-b border-glass-border">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-platinum" />
            <span className="text-xs font-semibold text-highlight-silver">
              AICTE Academic Credential Attestation
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-platinum hover:bg-white text-midnight text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-liquid-silver hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Body */}
        <div className="border-2 border-platinum/40 rounded-2xl p-8 relative overflow-hidden bg-gradient-to-b from-[#111317] to-[#08090B]">
          {/* Subtle AICTE watermark stamp */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <img src="/emblem.svg" alt="" className="w-80 h-80" />
          </div>

          {/* Certificate Header */}
          <div className="text-center space-y-2 pb-6 border-b border-glass-border relative">
            <img src="/emblem.svg" alt="Emblem" className="w-12 h-14 mx-auto drop-shadow" />
            <h2 className="text-sm font-bold tracking-widest uppercase text-platinum font-mono">
              All India Council for Technical Education
            </h2>
            <p className="text-[11px] text-liquid-silver uppercase tracking-wider">
              Ministry of Education • Government of India
            </p>
            <div className="inline-block px-3 py-0.5 rounded-full bg-graphite/80 border border-glass-border text-[10px] text-platinum font-mono mt-1">
              Ref: {cert.certificateReferenceNumber}
            </div>
          </div>

          {/* Recipient Details */}
          <div className="py-6 space-y-4 text-center">
            <p className="text-xs text-liquid-silver italic">
              This is to certify that the academic enrolment record of
            </p>
            <h3 className="text-xl font-bold platinum-gradient-text tracking-wide font-mono">
              {cert.studentName}
            </h3>
            <p className="text-xs text-liquid-silver max-w-lg mx-auto leading-relaxed">
              bearing Institution Roll Number <strong className="text-highlight-silver font-mono">{cert.studentRollNumber}</strong> and Government APAAR ID <strong className="text-platinum font-mono">{cert.maskedApaarId}</strong> is officially registered and verified in
            </p>
            <div className="text-sm font-semibold text-highlight-silver">
              {cert.courseName}
            </div>
            <div className="text-xs text-liquid-silver">
              at <strong className="text-highlight-silver">{cert.institutionName}</strong> (AICTE Code: {cert.institutionCode})
            </div>
            <div className="text-[11px] text-liquid-silver">
              Academic Session: <strong className="text-highlight-silver font-mono">{cert.academicSession}</strong> • Accredited: {cert.accreditationStatus}
            </div>
          </div>

          {/* Footer: QR Code & Cryptographic Attestation */}
          <div className="pt-6 border-t border-glass-border flex items-center justify-between gap-4">
            {/* Dynamic Verifiable QR Code */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white flex-shrink-0">
                <QRCodeSVG value={qrPayload} size={64} level="M" />
              </div>
              <div className="text-left text-[10px] text-liquid-silver space-y-0.5">
                <div className="font-semibold text-highlight-silver flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-platinum" />
                  <span>Scan to Verify Claim</span>
                </div>
                <div className="font-mono text-platinum">VRF Ref: {cert.verificationRef}</div>
                <div className="text-[9px]">Server Cryptographic Attestation</div>
              </div>
            </div>

            {/* Signature & Seal */}
            <div className="text-right text-[10px] space-y-1">
              <div className="font-mono text-liquid-silver text-[9px] truncate max-w-[180px]">
                HMAC-SHA256: {cert.digitalSignature.slice(0, 18)}...
              </div>
              <div className="text-highlight-silver font-semibold">AICTE Approvals Bureau</div>
              <div className="text-liquid-silver">Attested on: {cert.issuedDate}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
