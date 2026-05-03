/*
Design philosophy reminder: Swiss International Style adapted for aerospace technical review rooms. The layout keeps the application in high-contrast light mode with committee-ready typography and no dark-mode overrides.
*/
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mothdrone HPM Payload Visualizer",
  description:
    "Horizontal Z-axis naked engineering stack visualizer for a Mothdrone high-power microwave payload.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
