import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  Camera,
  QrCode,
  Calendar,
  Pill,
  FileText,
  AlertTriangle,
  ShieldCheck,
  Bot,
  Clock,
  ArrowRight,
  CheckCircle2,
  Activity,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PrescriptionScannerModal } from '../../components/common/PrescriptionScannerModal';
import { HealthQRCodeCard } from '../../components/common/HealthQRCodeCard';

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    prescriptions,
    healthRecords,
    appointments,
    medicineReminders,
    toggleMedicineTaken,
    medicalHistory,
  } = useApp();

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const patient =
    currentUser && currentUser.role === 'patient'
      ? currentUser
      : {
          fullName: 'Priya Sharma',
          patientId: 'TH-P-8921',
          bloodGroup: 'B+',
          overallHealthStatus: 'Stable',
          allergies: ['Penicillin', 'Sulfa Drugs'],
          existingConditions: ['Type 2 Diabetes (Mild)', 'Essential Hypertension'],
        };

  const upcomingApt = appointments.find((a) => a.status === 'Upcoming');
  const activePrescriptions = prescriptions.filter((p) => p.status === 'Active');
  const todayReminders = medicineReminders.slice(0, 3);
  const recentRecords = healthRecords.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-linear-to-r from-teal-800 via-teal-700 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-100">
                Patient Health Passport
              </span>
              <span className="text-xs text-teal-200">ID: {patient.patientId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {patient.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
              Your overall health status is{' '}
              <strong className="text-emerald-300 font-bold">{patient.overallHealthStatus}</strong>.
              All vital logs and prescriptions are synced with your healthcare circle.
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Prescription</span>
            </button>

            <button
              onClick={() => setShowQRModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-xl backdrop-blur-xs border border-white/20 transition-all"
            >
              <QrCode className="w-4 h-4 text-emerald-300" />
              <span>Show Health QR</span>
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Resting Blood Pressure</span>
            <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">126 / 80</span>
            <span className="text-[10px] text-emerald-600 font-medium block">Normal Optimal</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Active Medications</span>
            <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">{activePrescriptions.length} Prescriptions</span>
            <span className="text-[10px] text-slate-500 block">3 Daily Doses</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Health Documents</span>
            <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">{healthRecords.length} Records</span>
            <span className="text-[10px] text-blue-600 font-medium block">100% Digitized</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Insurance Cover</span>
            <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">₹10 Lakhs</span>
            <span className="text-[10px] text-emerald-600 font-medium block">Active Family Floater</span>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Upcoming, Reminders, Records */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointment Card */}
          {upcomingApt && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Upcoming Doctor Consultation
                  </h3>
                </div>
                <Link
                  to="/patient/appointments"
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                >
                  Manage <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-teal-50/50 border border-teal-100">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">{upcomingApt.doctorName}</h4>
                  <p className="text-xs text-teal-800 font-medium">{upcomingApt.specialization}</p>
                  <p className="text-xs text-slate-500">{upcomingApt.hospital}</p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 text-xs">
                  <span className="font-bold text-slate-900 text-sm">{upcomingApt.date}</span>
                  <span className="font-mono text-teal-700 font-semibold">{upcomingApt.time}</span>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Today's Medicine Reminders */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                  <Pill className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Today's Medicine Schedule
                </h3>
              </div>
              <Link
                to="/patient/medicine-reminders"
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                All Reminders <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {todayReminders.map((rem) => (
                <div
                  key={rem.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                    rem.takenToday
                      ? 'bg-emerald-50/40 border-emerald-200/60'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleMedicineTaken(rem.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        rem.takenToday
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-slate-300 text-slate-400 hover:border-emerald-500'
                      }`}
                      title={rem.takenToday ? 'Mark as Not Taken' : 'Mark as Taken'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div>
                      <h4
                        className={`text-xs font-bold ${
                          rem.takenToday ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {rem.medicineName}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {rem.dosage} · {rem.frequency}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-semibold text-slate-700 block">
                      {rem.time}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${
                        rem.takenToday ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {rem.takenToday ? 'Taken' : 'Scheduled'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Health Records */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Recent Verified Health Records
                </h3>
              </div>
              <Link
                to="/patient/health-records"
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2">
              {recentRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-xs transition-all flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                        {rec.recordType}
                      </span>
                      <span className="text-[11px] text-slate-400">{rec.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{rec.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-1">{rec.description}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 shrink-0">
                    {rec.doctor}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Health Passport, Alerts, AI Assistant */}
        <div className="space-y-6">
          {/* Health QR Pass Compact Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs text-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 text-left">
              My THULIR Health QR Pass
            </h3>
            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 flex flex-col items-center">
              <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-xs border border-teal-200 flex items-center justify-center">
                <QrCode className="w-32 h-32 text-teal-800" />
              </div>
              <span className="font-mono text-xs font-bold text-teal-900 mt-2">
                {patient.patientId}
              </span>
              <span className="text-[11px] text-slate-500">Scan at Clinic or Pharmacy</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                onClick={() => setShowQRModal(true)}
                className="py-2 px-3 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors"
              >
                Expand Pass
              </button>
              <Link
                to="/patient/health-qr"
                className="py-2 px-3 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors flex items-center justify-center"
              >
                Full QR Page
              </Link>
            </div>
          </div>

          {/* Important Critical Alerts (Allergies) */}
          <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Critical Health Alerts
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                <span className="font-bold text-rose-950 block">Severe Drug Sensitivity:</span>
                <p className="text-rose-800 font-medium mt-0.5">
                  {patient.allergies?.join(', ') || 'Penicillin, Sulfa Drugs'}
                </p>
                <span className="text-[10px] text-rose-600 block mt-1">
                  Broad-spectrum beta-lactams strictly contraindicated.
                </span>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <span className="font-bold text-amber-950 block">Monitored Conditions:</span>
                <p className="text-amber-800 font-medium mt-0.5">
                  {patient.existingConditions?.join(', ')}
                </p>
              </div>
            </div>

            <Link
              to="/patient/important-issues"
              className="mt-3 block text-center text-xs font-bold text-teal-700 hover:underline"
            >
              View Full Clinical Issue Tracker →
            </Link>
          </div>

          {/* AI Health Companion Card */}
          <div className="bg-linear-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-5 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-300">
                  THULIR AI Health Companion
                </h3>
                <p className="text-[11px] text-slate-300">
                  Ask about your medicines, lab values, or appointments
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-200 bg-white/10 p-3 rounded-xl border border-white/10">
              "Your next cardiology review is scheduled with Dr. Arvind in 7 days. Need help preparing questions?"
            </p>

            <Link
              to="/patient/ai-assistant"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-slate-950 bg-teal-300 hover:bg-teal-200 rounded-xl transition-colors shadow-xs"
            >
              <Bot className="w-4 h-4" />
              <span>Open AI Health Assistant</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Prescription Camera Scanner Modal */}
      <PrescriptionScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onPrescriptionSaved={() => {
          navigate('/patient/prescriptions');
        }}
      />

      {/* QR Modal Popup */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-sm">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-white text-slate-800 shadow-lg flex items-center justify-center font-bold"
            >
              ✕
            </button>
            <HealthQRCodeCard
              patientId={patient.patientId}
              patientName={patient.fullName}
              bloodGroup={patient.bloodGroup}
            />
          </div>
        </div>
      )}
    </div>
  );
};
