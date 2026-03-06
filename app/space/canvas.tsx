"use client";

import { useCallback, useRef, useState } from "react";
import { Tldraw, Editor, getSnapshot, TLStoreSnapshot } from "tldraw";
import "tldraw/tldraw.css";
import "./tldraw-overrides.css";
import { ShadcnToolbar, ShadcnMainMenu } from "./tldraw-ui";
import { saveDrawing } from "@/lib/actions";

interface CanvasProps {
  user: { name?: string | null; email?: string | null; image?: string | null } | undefined;
  initialSnapshot: TLStoreSnapshot | null;
}

const COMPONENTS = {
  Toolbar: null,
  MainMenu: null,
  NavigationPanel: null,
  HelpMenu: null,
  StylePanel: null,
  PageMenu: null,
  ActionsMenu: null,
  DebugMenu: null,
  SharePanel: null,
  TopPanel: null,
  ZoomMenu: null,
  MenuPanel: null,
  HelperButtons: null,
  Minimap: null,
} as const;

export default function Canvas({ initialSnapshot }: CanvasProps) {
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);

  const handleMount = useCallback((ed: Editor) => {
    setEditor(ed);
    ed.store.listen(
      () => {
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => {
          try {
            const snapshot = getSnapshot(ed.store);
            saveDrawing(snapshot).catch(() => {});
          } catch {}
        }, 2000);
      },
      { scope: "document", source: "user" }
    );
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw
        snapshot={initialSnapshot ?? undefined}
        inferDarkMode
        onMount={handleMount}
        components={COMPONENTS}
      />
      {editor && <ShadcnMainMenu editor={editor} />}
      {editor && <ShadcnToolbar editor={editor} />}
    </div>
  );
}
