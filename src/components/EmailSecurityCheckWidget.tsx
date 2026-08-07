import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, Sparkles, Lock, RefreshCw, KeyRound, Check } from 'lucide-react';
import { performEmailSecurityCheck, generateSecurityVerificationCode, EmailSecurityResult } from '../lib/emailSecurity';

interface EmailSecurityCheckWidgetProps {
  email: string;
  onFixEmail?: (fixedEmail: string) => void;
  onSecurityCheckChange: (result: EmailSecurityResult, isVerified: boolean) => void;
  requireCodeVerification?: boolean;
}

export const EmailSecurityCheckWidget: React.FC<EmailSecurityCheckWidgetProps> = ({
  email,
  onFixEmail,
  onSecurityCheckChange,
  requireCodeVerification = true
}) => {
  const [result, setResult] = useState<EmailSecurityResult>(() => performEmailSecurityCheck(email));
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [isCodeVerified, setIsCodeVerified] = useState<boolean>(false);
  const [codeError, setCodeError] = useState<string | null>(null);

  // Perform check whenever email changes
  useEffect(() => {
    const res = performEmailSecurityCheck(email);
    setResult(res);
    
    // Reset verification if email changes
    setIsCodeVerified(false);
    setIsCodeSent(false);
    setInputCode('');
    setCodeError(null);

    const isVerified = !requireCodeVerification || (res.status === 'passed' && isCodeVerified);
    onSecurityCheckChange(res, isVerified);
  }, [email, isCodeVerified, requireCodeVerification]);

  const handleSendCode = () => {
    if (result.status === 'rejected') return;
    const code = generateSecurityVerificationCode(email);
    setVerificationCode(code);
    setIsCodeSent(true);
    setCodeError(null);
  };

  const handleVerifyCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputCode.trim() === verificationCode) {
      setIsCodeVerified(true);
      setCodeError(null);
      onSecurityCheckChange(result, true);
    } else {
      setCodeError('Incorrect 6-digit security check code. Please check and try again.');
    }
  };

  if (!email.trim()) {
    return (
      <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
        <span>Type a valid patient email above to trigger automated security domain & anti-disposable checks.</span>
      </div>
    );
  }

  return (
    <div className="mt-2.5 p-3.5 rounded-2xl bg-slate-900 text-slate-100 border border-slate-700/80 shadow-md transition-all space-y-3">
      
      {/* Header & Score Indicator */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          {result.status === 'passed' ? (
            <ShieldCheck className="w-5 h-5 text-emerald-400 animate-pulse shrink-0" />
          ) : result.status === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Patient Email Security Check</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                Score: {result.score}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Anti-Spam & Domain Security Audit</p>
          </div>
        </div>

        {/* Security Badge Pill */}
        <span
          className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider border ${
            result.status === 'passed'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : result.status === 'warning'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          }`}
        >
          {result.status === 'passed'
            ? 'VERIFIED SECURE'
            : result.status === 'warning'
            ? 'DOMIAN WARNING'
            : 'SECURITY BLOCKED'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            result.status === 'passed'
              ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
              : result.status === 'warning'
              ? 'bg-amber-400'
              : 'bg-rose-500'
          }`}
          style={{ width: `${result.score}%` }}
        />
      </div>

      {/* Security Message / Status Banner */}
      <div
        className={`text-xs p-2.5 rounded-xl flex items-start gap-2 ${
          result.status === 'passed'
            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
            : result.status === 'warning'
            ? 'bg-amber-950/60 text-amber-200 border border-amber-800/60'
            : 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
        }`}
      >
        {result.status === 'passed' ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        ) : result.status === 'warning' ? (
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        ) : (
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <span className="font-semibold">{result.message}</span>

          {/* Typo Auto-Fix Button */}
          {result.hasTypoWarning && result.suggestedCorrection && onFixEmail && (
            <button
              type="button"
              onClick={() => onFixEmail(result.suggestedCorrection!)}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fix Email to {result.suggestedCorrection}</span>
            </button>
          )}
        </div>
      </div>

      {/* Passed Checks Bullets */}
      {result.checksPassed.length > 0 && (
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {result.checksPassed.map((chk, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">{chk}</span>
            </div>
          ))}
        </div>
      )}

      {/* Interactive 2FA Code Security Check Section (if email passed domain test) */}
      {result.status === 'passed' && requireCodeVerification && (
        <div className="pt-2 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-sky-400" />
              <span>Patient Security Code Verification</span>
            </span>

            {isCodeVerified ? (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                <CheckCircle2 className="w-3 h-3" /> Code Verified
              </span>
            ) : null}
          </div>

          {!isCodeVerified ? (
            !isCodeSent ? (
              <button
                type="button"
                onClick={handleSendCode}
                className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Send Security Verification Code to {email}</span>
              </button>
            ) : (
              <div className="space-y-2 bg-slate-950/80 p-2.5 rounded-xl border border-sky-900/60">
                <div className="p-2 rounded-lg bg-sky-950/90 border border-sky-800 text-[11px] text-sky-200 flex items-center justify-between">
                  <span>📨 Security Passcode sent to email:</span>
                  <strong className="text-white bg-sky-600 px-2 py-0.5 rounded font-mono text-xs tracking-widest">
                    {verificationCode}
                  </strong>
                </div>

                <form onSubmit={handleVerifyCode} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit passcode"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono tracking-widest text-white focus:ring-1 focus:ring-sky-400"
                  />
                  <button
                    type="button"
                    onClick={() => setInputCode(verificationCode)}
                    className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 text-[10px] font-semibold"
                    title="Auto-fill demo passcode"
                  >
                    Auto-Fill
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Verify
                  </button>
                </form>

                {codeError && (
                  <p className="text-[11px] text-rose-400 font-medium">{codeError}</p>
                )}
              </div>
            )
          ) : (
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Email ownership authenticated! Full security check verified for patient registration.</span>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
