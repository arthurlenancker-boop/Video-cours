import json, os, sys, urllib.request, wave

API_KEY = os.environ["ELEVENLABS_API_KEY"]
VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"
URL = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}?output_format=mp3_44100"
SR = 44100

cues = json.load(open("cues.json"))
for i, c in enumerate(cues):
    text = " ".join(c["lines"])
    body = json.dumps({
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.0, "use_speaker_boost": True},
    }).encode()
    req = urllib.request.Request(URL, data=body, method="POST", headers={
        "xi-api-key": API_KEY, "Content-Type": "application/json", "Accept": "audio/*",
    })
    for attempt in range(3):
        try:
            pcm = urllib.request.urlopen(req, timeout=120).read()
            break
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 2:
                import time; time.sleep(5 * (attempt + 1)); continue
            raise
    open(f"cue-{i:02d}.mp3", "wb").write(pcm)
    print(i, len(pcm), text[:50], flush=True)
