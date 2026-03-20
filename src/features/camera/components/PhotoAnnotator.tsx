import {
  Type,
  ArrowRight,
  Circle,
  Square,
  RotateCcw,
  RotateCw,
  Check,
  Droplet,
  Minus,
  Plus,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import type { CapturedPhoto, PhotoAnnotation } from "../types";

interface PhotoAnnotatorProps {
  photo: CapturedPhoto;
  onSave: (photo: CapturedPhoto) => void;
  onCancel?: () => void;
}

type AnnotationTool = "TEXT" | "ARROW" | "CIRCLE" | "RECTANGLE";

const COLORS = [
  "#FF0000",
  "#00FF00",
  "#0066FF",
  "#FFAA00",
  "#FF00FF",
  "#FFFFFF",
  "#000000",
];

export const PhotoAnnotator: React.FC<PhotoAnnotatorProps> = ({
  photo,
  onSave,
  onCancel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [annotations, setAnnotations] = useState<PhotoAnnotation[]>(
    photo.annotations,
  );
  const [activeTool, setActiveTool] = useState<AnnotationTool>("TEXT");
  const [activeColor, setActiveColor] = useState("#FF0000");
  const [activeSize, setActiveSize] = useState(24);
  const [textInput, setTextInput] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInputPos, setTextInputPos] = useState({ x: 0, y: 0 });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [history, setHistory] = useState<PhotoAnnotation[][]>([
    photo.annotations,
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      renderCanvas();
    };
    img.src = photo.dataUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo.dataUrl]);

  // Re-render when annotations change
  useEffect(() => {
    renderCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annotations]);

  const pushHistory = useCallback(
    (newAnnotations: PhotoAnnotation[]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newAnnotations);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setAnnotations(newAnnotations);
    },
    [history, historyIndex],
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setAnnotations(history[newIndex]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setAnnotations(history[newIndex]);
    }
  }, [history, historyIndex]);

  const getNormalizedPos = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      return {
        x: (clientX - rect.left) / rect.width,
        y: (clientY - rect.top) / rect.height,
      };
    },
    [],
  );

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const pos = getNormalizedPos(e);

      if (activeTool === "TEXT") {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        setTextInputPos({ x: clientX - rect.left, y: clientY - rect.top });
        setShowTextInput(true);
        setTextInput("");
        // Store normalized position for the annotation
        setDragStart(pos);
        return;
      }

      setIsDragging(true);
      setDragStart(pos);
    },
    [activeTool, getNormalizedPos],
  );

  const handleCanvasMouseUp = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging || !dragStart) return;
      e.preventDefault();

      const endPos = getNormalizedPos(e);
      const id = crypto.randomUUID();

      let newAnnotation: PhotoAnnotation | null = null;

      if (activeTool === "ARROW") {
        newAnnotation = {
          id,
          type: "ARROW",
          position: dragStart,
          color: activeColor,
          points: [dragStart, endPos],
        };
      } else if (activeTool === "CIRCLE") {
        const dx = endPos.x - dragStart.x;
        const dy = endPos.y - dragStart.y;
        const radius = Math.sqrt(dx * dx + dy * dy);
        newAnnotation = {
          id,
          type: "CIRCLE",
          position: {
            x: (dragStart.x + endPos.x) / 2,
            y: (dragStart.y + endPos.y) / 2,
          },
          color: activeColor,
          size: radius,
        };
      } else if (activeTool === "RECTANGLE") {
        newAnnotation = {
          id,
          type: "RECTANGLE",
          position: dragStart,
          color: activeColor,
          size: Math.max(
            Math.abs(endPos.x - dragStart.x),
            Math.abs(endPos.y - dragStart.y),
          ),
          points: [dragStart, endPos],
        };
      }

      if (newAnnotation) {
        pushHistory([...annotations, newAnnotation]);
      }

      setIsDragging(false);
      setDragStart(null);
    },
    [
      isDragging,
      dragStart,
      activeTool,
      activeColor,
      annotations,
      getNormalizedPos,
      pushHistory,
    ],
  );

  const handleTextSubmit = useCallback(() => {
    if (!textInput.trim() || !dragStart) return;

    const newAnnotation: PhotoAnnotation = {
      id: crypto.randomUUID(),
      type: "TEXT",
      position: dragStart,
      content: textInput,
      color: activeColor,
      size: activeSize,
    };

    pushHistory([...annotations, newAnnotation]);
    setShowTextInput(false);
    setTextInput("");
    setDragStart(null);
  }, [textInput, dragStart, activeColor, activeSize, annotations, pushHistory]);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    for (const ann of annotations) {
      ctx.strokeStyle = ann.color;
      ctx.fillStyle = ann.color;
      ctx.lineWidth = 3;

      const x = ann.position.x * canvas.width;
      const y = ann.position.y * canvas.height;

      switch (ann.type) {
        case "TEXT": {
          const fontSize = (ann.size || 24) * (canvas.width / 800);
          ctx.font = `bold ${fontSize}px "Inter", sans-serif`;
          ctx.fillStyle = ann.color;
          // Text shadow for readability
          ctx.shadowColor = "rgba(0,0,0,0.7)";
          ctx.shadowBlur = 4;
          ctx.fillText(ann.content || "", x, y);
          ctx.shadowBlur = 0;
          break;
        }
        case "ARROW": {
          if (ann.points && ann.points.length === 2) {
            const sx = ann.points[0].x * canvas.width;
            const sy = ann.points[0].y * canvas.height;
            const ex = ann.points[1].x * canvas.width;
            const ey = ann.points[1].y * canvas.height;

            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(ex, ey);
            ctx.stroke();

            // Arrowhead
            const angle = Math.atan2(ey - sy, ex - sx);
            const headLen = 20;
            ctx.beginPath();
            ctx.moveTo(ex, ey);
            ctx.lineTo(
              ex - headLen * Math.cos(angle - Math.PI / 6),
              ey - headLen * Math.sin(angle - Math.PI / 6),
            );
            ctx.moveTo(ex, ey);
            ctx.lineTo(
              ex - headLen * Math.cos(angle + Math.PI / 6),
              ey - headLen * Math.sin(angle + Math.PI / 6),
            );
            ctx.stroke();
          }
          break;
        }
        case "CIRCLE": {
          const radius = (ann.size || 0.05) * canvas.width;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }
        case "RECTANGLE": {
          if (ann.points && ann.points.length === 2) {
            const rx = ann.points[0].x * canvas.width;
            const ry = ann.points[0].y * canvas.height;
            const rw = (ann.points[1].x - ann.points[0].x) * canvas.width;
            const rh = (ann.points[1].y - ann.points[0].y) * canvas.height;
            ctx.strokeRect(rx, ry, rw, rh);
          }
          break;
        }
      }
    }
  }, [annotations]);

  const handleSave = useCallback(() => {
    onSave({
      ...photo,
      annotations,
    });
  }, [photo, annotations, onSave]);

  const tools: {
    type: AnnotationTool;
    icon: React.ReactNode;
    label: string;
  }[] = [
    { type: "TEXT", icon: <Type className="w-5 h-5" />, label: "Text" },
    { type: "ARROW", icon: <ArrowRight className="w-5 h-5" />, label: "Arrow" },
    { type: "CIRCLE", icon: <Circle className="w-5 h-5" />, label: "Circle" },
    {
      type: "RECTANGLE",
      icon: <Square className="w-5 h-5" />,
      label: "Rectangle",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div
        className="flex items-center gap-2 p-3 border-b border-gray-700 overflow-x-auto"
        style={{ backgroundColor: "#1A1A2E" }}
      >
        {/* Drawing tools */}
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => setActiveTool(tool.type)}
            className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
              activeTool === tool.type
                ? "bg-white/20 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
            aria-label={tool.label}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}

        <div className="w-px h-6 bg-gray-600 mx-1 flex-shrink-0" />

        {/* Size controls */}
        <button
          onClick={() => setActiveSize(Math.max(12, activeSize - 4))}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 flex-shrink-0"
          aria-label="Decrease size"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-gray-300 text-xs w-6 text-center flex-shrink-0">
          {activeSize}
        </span>
        <button
          onClick={() => setActiveSize(Math.min(72, activeSize + 4))}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 flex-shrink-0"
          aria-label="Increase size"
        >
          <Plus className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1 flex-shrink-0" />

        {/* Color picker */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
            aria-label="Pick color"
          >
            <Droplet className="w-5 h-5" />
            <div
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-600"
              style={{ backgroundColor: activeColor }}
            />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-2 p-2 bg-gray-800 rounded-lg shadow-xl z-30 flex gap-1">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setActiveColor(color);
                    setShowColorPicker(false);
                  }}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                    activeColor === color
                      ? "border-white scale-110"
                      : "border-gray-600"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-600 mx-1 flex-shrink-0" />

        {/* Undo/Redo */}
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          aria-label="Undo"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          aria-label="Redo"
        >
          <RotateCw className="w-5 h-5" />
        </button>

        <div className="flex-1" />

        {/* Save / Cancel */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg text-gray-300 hover:bg-white/10 text-sm flex-shrink-0"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          className="px-4 py-1.5 rounded-lg text-white text-sm font-medium flex items-center gap-1.5 flex-shrink-0"
          style={{
            backgroundColor: "#008080",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <Check className="w-4 h-4" />
          Save
        </button>
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        className="relative flex-1 flex items-center justify-center overflow-hidden bg-gray-950 p-2"
      >
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full object-contain cursor-crosshair rounded"
          onMouseDown={handleCanvasMouseDown}
          onMouseUp={handleCanvasMouseUp}
          onTouchStart={handleCanvasMouseDown}
          onTouchEnd={handleCanvasMouseUp}
        />

        {/* Text input popup */}
        {showTextInput && (
          <div
            className="absolute z-20 flex items-center gap-1 bg-gray-800 rounded-lg shadow-xl p-1"
            style={{ left: textInputPos.x, top: textInputPos.y }}
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
              placeholder="Enter text..."
              autoFocus
              className="bg-gray-700 text-white text-sm px-2 py-1 rounded outline-none w-40"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
            <button
              onClick={handleTextSubmit}
              className="p-1 rounded bg-green-600 text-white hover:bg-green-700"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setShowTextInput(false);
                setDragStart(null);
              }}
              className="p-1 rounded bg-gray-600 text-white hover:bg-gray-500"
            >
              <Type className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
