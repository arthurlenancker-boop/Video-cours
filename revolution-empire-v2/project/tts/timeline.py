import json, os, re, subprocess, wave
import numpy as np

FF = os.environ.get("FFMPEG", "/tmp/node_modules/ffmpeg-static/ffmpeg")
HERE = os.path.dirname(os.path.abspath(__file__))
cues = json.load(open(os.path.join(HERE, "cues.json")))

# Manual boundary overrides (seconds within a scene block) when silence
# detection picks a wrong gap. Key: scene id, value: list of cut positions
# overriding the automatic ones.
MANUAL_CUTS = {
    "s3": [5.74, 12.79, 19.11, 22.08],
    "s5": [3.63, 7.66, 12.67, 24.19],
    "s8": [8.45, 17.36, 26.74, 33.96, 41.25, 51.48],
}

scenes = []
for c in cues:
    if not scenes or scenes[-1]["id"] != c["scene"]:
        scenes.append({"id": c["scene"], "cues": []})
    scenes[-1]["cues"].append(c)

def silences(path, thr, dur):
    out = subprocess.run(
        [FF, "-i", path, "-af", f"silencedetect=noise={thr}dB:d={dur}", "-f", "null", "-"],
        capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", out)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", out)]
    return list(zip(starts, ends))

def split_scene(path, n):
    want = n - 1
    best = None
    for thr in (-45, -42, -40, -38, -36):
        for d in (0.3, 0.25, 0.2, 0.15):
            s = silences(path, thr, d)
            if len(s) < want:
                continue
            gaps = sorted(s, key=lambda g: g[1] - g[0], reverse=True)[:want]
            gaps.sort()
            mids = [(a + b) / 2 for a, b in gaps]
            span = sum(b - a for a, b in gaps)
            if best is None or span > best[1]:
                best = (mids, span)
    if best is None:
        raise RuntimeError(f"{path}: cannot find {want} sentence gaps")
    return best[0]

LEAD = 0.6
SCENE_GAP = 1.2
CUE_TAIL = 0.15

auds, srs = [], []
for s in scenes:
    with wave.open(os.path.join(HERE, f"block-{s['id']}.wav")) as w:
        srs.append(w.getframerate())
        auds.append(np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32767)
sr = srs[0]
assert all(x == sr for x in srs)

t = LEAD
timing, scene_meta = [], []
for s, a in zip(scenes, auds):
    dur = len(a) / sr
    cuts = MANUAL_CUTS.get(s["id"]) or split_scene(os.path.join(HERE, f"block-{s['id']}.wav"), len(s["cues"]))
    cuts = [0.0] + cuts + [dur]
    start = t
    for i, c in enumerate(s["cues"]):
        f, to = t + cuts[i], t + cuts[i + 1]
        timing.append({"from": round(f, 2), "to": round(to - CUE_TAIL, 2), "lines": [c["text"]]})
    t += dur
    scene_meta.append({"id": s["id"], "start": round(start - 0.25, 2), "dur": round(dur + 0.5, 2)})
    t += SCENE_GAP
total = t - SCENE_GAP + 1.4

buf = np.zeros(int(total * sr), dtype=np.float32)
pos = LEAD
for a in auds:
    i = int(pos * sr)
    buf[i:i + len(a)] += a
    pos += len(a) / sr + SCENE_GAP
peak = np.max(np.abs(buf))
if peak > 0.95:
    buf = buf / peak * 0.95

os.makedirs(os.path.join(HERE, "..", "public"), exist_ok=True)
with wave.open(os.path.join(HERE, "..", "public", "narration.wav"), "w") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((buf * 32767).astype(np.int16).tobytes())

json.dump({"cues": timing, "scenes": scene_meta, "total": round(total, 2), "fps": 30},
          open(os.path.join(HERE, "..", "src", "timing.json"), "w"), ensure_ascii=False, indent=1)
print("total", round(total, 1), "s,", len(timing), "cues")
