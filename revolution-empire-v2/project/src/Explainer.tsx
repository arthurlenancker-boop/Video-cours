import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  Audio,
  staticFile,
} from "remotion";
import { z } from "zod";
import timing from "./timing.json";
import { IDEAS } from "./ideas";

const { cues, scenes } = timing as {
  cues: { from: number; to: number; lines: string[] }[];
  scenes: { id: string; start: number; dur: number }[];
};

// ---------- Style system (flat / editorial, locked) ----------
const C = {
  paper: "#F4EFE6",
  ink: "#1C1A17",
  blue: "#21468B",
  red: "#A6231C",
  faint: "#6E6659",
  rule: "#D8D1C2",
};
const SERIF = '"Playfair Display", Georgia, serif';
const SANS = '"Inter", "Helvetica Neue", Arial, sans-serif';
// Slow, gentle easing: no fast movement or flashing (sensory-friendly)
const EASE = Easing.bezier(0.25, 0.8, 0.25, 1);

export const explainerSchema = z.object({
  captionsOnly: z.boolean(),
});

export const defaultProps = { captionsOnly: false };

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

const Kicker: React.FC<{ local: number; text: string }> = ({ local, text }) => (
  <div style={{
    position: "absolute", top: 88, left: 128,
    fontFamily: SANS, fontSize: 28, fontWeight: 600,
    letterSpacing: 4, color: C.faint, textTransform: "uppercase",
    opacity: interpolate(local, [0, 0.9], [0, 1], { extrapolateRight: "clamp" }),
  }}>{text}</div>
);

const SceneTitle: React.FC<{ local: number; text: string }> = ({ local, text }) => (
  <div style={{
    position: "absolute", top: 128, left: 128, right: 128,
    fontFamily: SERIF, fontSize: 56, fontWeight: 700, color: C.ink, lineHeight: 1.1,
    opacity: interpolate(local, [0.15, 1.0], [0, 1], { extrapolateRight: "clamp" }),
    translate: `0px ${interpolate(local, [0.15, 1.0], [20, 0], { easing: EASE, extrapolateRight: "clamp" })}px`,
  }}>{text}</div>
);

const colorOf = (c?: string) => (c === "blue" ? C.blue : c === "red" ? C.red : C.ink);

// ---------- Special hero visuals ----------
const Regimes: React.FC<{ p: number }> = ({ p }) => {
  const items = [
    "Monarchie constitutionnelle",
    "République",
    "Directoire",
    "Empire",
  ];
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 1400 }}>
      {items.map((t, i) => (
        <div key={t} style={{
          background: C.blue, color: C.paper,
          fontFamily: SANS, fontWeight: 600, fontSize: 27, padding: "14px 24px",
          opacity: interpolate(p, [0.1 + i * 0.14, 0.4 + i * 0.14], [0, 1], { extrapolateRight: "clamp" }),
          translate: `0px ${interpolate(p, [0.1 + i * 0.14, 0.4 + i * 0.14], [24, 0], { easing: EASE, extrapolateRight: "clamp" })}px`,
        }}>{t}</div>
      ))}
    </div>
  );
};

const Orders: React.FC<{ p: number }> = ({ p }) => {
  const orders = [
    { label: "Clergé", w: 180 },
    { label: "Noblesse", w: 240 },
    { label: "Tiers état", w: 760 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {orders.map((o, i) => (
        <div key={o.label} style={{
          display: "flex", alignItems: "center", gap: 22,
          opacity: interpolate(p, [0.1 + i * 0.15, 0.35 + i * 0.15], [0, 1], { extrapolateRight: "clamp" }),
          translate: `${interpolate(p, [0.1 + i * 0.15, 0.35 + i * 0.15], [-40, 0], { easing: EASE, extrapolateRight: "clamp" })}px 0px`,
        }}>
          <div style={{ width: o.w * interpolate(p, [0.1 + i * 0.15, 0.45 + i * 0.15], [0, 1], { extrapolateRight: "clamp" }), height: 42, background: i === 2 ? C.blue : C.ink }} />
          <span style={{ fontFamily: SANS, fontSize: 28, fontWeight: 600, color: C.ink }}>{o.label}</span>
        </div>
      ))}
    </div>
  );
};

const BigCounter: React.FC<{ p: number; to: number; label: string }> = ({ p, to, label }) => {
  const n = Math.round(interpolate(p, [0.15, 0.85], [0, to], {
    easing: Easing.out(Easing.cubic), extrapolateRight: "clamp",
  })).toLocaleString("fr-FR");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
      <div style={{ fontFamily: SERIF, fontSize: 96, fontWeight: 700, color: C.red, letterSpacing: 4 }}>{n}</div>
      <div style={{ fontFamily: SANS, fontSize: 34, fontWeight: 600, color: C.ink }}>{label}</div>
    </div>
  );
};

const Vote: React.FC<{ p: number }> = ({ p }) => {
  const pour = 0.62;
  const w = interpolate(p, [0.15, 0.75], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, width: 1100 }}>
      <div style={{ display: "flex", height: 64, border: `4px solid ${C.ink}` }}>
        <div style={{ width: `${pour * w * 100}%`, background: C.red }} />
        <div style={{ width: `${(1 - pour) * w * 100}%`, background: C.paper }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 28, fontWeight: 600, color: C.ink }}>
        <span style={{ color: C.red }}>La mort — courte majorité</span>
        <span style={{ color: C.faint }}>Contre</span>
      </div>
    </div>
  );
};

const Manon: React.FC<{ p: number }> = ({ p }) => {
  const rows = [
    "1754 — née Manon Philipon, éduquée par les Lumières",
    "Salonnière des Girondins — Brissot, Robespierre",
    "Plume : pensées politiques signées du couple",
    "8 novembre 1793 — guillotinée",
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, border: `4px solid ${C.ink}`, padding: "26px 34px", background: C.paper, maxWidth: 1200 }}>
      {rows.map((r, i) => (
        <div key={r} style={{
          fontFamily: SANS, fontSize: 29, fontWeight: 600, color: i === 3 ? C.red : C.ink,
          opacity: interpolate(p, [0.1 + i * 0.13, 0.35 + i * 0.13], [0, 1], { extrapolateRight: "clamp" }),
          translate: `0px ${interpolate(p, [0.1 + i * 0.13, 0.35 + i * 0.13], [18, 0], { easing: EASE, extrapolateRight: "clamp" })}px`,
        }}>{r}</div>
      ))}
    </div>
  );
};

const GraniteBlocks: React.FC<{ p: number; row: 0 | 1 }> = ({ p, row }) => {
  const rows = [
    ["1800 · Banque de France", "1802 · Lycées", "1802 · Légion d'honneur", "1803 · Franc germinal"],
    ["1801 · Concordat", "1804 · Code civil"],
  ];
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
      {rows[row].map((t, i) => (
        <div key={t} style={{
          background: row === 1 && i === 1 ? C.red : C.blue, color: C.paper,
          fontFamily: SANS, fontWeight: 600, fontSize: 28, padding: "14px 24px",
          opacity: interpolate(p, [0.1 + i * 0.12, 0.35 + i * 0.12], [0, 1], { extrapolateRight: "clamp" }),
          translate: `0px ${interpolate(p, [0.1 + i * 0.12, 0.35 + i * 0.12], [24, 0], { easing: EASE, extrapolateRight: "clamp" })}px`,
        }}>{t}</div>
      ))}
    </div>
  );
};

const Tricolor: React.FC<{ p: number }> = ({ p }) => (
  <div style={{ display: "flex", width: 840, height: 10 }}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{
        flex: 1,
        background: i === 0 ? C.blue : i === 1 ? C.ink : C.red,
        scaleX: interpolate(p, [0.1 + i * 0.15, 0.5 + i * 0.15], [0, 1], { extrapolateRight: "clamp" }),
        transformOrigin: "left center",
      }} />
    ))}
  </div>
);

// ---------- Chapter navigation (predictability: always visible) ----------
const CHAPTERS: { id: string; label: string }[] = [
  { id: "s0", label: "Intro" },
  { id: "s1", label: "1789" },
  { id: "s2", label: "1790" },
  { id: "s3", label: "1791" },
  { id: "s4", label: "Rupture" },
  { id: "s5", label: "Convention" },
  { id: "s6", label: "Terreur" },
  { id: "s7", label: "Directoire" },
  { id: "s8", label: "Empire" },
  { id: "s9", label: "Grande Armée" },
  { id: "s10", label: "Bilan" },
];

const ChapterNav: React.FC<{ sceneIdx: number; local: number; sceneDur: number }> = ({ sceneIdx, local, sceneDur }) => {
  const progress = interpolate(local, [0, Math.max(sceneDur, 1)], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", top: 248, left: 128, right: 128,
      display: "flex", gap: 6, alignItems: "flex-end",
      opacity: interpolate(local, [0, 0.6], [0, 1], { extrapolateRight: "clamp" }),
    }}>
      {CHAPTERS.map((ch, i) => {
        const state = i < sceneIdx ? "past" : i === sceneIdx ? "current" : "future";
        return (
          <div key={ch.id} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch" }}>
            <div style={{
              fontFamily: SANS, fontSize: 19, fontWeight: state === "current" ? 700 : 500,
              color: state === "current" ? C.ink : C.faint,
              textAlign: "center", letterSpacing: 1,
              opacity: state === "future" ? 0.55 : 1,
            }}>{ch.label}</div>
            <div style={{
              height: 8,
              background: state === "past" ? C.ink : state === "current" ? C.blue : C.rule,
              scaleX: state === "current" ? progress : 1,
              transformOrigin: "left center",
            }} />
          </div>
        );
      })}
    </div>
  );
};

// ---------- Hero (one idea = one animation) ----------
const Hero: React.FC<{ cueIdx: number; local: number; cueFrom: number }> = ({ cueIdx, local, cueFrom }) => {
  const idea = IDEAS[cueIdx] ?? { k: "" };
  const p = clamp01((local - cueFrom) / 1.1);
  const color = colorOf(idea.c);
  const visual = idea.v;
  return (
    <div style={{
      position: "absolute", top: 330, left: 128, right: 128,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 30,
      opacity: interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
      translate: `0px ${interpolate(p, [0, 0.6], [24, 0], { easing: EASE, extrapolateRight: "clamp" })}px`,
    }}>
      {visual === "regimes" && <Regimes p={p} />}
      {visual === "orders" && <Orders p={p} />}
      {visual === "counter" && <BigCounter p={p} to={17000} label="exécutions après procès" />}
      {visual === "counter700" && <BigCounter p={p} to={700000} label="soldats en 1812" />}
      {visual === "counter130" && <BigCounter p={p} to={130} label="départements en 1811" />}
      {visual === "vote" && <Vote p={p} />}
      {visual === "manon" && <Manon p={p} />}
      {visual === "granite0" && <GraniteBlocks p={p} row={0} />}
      {visual === "granite1" && <GraniteBlocks p={p} row={1} />}
      {visual === "tricolor" && <Tricolor p={p} />}
      {visual !== "counter" && visual !== "counter700" && visual !== "counter130" && (
        <div style={{
          fontFamily: SERIF, fontWeight: 700, color, lineHeight: 1.05, textAlign: "center",
          fontSize: idea.k.length > 22 ? 74 : idea.k.length > 14 ? 90 : 108,
        }}>{idea.k}</div>
      )}
      {idea.s && (
        <div style={{ fontFamily: SANS, fontSize: 34, color: C.faint, lineHeight: 1.4, maxWidth: 1150, textAlign: "center" }}>
          {idea.s}
        </div>
      )}
    </div>
  );
};

// ---------- Trail of previous ideas (memory reinforcement) ----------
const Trail: React.FC<{ items: { idx: number; from: number }[]; local: number }> = ({ items, local }) => (
  <div style={{
    position: "absolute", bottom: 240, left: 128, right: 128,
    display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap",
  }}>
    {items.map(({ idx, from }, i) => {
      const idea = IDEAS[idx] ?? { k: "" };
      const age = items.length - 1 - i;
      return (
        <div key={idx} style={{
          fontFamily: SANS, fontSize: 24, fontWeight: 600, color: C.faint,
          border: `2px solid ${C.rule}`, padding: "8px 18px",
          opacity: interpolate(local, [from, from + 0.5], [0, 1], { extrapolateRight: "clamp" }) *
            interpolate(age, [0, 2, 4], [1, 0.55, 0.3], { extrapolateRight: "clamp" }),
        }}>{idea.k}</div>
      );
    })}
  </div>
);

// ---------- Captions (dual coding: audio + synchronized text) ----------
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cue = cues.find((c) => t >= c.from && t <= c.to + 0.35);
  if (!cue) return null;
  const inP = clamp01((t - cue.from) / 0.3);
  return (
    <div style={{
      position: "absolute", bottom: 88, left: 0, right: 0,
      display: "flex", justifyContent: "center",
      opacity: inP,
    }}>
      <div style={{
        background: C.ink, padding: "14px 30px",
        fontFamily: SANS, fontSize: 34, fontWeight: 600, color: C.paper,
        textAlign: "center", lineHeight: 1.4, maxWidth: 1560,
      }}>
        {cue.lines.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
};

// ---------- Main ----------
export const Explainer: React.FC<z.infer<typeof explainerSchema>> = ({ captionsOnly }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scene = scenes.find((s) => t >= s.start && t < s.start + s.dur) ?? scenes[scenes.length - 1];
  const local = t - scene.start;
  const sceneCues = cues
    .map((c, i) => ({ c, i }))
    .filter(({ c }) => c.from >= scene.start - 0.01 && c.from < scene.start + scene.dur);
  const currentIdx = sceneCues.filter(({ c }) => c.from <= t).length - 1;
  const current = currentIdx >= 0 ? sceneCues[currentIdx] : null;
  const sceneIdx = scenes.findIndex((s) => s.id === scene.id);
  const trailItems = sceneCues.slice(Math.max(0, currentIdx - 5), currentIdx).map(({ i, c }) => ({ idx: i, from: c.from - scene.start }));
  const title = SCENE_TITLES[scene.id] ?? { kicker: "", title: "" };
  return (
    <div style={{
      position: "absolute", inset: 0, background: C.paper,
      backgroundImage: `linear-gradient(${C.rule} 1px, transparent 1px)`,
      backgroundSize: "100% 96px",
      fontFamily: SANS, overflow: "hidden", color: C.ink,
    }}>
      <Audio src={staticFile("narration.wav")} />
      {!captionsOnly && (
        <>
          <Kicker local={local} text={title.kicker} />
          <SceneTitle local={local} text={title.title} />
          <ChapterNav sceneIdx={sceneIdx} local={local} sceneDur={scene.dur} />
          {current && <Hero cueIdx={current.i} local={local} cueFrom={current.c.from - scene.start} />}
          <Trail items={trailItems} local={local} />
        </>
      )}
      <Captions />
    </div>
  );
};

const SCENE_TITLES: Record<string, { kicker: string; title: string }> = {
  s0: { kicker: "Introduction", title: "Une nouvelle conception de la nation" },
  s1: { kicker: "1789 — La fin de l'Ancien Régime", title: "La Nation affirme sa souveraineté" },
  s2: { kicker: "1790 — Les réformes", title: "Réorganiser la France" },
  s3: { kicker: "1791 — La Constitution", title: "Une monarchie constitutionnelle" },
  s4: { kicker: "1791-1792 — Vers la rupture", title: "La Nation et son roi se brouillent" },
  s5: { kicker: "1792-1793 — La Convention", title: "Une République divisée" },
  s6: { kicker: "1793-1794 — La Terreur", title: "La République de la peur" },
  s7: { kicker: "1795-1799 — Le Directoire", title: "Une république conservatrice" },
  s8: { kicker: "1799-1804 — Consulat et Empire", title: "Napoléon Bonaparte" },
  s9: { kicker: "1805-1811 — Le Grand Empire", title: "L'Europe conquise et transformée" },
  s10: { kicker: "Bilan", title: "1789-1814, une rupture majeure" },
};
