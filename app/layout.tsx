import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const suisse = localFont({
  src: [
    { path: "./fonts/SuisseIntl-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/SuisseIntl-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/SuisseIntl-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-suisse",
  display: "block",
});

export const metadata: Metadata = {
  title: "something.spacetime.today",
  description: "something",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={suisse.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
