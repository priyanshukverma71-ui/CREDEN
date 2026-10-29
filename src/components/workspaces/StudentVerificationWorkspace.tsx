import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FileCheck2,
  Search,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Building,
  GraduationCap,
  Sparkles,
  Lock,
} from 'lucide-react';

export const StudentVerificationWorkspace: React.FC = () => {
  const { token } = useAuth();
  const [referenceOrToken, setReferenceOrToken] = useState('VRF-2024-');
  const [verifierOrg, setVerifierOrg] = useState('Tata Consultancy Services (TCS)');
  const [verifierEmail, setVerifierEmail] = useState('screening@tcs.com');
  const [purpose, setPurpose] = useState('EMPLOYMENT_SCREENING');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick preset verifications for demo
  const samplePresets = [
    { label: 'Aarav Sharma (Verified Student)', ref: 'student-demo-aarav' },
  ];

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceOrToken.trim()) return;

    setLoading(true);
    setResult(null);
    setErrorMsg(null);

    try {
      let queryRef = referenceOrToken.trim();

      // If test demo preset
      if (queryRef === 'student-demo-aarav') {
        // Query student Aarav first to get token
        const studRes = await fetch('/api/students?search=Aarav', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const studData = await studRes.json();
        if (studData.data && studData.data[0]) {
          const certRes = await fetch(`/api/students/${studData.data[0].id}/certificate`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const certData = await certRes.json();
          queryRef = certData.verificationRef || certData.verificationToken;
        }
      }

      const res = await fetch('/api/verification/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceOrToken: queryRef,
          verifierOrgName: verifierOrg,
          verifierEmail,
          purpose,
        }),
      });

      const data = await res.json();
      if (res.ok && data.isValid) {
        setResult(data);
      } else {
        setErrorMsg(data.error || 'Verification record not found or tampered.');
      }
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-5 border border-glass-border">
        <div className="flex items-center gap-3 mb-2">
          <FileCheck2 className="w-5 h-5 text-platinum" />
          <h4 className="text-sm font-bold text-highlight-silver">
            Authorized Student Record Verification Portal
          </h4>
        </div>
        <p className="text-xs text-liquid-silver leading-relaxed">
          Enables authorized employers, universities, and government agencies to verify academic credentials and APAAR-linked enrolments with minimal disclosure. Sensitive demographic data is protected, and cryptographic signatures are validated server-side.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Verification Query Form */}
        <div className="glass-panel rounded-2xl p-6 border border-glass-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-glass-border">
            <span className="text-xs font-semibold text-highlight-silver uppercase tracking-wider font-mono">
              Credential Query
            </span>
            <span className="text-[10px] text-platinum font-mono">HMAC-SHA256 Signed</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-liquid-silver">Demo Preset:</span>
            <button
              type="button"
              onClick={() => setReferenceOrToken('student-demo-aarav')}
              className="px-2.5 py-1 rounded bg-obsidian hover:bg-graphite border border-glass-border text-[11px] text-highlight-silver hover:text-white"
            >
              Verify Aarav Sharma (DTU CSE)
            </button>
          </div>

          <form onSubmit={handleVerify} className="space-y-3 pt-2">
            <div>
              <label className="text-xs text-liquid-silver block mb-1">
                Verification Reference No. or Digital Token
              </label>
              <input
                type="text"
                required
                value={referenceOrToken}
                onChange={(e) => setReferenceOrToken(e.target.value)}
                placeholder="e.g. VRF-2024-XXXXXX or base64 token"
                className="w-full px-3 py-2 font-mono text-xs rounded-xl bg-obsidian border border-glass-border text-highlight-silver focus:border-platinum outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-liquid-silver block mb-1">Verifier Organisation Name</label>
              <input
                type="text"
                required
                value={verifierOrg}
                onChange={(e) => setVerifierOrg(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-obsidian border border-glass-border text-highlight-silver outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-liquid-silver block mb-1">Official Verifier Email</label>
                <input
                  type="email"
                  required
                  value={verifierEmail}
                  onChange={(e) => setVerifierEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-obsidian border border-glass-border text-highlight-silver outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-liquid-silver block mb-1">Verification Purpose</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-obsidian border border-glass-border text-highlight-silver outline-none"
                >
                  <option value="EMPLOYMENT_SCREENING">Employment Screening</option>
                  <option value="HIGHER_EDUCATION_ADMISSION">Higher Education Admission</option>
                  <option value="GOVERNMENT_SCHOLARSHIP">Government Scholarship Audit</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !referenceOrToken.trim()}
              className="w-full py-2.5 rounded-xl bg-platinum hover:bg-white text-midnight font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-40 shadow-sm"
            >
              {loading ? (
                <span>Validating Cryptographic Attestation...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Execute Attestation Verification</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Minimal Disclosure Verification Claim Output */}
        <div className="glass-panel rounded-2xl p-6 border border-glass-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-glass-border mb-4">
              <span className="text-xs font-semibold text-highlight-silver uppercase tracking-wider font-mono">
                Attested Claims
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-graphite text-platinum font-mono">
                Minimal Disclosure
              </span>
            </div>

            {result && result.isValid ? (
              <div className="space-y-4">
                {/* Verified Banner */}
                <div className="p-4 rounded-xl bg-platinum/10 border border-platinum/40 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-platinum flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-highlight-silver uppercase tracking-wider">
                      Official AICTE Credential Verified
                    </div>
                    <p className="text-xs text-liquid-silver mt-1">
                      Cryptographic attestation valid. Record matches authoritative AICTE student enrolment repository.
                    </p>
                  </div>
                </div>

                {/* Minimal Disclosure Data Fields */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-glass-border/40">
                    <span className="text-liquid-silver">Student Full Name:</span>
                    <strong className="text-highlight-silver font-semibold">{result.claims.studentName}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-glass-border/40">
                    <span className="text-liquid-silver">APAAR Identifier (Masked):</span>
                    <strong className="font-mono text-platinum">{result.claims.maskedApaarId}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-glass-border/40">
                    <span className="text-liquid-silver">Institution:</span>
                    <strong className="text-highlight-silver">{result.claims.institutionName} ({result.claims.institutionCode})</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-glass-border/40">
                    <span className="text-liquid-silver">Programme Title:</span>
                    <strong className="text-highlight-silver">{result.claims.courseName}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-glass-border/40">
                    <span className="text-liquid-silver">Academic Session:</span>
                    <strong className="font-mono text-highlight-silver">{result.claims.academicSession}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-glass-border/40">
                    <span className="text-liquid-silver">Digital Signature Digest:</span>
                    <strong className="font-mono text-liquid-silver">{result.claims.digitalSignature}</strong>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-liquid-silver">Attested Authority:</span>
                    <strong className="text-highlight-silver">{result.claims.issuingAuthority}</strong>
                  </div>
                </div>
              </div>
            ) : errorMsg ? (
              <div className="p-4 rounded-xl bg-red-950/20 border border-glass-border flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-liquid-silver flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-highlight-silver uppercase tracking-wider">
                    Verification Failure
                  </div>
                  <p className="text-xs text-liquid-silver mt-1">{errorMsg}</p>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-liquid-silver space-y-2">
                <Lock className="w-8 h-8 text-liquid-silver mx-auto opacity-40" />
                <p>Submit a verification reference number or digital token to view attested claims.</p>
              </div>
            )}
          </div>

          <div className="text-[10px] text-liquid-silver pt-4 border-t border-glass-border/50">
            * In accordance with DPDP regulations, personal contact information and complete Aadhaar/APAAR strings are excluded from external verifier responses.
          </div>
        </div>
      </div>
    </div>
  );
};
