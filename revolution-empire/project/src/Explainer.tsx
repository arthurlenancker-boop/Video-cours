import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  Audio,
  Img,
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
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export const explainerSchema = z.object({
  captionsOnly: z.boolean(),
});

export const defaultProps = { captionsOnly: false };

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const fade = (x: number, a: number, b: number) =>
  interpolate(x, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ---------- Chapters (segmenting: every chapter < 90 s, split at cue boundaries) ----------
const MAX_CHAPTER_S = 89;

type Chapter = { id: string; label: string; start: number; dur: number; sceneId: string };

const SCENE_LABEL: Record<string, string> = {
  s0: "Intro", s1: "1789", s2: "1790", s3: "1791", s4: "Rupture", s5: "Convention",
  s6: "Terreur", s7: "Directoire", s8: "Empire", s9: "Armée", s10: "Bilan",
};
const CHAPTER_LABEL: Record<string, string> = {
  s6a: "Terreur 1", s6b: "Terreur 2", s8a: "Consulat", s8b: "Empire",
};

const deriveChapters = (): Chapter[] => {
  const out: Chapter[] = [];
  for (const s of scenes) {
    const scCues = cues.filter((c) => c.from >= s.start - 0.01 && c.from < s.start + s.dur);
    if (s.dur <= MAX_CHAPTER_S || scCues.length < 2) {
      out.push({ id: s.id, label: SCENE_LABEL[s.id] ?? s.id, start: s.start, dur: s.dur, sceneId: s.id });
      continue;
    }
    const n = Math.ceil(s.dur / MAX_CHAPTER_S);
    const bounds = [s.start];
    for (let k = 1; k < n; k++) {
      const target = s.start + (s.dur * k) / n;
      let best = scCues[0].from;
      for (const c of scCues) if (Math.abs(c.from - target) < Math.abs(best - target)) best = c.from;
      if (best > bounds[bounds.length - 1] + 1) bounds.push(best);
    }
    bounds.push(s.start + s.dur);
    for (let k = 0; k < bounds.length - 1; k++) {
      const id = `${s.id}${String.fromCharCode(97 + k)}`;
      out.push({
        id,
        label: CHAPTER_LABEL[id] ?? SCENE_LABEL[s.id] ?? s.id,
        start: bounds[k],
        dur: bounds[k + 1] - bounds[k],
        sceneId: s.id,
      });
    }
  }
  return out;
};
const CHAPTERS = deriveChapters();

const CHAPTER_META: Record<string, { kicker: string; title: string; q: string }> = {
  s0: { kicker: "Introduction", title: "Une nouvelle conception de la nation", q: "Pourquoi 1789-1814 est-elle une rupture majeure ?" },
  s1: { kicker: "1789 — La fin de l'Ancien Régime", title: "La Nation affirme sa souveraineté", q: "Comment la Nation prend-elle le pouvoir ?" },
  s2: { kicker: "1790 — Les réformes", title: "Réorganiser la France", q: "Quelles réformes réorganisent le pays ?" },
  s3: { kicker: "1791 — La Constitution", title: "Une monarchie constitutionnelle", q: "Cette monarchie peut-elle fonctionner ?" },
  s4: { kicker: "1791-1792 — Vers la rupture", title: "La Nation et son roi se brouillent", q: "Pourquoi la rupture avec le roi ?" },
  s5: { kicker: "1792-1793 — La Convention", title: "Une République divisée", q: "Une République divisée peut-elle tenir ?" },
  s6a: { kicker: "1793-1794 — La Terreur (1/2)", title: "La République assiégée", q: "Comment la République se défend-elle ?" },
  s6b: { kicker: "1793-1794 — La Terreur (2/2)", title: "La Terreur et sa chute", q: "Quel bilan de la Terreur ?" },
  s7: { kicker: "1795-1799 — Le Directoire", title: "Une république conservatrice", q: "Le Directoire peut-il stabiliser le pays ?" },
  s8a: { kicker: "1799-1804 — Le Consulat", title: "Bonaparte prend le pouvoir", q: "Comment Napoléon s'empare-t-il du pouvoir ?" },
  s8b: { kicker: "1802-1804 — L'Empire", title: "Un régime autoritaire qui consolide", q: "L'Empire consolide-t-il la Révolution ?" },
  s9: { kicker: "1805-1815 — Le Grand Empire", title: "L'Europe conquise et transformée", q: "Jusqu'où s'étend l'Empire ?" },
  s10: { kicker: "Bilan", title: "1789-1814, une rupture majeure", q: "La France a-t-elle trouvé son régime ?" },
};
const metaOf = (ch: Chapter) =>
  CHAPTER_META[ch.id] ?? CHAPTER_META[ch.sceneId] ?? { kicker: "", title: "", q: "" };

// ---------- Layout ----------
const HERO_TOP = 340;
const HERO_H = 430;
const IMG_X = 128;
const IMG_W = 620;
const IMG_H = 349;
const TXT_X = IMG_X + IMG_W + 64;

// ---------- Chrome: kicker, chapter question, title ----------
const Kicker: React.FC<{ local: number; text: string }> = ({ local, text }) => (
  <div style={{
    position: "absolute", top: 84, left: 128,
    fontFamily: SANS, fontSize: 26, fontWeight: 600,
    letterSpacing: 4, color: C.faint, textTransform: "uppercase",
    opacity: fade(local, 0, 0.5),
  }}>{text}</div>
);

const ChapterQuestion: React.FC<{ local: number; text: string }> = ({ local, text }) => (
  <div style={{
    position: "absolute", top: 88, right: 128, maxWidth: 720,
    fontFamily: SANS, fontSize: 24, fontWeight: 600,
    color: C.faint, textAlign: "right", lineHeight: 1.3,
    opacity: fade(local, 0, 0.5),
  }}>{text}</div>
);

const ChapterTitle: React.FC<{ local: number; text: string }> = ({ local, text }) => (
  <div style={{
    position: "absolute", top: 124, left: 128, right: 128,
    fontFamily: SERIF, fontSize: 52, fontWeight: 700, color: C.ink, lineHeight: 1.1,
    opacity: fade(local, 0.1, 0.7),
    translate: `0px ${interpolate(local, [0.1, 0.7], [20, 0], { easing: EASE, extrapolateRight: "clamp" })}px`,
  }}>{text}</div>
);

const colorOf = (c?: string) => (c === "blue" ? C.blue : c === "red" ? C.red : C.ink);

// ---------- Special hero visuals (animated per idea) ----------
const Bars: React.FC<{ p: number }> = ({ p }) => {
  const bars = [
    { label: "Clergé", w: 200, c: C.ink },
    { label: "Noblesse", w: 240, c: C.ink },
    { label: "Tiers état", w: 760, c: C.blue },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {bars.map((b, i) => (
        <div key={b.label} style={{
          display: "flex", alignItems: "center", gap: 24,
          opacity: fade(p, 0.1 + i * 0.15, 0.3 + i * 0.15),
          translate: `${interpolate(p, [0.1 + i * 0.15, 0.3 + i * 0.15], [-40, 0], { easing: EASE, extrapolateRight: "clamp" })}px 0px`,
        }}>
          <div style={{ width: b.w * fade(p, 0.1 + i * 0.15, 0.4 + i * 0.15), height: 48, background: b.c }} />
          <span style={{ fontFamily: SANS, fontSize: 30, fontWeight: 600, color: C.ink }}>{b.label}</span>
        </div>
      ))}
    </div>
  );
};

const Counter17k: React.FC<{ p: number }> = ({ p }) => {
  const n = Math.round(interpolate(p, [0.15, 0.75], [0, 17000], {
    easing: Easing.out(Easing.cubic), extrapolateRight: "clamp",
  })).toLocaleString("fr-FR");
  return (
    <div style={{ fontFamily: SERIF, fontSize: 96, fontWeight: 700, color: C.red, letterSpacing: 4 }}>
      {n} exécutions
    </div>
  );
};

const GraniteBlocks: React.FC<{ p: number; row: 0 | 1 }> = ({ p, row }) => {
  const rows = [
    ["1800 · Banque de France", "1801 · Concordat", "1802 · Lycées", "1802 · Légion d'honneur"],
    ["1803 · Franc germinal", "1804 · Code civil"],
  ];
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 980 }}>
      {rows[row].map((t, i) => (
        <div key={t} style={{
          background: row === 1 && i === 1 ? C.red : C.blue, color: C.paper,
          fontFamily: SANS, fontWeight: 600, fontSize: 28, padding: "14px 24px",
          opacity: fade(p, 0.1 + i * 0.12, 0.3 + i * 0.12),
          translate: `0px ${interpolate(p, [0.1 + i * 0.12, 0.3 + i * 0.12], [24, 0], { easing: EASE, extrapolateRight: "clamp" })}px`,
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
        scaleX: fade(p, 0.1 + i * 0.15, 0.4 + i * 0.15),
        transformOrigin: "left center",
      }} />
    ))}
  </div>
);

// ---------- Chapter navigation (always visible) ----------
const ChapterNav: React.FC<{ chapterIdx: number; local: number; dur: number }> = ({ chapterIdx, local, dur }) => {
  const progress = clamp01(local / Math.max(dur, 1));
  return (
    <div style={{
      position: "absolute", top: 232, left: 128, right: 128,
      display: "flex", gap: 6, alignItems: "flex-end",
      opacity: fade(local, 0, 0.4),
    }}>
      {CHAPTERS.map((ch, i) => {
        const state = i < chapterIdx ? "past" : i === chapterIdx ? "current" : "future";
        return (
          <div key={ch.id} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch" }}>
            <div style={{
              fontFamily: SANS, fontSize: 18, fontWeight: state === "current" ? 700 : 500,
              color: state === "future" ? C.faint : C.ink,
              textAlign: "center", letterSpacing: 0.5, whiteSpace: "nowrap",
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

// ---------- Scene illustration: one single fade-in per scene, then fixed ----------
const SceneImage: React.FC<{ sceneId: string; sceneLocal: number }> = ({ sceneId, sceneLocal }) => (
  <div style={{
    position: "absolute", left: IMG_X, top: HERO_TOP + (HERO_H - IMG_H) / 2,
    width: IMG_W, height: IMG_H,
    opacity: fade(sceneLocal, 0, 0.9),
  }}>
    <Img
      src={staticFile(`img/${sceneId}.jpg`)}
      style={{ width: IMG_W, height: IMG_H, objectFit: "cover", border: `4px solid ${C.ink}` }}
    />
  </div>
);

// ---------- Hero (one idea = one animation), crossfaded between cues ----------
const Hero: React.FC<{ cueIdx: number; t: number }> = ({ cueIdx, t }) => {
  const idea = IDEAS[cueIdx] ?? { k: "", s: "" };
  const c = cues[cueIdx];
  const nextFrom = cueIdx + 1 < cues.length ? cues[cueIdx + 1].from : Infinity;
  const aIn = fade(t - c.from, 0, 0.3);
  const aOut = t >= nextFrom ? 1 - fade(t - nextFrom, 0, 0.4) : 1;
  const alpha = aIn * aOut;
  if (alpha <= 0) return null;
  const p = clamp01((t - c.from) / 0.9);
  const color = colorOf(idea.c);
  const visual = idea.v;
  return (
    <div style={{
      position: "absolute", left: TXT_X, right: 128, top: HERO_TOP, height: HERO_H,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 24, textAlign: "center",
      opacity: alpha,
      translate: `0px ${interpolate(aIn, [0, 1], [24, 0], { easing: EASE, extrapolateRight: "clamp" })}px`,
    }}>
      {visual === "bars" && <Bars p={p} />}
      {visual === "counter" && <Counter17k p={p} />}
      {visual === "granite0" && <GraniteBlocks p={p} row={0} />}
      {visual === "granite1" && <GraniteBlocks p={p} row={1} />}
      {visual === "tricolor" && <Tricolor p={p} />}
      {visual !== "counter" && (
        <div style={{
          fontFamily: SERIF, fontWeight: 700, color, lineHeight: 1.05, maxWidth: 980,
          fontSize: idea.k.length > 22 ? 72 : idea.k.length > 14 ? 88 : 104,
        }}>{idea.k}</div>
      )}
      {idea.s && (
        <div style={{ fontFamily: SANS, fontSize: 32, color: C.faint, lineHeight: 1.4, maxWidth: 940 }}>
          {idea.s}
        </div>
      )}
    </div>
  );
};

// ---------- Trail of past ideas (badges, never removed abruptly) ----------
const Trail: React.FC<{ t: number }> = ({ t }) => {
  const ended = cues.map((c, i) => ({ c, i })).filter(({ c }) => c.to <= t);
  const items = ended.slice(-5);
  return (
    <div style={{
      position: "absolute", bottom: 252, left: 128, right: 128,
      display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap",
    }}>
      {items.map(({ i, c }) => (
        <div key={i} style={{
          fontFamily: SANS, fontSize: 22, fontWeight: 600, color: C.faint,
          border: `2px solid ${C.rule}`, padding: "6px 16px",
          opacity: fade(t - c.to, 0.1, 0.5),
        }}>{(IDEAS[i] ?? { k: "" }).k}</div>
      ))}
    </div>
  );
};

// ---------- Captions (discreet, for note-taking) ----------
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cue = cues.find((c) => t >= c.from && t <= c.to + 0.35);
  if (!cue) return null;
  return (
    <div style={{
      position: "absolute", bottom: 76, left: 0, right: 0,
      display: "flex", justifyContent: "center",
      opacity: clamp01((t - cue.from) / 0.2),
    }}>
      <div style={{
        background: "rgba(28, 26, 23, 0.85)", padding: "10px 24px",
        fontFamily: SANS, fontSize: 28, fontWeight: 600, color: C.paper,
        textAlign: "center", lineHeight: 1.4, maxWidth: 1400,
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
  const chapter = CHAPTERS.find((c) => t >= c.start && t < c.start + c.dur) ?? CHAPTERS[CHAPTERS.length - 1];
  const local = t - chapter.start;
  const chapterIdx = CHAPTERS.findIndex((c) => c.id === chapter.id);
  const scene = scenes.find((s) => s.id === chapter.sceneId) ?? scenes[0];
  const sceneLocal = t - scene.start;
  const meta = metaOf(chapter);
  const currentCueIdx = cues.reduce((acc, c, i) => (c.from <= t ? i : acc), -1);
  const heroIdxs = currentCueIdx >= 0 ? [currentCueIdx - 1, currentCueIdx].filter((i) => i >= 0) : [];
  return (
    <div style={{
      position: "absolute", inset: 0, background: C.paper,
      fontFamily: SANS, overflow: "hidden", color: C.ink,
    }}>
      <Audio src={staticFile("narration.wav")} />
      {!captionsOnly && (
        <>
          <Kicker local={local} text={meta.kicker} />
          <ChapterQuestion local={local} text={meta.q} />
          <ChapterTitle local={local} text={meta.title} />
          <ChapterNav chapterIdx={chapterIdx} local={local} dur={chapter.dur} />
          <SceneImage sceneId={chapter.sceneId} sceneLocal={sceneLocal} />
          {heroIdxs.map((i) => <Hero key={i} cueIdx={i} t={t} />)}
          <Trail t={t} />
        </>
      )}
      <Captions />
    </div>
  );
};
