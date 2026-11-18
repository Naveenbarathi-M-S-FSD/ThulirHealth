import React from 'react';
import { Download, Share2, Shield, Sparkles, CheckCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThulirLogo } from './ThulirLogo';

interface HealthQRCodeCardProps {
  patientId?: string;
  patientName?: string;
  bloodGroup?: string;
  age?: number;
  gender?: string;
  showActions?: boolean;
}

export const HealthQRCodeCard: React.FC<HealthQRCodeCardProps> = ({
  patientId = 'TH-P-8921',
  patientName = 'Priya Sharma',
  bloodGroup = 'B+',
  age = 34,
  gender = 'Female',
  showActions = true,
}) => {
  const { showToast } = useApp();

  const handleDownload = () => {
    // Simulated download of digital pass
    showToast('Health QR Pass downloaded to device (THULIR_Passport.png)');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'THULIR Digital Health QR',
        text: `Patient Identifier: ${patientId} (${patientName})`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`THULIR Health Identifier: ${patientId}`);
      showToast('Patient Health ID copied to clipboard for sharing!');
    }
  };

  return (
    <div className="relative overflow-hidden bg-linear-to-b from-teal-800 to-slate-900 text-white rounded-2xl shadow-xl p-6 border border-teal-700/50 max-w-sm mx-auto">
      {/* Decorative background circles */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <ThulirLogo size="sm" />
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
          <Shield className="w-3 h-3" />
          Verified Citizen Pass
        </div>
      </div>

      {/* QR Code Container */}
      <div className="my-5 flex flex-col items-center">
        <div className="p-3.5 bg-white rounded-xl shadow-lg relative group">
          {/* Detailed SVG QR Code Mockup */}
          <svg
            className="w-48 h-48"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top-Left Finder */}
            <rect x="5" y="5" width="26" height="26" rx="3" fill="#042F2E" />
            <rect x="9" y="9" width="18" height="18" fill="white" />
            <rect x="13" y="13" width="10" height="10" rx="1.5" fill="#0D9488" />

            {/* Top-Right Finder */}
            <rect x="69" y="5" width="26" height="26" rx="3" fill="#042F2E" />
            <rect x="73" y="9" width="18" height="18" fill="white" />
            <rect x="77" y="13" width="10" height="10" rx="1.5" fill="#0D9488" />

            {/* Bottom-Left Finder */}
            <rect x="5" y="69" width="26" height="26" rx="3" fill="#042F2E" />
            <rect x="9" y="73" width="18" height="18" fill="white" />
            <rect x="13" y="77" width="10" height="10" rx="1.5" fill="#0D9488" />

            {/* Data matrix dots */}
            <g fill="#0F172A">
              <rect x="36" y="8" width="4" height="4" rx="1" />
              <rect x="44" y="8" width="4" height="4" rx="1" />
              <rect x="52" y="12" width="4" height="4" rx="1" />
              <rect x="60" y="8" width="4" height="4" rx="1" />

              <rect x="36" y="20" width="4" height="4" rx="1" />
              <rect x="44" y="16" width="4" height="4" rx="1" />
              <rect x="56" y="20" width="4" height="4" rx="1" />

              <rect x="8" y="36" width="4" height="4" rx="1" />
              <rect x="16" y="44" width="4" height="4" rx="1" />
              <rect x="24" y="36" width="4" height="4" rx="1" />
              <rect x="24" y="48" width="4" height="4" rx="1" />

              <rect x="36" y="36" width="6" height="6" rx="1" fill="#059669" />
              <rect x="52" y="36" width="4" height="4" rx="1" />
              <rect x="60" y="44" width="4" height="4" rx="1" />
              <rect x="44" y="48" width="4" height="4" rx="1" />

              <rect x="68" y="36" width="4" height="4" rx="1" />
              <rect x="76" y="44" width="4" height="4" rx="1" />
              <rect x="84" y="36" width="4" height="4" rx="1" />
              <rect x="84" y="48" width="4" height="4" rx="1" />

              <rect x="36" y="60" width="4" height="4" rx="1" />
              <rect x="48" y="64" width="4" height="4" rx="1" />
              <rect x="56" y="60" width="4" height="4" rx="1" />

              <rect x="36" y="72" width="4" height="4" rx="1" />
              <rect x="44" y="76" width="4" height="4" rx="1" />
              <rect x="52" y="72" width="4" height="4" rx="1" />
              <rect x="60" y="80" width="4" height="4" rx="1" />

              <rect x="68" y="68" width="4" height="4" rx="1" />
              <rect x="76" y="72" width="4" height="4" rx="1" />
              <rect x="84" y="68" width="4" height="4" rx="1" />
              <rect x="72" y="84" width="4" height="4" rx="1" />
              <rect x="84" y="80" width="4" height="4" rx="1" />
            </g>

            {/* Central Badge */}
            <circle cx="50" cy="50" r="10" fill="white" />
            <circle cx="50" cy="50" r="8" fill="#0D9488" />
            <path d="M48 45H52V48H55V52H52V55H48V52H45V48H48V45Z" fill="white" />
          </svg>
        </div>

        <p className="font-mono text-xs text-teal-200 mt-3 font-semibold tracking-wider">
          {patientId}
        </p>
      </div>

      {/* Patient Information Box */}
      <div className="bg-white/10 rounded-xl p-3 border border-white/10 text-xs space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-teal-200 font-medium">Patient Name</span>
          <span className="font-semibold">{patientName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-teal-200 font-medium">Age & Gender</span>
          <span>{age} Years · {gender}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-teal-200 font-medium">Blood Group</span>
          <span className="font-bold text-rose-300">{bloodGroup}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-teal-200 font-medium">Profile Sync Status</span>
          <span className="text-emerald-300 font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Active & Synced
          </span>
        </div>
      </div>

      {/* Privacy note */}
      <div className="flex items-start gap-1.5 mt-3 text-[10px] text-teal-200/80">
        <Info className="w-3 h-3 mt-0.5 shrink-0" />
        <span>
          Scan instantly during clinical triage or pharmacy visits. Does not broadcast raw sensitive records.
        </span>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white/15 hover:bg-white/25 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Pass
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share QR
          </button>
        </div>
      )}
    </div>
  );
};
