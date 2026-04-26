/**
 * Generates static MP3 previews for the three Lumina agents.
 * Run once: node scripts/generate-audio.mjs
 * Requires ELEVENLABS_API_KEY in your environment (or .env.local).
 *
 * Output: public/audio/scholar.mp3, closer.mp3, visionary.mp3
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local manually if present
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
}

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error("❌  ELEVENLABS_API_KEY is not set.");
  process.exit(1);
}

const AGENTS = [
  {
    file: "scholar.mp3",
    voiceId: "MClEFoImJXBTgLwdLI5n",
    text: "Hi, I'm the Scholar. I can help you synthesize your research and connect the dots between your classes and your career goals.",
  },
  {
    file: "visionary.mp3",
    voiceId: "7EzWGsX10sAS4c9m9cPf",
    text: "I'm the Visionary. Let's think big about your product trajectory and map out your long-term path to the industry.",
  },
  {
    file: "closer.mp3",
    voiceId: "QngvLQR8bsLR5bzoa6Vv",
    text: "I'm the Closer. Let's get these deliverables across the finish line and perfect your applications.",
  },
];

const OUT_DIR = path.resolve(__dirname, "../public/audio");
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const agent of AGENTS) {
  console.log(`Generating ${agent.file}...`);
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${agent.voiceId}/stream`,
    {
      method: "POST",
      headers: { "xi-api-key": API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        text: agent.text,
        model_id: "eleven_flash_v2_5",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  );

  if (!res.ok) {
    console.error(`  ❌  Failed (${res.status}): ${await res.text()}`);
    continue;
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(path.join(OUT_DIR, agent.file), buffer);
  console.log(`  ✓  Saved public/audio/${agent.file}`);
}

console.log("\nDone. Static audio files are ready in public/audio/.");
