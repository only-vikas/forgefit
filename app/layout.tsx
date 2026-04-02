import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
      <body suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-[#080808] text-white selection:bg-[#C8FF00] selection:text-black overflow-x-hidden min-h-screen`}>
        {/* Global Noise Overlay for Texture */}
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
