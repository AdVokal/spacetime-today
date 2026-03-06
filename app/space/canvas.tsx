"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Tldraw, Editor, getSnapshot, TLStoreSnapshot, TLComponents } from "tldraw";
import "tldraw/tldraw.css";
import "./tldraw-overrides.css";
import { ShadcnToolbar, ShadcnMainMenu } from "./tldraw-ui";

interface CanvasProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | undefined;
}

const COMPONENTS: TLComponents = {
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
};

export default function Canvas({ user }: CanvasProps) {
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [initialSnapshot, setInitialSnapshot] = useState<TLStoreSnapshot | undefined>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/drawing")
      .then((r) => r.json())
      .then((data) => {
        if (data.snapshot) setInitialSnapshot(data.snapshot);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const handleMount = useCallback((editor: Editor) => {
    editor.store.listen(
      () => {
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => {
          fetch("/api/drawing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ snapshot: getSnapshot(editor.store) }),
          }).catch(() => {});
        }, 1500);
      },
      { scope: "document", source: "user" }
    );
  }, []);

  if (!ready) {
    return <div className="fixed inset-0 bg-background" />;
  }

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw
        snapshot={initialSnapshot}
        inferDarkMode
        onMount={handleMount}
        components={COMPONENTS}
      >
        <ShadcnMainMenu />
        <ShadcnToolbar />
      </Tldraw>
    </div>
  );
}
