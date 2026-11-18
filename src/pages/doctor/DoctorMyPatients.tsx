import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, QrCode, ArrowRight, CheckCircle, ShieldAlert, Heart, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QRScannerModal } from '../../components/common/QRScannerModal';
import { PatientUser } from '../../types';

export const DoctorMyPatients: React.FC = () => {
  const navigate = useNavigate();
  const { patients, setSelectedDoctorPatientId, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [selectedPatientPreview, setSelectedPatientPreview] = useState<PatientUser | null>(patients[0] || null);

  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase();
    return p.fullName.toLowerCase().includes(q) || p.patientId.toLowerCase().includes(q);
  });

  const handlePatientFound = (found: PatientUser) => {
    setSelectedPatientPreview(found);
    showToast(`Patient QR scanned: ${found.fullName}`);
  };

  const handleOpenFullProfile = (patientId: string) => {
    setSelectedDoctorPatientId(patientId);
    navigate('/doctor/patient-health');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            My Registered Patients & Health Search
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Search electronic charts or scan patient THULIR Health QR codes directly at OPD reception
          </p>
        </div>

        <button
          onClick={() => setIsQRScannerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <QrCode className="w-4 h-4" />
          <span>Scan Patient Health QR</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
        <input
          type="text"
          placeholder="Search by Patient Name or Citizen ID (e.g. TH-P-8921 or Priya)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none text-slate-900"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-slate-700 mr-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Main Grid: Patients List + Active Inspection Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Patient Cards List */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Enrolled Patient Cohort ({filteredPatients.length})
          </h3>

          <div className="space-y-3">
            {filteredPatients.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPatientPreview(p)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  selectedPatientPreview?.patientId === p.patientId
                    ? 'bg-teal-50/50 border-teal-500 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-teal-700 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {p.fullName.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{p.fullName}</h4>
                      <span className="font-mono text-[11px] font-semibold text-teal-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {p.patientId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {p.age} Yrs · {p.gender} · Blood <strong className="text-rose-700">{p.bloodGroup}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400 truncate max-w-xs">{p.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenFullProfile(p.patientId);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors"
                  >
                    <span>Open Chart</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (1 Col): Patient Profile Found Inspection Box */}
        {selectedPatientPreview && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Patient Profile Found
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                  {selectedPatientPreview.overallHealthStatus}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {selectedPatientPreview.fullName}
                  </h4>
                  <span className="font-mono text-xs font-semibold text-teal-700">
                    {selectedPatientPreview.patientId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Demographics</span>
                    <span className="font-semibold text-slate-800">
                      {selectedPatientPreview.age} Yrs · {selectedPatientPreview.gender}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Blood Group</span>
                    <span className="font-bold text-rose-700">{selectedPatientPreview.bloodGroup}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px]">Primary Contact</span>
                    <span className="text-slate-700">{selectedPatientPreview.phone}</span>
                  </div>
                </div>

                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200/80">
                  <span className="font-bold text-rose-950 block text-[11px]">Allergies:</span>
                  <span className="font-semibold text-rose-800">
                    {selectedPatientPreview.allergies.join(', ') || 'None Reported'}
                  </span>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80">
                  <span className="font-bold text-amber-950 block text-[11px]">Important Conditions:</span>
                  <span className="font-medium text-amber-900">
                    {selectedPatientPreview.existingConditions.join(', ') || 'None Reported'}
                  </span>
                </div>

                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200/80">
                  <span className="font-bold text-teal-950 block text-[11px]">Last AI Summary:</span>
                  <p className="text-teal-900 text-[11px] mt-0.5">
                    "Blood pressure stabilized on Telmisartan 40mg. HbA1c at 6.4%. Penicillin allergy active."
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleOpenFullProfile(selectedPatientPreview.patientId)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors"
              >
                <span>View Full Health Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onPatientFound={handlePatientFound}
      />
    </div>
  );
};
