"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";

// ─── Custom cursor ────────────────────────────────────────────────────────────

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);

    const targets = document.querySelectorAll<HTMLElement>(
      'button, a, [role="button"], [style*="cursor: pointer"], .cursor-pointer'
    );
    targets.forEach(t => {
      t.addEventListener("mouseenter", onEnter);
      t.addEventListener("mouseleave", onLeave);
    });

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      targets.forEach(t => {
        t.removeEventListener("mouseenter", onEnter);
        t.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        width: hovered ? 32 : 10,
        height: hovered ? 32 : 10,
        borderRadius: "50%",
        background: hovered ? "transparent" : "#1A1A1A",
        border: hovered ? "1.5px solid #1A1A1A" : "none",
        opacity: hovered ? 0.15 : 1,
        marginLeft: hovered ? -16 : -5,
        marginTop: hovered ? -16 : -5,
        transition: "width 0.2s ease, height 0.2s ease, opacity 0.2s ease, margin 0.2s ease, background 0.2s ease, border 0.2s ease",
      }}
    />
  );
}


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

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on("change", v => setScrolled(v > 80));
    return unsub;
  }, [scrollY]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const linkStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 500,
    color: scrolled ? "#111" : "rgba(0,0,0,0.7)",
    background: "none",
    border: "none",
    cursor: "none",
    padding: "4px 0",
    letterSpacing: "-0.01em",
    transition: "color 0.2s ease",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        padding: scrolled ? "16px max(16px, 2vw)" : "0",
        transition: "padding 0.35s ease",
      }}
    >
      <motion.nav
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: scrolled ? "auto" : "100%",
          maxWidth: scrolled ? 520 : "none",
          padding: scrolled ? "10px 20px" : "22px max(32px, 7vw)",
          background: scrolled ? "rgba(250,249,245,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          border: scrolled ? "1px solid rgba(0,0,0,0.08)" : "1px solid transparent",
          borderRadius: scrolled ? 999 : 0,
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.07)" : "none",
          gap: 28,
          transition: "background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* Wordmark */}
        <span
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ fontFamily: "var(--font-dm-sans)", fontSize: 17, fontWeight: 500, letterSpacing: "0.04em", color: "#111", cursor: "pointer", flexShrink: 0 }}
        >
          Lumina
        </span>

        {/* Links — hidden on mobile */}
        <div className="hidden sm:flex" style={{ alignItems: "center", gap: 28 }}>
          <button onClick={() => scrollTo("agents")} style={linkStyle}>How it works</button>
          <button onClick={() => scrollTo("problem")} style={linkStyle}>The problem</button>
          <Link
            href="/lumina"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#fff",
              background: "#111",
              padding: "7px 16px",
              borderRadius: 999,
              textDecoration: "none",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "opacity 0.2s ease",
            }}
          >
            Try Lumina
          </Link>
        </div>

        {/* Mobile: only Try Lumina button */}
        <div className="flex sm:hidden">
          <Link
            href="/lumina"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#fff",
              background: "#111",
              padding: "7px 16px",
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            Try Lumina
          </Link>
        </div>
      </motion.nav>
    </div>
  );
}

// ─── Hero orb (300 px, Lumina palette, always-idle float) ────────────────────

const TAGLINES = [
  { text: "ElevenLabs Conversational AI · Multi-Agent Orchestration", color: "rgba(184, 134, 11, 0.8)" },
  { text: "Built for BIM majors breaking into Product Management",     color: "rgba(74, 136, 232, 0.8)" },
  { text: "Scholar · The Closer · The Visionary",                      color: "rgba(128, 40, 200, 0.8)" },
];

function CyclingTagline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % TAGLINES.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ height: 16, overflow: "hidden", position: "relative", marginBottom: 22 }}>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          style={{
            position: "absolute",
            fontSize: 11, fontWeight: 500, letterSpacing: "0.12em",
            color: TAGLINES[index].color, textTransform: "uppercase",
            margin: 0, whiteSpace: "nowrap",
          }}
        >
          {TAGLINES[index].text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

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

type AgentDef = typeof AGENTS[number];

function AgentCard({ agent, delay }: { agent: AgentDef; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-60px" });
  const [shine, setShine] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotY =  dx * 8;
    const rotX = -dy * 8;
    const shineX = ((e.clientX - rect.left) / rect.width) * 100;
    const shineY = ((e.clientY - rect.top)  / rect.height) * 100;
    if (ref.current) {
      ref.current.style.transition = "transform 0.15s ease";
      ref.current.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }
    setShine({ x: shineX, y: shineY });
  };

  const onMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transition = "transform 0.4s ease";
      ref.current.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    }
    setHovering(false);
  };

  return (
    <div ref={containerRef}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.55, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <div
          ref={ref}
          onMouseMove={onMouseMove}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={onMouseLeave}
          style={{
            padding: "32px 28px",
            borderRadius: 20,
            background: agent.bg,
            border: `1px solid ${agent.border}`,
            height: "100%",
            display: "flex", flexDirection: "column", gap: 20,
            position: "relative",
            overflow: "hidden",
            willChange: "transform",
          }}
        >
          {/* Shine overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 20,
              background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
              opacity: hovering ? 1 : 0,
              transition: "opacity 0.2s ease",
              pointerEvents: "none",
            }}
          />
          <MiniOrb c1={agent.c1} c2={agent.c2} c3={agent.c3} />
          <div>
            <p style={{ fontSize: 17, fontWeight: 600, color: "#111", lineHeight: 1.3, marginBottom: 10 }}>
              {agent.title}
            </p>
            <p style={{ fontSize: 14.5, color: "rgba(0,0,0,0.5)", lineHeight: 1.55 }}>
              {agent.description}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

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

function OutlineButton({ href, children, target, rel }: { href: string; children: React.ReactNode; target?: string; rel?: string }) {
  return (
    <Link href={href} target={target} rel={rel}>
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

const AGENT_TTS = [
  {
    staticFile: "/audio/scholar.mp3",
    voiceId: "MClEFoImJXBTgLwdLI5n",
    text: "Hi, I'm the Scholar. I can help you synthesize your research and connect the dots between your classes and your career goals.",
  },
  {
    staticFile: "/audio/closer.mp3",
    voiceId: "QngvLQR8bsLR5bzoa6Vv",
    text: "I'm the Closer. Let's get these deliverables across the finish line and perfect your applications.",
  },
  {
    staticFile: "/audio/visionary.mp3",
    voiceId: "7EzWGsX10sAS4c9m9cPf",
    text: "I'm the Visionary. Let's think big about your product trajectory and map out your long-term path to the industry.",
  },
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

  const playAgentVoice = async (idx: number) => {
    audioRef.current?.pause();
    audioRef.current = null;
    setAudioState("loading");

    const { staticFile, voiceId, text } = AGENT_TTS[idx];

    const startPlayback = (url: string, revoke = false) => {
      const audio = new Audio(url);
      audioRef.current = audio;
      const cleanup = () => {
        if (revoke) URL.revokeObjectURL(url);
        if (audioRef.current === audio) audioRef.current = null;
      };
      audio.onended = () => { setAudioState("idle"); cleanup(); };
      audio.onerror = () => { setAudioState("idle"); cleanup(); };
      audio.play()
        .then(() => setAudioState("playing"))
        .catch(err => { console.error("Audio playback blocked:", err); setAudioState("idle"); cleanup(); });
    };

    // Try static file first (free, instant after generation)
    const probe = await fetch(staticFile, { method: "HEAD" }).catch(() => null);
    if (probe?.ok) {
      startPlayback(staticFile);
      return;
    }

    // Fall back to server-side API route (keeps API key off the client)
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voiceId, text }),
      });
      if (!res.ok) throw new Error(`TTS ${res.status}`);
      const url = URL.createObjectURL(await res.blob());
      startPlayback(url, true);
    } catch (e) {
      console.error("TTS error:", e);
      setAudioState("idle");
    }
  };

  const handleClick = (idx: number) => {
    setPaused(true);
    setActiveIdx(idx);
    if (!hintShown) setHintShown(true);
    playAgentVoice(idx);
  };

  const audioActive = audioState !== "idle";

  return (
    <div>
      <div style={{
        borderRadius: 20, border: "1px solid rgba(0,0,0,0.08)",
        padding: "36px 32px", background: "#EDECE6",
        display: "flex", flexDirection: "column", gap: 28,
      }}>
        <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(160,100,140,0.65)", margin: 0 }}>
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
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://api.fontshare.com/v2/css?f[]=general-sans@500,600&display=swap";
    document.head.appendChild(link);
  }, []);

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
        fontFamily: "'General Sans', sans-serif",
        fontWeight: 600,
        fontSize: 11, letterSpacing: "0.02em",
        color: "#1A1A1A",
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
    <div style={{ cursor: "none" }}>
      <CustomCursor />
      <Navbar />
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
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <CyclingTagline />
            </motion.div>

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
                margin: "0 0 28px -0.03em",
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
              your multi-agent AI, built for the students who do it all
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.38 }}
              className="flex flex-wrap gap-3"
            >
              <PrimaryButton href="/lumina">Try Lumina →</PrimaryButton>
              <OutlineButton href="/demo">Live Demo</OutlineButton>
              <OutlineButton href="https://github.com/leowu-hacohen/lumina" target="_blank" rel="noopener noreferrer">GitHub Repo</OutlineButton>
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
      <section id="agents" style={{ padding: "80px max(32px, 7vw) 100px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <FadeIn>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", color: "rgba(160,100,140,0.65)", textTransform: "uppercase", marginBottom: 14 }}>
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
              Three minds.<br />One conversation.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {AGENTS.map((agent, i) => (
              <AgentCard key={agent.title} agent={agent} delay={i * 0.12} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────────── */}
      <section id="problem" style={{ padding: "80px max(32px, 7vw) 100px" }}>
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
                { label: "Different modes, different mindset", body: "Technical problem-solving, behavioral storytelling, and strategic planning don't mix. Generic AI doesn't know which one you need." },
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
      <section style={{ background: "#F5F4EF", padding: "120px max(32px, 7vw)", position: "relative", overflow: "hidden" }}>
        {/* Background ambient orbs */}
        <motion.div animate={{ x: [0,30,-20,0], y: [0,-25,20,0] }} transition={{ duration: 9,  repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: "#EF8070", filter: "blur(60px)", opacity: 0.18, top: "15%",    left: "10%",   pointerEvents: "none" }} />
        <motion.div animate={{ x: [0,-25,20,0], y: [0,20,-30,0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", width: 100, height: 100, borderRadius: "50%", background: "#A472D8", filter: "blur(50px)", opacity: 0.15, top: "15%",    right: "10%",  pointerEvents: "none" }} />
        <motion.div animate={{ x: [0,20,-30,0], y: [0,-20,15,0] }} transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", width: 90,  height: 90,  borderRadius: "50%", background: "#6AA8E2", filter: "blur(45px)", opacity: 0.14, bottom: "15%", left: "50%",   transform: "translateX(-50%)", pointerEvents: "none" }} />

        <FadeIn>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}>

            {/* Breathing orb */}
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 200, height: 200, borderRadius: "50%", overflow: "hidden", position: "relative", flexShrink: 0, boxShadow: "0 12px 48px rgba(155, 115, 215, 0.2)" }}
            >
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, #EDD5C3 0%, #D5BCE8 55%, #BBCFEA 100%)" }} />
              <motion.div
                animate={{ x: [0, 60, -44, 34, 0], y: [0, -44, 60, -34, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "absolute", width: "75%", height: "75%", top: "-10%", left: "-10%", background: "#EF8070", filter: "blur(32px)", borderRadius: "50%" }}
              />
              <motion.div
                animate={{ x: [0, -52, 34, -24, 0], y: [0, 52, -34, 24, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "absolute", width: "68%", height: "68%", top: "-8%", right: "-8%", background: "#A472D8", filter: "blur(28px)", borderRadius: "50%" }}
              />
              <motion.div
                animate={{ x: [0, 46, -60, 28, 0], y: [0, 56, -34, -46, 0] }}
                transition={{ duration: 6.6, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "absolute", width: "62%", height: "62%", bottom: "-8%", right: "-8%", background: "#6AA8E2", filter: "blur(30px)", borderRadius: "50%" }}
              />
              <motion.div
                animate={{ x: [0, -40, 52, -32, 0], y: [0, -52, 32, 46, 0] }}
                transition={{ duration: 7.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "absolute", width: "60%", height: "60%", bottom: "-8%", left: "-8%", background: "#BBA8E8", filter: "blur(26px)", borderRadius: "50%" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 34% 27%, rgba(255,255,255,0.38) 0%, transparent 52%)" }} />
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, transparent 42%, rgba(35,15,55,0.16) 100%)" }} />
            </motion.div>

            <div style={{ height: 24 }} />
            <h2 style={{ fontFamily: "var(--font-dm-sans)", fontSize: 42, fontWeight: 600, letterSpacing: "-0.02em", color: "#111", margin: 0 }}>
              Start talking.
            </h2>
            <div style={{ height: 32 }} />
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
    </div>
  );
}
