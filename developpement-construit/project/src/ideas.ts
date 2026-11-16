export type Idea = { k: string; s?: string; c?: "ink" | "blue" | "red"; v?: string; w?: "key" | "epic" };

export const IDEAS: Idea[] = [
  { k: "Le développement construit", s: "Expliquer à Augustine un sujet, en paragraphes rédigés", c: "ink" },
  { k: "Augustine ne sait rien", s: "Des phrases complètes, dans un ordre logique", c: "blue", w: "key" },
  { k: "3 parties", s: "Introduction · Développement · Conclusion", c: "ink", v: "steps", w: "key" },

  { k: "Pourquoi la République\nest-elle proclamée en 1792 ?", s: "Lis la question, souligne les mots importants", c: "ink", v: "question", w: "epic" },
  { k: "République · proclamée · 1792", s: "Ces mots reviennent 3 fois : intro, développement, conclusion", c: "red" },
  { k: "La question = fil conducteur", s: "Garde-la sous les yeux", c: "blue", w: "key" },

  { k: "L'introduction", s: "Trois phrases, pas une de plus", c: "ink", w: "key" },
  { k: "1 · L'accroche", s: "\"En 1791, la France est une monarchie constitutionnelle\"", c: "blue", v: "intro3" },
  { k: "2 · La problématique", s: "\"Pourquoi la République est-elle proclamée en 1792 ?\" — les mots de l'énoncé", c: "blue", v: "intro3" },
  { k: "3 · Le plan", s: "\"Il sera tout d'abord question de..., puis de..., et enfin de...\"", c: "blue", v: "plan3", w: "key" },
  { k: "Accroche · Problématique · Plan", s: "Augustine sait où tu l'emmènes", c: "ink", v: "intro3" },

  { k: "Le développement", s: "Définitions du cours + exemples précis, selon le plan", c: "ink", v: "defex", w: "key" },
  { k: "§1 · La crise de la monarchie", s: "Monarchie constitutionnelle : le roi partage le pouvoir avec une assemblée élue", c: "blue" },
  { k: "Varennes, juin 1791", s: "Le roi fuit · le veto bloque tout · la confiance est brisée", c: "red" },
  { k: "Transition", s: "La monarchie discréditée, la guerre s'annonce", c: "ink" },

  { k: "§2 · La guerre", s: "La coalition : les royaumes européens contre la France — avril 1792, la guerre contre l'Autriche", c: "blue" },
  { k: "Manifeste de Brunswick", s: "Paris menacé, le peuple se radicalise", c: "red" },
  { k: "§3 · Le 10 août 1792", s: "Les Tuileries prises, la monarchie renversée", c: "red" },
  { k: "22 septembre 1792", s: "Une république : le pouvoir au peuple, par des représentants élus", c: "blue", w: "epic" },

  { k: "La conclusion", s: "Répondre à la question, selon le plan et le développement", c: "ink", w: "key" },
  { k: "Varennes · la guerre · le 10 août", s: "Discréditée, affaiblie, renversée : trois causes résumées", c: "red" },
  { k: "Rien de nouveau", s: "La conclusion ne fait que répondre", c: "red", w: "epic" },

  { k: "Introduction", s: "Accroche · Problématique · Plan", c: "blue", v: "intro3" },
  { k: "Développement puis conclusion", s: "Définitions + exemples selon le plan · puis la réponse, sans rien de nouveau", c: "blue", v: "defex" },
  { k: "À toi de jouer !", s: "Explique à Augustine, question sous les yeux", c: "red", w: "epic" },
];
