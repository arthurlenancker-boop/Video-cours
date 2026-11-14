# Conseils animations IA

Source : [« Comment créer des animations INCROYABLES avec l'IA » — Yassine Sdiri](https://youtu.be/tvYFPGaIO9k) (5 animations réalisées avec NotebookLM, Claude Design + HyperFrames, Higgsfield et ChatGPT Astra).

## Règles générales

1. **Storyboard d'abord** : faire émerger la séquence sous forme de scènes fixes (une idée = une scène = une phrase) avant toute génération ou animation.
2. **Prompts structurés** : sujet, action, décor, lumière, mouvement de caméra, style, format et durée ; découper en beats horodatés (« plan 1, 0–4 s : … »).
3. **Voix d'abord, synchro ensuite** : générer la voix off, extraire sa transcription horodatée, puis dériver les timings des sous-titres et des animations des durées réelles de la voix — chaque élément visuel apparaît au moment exact où il est prononcé.
4. **Sous-titres synchronisés** obligatoires sur toutes les vidéos.
5. **Chapitrage horodaté** de la vidéo (titres de chapitres dans la description).
6. **Itérer par corrections ciblées** — une valeur absolue à la fois (durée, position, taille) — et ne jamais re-générer aveuglément en espérant un meilleur résultat.
7. **Animation par code privilégiée** (Remotion, déjà utilisé dans ce dépôt ; HyperFrames en alternative) pour tout contenu exact — texte, chiffres, charte graphique : rendu déterministe, frame-exact, modifiable élément par élément. Réserver la vidéo générative (type Higgsfield) aux plans d'illustration ou d'ambiance.
8. **QA frame par frame** sur le master rendu, comparé au brief et au storyboard — une preview séduisante n'est pas un rendu fiable.

## Choix d'outil selon le besoin

| Besoin | Outil |
|---|---|
| Vidéo explicative à partir de documents (cours) | NotebookLM (styles tableau blanc, aquarelle, papier découpé, anime) |
| Motion design fidèle à une charte graphique | Claude Design + HyperFrames (code animé → MP4) |
| Plans illustratifs / cinématiques, contrôle caméra | Higgsfield (image-to-video, text-to-video) |
| Contenu exact du cours (texte, chiffres, timings) | Remotion dans ce dépôt (frame-deterministic) |
