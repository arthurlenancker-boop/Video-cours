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
const Steps: React.FC<{ p: number }> = ({ p }) => {
  const items = [
    "Introduction",
    "Développement",
    "Conclusion",
  ];
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 1400 }}>
      {items.map((t, i) => (
        <div key={t} style={{
          background: i === 1 ? C.blue : C.ink, color: C.paper,
          fontFamily: SANS, fontWeight: 600, fontSize: 30, padding: "18px 30px",
          opacity: interpolate(p, [0.1 + i * 0.14, 0.4 + i * 0.14], [0, 1], { extrapolateRight: "clamp" }),
          translate: `0px ${interpolate(p, [0.1 + i * 0.14, 0.4 + i * 0.14], [24, 0], { easing: EASE, extrapolateRight: "clamp" })}px`,
        }}>{t}</div>
      ))}
    </div>
  );
};

const Intro3: React.FC<{ p: number }> = ({ p }) => {
  const rows = [
    { n: "1", label: "L'accroche", d: "le contexte, simplement", c: C.ink },
    { n: "2", label: "La problématique", d: "les mots de la question", c: C.blue },
    { n: "3", label: "Le plan", d: "tout d'abord... puis... et enfin...", c: C.red },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, width: 1150 }}>
      {rows.map((r, i) => (
        <div key={r.n} style={{
          display: "flex", alignItems: "center", gap: 20,
          opacity: interpolate(p, [0.1 + i * 0.15, 0.35 + i * 0.15], [0, 1], { extrapolateRight: "clamp" }),
          translate: `0px ${interpolate(p, [0.1 + i * 0.15, 0.35 + i * 0.15], [18, 0], { easing: EASE, extrapolateRight: "clamp" })}px`,
        }}>
          <div style={{ width: 54, height: 54, background: r.c, color: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 32, fontWeight: 700 }}>{r.n}</div>
          <div style={{ fontFamily: SANS, fontSize: 30, fontWeight: 700, color: r.c, minWidth: 340 }}>{r.label}</div>
          <div style={{ fontFamily: SANS, fontSize: 28, color: C.faint }}>{r.d}</div>
        </div>
      ))}
    </div>
  );
};

const Plan3: React.FC<{ p: number }> = ({ p }) => {
  const items = [
    "1. La crise de la monarchie",
    "2. La guerre",
    "3. Le 10 août 1792",
  ];
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 1500 }}>
      {items.map((t, i) => (
        <div key={t} style={{
          background: C.blue, color: C.paper,
          fontFamily: SANS, fontWeight: 600, fontSize: 28, padding: "16px 26px",
          opacity: interpolate(p, [0.1 + i * 0.14, 0.4 + i * 0.14], [0, 1], { extrapolateRight: "clamp" }),
          translate: `0px ${interpolate(p, [0.1 + i * 0.14, 0.4 + i * 0.14], [24, 0], { easing: EASE, extrapolateRight: "clamp" })}px`,
        }}>{t}</div>
      ))}
    </div>
  );
};

const DefEx: React.FC<{ p: number }> = ({ p }) => (
  <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
    {[
      { t: "Définition", d: "du cours", c: C.blue },
      { t: "Exemple", d: "précis, daté", c: C.red },
    ].map((x, i) => (
      <div key={x.t} style={{
        border: `4px solid ${x.c}`, padding: "26px 40px", background: C.paper,
        display: "flex", flexDirection: "column", gap: 8, alignItems: "center",
        opacity: interpolate(p, [0.1 + i * 0.2, 0.4 + i * 0.2], [0, 1], { extrapolateRight: "clamp" }),
        translate: `0px ${interpolate(p, [0.1 + i * 0.2, 0.4 + i * 0.2], [24, 0], { easing: EASE, extrapolateRight: "clamp" })}px`,
      }}>
        <div style={{ fontFamily: SERIF, fontSize: 46, fontWeight: 700, color: x.c }}>{x.t}</div>
        <div style={{ fontFamily: SANS, fontSize: 27, color: C.faint }}>{x.d}</div>
      </div>
    ))}
  </div>
);

const QuestionBox: React.FC<{ p: number }> = ({ p }) => (
  <div style={{
    border: `5px solid ${C.ink}`, padding: "40px 60px", background: C.paper,
    maxWidth: 1300,
    opacity: interpolate(p, [0.1, 0.5], [0, 1], { extrapolateRight: "clamp" }),
    translate: `0px ${interpolate(p, [0.1, 0.5], [24, 0], { easing: EASE, extrapolateRight: "clamp" })}px`,
  }}>
    <div style={{ fontFamily: SANS, fontSize: 26, fontWeight: 600, letterSpacing: 3, color: C.faint, textTransform: "uppercase", textAlign: "center", marginBottom: 18 }}>Sujet · troisième</div>
    <div style={{ fontFamily: SERIF, fontSize: 60, fontWeight: 700, color: C.ink, lineHeight: 1.2, textAlign: "center" }}>
      Pourquoi la République est-elle proclamée en France en 1792 ?
    </div>
  </div>
);

// ---------- Chapter navigation (predictability: always visible) ----------
const CHAPTERS: { id: string; label: string }[] = [
  { id: "s0", label: "La méthode" },
  { id: "s1", label: "La question" },
  { id: "s2", label: "Introduction" },
  { id: "s3", label: "Dév. §1" },
  { id: "s4", label: "Dév. §2-3" },
  { id: "s5", label: "Conclusion" },
  { id: "s6", label: "Récap" },
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

// ---------- Chapter ghost word (visual signature per chapter) ----------
const GhostWord: React.FC<{ local: number; word?: string }> = ({ local, word }) => {
  if (!word) return null;
  return (
    <div style={{
      position: "absolute", top: 400, left: 0, right: 0,
      display: "flex", justifyContent: "center",
      opacity: interpolate(local, [0.4, 1.4], [0, 0.16], { extrapolateRight: "clamp" }),
      fontFamily: SERIF, fontSize: 380, fontWeight: 700, color: C.ink,
      letterSpacing: 12, userSelect: "none", whiteSpace: "nowrap",
    }}>{word}</div>
  );
};

// ---------- Hero (one idea = one animation) ----------
const Hero: React.FC<{ cueIdx: number; local: number; cueFrom: number }> = ({ cueIdx, local, cueFrom }) => {
  const idea = IDEAS[cueIdx] ?? { k: "" };
  const p = clamp01((local - cueFrom) / 1.1);
  const color = colorOf(idea.c);
  const visual = idea.v;
  const weight = idea.w;

  if (weight === "epic") {
    const fade = clamp01((local - cueFrom) / 1.6);
    return (
      <div style={{
        position: "absolute", top: 330, left: 0, right: 0, bottom: 220,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 34,
        background: color,
        scaleY: interpolate(fade, [0, 1], [0.6, 1], { easing: EASE }),
        opacity: fade,
      }}>
        {visual === "question" ? (
          <div style={{ border: `5px solid ${C.paper}`, padding: "40px 60px", maxWidth: 1350 }}>
            <div style={{ fontFamily: SANS, fontSize: 26, fontWeight: 600, letterSpacing: 3, color: C.paper, textTransform: "uppercase", textAlign: "center", marginBottom: 18, opacity: 0.85 }}>Sujet · troisième</div>
            <div style={{ fontFamily: SERIF, fontSize: 62, fontWeight: 700, color: C.paper, lineHeight: 1.2, textAlign: "center" }}>
              Pourquoi la République est-elle proclamée en France en 1792 ?
            </div>
          </div>
        ) : (
          <div style={{
            fontFamily: SERIF, fontWeight: 700, color: C.paper, lineHeight: 1.05, textAlign: "center", whiteSpace: "pre-line",
            fontSize: idea.k.length > 22 ? 96 : idea.k.length > 14 ? 118 : 140,
          }}>{idea.k}</div>
        )}
        {idea.s && (
          <div style={{ fontFamily: SANS, fontSize: 36, color: C.paper, lineHeight: 1.4, maxWidth: 1150, textAlign: "center", opacity: interpolate(fade, [0.4, 1], [0, 0.95], { extrapolateRight: "clamp" }) }}>
            {idea.s}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      position: "absolute", top: 330, left: 128, right: 128,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 30,
      opacity: interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
      translate: `0px ${interpolate(p, [0, 0.6], [24, 0], { easing: EASE, extrapolateRight: "clamp" })}px`,
    }}>
      {visual === "steps" && <Steps p={p} />}
      {visual === "intro3" && <Intro3 p={p} />}
      {visual === "plan3" && <Plan3 p={p} />}
      {visual === "defex" && <DefEx p={p} />}
      {visual === "question" && <QuestionBox p={p} />}
      {visual !== "question" && (
        <div style={{
          fontFamily: SERIF, fontWeight: 700, color, lineHeight: 1.05, textAlign: "center", whiteSpace: "pre-line",
          fontSize: idea.k.length > 22 ? 74 : idea.k.length > 14 ? 90 : 108,
        }}>{idea.k}</div>
      )}
      {idea.s && (
        <div style={{ fontFamily: SANS, fontSize: 34, color: C.faint, lineHeight: 1.4, maxWidth: 1250, textAlign: "center" }}>
          {idea.s}
        </div>
      )}
      {weight === "key" && (
        <div style={{
          position: "absolute", top: -34, bottom: -34, left: -44, right: -44,
          border: `4px solid ${C.rule}`, pointerEvents: "none",
          opacity: interpolate(p, [0.2, 0.7], [0, 1], { extrapolateRight: "clamp" }),
        }} />
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
        }}>{idea.k.split("\n")[0]}</div>
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
          <GhostWord local={local} word={title.ghost} />
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

const SCENE_TITLES: Record<string, { kicker: string; title: string; ghost?: string }> = {
  s0: { kicker: "Méthode · Histoire troisième", title: "Le développement construit", ghost: "Méthode" },
  s1: { kicker: "Étape 0 — Lire la question", title: "La question, ton fil conducteur", ghost: "Question" },
  s2: { kicker: "Étape 1 — L'introduction", title: "Trois phrases, pas une de plus", ghost: "Intro" },
  s3: { kicker: "Étape 2 — Le développement", title: "§1 : suivre le plan, définir, illustrer", ghost: "Dév" },
  s4: { kicker: "Étape 2 — Le développement (suite)", title: "§2 et §3 : la guerre, puis le 10 août", ghost: "Dév" },
  s5: { kicker: "Étape 3 — La conclusion", title: "Répondre à la question", ghost: "Conclusion" },
  s6: { kicker: "Récapitulatif", title: "La méthode complète", ghost: "Récap" },
};
