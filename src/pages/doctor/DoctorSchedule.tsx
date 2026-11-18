import React, { useState } from 'react';
import { Calendar, Clock, Plus, CheckCircle, ChevronLeft, ChevronRight, User, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ScheduleSlot {
  id: string;
  time: string;
  patientName: string;
  patientId: string;
  type: 'OPD In-Person' | 'Telehealth Video' | 'Procedure Review';
  status: 'Confirmed' | 'Completed' | 'Pending';
  notes: string;
}

const INITIAL_SCHEDULE: ScheduleSlot[] = [
  {
    id: 'slot-1',
    time: '09:00 AM - 09:30 AM',
    patientName: 'Priya Sharma',
    patientId: 'TH-P-8921',
    type: 'OPD In-Person',
    status: 'Confirmed',
    notes: 'Hypertension follow-up & BP review.',
  },
  {
    id: 'slot-2',
    time: '09:30 AM - 10:00 AM',
    patientName: 'Rajesh Kumar',
    patientId: 'TH-P-7204',
    type: 'OPD In-Person',
    status: 'Confirmed',
    notes: 'Bronchial asthma inhaler check.',
  },
  {
    id: 'slot-3',
    time: '10:30 AM - 11:00 AM',
    patientName: 'Ananya Iyer',
    patientId: 'TH-P-3319',
    type: 'Telehealth Video',
    status: 'Confirmed',
    notes: 'Thyroid profile & dosage adjustment.',
  },
  {
    id: 'slot-4',
    time: '11:30 AM - 12:00 PM',
    patientName: 'Clinical Rounds & Ward Review',
    patientId: 'Apollo Hospital',
    type: 'Procedure Review',
    status: 'Confirmed',
    notes: 'CCU cardiology post-op review.',
  },
];

export const DoctorSchedule: React.FC = () => {
  const { showToast } = useApp();
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(INITIAL_SCHEDULE);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTime, setNewTime] = useState('02:00 PM - 02:30 PM');
  const [newPatient, setNewPatient] = useState('Priya Sharma');
  const [newType, setNewType] = useState<ScheduleSlot['type']>('OPD In-Person');
  const [newNotes, setNewNotes] = useState('Routine review');

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setSchedule([
      ...schedule,
      {
        id: `slot-${Date.now()}`,
        time: newTime,
        patientName: newPatient,
        patientId: 'TH-P-8921',
        type: newType,
        status: 'Confirmed',
        notes: newNotes,
      },
    ]);
    setShowAddModal(false);
    showToast('New clinical schedule slot created.');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Clinical Calendar & Timetable
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Outpatient department consulting blocks and clinical ward allocations
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Consultation Block</span>
        </button>
      </div>

      {/* Date Header Strip */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-700" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">Today's Clinic Day: Wednesday, April 15, 2026</h2>
            <p className="text-xs text-slate-500">Apollo Speciality Hospitals OPD Chamber 402</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full">
          {schedule.length} Scheduled Slots
        </span>
      </div>

      {/* Slots List */}
      <div className="space-y-3">
        {schedule.map((slot) => (
          <div
            key={slot.id}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div className="px-3 py-2 bg-slate-100 rounded-xl font-mono text-xs font-bold text-slate-800 shrink-0">
                {slot.time}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{slot.patientName}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      slot.type === 'Telehealth Video'
                        ? 'bg-purple-50 text-purple-800'
                        : slot.type === 'Procedure Review'
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-teal-50 text-teal-800'
                    }`}
                  >
                    {slot.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{slot.notes}</p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg self-end sm:self-center">
              ✓ {slot.status}
            </span>
          </div>
        ))}
      </div>

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 border border-slate-200 text-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Clinical Time Slot</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddSlot} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Time Range</label>
                <input
                  type="text"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Patient or Activity</label>
                <input
                  type="text"
                  required
                  value={newPatient}
                  onChange={(e) => setNewPatient(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Appointment Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="OPD In-Person">OPD In-Person</option>
                  <option value="Telehealth Video">Telehealth Video</option>
                  <option value="Procedure Review">Procedure Review</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Notes</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
