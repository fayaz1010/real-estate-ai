import React, { useEffect } from "react";

import { useAuth } from "../../auth/hooks/useAuth";
import { MessageInput } from "../components/MessageInput";
import { MessageList } from "../components/MessageList";
import { useCommunication } from "../hooks/useCommunication";
import type { Conversation } from "../../../types/communication";

const ConversationItem: React.FC<{
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
}> = ({ conversation, isActive, onSelect }) => {
  const otherParticipant = conversation.participants[0];

  return (
    <button
      onClick={() => onSelect(conversation.id)}
      className={`w-full text-left px-4 py-3 border-b border-gray-100 transition-colors hover:bg-gray-50 ${
        isActive ? "bg-[#f1f3f4] border-l-2 border-l-[#005163]" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <h3
          className="text-sm font-semibold text-[#091a2b] truncate"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {conversation.subject}
        </h3>
        {conversation.unreadCount > 0 && (
          <span className="ml-2 flex-shrink-0 bg-[#005163] text-white text-[10px] font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5">
            {conversation.unreadCount}
          </span>
        )}
      </div>
      {otherParticipant && (
        <p
          className="text-xs text-gray-500 truncate"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          {otherParticipant.name}
        </p>
      )}
      {conversation.lastMessage && (
        <p
          className="text-xs text-gray-400 truncate mt-0.5"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          {conversation.lastMessage.content}
        </p>
      )}
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

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleSend = async (content: string) => {
    if (!activeConversationId) return;
    try {
      await send(activeConversationId, content);
    } catch {
      // Error handled by Redux
    }
  };

  const currentUserId = user?.id || "";

  return (
    <div className="min-h-screen bg-[#f1f3f4]">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <h1
          className="text-2xl font-bold text-[#091a2b] mb-6"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Messages
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 flex items-center justify-between">
            <p
              className="text-sm text-red-700"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex h-[calc(100vh-200px)] min-h-[500px]">
          {/* Conversation sidebar */}
          <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2
                className="text-sm font-semibold text-[#091a2b]"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Conversations
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoadingConversations ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#091a2b] border-t-transparent" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-6 text-center">
                  <p
                    className="text-sm text-gray-500"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
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
                  />
                ))
              )}
            </div>
          </div>

          {/* Message area */}
          <div className="flex-1 flex flex-col">
            {activeConversation ? (
              <>
                {/* Header */}
                <div className="px-6 py-3 border-b border-gray-200 bg-white">
                  <h2
                    className="text-sm font-semibold text-[#091a2b]"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {activeConversation.subject}
                  </h2>
                  <p
                    className="text-xs text-gray-500"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    {activeConversation.participants
                      .map((p) => p.name)
                      .join(", ")}
                  </p>
                </div>

                <MessageList
                  messages={messages}
                  currentUserId={currentUserId}
                  isLoading={isLoadingMessages}
                />

                <MessageInput onSend={handleSend} isSending={isSending} />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#f1f3f4] flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-[#3b4876]"
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
                    className="text-gray-500 text-sm"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
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
