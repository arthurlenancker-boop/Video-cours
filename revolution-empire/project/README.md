# Projet Remotion — La Révolution et l'Empire

Source de `../v3-voix-elevenlabs.mp4` (et des versions précédentes). Permet de modifier le script, la voix ou le design puis de re-render.

## Structure

- `src/Explainer.tsx` — la composition (11 scènes / 13 chapitres < 90 s dérivés de `timing.json`, image fixe par scène, fondu croisé des idées, sous-titres discrets, voix off)
- `src/timing.json` — **source de vérité unique** : timings des sous-titres, bornes des scènes, durée totale. La durée de la composition (`src/Root.tsx`) en est dérivée.
- `public/narration.wav` — la voix off assemblée (44,1 kHz)
- `tts/` — génération de la voix off (ElevenLabs `eleven.py` pour la v3, ou Kokoro-ONNX `synth.py` en local) et calcul du timing

## Re-render

```bash
npm install
npx remotion render src/index.ts Explainer out/explainer.mp4
```

## Régénérer la voix off (optionnel)

Avec ElevenLabs (v3) — nécessite la variable d'environnement `ELEVENLABS_API_KEY` :

```bash
ELEVENLABS_API_KEY=... python3 tts/eleven.py   # un WAV par sous-titre (MP3 -> WAV via ffmpeg-static)
python3 tts/timeline.py    # narration.wav + timing.json
python3 tts/timeline2.py    # bornes de scènes séquentielles
# copier tts/timing.json -> src/timing.json (narration.wav est écrit directement dans public/)
```

Ou en local avec Kokoro-ONNX — nécessite `pip install kokoro-onnx` et les modèles `kokoro-v1.0.onnx` + `voices-v1.0.bin` dans `tts/` :

```bash
python3 tts/synth.py       # un WAV par sous-titre
python3 tts/timeline.py    # narration.wav + timing.json
python3 tts/timeline2.py    # bornes de scènes séquentielles
# copier tts/timing.json -> src/timing.json et tts/narration.wav -> public/
```

Le timing des sous-titres et des scènes est recalculé à partir des **durées réelles** de la voix : la narration, les coupes et les légendes restent synchronisées après toute modification du texte.
