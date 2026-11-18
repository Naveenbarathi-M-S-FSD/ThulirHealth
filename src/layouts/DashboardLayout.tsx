import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Info, AlertTriangle, Shield, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppSidebar } from '../components/common/AppSidebar';
import { AppHeader } from '../components/common/AppHeader';
import { FloatingAIChatWidget } from '../components/common/FloatingAIChatWidget';

interface DashboardLayoutProps {
  title?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ title }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const {
    toast,
    role,
    isFirestoreConnected,
    isDatabaseLoading,
    databaseError,
    isDemoMode,
    refreshDatabase,
  } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Sidebar for Desktop & Mobile drawer */}
      <AppSidebar
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-200">
        {/* Top Header */}
        <AppHeader
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          title={title}
        />

        {/* Global Database & Hackathon Status Banner */}
        <div className="bg-slate-900 text-slate-100 px-4 py-2 text-xs flex flex-wrap items-center justify-between border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2.5">
            {isFirestoreConnected ? (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Firestore Database: LIVE</span>
              </span>
            ) : isDatabaseLoading ? (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 font-semibold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>Connecting to Cloud Firestore...</span>
              </span>
            ) : isDemoMode ? (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 font-semibold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                <span>Local Storage: ACTIVE</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 font-semibold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <span>Firestore Disconnected</span>
              </span>
            )}

            <span className="text-slate-300 hidden md:inline text-[11px]">
              {isDemoMode ? (
                <>
                  <strong className="text-amber-300">DEMO MODE:</strong> Running locally with browser persistence. Configure <code className="text-teal-300">firebase-applet-config.json</code> to enable Google Cloud Firestore sync.
                </>
              ) : (
                <>
                  <strong className="text-emerald-300">FIREBASE MODE:</strong> All patient registrations, prescriptions, products, and appointments persist permanently in Google Cloud Firestore.
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => refreshDatabase()}
              disabled={isDatabaseLoading}
              className="flex items-center gap-1 text-[11px] font-medium text-teal-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
              title="Sync latest records from Firestore"
            >
              <span className={isDatabaseLoading ? 'animate-spin' : ''}>🔄</span>
              <span>{isDatabaseLoading ? 'Syncing...' : 'Sync Firestore'}</span>
            </button>
          </div>
        </div>

        {databaseError && (
          <div className="bg-rose-900/90 text-rose-100 px-4 py-2 text-xs flex items-center justify-between border-b border-rose-700 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
              <span>
                <strong>Database Error:</strong> {databaseError}. Click "Sync Firestore" to retry.
              </span>
            </div>
            <button
              onClick={() => refreshDatabase()}
              className="px-2.5 py-1 text-[11px] font-bold bg-white text-rose-900 rounded-md hover:bg-rose-100"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 lg:pb-8">
          <Outlet />
        </main>

        {/* Floating AI Chatbox Widget */}
        <FloatingAIChatWidget />

        {/* Global Toast Notification */}
        {toast && (
          <div className="fixed bottom-24 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 animate-slide-up text-xs font-medium max-w-sm">
            {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-teal-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};
