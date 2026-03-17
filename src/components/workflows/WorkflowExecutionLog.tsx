import { CheckCircle, XCircle, Clock } from "lucide-react";
import React from "react";

interface ExecutionLogEntry {
  id: string;
  workflowId: string;
  executedAt: string;
  status: "success" | "failure" | "running";
  duration?: number;
  details?: string;
}

interface WorkflowExecutionLogProps {
  logs: ExecutionLogEntry[];
}

function getStatusIcon(status: ExecutionLogEntry["status"]) {
  switch (status) {
    case "success":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "failure":
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "running":
      return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
  }
}

function getStatusLabel(status: ExecutionLogEntry["status"]) {
  switch (status) {
    case "success":
      return "Success";
    case "failure":
      return "Failed";
    case "running":
      return "Running";
  }
}

export const WorkflowExecutionLog: React.FC<WorkflowExecutionLogProps> = ({
  logs,
}) => {
  if (logs.length === 0) {
    return (
      <div className="text-center py-10">
        <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p
          className="text-sm text-gray-400"
          style={{ fontFamily: "Open Sans, sans-serif" }}
        >
          No execution history yet.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {logs.map((log) => (
        <div key={log.id} className="flex items-center gap-4 py-3 px-1">
          {getStatusIcon(log.status)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-medium text-[#091a2b]"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                {getStatusLabel(log.status)}
              </span>
              {log.duration !== undefined && (
                <span
                  className="text-xs text-gray-400"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  {log.duration}ms
                </span>
              )}
            </div>
            {log.details && (
              <p
                className="text-xs text-gray-500 truncate"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                {log.details}
              </p>
            )}
          </div>
          <span
            className="text-xs text-gray-400 flex-shrink-0"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            {new Date(log.executedAt).toLocaleDateString("en-AU", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      ))}
    </div>
  );
};
