https://forgefit-phi.vercel.app/  visit here



# ForgeFit – Cinematic 3D Athlete OS 🚀

> **The ultra-premium, immersive, and high-performance fitness operating system.**

ForgeFit elevates the fitness tracking experience. Built for elite athletes who view their training as protocol execution, this UI strips away the mundane aesthetics of standard fitness apps in favor of a dark, sci-fi inspired, "cyber-luxury" interface powered by cutting edge 3D integration and cinematic micro-animations.

---

## 🔥 Features
- **Cinematic Visual Language:** Deep black `#080808` canvases intertwined with vibrant `#C8FF00` (Neon Lime) accents, frosted glass panels, and noise overlays.
- **3D Telemetry (Three.js):** Integrated 3D anatomical models and real-time wire-framed workout telemetry synced gracefully into the DOM tree.
- **GSAP Orchestration:** Component staggering, counter ticks, drawing paths, and scroll-triggered physics.
- **Lenis Smooth Scroll:** Buttery-smooth, momentum-driven scrolling framework ensuring 60fps parallax actions.
- **Neural Engine AI:** An immersive chat UI interface designed to synthesize biometric feeds into actionable protocol adjustments.
- **Achievements & PR Tracking:** Dark-gamification layer to reward consistency and load volume.

---

## 🛠️ Technology Stack
- **Framework:** Next.js 15 (App Router, React 19)
- **Styling:** Tailwind CSS (Custom themes, Utility scaling)
- **Animation Engine:** GSAP (ScrollTrigger, core) + Framer Motion (Page routing, micro-interactions)
- **3D Rendering:** Three.js (Vanilla, optimized for raw canvas manipulation)
- **Typography:** `Inter` (Sans), `Space Grotesk` (Headings), `JetBrains Mono` (Data)
- **Scroll Hijacking:** Lenis by Studio Freight

---

## 💻 Local Setup Instructions

1. **Clone the sequence**:
   ```bash
   git clone https://github.com/your-username/forgefit.git
   cd forgefit
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Initialize the local forge**:
   ```bash
   npm run dev
   ```

4. **Access the terminal**:
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deployment Guide (Vercel)
This architecture is optimized for seamless deployment to Vercel via output `standalone` settings.

1. Push your code to your GitHub repository.
2. Sign up / Log in to [Vercel](https://vercel.com).
3. Select "Add New..." -> "Project" -> Select the ForgeFit repo.
4. Leave all build commands default (Vercel auto-detects Next.js).
5. Click **Deploy**.

*Performance Note:* The `next.config.mjs` incorporates image optimization pipelines and outputs as standalone, meaning Docker containers are highly viable out-of-the-box should you reject serverless configurations.

---

## 📈 Extension / Scaling (Next Steps)
- **Authentication**: Splice [Supabase Auth] or [Clerk] directly into `components/auth/LoginPage.tsx`.
- **Database Architecture**: Connect workout logging to [PostgreSQL via Prisma/Drizzle]. 
- **Zustand State**: Migrate local hooks within `/logger` and `/planner` to a global Zustand store for cross-tab session syncing.

---
*Built within the Forge. Protocol Complete.*
