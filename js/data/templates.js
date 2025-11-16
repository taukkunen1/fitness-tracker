/**
 * ======================================================================
 * WORKOUT TEMPLATES
 * ======================================================================
 * 
 * Science-based workout templates:
 * - Treino 1: Upper Body (Chest, Back, Shoulders, Arms)
 * - Treino 2: Lower Body (Legs, Glutes, Calves, Abs)
 * 
 * Based on research from:
 * - Morton 2021: Volume and Hypertrophy
 * - Schoenfeld 2023: Protein timing and hypertrophy
 * - Curovic 2025: Metabolic stress techniques
 * - Wang 2024: Creatine supplementation
 * ======================================================================
 */

const templates = {
  treino_1: {
    id: 'treino_1',
    name: 'Treino 1 - Upper Body',
    description: 'Peitoral, Costas, Ombros, Bíceps e Tríceps',
    sessions: {
      A: {
        name: 'Treino 1',
        exercises: [
          { name: 'Mobilidade Torácica em Pé', sets: 2, reps: '', rest: 60, notes: 'Mobilidade não precisa de reps' },
          { name: 'Supino Inclinado com Halteres', sets: 3, reps: '3', rest: 90, notes: '' },
          { name: 'Crucifixo na Máquina', sets: 3, reps: '3', rest: 60, notes: '' },
          { name: 'Puxada na Barra Frente', sets: 3, reps: '3', rest: 90, notes: '' },
          { name: 'Remada Unilateral na Máquina', sets: 3, reps: '3', rest: 60, notes: '' },
          { name: 'Bi-set: Desenvolvimento Arnold + Elevação Lateral', sets: 3, reps: '3', rest: 90, notes: 'Bi-set completo conta como 1 série' },
          { name: 'Bi-set: Rosca Alternada + Rosca Polia Baixa', sets: 3, reps: '3', rest: 60, notes: 'Bi-set completo conta como 1 série' },
          { name: 'Bi-set: Tríceps Testa Polia Alta + Tríceps Corda', sets: 3, reps: '3', rest: 60, notes: 'Bi-set completo conta como 1 série' }
        ],
        notes: 'Treino completo de upper body',
        primaryMuscles: ['Peitoral', 'Dorsal', 'Ombros', 'Bíceps', 'Tríceps']
      }
    },
    referencesTags: ['training','upper-body']
  },

  treino_2: {
    id: 'treino_2',
    name: 'Treino 2 - Lower Body',
    description: 'Pernas, Glúteo, Panturrilha e Abdome',
    sessions: {
      A: {
        name: 'Treino 2',
        exercises: [
          { name: 'Mobilidade - Quadril (lateral)', sets: 2, reps: '', rest: 60, notes: 'Mobilidade não precisa de reps' },
          { name: 'Mobilidade Quadril Cócoras', sets: 2, reps: '', rest: 60, notes: 'Mobilidade não precisa de reps' },
          { name: 'Agachamento (multi)', sets: 3, reps: '3', rest: 120, notes: '' },
          { name: 'Leg Press Horizontal (Subindo A Carga)', sets: 3, reps: '3', rest: 90, notes: 'Aumentar carga progressivamente' },
          { name: 'Agachamento (hack)', sets: 3, reps: '3', rest: 90, notes: '' },
          { name: 'Mesa Flexora (simultânea)', sets: 3, reps: '3', rest: 60, notes: '' },
          { name: 'Cadeira Abdutora', sets: 3, reps: '3', rest: 60, notes: '' },
          { name: 'Cadeira Adutora', sets: 3, reps: '3', rest: 60, notes: '' },
          { name: 'Cadeira Extensora (simultânea)', sets: 3, reps: '3', rest: 60, notes: '' },
          { name: 'Panturrilha (sentado)', sets: 3, reps: '3', rest: 60, notes: '' }
        ],
        notes: 'Treino completo de lower body',
        primaryMuscles: ['Abdutores', 'Anterior de coxa', 'Dorsal', 'Glúteo', 'Panturrilha', 'Posterior de coxa', 'Quadríceps']
      }
    },
    referencesTags: ['training','legs','lower-body']
  }
};

/**
 * Scientific studies references for workout programming
 */
const scientificStudiesSeed = [
  { id: 'ref_phillips_2022', authors: 'Phillips SM. et al.', year: 2022, title: 'Protein Requirements and Muscle Mass/Strength in Athletes', journal: 'Sports Medicine', link: 'https://doi.org/10.1007/s40279-022-01680-9', tags: ['nutrition','protein'], summary: 'Revisão: recomendações de proteína 1.6–2.2 g/kg/d e distribuição.' },
  { id: 'ref_schoenfeld_2023', authors: 'Schoenfeld BJ., Krieger JW.', year: 2023, title: 'Protein timing meta-analysis', journal: 'Journal of the International Society of Sports Nutrition', link: 'https://doi.org/10.1186/s12970-023-00496-7', tags: ['nutrition','protein','timing'], summary: 'Timing útil, total diário é determinante.' },
  { id: 'ref_morton_2021', authors: 'Morton RW. et al.', year: 2021, title: 'Resistance Training Volume Enhances Muscle Hypertrophy but Not Strength in Trained Men', journal: 'Medicine & Science in Sports & Exercise', link: 'https://doi.org/10.1249/MSS.0000000000002585', tags: ['training','volume','hypertrophy'], summary: 'Volume correlaciona com hipertrofia.' },
  { id: 'ref_nutrients_creatine_2024', authors: 'Wang Z. et al.', year: 2024, title: 'Effects of Creatine Supplementation and Resistance Training on Muscle Strength Gains in Adults <50 Years', journal: 'Nutrients', link: 'https://www.mdpi.com/2072-6643/16/21/3665', tags: ['supplement','creatine'], summary: 'Creatina consistente para força/hipertrofia.' },
  { id: 'ref_bilsborough_2020', authors: 'Bilsborough SA., Crowe TC.', year: 2020, title: 'Low‑Carbohydrate Diets and Body Composition: Implications for Resistance Trained Athletes', journal: 'Nutrients', link: 'https://www.mdpi.com/2072-6643/12/10/3105', tags: ['nutrition','diet'], summary: 'Discussão sobre low-carb em atletas.' },
  { id: 'ref_frontiers_2025', authors: 'Curovic I.', year: 2025, title: 'The role of resistance exercise-induced local metabolic stress...', journal: 'Frontiers in Physiology', link: 'https://www.frontiersin.org/articles/10.3389/fphys.2025.1549609/full', tags: ['training','metabolic-stress'], summary: 'Técnicas de estresse metabólico (BFR, supersets).' },
  { id: 'ref_jhpn_2025', authors: 'Chen W.', year: 2025, title: 'Nutritional interventions in muscle hypertrophy research: a scientometric analysis (1992–2025)', journal: 'Journal of Health, Population and Nutrition', link: 'https://jhpn.biomedcentral.com/articles/10.1186/s41043-025-01031-w', tags: ['nutrition','review'], summary: 'Mapeamento das intervenções nutricionais em hipertrofia.' },
  { id: 'ref_xie_2025', authors: 'Xie Y. et al.', year: 2025, title: 'Comparing exercise modalities during caloric restriction', journal: 'Systematic Review', link: 'https://pubmed.ncbi.nlm.nih.gov/39185113/', tags: ['training','diet','restriction'], summary: 'Combinar RT e aeróbico preserva massa magra.' },
  { id: 'ref_maturitas_2025', authors: 'Various', year: 2025, title: 'RT effects on glycemic control & body composition in older adults with T2D', journal: 'Maturitas', link: 'https://www.maturitas.org/article/S0378-5122(25)00499-2/fulltext', tags: ['training','clinical'], summary: 'RT melhora composição e marcadores metabólicos.' },
  { id: 'ref_strongerbyscience_2024', authors: 'StrongerByScience', year: 2024, title: 'Muscle Growth: Master List', journal: 'Resource', link: 'https://www.strongerbyscience.com/master-list/muscle-growth/', tags: ['review','meta-analysis'], summary: 'Compilação de meta-análises sobre hipertrofia.' },
  { id: 'ref_almeida_2024', authors: 'Almeida NC. et al.', year: 2024, title: 'Análise das estratégias de nutrição e suplementação na recomposição corporal', journal: 'Revista Fisioterapia em Movimento', link: 'https://revistaft.com.br/analise-das-estrategias-de-nutricao-e-suplmentacao-na-recomposicao-corporal-em-praticantes-de-musculacao/', tags: ['nutrition','supplement','pt'], summary: 'Revisão em PT sobre suplementação.' }
];

console.log('✅ Workout Templates loaded (Treino 1, Treino 2) + Scientific Studies');
