// app/layout.tsx
import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import WelcomeSplash from "@/components/WelcomeSplash";

/* ─── Fonts ─── */
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});

/* ─── Metadata ─── */
export const metadata: Metadata = {
  title: "KindSphere — Be Heard. Be Kind. Anonymously.",
  description:
    "A safe, warm, anonymous global response platform. Drop your thoughts into the digital ocean and receive honest perspectives from strangers around the world.",
  keywords: ["anonymous response", "kindness", "global", "safe space"],
  openGraph: {
    title: "KindSphere",
    description: "Anonymous, kind, global response.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <head>
        {/*
          Blocking inline script — runs synchronously before any paint.
          On a first visit (no sessionStorage flag) it adds `ks-splash` to
          <html>, which CSS uses to hide body content until the splash dismisses.
          Returning visitors: flag already set → class never added → no overhead.
        */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              if (!sessionStorage.getItem('ks_welcomed')) {
                document.documentElement.classList.add('ks-splash');
              }
            } catch(e) {}
          })();
        `}} />
      </head>
      <body className="min-h-dvh flex flex-col bg-background text-foreground antialiased">
        <WelcomeSplash />
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}