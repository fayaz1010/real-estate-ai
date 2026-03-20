import React, { useCallback, useEffect, useMemo } from "react";

import type { Conversation } from "../../../types/communication";
import { useAuth } from "../../auth/hooks/useAuth";
import { MessageInput } from "../components/MessageInput";
import { MessageList } from "../components/MessageList";
import { useCommunication } from "../hooks/useCommunication";
import { useRealtimeMessages } from "../hooks/useRealtimeMessages";

const ConnectionIndicator: React.FC<{
  connectionState: "disconnected" | "connecting" | "connected";
}> = ({ connectionState }) => {
  const config = {
    connected: { color: "bg-green-500", label: "Connected" },
    connecting: { color: "bg-[#C4A882] animate-pulse", label: "Connecting..." },
    disconnected: { color: "bg-red-400", label: "Disconnected" },
  };

  const { color, label } = config[connectionState];

  return (
    <div className="flex items-center gap-1.5 transition-opacity duration-300">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span
        className="text-[10px] text-[#1A1A2E]/50"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {label}
      </span>
    </div>
  );
};

const OnlineStatusDot: React.FC<{ isOnline: boolean }> = ({ isOnline }) => (
  <span
    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white transition-colors duration-300 ${
      isOnline ? "bg-green-500" : "bg-[#1A1A2E]/20"
    }`}
  />
);

const ConversationItem: React.FC<{
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
  isOnline: (userId: string) => boolean;
}> = ({ conversation, isActive, onSelect, isOnline }) => {
  const otherParticipant = conversation.participants[0];
  const participantOnline = otherParticipant
    ? isOnline(otherParticipant.userId)
    : false;

  return (
    <button
      onClick={() => onSelect(conversation.id)}
      className={`w-full text-left px-4 py-3 border-b border-[#C4A882]/10 transition-colors duration-200 hover:bg-[#FFFFFF] ${
        isActive ? "bg-[#FFFFFF] border-l-2 border-l-[#008080]" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        {otherParticipant && (
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#C4A882]/30 flex items-center justify-center text-[#008080] text-sm font-semibold">
              {otherParticipant.name.charAt(0).toUpperCase()}
            </div>
            <OnlineStatusDot isOnline={participantOnline} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <h3
              className="text-sm font-semibold text-[#1A1A2E] truncate"
              style={{ fontFamily: "'Manrope', serif" }}
            >
              {conversation.subject}
            </h3>
            {conversation.unreadCount > 0 && (
              <span className="ml-2 flex-shrink-0 bg-[#008080] text-white text-[10px] font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5">
                {conversation.unreadCount}
              </span>
            )}
          </div>
          {otherParticipant && (
            <p
              className="text-xs text-[#1A1A2E]/50 truncate"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {otherParticipant.name}
            </p>
          )}
          {conversation.lastMessage && (
            <p
              className="text-xs text-[#1A1A2E]/40 truncate mt-0.5"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {conversation.lastMessage.content}
            </p>
          )}
        </div>
      </div>
    </button>
  );
};

export const CommunicationPage: React.FC = () => {
  const { user } = useAuth();
  const {
    conversations,
    activeConversationId,
    activeConversation,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    isSending,
    error,
    loadConversations,
    send,
    selectConversation,
    resetError,
  } = useCommunication();

  const {
    newMessage,
    connectionState,
    typingUsers,
    sendTypingIndicator,
    stopTypingIndicator,
    isUserOnline,
  } = useRealtimeMessages();

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Handle real-time messages arriving
  useEffect(() => {
    if (newMessage && activeConversationId) {
      // Messages are handled by the Redux store via addRealtimeMessage
      // The hook triggers re-renders when newMessage changes
    }
  }, [newMessage, activeConversationId]);

  const handleSend = async (content: string) => {
    if (!activeConversationId) return;
    try {
      await send(activeConversationId, content);
    } catch {
      // Error handled by Redux
    }
  };

  const handleTyping = useCallback(() => {
    if (activeConversationId) {
      sendTypingIndicator(activeConversationId);
    }
  }, [activeConversationId, sendTypingIndicator]);

  const handleStopTyping = useCallback(() => {
    if (activeConversationId) {
      stopTypingIndicator(activeConversationId);
    }
  }, [activeConversationId, stopTypingIndicator]);

  // Get names of users currently typing in active conversation
  const typingUserNames = useMemo(() => {
    if (!activeConversationId || !activeConversation) return [];

    const typingSet = typingUsers.get(activeConversationId);
    if (!typingSet || typingSet.size === 0) return [];

    const currentUserId = user?.id || "";
    const names: string[] = [];

    typingSet.forEach((userId) => {
      if (userId === currentUserId) return;
      const participant = activeConversation.participants.find(
        (p) => p.userId === userId,
      );
      names.push(participant?.name || "Someone");
    });

    return names;
  }, [activeConversationId, activeConversation, typingUsers, user]);

  const currentUserId = user?.id || "";

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl font-bold text-[#1A1A2E]"
            style={{ fontFamily: "'Manrope', serif" }}
          >
            Messages
          </h1>
          <ConnectionIndicator connectionState={connectionState} />
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 flex items-center justify-between">
            <p
              className="text-sm text-red-700"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {error}
            </p>
            <button
              onClick={resetError}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-[#C4A882]/20 overflow-hidden flex h-[calc(100vh-200px)] min-h-[500px]">
          {/* Conversation sidebar */}
          <div className="w-80 border-r border-[#C4A882]/20 flex flex-col bg-white">
            <div className="px-4 py-3 border-b border-[#C4A882]/20">
              <h2
                className="text-sm font-semibold text-[#1A1A2E]"
                style={{ fontFamily: "'Manrope', serif" }}
              >
                Conversations
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoadingConversations ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#008080] border-t-transparent" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-6 text-center">
                  <p
                    className="text-sm text-[#1A1A2E]/50"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    No conversations yet
                  </p>
                </div>
              ) : (
                conversations.map((convo) => (
                  <ConversationItem
                    key={convo.id}
                    conversation={convo}
                    isActive={convo.id === activeConversationId}
                    onSelect={selectConversation}
                    isOnline={isUserOnline}
                  />
                ))
              )}
            </div>
          </div>

          {/* Message area */}
          <div className="flex-1 flex flex-col bg-[#FFFFFF]">
            {activeConversation ? (
              <>
                {/* Header */}
                <div className="px-6 py-3 border-b border-[#C4A882]/20 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2
                        className="text-sm font-semibold text-[#1A1A2E]"
                        style={{ fontFamily: "'Manrope', serif" }}
                      >
                        {activeConversation.subject}
                      </h2>
                      <p
                        className="text-xs text-[#1A1A2E]/50"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {activeConversation.participants
                          .map((p) => p.name)
                          .join(", ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {activeConversation.participants
                        .filter((p) => p.userId !== currentUserId)
                        .map((p) => (
                          <div
                            key={p.userId}
                            className="flex items-center gap-1.5"
                          >
                            <span
                              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                                isUserOnline(p.userId)
                                  ? "bg-green-500"
                                  : "bg-[#1A1A2E]/20"
                              }`}
                            />
                            <span
                              className="text-[10px] text-[#1A1A2E]/40"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                              {isUserOnline(p.userId) ? "Online" : "Offline"}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <MessageList
                  messages={messages}
                  currentUserId={currentUserId}
                  isLoading={isLoadingMessages}
                  typingUserNames={typingUserNames}
                />

                <MessageInput
                  onSend={handleSend}
                  onTyping={handleTyping}
                  onStopTyping={handleStopTyping}
                  isSending={isSending}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#C4A882]/20 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-[#008080]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <p
                    className="text-[#1A1A2E]/50 text-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Select a conversation to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationPage;
