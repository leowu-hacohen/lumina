"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
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

const MODE_COLORS: Record<string, string> = {
  Lumina: "#000000",
  "The Scholar": "#3b82f6",
  "The Visionary": "#a855f7",
  "The Closer": "#f97316",
};

const TOOL_TO_AGENT: Record<string, string> = {
  transfer_to_scholar: "The Scholar",
  transfer_to_visionary: "The Visionary",
  transfer_to_closer: "The Closer",
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
  "The Scholar": {
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
  "The Visionary": {
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
            background: isSpeaking ? "rgba(123, 111, 160, 0.45)" : "rgba(0, 0, 0, 0.14)",
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

function LuminaApp({ agentName, setAgentName }: { agentName: string; setAgentName: (name: string) => void }) {
  // Resolve any tool-name-ish string to a specialist. Substring is intentional
  // so "transfer_to_scholar", "transfer_to_the_scholar", "scholar_v2" all hit.
  // Returns null if the string doesn't reference a specialist (we never want
  // tool events to push us back to "Lumina" mid-session).
  const resolveSpecialist = useCallback((raw: string): string | null => {
    if (!raw) return null;
    const direct = TOOL_TO_AGENT[raw];
    if (direct) return direct;
    const lower = raw.toLowerCase();
    if (lower.includes("scholar"))   return "The Scholar";
    if (lower.includes("visionary")) return "The Visionary";
    if (lower.includes("closer"))    return "The Closer";
    return null;
  }, []);

  const applyMode = useCallback((next: string, source: string) => {
    console.log(`[mode] ${source} → ${next}`);
    setAgentName(next);
  }, [setAgentName]);

  // PRIMARY: orchestrator-emitted event the moment the agent decides to transfer.
  // Always wins. No locks. Requires `agent_tool_request` to be enabled in the
  // agent's "Client Events" config in the ElevenLabs dashboard.
  const handleAgentToolRequest = useCallback((evt: { tool_name: string; tool_call_id: string }) => {
    console.log("[evt] agent_tool_request:", evt.tool_name);
    const next = resolveSpecialist(evt.tool_name);
    if (next) applyMode(next, `tool_request(${evt.tool_name})`);
  }, [resolveSpecialist, applyMode]);

  // PARALLEL: also fires after the transfer tool resolves. Same matching logic;
  // updating again is a no-op when the name already matches.
  const handleAgentToolResponse = useCallback((evt: { tool_name: string }) => {
    console.log("[evt] agent_tool_response:", evt.tool_name);
    const next = resolveSpecialist(evt.tool_name);
    if (next) applyMode(next, `tool_response(${evt.tool_name})`);
  }, [resolveSpecialist, applyMode]);

  // PARALLEL: covers the case where the transfer is implemented as a *client*
  // tool rather than a server-side agent tool.
  const handleUnhandledClientToolCall = useCallback((evt: { tool_name: string; parameters: Record<string, unknown> }) => {
    console.log("[evt] client_tool_call:", evt.tool_name, evt.parameters);
    const next = resolveSpecialist(evt.tool_name);
    if (next) applyMode(next, `client_tool(${evt.tool_name})`);
  }, [resolveSpecialist, applyMode]);

  // FALLBACK: transcript-based matching. Only checks the first ~80 chars so a
  // mid-response reference ("as the Scholar mentioned…") can't hijack the UI.
  // Never sets "Lumina", so it's safe to leave unlocked across specialist swaps.
  const handleMessage = useCallback((payload: { role: string; message: string }) => {
    if (payload.role !== "agent") return;
    const head = payload.message.slice(0, 80);
    const next = resolveSpecialist(head);
    if (next && next !== agentName) applyMode(next, "transcript");
  }, [resolveSpecialist, applyMode, agentName]);

  const conversationConfig = useMemo(
    () => ({
      onMessage: handleMessage,
      onAgentToolRequest: handleAgentToolRequest,
      onAgentToolResponse: handleAgentToolResponse,
      onUnhandledClientToolCall: handleUnhandledClientToolCall,
    }),
    [handleMessage, handleAgentToolRequest, handleAgentToolResponse, handleUnhandledClientToolCall],
  );

  const { startSession, endSession, isSpeaking, status } = useConversation(conversationConfig);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://api.fontshare.com/v2/css?f[]=general-sans@400,500&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    console.log("isSpeaking:", isSpeaking);
  }, [isSpeaking]);

  const isActive = status === "connected" || status === "connecting";
  const isConnected = status === "connected";
  const cfg = AGENTS[agentName] ?? AGENTS.Lumina;

  const handleToggle = async () => {
    if (isActive) {
      endSession();
      setAgentName("Lumina");
    } else {
      setAgentName("Lumina");
      await startSession({
        agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!,
      });
    }
  };

  return (
    <div className="relative h-screen w-full select-none overflow-hidden" style={{ background: "#FFFFFF", cursor: "none" }}>
      <CustomCursor />
      {/* Wordmark — DM Sans */}
      <header className="absolute top-0 left-0 p-8 z-10">
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 18, fontWeight: 500, letterSpacing: "0.01em", color: "#1A1A1A" }}>
            Lumina
          </span>
        </Link>
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
              padding: "6px 16px",
              borderRadius: 999,
              background: "rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.08)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              style={{
                fontFamily: "'General Sans', sans-serif",
                fontWeight: 600,
                fontSize: 11,
                color: MODE_COLORS[agentName] ?? "#000000",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                transition: "color 0.4s ease-in-out",
              }}
            >
              {agentName}
            </span>
          </motion.div>

          {/* Status line — fixed height prevents layout shift */}
          <div style={{ height: 18, marginTop: 10 }}>
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
                ? { boxShadow: ["0 8px 40px rgba(123,111,160,0.4), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 0 0px rgba(123,111,160,0.35)", "0 8px 40px rgba(123,111,160,0.4), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 0 14px rgba(123,111,160,0)"] }
                : { boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 0 0px rgba(0,0,0,0)" }
            }
            transition={isConnected ? { duration: 1.6, repeat: Infinity } : { duration: 0.25 }}
            style={{
              width: 62,
              height: 62,
              borderRadius: "50%",
              border: isActive ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.12)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isActive ? "rgba(240,235,255,0.25)" : "rgba(20,18,30,0.65)",
              backdropFilter: "blur(20px)",
              color: "#FFFFFF",
              outline: "none",
              position: "relative",
              overflow: "hidden",
              transition: "background 0.8s ease, border-color 0.8s ease",
            }}
            aria-label={isActive ? "Stop conversation" : "Start conversation"}
          >
            {/* Liquid glass blobs */}
            <motion.div
              animate={{ x: [-6,6,-4,6,-6], y: [-4,4,-6,4,-4], background: isActive ? "rgba(239,128,112,0.5)" : "rgba(180,60,80,0.6)" }}
              transition={{ x: { duration: 4, repeat: Infinity, ease: "easeInOut" }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" }, background: { duration: 0.8 } }}
              style={{ position: "absolute", width: 24, height: 24, borderRadius: "50%", filter: "blur(10px)", pointerEvents: "none", top: "20%", left: "15%" }}
            />
            <motion.div
              animate={{ x: [6,-6,4,-6,6], y: [4,-6,6,-4,4], background: isActive ? "rgba(180,150,230,0.5)" : "rgba(80,40,120,0.6)" }}
              transition={{ x: { duration: 5, repeat: Infinity, ease: "easeInOut" }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" }, background: { duration: 0.8 } }}
              style={{ position: "absolute", width: 20, height: 20, borderRadius: "50%", filter: "blur(8px)", pointerEvents: "none", bottom: "20%", right: "15%" }}
            />
            <motion.div
              animate={{ x: [-4,4,-6,4,-4], y: [6,-4,4,-6,6], background: isActive ? "rgba(106,168,226,0.45)" : "rgba(30,60,120,0.5)" }}
              transition={{ x: { duration: 6, repeat: Infinity, ease: "easeInOut" }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" }, background: { duration: 0.8 } }}
              style={{ position: "absolute", width: 18, height: 18, borderRadius: "50%", filter: "blur(8px)", pointerEvents: "none", top: "45%", right: "20%" }}
            />
            <span style={{ position: "relative", zIndex: 1, display: "flex", opacity: 0.9, color: "#FFFFFF" }}>
              {isActive ? <StopIcon /> : <MicIcon />}
            </span>
          </motion.button>

          <WaveformBars isSpeaking={isSpeaking} />
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  const [agentName, setAgentName] = useState("Lumina");
  return (
    <ConversationProvider>
      <LuminaApp agentName={agentName} setAgentName={setAgentName} />
    </ConversationProvider>
  );
}
