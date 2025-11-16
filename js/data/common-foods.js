/**
 * ======================================================================
 * COMMON FOODS DATABASE
 * ======================================================================
 * 
 * Comprehensive Brazilian food database with nutritional information:
 * - LiveUp Marmitas: Pre-packaged meal options
 * - Common Foods: Brazilian foods organized by category
 *   - Proteínas (Proteins)
 *   - Carboidratos (Carbohydrates)
 *   - Gorduras (Fats)
 *   - Vegetais (Vegetables)
 * 
 * Nutritional values based on TACO (Brazilian Food Composition Table)
 * Values are per 100g unless otherwise specified
 * ======================================================================
 */

const livUpMarmitas = [
  { name: 'Frango cremoso, arroz, feijão e brócolis no vapor', category: 'Dia a dia', size: '300g', kcal: '', prot: '', fat: '', notes: '' },
  { name: 'Almôndega de frango, arroz 7 grãos', category: 'Baixa caloria até 350kcal', size: '300g', kcal: '340', prot: '28', fat: '9', notes: '' },
  { name: 'Feijoada light', category: 'Dia a dia', size: '300g', kcal: '', prot: '', fat: '', notes: '' },
  { name: 'Carne louca com purê de mandioquinha', category: 'Dia a dia', size: '300g', kcal: '', prot: '', fat: '', notes: '' },
  { name: 'Frango grelhado com legumes', category: 'Baixa caloria', size: '300g', kcal: '320', prot: '30', fat: '7', notes: '' },
  { name: 'Salmão com quinoa e vegetais', category: 'Premium', size: '300g', kcal: '480', prot: '34', fat: '20', notes: '' },
  { name: 'Bife de soja com arroz integral', category: 'Vegetariano', size: '300g', kcal: '', prot: '', fat: '', notes: '' },
  { name: 'Picadinho de carne com batata doce', category: 'Dia a dia', size: '300g', kcal: '', prot: '', fat: '', notes: '' },
  { name: 'Omelete de legumes com salada', category: 'Baixa caloria', size: '300g', kcal: '', prot: '', fat: '', notes: '' },
  { name: 'Peito de peru com couscous marroquino', category: 'Dia a dia', size: '300g', kcal: '', prot: '', fat: '', notes: '' },
  { name: 'Frango com limão siciliano, arroz jasmim e brócolis', category: 'Dia a dia', size: '380g', kcal: '444', prot: '36', fat: '12', notes: '' },
  { name: 'Saint Peter com cebolinha, arroz jasmim e cenoura', category: 'Dia a dia', size: '380g', kcal: '426', prot: '25', fat: '14', notes: '' },
  { name: 'Falafel, couscous e legumes mediterrâneos', category: 'Vegetariano', size: '300g', kcal: '', prot: '', fat: '', notes: '' },
  { name: 'Lentilha pomodoro, arroz de jasmim e brócolis', category: 'Vegetariano', size: '300g', kcal: '', prot: '', fat: '', notes: '' },
  { name: 'Estrogonofe de cogumelo, arroz integral', category: 'Vegetariano', size: '300g', kcal: '', prot: '', fat: '', notes: '' },
  { name: 'Iscas de filé mignon acebolado', category: 'Premium', size: '300g', kcal: '', prot: '', fat: '', notes: '' },
  { name: 'Posta de salmão assado', category: 'Premium', size: '300g', kcal: '', prot: '', fat: '', notes: '' },
  { name: 'Bolinha low carb de abóbora e carne com chia', category: 'Low Carb', size: '300g', kcal: '', prot: '', fat: '', notes: '' },
  { name: 'Frango oriental, arroz com amêndoas e legumes', category: 'Performance', size: '580g', kcal: '', prot: '', fat: '', notes: '' },
  { name: 'Carne moída, arroz e vegetais', category: 'Performance', size: '580g', kcal: '', prot: '', fat: '', notes: '' },
  { name: 'Peito de frango grelhado com batata doce e brócolis', category: 'Performance', size: '500g', kcal: '600', prot: '48', fat: '12', notes: '' },
  { name: 'Tilápia ao forno com legumes e arroz integral', category: 'Dia a dia', size: '350g', kcal: '420', prot: '32', fat: '10', notes: '' },
  { name: 'Estrogonofe de frango com arroz integral', category: 'Dia a dia', size: '350g', kcal: '520', prot: '36', fat: '18', notes: '' },
  { name: 'Quinoa bowl com grão-de-bico e legumes', category: 'Vegetariano', size: '350g', kcal: '420', prot: '18', fat: '14', notes: '' },
  { name: 'Bife acebolado com purê de batata doce', category: 'Dia a dia', size: '400g', kcal: '650', prot: '45', fat: '28', notes: '' }
];

const commonFoods = {
  proteinas: [
    { name: 'Peito de frango (cru)', prot: 31, carb: 0, fat: 3.6, per: 100, unit: 'g', kcal: 165 },
    { name: 'Peito de frango (grelhado)', prot: 32, carb: 0, fat: 3.8, per: 100, unit: 'g', kcal: 172 },
    { name: 'Tilápia (crua)', prot: 26, carb: 0, fat: 3, per: 100, unit: 'g', kcal: 129 },
    { name: 'Ovo inteiro (cozido)', prot: 6.3, carb: 0.6, fat: 5, per: 1, unit: 'unidade (50g)', kcal: 72 },
    { name: 'Clara de ovo (cozida)', prot: 3.6, carb: 0.2, fat: 0.1, per: 1, unit: 'unidade (33g)', kcal: 17 },
    { name: 'Carne bovina magra (patinho)', prot: 26, carb: 0, fat: 8, per: 100, unit: 'g', kcal: 180 },
    { name: 'Carne moída (20% gordura)', prot: 20, carb: 0, fat: 15, per: 100, unit: 'g', kcal: 220 },
    { name: 'Atum em lata (conserva)', prot: 24, carb: 0, fat: 1, per: 100, unit: 'g', kcal: 116 },
    { name: 'Salmão (cru)', prot: 20, carb: 0, fat: 13, per: 100, unit: 'g', kcal: 208 },
    { name: 'Whey protein (isolado)', prot: 25, carb: 3, fat: 1.5, per: 30, unit: 'g (1 scoop)', kcal: 120 },
    { name: 'Queijo cottage', prot: 12, carb: 3, fat: 4, per: 100, unit: 'g', kcal: 98 },
    { name: 'Iogurte grego natural', prot: 10, carb: 4, fat: 5, per: 100, unit: 'g', kcal: 97 },
    { name: 'Feijão preto (cozido)', prot: 4.5, carb: 14, fat: 0.5, per: 100, unit: 'g', kcal: 77 },
    { name: 'Lentilha (cozida)', prot: 9, carb: 20, fat: 0.4, per: 100, unit: 'g', kcal: 116 },
    { name: 'Grão-de-bico (cozido)', prot: 8.9, carb: 27.4, fat: 2.6, per: 100, unit: 'g', kcal: 164 },
  ],
  carboidratos: [
    { name: 'Arroz branco (cozido)', prot: 2.5, carb: 28, fat: 0.3, per: 100, unit: 'g', kcal: 130 },
    { name: 'Arroz integral (cozido)', prot: 2.6, carb: 23, fat: 0.9, per: 100, unit: 'g', kcal: 111 },
    { name: 'Batata doce (cozida)', prot: 1.6, carb: 20, fat: 0.1, per: 100, unit: 'g', kcal: 86 },
    { name: 'Batata inglesa (cozida)', prot: 2, carb: 17, fat: 0.1, per: 100, unit: 'g', kcal: 77 },
    { name: 'Mandioca/Aipim (cozida)', prot: 0.6, carb: 30, fat: 0.3, per: 100, unit: 'g', kcal: 125 },
    { name: 'Aveia em flocos', prot: 13.9, carb: 66.3, fat: 6.9, per: 100, unit: 'g', kcal: 394 },
    { name: 'Pão francês', prot: 8, carb: 58, fat: 3.1, per: 50, unit: 'g (1 unid)', kcal: 300 },
    { name: 'Pão integral', prot: 9, carb: 49, fat: 3.5, per: 100, unit: 'g', kcal: 265 },
    { name: 'Macarrão (cozido)', prot: 5, carb: 30, fat: 0.9, per: 100, unit: 'g', kcal: 157 },
    { name: 'Tapioca (crepioca)', prot: 0.2, carb: 26, fat: 0, per: 100, unit: 'g', kcal: 98 },
    { name: 'Banana (prata)', prot: 1.3, carb: 26, fat: 0.1, per: 100, unit: 'g', kcal: 98 },
    { name: 'Maçã', prot: 0.3, carb: 14, fat: 0.2, per: 100, unit: 'g', kcal: 52 },
    { name: 'Quinoa (cozida)', prot: 4.4, carb: 21.3, fat: 1.9, per: 100, unit: 'g', kcal: 120 },
  ],
  gorduras: [
    { name: 'Azeite de oliva extra virgem', prot: 0, carb: 0, fat: 13.5, per: 15, unit: 'ml (1 col sopa)', kcal: 120 },
    { name: 'Óleo de coco', prot: 0, carb: 0, fat: 13.6, per: 15, unit: 'ml (1 col sopa)', kcal: 120 },
    { name: 'Manteiga', prot: 0.6, carb: 0.1, fat: 11.5, per: 15, unit: 'g (1 col sopa)', kcal: 102 },
    { name: 'Amendoim', prot: 26, carb: 16, fat: 49, per: 100, unit: 'g', kcal: 567 },
    { name: 'Pasta de amendoim', prot: 25, carb: 20, fat: 50, per: 100, unit: 'g', kcal: 588 },
    { name: 'Castanha do Pará', prot: 14, carb: 12, fat: 67, per: 100, unit: 'g', kcal: 656 },
    { name: 'Castanha de caju', prot: 18, carb: 30, fat: 43, per: 100, unit: 'g', kcal: 553 },
    { name: 'Amêndoas', prot: 21, carb: 22, fat: 50, per: 100, unit: 'g', kcal: 579 },
    { name: 'Abacate', prot: 2, carb: 9, fat: 15, per: 100, unit: 'g', kcal: 160 },
    { name: 'Coco ralado', prot: 3.3, carb: 15, fat: 33, per: 100, unit: 'g', kcal: 354 },
    { name: 'Semente de chia', prot: 17, carb: 42, fat: 31, per: 100, unit: 'g', kcal: 486 },
    { name: 'Semente de linhaça', prot: 18, carb: 29, fat: 42, per: 100, unit: 'g', kcal: 534 },
  ],
  vegetais: [
    { name: 'Brócolis (cozido)', prot: 2.4, carb: 4, fat: 0.4, per: 100, unit: 'g', kcal: 35 },
    { name: 'Couve-flor (cozida)', prot: 1.8, carb: 2.3, fat: 0.5, per: 100, unit: 'g', kcal: 23 },
    { name: 'Espinafre (cru)', prot: 2.9, carb: 1.4, fat: 0.4, per: 100, unit: 'g', kcal: 23 },
    { name: 'Alface', prot: 1.4, carb: 2.3, fat: 0.2, per: 100, unit: 'g', kcal: 15 },
    { name: 'Tomate', prot: 1.1, carb: 3.9, fat: 0.2, per: 100, unit: 'g', kcal: 18 },
    { name: 'Cenoura (crua)', prot: 0.9, carb: 10, fat: 0.2, per: 100, unit: 'g', kcal: 41 },
    { name: 'Abóbora (cozida)', prot: 1.2, carb: 6.5, fat: 0.1, per: 100, unit: 'g', kcal: 30 },
  ]
};

console.log('✅ Common Foods database loaded (LiveUp Marmitas + Brazilian Foods by category)');
