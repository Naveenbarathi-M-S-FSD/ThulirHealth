import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileText,
  Clock,
  Pill,
  Calendar,
  BellRing,
  ShieldCheck,
  QrCode,
  FileSpreadsheet,
  AlertOctagon,
  Bot,
  Bell,
  Settings,
  Users,
  CalendarCheck,
  Activity,
  Microscope,
  FilePlus,
  Stethoscope,
  PlusCircle,
  Package,
  ShoppingBag,
  Boxes,
  Tag,
  Search,
  MapPin,
  Briefcase,
  MessageSquare,
  LogOut,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThulirLogo } from './ThulirLogo';

interface AppSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { role, logout, t, currentUser } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const patientLinks = [
    { to: '/patient/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/patient/profile', label: t('profile'), icon: User },
    { to: '/patient/health-records', label: t('healthRecords'), icon: FileText },
    { to: '/patient/medical-history', label: 'Medical History', icon: Clock },
    { to: '/patient/prescriptions', label: t('prescriptions'), icon: Pill },
    { to: '/patient/appointments', label: t('appointments'), icon: Calendar },
    { to: '/patient/medicine-reminders', label: t('medicineReminders'), icon: BellRing },
    { to: '/patient/insurance', label: t('insurance'), icon: ShieldCheck },
    { to: '/patient/health-qr', label: t('healthQR'), icon: QrCode },
    { to: '/patient/health-summary', label: t('healthSummary'), icon: FileSpreadsheet },
    { to: '/patient/important-issues', label: t('importantIssues'), icon: AlertOctagon },
    { to: '/patient/ai-assistant', label: t('aiAssistant'), icon: Bot },
    { to: '/patient/notifications', label: t('notifications'), icon: Bell },
    { to: '/patient/settings', label: t('settings'), icon: Settings },
  ];

  const doctorLinks = [
    { to: '/doctor/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/doctor/patients', label: t('myPatients'), icon: Users },
    { to: '/doctor/patient-health', label: 'Patient Health', icon: Activity },
    { to: '/doctor/appointments', label: t('appointments'), icon: Calendar },
    { to: '/doctor/schedule', label: t('schedule'), icon: CalendarCheck },
    { to: '/doctor/lab-reports', label: t('labReports'), icon: Microscope },
    { to: '/doctor/prescription-builder', label: t('prescriptionBuilder'), icon: FilePlus },
    { to: '/doctor/ai-clinical', label: t('aiClinicalSupport'), icon: Stethoscope },
    { to: '/doctor/notifications', label: t('notifications'), icon: Bell },
    { to: '/doctor/profile', label: t('profile'), icon: User },
    { to: '/doctor/settings', label: t('settings'), icon: Settings },
  ];

  const pharmacyLinks = [
    { to: '/pharmacy/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/pharmacy/profile', label: 'Pharmacy Profile', icon: User },
    { to: '/pharmacy/create-post', label: t('createPost'), icon: PlusCircle },
    { to: '/pharmacy/my-posts', label: t('myPosts'), icon: Package },
    { to: '/pharmacy/marketplace', label: t('marketplace'), icon: ShoppingBag },
    { to: '/pharmacy/stock', label: t('stockAvailability'), icon: Boxes },
    { to: '/pharmacy/offers', label: t('offers'), icon: Tag },
    { to: '/pharmacy/search', label: t('search'), icon: Search },
    { to: '/pharmacy/location', label: t('location'), icon: MapPin },
    { to: '/pharmacy/vacancies', label: t('vacancies'), icon: Briefcase },
    { to: '/pharmacy/messages', label: t('messages'), icon: MessageSquare },
    { to: '/pharmacy/notifications', label: t('notifications'), icon: Bell },
    { to: '/pharmacy/settings', label: t('settings'), icon: Settings },
  ];

  const activeLinks =
    role === 'patient'
      ? patientLinks
      : role === 'doctor'
      ? doctorLinks
      : pharmacyLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800 bg-slate-950/40">
          <ThulirLogo size="sm" showTagline={false} />
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Pill */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {role === 'patient' && 'Patient Workspace'}
              {role === 'doctor' && 'Doctor Workspace'}
              {role === 'pharmacy' && 'Pharmacy Network'}
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono">
              {role === 'patient' && (currentUser && 'patientId' in currentUser ? currentUser.patientId : 'TH-P-8921')}
              {role === 'doctor' && (currentUser && 'doctorId' in currentUser ? currentUser.doctorId : 'TH-D-4012')}
              {role === 'pharmacy' && (currentUser && 'pharmacyId' in currentUser ? currentUser.pharmacyId : 'TH-PH-1098')}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {activeLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer logout & disclaimer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('logout')}</span>
          </button>
          <div className="mt-2 text-[10px] text-slate-400 text-center">
            THULIR v1.0 • Connected Care
          </div>
        </div>
      </aside>
    </>
  );
};
