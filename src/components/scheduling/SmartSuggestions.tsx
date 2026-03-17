// FILE PATH: src/components/scheduling/SmartSuggestions.tsx
// Smart Scheduling & Booking System - AI-Powered Scheduling Suggestions

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Clock,
  TrendingUp,
  Calendar,
  ChevronRight,
  Loader,
  RefreshCw,
  Zap,
  ThumbsUp,
} from "lucide-react";
import type { SmartSuggestion, BookingType } from "../../types/scheduling";

// ─── Mock AI Suggestions ─────────────────────────────────────────────────────

function generateMockSuggestions(): SmartSuggestion[] {
  const now = new Date();
  const suggestions: SmartSuggestion[] = [];

  const reasons = [
    "Peak viewing hours — 73% of successful tenant matches happen between 10am-2pm",
    "Property is typically vacant at this time — no scheduling conflicts",
    "Based on attendee calendar analysis — all parties available",
    "Historical data shows 89% confirmation rate for Tuesday inspections",
    "Optimal maintenance window — minimal tenant disruption",
    "AI-detected pattern: Similar properties book fastest on weekday mornings",
    "Weather forecast favorable — ideal for outdoor property viewings",
    "Low traffic period — tenants report better experience during this window",
  ];

  const types: BookingType[] = ["viewing", "inspection", "maintenance", "meeting"];

  for (let i = 0; i < 5; i++) {
    const dayOffset = Math.floor(Math.random() * 7) + 1;
    const hour = 9 + Math.floor(Math.random() * 8);
    const start = new Date(now);
    start.setDate(start.getDate() + dayOffset);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(hour + 1);

    suggestions.push({
      id: `sug-${i}`,
      startTime: start,
      endTime: end,
      score: 75 + Math.floor(Math.random() * 25),
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      type: types[Math.floor(Math.random() * types.length)],
      propertyId: `prop-${Math.floor(Math.random() * 5) + 1}`,
    });
  }

  return suggestions.sort((a, b) => b.score - a.score);
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface SmartSuggestionsProps {
  onAcceptSuggestion?: (suggestion: SmartSuggestion) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  onAcceptSuggestion,
}) => {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptedId, setAcceptedId] = useState<string | null>(null);

  const loadSuggestions = () => {
    setLoading(true);
    // Simulate AI processing delay
    setTimeout(() => {
      setSuggestions(generateMockSuggestions());
      setLoading(false);
    }, 1200);
  };

  useEffect(() => {
    loadSuggestions();
  }, []);

  const handleAccept = (suggestion: SmartSuggestion) => {
    setAcceptedId(suggestion.id);
    onAcceptSuggestion?.(suggestion);
    setTimeout(() => setAcceptedId(null), 2000);
  };

  // ─── Score Badge ─────────────────────────────────────────────────────────

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-700 border-green-200";
    if (score >= 80) return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#3b4876]/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#3b4876]" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#091a2b] font-['Montserrat']">
              Smart Suggestions
            </h3>
            <p className="text-[10px] text-gray-500 font-['Open_Sans']">
              AI-powered optimal scheduling times
            </p>
          </div>
        </div>
        <button
          onClick={loadSuggestions}
          disabled={loading}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#3b4876] hover:text-[#091a2b] disabled:opacity-40 transition-colors font-['Open_Sans']"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader className="w-8 h-8 text-[#3b4876] animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500 font-['Open_Sans']">
              Analyzing schedules and availability...
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((s, index) => {
            const start = new Date(s.startTime);
            const end = new Date(s.endTime);
            const isAccepted = acceptedId === s.id;

            return (
              <div
                key={s.id}
                className={`relative rounded-xl border p-4 transition-all ${
                  index === 0
                    ? "border-[#3b4876]/30 bg-[#3b4876]/5 shadow-sm"
                    : "border-gray-200 bg-white hover:border-[#3b4876]/20"
                }`}
              >
                {index === 0 && (
                  <span className="absolute -top-2.5 left-3 inline-flex items-center gap-1 px-2 py-0.5 bg-[#3b4876] text-white text-[10px] font-bold rounded-full font-['Open_Sans']">
                    <Zap className="w-3 h-3" /> Top Pick
                  </span>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full border ${getScoreColor(s.score)} font-['Open_Sans']`}>
                        <TrendingUp className="w-3 h-3" />
                        {s.score}% match
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold font-['Open_Sans']">
                        {s.type.charAt(0).toUpperCase() + s.type.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-[#091a2b] font-semibold font-['Open_Sans'] mb-1">
                      <Calendar className="w-3.5 h-3.5 text-[#3b4876]" aria-hidden="true" />
                      {start.toLocaleDateString("en-US", {
                        weekday: "short", month: "short", day: "numeric",
                      })}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-['Open_Sans'] mb-2">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      {" – "}
                      {end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </div>

                    <p className="text-xs text-gray-600 font-['Open_Sans'] leading-relaxed">
                      {s.reason}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAccept(s)}
                    className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all font-['Open_Sans'] ${
                      isAccepted
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-[#3b4876] text-white hover:bg-[#091a2b]"
                    }`}
                  >
                    {isAccepted ? (
                      <>
                        <ThumbsUp className="w-3.5 h-3.5" /> Accepted
                      </>
                    ) : (
                      <>
                        Book <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SmartSuggestions;
