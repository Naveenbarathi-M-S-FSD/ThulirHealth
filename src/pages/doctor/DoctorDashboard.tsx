import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  Clock,
  UserCheck,
  QrCode,
  FilePlus,
  Activity,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Microscope,
  Stethoscope,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QRScannerModal } from '../../components/common/QRScannerModal';
import { PatientUser } from '../../types';

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    patients,
    appointments,
    labReports,
    setSelectedDoctorPatientId,
    showToast,
  } = useApp();

  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  const doctor =
    currentUser && currentUser.role === 'doctor'
      ? currentUser
      : {
          fullName: 'Dr. Arvind Swaminathan',
          doctorId: 'TH-D-4012',
          specialization: 'Cardiology & Internal Medicine',
          hospitalName: 'Apollo Speciality Hospitals, Greams Road',
        };

  const todayAppointments = appointments.filter((a) => a.date.startsWith('2026-04') || a.status === 'Upcoming');

  const handlePatientFound = (found: PatientUser) => {
    setSelectedDoctorPatientId(found.patientId);
    showToast(`Patient profile loaded: ${found.fullName} (${found.patientId})`);
    navigate('/doctor/patient-health');
  };

  return (
    <div className="space-y-6">
      {/* Clinical Workspace Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300">
                Senior Clinical Workstation
              </span>
              <span className="text-xs text-slate-400">ID: {doctor.doctorId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {doctor.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {doctor.specialization} · {doctor.hospitalName}
            </p>
          </div>

          {/* Quick Doctor Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsQRScannerOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan Patient Health QR</span>
            </button>

            <Link
              to="/doctor/prescription-builder"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/15 transition-all"
            >
              <FilePlus className="w-4 h-4 text-emerald-400" />
              <span>Create Prescription</span>
            </Link>
          </div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Total Patients</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">{patients.length}</span>
            <span className="text-[10px] text-teal-700 font-semibold block">Under Care Network</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Today's Appointments</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">{todayAppointments.length}</span>
            <span className="text-[10px] text-blue-700 font-semibold block">3 OPD, 1 Video Consult</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Waiting in Clinic</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">1</span>
            <span className="text-[10px] text-amber-700 font-semibold block">Triage completed</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Pending Follow-ups</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">2</span>
            <span className="text-[10px] text-emerald-700 font-semibold block">Lab reviews due</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Schedule & Patient Queue */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Today's Outpatient Consultation Schedule
                </h3>
              </div>
              <Link
                to="/doctor/appointments"
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                Full Schedule <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-teal-50/40 border border-slate-200/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-teal-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      {apt.time}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{apt.patientName}</h4>
                      <p className="text-[11px] text-slate-500">{apt.purpose}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedDoctorPatientId(apt.patientId);
                        navigate('/doctor/patient-health');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-teal-800 bg-white border border-teal-200 hover:bg-teal-50 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <span>Chart</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Enrolled Patients */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Active Clinical Patients
                </h3>
              </div>
              <Link
                to="/doctor/patients"
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                All Patients <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {patients.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedDoctorPatientId(p.patientId);
                    navigate('/doctor/patient-health');
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-400 hover:shadow-xs transition-all cursor-pointer space-y-1.5"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-slate-900">{p.fullName}</span>
                    <span className="font-mono text-[10px] text-teal-700 font-semibold">{p.patientId}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {p.age} Yrs · Blood {p.bloodGroup}
                  </p>
                  <span className="inline-block text-[10px] font-semibold text-rose-700">
                    Allergy: {p.allergies[0] || 'None'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Clinical Support & Quick Tools */}
        <div className="space-y-6">
          {/* AI Clinical Support Teaser Card */}
          <div className="bg-linear-to-br from-teal-900 to-slate-900 text-white rounded-2xl p-5 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-teal-300">
              <Activity className="w-5 h-5" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                THULIR AI Clinical Support
              </h3>
            </div>

            <p className="text-xs text-slate-200 bg-white/10 p-3 rounded-xl border border-white/10 leading-relaxed">
              Observation for Priya Sharma (TH-P-8921): Recent lipid profile indicates LDL reduction (102 mg/dL). No beta-lactam allergy flags on current regimen.
            </p>

            <Link
              to="/doctor/ai-clinical"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-slate-950 bg-teal-300 hover:bg-teal-200 rounded-xl transition-colors shadow-xs"
            >
              <span>Review AI Clinical Insights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <p className="text-[10px] text-slate-400 text-center">
              AI-assisted suggestion. Doctor review required.
            </p>
          </div>

          {/* Quick Lab Reports Feed */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Microscope className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  New Diagnostic Reports
                </h3>
              </div>
              <Link to="/doctor/lab-reports" className="text-xs font-semibold text-teal-700">
                View
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              {labReports.slice(0, 3).map((r) => (
                <div key={r.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{r.patientName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{r.date}</span>
                  </div>
                  <span className="text-[11px] text-teal-800 font-semibold block">{r.testName}</span>
                  <span className="text-[10px] text-slate-500 font-mono truncate block">{r.result}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
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
