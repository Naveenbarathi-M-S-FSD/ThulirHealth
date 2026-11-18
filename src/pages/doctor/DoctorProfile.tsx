import React from 'react';
import { User, Stethoscope, ShieldCheck, FileText, MapPin, Phone, Mail, Award, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DoctorProfile: React.FC = () => {
  const { currentUser } = useApp();

  const doctor =
    currentUser && currentUser.role === 'doctor'
      ? currentUser
      : {
          fullName: 'Dr. Arvind Swaminathan',
          doctorId: 'TH-D-4012',
          email: 'arvind.swaminathan@thulirhealth.org',
          phone: '+91 98840 55667',
          specialization: 'Cardiology & Internal Medicine',
          qualification: 'MD, DM (Cardiology), FACC',
          registrationNumber: 'TN-MED-48201',
          yearsOfExperience: 18,
          hospitalName: 'Apollo Speciality Hospitals, Greams Road',
          hospitalType: 'Private Super-Specialty',
          location: 'Chennai, Tamil Nadu',
          rating: 4.9,
          documents: [
            { name: 'Medical Council Registration.pdf', status: 'Demo Verified', uploadedAt: '2025-01-05' },
            { name: 'MD Cardiology Certificate.pdf', status: 'Demo Verified', uploadedAt: '2025-01-05' },
            { name: 'Apollo Clinical Privilege Letter.pdf', status: 'Demo Verified', uploadedAt: '2025-01-06' },
          ],
        };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Doctor Professional Profile & Credentials
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Medical council licensure, institutional affiliations, and clinical privileges
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-black text-2xl shadow-md">
            {doctor.fullName.charAt(3) || 'A'}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">{doctor.fullName}</h2>
                <span className="font-mono text-xs font-semibold text-teal-800">
                  Doctor ID: {doctor.doctorId} · Reg: {doctor.registrationNumber}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1 self-center sm:self-start">
                <CheckCircle className="w-3.5 h-3.5" /> Demo Verified
              </span>
            </div>

            <p className="text-xs text-teal-800 font-semibold pt-1">
              {doctor.specialization}
            </p>
            <p className="text-xs text-slate-500">{doctor.hospitalName}</p>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Qualifications</span>
            <span className="font-bold text-slate-900">{doctor.qualification}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Experience</span>
            <span className="font-bold text-slate-900">{doctor.yearsOfExperience} Years Clinical Practice</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Council Registration</span>
            <span className="font-mono font-bold text-teal-800">{doctor.registrationNumber}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Contact Phone</span>
            <span className="font-semibold text-slate-800">{doctor.phone}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Institutional Email</span>
            <span className="font-semibold text-slate-800 truncate block">{doctor.email}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Practice Location</span>
            <span className="font-semibold text-slate-800">{doctor.location}</span>
          </div>
        </div>

        {/* Verified Documents */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Uploaded Council Verification Documents
          </h3>

          <div className="space-y-2 text-xs">
            {doctor.documents?.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-teal-700 shrink-0" />
                  <span className="font-mono text-[11px] truncate">{doc.name}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
