import sys, json, wave, numpy as np
from kokoro_onnx import Kokoro

kokoro = Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")
cues = json.load(open("cues.json"))
for i, c in enumerate(cues):
    text = " ".join(c["lines"])
    audio, sr = kokoro.create(text, voice="ff_siwis", speed=1.0, lang="fr-fr")
    audio = np.clip(audio, -1, 1)
    pcm = (audio * 32767).astype(np.int16)
    with wave.open(f"cue-{i:02d}.wav", "w") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes(pcm.tobytes())
    print(i, f"{len(audio)/sr:.2f}s", text[:40])
