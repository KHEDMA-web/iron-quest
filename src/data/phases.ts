import type { Phase } from '../types'

export const PHASES: Phase[] = [
  {
    id: 1, from: 1, to: 4, title: 'Fondations',
    intro: "Split Haut/Bas, charges modérées. Objectif du mois : maîtriser chaque mouvement et créer l'habitude. Finis chaque série en te disant « j'aurais pu en faire 2-3 de plus » (RPE 7).",
    sessions: [
      {
        key: 'UA', name: 'Haut A', exos: [
          ['Développé couché haltères', '3 × 10', '90 s', 'Coudes à 45°, descente contrôlée 2 s'],
          ['Rowing poulie basse', '3 × 10', '90 s', 'Tire vers le nombril, serre les omoplates'],
          ['Développé militaire haltères', '3 × 10', '90 s', 'Assis dossier haut, gainage serré'],
          ['Tirage vertical', '3 × 10', '90 s', 'Poitrine sortie, tire vers les clavicules'],
          ['Curl biceps + extensions triceps', '2 × 12', '60 s', 'En superset (enchaînés)'],
        ],
      },
      {
        key: 'LA', name: 'Bas A', exos: [
          ['Squat gobelet (haltère)', '3 × 10', '90 s', 'Descends sous la parallèle, dos droit'],
          ['Presse à cuisses', '3 × 10', '90 s', 'Amplitude complète, sans verrouiller les genoux'],
          ['Leg curl allongé', '3 × 12', '60 s', 'Contrôle la descente'],
          ['Mollets debout', '3 × 15', '60 s', 'Pause 1 s en haut'],
          ['Planche', '3 × 30 s', '45 s', 'Corps aligné, fessiers serrés'],
        ],
      },
      {
        key: 'UB', name: 'Haut B', exos: [
          ['Développé incliné haltères', '3 × 10', '90 s', 'Banc à 30°, vise le haut des pecs'],
          ['Rowing haltère un bras', '3 × 10 / bras', '60 s', 'Dos parallèle au sol, sans élan'],
          ['Élévations latérales', '3 × 12', '60 s', "Léger ! Monte jusqu'à l'horizontale"],
          ['Tirage horizontal', '3 × 10', '90 s', 'Buste fixe, tire avec le dos'],
          ['Curl marteau', '2 × 12', '60 s', 'Poignets neutres'],
        ],
      },
      {
        key: 'LB', name: 'Bas B', exos: [
          ['Soulevé de terre roumain haltères', '3 × 10', '90 s', 'Jambes quasi tendues, dos plat, étirement ischio'],
          ['Fentes marchées', '3 × 10 / jambe', '90 s', 'Grand pas, genou frôle le sol'],
          ['Leg extension', '3 × 12', '60 s', 'Pause 1 s en haut'],
          ['Mollets assis', '3 × 15', '60 s', 'Amplitude max'],
          ['Gainage latéral', '3 × 20 s / côté', '45 s', 'Hanches hautes'],
        ],
      },
    ],
  },
  {
    id: 2, from: 5, to: 16, title: 'Force & Masse',
    intro: 'Le cœur du programme. 2 séances lourdes (force, 5×5) + 2 séances volume (hypertrophie). Règle : +2,5 kg dès que toutes les séries passent. Échec 2 fois de suite → −10 % et on remonte.',
    sessions: [
      {
        key: 'UF', name: 'Haut Force', exos: [
          ['Développé couché barre', '5 × 5', '3 min', 'Pieds ancrés, légère cambrure, barre au sternum'],
          ['Rowing barre', '5 × 5', '3 min', 'Buste à 45°, tire vers le bas des pecs'],
          ['Développé militaire barre', '3 × 6', '2-3 min', 'Debout, fessiers et abdos verrouillés'],
          ['Tractions', '3 × max', '2 min', 'Assistées si besoin, descente complète'],
        ],
      },
      {
        key: 'LF', name: 'Bas Force', exos: [
          ['Squat barre', '5 × 5', '3 min', 'Barre sur les trapèzes, casse la parallèle'],
          ['Soulevé de terre', '3 × 5', '3 min', 'Dos plat NON NÉGOCIABLE, pousse le sol'],
          ['Presse à cuisses', '3 × 8', '2 min', 'Complément de volume, contrôlé'],
          ['Mollets debout', '4 × 12', '60 s', 'Pause en haut'],
        ],
      },
      {
        key: 'UV', name: 'Haut Volume', exos: [
          ['Développé incliné haltères', '4 × 8-10', '2 min', "Vise le haut de la fourchette avant d'ajouter du poids"],
          ['Tirage vertical prise large', '4 × 8-10', '2 min', 'Contraction 1 s en bas'],
          ['Élévations latérales', '3 × 12-15', '60 s', 'Les épaules font le physique en T'],
          ['Curl barre EZ', '3 × 10-12', '60 s', 'Coudes fixes'],
          ['Extensions triceps poulie', '3 × 10-12', '60 s', 'Coudes collés au corps'],
        ],
      },
      {
        key: 'LV', name: 'Bas Volume', exos: [
          ['Squat avant ou presse', '4 × 8-10', '2 min', 'Plus léger, focus contraction'],
          ['Soulevé de terre roumain', '3 × 8-10', '2 min', 'Étirement ischios, montée par les hanches'],
          ['Fentes bulgares', '3 × 10 / jambe', '90 s', "Pied arrière surélevé — ça pique, c'est normal"],
          ['Leg curl', '3 × 12', '60 s', 'Tempo lent'],
          ['Gainage roulette ou planche lestée', '3 × 10-45 s', '60 s', ''],
        ],
      },
    ],
  },
  {
    id: 3, from: 17, to: 999, title: 'Push · Pull · Legs · Upper',
    intro: 'Split avancé pour maximiser le volume par groupe musculaire. Progression : +1 rep par séance, puis +2,5 kg quand tu atteins le haut de la fourchette partout.',
    sessions: [
      {
        key: 'PU', name: 'Push (pecs · épaules · triceps)', exos: [
          ['Développé couché barre', '4 × 6-8', '2-3 min', 'Ton exo roi, garde-le lourd'],
          ['Développé militaire barre', '4 × 8', '2 min', ''],
          ['Développé incliné haltères', '3 × 10', '90 s', ''],
          ['Élévations latérales', '4 × 12-15', '60 s', 'Drop set sur la dernière série'],
          ['Extensions triceps poulie', '3 × 10-12', '60 s', ''],
        ],
      },
      {
        key: 'PL', name: 'Pull (dos · biceps)', exos: [
          ['Tractions lestées', '4 × 6-8', '2-3 min', 'Leste-toi dès que 4×8 au poids du corps passe'],
          ['Rowing barre', '4 × 8', '2 min', ''],
          ['Tirage horizontal', '3 × 10', '90 s', ''],
          ['Face pull', '3 × 15', '60 s', 'Santé des épaules, ne saute jamais cet exo'],
          ['Curl barre EZ', '3 × 10', '60 s', ''],
        ],
      },
      {
        key: 'LE', name: 'Legs (jambes complètes)', exos: [
          ['Squat barre', '4 × 6-8', '3 min', ''],
          ['Soulevé de terre roumain', '4 × 8', '2-3 min', ''],
          ['Presse à cuisses', '3 × 10', '2 min', ''],
          ['Leg curl', '3 × 12', '60 s', ''],
          ['Mollets debout', '5 × 12', '60 s', ''],
        ],
      },
      {
        key: 'UP', name: 'Upper (rappel haut du corps)', exos: [
          ['Développé couché haltères', '3 × 8', '2 min', 'Plus léger que le push, focus qualité'],
          ['Rowing haltère un bras', '3 × 10 / bras', '90 s', ''],
          ['Développé Arnold', '3 × 10', '90 s', ''],
          ['Curl + triceps en superset', '3 × 12', '60 s', ''],
          ['Gainage lesté', '3 × 45 s', '60 s', ''],
        ],
      },
    ],
  },
]

export const ALT: Record<string, string[]> = {
  'Développé couché haltères': ['Développé couché barre', 'Machine convergente', 'Pompes lestées', 'Développé couché prise serrée', 'Développé couché à la smith machine', 'Écarté couché haltères', 'Développé sur swiss ball', 'Presse pectoraux à la machine'],
  'Développé couché barre': ['Développé couché haltères', 'Machine convergente', 'Pompes lestées', 'Développé couché prise serrée', 'Développé couché à la smith machine', 'Écarté couché haltères', 'Presse pectoraux à la machine', 'Développé au sol (floor press)'],
  'Développé incliné haltères': ['Développé incliné barre', 'Machine convergente inclinée', 'Pompes pieds surélevés', 'Écarté incliné haltères', 'Développé incliné à la smith machine', 'Presse pectoraux incliné machine', 'Développé incliné poulie vis-à-vis'],
  'Rowing poulie basse': ['Rowing machine', 'Rowing barre', 'Tirage horizontal', 'Rowing poulie prise serrée', 'Rowing poulie prise large', 'T-bar row', 'Rowing élastique'],
  'Rowing barre': ['Rowing haltères', 'Rowing machine', 'T-bar row', 'Rowing Yates (prise supination)', 'Rowing Pendlay', 'Rowing poulie basse', 'Rowing landmine'],
  'Rowing haltère un bras': ['Rowing poulie un bras', 'Rowing machine', 'Rowing barre', 'Rowing élastique un bras', 'Rowing banc incliné (chest-supported)'],
  'Tirage horizontal': ['Rowing machine', 'Rowing poulie basse', 'Rowing barre', 'Rowing élastique', 'T-bar row'],
  'Développé militaire haltères': ['Développé militaire barre', 'Machine épaules', 'Développé Arnold', 'Développé assis haltères', 'Élévations frontales', 'Développé militaire poulie'],
  'Développé militaire barre': ['Développé militaire haltères', 'Machine épaules', 'Développé Arnold', 'Développé militaire à la smith machine', 'Push press'],
  'Développé Arnold': ['Développé militaire haltères', 'Machine épaules', 'Développé militaire barre', 'Élévations frontales', 'Développé assis machine'],
  'Tirage vertical': ['Tractions assistées', 'Tirage prise neutre', 'Tractions', 'Tirage vertical prise large', 'Pull-over poulie haute'],
  'Tirage vertical prise large': ['Tractions', 'Tirage prise neutre', 'Tirage vertical', 'Tractions assistées prise large'],
  'Tractions': ['Tirage vertical lourd', 'Tractions assistées', 'Tirage vertical prise large', 'Tractions prise neutre', 'Tractions lestées (plus léger)'],
  'Tractions lestées': ['Tirage vertical lourd', 'Tractions poids du corps (plus de reps)', 'Tractions prise neutre lestées', 'Tirage vertical prise serrée lourd'],
  'Curl biceps + extensions triceps': ['Curl haltères + dips sur banc', 'Curl poulie + extensions poulie', 'Curl marteau + extensions corde'],
  'Curl marteau': ['Curl haltères', 'Curl poulie corde', 'Curl barre EZ', 'Curl marteau à la poulie', 'Curl araignée haltères'],
  'Curl barre EZ': ['Curl haltères', 'Curl poulie', 'Curl marteau', 'Curl barre droite', 'Curl pupitre (Scott)'],
  'Curl + triceps en superset': ['Curl poulie + extensions corde', 'Curl haltères + dips', 'Curl marteau + barre au front'],
  'Extensions triceps poulie': ['Barre au front', 'Dips', 'Extensions nuque haltère', 'Kick-back poulie', 'Extensions corde à la poulie'],
  'Élévations latérales': ['Élévations à la poulie', 'Machine élévations latérales', 'Élévations latérales élastique', 'Élévations latérales banc incliné', 'Élévations latérales à un bras'],
  'Face pull': ['Oiseau haltères', 'Élévations arrière machine', 'Élévations arrière poulie vis-à-vis', 'Rowing prise large (arrière d’épaule)'],
  'Squat gobelet (haltère)': ['Presse à cuisses', 'Squat au poids du corps + sac lesté', 'Squat kettlebell', 'Fentes gobelet'],
  'Squat barre': ['Presse à cuisses lourde', 'Hack squat', 'Squat gobelet lourd', 'Squat à la smith machine', 'Front squat', 'Squat safety bar'],
  'Squat avant ou presse': ['Presse à cuisses', 'Hack squat', 'Squat gobelet', 'Squat à la smith machine'],
  'Presse à cuisses': ['Squat gobelet', 'Hack squat', 'Squat barre léger', 'Presse unilatérale'],
  'Soulevé de terre': ['Rack pull', 'Soulevé de terre trap bar', 'Hip thrust lourd', 'Soulevé de terre sumo', 'Good morning'],
  'Soulevé de terre roumain': ['Leg curl lourd', 'Extensions au banc à lombaires lestées', 'SDT roumain haltères', 'Hip thrust', 'Good morning léger'],
  'Soulevé de terre roumain haltères': ['Leg curl', 'Extensions au banc à lombaires', 'SDT roumain barre', 'Hip thrust'],
  'Fentes marchées': ['Fentes bulgares', 'Presse unilatérale', 'Fentes fixes', 'Step-up avec haltères'],
  'Fentes bulgares': ['Fentes marchées', 'Presse unilatérale', 'Fentes fixes', 'Step-up avec haltères'],
  'Leg curl allongé': ['Leg curl assis', 'SDT roumain léger', 'Leg curl debout unilatéral'],
  'Leg curl': ['Leg curl assis', 'SDT roumain léger', 'Leg curl allongé', 'Leg curl debout unilatéral'],
  'Leg extension': ['Squat gobelet léger', 'Presse pieds bas', 'Fentes légères'],
  'Mollets debout': ['Mollets à la presse', 'Mollets assis', 'Mollets sur step (poids du corps)', 'Mollets unilatéral haltère'],
  'Mollets assis': ['Mollets debout', 'Mollets à la presse', 'Mollets sur step (poids du corps)'],
  'Planche': ['Crunchs', 'Relevés de jambes suspendu', 'Gainage latéral', 'Roulette abdominale', 'Crunchs à la poulie'],
  'Gainage latéral': ['Planche', 'Pallof press', 'Crunchs obliques', 'Bûcheron à la poulie'],
  'Gainage lesté': ['Planche lestée', 'Crunchs à la poulie', 'Roulette abdominale', 'Relevés de jambes lestés'],
  'Gainage roulette ou planche lestée': ['Planche lestée', 'Crunchs à la poulie', 'Relevés de jambes suspendu lestés'],
}
