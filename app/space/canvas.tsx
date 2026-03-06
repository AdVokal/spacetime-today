"use client";

import { Tldraw } from "tldraw";
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
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw
        persistenceKey={`something-${user?.email ?? "guest"}`}
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
