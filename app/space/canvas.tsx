"use client";

import { useRef } from "react";
import { Tldraw, Editor, loadSnapshot, getSnapshot } from "tldraw";
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

export default function Canvas({ user }: CanvasProps) {
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleMount(editor: Editor) {
    fetch("/api/drawing")
      .then((r) => r.json())
      .then((data) => {
        if (data.snapshot) {
          loadSnapshot(editor.store, data.snapshot);
        }
      })
      .catch(() => {});

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
  }

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw
        inferDarkMode
        onMount={handleMount}
        components={{
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
        }}
      >
        <ShadcnMainMenu />
        <ShadcnToolbar />
      </Tldraw>
    </div>
  );
}
