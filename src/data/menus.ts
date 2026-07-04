import type { DayMenu } from '../types'

const SHAKE_STEPS = ['Mets le lait de soja, la banane, les flocons d’avoine et le beurre de cacahuète dans un blender.', 'Mixe 30-45 s jusqu’à texture lisse. Ajoute un glaçon si tu le veux bien frais.']
const SHAKE_STEPS_POST = ['Blender le lait de soja, la banane, l’avoine et le beurre de cacahuète 30-45 s.', 'À boire dans l’heure qui suit la séance, idéalement.']

/** index = getDay() (0 = dimanche) */
export const MENUS: DayMenu[] = [
  {
    name: 'Dimanche', meals: [
      {
        id: 'b', title: 'Petit-déjeuner', kcal: 800, p: 38, items: ['4 œufs en omelette', '80 g pain complet', '½ avocat', '1 orange'],
        steps: ['Bats les 4 œufs (sel, poivre), cuis à la poêle 3-4 min à feu moyen en repliant les bords.', 'Toaste le pain, écrase l’avocat dessus avec un filet de citron.', 'Sers avec l’orange en dessert.'],
      },
      {
        id: 'l', title: 'Déjeuner', kcal: 880, p: 55, items: ['200 g rôti de bœuf', '350 g pommes de terre', 'Légumes rôtis', "1 c. à s. huile d'olive"],
        steps: ['Rôtis le bœuf au four 200 °C ~20 min (cuisson rosée) ou à la poêle façon rôti.', 'Coupe les pommes de terre en quartiers, enrobe-les d’huile, enfourne 25-30 min à 200 °C avec les légumes.', 'Tranche le rôti, sers avec les légumes rôtis.'],
      },
      { id: 's', title: 'Shake bâtisseur', kcal: 630, p: 30, shake: true, items: ['300 ml lait de soja', '1 banane', "60 g flocons d'avoine", '25 g beurre de cacahuète'], steps: SHAKE_STEPS },
      {
        id: 'd', title: 'Dîner', kcal: 660, p: 34, items: ['3 œufs + 100 g lentilles (sec)', 'Salade, tomates, oignon', '30 g noix'],
        steps: ['Cuis les lentilles sèches 20-25 min à l’eau bouillante (ou une boîte déjà cuite pour gagner du temps).', 'Cuis les œufs comme tu préfères (durs, au plat, brouillés).', 'Mélange à la salade tomates-oignon, ajoute les noix concassées dessus.'],
      },
    ],
  },
  {
    name: 'Lundi', meals: [
      {
        id: 'b', title: 'Petit-déjeuner', kcal: 830, p: 42, items: ['3 œufs brouillés', '90 g flocons d’avoine au lait de soja', '1 banane', '20 g amandes'],
        steps: ['Fais chauffer l’avoine dans le lait de soja 3-4 min en remuant, jusqu’à consistance crémeuse.', 'Brouille les œufs à la poêle à feu doux en remuant sans arrêt.', 'Sers avec la banane tranchée et les amandes.'],
      },
      {
        id: 'l', title: 'Déjeuner (pré-séance)', kcal: 850, p: 56, items: ['180 g blanc de poulet', '130 g riz (sec)', 'Brocolis', "1 c. à s. huile d'olive"],
        steps: ['Cuis le riz sec dans 2× son volume d’eau, 10-12 min, à couvert.', 'Poêle le poulet coupé en lanières avec un peu d’huile, 6-8 min à feu moyen.', 'Cuis les brocolis à la vapeur 5-6 min, assaisonne le tout à l’huile d’olive.'],
      },
      { id: 's', title: 'Shake post-séance', kcal: 630, p: 30, shake: true, items: ['300 ml lait de soja', '1 banane', '60 g avoine', '25 g beurre de cacahuète'], steps: SHAKE_STEPS_POST },
      {
        id: 'd', title: 'Dîner', kcal: 700, p: 44, items: ['200 g steak haché 5 %', '110 g pâtes (sec)', 'Sauce tomate', 'Levure maltée (goût fromage, 0 lactose)'],
        steps: ['Cuis les pâtes sèches selon le paquet (8-10 min), égoutte.', 'Poêle le steak haché 4-5 min à feu vif en émiettant.', 'Ajoute la sauce tomate, mélange aux pâtes, saupoudre de levure maltée.'],
      },
    ],
  },
  {
    name: 'Mardi', meals: [
      {
        id: 'b', title: 'Petit-déjeuner', kcal: 810, p: 38, items: ['Porridge : 90 g avoine + lait de soja', '25 g beurre de cacahuète', '1 pomme', '2 œufs durs'],
        steps: ['Fais chauffer l’avoine dans le lait de soja 3-4 min, ajoute le beurre de cacahuète en fin de cuisson.', 'Cuis les œufs durs 9-10 min à l’eau bouillante, refroidis sous l’eau froide, écale.', 'Sers avec la pomme coupée en quartiers.'],
      },
      {
        id: 'l', title: 'Déjeuner (pré-séance)', kcal: 860, p: 52, items: ['2 pavés de saumon (240 g)', '350 g pommes de terre', 'Haricots verts'],
        steps: ['Poêle ou enfourne les pavés de saumon (12-15 min à 180 °C, ou 4-5 min par face à la poêle).', 'Cuis les pommes de terre à l’eau ou au four (25-30 min).', 'Cuis les haricots verts à la vapeur 6-8 min.'],
      },
      { id: 's', title: 'Shake post-séance', kcal: 630, p: 30, shake: true, items: ['300 ml lait de soja', '1 banane', '60 g avoine', '25 g beurre de cacahuète'], steps: SHAKE_STEPS_POST },
      {
        id: 'd', title: 'Dîner', kcal: 690, p: 46, items: ['190 g escalope de dinde', '120 g semoule (sec)', 'Ratatouille', '20 g raisins secs'],
        steps: ['Poêle l’escalope de dinde 5-6 min par face à feu moyen.', 'Prépare la semoule : eau bouillante à volume égal, hors du feu, couvre 5 min, égrène à la fourchette.', 'Réchauffe la ratatouille, sers avec les raisins secs en accompagnement.'],
      },
    ],
  },
  {
    name: 'Mercredi', meals: [
      {
        id: 'b', title: 'Petit-déjeuner', kcal: 820, p: 40, items: ['3 œufs au plat', '80 g pain complet', '1 banane', '30 g noix de cajou'],
        steps: ['Cuis les œufs au plat 3-4 min à feu doux, jaune coulant ou pris selon ton goût.', 'Toaste le pain complet.', 'Sers avec la banane et les noix de cajou.'],
      },
      {
        id: 'l', title: 'Déjeuner', kcal: 840, p: 58, items: ['2 boîtes de thon (280 g égoutté)', '130 g riz (sec)', 'Maïs, tomates, concombre', "1 c. à s. huile d'olive"],
        steps: ['Cuis le riz sec (10-12 min, 2× son volume d’eau).', 'Égoutte le thon, mélange avec le maïs, les tomates et le concombre coupés en dés.', 'Assaisonne à l’huile d’olive, sers tiède ou froid.'],
      },
      { id: 's', title: 'Shake bâtisseur', kcal: 630, p: 30, shake: true, items: ['300 ml lait de soja', '1 banane', '60 g avoine', '25 g beurre de cacahuète'], steps: SHAKE_STEPS },
      {
        id: 'd', title: 'Dîner', kcal: 710, p: 42, items: ['220 g haut de cuisse de poulet rôti', '350 g patate douce', 'Courgettes', '1 carré de chocolat noir'],
        steps: ['Enfourne le haut de cuisse de poulet 35-40 min à 200 °C (peau croustillante).', 'Coupe la patate douce en quartiers, enfourne avec le poulet 25-30 min.', 'Poêle les courgettes 5-6 min, sers avec le carré de chocolat en dessert.'],
      },
    ],
  },
  {
    name: 'Jeudi', meals: [
      {
        id: 'b', title: 'Petit-déjeuner', kcal: 800, p: 40, items: ['Porridge : 90 g avoine + lait de soja', '1 œuf + 3 blancs brouillés', '1 banane', '15 g amandes'],
        steps: ['Fais chauffer l’avoine dans le lait de soja 3-4 min.', 'Brouille l’œuf entier + les 3 blancs à feu doux.', 'Sers avec la banane et les amandes.'],
      },
      {
        id: 'l', title: 'Déjeuner (pré-séance)', kcal: 870, p: 54, items: ['200 g bœuf sauté', '120 g nouilles de riz (sec)', 'Légumes wok, sauce soja', '1 c. à s. huile de sésame'],
        steps: ['Fais tremper les nouilles de riz dans l’eau chaude 5-8 min selon le paquet, égoutte.', 'Fais sauter le bœuf à feu vif dans l’huile de sésame 3-4 min.', 'Ajoute les légumes puis les nouilles, arrose de sauce soja, saute 2-3 min de plus.'],
      },
      { id: 's', title: 'Shake post-séance', kcal: 630, p: 30, shake: true, items: ['300 ml lait de soja', '1 banane', '60 g avoine', '25 g beurre de cacahuète'], steps: SHAKE_STEPS_POST },
      {
        id: 'd', title: 'Dîner', kcal: 680, p: 38, items: ['200 g tofu ferme + 100 g pois chiches', 'Curry lait de coco léger', '100 g riz (sec)', 'Épinards'],
        steps: ['Coupe le tofu en cubes, poêle-le 4-5 min pour le dorer.', 'Ajoute les pois chiches et le lait de coco léger, laisse mijoter 8-10 min.', 'Sers sur le riz cuit, ajoute les épinards en fin de cuisson pour qu’ils tombent juste.'],
      },
    ],
  },
  {
    name: 'Vendredi', meals: [
      {
        id: 'b', title: 'Petit-déjeuner', kcal: 830, p: 42, items: ['3 œufs brouillés', '90 g flocons d’avoine au lait de soja', '1 poire', '20 g amandes'],
        steps: ['Fais chauffer l’avoine dans le lait de soja 3-4 min.', 'Brouille les œufs à feu doux.', 'Sers avec la poire et les amandes.'],
      },
      {
        id: 'l', title: 'Déjeuner (pré-séance)', kcal: 860, p: 55, items: ['180 g blanc de poulet', '130 g pâtes (sec)', 'Sauce tomate + champignons', "1 c. à s. huile d'olive"],
        steps: ['Cuis les pâtes sèches selon le paquet.', 'Poêle le poulet en lanières 6-8 min.', 'Ajoute la sauce tomate et les champignons émincés, mijote 5 min, mélange aux pâtes.'],
      },
      { id: 's', title: 'Shake post-séance', kcal: 630, p: 30, shake: true, items: ['300 ml lait de soja', '1 banane', '60 g avoine', '25 g beurre de cacahuète'], steps: SHAKE_STEPS_POST },
      {
        id: 'd', title: 'Dîner', kcal: 700, p: 46, items: ['1 boîte de sardines + 2 œufs', '350 g pommes de terre', 'Salade verte', '30 g noix'],
        steps: ['Égoutte les sardines, cuis les œufs comme tu préfères.', 'Cuis les pommes de terre à l’eau (20 min) ou au four.', 'Sers avec la salade verte et les noix concassées.'],
      },
    ],
  },
  {
    name: 'Samedi', meals: [
      {
        id: 'b', title: 'Petit-déjeuner', kcal: 860, p: 36, items: ['Pancakes : 100 g avoine mixée + 2 œufs + 1 banane', "Sirop d'érable", '25 g beurre de cacahuète'],
        steps: ['Mixe l’avoine avec les œufs et la banane jusqu’à obtenir une pâte lisse.', 'Cuis à la poêle 2-3 min par face, à feu moyen, façon petits pancakes.', 'Arrose de sirop d’érable et du beurre de cacahuète.'],
      },
      {
        id: 'l', title: 'Déjeuner LIBRE 🍔', kcal: 950, p: 45, items: ['Burger, kebab, resto… ce que tu veux', 'Prends quand même une bonne portion de viande', "C'est prévu dans le plan : zéro culpabilité"],
        steps: ['Pas de recette : c’est ton repas libre, choisis ce qui te fait plaisir.', 'Essaie quand même de viser une bonne portion de protéines si tu peux.', 'Zéro culpabilité — c’est prévu dans le plan, reviens à la normale au repas suivant.'],
      },
      { id: 's', title: 'Shake bâtisseur', kcal: 630, p: 30, shake: true, items: ['300 ml lait de soja', '1 banane', '60 g avoine', '25 g beurre de cacahuète'], steps: SHAKE_STEPS },
      {
        id: 'd', title: 'Dîner (léger)', kcal: 620, p: 42, items: ['180 g poulet ou dinde', '100 g riz (sec)', 'Légumes verts', "1 c. à s. huile d'olive"],
        steps: ['Poêle ou grille le poulet/dinde 6-8 min.', 'Cuis le riz sec (10-12 min).', 'Cuis les légumes verts à la vapeur, assaisonne à l’huile d’olive.'],
      },
    ],
  },
]

export const SWAPS: [string, string][] = [
  ['Avocat', "2 c. à s. d'huile d'olive ou 30 g de noix/cacahuètes (mêmes bons lipides)"],
  ['Saumon frais', 'Maquereau ou sardines en boîte : 3× moins cher, autant de protéines et d’oméga-3'],
  ['Blanc de poulet', 'Hauts de cuisse désossés : ~30 % moins cher, plus de goût'],
  ['Bœuf', 'Œufs + lentilles, ou poulet, ou steaks hachés surgelés en promo'],
  ['Amandes / cajou', 'Cacahuètes non salées : 2-3× moins cher, quasi identique'],
  ['Légumes frais', 'Surgelés nature : moins chers, aussi nutritifs, zéro gaspillage'],
  ['Patate douce', 'Pommes de terre classiques : quasi équivalent, moitié prix'],
  ['Lait de soja de marque', 'Premier prix : mêmes protéines (~3 g/100 ml), regarde l’étiquette'],
  ['Fruits du menu', "N'importe quel fruit de saison ou en promo"],
]
