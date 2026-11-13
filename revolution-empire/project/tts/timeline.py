import json, wave, numpy as np

cues = json.load(open("cues.json"))
auds, srs = [], []
for i in range(len(cues)):
    with wave.open(f"cue-{i:02d}.wav") as w:
        srs.append(w.getframerate())
        auds.append(np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32767)
sr = srs[0]
assert all(s == sr for s in srs)

GAP, LEAD = 0.45, 0.55
t, timing = LEAD, []
for i, (a, c) in enumerate(zip(auds, cues)):
    dur = len(a) / sr
    timing.append({"from": round(t, 2), "to": round(t + dur, 2), "lines": c["lines"]})
    t += dur + GAP
total = t + 0.8

buf = np.zeros(int(total * sr), dtype=np.float32)
for cue, a in zip(timing, auds):
    start = int(cue["from"] * sr)
    buf[start:start + len(a)] += a
buf = np.clip(buf / max(1.0, np.max(np.abs(buf)) * 1.05), -1, 1)

import os
os.makedirs("../public", exist_ok=True)
with wave.open("../public/narration.wav", "w") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((buf * 32767).astype(np.int16).tobytes())

# scene boundaries: cue index -> scene
scene_groups = [(0, 2, "s1"), (3, 5, "s2"), (6, 8, "s3"), (9, 11, "s4"), (12, 14, "s5"), (15, 16, "s6")]
scenes = []
for a, b, sid in scene_groups:
    start = timing[a]["from"] - LEAD + 0.05
    end = (timing[b]["to"] + GAP if b < len(timing) - 1 else total - 0.4)
    scenes.append({"id": sid, "start": round(start, 2), "dur": round(end - start, 2)})

json.dump({"cues": timing, "scenes": scenes, "total": round(total, 2), "fps": 30},
          open("timing.json", "w"), ensure_ascii=False, indent=1)
print(json.dumps(scenes, ensure_ascii=False))
print("total", round(total, 2), "s")
