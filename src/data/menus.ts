import type { DayMenu } from '../types'

/** index = getDay() (0 = dimanche) */
export const MENUS: DayMenu[] = [
  {
    name: 'Dimanche', meals: [
      { id: 'b', title: 'Petit-déjeuner', kcal: 800, p: 38, items: ['4 œufs en omelette', '80 g pain complet', '½ avocat', '1 orange'] },
      { id: 'l', title: 'Déjeuner', kcal: 880, p: 55, items: ['200 g rôti de bœuf', '350 g pommes de terre', 'Légumes rôtis', "1 c. à s. huile d'olive"] },
      { id: 's', title: 'Shake bâtisseur', kcal: 630, p: 30, shake: true, items: ['300 ml lait de soja', '1 banane', "60 g flocons d'avoine", '25 g beurre de cacahuète'] },
      { id: 'd', title: 'Dîner', kcal: 660, p: 34, items: ['3 œufs + 100 g lentilles (sec)', 'Salade, tomates, oignon', '30 g noix'] },
    ],
  },
  {
    name: 'Lundi', meals: [
      { id: 'b', title: 'Petit-déjeuner', kcal: 830, p: 42, items: ['3 œufs brouillés', '90 g flocons d’avoine au lait de soja', '1 banane', '20 g amandes'] },
      { id: 'l', title: 'Déjeuner (pré-séance)', kcal: 850, p: 56, items: ['180 g blanc de poulet', '130 g riz (sec)', 'Brocolis', "1 c. à s. huile d'olive"] },
      { id: 's', title: 'Shake post-séance', kcal: 630, p: 30, shake: true, items: ['300 ml lait de soja', '1 banane', '60 g avoine', '25 g beurre de cacahuète'] },
      { id: 'd', title: 'Dîner', kcal: 700, p: 44, items: ['200 g steak haché 5 %', '110 g pâtes (sec)', 'Sauce tomate', 'Levure maltée (goût fromage, 0 lactose)'] },
    ],
  },
  {
    name: 'Mardi', meals: [
      { id: 'b', title: 'Petit-déjeuner', kcal: 810, p: 38, items: ['Porridge : 90 g avoine + lait de soja', '25 g beurre de cacahuète', '1 pomme', '2 œufs durs'] },
      { id: 'l', title: 'Déjeuner (pré-séance)', kcal: 860, p: 52, items: ['2 pavés de saumon (240 g)', '350 g pommes de terre', 'Haricots verts'] },
      { id: 's', title: 'Shake post-séance', kcal: 630, p: 30, shake: true, items: ['300 ml lait de soja', '1 banane', '60 g avoine', '25 g beurre de cacahuète'] },
      { id: 'd', title: 'Dîner', kcal: 690, p: 46, items: ['190 g escalope de dinde', '120 g semoule (sec)', 'Ratatouille', '20 g raisins secs'] },
    ],
  },
  {
    name: 'Mercredi', meals: [
      { id: 'b', title: 'Petit-déjeuner', kcal: 820, p: 40, items: ['3 œufs au plat', '80 g pain complet', '1 banane', '30 g noix de cajou'] },
      { id: 'l', title: 'Déjeuner', kcal: 840, p: 58, items: ['2 boîtes de thon (280 g égoutté)', '130 g riz (sec)', 'Maïs, tomates, concombre', "1 c. à s. huile d'olive"] },
      { id: 's', title: 'Shake bâtisseur', kcal: 630, p: 30, shake: true, items: ['300 ml lait de soja', '1 banane', '60 g avoine', '25 g beurre de cacahuète'] },
      { id: 'd', title: 'Dîner', kcal: 710, p: 42, items: ['220 g haut de cuisse de poulet rôti', '350 g patate douce', 'Courgettes', '1 carré de chocolat noir'] },
    ],
  },
  {
    name: 'Jeudi', meals: [
      { id: 'b', title: 'Petit-déjeuner', kcal: 800, p: 40, items: ['Porridge : 90 g avoine + lait de soja', '1 œuf + 3 blancs brouillés', '1 banane', '15 g amandes'] },
      { id: 'l', title: 'Déjeuner (pré-séance)', kcal: 870, p: 54, items: ['200 g bœuf sauté', '120 g nouilles de riz (sec)', 'Légumes wok, sauce soja', '1 c. à s. huile de sésame'] },
      { id: 's', title: 'Shake post-séance', kcal: 630, p: 30, shake: true, items: ['300 ml lait de soja', '1 banane', '60 g avoine', '25 g beurre de cacahuète'] },
      { id: 'd', title: 'Dîner', kcal: 680, p: 38, items: ['200 g tofu ferme + 100 g pois chiches', 'Curry lait de coco léger', '100 g riz (sec)', 'Épinards'] },
    ],
  },
  {
    name: 'Vendredi', meals: [
      { id: 'b', title: 'Petit-déjeuner', kcal: 830, p: 42, items: ['3 œufs brouillés', '90 g flocons d’avoine au lait de soja', '1 poire', '20 g amandes'] },
      { id: 'l', title: 'Déjeuner (pré-séance)', kcal: 860, p: 55, items: ['180 g blanc de poulet', '130 g pâtes (sec)', 'Sauce tomate + champignons', "1 c. à s. huile d'olive"] },
      { id: 's', title: 'Shake post-séance', kcal: 630, p: 30, shake: true, items: ['300 ml lait de soja', '1 banane', '60 g avoine', '25 g beurre de cacahuète'] },
      { id: 'd', title: 'Dîner', kcal: 700, p: 46, items: ['1 boîte de sardines + 2 œufs', '350 g pommes de terre', 'Salade verte', '30 g noix'] },
    ],
  },
  {
    name: 'Samedi', meals: [
      { id: 'b', title: 'Petit-déjeuner', kcal: 860, p: 36, items: ['Pancakes : 100 g avoine mixée + 2 œufs + 1 banane', "Sirop d'érable", '25 g beurre de cacahuète'] },
      { id: 'l', title: 'Déjeuner LIBRE 🍔', kcal: 950, p: 45, items: ['Burger, kebab, resto… ce que tu veux', 'Prends quand même une bonne portion de viande', "C'est prévu dans le plan : zéro culpabilité"] },
      { id: 's', title: 'Shake bâtisseur', kcal: 630, p: 30, shake: true, items: ['300 ml lait de soja', '1 banane', '60 g avoine', '25 g beurre de cacahuète'] },
      { id: 'd', title: 'Dîner (léger)', kcal: 620, p: 42, items: ['180 g poulet ou dinde', '100 g riz (sec)', 'Légumes verts', "1 c. à s. huile d'olive"] },
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
