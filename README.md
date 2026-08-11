# FrameInGoa 🚀 — HH Goa 2026

**FrameInGoa** is a mobile-first web application built for **Hacker House Goa 2026 (HH Goa 2026)**. Attendees and builders can upload a photo (JPG, PNG, HEIC) and instantly create a branded profile picture frame or an official social-media Builder Pass badge, downloadable in high-resolution PNG and ready to share directly to X with Open Graph preview cards.

The entire experience works seamlessly **without signup, login, or onboarding barriers**.

---

## ✨ Key Features

1. **Two Generation Modes**:
   - **Format A: HH Goa 2026 Profile Picture Frame**: 1024x1024 square profile picture with face auto-centering, branded border presets (Sunset Cyber, Neon Palm, Anjuna Wave, VIP Gold), and `#FrameInGoa` badge.
   - **Format B: HH Goa 2026 Builder ID Card**: 1200x630 social pass featuring name, stack/role badge, auto-generated fun builder title, event hologram, and QR/badge styling.

2. **Smart Upload & iPhone HEIC Support**:
   - Drag-and-drop & mobile photo picker.
   - Native client-side conversion for iPhone HEIC/HEIF photos using `heic2any`.
   - File size validation (Max 10 MB).

3. **Intelligent Face Detection & Positioning**:
   - Auto-face centering algorithm to keep faces as focal points.
   - Manual pan (X & Y) and zoom controls with interactive live Canvas preview.

4. **1-Click Download & X Share**:
   - Instant PNG download (`frameingoa-pfp.png` and `frameingoa-builder-card.png`).
   - One-click **Share to X** button with pre-filled tweet: `"Ready for HH Goa 2026 🚀 #FrameInGoa"`.
   - Dynamic Open Graph link generation (`/share/[id]`) so generated images render directly in X link previews.

5. **Modern Glassmorphism Design**:
   - Goa sunset neon gradient accents (`#FF3B00`, `#FF8C00`, `#00F2FE`, `#7928CA`).
   - Micro-animations with Framer Motion and celebratory confetti explosions upon export.
   - Fully responsive for mobile phones, tablets, and desktop displays.

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Glassmorphism Theme
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) (Server pipeline) + HTML5 Canvas & `heic2any` (Client pipeline)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) + Canvas Confetti
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js 18.x or 20.x
- npm / pnpm / yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub / GitLab.
2. Import the project into your [Vercel Dashboard](https://vercel.com).
3. Deploy! (No additional environment variables required out-of-the-box).

---

## 📄 License

MIT © HH Goa 2026
