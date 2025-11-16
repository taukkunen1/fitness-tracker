/**
 * Exercise Library
 * Comprehensive list of exercises with categories and equipment
 * @module data/exercise-library
 */

const EXERCISE_LIBRARY = [
  // Peito
  { name: 'Supino reto', category: 'Peito', equipment: 'Barra' },
  { name: 'Supino inclinado', category: 'Peito', equipment: 'Barra' },
  { name: 'Supino declinado', category: 'Peito', equipment: 'Barra' },
  { name: 'Crucifixo', category: 'Peito', equipment: 'Halteres' },
  { name: 'Fly (peck deck)', category: 'Peito', equipment: 'Máquina' },
  { name: 'Flexão', category: 'Peito', equipment: 'Peso corporal' },
  
  // Costas
  { name: 'Barra fixa', category: 'Costas', equipment: 'Peso corporal' },
  { name: 'Puxada frontal', category: 'Costas', equipment: 'Máquina' },
  { name: 'Remada curvada', category: 'Costas', equipment: 'Barra' },
  { name: 'Remada unilateral', category: 'Costas', equipment: 'Halter' },
  { name: 'Remada sentado', category: 'Costas', equipment: 'Máquina' },
  { name: 'Levantamento terra', category: 'Costas', equipment: 'Barra' },
  { name: 'Pullover', category: 'Costas', equipment: 'Halter' },
  
  // Ombros
  { name: 'Desenvolvimento militar', category: 'Ombros', equipment: 'Barra' },
  { name: 'Desenvolvimento com halteres', category: 'Ombros', equipment: 'Halteres' },
  { name: 'Elevação lateral', category: 'Ombros', equipment: 'Halteres' },
  { name: 'Elevação frontal', category: 'Ombros', equipment: 'Halteres' },
  { name: 'Remada alta', category: 'Ombros', equipment: 'Barra' },
  { name: 'Crucifixo inverso', category: 'Ombros', equipment: 'Halteres' },
  
  // Bíceps
  { name: 'Rosca direta', category: 'Bíceps', equipment: 'Barra' },
  { name: 'Rosca alternada', category: 'Bíceps', equipment: 'Halteres' },
  { name: 'Rosca martelo', category: 'Bíceps', equipment: 'Halteres' },
  { name: 'Rosca concentrada', category: 'Bíceps', equipment: 'Halter' },
  { name: 'Rosca scott', category: 'Bíceps', equipment: 'Barra W' },
  
  // Tríceps
  { name: 'Tríceps testa', category: 'Tríceps', equipment: 'Barra' },
  { name: 'Tríceps francês', category: 'Tríceps', equipment: 'Halter' },
  { name: 'Tríceps corda', category: 'Tríceps', equipment: 'Polia' },
  { name: 'Tríceps banco', category: 'Tríceps', equipment: 'Peso corporal' },
  { name: 'Mergulho', category: 'Tríceps', equipment: 'Paralelas' },
  
  // Pernas
  { name: 'Agachamento livre', category: 'Pernas', equipment: 'Barra' },
  { name: 'Leg press 45°', category: 'Pernas', equipment: 'Máquina' },
  { name: 'Cadeira extensora', category: 'Pernas', equipment: 'Máquina' },
  { name: 'Cadeira flexora', category: 'Pernas', equipment: 'Máquina' },
  { name: 'Stiff', category: 'Pernas', equipment: 'Barra' },
  { name: 'Avanço (afundo)', category: 'Pernas', equipment: 'Halteres' },
  { name: 'Agachamento sumô', category: 'Pernas', equipment: 'Halter' },
  { name: 'Panturrilha em pé', category: 'Pernas', equipment: 'Máquina' },
  { name: 'Panturrilha sentado', category: 'Pernas', equipment: 'Máquina' },
  
  // Abdômen
  { name: 'Abdominal supra', category: 'Abdômen', equipment: 'Peso corporal' },
  { name: 'Abdominal infra', category: 'Abdômen', equipment: 'Peso corporal' },
  { name: 'Prancha', category: 'Abdômen', equipment: 'Peso corporal' },
  { name: 'Abdominal oblíquo', category: 'Abdômen', equipment: 'Peso corporal' },
  { name: 'Roda abdominal', category: 'Abdômen', equipment: 'Roda' }
];

console.log('✅ Exercise library loaded');
