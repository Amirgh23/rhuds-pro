import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NEXUS TERMINAL | Cyberpunk Security Interface",
  description: "Advanced cyberpunk security terminal interface. Access restricted systems through immersive HUD experience.",
  keywords: ["cyberpunk", "HUD", "security", "terminal", "sci-fi", "interface"],
  authors: [{ name: "NEXUS Systems" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --font-orbitron: ${orbitron.style.fontFamily};
              --font-rajdhani: ${rajdhani.style.fontFamily};
            }
          `
        }} />
      </head>
      <body
        className={`${orbitron.variable} ${rajdhani.variable} antialiased bg-[#0A1225] text-[#29F2DF] overflow-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
