"use client";

import { useEffect, useRef, useState } from "react";
import { Tldraw, createTLStore, defaultShapeUtils, loadSnapshot, getSnapshot } from "tldraw";
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
  const [store] = useState(() => createTLStore({ shapeUtils: defaultShapeUtils }));
  const [ready, setReady] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/drawing")
      .then((r) => r.json())
      .then((data) => {
        if (data.snapshot) {
          try {
            loadSnapshot(store, data.snapshot);
          } catch {
          }
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, [store]);

  useEffect(() => {
    if (!ready) return;
    const unsub = store.listen(
      () => {
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => {
          fetch("/api/drawing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ snapshot: getSnapshot(store) }),
          });
        }, 1500);
      },
      { scope: "document", source: "user" }
    );
    return () => {
      unsub();
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [store, ready]);

  if (!ready) {
    return <div className="fixed inset-0 bg-background" />;
  }

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw
        store={store}
        inferDarkMode
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
