"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

function Navbar() {
  const scrollRef = useRef<number>(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        padding: scrolled ? "16px max(16px, 2vw)" : "0",
        transition: "padding 0.35s ease",
      }}
    >
      <nav
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
        <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 17, fontWeight: 500, letterSpacing: "0.04em", color: "#111" }}>
            Lumina
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <Link href="/#agents" style={{ fontSize: 14, fontWeight: 500, color: "rgba(0,0,0,0.7)", textDecoration: "none", whiteSpace: "nowrap" }}>
            How it works
          </Link>
          <Link href="/#problem" style={{ fontSize: 14, fontWeight: 500, color: "rgba(0,0,0,0.7)", textDecoration: "none", whiteSpace: "nowrap" }}>
            The problem
          </Link>
          <Link
            href="/lumina"
            style={{
              fontSize: 13, fontWeight: 500, color: "#fff",
              background: "#111", padding: "7px 16px",
              borderRadius: 999, textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Try Lumina
          </Link>
        </div>
      </nav>
    </div>
  );
}

function DemoOrb() {
  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", position: "relative", flexShrink: 0, boxShadow: "0 8px 28px rgba(155,115,215,0.2)" }}
    >
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, #EDD5C3 0%, #D5BCE8 55%, #BBCFEA 100%)" }} />
      <motion.div
        animate={{ x: [0, 22, -16, 12, 0], y: [0, -16, 22, -12, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", width: "75%", height: "75%", top: "-10%", left: "-10%", background: "#EF8070", filter: "blur(14px)", borderRadius: "50%" }}
      />
      <motion.div
        animate={{ x: [0, -20, 14, -10, 0], y: [0, 20, -14, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", width: "68%", height: "68%", top: "-8%", right: "-8%", background: "#A472D8", filter: "blur(12px)", borderRadius: "50%" }}
      />
      <motion.div
        animate={{ x: [0, 16, -22, 10, 0], y: [0, 22, -12, -18, 0] }}
        transition={{ duration: 6.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", width: "62%", height: "62%", bottom: "-8%", right: "-8%", background: "#6AA8E2", filter: "blur(12px)", borderRadius: "50%" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 34% 27%, rgba(255,255,255,0.38) 0%, transparent 52%)" }} />
    </motion.div>
  );
}

export default function DemoPage() {
  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "80px 32px" }}>
        <DemoOrb />

        <h1
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "clamp(48px, 6vw, 72px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            color: "#111",
            margin: 0,
            textAlign: "center",
          }}
        >
          Coming soon.
        </h1>

        <p style={{ fontSize: 18, color: "rgba(0,0,0,0.5)", lineHeight: 1.55, maxWidth: 460, textAlign: "center", margin: 0 }}>
          Enjoy the site for now, and feel free to reach out if you have any questions.
        </p>

        <a
          href="mailto:leowuhacohen@gmail.com"
          style={{
            display: "inline-flex", alignItems: "center",
            height: 48, padding: "0 22px", borderRadius: 10,
            background: "transparent", color: "#1A1A1A",
            border: "1px solid rgba(0,0,0,0.16)",
            fontSize: 15, fontWeight: 500, letterSpacing: "0.01em",
            textDecoration: "none",
          }}
        >
          Get in touch
        </a>

        <Link href="/" style={{ fontSize: 14, color: "rgba(0,0,0,0.4)", textDecoration: "none", letterSpacing: "0.01em" }}>
          ← Back to Lumina
        </Link>
      </div>
    </div>
  );
}
