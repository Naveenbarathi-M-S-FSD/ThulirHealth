import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Search, User, CheckCircle2, Store, Stethoscope, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PharmacyMessages: React.FC = () => {
  const { conversations, messages, sendMessage, currentUser, showToast } = useApp();

  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || 'conv-1');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const activeMessages = messages.filter((m) => m.conversationId === activeConvId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConvId]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(activeConvId, inputText);
    setInputText('');
  };

  const handleSimulateAttachment = () => {
    showToast('Prescription slip attached: Prescription_Batch_Apollo.pdf');
    sendMessage(activeConvId, 'I have attached the digital prescription verification file.', 'Prescription_Batch_Apollo.pdf');
  };

  const handleSimulateMic = () => {
    if (!isRecording) {
      setIsRecording(true);
      showToast('Recording voice memo (Simulated)...');
      setTimeout(() => {
        setIsRecording(false);
        sendMessage(activeConvId, 'Voice memo (0:14) - Confirming stock readiness.', undefined, true);
      }, 2500);
    }
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Healthcare Cross-Network Messages
          </h1>
          <p className="text-xs text-slate-500">
            Secure inquiries connecting Patients ↔ Doctors ↔ Partner Pharmacies
          </p>
        </div>
      </div>

      {/* Main Messaging Canvas: Split into Left Sidebar + Chat Window */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row">
        {/* Left Conversations Sidebar */}
        <div className="w-full md:w-80 border-r border-slate-200 flex flex-col shrink-0">
          {/* Search */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map((c) => {
              const names = Object.values(c.participantNames).join(' & ');
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`p-3.5 cursor-pointer transition-colors flex items-start gap-3 ${
                    activeConvId === c.id ? 'bg-teal-50/70 border-l-4 border-l-teal-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    <Store className="w-5 h-5 text-teal-300" />
                  </div>

                  <div className="flex-1 min-w-0 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-slate-900 truncate">{names}</h4>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">{c.lastMessageTime}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{c.lastMessage}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Chat Window */}
        <div className="flex-1 flex flex-col h-full bg-slate-50/40">
          {/* Chat Header */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {activeConv ? Object.values(activeConv.participantNames)[0]?.charAt(0) : 'C'}
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  {activeConv ? Object.values(activeConv.participantNames).join(' · ') : 'Direct Message'}
                </h3>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active Online Channel
                </span>
              </div>
            </div>

            <button
              onClick={() => showToast('Direct secure voice line connected')}
              className="p-2 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeMessages.map((msg) => {
              const isMe =
                currentUser &&
                (msg.senderId === currentUser.id ||
                  (currentUser.role === 'pharmacy' && msg.senderRole === 'pharmacy') ||
                  (currentUser.role === 'patient' && msg.senderRole === 'patient'));

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isMe ? 'bg-teal-700' : 'bg-slate-800'
                    }`}
                  >
                    {msg.senderName.charAt(0)}
                  </div>

                  <div
                    className={`max-w-md rounded-2xl p-3.5 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-teal-700 text-white rounded-tr-xs shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    <span
                      className={`block text-[10px] font-bold mb-1 ${
                        isMe ? 'text-teal-200' : 'text-slate-500'
                      }`}
                    >
                      {msg.senderName} ({msg.senderRole})
                    </span>

                    <p>{msg.text}</p>

                    {msg.attachmentName && (
                      <div className="mt-2 p-2 bg-white/10 rounded-lg flex items-center gap-2 border border-white/20">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span className="font-mono text-[11px] underline">{msg.attachmentName}</span>
                      </div>
                    )}

                    <span
                      className={`block text-[9px] mt-1.5 font-mono ${
                        isMe ? 'text-teal-200 text-right' : 'text-slate-400 text-left'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Composer */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <button
              type="button"
              onClick={handleSimulateAttachment}
              className="p-2 text-slate-400 hover:text-teal-700 hover:bg-slate-100 rounded-xl transition-colors"
              title="Attach Prescription or Lab Document"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleSimulateMic}
              className={`p-2 rounded-xl transition-colors ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title="Record Voice Memo"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type medicine order question or prescription inquiry..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
