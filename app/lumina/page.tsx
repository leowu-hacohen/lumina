"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConversationProvider, useConversation } from "@elevenlabs/react";

type AgentConfig = {
  dot: string;
  shadowRgba: string;
  haloBox: string;
  blob1: string;
  blob2: string;
  blob3: string;
  blob4: string;
  blob5: string;
};

const AGENTS: Record<string, AgentConfig> = {
  Lumina: {
    dot: "#52C46E",
    shadowRgba: "rgba(140, 100, 190, 0.22)",
    haloBox: "0 0 0 2px rgba(215, 175, 245, 0.55), 0 0 32px 10px rgba(195, 145, 235, 0.2)",
    blob1: "#EF8070",
    blob2: "#A472D8",
    blob3: "#6AA8E2",
    blob4: "#BBA8E8",
    blob5: "#E89EC0",
  },
  Scholar: {
    dot: "#5B9FE8",
    shadowRgba: "rgba(55, 125, 210, 0.22)",
    haloBox: "0 0 0 2px rgba(100, 195, 240, 0.55), 0 0 32px 10px rgba(75, 170, 225, 0.2)",
    blob1: "#4A88E8",
    blob2: "#38C4D8",
    blob3: "#32B0A8",
    blob4: "#52C0C8",
    blob5: "#4868D8",
  },
  "The Closer": {
    dot: "#E89040",
    shadowRgba: "rgba(205, 110, 30, 0.22)",
    haloBox: "0 0 0 2px rgba(240, 165, 55, 0.55), 0 0 32px 10px rgba(225, 140, 30, 0.2)",
    blob1: "#E8A030",
    blob2: "#E06020",
    blob3: "#D4B018",
    blob4: "#E88030",
    blob5: "#C84510",
  },
  Visionary: {
    dot: "#A472D8",
    shadowRgba: "rgba(100, 25, 178, 0.22)",
    haloBox: "0 0 0 2px rgba(190, 90, 238, 0.55), 0 0 32px 10px rgba(165, 68, 215, 0.2)",
    blob1: "#5018B8",
    blob2: "#8028C8",
    blob3: "#C02090",
    blob4: "#6020C0",
    blob5: "#9820A8",
  },
};

const COLOR_TRANSITION = { duration: 1.5, ease: "easeInOut" as const };
const LOOP_8  = { duration: 8,   repeat: Infinity, ease: "easeInOut" as const };
const LOOP_9  = { duration: 9.5, repeat: Infinity, ease: "easeInOut" as const };
const LOOP_11 = { duration: 11,  repeat: Infinity, ease: "easeInOut" as const };
const LOOP_12 = { duration: 12,  repeat: Infinity, ease: "easeInOut" as const };
const LOOP_7  = { duration: 7.5, repeat: Infinity, ease: "easeInOut" as const };

// Staggered bar specs: each bar has its own max height, cycle speed, and start delay
const BAR_SPECS = [
  { maxH: 18, dur: 0.52, delay: 0 },
  { maxH: 26, dur: 0.38, delay: 0.07 },
  { maxH: 22, dur: 0.60, delay: 0.13 },
  { maxH: 15, dur: 0.46, delay: 0.19 },
];

function WaveformBars({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <div style={{ display: "flex", gap: 3.5, alignItems: "center", height: 32, flexShrink: 0 }}>
      {BAR_SPECS.map((bar, i) => (
        <motion.div
          key={i}
          animate={isSpeaking ? { height: [4, bar.maxH, 4] } : { height: 4 }}
          transition={
            isSpeaking
              ? { duration: bar.dur, repeat: Infinity, delay: bar.delay, ease: "easeInOut" }
              : { duration: 0.3, ease: "easeOut" }
          }
          style={{
            width: 3,
            borderRadius: 2,
            background: isSpeaking ? "rgba(99, 102, 241, 0.45)" : "rgba(0, 0, 0, 0.14)",
            transition: "background 0.4s ease",
          }}
        />
      ))}
    </div>
  );
}

function MicIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <rect x="5" y="5" width="14" height="14" rx="2" />
    </svg>
  );
}

function Orb({
  isSpeaking,
  isActive,
  agentName,
}: {
  isSpeaking: boolean;
  isActive: boolean;
  agentName: string;
}) {
  const cfg = AGENTS[agentName] ?? AGENTS.Lumina;

  const orbScale = isSpeaking
    ? { scale: [1, 1.07, 1.02, 1.09, 1.01, 1] }
    : isActive
    ? { scale: [1, 1.03, 1] }
    : { scale: [1, 1.015, 1] };
  const orbDuration = isSpeaking ? 1.8 : isActive ? 3.5 : 6;

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Floating ellipse shadow */}
      <motion.div
        animate={{ background: cfg.shadowRgba }}
        transition={COLOR_TRANSITION}
        style={{
          position: "absolute",
          bottom: -28,
          left: "50%",
          transform: "translateX(-50%)",
          width: 280,
          height: 48,
          filter: "blur(28px)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Speaking halo ring */}
      <motion.div
        animate={
          isSpeaking
            ? { opacity: [0.7, 0.12, 0.7], scale: [1, 1.09, 1] }
            : { opacity: 0, scale: 1 }
        }
        transition={
          isSpeaking
            ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.5, ease: "easeOut" }
        }
        style={{
          position: "absolute",
          width: 434,
          height: 434,
          borderRadius: "50%",
          boxShadow: cfg.haloBox,
          pointerEvents: "none",
          transition: "box-shadow 1.5s ease",
        }}
      />

      {/* The orb */}
      <motion.div
        animate={orbScale}
        transition={{ duration: orbDuration, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
          boxShadow: isActive
            ? "0 10px 60px rgba(155, 115, 215, 0.22), 0 0 0 1px rgba(210, 190, 235, 0.15)"
            : "0 8px 40px rgba(185, 165, 215, 0.14)",
          transition: "box-shadow 0.6s ease",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, #EDD5C3 0%, #D5BCE8 55%, #BBCFEA 100%)" }} />

        <motion.div
          initial={{ background: AGENTS.Lumina.blob1 }}
          animate={{ background: cfg.blob1, opacity: [0.82, 1, 0.72, 0.9, 0.82], x: [0, 14, -9, 7, 0], y: [0, -11, 9, -7, 0] }}
          transition={{ background: COLOR_TRANSITION, opacity: LOOP_8, x: LOOP_8, y: LOOP_8 }}
          style={{ position: "absolute", width: "72%", height: "72%", top: "-6%", left: "-6%", filter: "blur(62px)", borderRadius: "50%" }}
        />

        <motion.div
          initial={{ background: AGENTS.Lumina.blob2 }}
          animate={{ background: cfg.blob2, opacity: [0.68, 0.88, 0.58, 0.78, 0.68], x: [0, -15, 9, -11, 0], y: [0, 9, -13, 11, 0] }}
          transition={{ background: COLOR_TRANSITION, opacity: LOOP_9, x: LOOP_9, y: LOOP_9 }}
          style={{ position: "absolute", width: "66%", height: "66%", top: "-6%", right: "-6%", filter: "blur(56px)", borderRadius: "50%" }}
        />

        <motion.div
          initial={{ background: AGENTS.Lumina.blob3 }}
          animate={{ background: cfg.blob3, opacity: [0.6, 0.8, 0.52, 0.72, 0.6], x: [0, 11, -13, 9, 0], y: [0, 15, -9, 13, 0] }}
          transition={{ background: COLOR_TRANSITION, opacity: LOOP_11, x: LOOP_11, y: LOOP_11 }}
          style={{ position: "absolute", width: "62%", height: "62%", bottom: "-6%", right: "-6%", filter: "blur(58px)", borderRadius: "50%" }}
        />

        <motion.div
          initial={{ background: AGENTS.Lumina.blob4 }}
          animate={{ background: cfg.blob4, opacity: [0.64, 0.84, 0.5, 0.74, 0.64], x: [0, -11, 15, -9, 0], y: [0, -13, 11, -15, 0] }}
          transition={{ background: COLOR_TRANSITION, opacity: LOOP_12, x: LOOP_12, y: LOOP_12 }}
          style={{ position: "absolute", width: "60%", height: "60%", bottom: "-6%", left: "-6%", filter: "blur(52px)", borderRadius: "50%" }}
        />

        <motion.div
          initial={{ background: AGENTS.Lumina.blob5 }}
          animate={{ background: cfg.blob5, opacity: [0.42, 0.62, 0.32, 0.55, 0.42], scale: [1, 1.18, 0.88, 1.12, 1] }}
          transition={{ background: COLOR_TRANSITION, opacity: LOOP_7, scale: LOOP_7 }}
          style={{ position: "absolute", width: "46%", height: "46%", top: "27%", left: "27%", filter: "blur(44px)", borderRadius: "50%" }}
        />

        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 34% 27%, rgba(255,255,255,0.38) 0%, transparent 52%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, transparent 42%, rgba(35,15,55,0.16) 100%)" }} />
      </motion.div>
    </div>
  );
}

function LuminaApp() {
  const [agentName, setAgentName] = useState("Lumina");

  const { startSession, endSession, isSpeaking, status } = useConversation({
    onMessage: (payload) => {
      console.log("message payload:", payload);
      if (payload.role !== "agent") return;
      const text = payload.message;
      if (text.includes("Scholar"))    setAgentName("Scholar");
      else if (text.includes("Closer"))    setAgentName("The Closer");
      else if (text.includes("Visionary")) setAgentName("The Visionary");
      else if (text.includes("Lumina"))    setAgentName("Lumina");
    },
  });

  useEffect(() => {
    console.log("isSpeaking:", isSpeaking);
  }, [isSpeaking]);

  const isActive = status === "connected" || status === "connecting";
  const isConnected = status === "connected";
  const cfg = AGENTS[agentName] ?? AGENTS.Lumina;

  const handleToggle = async () => {
    if (isActive) {
      endSession();
    } else {
      await startSession({
        agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!,
      });
    }
  };

  return (
    <div className="relative h-screen w-full select-none overflow-hidden" style={{ background: "#F5F4EF" }}>
      {/* Wordmark — DM Sans */}
      <header className="absolute top-0 left-0 p-8 z-10">
        <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 18, fontWeight: 500, letterSpacing: "0.06em", color: "#1A1A1A" }}>
          Lumina
        </span>
      </header>

      {/* Orb + badge + status — true center */}
      <main className="absolute inset-0 flex flex-col items-center justify-center gap-8">
        <Orb isSpeaking={isSpeaking} isActive={isActive} agentName={agentName} />

        {/* Badge + status line grouped tightly */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 9 }}>
          {/* Agent badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.65, ease: "easeOut" }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "5px 15px",
              borderRadius: 999,
              background: "rgba(0,0,0,0.055)",
              border: "1px solid rgba(0,0,0,0.075)",
            }}
          >
            {isActive && (
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                style={{
                  display: "block",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: isConnected ? cfg.dot : "#E8A040",
                  flexShrink: 0,
                  transition: "background 1.5s ease",
                }}
              />
            )}
            <span style={{ fontSize: 13, fontWeight: 500, color: "#4E4E4E", letterSpacing: "0.01em" }}>
              {agentName}
            </span>
          </motion.div>

          {/* Status line — fixed height prevents layout shift */}
          <div style={{ height: 18 }}>
            <AnimatePresence mode="wait">
              {isConnected && (
                <motion.p
                  key={isSpeaking ? "speaking" : "listening"}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.22 }}
                  style={{ margin: 0, fontSize: 12, color: "rgba(0,0,0,0.35)", letterSpacing: "0.04em", lineHeight: 1 }}
                >
                  {isSpeaking ? "Speaking..." : "Listening..."}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer — mic button flanked by waveform bars */}
      <footer className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center pb-14 gap-3 z-10">
        {/* Connecting label */}
        <AnimatePresence>
          {status === "connecting" && (
            <motion.p
              key="connecting"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
              style={{ margin: 0, fontSize: 11, color: "rgba(0,0,0,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              Connecting
            </motion.p>
          )}
        </AnimatePresence>

        {/* Waveform bars + button */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <WaveformBars isSpeaking={isSpeaking} />

          <motion.button
            onClick={handleToggle}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.92 }}
            animate={
              isConnected
                ? { boxShadow: ["0 0 0 0px rgba(99, 102, 241, 0.35)", "0 0 0 14px rgba(99, 102, 241, 0)"] }
                : { boxShadow: "0 0 0 0px rgba(0,0,0,0)" }
            }
            transition={isConnected ? { duration: 1.6, repeat: Infinity } : { duration: 0.25 }}
            style={{
              width: 62,
              height: 62,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isActive ? "#6366F1" : "#2E2E2E",
              color: isActive ? "#FFFFFF" : "#808080",
              outline: "none",
              transition: "background 0.35s ease, color 0.35s ease",
            }}
            aria-label={isActive ? "Stop conversation" : "Start conversation"}
          >
            {isActive ? <StopIcon /> : <MicIcon />}
          </motion.button>

          <WaveformBars isSpeaking={isSpeaking} />
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <ConversationProvider>
      <LuminaApp />
    </ConversationProvider>
  );
}
