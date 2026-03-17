import { Mic, Square, Play, Pause } from "lucide-react";
import React, { useState, useRef, useCallback } from "react";

interface VoiceNoteProps {
  onRecordingComplete: (blob: Blob, duration: number) => void;
  playbackUrl?: string;
  playbackDuration?: number;
}

const VoiceNote: React.FC<VoiceNoteProps> = ({
  onRecordingComplete,
  playbackUrl,
  playbackDuration,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((t) => t.stop());
        onRecordingComplete(blob, recordingTime);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch {
      // Microphone permission denied or unavailable
    }
  }, [onRecordingComplete, recordingTime]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const togglePlayback = useCallback(() => {
    if (!playbackUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(playbackUrl);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setPlaybackTime(0);
      };
      audioRef.current.ontimeupdate = () => {
        setPlaybackTime(Math.floor(audioRef.current!.currentTime));
      };
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [playbackUrl, isPlaying]);

  // Playback mode
  if (playbackUrl) {
    const duration = playbackDuration ?? 0;
    const progress = duration > 0 ? (playbackTime / duration) * 100 : 0;

    return (
      <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
        <button
          onClick={togglePlayback}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: "#3b4876" }}
          aria-label={isPlaying ? "Pause voice note" : "Play voice note"}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <div className="flex-1">
          <div className="h-1 overflow-hidden rounded-full bg-gray-300">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: "#3b4876" }}
            />
          </div>
        </div>
        <span
          className="text-xs text-gray-600"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          {formatTime(isPlaying ? playbackTime : duration)}
        </span>
      </div>
    );
  }

  // Recording mode
  return (
    <div className="flex items-center gap-2">
      {isRecording ? (
        <>
          <button
            onClick={stopRecording}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
            aria-label="Stop recording"
          >
            <Square size={16} />
          </button>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            <span
              className="text-sm text-gray-700"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              {formatTime(recordingTime)}
            </span>
          </div>
        </>
      ) : (
        <button
          onClick={startRecording}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#091a2b" }}
          aria-label="Start recording"
        >
          <Mic size={18} />
        </button>
      )}
    </div>
  );
};

export default VoiceNote;
