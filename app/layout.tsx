import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "FrameInGoa — HH Goa 2026 Social Frames & Builder Badges",
  description:
    "Upload your photo to instantly create a branded HH Goa 2026 profile picture frame or official Builder ID pass. Download in high-res PNG & share on X with #FrameInGoa.",
  keywords: [
    "HH Goa 2026",
    "Hacker House Goa",
    "FrameInGoa",
    "Goa Hackathon",
    "Profile Picture Frame Generator",
    "Builder ID Card",
    "Web3 Goa",
    "AI Goa",
  ],
  openGraph: {
    title: "FrameInGoa — HH Goa 2026 Social Frames & Builder Badges",
    description:
      "Instant branded Profile Picture Frames & Builder Pass Badges for HH Goa 2026. Zero signup required.",
    url: "https://frameingoa.app",
    siteName: "FrameInGoa",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FrameInGoa — HH Goa 2026 Social Frames & Builder Badges",
    description:
      "Instant branded Profile Picture Frames & Builder Pass Badges for HH Goa 2026. Zero signup required.",
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
      <body className={`${inter.variable} ${outfit.variable} antialiased bg-[#07090e] text-slate-100 min-h-screen flex flex-col justify-between selection:bg-[#00F2FE] selection:text-slate-950`}>
        {/* Background ambient glowing spheres */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#FF3B00] rounded-full blur-[160px] opacity-25 animate-orb-1" />
          <div className="absolute top-1/2 -right-32 w-[600px] h-[600px] bg-[#00F2FE] rounded-full blur-[170px] opacity-20 animate-orb-2" />
          <div className="absolute -bottom-32 left-1/3 w-[550px] h-[550px] bg-[#7928CA] rounded-full blur-[180px] opacity-15" />
        </div>

        <Navbar />
        
        <main className="relative z-10 flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
