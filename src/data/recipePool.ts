import type { Meal } from '../types'

/**
 * Pool de recettes additionnelles piochées par le bouton 🎲 Régénérer (voir DayTab.tsx), en plus
 * des recettes des 7 autres jours de MENUS. N'affecte ni la rotation par défaut (MENUS[getDay()]),
 * ni la liste de courses — uniquement la variété proposée quand on régénère un repas.
 * `name` sert d'étiquette pour l'attribution ("régénéré, {name}") affichée dans l'onglet Jour.
 */
export interface PoolRecipe {
  name: string
  meal: Omit<Meal, 'id'>
}

export const RECIPE_POOL_B: PoolRecipe[] = [
  {
    name: 'porridge pomme-cannelle',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 810,
      p: 36,
      items: ['80 g avoine', '300 ml lait de soja', '1 pomme', '1 c. à c. cannelle', '20 g amandes'],
      steps: ['Fais chauffer l’avoine dans le lait de soja 3-4 min avec la cannelle.', 'Coupe la pomme en dés, ajoute-la en fin de cuisson pour qu’elle reste croquante.', 'Sers avec les amandes concassées par-dessus.'],
    },
  },
  {
    name: 'omelette champignons',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 800,
      p: 40,
      items: ['4 œufs', '100 g champignons', '80 g pain complet', '1 orange'],
      steps: ['Poêle les champignons émincés 4-5 min à feu vif jusqu’à évaporation de l’eau.', 'Bats les œufs, verse sur les champignons, cuis en omelette 3-4 min.', 'Toaste le pain, sers avec l’orange en dessert.'],
    },
  },
  {
    name: 'bowl thon-avocat',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 820,
      p: 42,
      items: ['1 boîte de thon (140 g égoutté)', '½ avocat', '80 g pain complet', '1 tomate'],
      steps: ['Égoutte le thon, écrase-le à la fourchette avec un filet de citron.', 'Toaste le pain, écrase l’avocat dessus.', 'Ajoute le thon et la tomate en tranches par-dessus.'],
    },
  },
  {
    name: 'porridge cacao-banane',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 815,
      p: 37,
      items: ['70 g avoine', '300 ml lait de soja', '1 banane', '15 g cacao en poudre non sucré'],
      steps: ['Fais chauffer l’avoine dans le lait de soja avec le cacao 3-4 min en remuant.', 'Sers avec la banane tranchée par-dessus.'],
    },
  },
  {
    name: 'œufs brouillés avocat',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 810,
      p: 38,
      items: ['3 œufs', '½ avocat', '2 tomates', '80 g pain complet'],
      steps: ['Brouille les œufs à feu doux en remuant sans arrêt.', 'Toaste le pain, écrase l’avocat dessus.', 'Sers avec les tomates en tranches et les œufs brouillés.'],
    },
  },
  {
    name: 'pancakes myrtilles',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 830,
      p: 34,
      items: ['90 g avoine mixée', '2 œufs', '80 g myrtilles', "1 c. à s. sirop d'érable"],
      steps: ['Mixe l’avoine avec les œufs jusqu’à obtenir une pâte lisse.', 'Cuis à la poêle 2-3 min par face, ajoute les myrtilles sur le dessus avant de retourner.', 'Arrose de sirop d’érable.'],
    },
  },
  {
    name: 'toasts œuf poché',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 800,
      p: 32,
      items: ['80 g pain complet', '1 avocat', '2 œufs', '1 pincée de piment'],
      steps: ['Poche les œufs 3 min dans l’eau frémissante avec un filet de vinaigre.', 'Toaste le pain, écrase l’avocat dessus, assaisonne de piment.', 'Pose les œufs pochés par-dessus.'],
    },
  },
  {
    name: 'muesli cajou-kiwi',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 800,
      p: 34,
      items: ['80 g avoine', '300 ml lait de soja', '20 g noix de cajou', '1 kiwi'],
      steps: ['Mélange l’avoine et le lait de soja, laisse reposer 5 min au frigo si tu as le temps.', 'Ajoute les noix de cajou concassées et le kiwi en tranches.'],
    },
  },
  {
    name: 'œufs au plat patate douce',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 810,
      p: 36,
      items: ['3 œufs au plat', '150 g patate douce rôtie', 'Épinards'],
      steps: ['Coupe la patate douce en dés, rôtis-la 20 min au four à 200 °C (ou la veille, à réchauffer).', 'Poêle les épinards 2 min pour qu’ils tombent.', 'Cuis les œufs au plat, sers le tout ensemble.'],
    },
  },
  {
    name: 'porridge mangue-chia',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 800,
      p: 32,
      items: ['60 g avoine', '300 ml lait de soja', '100 g mangue', '15 g graines de chia'],
      steps: ['Mélange l’avoine, le lait de soja et les graines de chia, laisse gonfler 5 min.', 'Ajoute la mangue coupée en dés par-dessus.'],
    },
  },
  {
    name: 'tartines thon-tomate',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 800,
      p: 40,
      items: ['1 boîte de thon (140 g égoutté)', '80 g pain complet', '2 tomates', "1 c. à s. huile d'olive"],
      steps: ['Toaste le pain, égoutte le thon.', 'Écrase légèrement le thon à la fourchette, étale sur le pain.', 'Ajoute les tomates en tranches, arrose d’un filet d’huile d’olive.'],
    },
  },
  {
    name: 'omelette poivrons',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 810,
      p: 40,
      items: ['4 œufs', '1 poivron', '80 g pain complet'],
      steps: ['Poêle le poivron émincé 5-6 min à feu moyen jusqu’à ce qu’il ramollisse.', 'Bats les œufs, verse sur le poivron, cuis en omelette 3-4 min.', 'Toaste le pain, sers avec l’omelette.'],
    },
  },
  {
    name: 'bowl quinoa matinal',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 820,
      p: 34,
      items: ['80 g quinoa (sec)', '300 ml lait de soja', '1 banane', '20 g amandes'],
      steps: ['Cuis le quinoa 12-15 min dans le lait de soja à feu doux, en remuant de temps en temps.', 'Sers avec la banane tranchée et les amandes concassées.'],
    },
  },
  {
    name: 'œufs durs & avocat',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 800,
      p: 38,
      items: ['3 œufs durs', '80 g pain complet', '½ avocat', '1 orange'],
      steps: ['Cuis les œufs durs 9-10 min à l’eau bouillante, refroidis sous l’eau froide, écale.', 'Toaste le pain, écrase l’avocat dessus.', 'Sers avec l’orange en dessert.'],
    },
  },
  {
    name: 'porridge poire-noix',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 815,
      p: 36,
      items: ['70 g avoine', '300 ml lait de soja', '1 poire', '25 g noix'],
      steps: ['Fais chauffer l’avoine dans le lait de soja 3-4 min.', 'Coupe la poire en dés, ajoute-la en fin de cuisson.', 'Sers avec les noix concassées par-dessus.'],
    },
  },
  {
    name: 'pancakes cacao',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 840,
      p: 34,
      items: ['90 g avoine mixée', '2 œufs', '1 banane', '15 g cacao en poudre non sucré'],
      steps: ['Mixe l’avoine, les œufs, la banane et le cacao jusqu’à obtenir une pâte lisse.', 'Cuis à la poêle 2-3 min par face, façon petits pancakes.'],
    },
  },
  {
    name: 'toasts sardines-tomate',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 800,
      p: 40,
      items: ['1 boîte de sardines', '80 g pain complet', '2 tomates'],
      steps: ['Toaste le pain, égoutte les sardines.', 'Écrase légèrement les sardines, étale sur le pain.', 'Ajoute les tomates en tranches par-dessus.'],
    },
  },
  {
    name: 'muesli pomme-cannelle',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 800,
      p: 34,
      items: ['80 g avoine', '300 ml lait de soja', '1 pomme', '1 c. à c. cannelle'],
      steps: ['Mélange l’avoine, le lait de soja et la cannelle la veille, laisse au frigo toute la nuit.', 'Ajoute la pomme râpée ou en dés juste avant de manger.'],
    },
  },
  {
    name: 'œufs brouillés épinards',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 800,
      p: 38,
      items: ['4 œufs', 'Épinards', '80 g pain complet'],
      steps: ['Poêle les épinards 2 min pour qu’ils tombent, réserve.', 'Brouille les œufs à feu doux, mélange avec les épinards en fin de cuisson.', 'Toaste le pain, sers avec les œufs brouillés.'],
    },
  },
  {
    name: 'bowl yaourt de soja & fruits rouges',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 800,
      p: 32,
      items: ['2 yaourts de soja nature', '80 g avoine', '100 g fruits rouges', '15 g amandes'],
      steps: ['Mélange les yaourts de soja avec l’avoine, laisse gonfler 5 min.', 'Ajoute les fruits rouges et les amandes concassées par-dessus.'],
    },
  },
  {
    name: 'wrap œufs-avocat',
    meal: {
      title: 'Petit-déjeuner',
      kcal: 820,
      p: 36,
      items: ['1 tortilla de blé', '3 œufs', '½ avocat', '1 tomate'],
      steps: ['Brouille les œufs à feu doux.', 'Écrase l’avocat sur la tortilla tiédie, ajoute la tomate en dés.', 'Ajoute les œufs brouillés, roule le wrap serré.'],
    },
  },
]

export const RECIPE_POOL_L: PoolRecipe[] = [
  {
    name: 'poulet-quinoa',
    meal: {
      title: 'Déjeuner',
      kcal: 850,
      p: 55,
      items: ['180 g blanc de poulet', '130 g quinoa (sec)', 'Brocolis', "1 c. à s. huile d'olive"],
      steps: ['Cuis le quinoa 12-15 min dans 2× son volume d’eau.', 'Poêle le poulet coupé en lanières 6-8 min à feu moyen.', 'Cuis les brocolis à la vapeur 5-6 min, assaisonne le tout à l’huile d’olive.'],
    },
  },
  {
    name: 'bœuf-patate douce',
    meal: {
      title: 'Déjeuner',
      kcal: 870,
      p: 56,
      items: ['200 g bœuf haché 5 %', '300 g patate douce', 'Haricots verts'],
      steps: ['Coupe la patate douce en quartiers, enfourne 25-30 min à 200 °C.', 'Poêle le bœuf haché 5-6 min à feu vif en émiettant.', 'Cuis les haricots verts à la vapeur 6-8 min, sers le tout ensemble.'],
    },
  },
  {
    name: 'saumon-riz',
    meal: {
      title: 'Déjeuner',
      kcal: 860,
      p: 52,
      items: ['2 pavés de saumon (240 g)', '130 g riz (sec)', 'Épinards'],
      steps: ['Cuis le riz sec 10-12 min dans 2× son volume d’eau.', 'Poêle ou enfourne les pavés de saumon (12-15 min à 180 °C).', 'Poêle les épinards 2-3 min pour qu’ils tombent, sers avec le riz et le saumon.'],
    },
  },
  {
    name: 'dinde-pâtes tomate',
    meal: {
      title: 'Déjeuner',
      kcal: 850,
      p: 54,
      items: ['190 g escalope de dinde', '130 g pâtes (sec)', 'Sauce tomate', 'Champignons'],
      steps: ['Cuis les pâtes sèches selon le paquet (8-10 min).', 'Poêle l’escalope de dinde 5-6 min par face.', 'Ajoute la sauce tomate et les champignons émincés, mijote 5 min, mélange aux pâtes.'],
    },
  },
  {
    name: 'thon-quinoa maïs',
    meal: {
      title: 'Déjeuner',
      kcal: 840,
      p: 58,
      items: ['2 boîtes de thon (280 g égoutté)', '130 g quinoa (sec)', 'Maïs, tomates'],
      steps: ['Cuis le quinoa 12-15 min dans 2× son volume d’eau.', 'Égoutte le thon, mélange avec le maïs et les tomates coupées en dés.', 'Mélange le tout, sers tiède ou froid.'],
    },
  },
  {
    name: 'poulet-riz curry',
    meal: {
      title: 'Déjeuner',
      kcal: 860,
      p: 55,
      items: ['180 g blanc de poulet', '130 g riz (sec)', 'Curry léger', 'Poivrons'],
      steps: ['Cuis le riz sec 10-12 min.', 'Poêle le poulet en lanières 6-8 min avec les poivrons émincés.', 'Ajoute le curry en fin de cuisson, mélange 2 min, sers sur le riz.'],
    },
  },
  {
    name: 'bœuf carottes',
    meal: {
      title: 'Déjeuner',
      kcal: 870,
      p: 56,
      items: ['200 g bœuf sauté', '350 g pommes de terre', 'Carottes'],
      steps: ['Cuis les pommes de terre et les carottes à l’eau 20-25 min.', 'Poêle le bœuf 5-6 min à feu vif.', 'Sers le tout ensemble, assaisonne à ton goût.'],
    },
  },
  {
    name: 'sardines-riz concombre',
    meal: {
      title: 'Déjeuner',
      kcal: 840,
      p: 54,
      items: ['2 boîtes de sardines', '130 g riz (sec)', 'Tomates, concombre'],
      steps: ['Cuis le riz sec 10-12 min.', 'Égoutte les sardines, mélange avec les tomates et le concombre en dés.', 'Sers sur le riz, tiède ou froid.'],
    },
  },
  {
    name: 'poulet-pâtes pesto',
    meal: {
      title: 'Déjeuner',
      kcal: 860,
      p: 55,
      items: ['180 g blanc de poulet', '130 g pâtes (sec)', "2 c. à s. huile d'olive", 'Basilic'],
      steps: ['Cuis les pâtes sèches selon le paquet.', 'Poêle le poulet en lanières 6-8 min.', 'Mélange les pâtes à l’huile d’olive et au basilic ciselé, ajoute le poulet par-dessus.'],
    },
  },
  {
    name: 'tofu-riz sauté',
    meal: {
      title: 'Déjeuner',
      kcal: 840,
      p: 52,
      items: ['250 g tofu ferme', '130 g riz (sec)', 'Légumes wok, sauce soja'],
      steps: ['Cuis le riz sec 10-12 min.', 'Coupe le tofu en cubes, poêle-le 5-6 min pour le dorer.', 'Ajoute les légumes puis arrose de sauce soja, saute 2-3 min de plus, sers sur le riz.'],
    },
  },
  {
    name: 'dinde-quinoa poivrons',
    meal: {
      title: 'Déjeuner',
      kcal: 850,
      p: 54,
      items: ['190 g escalope de dinde', '130 g quinoa (sec)', 'Poivrons'],
      steps: ['Cuis le quinoa 12-15 min.', 'Poêle l’escalope de dinde 5-6 min par face avec les poivrons émincés.', 'Sers le tout ensemble.'],
    },
  },
  {
    name: 'saumon-pâtes brocolis',
    meal: {
      title: 'Déjeuner',
      kcal: 860,
      p: 52,
      items: ['2 pavés de saumon (240 g)', '130 g pâtes (sec)', 'Brocolis'],
      steps: ['Cuis les pâtes sèches selon le paquet.', 'Poêle ou enfourne les pavés de saumon (12-15 min à 180 °C).', 'Cuis les brocolis à la vapeur 5-6 min, sers le tout ensemble.'],
    },
  },
  {
    name: 'bœuf-riz légumes',
    meal: {
      title: 'Déjeuner',
      kcal: 870,
      p: 54,
      items: ['200 g bœuf sauté', '130 g riz (sec)', 'Légumes wok'],
      steps: ['Cuis le riz sec 10-12 min.', 'Fais sauter le bœuf à feu vif 3-4 min.', 'Ajoute les légumes, saute 2-3 min de plus, sers sur le riz.'],
    },
  },
  {
    name: 'poulet-semoule ratatouille',
    meal: {
      title: 'Déjeuner',
      kcal: 860,
      p: 55,
      items: ['180 g blanc de poulet', '130 g semoule (sec)', 'Ratatouille'],
      steps: ['Prépare la semoule : eau bouillante à volume égal, hors du feu, couvre 5 min, égrène.', 'Poêle le poulet en lanières 6-8 min.', 'Réchauffe la ratatouille, sers le tout ensemble.'],
    },
  },
  {
    name: 'thon-pâtes olives',
    meal: {
      title: 'Déjeuner',
      kcal: 850,
      p: 58,
      items: ['2 boîtes de thon (280 g égoutté)', '130 g pâtes (sec)', 'Tomates cerises, olives'],
      steps: ['Cuis les pâtes sèches selon le paquet.', 'Égoutte le thon, mélange avec les tomates cerises et les olives.', 'Mélange le tout aux pâtes, sers tiède ou froid.'],
    },
  },
  {
    name: 'pois chiches-riz curry',
    meal: {
      title: 'Déjeuner',
      kcal: 840,
      p: 52,
      items: ['300 g pois chiches (cuits)', '130 g riz (sec)', 'Curry léger, légumes'],
      steps: ['Cuis le riz sec 10-12 min.', 'Réchauffe les pois chiches avec les légumes et le curry 8-10 min.', 'Sers sur le riz.'],
    },
  },
  {
    name: 'dinde-pommes de terre',
    meal: {
      title: 'Déjeuner',
      kcal: 850,
      p: 54,
      items: ['190 g escalope de dinde', '350 g pommes de terre', 'Haricots verts'],
      steps: ['Cuis les pommes de terre à l’eau ou au four (25-30 min).', 'Poêle l’escalope de dinde 5-6 min par face.', 'Cuis les haricots verts à la vapeur, sers le tout ensemble.'],
    },
  },
  {
    name: 'poulet-nouilles de riz',
    meal: {
      title: 'Déjeuner',
      kcal: 860,
      p: 54,
      items: ['180 g blanc de poulet', '120 g nouilles de riz (sec)', 'Légumes wok, sauce soja'],
      steps: ['Fais tremper les nouilles de riz dans l’eau chaude 5-8 min selon le paquet, égoutte.', 'Poêle le poulet en lanières à feu vif 4-5 min.', 'Ajoute les légumes puis les nouilles, arrose de sauce soja, saute 2-3 min de plus.'],
    },
  },
  {
    name: 'steak haché-riz salade',
    meal: {
      title: 'Déjeuner',
      kcal: 850,
      p: 55,
      items: ['200 g steak haché 5 %', '130 g riz (sec)', 'Salade verte'],
      steps: ['Cuis le riz sec 10-12 min.', 'Poêle le steak haché 4-5 min à feu vif en émiettant.', 'Sers avec la salade verte.'],
    },
  },
  {
    name: 'sardines-pâtes citron',
    meal: {
      title: 'Déjeuner',
      kcal: 840,
      p: 54,
      items: ['2 boîtes de sardines', '130 g pâtes (sec)', 'Tomates, citron'],
      steps: ['Cuis les pâtes sèches selon le paquet.', 'Égoutte les sardines, écrase-les légèrement avec un filet de citron.', 'Mélange aux pâtes et aux tomates en dés.'],
    },
  },
  {
    name: 'bœuf-quinoa légumes rôtis',
    meal: {
      title: 'Déjeuner',
      kcal: 870,
      p: 56,
      items: ['200 g bœuf', '130 g quinoa (sec)', 'Légumes rôtis'],
      steps: ['Cuis le quinoa 12-15 min.', 'Rôtis le bœuf à la poêle ~6-8 min (cuisson rosée).', 'Enfourne les légumes 25-30 min à 200 °C, sers le tout ensemble.'],
    },
  },
]

export const RECIPE_POOL_S: PoolRecipe[] = [
  {
    name: 'shake vanille-datte',
    meal: {
      title: 'Shake',
      kcal: 630,
      p: 30,
      items: ['300 ml lait de soja', '2 dattes', '50 g avoine', '25 g beurre de cacahuète'],
      steps: ['Mets le lait de soja, les dattes dénoyautées, l’avoine et le beurre de cacahuète dans un blender.', 'Mixe 30-45 s jusqu’à texture lisse et bien sucrée.'],
    },
  },
  {
    name: 'shake ananas-gingembre',
    meal: {
      title: 'Shake',
      kcal: 630,
      p: 30,
      items: ['300 ml lait de soja', '100 g ananas', '1 cm gingembre frais', '50 g avoine', '20 g beurre de cacahuète'],
      steps: ['Mets le lait de soja, l’ananas, le gingembre pelé, l’avoine et le beurre de cacahuète dans un blender.', 'Mixe 30-45 s jusqu’à texture lisse. Le gingembre donne un petit coup de fouet.'],
    },
  },
  {
    name: 'shake épinards-banane',
    meal: {
      title: 'Shake',
      kcal: 630,
      p: 30,
      items: ['300 ml lait de soja', '1 banane', 'Épinards', '50 g avoine', '25 g beurre de cacahuète'],
      steps: ['Mets le lait de soja, la banane, une poignée d’épinards, l’avoine et le beurre de cacahuète dans un blender.', 'Mixe 45-60 s jusqu’à texture bien lisse (les épinards se sentent à peine).'],
    },
  },
  {
    name: 'shake pêche-amande',
    meal: {
      title: 'Shake',
      kcal: 630,
      p: 30,
      items: ['300 ml lait de soja', '1 pêche', '50 g avoine', '20 g amandes'],
      steps: ['Mets le lait de soja, la pêche coupée en morceaux, l’avoine et les amandes dans un blender.', 'Mixe 30-45 s jusqu’à texture lisse.'],
    },
  },
  {
    name: 'shake chocolat intense',
    meal: {
      title: 'Shake',
      kcal: 630,
      p: 30,
      items: ['300 ml lait de soja', '35 g cacao en poudre non sucré', '40 g avoine', '20 g beurre de cacahuète'],
      steps: ['Mets le lait de soja, le cacao, l’avoine et le beurre de cacahuète dans un blender.', 'Mixe 30-45 s jusqu’à texture lisse et bien chocolatée. Ajoute un glaçon si tu le veux bien frais.'],
    },
  },
  {
    name: 'shake fraise-avoine',
    meal: {
      title: 'Shake',
      kcal: 630,
      p: 30,
      items: ['300 ml lait de soja', '100 g fraises', '50 g avoine', '25 g beurre de cacahuète'],
      steps: ['Mets le lait de soja, les fraises, l’avoine et le beurre de cacahuète dans un blender.', 'Mixe 30-45 s jusqu’à texture lisse.'],
    },
  },
  {
    name: 'shake curcuma-gingembre',
    meal: {
      title: 'Shake',
      kcal: 630,
      p: 30,
      items: ['300 ml lait de soja', '1 banane', '1 c. à c. curcuma', '1 cm gingembre frais', '40 g avoine', '15 g beurre de cacahuète'],
      steps: ['Mets le lait de soja, la banane, le curcuma, le gingembre pelé, l’avoine et le beurre de cacahuète dans un blender.', 'Mixe 30-45 s jusqu’à texture lisse, façon golden shake.'],
    },
  },
  {
    name: 'shake mocha',
    meal: {
      title: 'Shake',
      kcal: 630,
      p: 30,
      items: ['300 ml lait de soja', '1 c. à c. café soluble', '20 g cacao en poudre non sucré', '40 g avoine', '15 g beurre de cacahuète'],
      steps: ['Mets le lait de soja, le café soluble, le cacao, l’avoine et le beurre de cacahuète dans un blender.', 'Mixe 30-45 s jusqu’à texture lisse, façon shake mocha.'],
    },
  },
  {
    name: 'shake datte-amande',
    meal: {
      title: 'Shake',
      kcal: 630,
      p: 30,
      items: ['300 ml lait de soja', '3 dattes', '50 g avoine', '20 g amandes'],
      steps: ['Mets le lait de soja, les dattes dénoyautées, l’avoine et les amandes dans un blender.', 'Mixe 30-45 s jusqu’à texture lisse et bien sucrée.'],
    },
  },
  {
    name: 'shake poire-cannelle',
    meal: {
      title: 'Shake',
      kcal: 630,
      p: 30,
      items: ['300 ml lait de soja', '1 poire', '1 c. à c. cannelle', '50 g avoine', '20 g beurre de cacahuète'],
      steps: ['Mets le lait de soja, la poire coupée en morceaux, la cannelle, l’avoine et le beurre de cacahuète dans un blender.', 'Mixe 30-45 s jusqu’à texture lisse.'],
    },
  },
  {
    name: 'shake myrtille-avoine',
    meal: {
      title: 'Shake',
      kcal: 630,
      p: 30,
      items: ['300 ml lait de soja', '100 g myrtilles', '50 g avoine', '25 g beurre de cacahuète'],
      steps: ['Mets le lait de soja, les myrtilles, l’avoine et le beurre de cacahuète dans un blender.', 'Mixe 30-45 s jusqu’à texture lisse.'],
    },
  },
  {
    name: 'shake orange-vanille',
    meal: {
      title: 'Shake',
      kcal: 630,
      p: 30,
      items: ['300 ml lait de soja', '1 orange', '1 c. à c. extrait de vanille', '50 g avoine', '20 g beurre de cacahuète'],
      steps: ['Mets le lait de soja, l’orange pelée, la vanille, l’avoine et le beurre de cacahuète dans un blender.', 'Mixe 30-45 s jusqu’à texture lisse.'],
    },
  },
  {
    name: 'shake kiwi-épinards',
    meal: {
      title: 'Shake',
      kcal: 630,
      p: 30,
      items: ['300 ml lait de soja', '2 kiwis', 'Épinards', '50 g avoine', '15 g beurre de cacahuète'],
      steps: ['Mets le lait de soja, les kiwis pelés, une poignée d’épinards, l’avoine et le beurre de cacahuète dans un blender.', 'Mixe 45-60 s jusqu’à texture bien lisse.'],
    },
  },
  {
    name: 'shake abricot-amande',
    meal: {
      title: 'Shake',
      kcal: 630,
      p: 30,
      items: ['300 ml lait de soja', '4 abricots secs', '50 g avoine', '20 g amandes'],
      steps: ['Mets le lait de soja, les abricots secs, l’avoine et les amandes dans un blender.', 'Mixe 30-45 s jusqu’à texture lisse.'],
    },
  },
  {
    name: 'shake tonic gingembre',
    meal: {
      title: 'Shake',
      kcal: 630,
      p: 30,
      items: ['300 ml lait de soja', '1 banane', '1 cm gingembre frais', '50 g avoine', '20 g beurre de cacahuète'],
      steps: ['Mets le lait de soja, la banane, le gingembre pelé, l’avoine et le beurre de cacahuète dans un blender.', 'Mixe 30-45 s jusqu’à texture lisse. Un coup de fouet avant la séance.'],
    },
  },
]

export const RECIPE_POOL_D: PoolRecipe[] = [
  {
    name: 'poulet-riz léger',
    meal: {
      title: 'Dîner',
      kcal: 640,
      p: 44,
      items: ['180 g poulet grillé', '100 g riz (sec)', 'Légumes verts'],
      steps: ['Cuis le riz sec 10-12 min.', 'Grille ou poêle le poulet 6-8 min.', 'Cuis les légumes verts à la vapeur, sers le tout ensemble.'],
    },
  },
  {
    name: 'tofu-quinoa légumes',
    meal: {
      title: 'Dîner',
      kcal: 660,
      p: 38,
      items: ['200 g tofu ferme', '100 g quinoa (sec)', 'Légumes rôtis'],
      steps: ['Cuis le quinoa 12-15 min.', 'Coupe le tofu en cubes, poêle-le 5-6 min pour le dorer.', 'Enfourne les légumes 20-25 min à 200 °C, sers le tout ensemble.'],
    },
  },
  {
    name: 'œufs-lentilles poivrons',
    meal: {
      title: 'Dîner',
      kcal: 660,
      p: 36,
      items: ['3 œufs + 100 g lentilles (sec)', 'Poivrons', 'Oignon'],
      steps: ['Cuis les lentilles sèches 20-25 min à l’eau bouillante.', 'Poêle les poivrons et l’oignon émincés 5-6 min.', 'Cuis les œufs comme tu préfères, sers le tout ensemble.'],
    },
  },
  {
    name: 'dinde-courgettes patate douce',
    meal: {
      title: 'Dîner',
      kcal: 700,
      p: 42,
      items: ['190 g escalope de dinde', '300 g patate douce', 'Courgettes'],
      steps: ['Coupe la patate douce en quartiers, enfourne 25-30 min à 200 °C.', 'Poêle l’escalope de dinde 5-6 min par face.', 'Poêle les courgettes 5-6 min, sers le tout ensemble.'],
    },
  },
  {
    name: 'saumon-légumes vapeur',
    meal: {
      title: 'Dîner',
      kcal: 690,
      p: 44,
      items: ['180 g saumon', 'Brocolis, haricots verts'],
      steps: ['Poêle ou enfourne le saumon (12-15 min à 180 °C).', 'Cuis les brocolis et les haricots verts à la vapeur 6-8 min.', 'Sers le tout ensemble, assaisonne à ton goût.'],
    },
  },
  {
    name: 'steak-salade tomates',
    meal: {
      title: 'Dîner',
      kcal: 650,
      p: 42,
      items: ['200 g steak haché 5 %', 'Salade, tomates'],
      steps: ['Poêle le steak haché 4-5 min à feu vif en émiettant.', 'Sers avec la salade et les tomates en tranches.'],
    },
  },
  {
    name: 'thon-salade méditerranéenne',
    meal: {
      title: 'Dîner',
      kcal: 620,
      p: 44,
      items: ['1 boîte de thon (140 g égoutté)', 'Olives, tomates, concombre'],
      steps: ['Égoutte le thon, mélange avec les olives, les tomates et le concombre coupés en dés.', 'Assaisonne à l’huile d’olive, sers frais.'],
    },
  },
  {
    name: 'poulet-patate douce épicé',
    meal: {
      title: 'Dîner',
      kcal: 700,
      p: 44,
      items: ['200 g haut de cuisse de poulet', '300 g patate douce', 'Épices (paprika, cumin)'],
      steps: ['Coupe la patate douce en quartiers, enrobe d’épices, enfourne 25-30 min à 200 °C.', 'Enfourne le poulet 30-35 min à 200 °C avec les épices.', 'Sers le tout ensemble.'],
    },
  },
  {
    name: 'sardines-quinoa tomates',
    meal: {
      title: 'Dîner',
      kcal: 660,
      p: 40,
      items: ['1 boîte de sardines', '100 g quinoa (sec)', 'Tomates'],
      steps: ['Cuis le quinoa 12-15 min.', 'Égoutte les sardines, écrase-les légèrement.', 'Mélange au quinoa et aux tomates en dés.'],
    },
  },
  {
    name: 'bœuf-légumes wok',
    meal: {
      title: 'Dîner',
      kcal: 690,
      p: 42,
      items: ['180 g bœuf sauté', 'Légumes wok, sauce soja'],
      steps: ['Fais sauter le bœuf à feu vif 3-4 min.', 'Ajoute les légumes, arrose de sauce soja, saute 2-3 min de plus.'],
    },
  },
  {
    name: 'tofu-curry léger',
    meal: {
      title: 'Dîner',
      kcal: 670,
      p: 38,
      items: ['200 g tofu ferme', 'Curry lait de coco léger', '100 g riz (sec)'],
      steps: ['Cuis le riz sec 10-12 min.', 'Coupe le tofu en cubes, poêle-le 4-5 min pour le dorer.', 'Ajoute le curry lait de coco, mijote 8-10 min, sers sur le riz.'],
    },
  },
  {
    name: 'œufs-avocat léger',
    meal: {
      title: 'Dîner',
      kcal: 620,
      p: 34,
      items: ['3 œufs', '½ avocat', 'Salade verte'],
      steps: ['Cuis les œufs comme tu préfères (durs, au plat, brouillés).', 'Écrase l’avocat, sers avec la salade verte et les œufs.'],
    },
  },
  {
    name: 'dinde-riz légumes verts',
    meal: {
      title: 'Dîner',
      kcal: 650,
      p: 42,
      items: ['190 g escalope de dinde', '100 g riz (sec)', 'Légumes verts'],
      steps: ['Cuis le riz sec 10-12 min.', 'Poêle l’escalope de dinde 5-6 min par face.', 'Cuis les légumes verts à la vapeur, sers le tout ensemble.'],
    },
  },
  {
    name: 'saumon-épinards',
    meal: {
      title: 'Dîner',
      kcal: 690,
      p: 44,
      items: ['180 g saumon', '350 g pommes de terre', 'Épinards'],
      steps: ['Cuis les pommes de terre à l’eau ou au four (20-25 min).', 'Poêle ou enfourne le saumon (12-15 min à 180 °C).', 'Poêle les épinards 2-3 min pour qu’ils tombent, sers le tout ensemble.'],
    },
  },
  {
    name: 'steak-pâtes tomate',
    meal: {
      title: 'Dîner',
      kcal: 700,
      p: 44,
      items: ['200 g steak haché 5 %', '110 g pâtes (sec)', 'Sauce tomate'],
      steps: ['Cuis les pâtes sèches selon le paquet (8-10 min).', 'Poêle le steak haché 4-5 min à feu vif en émiettant.', 'Ajoute la sauce tomate, mélange aux pâtes.'],
    },
  },
  {
    name: 'poulet-ratatouille riz',
    meal: {
      title: 'Dîner',
      kcal: 680,
      p: 42,
      items: ['180 g haut de cuisse de poulet', '100 g riz (sec)', 'Ratatouille'],
      steps: ['Cuis le riz sec 10-12 min.', 'Enfourne le poulet 30-35 min à 200 °C.', 'Réchauffe la ratatouille, sers le tout ensemble.'],
    },
  },
  {
    name: 'tofu-légumes sautés riz',
    meal: {
      title: 'Dîner',
      kcal: 660,
      p: 38,
      items: ['200 g tofu ferme', '100 g riz (sec)', 'Légumes sautés'],
      steps: ['Cuis le riz sec 10-12 min.', 'Coupe le tofu en cubes, poêle-le 4-5 min pour le dorer.', 'Ajoute les légumes, saute 3-4 min, sers sur le riz.'],
    },
  },
  {
    name: 'œufs-champignons léger',
    meal: {
      title: 'Dîner',
      kcal: 620,
      p: 36,
      items: ['4 œufs', 'Champignons', '80 g pain complet'],
      steps: ['Poêle les champignons émincés 4-5 min à feu vif.', 'Brouille les œufs à feu doux, mélange avec les champignons en fin de cuisson.', 'Toaste le pain, sers avec les œufs.'],
    },
  },
  {
    name: 'dinde-haricots pommes de terre',
    meal: {
      title: 'Dîner',
      kcal: 690,
      p: 44,
      items: ['190 g escalope de dinde', '300 g pommes de terre', 'Haricots verts'],
      steps: ['Cuis les pommes de terre à l’eau ou au four (20-25 min).', 'Poêle l’escalope de dinde 5-6 min par face.', 'Cuis les haricots verts à la vapeur, sers le tout ensemble.'],
    },
  },
  {
    name: 'thon-avocat tomates',
    meal: {
      title: 'Dîner',
      kcal: 630,
      p: 42,
      items: ['1 boîte de thon (140 g égoutté)', '½ avocat', 'Tomates'],
      steps: ['Égoutte le thon, mélange avec les tomates en dés.', 'Écrase l’avocat, sers le tout ensemble avec un filet de citron.'],
    },
  },
  {
    name: 'bœuf-brocolis riz',
    meal: {
      title: 'Dîner',
      kcal: 700,
      p: 44,
      items: ['180 g bœuf', '100 g riz (sec)', 'Brocolis'],
      steps: ['Cuis le riz sec 10-12 min.', 'Poêle le bœuf 5-6 min à feu vif.', 'Cuis les brocolis à la vapeur 5-6 min, sers le tout ensemble.'],
    },
  },
]
