import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import type { MobileMessage } from '../../types/mobileMessaging';
import { fetchMessages, sendMessage, getQuickReplies, uploadVoiceNote } from '../../services/mobileMessagingService';
import QuickReply from './QuickReply';
import VoiceNote from './VoiceNote';

interface MobileConversationProps {
  conversationId: string;
  participantName: string;
  participantAvatar?: string;
  onBack: () => void;
}

const CURRENT_USER = 'user-1';

const MobileConversation: React.FC<MobileConversationProps> = ({
  conversationId,
  participantName,
  participantAvatar,
  onBack,
}) => {
  const [messages, setMessages] = useState<MobileMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages(conversationId).then(setMessages);
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText('');
    const msg = await sendMessage(conversationId, text);
    setMessages((prev) => [...prev, msg]);
  };

  const handleQuickReply = async (option: { text: string }) => {
    const msg = await sendMessage(conversationId, option.text, { isQuickReply: true });
    setMessages((prev) => [...prev, msg]);
    setShowQuickReplies(false);
  };

  const handleVoiceComplete = async (blob: Blob, duration: number) => {
    const result = await uploadVoiceNote(blob);
    const msg = await sendMessage(conversationId, 'Voice note', {
      voiceNoteUrl: result.url,
      voiceDuration: duration,
    });
    setMessages((prev) => [...prev, msg]);
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-full flex-col" style={{ backgroundColor: '#f1f3f4' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 text-white shadow-sm"
        style={{ backgroundColor: '#091a2b', fontFamily: "'Montserrat', sans-serif" }}
      >
        <button onClick={onBack} className="p-1" aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
        {participantAvatar ? (
          <img src={participantAvatar} alt={participantName} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
            {participantName.charAt(0)}
          </div>
        )}
        <span className="font-semibold">{participantName}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3" style={{ fontFamily: "'Open Sans', sans-serif" }}>
        {messages.map((msg) => {
          const isMine = msg.senderId === CURRENT_USER;
          return (
            <div key={msg.id} className={`mb-3 flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  isMine
                    ? 'rounded-br-md bg-[#3b4876] text-white'
                    : 'rounded-bl-md bg-white text-gray-900 shadow-sm'
                }`}
              >
                {msg.voiceNoteUrl ? (
                  <VoiceNote
                    onRecordingComplete={() => {}}
                    playbackUrl={msg.voiceNoteUrl}
                    playbackDuration={msg.voiceDuration}
                  />
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
                <p className={`mt-1 text-right text-[10px] ${isMine ? 'text-white/60' : 'text-gray-400'}`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {showQuickReplies && (
        <QuickReply options={getQuickReplies()} onSelect={handleQuickReply} />
      )}

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-gray-200 bg-white px-3 py-2">
        <VoiceNote onRecordingComplete={handleVoiceComplete} />
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-[#3b4876]"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-40"
          style={{ backgroundColor: '#091a2b' }}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default MobileConversation;
