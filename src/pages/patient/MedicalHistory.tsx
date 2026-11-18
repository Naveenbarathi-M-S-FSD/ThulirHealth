import React, { useState } from 'react';
import {
  Clock,
  Stethoscope,
  Camera,
  FileText,
  AlertTriangle,
  Pill,
  Calendar,
  CheckCircle,
  Filter,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MedicalHistoryEvent } from '../../types';

export const MedicalHistory: React.FC = () => {
  const { medicalHistory, addMedicalHistoryEvent, showToast } = useApp();
  const [filterType, setFilterType] = useState<string>('All');

  const filtered = medicalHistory.filter((ev) => {
    if (filterType === 'All') return true;
    return ev.eventType === filterType;
  });

  const getEventIcon = (type: MedicalHistoryEvent['eventType']) => {
    switch (type) {
      case 'Doctor Visit':
        return <Stethoscope className="w-4 h-4 text-teal-600" />;
      case 'Prescription Scan':
        return <Camera className="w-4 h-4 text-purple-600" />;
      case 'Doctor Prescription':
        return <Pill className="w-4 h-4 text-emerald-600" />;
      case 'Lab Report':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'Health Issue':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-600" />;
    }
  };

  const getBadgeColor = (type: MedicalHistoryEvent['eventType']) => {
    switch (type) {
      case 'Doctor Visit':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Prescription Scan':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Doctor Prescription':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Lab Report':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Health Issue':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Longitudinal Medical History Timeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Unified chronological journey of clinical visits, camera scans, lab markers, and treatments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
            {medicalHistory.length} Recorded Milestones
          </span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        {[
          'All',
          'Doctor Visit',
          'Doctor Prescription',
          'Prescription Scan',
          'Lab Report',
          'Medicine Update',
        ].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              filterType === type
                ? 'bg-teal-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Timeline Layout */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {filtered.map((event) => (
          <div key={event.id} className="relative group">
            {/* Timeline node icon */}
            <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-slate-300 group-hover:border-teal-500 flex items-center justify-center shadow-xs transition-colors">
              {getEventIcon(event.eventType)}
            </div>

            {/* Event Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2.5 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getBadgeColor(
                      event.eventType
                    )}`}
                  >
                    {event.eventType}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{event.title}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="font-mono">{event.date}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-teal-800 font-semibold">
                  <span>Care Provider / Source:</span>
                  <span>{event.doctorOrSource}</span>
                </div>

                <p className="text-slate-600 leading-relaxed pt-1">
                  {event.details}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
