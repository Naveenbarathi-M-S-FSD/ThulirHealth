import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  Globe,
  LogOut,
  User,
  ChevronDown,
  Menu,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language, PatientUser, DoctorUser, PharmacyUser } from '../../types';
import { ThulirLogo } from './ThulirLogo';

interface AppHeaderProps {
  onToggleMobileSidebar?: () => void;
  title?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onToggleMobileSidebar,
  title,
}) => {
  const navigate = useNavigate();
  const { currentUser, role, language, setLanguage, logout, notifications, t } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const unreadNotifications = notifications.filter(
    (n) => !n.isRead && (n.targetRole === role || !n.targetRole)
  );

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getProfilePath = () => {
    if (role === 'patient') return '/patient/profile';
    if (role === 'doctor') return '/doctor/profile';
    return '/pharmacy/profile';
  };

  const getNotificationsPath = () => {
    if (role === 'patient') return '/patient/notifications';
    if (role === 'doctor') return '/doctor/notifications';
    return '/pharmacy/notifications';
  };

  const displayName = currentUser
    ? 'fullName' in currentUser
      ? currentUser.fullName
      : (currentUser as PharmacyUser).pharmacyName
    : 'User';

  const userSubtitle = currentUser
    ? role === 'patient' && 'bloodGroup' in currentUser
      ? `${(currentUser as PatientUser).bloodGroup} · ID: ${(currentUser as PatientUser).patientId}`
      : role === 'doctor' && 'specialization' in currentUser
      ? (currentUser as DoctorUser).specialization
      : 'location' in currentUser
      ? (currentUser as PharmacyUser).location
      : ''
    : '';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-slate-200">
      {/* Zone 1: Mobile toggle & Breadcrumb/Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            {role === 'patient' && 'Patient Portal'}
            {role === 'doctor' && 'Clinical Practice Workstation'}
            {role === 'pharmacy' && 'Healthcare Marketplace & Pharmacy'}
          </span>
          {title && (
            <h1 className="text-sm font-bold text-slate-900 leading-tight">
              {title}
            </h1>
          )}
        </div>
      </div>

      {/* Zone 2: Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              role === 'patient'
                ? 'Search health records, prescriptions, doctors...'
                : role === 'doctor'
                ? 'Search patients by name or ID (TH-P-XXXX)...'
                : 'Search medicines, stock, batch numbers...'
            }
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>
      </div>

      {/* Zone 3: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="uppercase font-semibold">{language}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-40">
              <button
                onClick={() => handleLangChange('en')}
                className={`w-full px-3 py-1.5 text-xs text-left font-medium hover:bg-slate-50 flex items-center justify-between ${
                  language === 'en' ? 'text-teal-700 font-bold bg-teal-50/50' : 'text-slate-700'
                }`}
              >
                English {language === 'en' && '✓'}
              </button>
              <button
                onClick={() => handleLangChange('ta')}
                className={`w-full px-3 py-1.5 text-xs text-left font-medium hover:bg-slate-50 flex items-center justify-between ${
                  language === 'ta' ? 'text-teal-700 font-bold bg-teal-50/50' : 'text-slate-700'
                }`}
              >
                தமிழ் (Tamil) {language === 'ta' && '✓'}
              </button>
              <button
                onClick={() => handleLangChange('hi')}
                className={`w-full px-3 py-1.5 text-xs text-left font-medium hover:bg-slate-50 flex items-center justify-between ${
                  language === 'hi' ? 'text-teal-700 font-bold bg-teal-50/50' : 'text-slate-700'
                }`}
              >
                हिन्दी (Hindi) {language === 'hi' && '✓'}
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <button
          onClick={() => navigate(getNotificationsPath())}
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifications.length > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-600 rounded-full">
              {unreadNotifications.length}
            </span>
          )}
        </button>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {displayName.charAt(0)}
            </div>
            <div className="hidden sm:block text-left text-xs">
              <span className="font-semibold text-slate-900 block truncate max-w-[120px]">
                {displayName}
              </span>
              <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">
                {userSubtitle}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{displayName}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                <div className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-teal-50 text-teal-800">
                  Role: {role}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    navigate(getProfilePath());
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  {t('profile')}
                </button>
                <button
                  onClick={() => {
                    navigate(getNotificationsPath());
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Bell className="w-4 h-4 text-slate-400" />
                  {t('notifications')}
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t('logout')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
