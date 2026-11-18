import React, { useState } from 'react';
import { AlertOctagon, AlertTriangle, ShieldCheck, Plus, CheckCircle, Clock, Calendar, User } from 'lucide-react';
import { INITIAL_HEALTH_ISSUES } from '../../data/mockData';
import { ImportantHealthIssue } from '../../types';
import { useApp } from '../../context/AppContext';

export const ImportantHealthIssues: React.FC = () => {
  const { showToast } = useApp();
  const [issues, setIssues] = useState<ImportantHealthIssue[]>(INITIAL_HEALTH_ISSUES);
  const [filterPriority, setFilterPriority] = useState<string>('All');

  const filtered = issues.filter((iss) => {
    if (filterPriority === 'All') return true;
    return iss.priority === filterPriority;
  });

  const getPriorityBadge = (p: ImportantHealthIssue['priority']) => {
    switch (p) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-extrabold';
      case 'High':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'Medium':
        return 'bg-blue-100 text-blue-900 border-blue-300 font-semibold';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300 font-medium';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Important Health Issues & Clinical Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Categorized risk matrix tracking chronic conditions, severe contraindications, and specialist follow-up deadlines
          </p>
        </div>

        <button
          onClick={() => showToast('Issue logged in clinical chart (Demo)')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Health Concern</span>
        </button>
      </div>

      {/* Priority Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        {['All', 'Critical', 'High', 'Medium', 'Normal'].map((p) => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              filterPriority === p
                ? 'bg-teal-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {p} Priority
          </button>
        ))}
      </div>

      {/* Issues Grid */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl p-6 border shadow-xs transition-all ${
              item.priority === 'Critical'
                ? 'border-rose-300 bg-rose-50/20 shadow-rose-100'
                : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] uppercase px-2.5 py-0.5 rounded-full border ${getPriorityBadge(
                    item.priority
                  )}`}
                >
                  {item.priority} Priority
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {item.issueName}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <span>Identified: {item.dateIdentified}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold text-[11px]">
                  {item.currentStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500">Managing Doctor:</span>
                <span className="font-semibold text-slate-900">{item.doctor}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500">Next Follow-up Due:</span>
                <span className="font-semibold text-teal-800 font-mono">{item.followUpDate}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-0.5">Clinical Protocol & Notes:</strong>
              {item.notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
