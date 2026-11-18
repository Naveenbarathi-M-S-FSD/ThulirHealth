import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, CheckCircle, AlertTriangle, Sparkles, FileText, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MedicineItem, Prescription } from '../../types';

interface PrescriptionScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrescriptionSaved?: (prescription: Prescription) => void;
}

const OCR_STEPS = [
  'Scanning prescription document...',
  'Reading prescription handwriting and text...',
  'Detecting prescribed medicines & strengths...',
  'Reading dosage and administration schedule...',
  'Reading frequency & food instructions...',
  'Extracting doctor remarks & duration...',
  'Preparing clinical verification results...',
];

const DEMO_PRESET_MEDICINES: MedicineItem[] = [
  {
    id: 'ocr-1',
    name: 'Telmisartan 40mg',
    dosage: '40 mg',
    frequency: '1-0-0 (Morning)',
    duration: '30 Days',
    instructions: 'Take 30 mins before breakfast with water',
    timing: 'Morning',
  },
  {
    id: 'ocr-2',
    name: 'Metformin 500mg SR',
    dosage: '500 mg',
    frequency: '1-0-1 (After Food)',
    duration: '30 Days',
    instructions: 'Take after morning and evening meals',
    timing: 'Morning & Night',
  },
  {
    id: 'ocr-3',
    name: 'Pantoprazole 40mg',
    dosage: '40 mg',
    frequency: '1-0-0 (Empty Stomach)',
    duration: '15 Days',
    instructions: 'Take with warm water 30 minutes before first meal',
    timing: 'Morning',
  },
];

export const PrescriptionScannerModal: React.FC<PrescriptionScannerModalProps> = ({
  isOpen,
  onClose,
  onPrescriptionSaved,
}) => {
  const { currentUser, addPrescription, showToast } = useApp();

  const [mode, setMode] = useState<'camera' | 'scanning' | 'review'>('camera');
  const [cameraAvailable, setCameraAvailable] = useState<boolean>(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Form states for editable result
  const [patientName, setPatientName] = useState<string>('Priya Sharma');
  const [doctorName, setDoctorName] = useState<string>('Dr. Arvind Swaminathan (Cardiology)');
  const [hospitalClinic, setHospitalClinic] = useState<string>('Apollo Speciality Hospitals, Greams Road');
  const [prescriptionDate, setPrescriptionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [diagnosis, setDiagnosis] = useState<string>('Hypertension & Metabolic Maintenance');
  const [medicines, setMedicines] = useState<MedicineItem[]>(DEMO_PRESET_MEDICINES);
  const [doctorNotes, setDoctorNotes] = useState<string>('Continue low salt diet. Routine blood pressure log required.');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (currentUser && 'fullName' in currentUser) {
      setPatientName(currentUser.fullName);
    }
  }, [currentUser]);

  // Handle camera start/stop
  useEffect(() => {
    if (!isOpen || mode !== 'camera') {
      stopCamera();
      return;
    }

    let isMounted = true;

    async function initCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (isMounted) setCameraAvailable(false);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCameraAvailable(true);
      } catch (err) {
        console.warn('Camera stream error or permission denied:', err);
        if (isMounted) setCameraAvailable(false);
      }
    }

    initCamera();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [isOpen, mode]);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const handleCapture = () => {
    if (videoRef.current && cameraAvailable) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          setCapturedImage(canvas.toDataURL('image/jpeg'));
        }
      } catch {
        setCapturedImage(null);
      }
    }
    stopCamera();
    startScanningAnimation();
  };

  const handleUseDemo = () => {
    stopCamera();
    setCapturedImage(null);
    startScanningAnimation();
  };

  const startScanningAnimation = () => {
    setMode('scanning');
    setCurrentStepIndex(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < OCR_STEPS.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setMode('review');
      }
    }, 600);
  };

  const handleRetake = () => {
    setMode('camera');
    setCapturedImage(null);
    setCurrentStepIndex(0);
  };

  const handleAddMedicineRow = () => {
    const newMed: MedicineItem = {
      id: `ocr-${Date.now()}`,
      name: 'New Medicine',
      dosage: '1 Tablet',
      frequency: '1-0-1 (After Food)',
      duration: '7 Days',
      instructions: 'Take after meal',
      timing: 'Morning & Night',
    };
    setMedicines([...medicines, newMed]);
  };

  const handleRemoveMedicineRow = (id: string) => {
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  const handleMedicineChange = (id: string, field: keyof MedicineItem, val: string) => {
    setMedicines(
      medicines.map((m) => (m.id === id ? { ...m, [field]: val } : m))
    );
  };

  const handleConfirmAndSave = async () => {
    try {
      const newRx = await addPrescription({
        patientId: currentUser && 'patientId' in currentUser ? currentUser.patientId : 'TH-P-8921',
        patientName,
        doctorName,
        hospitalClinic,
        date: prescriptionDate,
        diagnosis,
        status: 'Active',
        source: 'Camera Scan',
        medicines,
        notes: doctorNotes,
      });

      showToast('Prescription saved to Firestore and synced to your records!');
      if (onPrescriptionSaved) {
        onPrescriptionSaved(newRx);
      }
      onClose();
    } catch (err: any) {
      console.error('Failed to save scanned prescription to Firestore:', err);
      showToast('Failed to save scanned prescription to database', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {mode === 'camera' && 'THULIR Smart Prescription Scanner'}
                {mode === 'scanning' && 'Simulated AI Vision Extraction'}
                {mode === 'review' && 'Prescription Successfully Scanned'}
              </h2>
              <p className="text-xs text-slate-500">
                {mode === 'camera' && 'Align doctor prescription slip inside the capture frame'}
                {mode === 'scanning' && 'Simulating multi-stage optical character recognition'}
                {mode === 'review' && 'Review extracted medicines before saving to permanent records'}
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {mode === 'camera' && (
            <div className="flex flex-col items-center">
              {/* Camera Frame */}
              <div className="relative w-full max-w-lg aspect-4/3 bg-slate-950 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                {cameraAvailable ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-6 text-center text-slate-300">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-white mb-1">Camera unavailable or permission denied</p>
                    <p className="text-xs text-slate-400 mb-4 max-w-xs mx-auto">
                      You can continue seamlessly using our high-fidelity demonstration doctor prescription slip.
                    </p>
                    <button
                      onClick={handleUseDemo}
                      className="px-4 py-2 text-xs font-semibold text-teal-950 bg-teal-300 hover:bg-teal-200 rounded-lg transition-colors"
                    >
                      Use Demo Prescription
                    </button>
                  </div>
                )}

                {/* Corner Brackets Overlay */}
                <div className="absolute inset-4 pointer-events-none">
                  {/* Top-left */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-sm" />
                  {/* Top-right */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-sm" />
                  {/* Bottom-left */}
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-sm" />
                  {/* Bottom-right */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-sm" />

                  {/* Horizontal animated scanning laser */}
                  {cameraAvailable && (
                    <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-0.5 bg-linear-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                  )}
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-3 mt-6">
                {cameraAvailable && (
                  <button
                    onClick={handleCapture}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    Capture Prescription
                  </button>
                )}
                <button
                  onClick={handleUseDemo}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  Use Demo Prescription
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-3 text-center">
                Supports printed doctor slips, hospital discharge recommendations, and clinic prescription notes.
              </p>
            </div>
          )}

          {mode === 'scanning' && (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-teal-100 animate-ping opacity-25" />
                <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Analyzing Prescription Document
              </h3>
              <p className="text-sm font-medium text-teal-700 h-6">
                {OCR_STEPS[currentStepIndex]}
              </p>

              {/* Progress Steps list */}
              <div className="w-full max-w-md mt-6 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100 text-left">
                {OCR_STEPS.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs">
                    {idx < currentStepIndex ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : idx === currentStepIndex ? (
                      <RefreshCw className="w-4 h-4 text-teal-600 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span
                      className={
                        idx < currentStepIndex
                          ? 'text-slate-700 font-medium'
                          : idx === currentStepIndex
                          ? 'text-teal-800 font-semibold'
                          : 'text-slate-400'
                      }
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-400 mt-4">
                Simulating medical OCR NLP parsing pipeline for hackathon demonstration.
              </p>
            </div>
          )}

          {mode === 'review' && (
            <div className="space-y-6">
              {/* Success Banner */}
              <div className="flex items-start gap-3 p-3.5 bg-emerald-50/70 border border-emerald-200/60 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-emerald-950">
                    Prescription Successfully Scanned & Parsed
                  </p>
                  <p className="text-emerald-800 mt-0.5">
                    Extracted 3 medicines and physician directions. You can review or edit any fields before saving.
                  </p>
                </div>
              </div>

              {/* Header Details Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prescription Date
                  </label>
                  <input
                    type="date"
                    value={prescriptionDate}
                    onChange={(e) => setPrescriptionDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hospital / Clinic
                  </label>
                  <input
                    type="text"
                    value={hospitalClinic}
                    onChange={(e) => setHospitalClinic(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Diagnosis / Clinical Impression
                  </label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Medicines Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Detected Medicines ({medicines.length})
                  </h4>
                  <button
                    onClick={handleAddMedicineRow}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Medicine
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200">
                        <th className="py-2 px-3 font-semibold">Medicine Name</th>
                        <th className="py-2 px-2 font-semibold">Dosage</th>
                        <th className="py-2 px-2 font-semibold">Frequency</th>
                        <th className="py-2 px-2 font-semibold">Duration</th>
                        <th className="py-2 px-3 font-semibold">Instructions</th>
                        <th className="py-2 px-2 font-semibold text-center w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {medicines.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50/50">
                          <td className="p-2">
                            <input
                              type="text"
                              value={m.name}
                              onChange={(e) => handleMedicineChange(m.id, 'name', e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-teal-500 font-medium"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={m.dosage}
                              onChange={(e) => handleMedicineChange(m.id, 'dosage', e.target.value)}
                              className="w-20 px-2 py-1 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-teal-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={m.frequency}
                              onChange={(e) => handleMedicineChange(m.id, 'frequency', e.target.value)}
                              className="w-28 px-2 py-1 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-teal-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={m.duration}
                              onChange={(e) => handleMedicineChange(m.id, 'duration', e.target.value)}
                              className="w-20 px-2 py-1 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-teal-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={m.instructions}
                              onChange={(e) => handleMedicineChange(m.id, 'instructions', e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-teal-500"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => handleRemoveMedicineRow(m.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Doctor remarks */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Doctor Advice / Special Instructions
                </label>
                <textarea
                  rows={2}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Mandatory Medical Disclaimer */}
              <div className="flex items-start gap-2 p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Medical Disclaimer:</strong> This is a simulated OCR result. Please verify all prescription details with a qualified healthcare professional before taking medications.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/60">
          {mode === 'camera' ? (
            <p className="text-xs text-slate-500">
              Tip: Position the document within good lighting for optimal OCR simulation.
            </p>
          ) : mode === 'scanning' ? (
            <p className="text-xs text-slate-500">Processing optical extraction...</p>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={handleRetake}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retake Scan
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    stopCamera();
                    onClose();
                  }}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAndSave}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Confirm & Save to Records
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
