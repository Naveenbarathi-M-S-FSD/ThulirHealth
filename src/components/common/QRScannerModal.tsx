import React, { useState, useRef, useEffect } from 'react';
import { QrCode, X, Camera, CheckCircle, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PatientUser } from '../../types';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientFound: (patient: PatientUser) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onPatientFound,
}) => {
  const { patients } = useApp();
  const [cameraAvailable, setCameraAvailable] = useState<boolean>(true);
  const [foundPatient, setFoundPatient] = useState<PatientUser | null>(null);
  const [manualInput, setManualInput] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen || foundPatient) {
      stopCamera();
      return;
    }

    let isMounted = true;
    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (isMounted) setCameraAvailable(false);
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCameraAvailable(true);
      } catch {
        if (isMounted) setCameraAvailable(false);
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [isOpen, foundPatient]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const handleSimulateScan = (patientId = 'TH-P-8921') => {
    stopCamera();
    setIsScanning(false);
    const match = patients.find((p) => p.patientId === patientId) || patients[0];
    setFoundPatient(match);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = manualInput.trim().toUpperCase();
    const match = patients.find(
      (p) => p.patientId.toUpperCase().includes(query) || p.fullName.toUpperCase().includes(query)
    );
    if (match) {
      handleSimulateScan(match.patientId);
    }
  };

  const handleReset = () => {
    setFoundPatient(null);
    setIsScanning(true);
    setManualInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Scan THULIR Health QR
              </h3>
              <p className="text-xs text-slate-500">
                Scan patient digital health passport or enter Patient ID
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!foundPatient ? (
            <div className="space-y-4">
              {/* Camera Frame */}
              <div className="relative w-full aspect-square max-w-[280px] mx-auto bg-slate-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                {cameraAvailable ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-4 text-center text-slate-300">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                    <p className="text-xs font-medium text-slate-300">Live Camera Not Active</p>
                    <p className="text-[11px] text-slate-500 mt-1">Use the quick demo scan button below</p>
                  </div>
                )}

                {/* QR Target Viewfinder */}
                <div className="absolute inset-8 pointer-events-none border-2 border-dashed border-teal-400/80 rounded-xl flex items-center justify-center">
                  <div className="w-12 h-0.5 bg-teal-400 shadow-[0_0_8px_#2dd4bf] animate-bounce" />
                </div>
              </div>

              {/* Demo QR Trigger */}
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateScan('TH-P-8921')}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-teal-900 bg-teal-100 hover:bg-teal-200 rounded-lg transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  Use Demo QR (Priya Sharma)
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateScan('TH-P-7204')}
                  className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Demo: Rajesh Kumar
                </button>
              </div>

              {/* Manual search alternative */}
              <div className="relative pt-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-slate-400">Or search Patient ID</span>
                </div>
              </div>

              <form onSubmit={handleManualSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. TH-P-8921 or Priya"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Match Card */}
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-900 text-xs font-semibold mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Patient Profile Found & Verified
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-emerald-100 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{foundPatient.fullName}</h4>
                      <p className="text-xs font-mono text-teal-700 font-semibold">{foundPatient.patientId}</p>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {foundPatient.overallHealthStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Age / Gender</span>
                      <span className="font-semibold text-slate-800">{foundPatient.age} Yrs · {foundPatient.gender}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Blood Group</span>
                      <span className="font-semibold text-rose-700">{foundPatient.bloodGroup}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Location</span>
                      <span className="font-semibold text-slate-800 truncate block">{foundPatient.location.split(',')[0]}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-400 block text-[10px]">Known Allergies</span>
                    <span className="font-medium text-rose-700">
                      {foundPatient.allergies.join(', ') || 'No known drug allergies'}
                    </span>
                  </div>

                  <div className="text-xs">
                    <span className="text-slate-400 block text-[10px]">Active Conditions</span>
                    <span className="font-medium text-slate-800">
                      {foundPatient.existingConditions.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Scan Another
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onPatientFound(foundPatient);
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
                >
                  View Full Health Profile
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
