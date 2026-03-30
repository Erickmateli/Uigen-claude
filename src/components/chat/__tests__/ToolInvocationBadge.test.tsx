import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

function makeCall(toolName: string, args: object) {
  return { state: "call" as const, toolCallId: "id", toolName, args };
}

function makeResult(toolName: string, args: object) {
  return { state: "result" as const, toolCallId: "id", toolName, args, result: "ok" };
}

// str_replace_editor — pending

test("shows 'Creating' label for str_replace_editor create (pending)", () => {
  render(<ToolInvocationBadge toolInvocation={makeCall("str_replace_editor", { command: "create", path: "src/App.jsx" })} />);
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("shows 'Editing' label for str_replace_editor str_replace (pending)", () => {
  render(<ToolInvocationBadge toolInvocation={makeCall("str_replace_editor", { command: "str_replace", path: "src/App.jsx" })} />);
  expect(screen.getByText("Editing App.jsx")).toBeDefined();
});

test("shows 'Editing' label for str_replace_editor insert (pending)", () => {
  render(<ToolInvocationBadge toolInvocation={makeCall("str_replace_editor", { command: "insert", path: "src/App.jsx" })} />);
  expect(screen.getByText("Editing App.jsx")).toBeDefined();
});

test("shows 'Reading' label for str_replace_editor view (pending)", () => {
  render(<ToolInvocationBadge toolInvocation={makeCall("str_replace_editor", { command: "view", path: "src/App.jsx" })} />);
  expect(screen.getByText("Reading App.jsx")).toBeDefined();
});

test("shows 'Reverting' label for str_replace_editor undo_edit (pending)", () => {
  render(<ToolInvocationBadge toolInvocation={makeCall("str_replace_editor", { command: "undo_edit", path: "src/App.jsx" })} />);
  expect(screen.getByText("Reverting App.jsx")).toBeDefined();
});

// str_replace_editor — done

test("shows 'Created' label for str_replace_editor create (done)", () => {
  render(<ToolInvocationBadge toolInvocation={makeResult("str_replace_editor", { command: "create", path: "src/App.jsx" })} />);
  expect(screen.getByText("Created App.jsx")).toBeDefined();
});

test("shows 'Edited' label for str_replace_editor str_replace (done)", () => {
  render(<ToolInvocationBadge toolInvocation={makeResult("str_replace_editor", { command: "str_replace", path: "src/App.jsx" })} />);
  expect(screen.getByText("Edited App.jsx")).toBeDefined();
});

test("shows 'Edited' label for str_replace_editor insert (done)", () => {
  render(<ToolInvocationBadge toolInvocation={makeResult("str_replace_editor", { command: "insert", path: "src/App.jsx" })} />);
  expect(screen.getByText("Edited App.jsx")).toBeDefined();
});

test("shows 'Read' label for str_replace_editor view (done)", () => {
  render(<ToolInvocationBadge toolInvocation={makeResult("str_replace_editor", { command: "view", path: "src/App.jsx" })} />);
  expect(screen.getByText("Read App.jsx")).toBeDefined();
});

test("shows 'Reverted' label for str_replace_editor undo_edit (done)", () => {
  render(<ToolInvocationBadge toolInvocation={makeResult("str_replace_editor", { command: "undo_edit", path: "src/App.jsx" })} />);
  expect(screen.getByText("Reverted App.jsx")).toBeDefined();
});

// file_manager — pending

test("shows 'Renaming' label for file_manager rename (pending)", () => {
  render(<ToolInvocationBadge toolInvocation={makeCall("file_manager", { command: "rename", path: "a/b.ts", new_path: "a/c.ts" })} />);
  expect(screen.getByText("Renaming b.ts")).toBeDefined();
});

test("shows 'Deleting' label for file_manager delete (pending)", () => {
  render(<ToolInvocationBadge toolInvocation={makeCall("file_manager", { command: "delete", path: "a/b.ts" })} />);
  expect(screen.getByText("Deleting b.ts")).toBeDefined();
});

// file_manager — done

test("shows 'Renamed → ' label for file_manager rename (done)", () => {
  render(<ToolInvocationBadge toolInvocation={makeResult("file_manager", { command: "rename", path: "a/b.ts", new_path: "a/c.ts" })} />);
  expect(screen.getByText("Renamed b.ts → c.ts")).toBeDefined();
});

test("shows 'Deleted' label for file_manager delete (done)", () => {
  render(<ToolInvocationBadge toolInvocation={makeResult("file_manager", { command: "delete", path: "a/b.ts" })} />);
  expect(screen.getByText("Deleted b.ts")).toBeDefined();
});

// Fallback

test("falls back to tool name for unknown tool", () => {
  render(<ToolInvocationBadge toolInvocation={makeCall("web_search", {})} />);
  expect(screen.getByText("web_search")).toBeDefined();
});

// Basename extraction

test("extracts filename from deep path", () => {
  render(<ToolInvocationBadge toolInvocation={makeCall("str_replace_editor", { command: "create", path: "a/b/c/d/e.tsx" })} />);
  expect(screen.getByText("Creating e.tsx")).toBeDefined();
});

// Visual indicator state

test("shows spinner when pending", () => {
  const { container } = render(
    <ToolInvocationBadge toolInvocation={makeCall("str_replace_editor", { command: "create", path: "src/App.jsx" })} />
  );
  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("shows green dot when done", () => {
  const { container } = render(
    <ToolInvocationBadge toolInvocation={makeResult("str_replace_editor", { command: "create", path: "src/App.jsx" })} />
  );
  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});
