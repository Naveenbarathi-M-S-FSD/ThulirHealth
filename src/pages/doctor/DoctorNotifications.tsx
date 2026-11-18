import React from 'react';
import { Bell, CheckCheck, Calendar, Microscope, UserCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const DoctorNotifications: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsRead } = useApp();

  const doctorNotifs = notifications.filter((n) => n.targetRole === 'doctor');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Doctor Clinical Alerts & Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Pending patient bookings, pathology releases, and follow-up warnings
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All Read</span>
        </button>
      </div>

      <div className="space-y-3">
        {doctorNotifs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No Doctor Notifications</h3>
            <p className="text-xs text-slate-500 mt-1">All clinical alerts are cleared.</p>
          </div>
        ) : (
          doctorNotifs.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                !item.isRead
                  ? 'bg-teal-50/40 border-teal-200/80 shadow-2xs'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white border border-slate-200 shrink-0">
                  {item.type === 'appointment' ? (
                    <Calendar className="w-4 h-4 text-teal-700" />
                  ) : (
                    <Microscope className="w-4 h-4 text-blue-700" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h3>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {item.timestamp}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!item.isRead && (
                  <button
                    onClick={() => markNotificationAsRead(item.id)}
                    className="text-[11px] font-semibold text-teal-700 hover:text-teal-800"
                  >
                    Mark read
                  </button>
                )}
                {item.link && (
                  <Link
                    to={item.link}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-teal-700 px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
