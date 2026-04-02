import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import Sidebar from "@/components/ui/Sidebar";
import Navbar from "@/components/ui/Navbar";
import { PageTransition } from "@/components/ui/PageTransition";
import LenisProvider from "@/components/providers/LenisProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "ForgeFit | Cinematic 3D Fitness OS",
  description: "Ultra-premium, immersive, and high-performance fitness operating system for elite athletes.",
  keywords: ["Fitness", "workout logger", "athlete OS", "3D web", "ForgeFit"],
  openGraph: {
    type: "website",
    url: "https://forgefit.app",
    title: "ForgeFit | Cinematic 3D Fitness OS",
    description: "Ultra-premium, immersive, and high-performance fitness operating system for elite athletes.",
    siteName: "ForgeFit",
  },
  twitter: {
    card: "summary_large_image",
    title: "ForgeFit | Cinematic 3D Fitness OS",
    description: "Ultra-premium, immersive, and high-performance fitness operating system.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-[#080808] text-white selection:bg-[#C8FF00] selection:text-black overflow-x-hidden min-h-screen flex`}>
        {/* Global Noise */}
        <div className="noise-overlay" />
        <CustomCursor />

        {/* Sidebar Container (Hidden on Mobile) */}
        <div className="hidden md:flex w-64 shrink-0 fixed h-full z-[100] bg-black/40 border-r border-white/5 backdrop-blur-3xl">
           <Sidebar />
        </div>

        {/* Main Application Area */}
        <div className="flex-1 flex flex-col md:ml-64 min-h-screen relative max-w-full">
           {/* Top Navigation */}
           <div className="sticky top-0 z-[90] w-full bg-transparent">
             <Navbar />
           </div>
           
           {/* Page Content with GSAP/Framer Motion Layout Interactivity */}
           <main className="flex-1 relative z-10 w-full overflow-hidden flex flex-col">
             <LenisProvider>
               <PageTransition>
                 {children}
               </PageTransition>
             </LenisProvider>
           </main>
        </div>
      </body>
    </html>
  );
}
