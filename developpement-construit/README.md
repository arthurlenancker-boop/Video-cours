# Le développement construit en histoire (3e) — méthode

Vidéo explicative de **méthode** : comment rédiger un développement construit en histoire en troisième. Conçue selon les principes d'apprentissage pour publics TND (TDAH / TSA), avec la consigne de l'énoncé : *« tu dois expliquer à Augustine un sujet »*.

**Sujet d'exemple fil rouge :** pourquoi la République est-elle proclamée en France en 1792 ? (chapitre Révolution et Empire)

## Contenu de la méthode

| Partie | Règle |
|---|---|
| Introduction (3 phrases) | 1. **Accroche** : donner le contexte simplement · 2. **Problématique** : reprendre les mots de la question · 3. **Plan** : « il sera tout d'abord question de..., puis de..., et enfin de... » |
| Développement | Selon le plan : **définitions du cours + exemples précis**, un paragraphe par partie |
| Conclusion | Répondre à la question **selon le plan et le développement**, sans information nouvelle |

## Vidéo

| Fichier | Description |
|---|---|
| `developpement-construit-methode.mp4` | Vidéo finale (à produire une fois la voix off générée) |

## Chapitrage

| Temps | Chapitre | Contenu |
|---|---|---|
| 0:00 | La méthode | Expliquer à Augustine · 3 parties (intro, développement, conclusion) |
| — | La question | Lire l'énoncé, souligner les mots clés, question fil conducteur |
| — | Introduction | Accroche / problématique / plan, avec l'exemple 1792 |
| — | Développement §1 | Crise de la monarchie : définitions (monarchie constitutionnelle, veto) + Varennes |
| — | Développement §2-3 | La guerre (coalition, Brunswick) · le 10 août · République proclamée |
| — | Conclusion | Répondre selon le plan, trois causes, rien de nouveau |
| — | Récap | La méthode complète, à toi de jouer |

(Les horodatages exacts seront dérivés des durées réelles de la voix : `src/timing.json`.)

## Adaptations apprentissage TND (TDAH / TSA)

- **Blocs naturels, pas de métronome** : la narration est découpée en blocs de 2-3 phrases courtes par concept (prosodie continue), et non plus « une idée = une phrase » — moins de charge cognitive, plus de respiration.
- **Une concept = un écran** : chaque bloc a son mot-clé héros et son animation propre, le fil des concepts précédents reste visible en bas d'écran.
- **Double codage** : chaque bloc est entendu (voix) ET lu (sous-titre synchronisé + mot-clé affiché).
- **Prévisibilité** : barre des 7 chapitres toujours visible en haut, progression continue, structure identique à chaque scène.
- **Sobriété sensorielle** : palette plate apaisée (papier/encre), animations lentes, aucun flash.

## Notes techniques

- Rendu Remotion (composition frame-deterministic), `project/` contient la source complète.
- **Voix off Voxtral TTS** (`voxtral-mini-tts-3-0`) : la référence de clonage demandée est la voix de la vidéo YouTube « Ce Métier a un Taux de Survie de 0,002 % » — **en attente de l'audio** (téléchargement YouTube bloqué depuis l'environnement de production). Workflow une fois l'audio fourni (`ref.wav`, 15-30 s, locuteur unique) :
  ```bash
  cd project
  MISTRAL_API_KEY=... REF_VOICE=/chemin/ref.wav python3 tts/synth.py   # un bloc wav par scène
  python3 tts/timeline.py                                              # → public/narration.wav + src/timing.json
  npx remotion render src/index.ts Explainer ../developpement-construit-methode.mp4
  ```
- Le timing des sous-titres, des mots-clés et des scènes est dérivé des **durées réelles** de la voix (`src/timing.json`, reconstruit par `tts/timeline.py`) : jamais de durées codées en dur.
- Palette : papier `#F4EFE6` · encre `#1C1A17` · bleu `#21468B` · rouge `#A6231C` — à plat, sans dégradés ni ombres.
- Typographie : Playfair Display (titres) + Inter (texte). 1920×1080 · 30 fps.
