"use client";

import { Loader2 } from "lucide-react";
import type { ToolInvocation } from "ai";

function basename(filePath: string): string {
  return filePath.split("/").pop() ?? filePath;
}

function getLabel(toolInvocation: ToolInvocation, isDone: boolean): string {
  const { toolName } = toolInvocation;
  const args = (toolInvocation as any).args ?? {};
  const file = args.path ? basename(args.path) : "";

  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return isDone ? `Created ${file}` : `Creating ${file}`;
      case "str_replace":
      case "insert":
        return isDone ? `Edited ${file}` : `Editing ${file}`;
      case "view":
        return isDone ? `Read ${file}` : `Reading ${file}`;
      case "undo_edit":
        return isDone ? `Reverted ${file}` : `Reverting ${file}`;
    }
  }

  if (toolName === "file_manager") {
    switch (args.command) {
      case "rename": {
        const newFile = args.new_path ? basename(args.new_path) : "";
        return isDone ? `Renamed ${file} → ${newFile}` : `Renaming ${file}`;
      }
      case "delete":
        return isDone ? `Deleted ${file}` : `Deleting ${file}`;
    }
  }

  return toolName;
}

interface ToolInvocationBadgeProps {
  toolInvocation: ToolInvocation;
}

export function ToolInvocationBadge({ toolInvocation }: ToolInvocationBadgeProps) {
  const isDone =
    toolInvocation.state === "result" && !!(toolInvocation as any).result;
  const label = getLabel(toolInvocation, isDone);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
