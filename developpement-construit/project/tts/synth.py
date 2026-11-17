import base64, json, os, time, urllib.request, urllib.error

API_KEY = os.environ["MISTRAL_API_KEY"]
REF = os.environ.get("REF_VOICE", "/tmp/ref15.wav")

with open(REF, "rb") as f:
    ref_b64 = base64.b64encode(f.read()).decode()

cues = json.load(open(os.path.join(os.path.dirname(__file__), "cues.json")))
scenes = []
for c in cues:
    if not scenes or scenes[-1]["id"] != c["scene"]:
        scenes.append({"id": c["scene"], "texts": []})
    scenes[-1]["texts"].append(c["text"])

def synth(text, sid):
    body = json.dumps({
        "model": "voxtral-mini-tts-3-0",
        "input": f"[emotion=calm][pace=slow]{text}",
        "ref_audio": ref_b64,
        "expressiveness": 2.0,
        "response_format": "wav",
    }).encode()
    req = urllib.request.Request(
        "https://api.mistral.ai/v1/audio/speech",
        data=body, method="POST",
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
    )
    for attempt in range(5):
        try:
            resp = json.load(urllib.request.urlopen(req, timeout=300))
            return base64.b64decode(resp["audio_data"])
        except urllib.error.HTTPError as e:
            err = e.read().decode()[:300]
            print(sid, "HTTP", e.code, err, flush=True)
            if e.code in (429, 500, 502, 503) and attempt < 4:
                time.sleep(8 * (attempt + 1)); continue
            raise
    raise RuntimeError(sid)

for s in scenes:
    out = f"block-{s['id']}.wav"
    if os.path.exists(out) and os.path.getsize(out) > 10000:
        print(s["id"], "cached", flush=True); continue
    text = " ".join(s["texts"])
    data = synth(text, s["id"])
    open(out, "wb").write(data)
    print(s["id"], len(data), len(s["texts"]), "sentences", flush=True)
print("done")
