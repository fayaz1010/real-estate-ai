import { Search, MessageCircle } from "lucide-react";
import React, { useState, useEffect } from "react";

import { fetchConversations } from "../../services/mobileMessagingService";
import type { Conversation } from "../../types/mobileMessaging";

import MobileConversation from "./MobileConversation";

const MobileMessageCenter: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState("");
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);

  useEffect(() => {
    fetchConversations().then(setConversations);
  }, []);

  const filtered = conversations.filter((c) => {
    const query = search.toLowerCase();
    return (
      c.participantNames.some((n) => n.toLowerCase().includes(query)) ||
      c.lastMessage.content.toLowerCase().includes(query)
    );
  });

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday)
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  if (activeConversation) {
    const otherName =
      activeConversation.participantNames.find((n) => n !== "You") ?? "";
    const otherAvatar = activeConversation.participantAvatars[1];
    return (
      <MobileConversation
        conversationId={activeConversation.id}
        participantName={otherName}
        participantAvatar={otherAvatar}
        onBack={() => setActiveConversation(null)}
      />
    );
  }

  return (
    <div
      className="flex h-full flex-col"
      style={{ backgroundColor: "#f1f3f4" }}
    >
      {/* Header */}
      <div
        className="px-4 pb-3 pt-4 text-white"
        style={{ backgroundColor: "#091a2b" }}
      >
        <h1
          className="mb-3 text-xl font-bold"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Messages
        </h1>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-full bg-white/10 py-2 pl-9 pr-4 text-sm text-white placeholder-white/50 outline-none focus:bg-white/20"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <MessageCircle size={40} />
            <p
              className="mt-2 text-sm"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              {search ? "No conversations found" : "No messages yet"}
            </p>
          </div>
        ) : (
          filtered.map((conv) => {
            const otherName =
              conv.participantNames.find((n) => n !== "You") ?? "";
            const avatar = conv.participantAvatars[1];
            const preview = conv.lastMessage.voiceNoteUrl
              ? "🎤 Voice note"
              : conv.lastMessage.content;

            return (
              <button
                key={conv.id}
                onClick={() => setActiveConversation(conv)}
                className="flex w-full items-center gap-3 border-b border-gray-100 bg-white px-4 py-3 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt={otherName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: "#3b4876" }}
                  >
                    {otherName.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className="font-semibold text-gray-900"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    >
                      {otherName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(conv.lastMessage.timestamp)}
                    </span>
                  </div>
                  <p
                    className="mt-0.5 truncate text-sm text-gray-500"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    {preview}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <span
                    className="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-bold text-white"
                    style={{ backgroundColor: "#3b4876" }}
                  >
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MobileMessageCenter;
