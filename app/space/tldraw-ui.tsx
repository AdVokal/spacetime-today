"use client";

import {
  track,
  useEditor,
  useTools,
  useActions,
  TLUiToolItem,
  TLUiActionItem,
} from "tldraw";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TOOLS = [
  { id: "select", label: "select", icon: "cursor" },
  { id: "hand", label: "hand", icon: "hand" },
  { id: "draw", label: "draw", icon: "pencil" },
  { id: "eraser", label: "eraser", icon: "eraser" },
  { id: "arrow", label: "arrow", icon: "arrow" },
  { id: "text", label: "text", icon: "text" },
  { id: "geo", label: "shape", icon: "square" },
  { id: "note", label: "note", icon: "note" },
  { id: "frame", label: "frame", icon: "frame" },
];

const ToolIcon = ({ id }: { id: string }) => {
  const icons: Record<string, React.ReactNode> = {
    cursor: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 3l14 9-7 1-4 7z"/>
      </svg>
    ),
    hand: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 11V8a2 2 0 0 0-2-2 2 2 0 0 0-2 2M14 10V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2M10 10.5V5a2 2 0 0 0-2-2 2 2 0 0 0-2 2v9l4 4h4a4 4 0 0 0 4-4v-3a2 2 0 0 0-2-2 2 2 0 0 0-2 2z"/>
      </svg>
    ),
    pencil: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
      </svg>
    ),
    eraser: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/>
        <path d="M22 21H7"/>
      </svg>
    ),
    arrow: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    ),
    text: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>
      </svg>
    ),
    square: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
      </svg>
    ),
    note: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>
      </svg>
    ),
    frame: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="22" y1="6" x2="2" y2="6"/><line x1="22" y1="18" x2="2" y2="18"/><line x1="6" y1="2" x2="6" y2="22"/><line x1="18" y1="2" x2="18" y2="22"/>
      </svg>
    ),
  };
  return <span className="flex items-center justify-center">{icons[id] ?? <span className="w-3.5 h-3.5 rounded-full border border-current" />}</span>;
};

export const ShadcnToolbar = track(() => {
  const editor = useEditor();
  const tools = useTools();
  const currentTool = editor.getCurrentToolId();

  return (
    <TooltipProvider delayDuration={400}>
      <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50">
        <div className="flex items-center gap-0.5 bg-card border border-border rounded-xl px-2 py-1.5 shadow-sm">
          {TOOLS.map((tool, i) => {
            const tldrawTool = tools[tool.id] as TLUiToolItem | undefined;
            if (!tldrawTool) return null;
            const isActive = currentTool === tool.id;
            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => tldrawTool.onSelect("toolbar")}
                  >
                    <ToolIcon id={tool.icon} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {tool.label}
                </TooltipContent>
              </Tooltip>
            );
          })}

          <Separator orientation="vertical" className="h-5 mx-1" />

          <UndoRedoButtons />
        </div>
      </div>
    </TooltipProvider>
  );
});

const UndoRedoButtons = track(() => {
  const editor = useEditor();
  const actions = useActions();

  return (
    <TooltipProvider delayDuration={400}>
      <div className="flex items-center gap-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              disabled={!editor.getCanUndo()}
              onClick={() => editor.undo()}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">undo</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              disabled={!editor.getCanRedo()}
              onClick={() => editor.redo()}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/>
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">redo</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
});

export const ShadcnMainMenu = track(() => {
  const actions = useActions();

  const menuActions: Array<{ key: string; label: string }> = [
    { key: "select-all", label: "select all" },
    { key: "delete", label: "delete" },
    { key: "duplicate", label: "duplicate" },
    { key: "group", label: "group" },
    { key: "ungroup", label: "ungroup" },
    { key: "flip-horizontal", label: "flip horizontal" },
    { key: "flip-vertical", label: "flip vertical" },
    { key: "zoom-in", label: "zoom in" },
    { key: "zoom-out", label: "zoom out" },
    { key: "zoom-to-fit", label: "zoom to fit" },
    { key: "zoom-to-selection", label: "zoom to selection" },
  ];

  return (
    <div className="fixed top-4 left-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs font-medium rounded-lg border-border"
          >
            something
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          {menuActions.slice(0, 5).map((action) => {
            const a = actions[action.key] as TLUiActionItem | undefined;
            if (!a) return null;
            return (
              <DropdownMenuItem
                key={action.key}
                className="text-xs"
                onClick={() => a.onSelect("menu")}
              >
                {action.label}
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          {menuActions.slice(5).map((action) => {
            const a = actions[action.key] as TLUiActionItem | undefined;
            if (!a) return null;
            return (
              <DropdownMenuItem
                key={action.key}
                className="text-xs"
                onClick={() => a.onSelect("menu")}
              >
                {action.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});
