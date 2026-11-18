import React, { useState } from 'react';
import { Calendar, Clock, Check, X, CheckCircle, RefreshCw, Eye, User, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';

export const DoctorAppointments: React.FC = () => {
  const { appointments, updateAppointmentStatus, showToast } = useApp();
  const [filter, setFilter] = useState<'All' | 'Upcoming' | 'Completed' | 'Cancelled'>('All');
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

  const filtered = appointments.filter((a) => {
    if (filter === 'All') return true;
    return a.status === filter;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Doctor Clinical Appointments & OPD Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review incoming consultation requests, manage OPD slots, and record visit outcomes
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              filter === tab
                ? 'bg-teal-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((apt) => (
          <div
            key={apt.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    apt.status === 'Upcoming'
                      ? 'bg-emerald-100 text-emerald-800'
                      : apt.status === 'Completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {apt.status}
                </span>

                <span className="font-mono text-slate-700 font-bold">
                  {apt.date} · {apt.time}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{apt.patientName}</h3>
                <span className="font-mono text-teal-800 font-semibold">{apt.patientId}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-slate-700">
                <span className="text-slate-400 block text-[10px]">Reason for Consult</span>
                <span className="font-medium">{apt.purpose}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-3 mt-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setSelectedApt(apt)}
                className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> Details
              </button>

              {apt.status === 'Upcoming' && (
                <>
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                    className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Complete Visit
                  </button>
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                    className="px-2.5 py-1 text-rose-700 hover:bg-rose-50 rounded-lg font-semibold"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 border border-slate-200 text-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Appointment Summary
            </h3>
            <div>
              <span className="text-slate-400 block text-[10px]">Patient</span>
              <span className="font-bold text-slate-900 text-sm">{selectedApt.patientName}</span>
              <span className="font-mono text-teal-800 font-semibold">{selectedApt.patientId}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Date & Time</span>
              <span className="font-bold text-slate-800">{selectedApt.date} at {selectedApt.time}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Purpose</span>
              <p className="text-slate-700">{selectedApt.purpose}</p>
            </div>
            {selectedApt.notes && (
              <div>
                <span className="text-slate-400 block text-[10px]">Notes</span>
                <p className="text-slate-600">{selectedApt.notes}</p>
              </div>
            )}
            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelectedApt(null)}
                className="px-4 py-2 font-bold text-slate-700 bg-slate-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
