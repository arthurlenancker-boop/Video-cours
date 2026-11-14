# La Révolution française et l'Empire (1789-1814) — v2

Seconde vidéo explicative du chapitre d'histoire : *La Révolution française et l'Empire — une nouvelle conception de la nation.* Cette version est conçue selon les principes d'apprentissage pour publics TND (TDAH / TSA) : une seule idée par écran, narration lente et continue, double codage audio + texte, chapitrage prévisible, animations douces sans stimulation excessive.

**Problématique :** pourquoi 1789-1814 est une rupture majeure, et comment les représentants de la Nation ont-ils cherché à construire un régime politique stable ?

## Vidéo

| Fichier | Description |
|---|---|
| `revolution-et-empire-1789-1814-v2.mp4` | **Vidéo finale** — 7 min 13, voix off clonée depuis le podcast de l'auteur via Voxtral TTS (`voxtral-mini-tts-3-0`, clonage zero-shot, `[emotion=calm][pace=slow]`), narration continue par blocs de scène, 58 idées « une idée = une animation = une phrase », sous-titres synchronisés. 1920×1080 · 30 fps |

## Chapitrage

| Temps | Chapitre | Contenu |
|---|---|---|
| 0:00 | Introduction | Problématique : rupture majeure, quête d'un régime stable ; 4 régimes en 25 ans |
| 0:35 | 1789 | Faillite, Assemblée nationale, Bastille, nuit du 4 août, DDHC, Nation souveraine |
| 1:14 | 1790 | 84 départements, biens du clergé, Constitution civile du clergé, jureurs/réfractaires |
| 1:48 | 1791 | Monarchie constitutionnelle, suffrage censitaire, séparation des pouvoirs, veto |
| 2:21 | Rupture | Varennes, Champ de Mars, guerre à l'Autriche, Brunswick, 10 août, Iʳᵉ République |
| 3:06 | Convention | Girondins/Montagnards, procès et exécution de Louis XVI, Manon Roland |
| 3:40 | Terreur | Coalition, Vendée, Comité de salut public, loi des suspects, 17 000 exécutions, 9 Thermidor |
| 4:30 | Directoire | 5 directeurs, suffrage censitaire, instabilité, 18 Brumaire |
| 5:09 | Empire | Sacre 1804, régime autoritaire, masses de granit, Code civil, Concordat, plébiscites |
| 6:08 | Grande Armée | Conscription, Ulm/Austerlitz, 130 départements, idéaux exportés, blocus |
| 6:48 | Bilan | Nation souveraine, égalité devant la loi, 4 régimes instables, la France moderne |

## Adaptations apprentissage TND

- **Une idée par écran** : chaque phrase de la narration a son mot-clé héros et sa propre animation — pas de double charge cognitive.
- **Narration lente et continue** : voix posée (`[pace=slow]`), prosodie naturelle par blocs de scène, pauses nettes entre chapitres (1,2 s).
- **Double codage** : chaque phrase est entendue (voix) ET lue (sous-titre synchronisé + mot-clé affiché).
- **Prévisibilité** : barre des 11 chapitres toujours visible en haut, progression continue, structure identique à chaque scène.
- **Répétition espacée** : fil des mots-clés précédents en bas d'écran (renforcement mnésique), récapitulatif au bilan.
- **Sobriété sensorielle** : palette plate apaisée (papier/encre), animations lentes et douces, aucun flash ni mouvement rapide.

## Notes techniques

- Rendu Remotion (composition frame-deterministic), `project/` contient la source complète.
- Voix off **Voxtral TTS** (`voxtral-mini-tts-3-0`) : clonage zero-shot depuis un extrait de 15 s de l'épisode podcast de l'auteur. La narration est synthétisée **par blocs continus de scène** (prosodie naturelle), puis les 58 frontières de phrases sont retrouvées par détection de silences (validées par la longueur des phrases).
- Le timing des sous-titres, des mots-clés et des scènes est dérivé des **durées réelles** de la voix (`src/timing.json`, reconstruit par `tts/timeline.py`) : jamais de durées codées en dur.
- Palette : papier `#F4EFE6` · encre `#1C1A17` · bleu `#21468B` · rouge `#A6231C` — à plat, sans dégradés ni ombres.
- Typographie : Playfair Display (titres) + Inter (texte).
