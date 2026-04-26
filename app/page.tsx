"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";

// ─── Shared tiny FadeIn wrapper ──────────────────────────────────────────────

function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 22 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Hero orb (300 px, Lumina palette, always-idle float) ────────────────────

function HeroOrb() {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>

      {/* Soft glow — same palette, blurred, pulsing opacity */}
      <motion.div
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 345,
          height: 345,
          borderRadius: "50%",
          background: "linear-gradient(145deg, #EF8070 0%, #A472D8 45%, #6AA8E2 80%, #BBA8E8 100%)",
          filter: "blur(40px)",
        }}
      />

      {/* Drop shadow ellipse below */}
      <div
        style={{
          position: "absolute",
          bottom: -22,
          left: "50%",
          transform: "translateX(-50%)",
          width: 200,
          height: 36,
          background: "rgba(140, 100, 190, 0.18)",
          filter: "blur(20px)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Orb — floats (4 s) and breathes (3 s) independently */}
      <motion.div
        animate={{ y: [0, -20, 0], scale: [1, 1.03, 1] }}
        transition={{
          y:     { duration: 4, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{
          width: 300,
          height: 300,
          borderRadius: "50%",
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
          zIndex: 1,
          boxShadow: "0 16px 56px rgba(155, 115, 215, 0.22)",
        }}
      >
        {/* Base gradient */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, #EDD5C3 0%, #D5BCE8 55%, #BBCFEA 100%)" }} />

        {/* Blobs — large travel distances make colour movement clearly visible */}
        <motion.div
          animate={{ x: [0, 90, -70, 50, 0], y: [0, -70, 90, -50, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", width: "75%", height: "75%", top: "-10%", left: "-10%", background: "#EF8070", filter: "blur(48px)", borderRadius: "50%" }}
        />
        <motion.div
          animate={{ x: [0, -80, 60, -40, 0], y: [0, 80, -60, 40, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", width: "68%", height: "68%", top: "-8%", right: "-8%", background: "#A472D8", filter: "blur(44px)", borderRadius: "50%" }}
        />
        <motion.div
          animate={{ x: [0, 70, -90, 40, 0], y: [0, 85, -50, -70, 0] }}
          transition={{ duration: 6.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", width: "62%", height: "62%", bottom: "-8%", right: "-8%", background: "#6AA8E2", filter: "blur(46px)", borderRadius: "50%" }}
        />
        <motion.div
          animate={{ x: [0, -60, 80, -50, 0], y: [0, -80, 50, 70, 0] }}
          transition={{ duration: 7.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", width: "60%", height: "60%", bottom: "-8%", left: "-8%", background: "#BBA8E8", filter: "blur(40px)", borderRadius: "50%" }}
        />

        {/* Specular highlight */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 34% 27%, rgba(255,255,255,0.38) 0%, transparent 52%)" }} />

        {/* Edge vignette */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, transparent 42%, rgba(35,15,55,0.16) 100%)" }} />
      </motion.div>
    </div>
  );
}

// ─── Mini orb for agent cards (60 px) ────────────────────────────────────────

function MiniOrb({ c1, c2, c3 }: { c1: string; c2: string; c3: string }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.06, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: 60, height: 60, borderRadius: "50%", overflow: "hidden", position: "relative", flexShrink: 0, boxShadow: "0 6px 20px rgba(0,0,0,0.1)" }}
    >
      <motion.div animate={{ opacity: [0.9, 1, 0.75, 0.9], x: [0, 3, -2, 0], y: [0, -3, 2, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", width: "80%", height: "80%", top: "-10%", left: "-10%", background: c1, filter: "blur(14px)", borderRadius: "50%" }} />
      <motion.div animate={{ opacity: [0.7, 0.9, 0.6, 0.7], x: [0, -3, 2, 0], y: [0, 3, -2, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", width: "65%", height: "65%", top: "-5%", right: "-5%", background: c2, filter: "blur(11px)", borderRadius: "50%" }} />
      <motion.div animate={{ opacity: [0.6, 0.8, 0.5, 0.6], scale: [1, 1.12, 0.9, 1] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", width: "55%", height: "55%", bottom: "-5%", left: "20%", background: c3, filter: "blur(9px)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 35% 28%, rgba(255,255,255,0.38) 0%, transparent 55%)" }} />
    </motion.div>
  );
}

// ─── Agent cards data ─────────────────────────────────────────────────────────

const AGENTS = [
  {
    title: "The Scholar",
    description: "Professor-logic tutoring for your BIM courses",
    c1: "#4A88E8", c2: "#38C4D8", c3: "#4868D8",
    bg: "rgba(74, 136, 232, 0.05)",
    border: "rgba(74, 136, 232, 0.11)",
    label: "rgba(74, 136, 232, 0.7)",
  },
  {
    title: "The Closer",
    description: "High-stakes PM interview prep, STAR method enforcement",
    c1: "#E8A030", c2: "#E06020", c3: "#D4B018",
    bg: "rgba(232, 160, 48, 0.05)",
    border: "rgba(232, 160, 48, 0.11)",
    label: "rgba(220, 140, 30, 0.8)",
  },
  {
    title: "The Visionary",
    description: "PM frameworks, career strategy, and life planning",
    c1: "#8028C8", c2: "#C02090", c3: "#5018B8",
    bg: "rgba(128, 40, 200, 0.05)",
    border: "rgba(128, 40, 200, 0.11)",
    label: "rgba(120, 36, 190, 0.7)",
  },
];

// ─── Button components ────────────────────────────────────────────────────────

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <motion.span
        whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(0,0,0,0.18)" }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.18 }}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          height: 48, padding: "0 26px", borderRadius: 10,
          background: "#1A1A1A", color: "#fff",
          fontSize: 15, fontWeight: 500, letterSpacing: "0.01em",
          cursor: "pointer", userSelect: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        {children}
      </motion.span>
    </Link>
  );
}

function OutlineButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <motion.span
        whileHover={{ y: -2, background: "rgba(0,0,0,0.04)" }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.18 }}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          height: 48, padding: "0 22px", borderRadius: 10,
          background: "transparent", color: "#1A1A1A",
          border: "1px solid rgba(0,0,0,0.16)",
          fontSize: 15, fontWeight: 500, letterSpacing: "0.01em",
          cursor: "pointer", userSelect: "none",
        }}
      >
        {children}
      </motion.span>
    </Link>
  );
}

// ─── Agent cycler card (problem section right column) ────────────────────────

const CYCLER_AGENTS = [
  { name: "Scholar",      color: "#4A88E8" },
  { name: "The Closer",   color: "#E8A030" },
  { name: "The Visionary",color: "#8028C8" },
];

// Replace these voice IDs with the ones assigned in your ElevenLabs dashboard
const AGENT_TTS = [
  { voiceId: "21m00Tcm4TlvDq8ikWAM", text: "I'm the Scholar. Ask me anything about your coursework." },
  { voiceId: "AZnzlk1XvdvUeBnXmlld", text: "The Closer. Let's get to work on your interview prep." },
  { voiceId: "EXAVITQu4vr4xnSDxMaL", text: "Visionary. What are we building toward?" },
];

function TinyBars({ active }: { active: boolean }) {
  const specs = [{ h: 10, d: 0 }, { h: 16, d: 0.08 }, { h: 10, d: 0.16 }];
  return (
    <div style={{ display: "flex", gap: 2.5, alignItems: "center", height: 18, flexShrink: 0 }}>
      {specs.map((s, i) => (
        <motion.div
          key={i}
          animate={active ? { height: [3, s.h, 3] } : { height: 3 }}
          transition={active
            ? { duration: 0.45, repeat: Infinity, delay: s.d, ease: "easeInOut" }
            : { duration: 0.2 }}
          style={{ width: 2.5, borderRadius: 1.5, background: "rgba(0,0,0,0.3)" }}
        />
      ))}
    </div>
  );
}

function AgentCycler() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused]       = useState(false);
  const [audioState, setAudioState] = useState<"idle" | "loading" | "playing">("idle");
  const [hintShown, setHintShown] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-cycle every 2.5 s, stops when paused
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActiveIdx(i => (i + 1) % 3), 2500);
    return () => clearInterval(id);
  }, [paused]);

  // Cleanup audio on unmount
  useEffect(() => () => { audioRef.current?.pause(); }, []);

  const playAudio = async (idx: number) => {
    audioRef.current?.pause();
    audioRef.current = null;

    const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
    if (!apiKey) return;

    const { voiceId, text } = AGENT_TTS[idx];
    setAudioState("loading");

    try {
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
        {
          method: "POST",
          headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2",
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        }
      );
      if (!res.ok) throw new Error(`TTS ${res.status}`);

      const url = URL.createObjectURL(await res.blob());
      const audio = new Audio(url);
      audioRef.current = audio;
      setAudioState("playing");

      audio.onended = () => { setAudioState("idle"); URL.revokeObjectURL(url); audioRef.current = null; };
      audio.onerror = () => { setAudioState("idle"); audioRef.current = null; };
      audio.play();
    } catch (e) {
      console.error("TTS error:", e);
      setAudioState("idle");
    }
  };

  const handleClick = (idx: number) => {
    setPaused(true);
    setActiveIdx(idx);
    if (!hintShown) setHintShown(true);
    playAudio(idx);
  };

  const audioActive = audioState !== "idle";

  return (
    <div>
      <div style={{
        borderRadius: 20, border: "1px solid rgba(0,0,0,0.08)",
        padding: "36px 32px", background: "#EDECE6",
        display: "flex", flexDirection: "column", gap: 28,
      }}>
        <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", margin: 0 }}>
          Switch modes instantly
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {CYCLER_AGENTS.map((agent, i) => (
            <motion.div
              key={agent.name}
              onClick={() => handleClick(i)}
              whileHover={{ background: activeIdx !== i ? "rgba(0,0,0,0.03)" : "transparent" }}
              transition={{ duration: 0.15 }}
              style={{ position: "relative", borderRadius: 12, cursor: "pointer" }}
            >
              {/* Sliding highlight — layoutId makes it glide between rows */}
              {activeIdx === i && (
                <motion.div
                  layoutId="active-highlight"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  style={{
                    position: "absolute", inset: 0, borderRadius: 12,
                    background: "rgba(255,255,255,0.72)",
                    border: "1px solid rgba(0,0,0,0.07)",
                  }}
                />
              )}

              {/* Row content */}
              <div style={{
                position: "relative", zIndex: 1,
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px",
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: agent.color, flexShrink: 0 }} />
                <span style={{
                  fontSize: 14, flex: 1,
                  fontWeight: activeIdx === i ? 600 : 400,
                  color: activeIdx === i ? "#111" : "rgba(0,0,0,0.45)",
                }}>
                  {agent.name}
                </span>

                {/* Waveform while audio loads/plays */}
                {activeIdx === i && audioActive && <TinyBars active={audioState === "playing"} />}

                {/* "Active" label when idle */}
                <AnimatePresence>
                  {activeIdx === i && !audioActive && (
                    <motion.span
                      key="lbl"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ fontSize: 11, color: "rgba(0,0,0,0.3)", letterSpacing: "0.05em" }}
                    >
                      Active
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        <p style={{ fontSize: 13, color: "rgba(0,0,0,0.35)", lineHeight: 1.6, margin: 0 }}>
          Each agent remembers its lane.<br />You just show up and talk.
        </p>
      </div>

      {/* One-time hint after first click */}
      <AnimatePresence>
        {hintShown && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ margin: "10px 0 0", fontSize: 11, color: "rgba(0,0,0,0.28)", textAlign: "center" }}
          >
            click any agent to hear them
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Intro preloader ──────────────────────────────────────────────────────────

function IntroOrb() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", duration: 1.2, bounce: 0.28 }}
      style={{
        width: 200, height: 200, borderRadius: "50%",
        overflow: "hidden", position: "relative",
        boxShadow: "0 12px 40px rgba(155, 115, 215, 0.2)",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, #EDD5C3 0%, #D5BCE8 55%, #BBCFEA 100%)" }} />
      <motion.div
        animate={{ x: [0, 46, -34, 20, 0], y: [0, -34, 46, -20, 0] }}
        transition={{ duration: 5.3, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", width: "75%", height: "75%", top: "-10%", left: "-10%", background: "#EF8070", filter: "blur(32px)", borderRadius: "50%" }}
      />
      <motion.div
        animate={{ x: [0, -40, 26, -14, 0], y: [0, 40, -26, 14, 0] }}
        transition={{ duration: 6.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", width: "68%", height: "68%", top: "-8%", right: "-8%", background: "#A472D8", filter: "blur(28px)", borderRadius: "50%" }}
      />
      <motion.div
        animate={{ x: [0, 34, -46, 14, 0], y: [0, 43, -20, -34, 0] }}
        transition={{ duration: 7.3, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", width: "62%", height: "62%", bottom: "-8%", right: "-8%", background: "#6AA8E2", filter: "blur(30px)", borderRadius: "50%" }}
      />
      <motion.div
        animate={{ x: [0, -26, 40, -20, 0], y: [0, -40, 20, 34, 0] }}
        transition={{ duration: 8.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", width: "60%", height: "60%", bottom: "-8%", left: "-8%", background: "#BBA8E8", filter: "blur(26px)", borderRadius: "50%" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 34% 27%, rgba(255,255,255,0.38) 0%, transparent 52%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, transparent 42%, rgba(35,15,55,0.16) 100%)" }} />
    </motion.div>
  );
}

function IntroOverlay({ onComplete }: { onComplete: () => void }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const full = "LUMINA";
    let i = 0;
    const t = setInterval(() => {
      i++;
      setDisplayText(full.slice(0, i));
      if (i >= full.length) clearInterval(t);
    }, 80);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "#F5F4EF",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 22,
      }}
    >
      <IntroOrb />

      <p style={{
        fontFamily: "var(--font-dm-sans)",
        fontSize: 11, letterSpacing: "0.3em",
        color: "rgba(0,0,0,0.4)",
        width: "6ch", textAlign: "center",
        margin: 0,
      }}>
        {displayText}
      </p>

      {/* Loading bar track */}
      <div style={{ width: 120, height: 1.5, background: "rgba(0,0,0,0.08)", position: "relative" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 120 }}
          transition={{ duration: 2.5, ease: "linear" }}
          onAnimationComplete={onComplete}
          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }}
        />
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [showIntro, setShowIntro] = useState(true);
  const { scrollY } = useScroll();
  const heroTextY = useTransform(scrollY, [0, 500], [0, -38]);
  const heroOrbY  = useTransform(scrollY, [0, 300], [0, -60]);

  return (
    <>
      <AnimatePresence>
        {showIntro && <IntroOverlay onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
    <div style={{ background: "#F5F4EF", minHeight: "100vh" }}>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "80px max(32px, 7vw)",
        }}
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8"
          style={{ width: "100%", maxWidth: 1160, margin: "0 auto" }}
        >
          {/* Left: text */}
          <motion.div
            style={{ y: heroTextY, display: "flex", flexDirection: "column", justifyContent: "center", gap: 0 }}
          >
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontSize: 11, fontWeight: 500, letterSpacing: "0.12em",
                color: "rgba(0,0,0,0.38)", textTransform: "uppercase",
                marginBottom: 22,
              }}
            >
              ElevenLabs Conversational AI · Multi-Agent · Next.js 15
            </motion.p>

            {/* Wordmark */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "clamp(80px, 10vw, 140px)",
                fontWeight: 700,
                lineHeight: 0.92,
                letterSpacing: "-0.03em",
                color: "#111",
                marginBottom: 28,
              }}
            >
              Lumina
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.28 }}
              style={{
                fontSize: "clamp(16px, 1.5vw, 19px)",
                lineHeight: 1.55,
                color: "rgba(0,0,0,0.52)",
                maxWidth: 420,
                marginBottom: 40,
              }}
            >
              your multi-agent AI — built for the students who do it all
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.38 }}
              className="flex flex-wrap gap-3"
            >
              <PrimaryButton href="/lumina">Try Lumina →</PrimaryButton>
              <OutlineButton href="#">Live Demo</OutlineButton>
              <OutlineButton href="#">GitHub Repo</OutlineButton>
            </motion.div>
          </motion.div>

          {/* Right: orb */}
          <motion.div
            style={{ y: heroOrbY }}
            className="flex items-center justify-center"
          >
            <HeroOrb />
          </motion.div>
        </div>
      </section>

      {/* ── AGENTS ───────────────────────────────────────────────────── */}
      <section style={{ padding: "80px max(32px, 7vw) 100px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <FadeIn>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", color: "rgba(0,0,0,0.35)", textTransform: "uppercase", marginBottom: 14 }}>
              Meet the agents
            </p>
            <h2
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "clamp(32px, 3.5vw, 52px)",
                fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.1,
                color: "#111", marginBottom: 56,
              }}
            >
              One voice.<br />Three minds.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {AGENTS.map((agent, i) => (
              <FadeIn key={agent.title} delay={i * 0.1}>
                <div
                  style={{
                    padding: "32px 28px",
                    borderRadius: 20,
                    background: agent.bg,
                    border: `1px solid ${agent.border}`,
                    height: "100%",
                    display: "flex", flexDirection: "column", gap: 20,
                  }}
                >
                  <MiniOrb c1={agent.c1} c2={agent.c2} c3={agent.c3} />
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: agent.label, marginBottom: 8 }}>
                      {agent.title}
                    </p>
                    <p style={{ fontSize: 17, fontWeight: 600, color: "#111", lineHeight: 1.3, marginBottom: 10 }}>
                      {agent.title}
                    </p>
                    <p style={{ fontSize: 14.5, color: "rgba(0,0,0,0.5)", lineHeight: 1.55 }}>
                      {agent.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────────── */}
      <section style={{ padding: "80px max(32px, 7vw) 100px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <FadeIn>
            <h2
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "clamp(32px, 3.5vw, 52px)",
                fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.1,
                color: "#111", marginBottom: 64,
                maxWidth: 680,
              }}
            >
              Built for the context-switching student
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Bullets */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { label: "Every day looks different", body: "BIM studio on Monday, PM case prep on Wednesday, job app review on Friday." },
                { label: "Different modes, different mindset", body: "Technical problem-solving, behavioral storytelling, and strategic planning don't mix — and generic AI doesn't know which one you need." },
                { label: "No program context", body: "Generic AI has never heard of your BIM track, your professors, or your specific career trajectory." },
                { label: "Stop re-explaining yourself", body: "Each specialized agent knows its lane. You just pick who you're talking to." },
              ].map((item, i) => (
                <FadeIn key={item.label} delay={i * 0.08}>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1A1A1A", flexShrink: 0, marginTop: 8 }} />
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 600, color: "#111", marginBottom: 4 }}>{item.label}</p>
                      <p style={{ fontSize: 14.5, color: "rgba(0,0,0,0.48)", lineHeight: 1.6 }}>{item.body}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Right visual */}
            <FadeIn delay={0.15}>
              <AgentCycler />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section style={{ background: "#E9E8E1", padding: "100px max(32px, 7vw)" }}>
        <FadeIn>
          <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", color: "rgba(0,0,0,0.35)", textTransform: "uppercase" }}>
              Get started
            </p>
            <h2
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1,
                color: "#111",
              }}
            >
              Ready to talk to Lumina?
            </h2>
            <p style={{ fontSize: 17, color: "rgba(0,0,0,0.48)", lineHeight: 1.55 }}>
              Your AI study partner, interview coach, and career strategist — all in one conversation.
            </p>
            <PrimaryButton href="/lumina">Try Lumina →</PrimaryButton>
          </div>
        </FadeIn>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer style={{ padding: "28px max(32px, 7vw)", borderTop: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 14, fontWeight: 500, color: "rgba(0,0,0,0.4)" }}>
          Lumina
        </span>
        <span style={{ fontSize: 13, color: "rgba(0,0,0,0.32)" }}>
          Built with ElevenLabs
        </span>
      </footer>

    </div>
      </motion.div>
    </>
  );
}
