import json
d = json.load(open("timing.json"))
cues = d["cues"]
GAP, total = 0.45, d["total"]
scene_groups = [(0, 2, "s1"), (3, 5, "s2"), (6, 8, "s3"), (9, 11, "s4"), (12, 14, "s5"), (15, 16, "s6")]
ends = []
for a, b, sid in scene_groups:
    ends.append(cues[b]["to"] + GAP if b < len(cues) - 1 else total)
scenes = []
prev = 0.0
for (a, b, sid), e in zip(scene_groups, ends):
    scenes.append({"id": sid, "start": round(prev, 2), "dur": round(e - prev, 2)})
    prev = e
d["scenes"] = scenes
json.dump(d, open("timing.json", "w"), ensure_ascii=False, indent=1)
print(json.dumps(scenes, ensure_ascii=False))
