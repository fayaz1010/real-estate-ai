import React, { useState, useEffect } from "react";

interface TrialCountdownProps {
  trialExpirationDate: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeRemaining(endDate: Date): TimeRemaining {
  const now = new Date();
  const msRemaining = Math.max(0, endDate.getTime() - now.getTime());

  const seconds = Math.floor((msRemaining / 1000) % 60);
  const minutes = Math.floor((msRemaining / (1000 * 60)) % 60);
  const hours = Math.floor((msRemaining / (1000 * 60 * 60)) % 24);
  const days = Math.floor(msRemaining / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds };
}

const TimeUnit: React.FC<{ value: number; label: string }> = ({
  value,
  label,
}) => (
  <div className="flex flex-col items-center">
    <span
      className="text-2xl font-bold tabular-nums"
      style={{ color: "#091a2b", fontFamily: "'Open Sans', sans-serif" }}
    >
      {String(value).padStart(2, "0")}
    </span>
    <span
      className="text-xs text-gray-500 mt-1"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
      {label}
    </span>
  </div>
);

const Separator: React.FC = () => (
  <span
    className="text-xl font-bold self-start mt-0.5"
    style={{ color: "#091a2b" }}
  >
    :
  </span>
);

export const TrialCountdown: React.FC<TrialCountdownProps> = ({
  trialExpirationDate,
}) => {
  const endDate = new Date(trialExpirationDate);
  const [time, setTime] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(endDate),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculateTimeRemaining(endDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [trialExpirationDate]);

  const isExpired =
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0;

  if (isExpired) {
    return (
      <div
        className="text-center py-4"
        style={{ fontFamily: "'Open Sans', sans-serif" }}
      >
        <p className="text-sm font-semibold text-red-600">
          Your free trial has expired
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <TimeUnit value={time.days} label="Days" />
      <Separator />
      <TimeUnit value={time.hours} label="Hours" />
      <Separator />
      <TimeUnit value={time.minutes} label="Min" />
      <Separator />
      <TimeUnit value={time.seconds} label="Sec" />
    </div>
  );
};
