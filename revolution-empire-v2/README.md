# La Révolution française et l'Empire (1789-1814) — v2

Seconde vidéo explicative du chapitre d'histoire : *La Révolution française et l'Empire — une nouvelle conception de la nation.* Conçue selon les principes d'apprentissage pour publics TND (TDAH / TSA) : une seule idée par écran, narration lente et continue, double codage audio + texte, chapitrage prévisible, animations douces sans stimulation excessive.

**Problématique :** pourquoi 1789-1814 est une rupture majeure, et comment les représentants de la Nation ont-ils cherché à construire un régime politique stable ?

## Vidéo

| Fichier | Description |
|---|---|
| `revolution-et-empire-1789-1814-v2.mp4` | **Vidéo finale** — 10 min 24, voix off clonée depuis le podcast de l'auteur via Voxtral TTS (`voxtral-mini-tts-3-0`, clonage zero-shot, `[emotion=calm][pace=slow]`), narration continue par blocs de scène, 95 idées « une idée = une animation = une phrase », sous-titres synchronisés. 1920×1080 · 30 fps |

## Chapitrage

| Temps | Chapitre | Contenu |
|---|---|---|
| 0:00 | Introduction | Problématique : rupture majeure, quête d'un régime stable ; 4 régimes en 25 ans |
| 0:48 | 1789 | Faillite, société d'ordres (Lumières), Assemblée nationale, Bastille, nuit du 4 août, DDHC, Nation souveraine |
| 1:46 | 1790 | 84 départements, biens du clergé, Constitution civile du clergé, serment, jureurs/réfractaires |
| 2:29 | 1791 | Monarchie constitutionnelle, cens, suffrage censitaire, séparation des pouvoirs, veto |
| 3:09 | Rupture | Varennes, Champ de Mars, guerre à l'Autriche (1792-1815), Brunswick, 10 août, Iʳᵉ République |
| 4:12 | Convention | Girondins/Montagnards, débat sur le procès, vote à une courte majorité, exécution de Louis XVI, Manon Roland |
| 5:16 | Terreur | Coalition, Vendée, Comité de salut public, mesures d'exception, loi des suspects, 17 000 exécutions, Marie-Antoinette, 9 Thermidor |
| 6:20 | Directoire | 5 directeurs, suffrage censitaire, élites contre peuple, Bonaparte, 18 Brumaire |
| 7:16 | Empire | Consulat, sacre 1804, régime autoritaire, masses de granit, Code civil, femmes mineures, esclavage rétabli, Concordat, plébiscites |
| 8:52 | Grande Armée | Conscription, 700 000 soldats, stratège (Machiavel, Guibert, César), Ulm/Austerlitz, 130 départements, états vassaux, idéaux exportés, blocus |
| 9:54 | Bilan | Nation souveraine, égalité devant la loi, 4 régimes instables, échec politique mais société transformée, la France moderne |

## Adaptations apprentissage TND

- **Une idée par écran** : chaque phrase de la narration a son mot-clé héros et sa propre animation — pas de double charge cognitive.
- **Narration lente et continue** : voix posée (`[pace=slow]`), prosodie naturelle par blocs de scène, pauses nettes entre chapitres (1,2 s).
- **Double codage** : chaque phrase est entendue (voix) ET lue (sous-titre synchronisé + mot-clé affiché).
- **Prévisibilité** : barre des 11 chapitres toujours visible en haut, progression continue, structure identique à chaque scène.
- **Répétition espacée** : fil des mots-clés précédents en bas d'écran (renforcement mnésique), récapitulatif au bilan.
- **Sobriété sensorielle** : palette plate apaisée (papier/encre), animations lentes et douces, aucun flash ni mouvement rapide.
- **Visuels de données** : société d'ordres (barres), vote de la mort du roi, compteurs animés (17 000 exécutions, 700 000 soldats, 130 départements), fiche Manon Roland, masses de granit.
- **Variation rythmique** : hiérarchie visuelle en trois niveaux pour éviter la monotonie du métronome « une idée = une animation » —
  - **5 moments épiques** en bandeau plein cadre inversé (Iʳᵉ République, exécution de Louis XVI, 17 000 exécutions, sacre de 1804, la France moderne) ;
  - **9 idées-pivots** encadrées (Varennes, 18 Brumaire, masses de granit…) ;
  - **filigrane géant de l'année** propre à chaque chapitre (signature visuelle, repère d'orientation).

## Notes techniques

- Rendu Remotion (composition frame-deterministic), `project/` contient la source complète.
- Voix off **Voxtral TTS** (`voxtral-mini-tts-3-0`) : clonage zero-shot depuis un extrait de 15 s de l'épisode podcast de l'auteur. La narration est synthétisée **par blocs continus de scène** (prosodie naturelle), puis les 95 frontières de phrases sont retrouvées par détection de silences (validées par la longueur des phrases).
- Le timing des sous-titres, des mots-clés et des scènes est dérivé des **durées réelles** de la voix (`src/timing.json`, reconstruit par `tts/timeline.py`) : jamais de durées codées en dur.
- Palette : papier `#F4EFE6` · encre `#1C1A17` · bleu `#21468B` · rouge `#A6231C` — à plat, sans dégradés ni ombres.
- Typographie : Playfair Display (titres) + Inter (texte).
