# Projet Remotion — La Révolution et l'Empire

Source de `../v2-style-papier-voix-off.mp4`. Permet de modifier le script, la voix ou le design puis de re-render.

## Structure

- `src/Explainer.tsx` — la composition (6 scènes, sous-titres, voix off)
- `src/timing.json` — **source de vérité unique** : timings des sous-titres, bornes des scènes, durée totale. La durée de la composition (`src/Root.tsx`) en est dérivée.
- `public/narration.wav` — la voix off assemblée (24 kHz)
- `tts/` — génération de la voix off (Kokoro-ONNX, voix française `ff_siwis`) et calcul du timing

## Re-render

```bash
npm install
npx remotion render src/index.ts Explainer out/explainer.mp4
```

## Régénérer la voix off (optionnel)

Nécessite `pip install kokoro-onnx` et les modèles `kokoro-v1.0.onnx` + `voices-v1.0.bin` dans `tts/` :

```bash
python3 tts/synth.py       # un WAV par sous-titre
python3 tts/timeline.py    # narration.wav + timing.json
python3 tts/timeline2.py    # bornes de scènes séquentielles
# copier tts/timing.json -> src/timing.json et tts/narration.wav -> public/
```

Le timing des sous-titres et des scènes est recalculé à partir des **durées réelles** de la voix : la narration, les coupes et les légendes restent synchronisées après toute modification du texte.
