import React, { useState } from 'react';
import { Bell, CheckCheck, Calendar, Pill, FileText, Tag, MessageSquare, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../../types';

export const PatientNotifications: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsRead, showToast } = useApp();
  const [filter, setFilter] = useState<string>('All');

  const patientNotifs = notifications.filter((n) => n.targetRole === 'patient');

  const filtered = patientNotifs.filter((n) => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !n.isRead;
    return n.type === filter;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-4 h-4 text-teal-600" />;
      case 'reminder':
        return <Pill className="w-4 h-4 text-emerald-600" />;
      case 'prescription':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'offer':
        return <Tag className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Patient Alerts & Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Care circle updates, dosage reminders, lab releases, and nearby pharmacy alerts
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        {['All', 'Unread', 'appointment', 'reminder', 'prescription', 'offer'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap capitalize transition-colors ${
              filter === tab
                ? 'bg-teal-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab === 'reminder' ? 'Dose Reminders' : tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No Notifications</h3>
            <p className="text-xs text-slate-500 mt-1">You are all caught up on alerts.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                !item.isRead
                  ? 'bg-teal-50/40 border-teal-200/80 shadow-2xs'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white border border-slate-200 shrink-0 shadow-2xs">
                  {getIcon(item.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-xs sm:text-sm font-bold ${
                        !item.isRead ? 'text-slate-900' : 'text-slate-700'
                      }`}
                    >
                      {item.title}
                    </h3>
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

              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
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
                    <span>Open</span>
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
