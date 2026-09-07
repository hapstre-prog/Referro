import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  CheckCircle2, 
  Sparkles, 
  User,
  Paperclip
} from 'lucide-react';

export const MessagesView: React.FC = () => {
  const { messages, user, networkContacts, sendMessage } = useApp();
  const [selectedContactId, setSelectedContactId] = useState<string>('cnt_sarah_chen');
  const [inputText, setInputText] = useState('');

  const selectedContact = networkContacts.find(c => c.id === selectedContactId) || networkContacts[0];
  const threadMessages = messages.filter(
    m => m.conversationId === `conv_${selectedContact?.id}` || m.recipientId === selectedContact?.id || m.senderId === selectedContact?.id
  );

  const handleSend = () => {
    if (!inputText.trim() || !selectedContact) return;
    sendMessage(selectedContact.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden max-w-6xl mx-auto h-[640px] flex">
      {/* Sidebar: Conversation list */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/60">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center">
            <MessageSquare className="w-4 h-4 text-indigo-600 mr-2" />
            Referral Messages
          </h3>
          <span className="text-[11px] text-slate-400">Tied to active referral opportunities</span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {networkContacts.slice(0, 5).map((c) => {
            const isSelected = c.id === selectedContact?.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedContactId(c.id)}
                className={`p-3.5 flex items-start space-x-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-white shadow-2xs border-l-4 border-indigo-600' : 'hover:bg-slate-100/80'
                }`}
              >
                <img src={c.avatarUrl} alt={c.name} className="w-10 h-10 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{c.name}</h4>
                    <span className="text-[10px] text-slate-400">Active</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{c.company}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main chat window */}
      <div className="flex-1 flex flex-col justify-between bg-white">
        {/* Chat header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={selectedContact.avatarUrl} alt={selectedContact.name} className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <h4 className="font-bold text-sm text-slate-900">{selectedContact.name}</h4>
              <span className="text-xs text-slate-500">{selectedContact.location} · {selectedContact.company}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Contract Verified
            </span>
          </div>
        </div>

        {/* Messages feed */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/40">
          {threadMessages.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              No previous messages with {selectedContact.name}. Start the conversation below or send a warm introduction.
            </div>
          ) : (
            threadMessages.map((m) => {
              const isMe = m.senderId === user.id;
              return (
                <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    {m.isAiDrafted && (
                      <div className="inline-flex items-center space-x-1 mb-2 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-200 text-[10px] font-bold">
                        <Bot className="w-3 h-3 mr-1" />
                        <span>AI-Structured Warm Introduction</span>
                      </div>
                    )}
                    <p>{m.text}</p>
                    <span className={`text-[10px] mt-2 block ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input box */}
        <div className="p-3.5 border-t border-slate-200 flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${selectedContact.name.split(' ')[0]} regarding referrals...`}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold transition-colors shadow-2xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
