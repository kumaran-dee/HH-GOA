import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoaBeachBackground from "@/components/GoaBeachBackground";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#04331C",
};

export const metadata: Metadata = {
  title: "FrameInGoa — Hacker House Goa 2026 Social Frames & Builder Badges",
  description:
    "Upload your photo to instantly create an official Hacker House Goa 2026 profile picture frame or Aadhaar-style Builder Pass. Download in high-res PNG & share on X with #FrameInGoa.",
  keywords: [
    "HH Goa 2026",
    "Hacker House Goa",
    "FrameInGoa",
    "Goa Hackathon",
    "Profile Picture Frame Generator",
    "Builder ID Card",
    "Aadhaar Builder Pass",
  ],
  openGraph: {
    title: "FrameInGoa — Hacker House Goa 2026 Social Frames & Builder Badges",
    description:
      "Instant branded Profile Picture Frames & Builder Pass Badges for Hacker House Goa 2026. Zero signup required.",
    url: "https://frameingoa.app",
    siteName: "FrameInGoa",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FrameInGoa — Hacker House Goa 2026 Social Frames & Builder Badges",
    description:
      "Instant branded Profile Picture Frames & Builder Pass Badges for Hacker House Goa 2026. Zero signup required.",
    creator: "@HHGoa2026",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} antialiased bg-[#06381F] text-white min-h-screen flex flex-col justify-between selection:bg-[#FFDE00] selection:text-slate-950`}>
        <ScrollToTop />
        {/* Official Hacker House Goa Beach Background Illustration */}
        <GoaBeachBackground />

        <Navbar />
        
        <main className="relative z-10 flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
