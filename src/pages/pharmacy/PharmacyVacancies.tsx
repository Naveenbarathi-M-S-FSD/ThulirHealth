import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Phone, Mail, CheckCircle, ExternalLink, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PharmacyVacancy } from '../../types';

export const PharmacyVacancies: React.FC = () => {
  const { vacancies, applyToVacancy, showToast } = useApp();
  const [selectedVacancy, setSelectedVacancy] = useState<PharmacyVacancy | null>(null);

  const handleApply = (vac: PharmacyVacancy) => {
    applyToVacancy(vac.id);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pharmacy Careers & Professional Vacancies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Open postings for registered pharmacists (B.Pharm / D.Pharm / Pharm.D) and clinical store assistants
          </p>
        </div>

        <button
          onClick={() => showToast('Job recruitment form opened (Demo simulation)')}
          className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          Post a Pharmacy Vacancy
        </button>
      </div>

      {/* Vacancy Cards List */}
      <div className="space-y-4">
        {vacancies.map((vac) => (
          <div
            key={vac.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-teal-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                  {vac.pharmacyName}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">{vac.timing}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{vac.position}</h3>

              <div className="flex flex-wrap items-center gap-4 text-slate-600 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {vac.location}
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {vac.experienceRequired}
                </span>
                <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {vac.salaryRange}
                </span>
              </div>

              <p className="text-slate-600 leading-relaxed pt-1 line-clamp-2">
                {vac.jobDescription}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={() => setSelectedVacancy(vac)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Details
              </button>
              <button
                onClick={() => handleApply(vac)}
                className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Apply Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {selectedVacancy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-xs space-y-4 p-6">
            <div className="flex justify-between items-start pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedVacancy.position}</h3>
                <span className="font-semibold text-teal-800">{selectedVacancy.pharmacyName}</span>
              </div>
              <button onClick={() => setSelectedVacancy(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <p>Location: <strong>{selectedVacancy.location}</strong></p>
              <p>Experience: <strong>{selectedVacancy.experienceRequired}</strong></p>
              <p>Salary: <strong className="text-emerald-700">{selectedVacancy.salaryRange}</strong></p>
              <p>Work Timing: <strong>{selectedVacancy.timing}</strong></p>
            </div>

            <div>
              <span className="font-bold text-slate-800 block mb-1">Detailed Job Description:</span>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {selectedVacancy.jobDescription}
              </p>
            </div>

            <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 space-y-1 text-teal-900">
              <span className="font-bold block">Recruiter Contact:</span>
              <p>Phone: {selectedVacancy.contactDetails.phone}</p>
              <p>Email: {selectedVacancy.contactDetails.email}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedVacancy(null)}
                className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApply(selectedVacancy);
                  setSelectedVacancy(null);
                }}
                className="px-5 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
