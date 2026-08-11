import { Metadata } from "next";
import Link from "next/link";
import { getGraphic } from "@/lib/storage";
import { ArrowLeft, Download, Sparkles, Share2 } from "lucide-react";

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { id } = await params;
  const graphic = getGraphic(id);

  const title = graphic?.format === "builder-card"
    ? `${graphic.name || "Builder"}'s HH Goa 2026 Pass 🚀 #FrameInGoa`
    : "HH Goa 2026 Profile Picture Frame 🚀 #FrameInGoa";

  const description = graphic?.title
    ? `Title: ${graphic.title} • ${graphic.role || "Builder"} @ Hacker House Goa 2026`
    : "Create your branded HH Goa 2026 Profile Picture Frame & Builder ID Card instantly!";

  const imageUrl = `/api/share/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: graphic?.format === "builder-card" ? 1200 : 1024,
          height: graphic?.format === "builder-card" ? 630 : 1024,
          alt: title,
        },
      ],
    },
    twitter: {
      card: graphic?.format === "builder-card" ? "summary_large_image" : "summary",
      title,
      description,
      images: [imageUrl],
      creator: "@HHGoa2026",
    },
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  const graphic = getGraphic(id);
  const imageUrl = `/api/share/${id}`;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Background ambient glowing orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF3B00] rounded-full blur-[140px] opacity-20 animate-orb-1" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00F2FE] rounded-full blur-[140px] opacity-20 animate-orb-2" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto w-full space-y-8 py-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs font-semibold text-[#00F2FE]">
            <Sparkles className="w-3.5 h-3.5" /> HH GOA 2026 GRAPHIC
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready for <span className="gradient-text-goa">HH Goa 2026</span> 🚀
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Created with FrameInGoa • Official Hacker House Goa 2026 Badge
          </p>
        </div>

        {/* Display Image Card */}
        <div className="glass-card rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center gap-6 border border-slate-700/50">
          <div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={graphic?.imageDataUri || imageUrl}
              alt="Generated HH Goa 2026 Graphic"
              className="max-h-[500px] w-auto object-contain rounded-xl shadow-lg"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full pt-2">
            <a
              href={graphic?.imageDataUri || imageUrl}
              download={graphic?.format === "builder-card" ? "frameingoa-builder-card.png" : "frameingoa-pfp.png"}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-goa font-bold text-white shadow-lg hover:opacity-95 transition-all transform hover:-translate-y-0.5"
            >
              <Download className="w-5 h-5" /> Download PNG
            </a>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 font-semibold text-slate-200 hover:bg-slate-700/80 transition-all"
            >
              <Sparkles className="w-5 h-5 text-[#00F2FE]" /> Create Your Frame
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center text-slate-500 text-xs py-6">
        #FrameInGoa • Hacker House Goa 2026
      </div>
    </div>
  );
}
