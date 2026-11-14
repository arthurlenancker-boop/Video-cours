---
name: video-cours-production
description: >-
  Production des vidéos de cours de ce dépôt (un dossier par cours : README.md + MP4 + project/ Remotion).
  À utiliser pour toute tâche qui crée, modifie ou re-rend une vidéo de cours : structure du dossier, script et storyboard,
  voix off TTS, synchronisation sous-titres/animations avec les durées réelles de la voix, rendu Remotion, QA frame par frame
  et chapitreage. Inclut les conseils animations IA de la vidéo de Yassine Sdiri (prompts structurés, storyboard d'abord,
  itération ciblée, animation par code plutôt que générative).
compatibility: >-
  Dépôt Video-cours. Rendu via Remotion (Node.js, npx remotion render) ; voix off via les scripts Python du dossier tts/
  du projet (Voxtral TTS ou Kokoro-ONNX).
metadata:
  author: arthurlenancker-boop
  source-video: "https://youtu.be/tvYFPGaIO9k"
  repo-doc: AGENTS.md
---

# Production de vidéos de cours

## Structure d'un cours

- `<nom-du-cours>/` à la racine du dépôt :
  - `README.md` — problématique, table des vidéos, structure de la vidéo (scènes horodatées), notes techniques
  - `<version>.mp4` — la vidéo rendue (ne garder que la version finale)
  - `project/` — source Remotion (`src/`, `tts/`, `public/narration.wav`)

## Workflow

1. **Script et storyboard d'abord** : une idée = une scène = une phrase. Faire émerger la séquence sous forme de scènes fixes avant toute animation.
2. **Voix off d'abord** : générer la narration segment par segment (Voxtral TTS, clonage zero-shot depuis un extrait de la voix de l'auteur, rythme `[pace=fast]`), assembler `public/narration.wav`, puis reconstruire le timing.
3. **Timing = source de vérité unique** : `python3 tts/timeline.py` puis `python3 tts/timeline2.py` produisent `timing.json` (sous-titres + bornes de scènes) à partir des **durées réelles** de la voix ; copier vers `src/timing.json`. Ne jamais hardcoder de durées : toute modification du texte doit être suivie d'une régénération du timing.
4. **Design** : palette papier `#F4EFE6` · encre `#1C1A17` · bleu `#21468B` · rouge `#A6231C`, à plat (pas de dégradés ni ombres) ; Playfair Display (titres) + Inter (texte) ; 1920×1080 · 30 fps.
5. **Rendu** : `npm install` puis `npx remotion render src/index.ts Explainer out/explainer.mp4` (rendu frame-deterministic).
6. **QA** : inspection frame par frame du master rendu, comparée au storyboard ; vérifier la synchronisation voix/sous-titres/animations ; renseigner le chapitreage horodaté dans le README.

## Conseils pour les animations générées par IA

Voir [references/conseils-animations-ia.md](references/conseils-animations-ia.md) : prompts structurés (sujet, action, décor, lumière, mouvement de caméra, style, beats horodatés), itération par corrections ciblées, animation par code (Remotion/HyperFrames) pour le contenu exact, vidéo générative (Higgsfield) réservée aux plans d'illustration.
