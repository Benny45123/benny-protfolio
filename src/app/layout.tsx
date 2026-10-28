import type { Metadata, Viewport } from "next";
import { Syne, Space_Grotesk, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Bennyhinn Bezawada — Autonomous AI Systems Architect & Creative Engineer",
  description: "Portfolio of Bennyhinn Bezawada. Engineering deterministic multi-agent LLM systems, high-throughput backend infrastructure, and spatial 3D web experiences.",
  keywords: [
    "Benny Bezawada",
    "Bennyhinn Bezawada",
    "Autonomous AI Architect",
    "Agentic AI",
    "LangGraph",
    "FastAPI",
    "Three.js",
    "Creative Engineering",
    "Interactive Portfolio",
  ],
  authors: [{ name: "Bennyhinn Bezawada" }],
  openGraph: {
    title: "Bennyhinn Bezawada — AI Systems & Autonomous Agent Architect",
    description: "Interactive portfolio featuring real-time 3D head-tracking, multi-agent AI architectures, and distributed backend systems.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${syne.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${plusJakartaSans.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#000000] text-[#f4f4f6] font-sans antialiased selection:bg-amber-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
