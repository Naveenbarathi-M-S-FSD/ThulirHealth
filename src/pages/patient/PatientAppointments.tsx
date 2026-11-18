import React, { useState } from 'react';
import { Calendar, Clock, Plus, CheckCircle, XCircle, AlertCircle, Eye, RefreshCw, X, Shield, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';

export const PatientAppointments: React.FC = () => {
  const { appointments, addAppointment, updateAppointmentStatus, cancelAppointment, showToast } = useApp();

  const [filter, setFilter] = useState<'All' | 'Upcoming' | 'Completed' | 'Cancelled'>('All');
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // Booking Form State
  const [doctorName, setDoctorName] = useState('Dr. Arvind Swaminathan');
  const [specialization, setSpecialization] = useState('Cardiology & Internal Medicine');
  const [hospital, setHospital] = useState('Apollo Speciality Hospitals, Greams Road');
  const [bookingDate, setBookingDate] = useState('2026-04-20');
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [purpose, setPurpose] = useState('Cardiovascular Checkup & BP Review');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = appointments.filter((a) => {
    if (filter === 'All') return true;
    return a.status === filter;
  });

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await addAppointment({
        patientId: 'TH-P-8921',
        patientName: 'Priya Sharma',
        doctorId: 'TH-D-4012',
        doctorName,
        specialization,
        hospital,
        date: bookingDate,
        time: bookingTime,
        purpose,
        status: 'Upcoming',
        notes: 'Consultation scheduled via THULIR patient portal.',
      });
      setShowBookModal(false);
    } catch (err: any) {
      console.error('Failed to book appointment in Firestore:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleApt || !newDate || !newTime || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await updateAppointmentStatus(rescheduleApt.id, 'Upcoming');
      showToast(`Appointment rescheduled in Firestore to ${newDate} at ${newTime}`);
      setRescheduleApt(null);
    } catch (err: any) {
      console.error('Failed to reschedule in Firestore:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Consultation Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Schedule and manage specialist doctor appointments across partner hospitals
          </p>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
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

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((apt) => (
          <div
            key={apt.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-teal-200 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
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

                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{apt.date} · {apt.time}</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{apt.doctorName}</h3>
              <p className="text-xs text-teal-800 font-semibold">{apt.specialization}</p>
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{apt.hospital}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400 block text-[10px]">Reason for Visit</span>
                <span className="font-medium text-slate-800">{apt.purpose}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedApt(apt)}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> Details
              </button>

              {apt.status === 'Upcoming' && (
                <>
                  <button
                    onClick={() => {
                      setRescheduleApt(apt);
                      setNewDate(apt.date);
                      setNewTime(apt.time);
                    }}
                    className="px-2.5 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Reschedule
                  </button>
                  <button
                    onClick={() => cancelAppointment(apt.id)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Schedule Clinical Appointment</h3>
              <button onClick={() => setShowBookModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleBook} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Doctor</label>
                <select
                  value={doctorName}
                  onChange={(e) => {
                    setDoctorName(e.target.value);
                    if (e.target.value.includes('Arvind')) {
                      setSpecialization('Cardiology & Internal Medicine');
                      setHospital('Apollo Speciality Hospitals, Greams Road');
                    } else if (e.target.value.includes('Meera')) {
                      setSpecialization('Endocrinology & Diabetology');
                      setHospital('Kauvery Hospital, Alwarpet');
                    } else {
                      setSpecialization('Pulmonology');
                      setHospital('Government General Hospital / MMC');
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="Dr. Arvind Swaminathan">Dr. Arvind Swaminathan (Cardiology)</option>
                  <option value="Dr. Meera Nambiar">Dr. Meera Nambiar (Endocrinology)</option>
                  <option value="Dr. Karthik Subramaniam">Dr. Karthik Subramaniam (Pulmonology)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Consultation Date</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Time Slot</label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="09:30 AM">09:30 AM (Morning Slot)</option>
                  <option value="10:30 AM">10:30 AM (Morning Slot)</option>
                  <option value="11:30 AM">11:30 AM (Morning Slot)</option>
                  <option value="04:00 PM">04:00 PM (Evening Slot)</option>
                  <option value="05:30 PM">05:30 PM (Evening Slot)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Consultation Purpose</label>
                <input
                  type="text"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Follow-up blood sugar check"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {isSubmitting && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  <span>{isSubmitting ? 'Saving to Firestore...' : 'Confirm Appointment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 border border-slate-200 text-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Reschedule Consultation</h3>
            <p className="text-slate-500 mb-4">{rescheduleApt.doctorName}</p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Time Slot</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setRescheduleApt(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {isSubmitting && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  <span>{isSubmitting ? 'Updating...' : 'Update Booking'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
