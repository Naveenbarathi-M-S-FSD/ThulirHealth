import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, CheckCircle, ArrowRight, ShieldCheck, Heart, Stethoscope, Store } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThulirLogo } from '../../components/common/ThulirLogo';
import { UserRole } from '../../types';
import { isFirebaseConfigured, resetPasswordWithEmail } from '../../services/firebase';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAs, loginWithGoogle, loginWithEmailPassword, showToast } = useApp();

  const [username, setUsername] = useState('priyasharma');
  const [password, setPassword] = useState('thulir2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const navigateForRole = (targetRole: UserRole) => {
    if (targetRole === 'patient') navigate('/patient/dashboard');
    if (targetRole === 'doctor') navigate('/doctor/dashboard');
    if (targetRole === 'pharmacy') navigate('/pharmacy/dashboard');
  };

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please provide both username/email and password.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const resolvedRole = await loginWithEmailPassword(username, password);
      navigateForRole(resolvedRole);
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Invalid email or password. Please check your credentials or create an account.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please wait a moment and try again.');
      } else {
        setError(err?.message || 'Unable to sign in. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      const resolvedRole = await loginWithGoogle('patient');
      navigateForRole(resolvedRole);
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(err?.message || 'Google Sign-In failed. Please try again.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    loginAs(role);
    navigateForRole(role);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    if (isFirebaseConfigured) {
      try {
        await resetPasswordWithEmail(forgotEmail.trim());
        showToast(`Password reset email sent to ${forgotEmail.trim()}`);
      } catch (err: any) {
        showToast(err?.message || 'Unable to send reset email', 'error');
      }
    } else {
      showToast(`Password reset link sent to ${forgotEmail} (Demo simulation)`);
    }
    setShowForgotModal(false);
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-teal-50/30 to-emerald-50/20 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Brand Centering */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-2">
          <ThulirLogo size="lg" showTagline />
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Sign In to Your Health Space
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Connected Care. Made Simple. Unifying Patients, Doctors & Pharmacies.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-slate-200">
          {/* Quick Demo Access Bar */}
          <div className="mb-6 p-3 bg-teal-50/60 rounded-xl border border-teal-100">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-teal-900 mb-2">
              Instant Hackathon Demo Logins:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('patient')}
                className="flex flex-col items-center p-2 rounded-lg bg-white border border-teal-200 hover:border-teal-500 hover:bg-teal-50 text-slate-800 transition-all text-center group"
              >
                <Heart className="w-4 h-4 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-900">Patient</span>
                <span className="text-[10px] text-slate-500">Priya Sharma</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('doctor')}
                className="flex flex-col items-center p-2 rounded-lg bg-white border border-teal-200 hover:border-teal-500 hover:bg-teal-50 text-slate-800 transition-all text-center group"
              >
                <Stethoscope className="w-4 h-4 text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-900">Doctor</span>
                <span className="text-[10px] text-slate-500">Dr. Arvind</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('pharmacy')}
                className="flex flex-col items-center p-2 rounded-lg bg-white border border-teal-200 hover:border-teal-500 hover:bg-teal-50 text-slate-800 transition-all text-center group"
              >
                <Store className="w-4 h-4 text-teal-700 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-900">Pharmacy</span>
                <span className="text-[10px] text-slate-500">Apollo Meds</span>
              </button>
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400 font-medium">Or enter credentials</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleStandardLogin}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username or Email ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. priyasharma or drarvind"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <span className="text-slate-600">Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="font-medium text-teal-700 hover:text-teal-800"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-60 rounded-xl shadow-sm transition-colors"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Log In to THULIR'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {isFirebaseConfigured && (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 disabled:opacity-60 rounded-xl shadow-xs transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z" />
                </svg>
                <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>
            )}
          </form>

          {/* Registration Trigger */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-teal-700 hover:text-teal-800 underline underline-offset-2"
              >
                Create an Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Reset Password</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your registered email ID to receive a demo verification link.
            </p>
            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
