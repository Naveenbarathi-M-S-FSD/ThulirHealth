import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Heart,
  Pill,
  FileText,
  Activity,
  Microscope,
  Calendar,
  AlertTriangle,
  FilePlus,
  Plus,
  CheckCircle,
  Save,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DoctorPatientHealth: React.FC = () => {
  const navigate = useNavigate();
  const {
    patients,
    selectedDoctorPatientId,
    setSelectedDoctorPatientId,
    prescriptions,
    healthRecords,
    medicalHistory,
    labReports,
    appointments,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'Summary' | 'Prescriptions' | 'Lab Reports' | 'History Timeline' | 'Doctor Notes'>('Summary');
  const [clinicalNote, setClinicalNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([
    'Mar 28, 2026: Patient reports adherence to Telmisartan 40mg. Resting BP normalized to 126/80 mmHg. Advised to continue moderate aerobic exercise 30 mins/day.',
  ]);

  const patient =
    patients.find((p) => p.patientId === selectedDoctorPatientId) || patients[0];

  const patientRx = prescriptions.filter((p) => p.patientId === patient.patientId);
  const patientRecords = healthRecords.filter((r) => r.patientId === patient.patientId);
  const patientHistory = medicalHistory.filter((h) => h.patientId === patient.patientId);
  const patientLabs = labReports.filter((l) => l.patientId === patient.patientId);
  const patientApts = appointments.filter((a) => a.patientId === patient.patientId);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicalNote.trim()) return;
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setSavedNotes([`${dateStr}: ${clinicalNote}`, ...savedNotes]);
    setClinicalNote('');
    showToast('Clinical consultation note added to patient record.');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Patient Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-800 text-white font-extrabold text-xl flex items-center justify-center shadow-xs">
            {patient.fullName.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{patient.fullName}</h1>
              <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {patient.patientId}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {patient.age} Yrs · {patient.gender} · Blood <strong className="text-rose-700">{patient.bloodGroup}</strong> · {patient.location}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Patient Switcher */}
          <select
            value={patient.patientId}
            onChange={(e) => setSelectedDoctorPatientId(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.patientId}>
                Switch: {p.fullName} ({p.patientId})
              </option>
            ))}
          </select>

          <Link
            to="/doctor/prescription-builder"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors"
          >
            <FilePlus className="w-4 h-4" />
            <span>Write Prescription</span>
          </Link>
        </div>
      </div>

      {/* Allergies and Critical Warnings Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-1">
          <span className="font-bold text-rose-950 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Active Drug Contraindications
          </span>
          <p className="font-semibold text-rose-800">
            {patient.allergies.join(', ') || 'None reported'}
          </p>
          <span className="text-[10px] text-rose-600 block">
            Automatic allergy safety check is enforced in Prescription Builder.
          </span>
        </div>

        <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs space-y-1">
          <span className="font-bold text-teal-950 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-teal-700" />
            Chronic Conditions Under Care
          </span>
          <p className="font-semibold text-teal-900">
            {patient.existingConditions.join(', ') || 'None reported'}
          </p>
          <span className="text-[10px] text-teal-700 block">
            Overall Health Assessment: {patient.overallHealthStatus}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        {['Summary', 'Prescriptions', 'Lab Reports', 'History Timeline', 'Doctor Notes'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-teal-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'Summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Medications List */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Pill className="w-4 h-4 text-teal-600" />
              Active Medication Regimen ({patientRx.length} Prescriptions)
            </h3>

            <div className="space-y-2 text-xs">
              {patientRx.flatMap((r) => r.medicines).map((m, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">{m.name}</span>
                    <span className="text-slate-500 text-[11px]">{m.frequency} · {m.duration}</span>
                  </div>
                  <span className="font-mono text-teal-800 font-semibold px-2 py-0.5 rounded bg-teal-50">
                    {m.dosage}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Lab Reports */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Microscope className="w-4 h-4 text-blue-600" />
              Recent Pathology & Diagnostic Panels
            </h3>

            <div className="space-y-2 text-xs">
              {patientLabs.map((l) => (
                <div key={l.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900">{l.testName}</span>
                    <span className="font-mono text-[10px] text-slate-400">{l.date}</span>
                  </div>
                  <p className="font-mono text-[11px] text-teal-900 font-bold">{l.result}</p>
                  <p className="text-[10px] text-slate-500 italic mt-0.5">{l.doctorNotes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Prescriptions' && (
        <div className="space-y-3">
          {patientRx.map((rx) => (
            <div key={rx.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
              <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{rx.diagnosis || 'Prescription Order'}</h4>
                  <span className="text-slate-500 font-semibold">{rx.doctorName} · {rx.hospitalClinic}</span>
                </div>
                <span className="font-mono text-slate-400 font-semibold">{rx.date}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {rx.medicines.map((m) => (
                  <div key={m.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{m.name}</span>
                      <span className="font-mono text-teal-800 font-semibold">{m.dosage}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {m.frequency} · {m.duration} · {m.instructions}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Lab Reports' && (
        <div className="space-y-3">
          {patientLabs.map((lab) => (
            <div key={lab.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-xs space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-900 text-sm">{lab.testName}</h4>
                <span className="font-mono text-slate-400">{lab.date}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl font-mono text-slate-800 font-semibold">
                Result: {lab.result}
              </div>
              <p className="text-slate-600 text-[11px]">{lab.doctorNotes}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'History Timeline' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Chronological Events for {patient.fullName}
          </h3>

          <div className="space-y-4 text-xs">
            {patientHistory.map((h) => (
              <div key={h.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{h.title}</span>
                  <span className="font-mono text-slate-400 text-[10px]">{h.date}</span>
                </div>
                <span className="text-[11px] text-teal-800 font-semibold block">{h.doctorOrSource}</span>
                <p className="text-slate-600">{h.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Doctor Notes' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Add Clinical Consultation Notes
          </h3>

          <form onSubmit={handleAddNote} className="space-y-3">
            <textarea
              rows={3}
              value={clinicalNote}
              onChange={(e) => setClinicalNote(e.target.value)}
              placeholder="Record diagnostic impressions, lifestyle counsel, or medication adjustments..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-xs"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Clinical Note</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="font-bold text-slate-700 block">Saved Doctor Notes:</span>
            {savedNotes.map((note, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 leading-relaxed">
                {note}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
