"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Tldraw, getSnapshot, loadSnapshot, TLStoreSnapshot, useEditor, createTLStore, defaultShapeUtils } from "tldraw";
import "tldraw/tldraw.css";
import "./tldraw-overrides.css";
import { ShadcnToolbar, ShadcnMainMenu } from "./tldraw-ui";

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

function SaveManager() {
  const editor = useEditor();
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSave = useCallback(() => {
    try {
      const snapshot = getSnapshot(editor.store);
      fetch("/api/drawing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        keepalive: true,
        body: JSON.stringify({ snapshot }),
      }).catch(() => {});
    } catch {}
  }, [editor]);

  useEffect(() => {
    const unsub = editor.store.listen(
      () => {
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(doSave, 1000);
      },
      { scope: "document", source: "user" }
    );

    window.addEventListener("beforeunload", doSave);

    return () => {
      unsub();
      window.removeEventListener("beforeunload", doSave);
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [editor, doSave]);

  return null;
}

export default function Canvas({ initialSnapshot }: CanvasProps) {
  const [store] = useState(() => {
    const s = createTLStore({ shapeUtils: defaultShapeUtils });
    if (initialSnapshot) {
      loadSnapshot(s, initialSnapshot);
    }
    return s;
  });

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw
        store={store}
        inferDarkMode
        components={COMPONENTS}
      >
        <SaveManager />
        <ShadcnMainMenu />
        <ShadcnToolbar />
      </Tldraw>
    </div>
  );
}
