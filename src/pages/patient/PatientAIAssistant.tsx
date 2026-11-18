import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  Pill,
  Calendar,
  Heart,
  FileText,
  Clock,
  ArrowRight,
  ExternalLink,
  Info,
  Download,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

const STORAGE_KEY = 'thulir_patient_dedicated_ai_chat_history';

export const PatientAIAssistant: React.FC = () => {
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

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUserPrompt, setLastUserPrompt] = useState('');
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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
    const textToSend = (customText !== undefined ? customText : inputText).trim();
    if (!textToSend || isLoading) return;

    setErrorMessage(null);
    setLastUserPrompt(textToSend);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(textToSend, newHistory, patientContext, language);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: response.model,
        grounded: response.grounded,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setErrorMessage('Unable to complete request. Please try again or check your records.');
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'I ran into an issue retrieving clinical records. Click the Retry button below to try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleRetry = () => {
    if (lastUserPrompt) {
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
    showToast('Conversation cleared successfully');
  };

  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard');
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
        showToast('Listening... Speak your healthcare query');

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputText(transcript);
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

    // Fallback simulation
    setIsListening(true);
    showToast('Voice microphone active (Simulating speech input)...');
    setTimeout(() => {
      setIsListening(false);
      setInputText('Summarize my saved health records');
      handleSendMessage('Summarize my saved health records');
    }, 2000);
  };

  const handleExportChat = () => {
    const textContent = messages
      .map((m) => `[${m.timestamp}] ${m.sender === 'user' ? patientContext.fullName : 'THULIR AI'}:\n${m.text}\n`)
      .join('\n----------------------------------------\n\n');

    const blob = new Blob(
      [
        `THULIR AI HEALTH ASSISTANT SUMMARY\nPatient: ${patientContext.fullName} (${patientContext.patientId})\nExported: ${new Date().toLocaleString()}\n\n========================================\n\n${textContent}`,
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `THULIR_AI_Summary_${patientContext.patientId}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Chat history exported successfully');
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Top Header Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-700 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Bot className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                THULIR AI Health Assistant
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Gemini 3.8 Flash Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Personalized health guidance grounded strictly on your verified clinical records and prescriptions.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={handleExportChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs"
            title="Export Conversation"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export Summary</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/70 border border-rose-200/80 rounded-xl transition-colors shadow-2xs"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Authorized Health Data Grounding Ribbon */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white p-3.5 rounded-2xl shadow-sm shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold text-emerald-100">
              Authorized Context Linked:
            </span>
            <span className="text-teal-200/90 font-medium">
              {patientContext.fullName} ({patientContext.patientId}) • Blood Group {patientContext.bloodGroup}
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar text-[11px] text-teal-100">
            <button
              onClick={() => handleSendMessage('What prescriptions are saved in my account?')}
              className="flex items-center gap-1 hover:text-white transition-colors bg-white/10 px-2 py-0.5 rounded-lg border border-white/10"
            >
              <Pill className="w-3 h-3 text-emerald-300" />
              <span>{patientContext.activePrescriptions.length} Active Prescriptions</span>
            </button>
            <button
              onClick={() => handleSendMessage('Show my upcoming appointments')}
              className="flex items-center gap-1 hover:text-white transition-colors bg-white/10 px-2 py-0.5 rounded-lg border border-white/10"
            >
              <Calendar className="w-3 h-3 text-emerald-300" />
              <span>{patientContext.upcomingAppointments.length} Upcoming Consultation</span>
            </button>
            <button
              onClick={() => handleSendMessage('Show my medicine reminders')}
              className="flex items-center gap-1 hover:text-white transition-colors bg-white/10 px-2 py-0.5 rounded-lg border border-white/10"
            >
              <Clock className="w-3 h-3 text-emerald-300" />
              <span>{patientContext.medicineReminders.length} Reminders</span>
            </button>
            <button
              onClick={() => handleSendMessage('Summarize my saved health records')}
              className="flex items-center gap-1 hover:text-white transition-colors bg-white/10 px-2 py-0.5 rounded-lg border border-white/10"
            >
              <Heart className="w-3 h-3 text-rose-300" />
              <span>BP {patientContext.vitals.bloodPressure}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Clear Chat Confirmation Modal */}
      {showClearConfirm && (
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl shrink-0 flex items-center justify-between gap-3 text-xs text-amber-900 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Are you sure you want to clear your current conversation history with THULIR AI?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1 text-xs text-slate-600 hover:bg-amber-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleClearChat}
              className="px-3 py-1 font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-2xs"
            >
              Confirm Clear
            </button>
          </div>
        </div>
      )}

      {/* Suggested Questions Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap shrink-0">
          Suggested Questions:
        </span>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-teal-50 hover:text-teal-900 hover:border-teal-200 border border-slate-200/90 text-slate-700 rounded-xl whitespace-nowrap transition-colors shadow-2xs disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Main Chat Stream Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            {msg.sender === 'ai' ? (
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-800 to-emerald-700 text-emerald-200 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Bot className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-2xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 text-xs font-bold">
                P
              </div>
            )}

            {/* Bubble */}
            <div
              className={`max-w-2xl rounded-3xl p-4 text-xs md:text-sm leading-relaxed shadow-2xs group relative ${
                msg.sender === 'user'
                  ? 'bg-teal-700 text-white rounded-tr-xs shadow-xs'
                  : msg.isError
                  ? 'bg-rose-50 border border-rose-200 text-rose-900 rounded-tl-xs'
                  : 'bg-slate-50/90 border border-slate-200/80 text-slate-800 rounded-tl-xs'
              }`}
            >
              <p className="whitespace-pre-line font-normal">{msg.text}</p>

              {/* Message Bottom Action Bar */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-200/40 pt-1.5">
                <div className="flex items-center gap-2">
                  <span className={msg.sender === 'user' ? 'text-teal-200' : 'text-slate-400'}>
                    {msg.timestamp}
                  </span>
                  {msg.grounded && (
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 font-medium">
                      Verified Clinical Grounding
                    </span>
                  )}
                </div>

                {msg.sender === 'ai' && !msg.isError && (
                  <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopyMessage(msg.text, msg.id)}
                      className="p-1 hover:text-slate-700 rounded transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleToggleSpeak(msg.text, msg.id)}
                      className="p-1 hover:text-slate-700 rounded transition-colors"
                      title="Read aloud"
                    >
                      {speakingId === msg.id ? (
                        <VolumeX className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading / Thinking Animation */}
        {isLoading && (
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-2xl bg-teal-800 text-emerald-200 flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div className="p-4 bg-slate-50 rounded-3xl rounded-tl-xs border border-slate-200 text-xs text-slate-600 flex items-center gap-2.5 shadow-2xs">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce delay-200"></span>
              </div>
              <span className="font-medium text-slate-500">
                Grounding response on authorized health records & prescriptions...
              </span>
            </div>
          </div>
        )}

        {/* Retry button on Error */}
        {errorMessage && !isLoading && (
          <div className="flex items-center justify-center pt-2">
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-800 hover:bg-rose-200 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Query</span>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input & Voice Controls Area */}
      <div className="shrink-0 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-300 shadow-sm focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100"
        >
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-2.5 rounded-xl transition-colors ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isListening ? 'Stop recording' : 'Voice Input'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {isListening ? (
            <div className="flex-1 flex items-center gap-2 px-2 text-rose-600 text-xs font-semibold animate-pulse">
              <span>Listening... Speak your healthcare query clearly</span>
              <div className="flex items-center gap-0.5">
                <span className="w-1.5 h-3 bg-rose-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-5 bg-rose-500 rounded-full animate-bounce delay-75" />
                <span className="w-1.5 h-2 bg-rose-500 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about your medications, doctor consultations, lab reports, or medical terms..."
              disabled={isLoading}
              className="flex-1 text-xs md:text-sm px-2 py-1 bg-transparent focus:outline-none text-slate-900 placeholder:text-slate-400 disabled:opacity-60"
            />
          )}

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl transition-all shadow-xs shrink-0"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Medical Safety Disclaimer */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center px-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            <strong>AI Health Assistant guidance grounded on verified patient records.</strong> Not a replacement for emergency clinical care or doctor consultations. Always consult Dr. Arvind Swaminathan for acute symptoms.
          </span>
        </div>
      </div>
    </div>
  );
};
