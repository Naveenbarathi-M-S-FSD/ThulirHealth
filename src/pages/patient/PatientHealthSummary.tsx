import React from 'react';
import { FileSpreadsheet, Activity, Heart, Shield, CheckCircle2, Pill, Calendar, AlertTriangle, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PatientHealthSummary: React.FC = () => {
  const { currentUser, prescriptions, healthRecords, appointments, labReports } = useApp();

  const patient =
    currentUser && currentUser.role === 'patient'
      ? currentUser
      : {
          fullName: 'Priya Sharma',
          patientId: 'TH-P-8921',
          bloodGroup: 'B+',
          age: 34,
          gender: 'Female',
          overallHealthStatus: 'Stable',
          allergies: ['Penicillin', 'Sulfa Drugs'],
          existingConditions: ['Type 2 Diabetes (Mild)', 'Essential Hypertension'],
        };

  const activeRx = prescriptions.filter((p) => p.status === 'Active');
  const pastRx = prescriptions.filter((p) => p.status !== 'Active');
  const upcomingApt = appointments.find((a) => a.status === 'Upcoming');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Longitudinal Health Intelligence
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Comprehensive Patient Health Summary
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Aggregated clinical parameters, active prescriptions, pathology markers, and scheduled care
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="font-mono text-xs px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
            Patient: {patient.fullName} ({patient.patientId})
          </span>
        </div>
      </div>

      {/* Vital Metrics Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[11px] font-medium">Resting Blood Pressure</span>
          <span className="text-xl font-black text-slate-900 font-mono">126/80</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">✓ Target Reached</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[11px] font-medium">Glycated Hemoglobin</span>
          <span className="text-xl font-black text-slate-900 font-mono">6.4 %</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">✓ Well Controlled</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[11px] font-medium">Total Cholesterol</span>
          <span className="text-xl font-black text-slate-900 font-mono">188 mg/dL</span>
          <span className="text-[10px] text-teal-600 font-semibold block mt-1">Within Normal Range</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[11px] font-medium">Body Mass Index (BMI)</span>
          <span className="text-xl font-black text-slate-900 font-mono">24.2</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Healthy Weight</span>
        </div>
      </div>

      {/* 2-Column Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active vs Previous Medicines */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Pill className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">Current Medications ({activeRx.length} Active Orders)</h3>
          </div>

          <div className="space-y-2 text-xs">
            {activeRx.flatMap((r) => r.medicines).map((med, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{med.name}</span>
                  <span className="text-slate-500 text-[11px]">{med.frequency} · {med.duration}</span>
                </div>
                <span className="font-mono text-teal-800 font-semibold px-2 py-0.5 rounded bg-teal-50">
                  {med.dosage}
                </span>
              </div>
            ))}
          </div>

          {pastRx.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 block mb-2">Previous / Completed Regimens</span>
              <div className="space-y-1.5 text-xs text-slate-500">
                {pastRx.flatMap((r) => r.medicines).slice(0, 2).map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px]">
                    <span className="line-through">{m.name} ({m.dosage})</span>
                    <span>Completed</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Diagnostic Lab Values */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Activity className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Recent Laboratory Investigations</h3>
          </div>

          <div className="space-y-3 text-xs">
            {labReports.slice(0, 3).map((lab) => (
              <div key={lab.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{lab.testName}</span>
                  <span className="font-mono text-slate-400 text-[10px]">{lab.date}</span>
                </div>
                <p className="font-mono text-slate-700 text-[11px] font-semibold">{lab.result}</p>
                <p className="text-[10px] text-slate-500 italic">{lab.doctorNotes}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Allergies & Conditions Alert */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-1">
          <div className="flex items-center gap-2 text-rose-900 font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Contraindicated Allergies
          </div>
          <p className="font-medium text-rose-800">{patient.allergies?.join(', ')}</p>
          <span className="text-[10px] text-rose-600 block">Strict electronic cross-check active on all prescriptions.</span>
        </div>

        <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs space-y-1">
          <div className="flex items-center gap-2 text-teal-900 font-bold">
            <Calendar className="w-4 h-4 text-teal-700" />
            Upcoming Medical Follow-up
          </div>
          <p className="font-medium text-teal-800">
            {upcomingApt ? `${upcomingApt.doctorName} on ${upcomingApt.date} at ${upcomingApt.time}` : 'No upcoming visits'}
          </p>
          <span className="text-[10px] text-teal-700 block">Routine cardiology blood pressure regulation.</span>
        </div>
      </div>
    </div>
  );
};
