"use client";

import { useEditor, useValue } from "tldraw";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const TOOLS = [
  { id: "select",  label: "select",  icon: "cursor" },
  { id: "hand",    label: "hand",    icon: "hand"   },
  { id: "draw",    label: "draw",    icon: "pencil" },
  { id: "eraser",  label: "eraser",  icon: "eraser" },
  { id: "arrow",   label: "arrow",   icon: "arrow"  },
  { id: "text",    label: "text",    icon: "text"   },
  { id: "geo",     label: "shape",   icon: "square" },
  { id: "note",    label: "note",    icon: "note"   },
  { id: "frame",   label: "frame",   icon: "frame"  },
];

const MENU_ACTIONS: Array<{ key: string; label: string }> = [
  { key: "select-all",       label: "select all"        },
  { key: "delete",           label: "delete"            },
  { key: "duplicate",        label: "duplicate"         },
  { key: "group",            label: "group"             },
  { key: "ungroup",          label: "ungroup"           },
  { key: "flip-horizontal",  label: "flip horizontal"   },
  { key: "flip-vertical",    label: "flip vertical"     },
  { key: "zoom-in",          label: "zoom in"           },
  { key: "zoom-out",         label: "zoom out"          },
  { key: "zoom-to-fit",      label: "zoom to fit"       },
];

const Icon = ({ id }: { id: string }) => {
  const map: Record<string, React.ReactNode> = {
    cursor: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 3l14 9-7 1-4 7z"/></svg>,
    hand:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 11V8a2 2 0 0 0-4 0M14 10V6a2 2 0 0 0-4 0v2M10 10.5V5a2 2 0 0 0-4 0v9l4 4h4a4 4 0 0 0 4-4v-3a2 2 0 0 0-4 0z"/></svg>,
    pencil: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>,
    eraser: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/></svg>,
    arrow:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
    text:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
    square: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>,
    note:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>,
    frame:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="22" y1="6" x2="2" y2="6"/><line x1="22" y1="18" x2="2" y2="18"/><line x1="6" y1="2" x2="6" y2="22"/><line x1="18" y1="2" x2="18" y2="22"/></svg>,
  };
  return <span className="flex items-center justify-center">{map[id] ?? <span className="w-3.5 h-3.5 rounded-full border border-current" />}</span>;
};

export function ShadcnToolbar() {
  const editor = useEditor();
  const currentTool = useValue("currentTool", () => editor.getCurrentToolId(), [editor]);
  const canUndo = useValue("canUndo", () => editor.getCanUndo(), [editor]);
  const canRedo = useValue("canRedo", () => editor.getCanRedo(), [editor]);

  return (
    <TooltipProvider delayDuration={400}>
      <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50 pointer-events-none">
        <div className="flex items-center gap-0.5 bg-card border border-border rounded-xl px-2 py-1.5 shadow-sm pointer-events-auto">
          {TOOLS.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={currentTool === tool.id ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => editor.setCurrentTool(tool.id)}
                >
                  <Icon id={tool.icon} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">{tool.label}</TooltipContent>
            </Tooltip>
          ))}

          <Separator orientation="vertical" className="h-5 mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" disabled={!canUndo} onClick={() => editor.undo()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" disabled={!canRedo} onClick={() => editor.redo()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">redo</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

export function ShadcnMainMenu() {
  const editor = useEditor();
  
  const handleAction = (key: string) => {
    const ids = editor.getSelectedShapeIds();
    switch (key) {
      case "select-all":      editor.selectAll(); break;
      case "delete":          editor.deleteShapes(ids); break;
      case "duplicate":       editor.duplicateShapes(ids); break;
      case "group":           editor.groupShapes(ids); break;
      case "ungroup":         editor.ungroupShapes(ids); break;
      case "flip-horizontal": editor.flipShapes(ids, "horizontal"); break;
      case "flip-vertical":   editor.flipShapes(ids, "vertical"); break;
      case "zoom-in":         editor.zoomIn(); break;
      case "zoom-out":        editor.zoomOut(); break;
      case "zoom-to-fit":     editor.zoomToFit(); break;
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium rounded-lg border-border">
            something
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          {MENU_ACTIONS.slice(0, 5).map(({ key, label }) => (
            <DropdownMenuItem key={key} className="text-xs" onClick={() => handleAction(key)}>
              {label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          {MENU_ACTIONS.slice(5).map(({ key, label }) => (
            <DropdownMenuItem key={key} className="text-xs" onClick={() => handleAction(key)}>
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
