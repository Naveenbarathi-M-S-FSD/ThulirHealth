import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bot,
  Send,
  X,
  Maximize2,
  Trash2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  ChevronDown,
  ShieldCheck,
  Pill,
  Calendar,
  Heart,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  ChatMessage,
  buildAuthorizedPatientContext,
  sendChatMessage,
  speakText,
  stopSpeaking,
} from '../../services/aiChatService';

const SUGGESTED_QUESTIONS = [
  'Summarize my saved health records',
  'Show my upcoming appointments',
  'What prescriptions are saved in my account?',
  'Show my medicine reminders',
  'Explain a medical term in simple English',
  'Help me find nearby available medicines',
  'How can I prepare for my next doctor visit?',
];

const STORAGE_KEY = 'thulir_floating_ai_chat_history';

export const FloatingAIChatWidget: React.FC = () => {
  const {
    currentUser,
    role,
    language,
    prescriptions,
    appointments,
    medicineReminders,
    healthRecords,
    pharmacyProducts,
    showToast,
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  // If user is already on the dedicated full-page AI Assistant, minimize or hide floating widget
  const isOnDedicatedAIPage = location.pathname.includes('/ai-assistant');

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'ai',
        text: "Hello! I'm THULIR AI Assistant.\nHow can I help you understand your health information today?",
        timestamp: 'Just now',
        grounded: true,
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUserPrompt, setLastUserPrompt] = useState<string>('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Build authorized patient context
  const patientContext = useMemo(() => {
    const patientUser = role === 'patient' && currentUser && 'patientId' in currentUser ? currentUser : null;
    return buildAuthorizedPatientContext(
      patientUser,
      prescriptions,
      appointments,
      medicineReminders,
      healthRecords,
      pharmacyProducts
    );
  }, [currentUser, role, prescriptions, appointments, medicineReminders, healthRecords, pharmacyProducts]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText !== undefined ? customText : input).trim();
    if (!textToSend || isLoading) return;

    setErrorMessage(null);
    setLastUserPrompt(textToSend);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(textToSend, newHistory, patientContext, language);

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: response.model,
        grounded: response.grounded,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setErrorMessage('Unable to process your query right now. Please check your connection or retry.');
      const errMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'I ran into a temporary issue retrieving your health records. Please click Retry below.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleRetry = () => {
    if (lastUserPrompt) {
      // Remove last error message if present
      setMessages((prev) => prev.filter((m) => !m.isError));
      handleSendMessage(lastUserPrompt);
    }
  };

  const handleClearChat = () => {
    const welcome: ChatMessage = {
      id: `msg-welcome-${Date.now()}`,
      sender: 'ai',
      text: "Hello! I'm THULIR AI Assistant.\nHow can I help you understand your health information today?",
      timestamp: 'Just now',
      grounded: true,
    };
    setMessages([welcome]);
    setShowClearConfirm(false);
    stopSpeaking();
    setSpeakingId(null);
    showToast('AI conversation cleared');
  };

  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSpeak = (text: string, id: string) => {
    if (speakingId === id) {
      stopSpeaking();
      setSpeakingId(null);
    } else {
      stopSpeaking();
      setSpeakingId(id);
      speakText(text, () => setSpeakingId(null));
    }
  };

  // Voice Input handler
  const handleToggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsListening(true);
        showToast('Listening... Speak your health question');

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInput(transcript);
            setIsListening(false);
            handleSendMessage(transcript);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch (e) {
        // Fallback simulation
      }
    }

    // Fallback simulation for unsupported browsers
    setIsListening(true);
    showToast('Voice microphone active (Simulating speech input)...');
    setTimeout(() => {
      setIsListening(false);
      setInput('Summarize my saved health records');
      handleSendMessage('Summarize my saved health records');
    }, 2000);
  };

  const handleOpenDedicatedPage = () => {
    setIsOpen(false);
    navigate('/patient/ai-assistant');
  };

  // Hide floating widget if on dedicated page
  if (isOnDedicatedAIPage) {
    return null;
  }

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-full shadow-lg border border-slate-700/60 backdrop-blur-xs animate-fade-in pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Ask THULIR AI</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-teal-700 to-emerald-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/20"
            title="Open THULIR AI Assistant"
            aria-label="Open THULIR AI Assistant"
          >
            <Bot className="w-7 h-7 text-emerald-100 group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
          </button>
        </div>
      )}

      {/* Floating Chat Modal Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[420px] max-w-[460px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 text-white px-4 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-emerald-200 shadow-inner">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-teal-900"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-tight text-white">THULIR AI Assistant</h3>
                  <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 rounded-md">
                    Grounded
                  </span>
                </div>
                <p className="text-[11px] text-teal-100/80 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" />
                  <span>Linked to {patientContext.fullName} ({patientContext.patientId})</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowClearConfirm(true)}
                className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-white/10 transition-colors"
                title="Clear Conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleOpenDedicatedPage}
                className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-white/10 transition-colors"
                title="Expand to Full Page"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-white/10 transition-colors"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Connected Context Mini Ribbon */}
          <div className="bg-teal-50/80 border-b border-teal-100/70 px-3 py-1.5 flex items-center justify-between text-[11px] text-teal-900 shrink-0">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="flex items-center gap-1 font-medium whitespace-nowrap">
                <Pill className="w-3 h-3 text-teal-700" />
                {patientContext.activePrescriptions.length} Meds
              </span>
              <span className="text-teal-300">•</span>
              <span className="flex items-center gap-1 font-medium whitespace-nowrap">
                <Calendar className="w-3 h-3 text-teal-700" />
                {patientContext.upcomingAppointments.length} Visit
              </span>
              <span className="text-teal-300">•</span>
              <span className="flex items-center gap-1 font-medium whitespace-nowrap">
                <Heart className="w-3 h-3 text-rose-600" />
                BP {patientContext.vitals.bloodPressure}
              </span>
            </div>
            <span className="text-[10px] text-teal-700 font-semibold bg-white/70 px-1.5 py-0.5 rounded border border-teal-200">
              Verified
            </span>
          </div>

          {/* Clear Chat Confirmation Overlay */}
          {showClearConfirm && (
            <div className="bg-amber-50 border-b border-amber-200 p-3 shrink-0 flex items-center justify-between gap-3 text-xs text-amber-900 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Clear entire conversation history?</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2 py-1 text-[11px] text-slate-600 hover:bg-amber-100/80 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearChat}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                {msg.sender === 'ai' ? (
                  <div className="w-7 h-7 rounded-xl bg-teal-800 text-emerald-200 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5 text-xs font-bold">
                    P
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs group relative ${
                    msg.sender === 'user'
                      ? 'bg-teal-700 text-white rounded-tr-xs'
                      : msg.isError
                      ? 'bg-rose-50 border border-rose-200 text-rose-900 rounded-tl-xs'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line break-words font-normal">{msg.text}</p>

                  {/* Message Bottom Action Bar */}
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                    <span className={msg.sender === 'user' ? 'text-teal-200' : 'text-slate-400'}>
                      {msg.timestamp}
                    </span>

                    {msg.sender === 'ai' && !msg.isError && (
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopyMessage(msg.text, msg.id)}
                          className="p-1 hover:text-slate-700 rounded transition-colors"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <button
                          onClick={() => handleToggleSpeak(msg.text, msg.id)}
                          className="p-1 hover:text-slate-700 rounded transition-colors"
                          title="Read aloud"
                        >
                          {speakingId === msg.id ? (
                            <VolumeX className="w-3 h-3 text-teal-600 animate-pulse" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Thinking / Typing Animation */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-teal-800 text-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3 text-xs text-slate-600 flex items-center gap-2 shadow-2xs">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce delay-100"></span>
                    <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce delay-200"></span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">
                    Consulting authorized clinical records...
                  </span>
                </div>
              </div>
            )}

            {/* Retry Button on Error */}
            {errorMessage && !isLoading && (
              <div className="flex items-center justify-center pt-1">
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 text-rose-800 hover:bg-rose-200 text-xs font-medium rounded-xl transition-colors shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry previous query</span>
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions Quick Chips */}
          <div className="border-t border-slate-200 bg-white px-3 py-2 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                Quick:
              </span>
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  disabled={isLoading}
                  className="px-2.5 py-1 text-[11px] bg-slate-50 hover:bg-teal-50 hover:text-teal-900 hover:border-teal-200 border border-slate-200/90 text-slate-700 rounded-lg whitespace-nowrap transition-colors shadow-2xs disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input & Action Bar */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0 space-y-1.5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-300 focus-within:border-teal-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-100 transition-all"
            >
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-2 rounded-xl transition-colors ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
                }`}
                title={isListening ? 'Stop listening' : 'Speak health question'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? 'Listening to voice...' : 'Ask about appointments, meds, records...'}
                disabled={isLoading}
                className="flex-1 text-xs px-1 bg-transparent focus:outline-none text-slate-900 placeholder:text-slate-400 disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl transition-all shadow-xs shrink-0"
                title="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* AI Medical Disclaimer */}
            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 text-center px-1">
              <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
              <span>
                AI guidance based on verified records. For emergencies, contact Dr. Arvind or your doctor.
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
