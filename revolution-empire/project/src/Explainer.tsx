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

const { cues, scenes, total } = timing as {
  cues: { from: number; to: number; lines: string[] }[];
  scenes: { id: string; start: number; dur: number }[];
  total: number;
};

// ---------- Style system (flat / editorial, locked) ----------
const C = {
  paper: "#F4EFE6",
  ink: "#1C1A17",
  blue: "#21468B",
  red: "#A6231C",
  faint: "#8C857A",
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
const p = (local: number, delay: number, dur = 16) =>
  clamp01((local - delay) / dur);
const fade = (local: number, delay: number, dur = 16) =>
  interpolate(p(local, delay, dur), [0, 1], [0, 1], { extrapolateRight: "clamp" });
const rise = (local: number, delay: number, px = 24, dur = 16) =>
  interpolate(p(local, delay, dur), [0, 1], [px, 0], {
    easing: EASE,
    extrapolateRight: "clamp",
  });

const Kicker: React.FC<{ local: number; text: string }> = ({ local, text }) => (
  <div style={{
    position: "absolute", top: 96, left: 128,
    fontFamily: SANS, fontSize: 26, fontWeight: 600,
    letterSpacing: 5, color: C.faint, textTransform: "uppercase",
    opacity: fade(local, 0), transform: `translateY(${rise(local, 0, 12)}px)`,
  }}>{text}</div>
);

const Rule: React.FC<{ local: number; top: number; delay: number }> = ({ local, top, delay }) => (
  <div style={{
    position: "absolute", top, left: 128, right: 128, height: 2, background: C.ink,
    transformOrigin: "left center",
    transform: `scaleX(${interpolate(p(local, delay, 30), [0, 1], [0, 1], { extrapolateRight: "clamp" })})`,
    opacity: fade(local, delay),
  }} />
);

const LABELS: Record<string, string> = {
  s1: "1789 — La fin de l'Ancien Régime",
  s2: "1791 — Monarchie constitutionnelle",
  s3: "1792 — La rupture et la République",
  s4: "1793-94 — La Terreur",
  s5: "1799-1814 — L'Empire",
  s6: "Bilan",
};

// ---------- Scenes ----------
const Scene1: React.FC<{ local: number }> = ({ local }) => {
  const orders = [
    { label: "Clergé", w: 200, c: C.ink },
    { label: "Noblesse", w: 240, c: C.ink },
    { label: "Tiers état", w: 720, c: C.blue },
  ];
  return (
    <div>
      <Kicker local={local} text={LABELS.s1} />
      <div style={{
        position: "absolute", top: 170, left: 128,
        fontFamily: SERIF, fontSize: 240, fontWeight: 700, color: C.ink,
        letterSpacing: -8, lineHeight: 1,
        opacity: fade(local, 5), transform: `translateY(${rise(local, 5, 40)}px)`,
      }}>1789</div>
      <div style={{ position: "absolute", top: 470, left: 128, display: "flex", flexDirection: "column", gap: 20 }}>
        {orders.map((o, i) => (
          <div key={o.label} style={{
            display: "flex", alignItems: "center", gap: 28,
            opacity: fade(local, 30 + i * 20),
            transform: `translateX(${rise(local, 30 + i * 20, 40)}px)`,
          }}>
            <div style={{ width: o.w, height: 56, background: o.c }} />
            <span style={{ fontFamily: SANS, fontSize: 32, fontWeight: 600, color: C.ink }}>{o.label}</span>
          </div>
        ))}
      </div>
      <div style={{
        position: "absolute", top: 200, right: 140,
        fontFamily: SANS, fontSize: 92, fontWeight: 800, color: C.red,
        border: `5px solid ${C.red}`, padding: "10px 30px", letterSpacing: 8,
        opacity: fade(local, 110),
        transform: `rotate(-10deg) scale(${interpolate(p(local, 110, 20), [0, 1], [1.5, 1], { easing: EASE, extrapolateRight: "clamp" })})`,
      }}>FAILLITE</div>
      <div style={{
        position: "absolute", bottom: 250, left: 128, right: 128,
        fontFamily: SERIF, fontSize: 56, fontWeight: 600, color: C.ink,
        opacity: fade(local, 200), transform: `translateY(${rise(local, 200, 30)}px)`,
      }}>
        La <span style={{ color: C.blue }}>Nation</span> s'empare de la souveraineté
      </div>
    </div>
  );
};

const Scene2: React.FC<{ local: number }> = ({ local }) => {
  const cells = [];
  for (let i = 0; i < 83; i++) cells.push(i);
  return (
    <div>
      <Kicker local={local} text={LABELS.s2} />
      <div style={{ position: "absolute", top: 190, left: 128 }}>
        <div style={{ fontFamily: SANS, fontSize: 30, color: C.faint, marginBottom: 24, opacity: fade(local, 0) }}>
          83 départements · biens du clergé nationalisés
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 30px)", gap: 10 }}>
          {cells.map((i) => {
            const d = 15 + (i % 12) * 1.5 + Math.floor(i / 12) * 4;
            return (
              <div key={i} style={{
                width: 20, height: 20, background: C.blue,
                opacity: fade(local, d, 5),
                transform: `scale(${interpolate(p(local, d, 7), [0, 1], [0.2, 1], { extrapolateRight: "clamp" })})`,
              }} />
            );
          })}
        </div>
      </div>
      <div style={{
        position: "absolute", top: 540, left: 128, right: 128,
        display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 96,
        opacity: fade(local, 150), transform: `translateY(${rise(local, 150, 40)}px)`,
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: SERIF, fontSize: 76, color: C.ink, lineHeight: 1 }}>Roi</div>
          <div style={{ fontFamily: SANS, fontSize: 26, color: C.faint, marginTop: 12 }}>exécutif · veto suspensif</div>
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 56, color: C.faint, paddingBottom: 20 }}>⇄</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: SERIF, fontSize: 56, color: C.ink, lineHeight: 1.05 }}>Assemblée<br />législative</div>
          <div style={{ fontFamily: SANS, fontSize: 26, color: C.faint, marginTop: 12 }}>propose, discute et vote les lois</div>
        </div>
      </div>
      <div style={{
        position: "absolute", bottom: 230, left: 0, right: 0, textAlign: "center",
        fontFamily: SERIF, fontSize: 46, fontWeight: 600, color: C.red,
        opacity: fade(local, 290), transform: `translateY(${rise(local, 290, 30)}px)`,
      }}>Suffrage censitaire masculin — la souveraineté est limitée</div>
    </div>
  );
};

const Scene3: React.FC<{ local: number }> = ({ local }) => {
  const events = [
    { d: "Juin 1791", t: "Varennes", c: C.ink },
    { d: "Avril 1792", t: "Guerre à l'Autriche", c: C.red },
    { d: "10 août 1792", t: "Prise des Tuileries", c: C.red },
    { d: "22 sept. 1792", t: "Iʳᵉ République", c: C.blue },
    { d: "21 janv. 1793", t: "Exécution de Louis XVI", c: C.red },
  ];
  return (
    <div>
      <Kicker local={local} text={LABELS.s3} />
      <Rule local={local} top={330} delay={10} />
      <div style={{ position: "absolute", top: 240, left: 128, right: 128, display: "flex", gap: 32 }}>
        {events.map((e, i) => {
          const d = 30 + i * 55;
          return (
            <div key={e.t} style={{ flex: 1, opacity: fade(local, d), transform: `translateY(${rise(local, d, 36)}px)` }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: e.c, margin: "74px 0 28px 0" }} />
              <div style={{ fontFamily: SANS, fontSize: 27, color: C.faint, marginBottom: 10, letterSpacing: 1 }}>{e.d}</div>
              <div style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 600, color: C.ink, lineHeight: 1.25 }}>{e.t}</div>
            </div>
          );
        })}
      </div>
      <div style={{
        position: "absolute", bottom: 240, left: 0, right: 0, textAlign: "center",
        fontFamily: SERIF, fontSize: 64, fontWeight: 700, color: C.ink,
        opacity: fade(local, 320), transform: `scale(${interpolate(p(local, 320, 20), [0, 1], [0.85, 1], { easing: EASE, extrapolateRight: "clamp" })})`,
      }}>
        La monarchie est <span style={{ color: C.red }}>finie</span>
      </div>
    </div>
  );
};

const Scene4: React.FC<{ local: number }> = ({ local }) => {
  const count = Math.round(interpolate(p(local, 120, 80), [0, 1], [0, 17000], {
    easing: Easing.out(Easing.cubic), extrapolateRight: "clamp",
  })).toLocaleString("fr-FR");
  return (
    <div>
      <Kicker local={local} text={LABELS.s4} />
      <div style={{
        position: "absolute", top: 200, left: 0, right: 0, textAlign: "center",
        fontFamily: SERIF, fontSize: 150, fontWeight: 700, color: C.red, letterSpacing: 14,
        opacity: fade(local, 5), transform: `scale(${interpolate(p(local, 5, 22), [0, 1], [1.35, 1], { easing: EASE, extrapolateRight: "clamp" })})`,
      }}>TERREUR</div>
      <div style={{
        position: "absolute", top: 420, left: 0, right: 0, textAlign: "center",
        fontFamily: SANS, fontSize: 30, color: C.faint, opacity: fade(local, 60),
      }}>Loi des suspects · prix maximum · levée en masse</div>
      <div style={{
        position: "absolute", top: 500, left: 0, right: 0, textAlign: "center",
        fontFamily: SERIF, fontSize: 104, fontWeight: 700, color: C.ink,
        opacity: fade(local, 115),
      }}>{count} exécutions</div>
      <div style={{
        position: "absolute", top: 650, left: 0, right: 0, textAlign: "center",
        fontFamily: SANS, fontSize: 34, color: C.ink, opacity: fade(local, 230),
        transform: `translateY(${rise(local, 230, 24)}px)`,
      }}>
        Robespierre exécuté en juillet 1794 — le <span style={{ color: C.blue, fontWeight: 700 }}>Directoire</span> vacille
      </div>
    </div>
  );
};

const Scene5: React.FC<{ local: number }> = ({ local }) => {
  const blocks = [
    { y: "1800", t: "Banque de France" },
    { y: "1801", t: "Concordat" },
    { y: "1802", t: "Lycées · Légion d'honneur" },
    { y: "1804", t: "Code civil" },
  ];
  return (
    <div>
      <Kicker local={local} text={LABELS.s5} />
      <div style={{
        position: "absolute", top: 180, left: 128,
        fontFamily: SERIF, fontSize: 56, fontWeight: 700, color: C.ink,
        opacity: fade(local, 0), transform: `translateY(${rise(local, 0, 36)}px)`,
      }}>
        18 Brumaire 1799 → <span style={{ color: C.blue }}>Empereur en 1804</span>
      </div>
      <div style={{ position: "absolute", top: 300, left: 128, display: "flex", flexDirection: "column-reverse", gap: 8 }}>
        {blocks.map((b, i) => {
          const d = 130 + i * 50;
          return (
            <div key={b.t} style={{
              background: i === 3 ? C.red : C.blue, color: C.paper,
              fontFamily: SANS, fontWeight: 600, fontSize: 32,
              padding: "20px 32px",
              opacity: fade(local, d), transform: `translateY(${rise(local, d, 40)}px)`,
            }}>
              <span style={{ opacity: 0.75, marginRight: 22 }}>{b.y}</span>{b.t}
            </div>
          );
        })}
      </div>
      <div style={{
        position: "absolute", top: 320, right: 128, width: 600,
        fontFamily: SANS, fontSize: 33, color: C.ink, lineHeight: 1.55,
        opacity: fade(local, 300), transform: `translateY(${rise(local, 300, 36)}px)`,
      }}>
        Régime <b style={{ color: C.red }}>autoritaire</b> : censure, police, noblesse d'Empire.
        <br />
        <span style={{ color: C.blue, fontWeight: 700 }}>Le Grand Empire exporte les idéaux de 1789</span> — égalité, Code civil — de l'Espagne à la Russie.
      </div>
    </div>
  );
};

const Scene6: React.FC<{ local: number }> = ({ local }) => (
  <div style={{
    position: "absolute", inset: 0,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36,
  }}>
    <div style={{ display: "flex", width: 840, height: 10 }}>
      <div style={{ flex: 1, background: C.blue }} />
      <div style={{ flex: 1, background: C.ink }} />
      <div style={{ flex: 1, background: C.red }} />
    </div>
    <div style={{
      fontFamily: SERIF, fontSize: 100, fontWeight: 700, color: C.ink, textAlign: "center",
      opacity: fade(local, 20), transform: `translateY(${rise(local, 20, 40)}px)`, lineHeight: 1.12,
    }}>
      1789-1814<br />une <span style={{ color: C.red }}>rupture majeure</span>
    </div>
    <div style={{
      fontFamily: SANS, fontSize: 36, color: C.faint, textAlign: "center", maxWidth: 1200,
      opacity: fade(local, 100), transform: `translateY(${rise(local, 100, 30)}px)`,
    }}>
      La souveraineté de la Nation et l'égalité devant la loi survivent à tous les régimes.
    </div>
    <div style={{
      fontFamily: SERIF, fontSize: 40, fontWeight: 700, color: C.blue, marginTop: 16,
      opacity: fade(local, 170), transform: `translateY(${rise(local, 170, 30)}px)`,
    }}>
      La France moderne est née.
    </div>
  </div>
);

// ---------- Captions ----------
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cue = cues.find((c) => t >= c.from && t <= c.to);
  if (!cue) return null;
  const inP = clamp01((t - cue.from) / 0.2);
  const outP = clamp01((cue.to - t) / 0.2);
  return (
    <div style={{
      position: "absolute", bottom: 88, left: 0, right: 0,
      display: "flex", justifyContent: "center",
      opacity: Math.min(inP, outP), transform: `translateY(${(1 - inP) * 12}px)`,
    }}>
      <div style={{
        background: C.ink, padding: "16px 34px",
        fontFamily: SANS, fontSize: 38, fontWeight: 600, color: C.paper,
        textAlign: "center", lineHeight: 1.35, maxWidth: 1400,
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
  const local = (t - scene.start) * fps;
  return (
    <div style={{
      position: "absolute", inset: 0, background: C.paper,
      backgroundImage: `linear-gradient(${C.rule} 1px, transparent 1px)`,
      backgroundSize: "100% 96px",
      fontFamily: SANS, overflow: "hidden", color: C.ink,
    }}>
      <Audio src={staticFile("narration.wav")} />
      {scene.id === "s1" && <Scene1 local={local} />}
      {scene.id === "s2" && <Scene2 local={local} />}
      {scene.id === "s3" && <Scene3 local={local} />}
      {scene.id === "s4" && <Scene4 local={local} />}
      {scene.id === "s5" && <Scene5 local={local} />}
      {scene.id === "s6" && <Scene6 local={local} />}
      {!captionsOnly && <Captions />}
    </div>
  );
};
