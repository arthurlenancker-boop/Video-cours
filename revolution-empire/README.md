# La Révolution française et l'Empire (1789-1814)

Vidéo explicative résumant le chapitre d'histoire : *La Révolution française et l'Empire — une nouvelle conception de la nation.*

**Problématique :** pourquoi 1789-1814 est une rupture majeure, et comment les représentants de la Nation ont-ils cherché à construire un régime politique stable ?

## Vidéo

| Fichier | Description |
|---|---|
| `revolution-et-empire-1789-1814.mp4` | **Vidéo finale** — approfondie (11 min 10), voix off clonée depuis le podcast de l'auteur via Voxtral TTS (`voxtral-mini-tts-3-0`, zero-shot cloning, rythme `[pace=fast]`), 115 segments « une idée = une animation = une phrase », 13 chapitres de moins de 90 s, sous-titres synchronisés. 1920×1080 · 30 fps |

## Structure de la vidéo

| Temps | Scène | Contenu |
|---|---|---|
| 0-34 s | Introduction | Problématique : rupture majeure et quête d'un régime stable ; 4 régimes en 25 ans |
| 34-78 s | 1789, fin de l'Ancien Régime | Société d'ordres, faillite, prise de la Bastille, nuit du 4 août, Déclaration des droits, la Nation souveraine |
| 78-126 s | 1790, les réformes | 84 départements, biens du clergé nationalisés, Constitution civile du clergé, serment, jureurs/réfractaires |
| 126-167 s | 1791, la Constitution | Monarchie constitutionnelle, suffrage censitaire, séparation des pouvoirs, veto |
| 167-232 s | 1791-92, vers la rupture | Varennes, Champ de Mars, guerre à l'Autriche, Brunswick, 10 août, Iᵌᵉ République |
| 232-288 s | 1792-93, la Convention | Girondins/Montagnards, procès et exécution de Louis XVI, Manon Roland, femmes sans droits |
| 288-336 s | 1793-94, la Terreur (1/2) | Coalition, Vendée, Comité de salut public, début de la Terreur, loi des suspects |
| 336-382 s | 1793-94, la Terreur (2/2) | Arrestations, 17 000 exécutions, Marie-Antoinette, chute de Robespierre |
| 380-428 s | 1795-99, le Directoire | 5 directeurs, suffrage censitaire, instabilité, Bonaparte, 18 Brumaire |
| 428-490 s | 1799-1804, le Consulat | 18 Brumaire, « La Révolution est finie », consul à vie, plébiscites, sacre de 1804 |
| 490-553 s | 1802-04, l'Empire se consolide | Régime autoritaire, masses de granit, Code civil, esclavage rétabli, Concordat |
| 550-631 s | 1805-15, le Grand Empire | Conscription, Austerlitz, 130 départements, 700 000 soldats, blocus continental, idéaux exportés, Waterloo |
| 631-669 s | Bilan | Souveraineté de la Nation, égalité devant la loi, 4 régimes instables — la France moderne est née |

## Notes techniques

- Rendu Remotion (composition frame-deterministic).
- Voix off générée avec **Voxtral TTS** (`voxtral-mini-tts-3-0`) : clonage zero-shot depuis un extrait du podcast de l'auteur. La narration est synthétisée **par blocs continus de scène** (prosodie naturelle), 115 phrases réparties dans 11 blocs.
- **Navigation** : barre de progression des 13 chapitres en haut de chaque chapitre (chapitre courant en bleu, passés en encre), question de chapitre affichée en haut à droite.
- **Illustrations** : une image générée par scène (style gravure de manuel scolaire, palette du projet), affichée à côté du mot-clé héros. L'image ne ré-apparaît pas à chaque idée : un seul fondu d'apparition par scène, elle reste fixe ensuite ; seul le mot-clé (élément porteur de sens) s'anime au changement d'idée.
- **Principes de la théorie cognitive de l'apprentissage multimédia (Mayer, Sweller)** appliqués : cohérence (aucun élément décoratif parasite), contiguïté temporelle (chaque mot-clé apparaît au moment de sa phrase, timing dérivé de `timing.json`) et spatiale (texte proche de l'image), signalisation (mot-clé en couleur sémantique — bleu = institutions/acquis, rouge = rupture/violence — et barre de chapitres toujours visible), segmenting (13 chapitres < 90 s avec titre et question), pré-entraînement (kicker + titre de chapitre), modalité (voix + visuel, texte à l'écran minimal, sous-titres discrets), narration par blocs continus de scène.
- Le timing des sous-titres, des héros et des scènes est dérivé des **durées réelles** de la voix (`src/timing.json`, reconstruit automatiquement) : l'animation, la phrase et le sous-titre apparaissent au même moment.
- Palette : papier `#F4EFE6` · encre `#1C1A17` · bleu `#21468B` · rouge `#A6231C` — à plat, sans dégradés ni ombres.
- Typographie : Playfair Display (titres) + Inter (texte).
