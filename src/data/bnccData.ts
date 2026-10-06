/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BnccPair, DifficultyLevel, GrammarQuestion, MathChallenge, Mission, Badge } from '../types';

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    level: 1,
    name: 'Nível 1',
    pairs: 4,
    timeLimit: 75,
    badge: '🟢 Fácil',
    description: '4 pares • 8 cartas • 75 segundos'
  },
  {
    level: 2,
    name: 'Nível 2',
    pairs: 6,
    timeLimit: 60,
    badge: '🟡 Médio',
    description: '6 pares • 12 cartas • 60 segundos'
  },
  {
    level: 3,
    name: 'Nível 3',
    pairs: 8,
    timeLimit: 45,
    badge: '🔴 Craque',
    description: '8 pares • 16 cartas • 45 segundos'
  }
];

export const PARES_MATEMATICA: BnccPair[] = [
  {
    id: 'mat_1',
    subject: 'matematica',
    prompt: '1/2',
    promptLabel: 'Fração',
    match: '0,5',
    matchLabel: 'Decimal',
    bncc: 'EF05MA07',
    description: '1 dividido por 2 equivale a metade (cinco décimos).'
  },
  {
    id: 'mat_2',
    subject: 'matematica',
    prompt: '1/4',
    promptLabel: 'Fração',
    match: '0,25',
    matchLabel: 'Decimal',
    bncc: 'EF05MA07',
    description: '1 dividido por 4 equivale a vinte e cinco centésimos.'
  },
  {
    id: 'mat_3',
    subject: 'matematica',
    prompt: '3/4',
    promptLabel: 'Fração',
    match: '0,75',
    matchLabel: 'Decimal',
    bncc: 'EF05MA07',
    description: '3 partes de 4 equivalem a setenta e cinco centésimos.'
  },
  {
    id: 'mat_4',
    subject: 'matematica',
    prompt: '1/10',
    promptLabel: 'Fração',
    match: '0,1',
    matchLabel: 'Decimal',
    bncc: 'EF05MA07',
    description: '1 décimo é representado na forma decimal como 0,1.'
  },
  {
    id: 'mat_5',
    subject: 'matematica',
    prompt: '1/4 de 20',
    promptLabel: 'Cálculo',
    match: '5',
    matchLabel: 'Resultado',
    bncc: 'EF05MA08',
    description: 'Para calcular 1/4 de 20, divide-se 20 por 4 = 5.'
  },
  {
    id: 'mat_6',
    subject: 'matematica',
    prompt: '0,3 + 0,7',
    promptLabel: 'Operação',
    match: '1,0',
    matchLabel: 'Total',
    bncc: 'EF05MA07',
    description: 'Três décimos mais sete décimos totalizam dez décimos (1 inteiro).'
  },
  {
    id: 'mat_7',
    subject: 'matematica',
    prompt: '1/5',
    promptLabel: 'Fração',
    match: '0,2',
    matchLabel: 'Decimal',
    bncc: 'EF05MA07',
    description: '1 dividido por 5 equivale a dois décimos (0,2).'
  },
  {
    id: 'mat_8',
    subject: 'matematica',
    prompt: '50% de 80',
    promptLabel: 'Porcentagem',
    match: '40',
    matchLabel: 'Valor',
    bncc: 'EF05MA08',
    description: '50% é a metade; metade de 80 é 40.'
  },
  {
    id: 'mat_9',
    subject: 'matematica',
    prompt: '2/10',
    promptLabel: 'Fração',
    match: '0,2',
    matchLabel: 'Decimal',
    bncc: 'EF05MA07',
    description: 'Dois décimos equivalem a 0,2 (simplificado: 1/5).'
  },
  {
    id: 'mat_10',
    subject: 'matematica',
    prompt: '1/2 de 50',
    promptLabel: 'Cálculo',
    match: '25',
    matchLabel: 'Resultado',
    bncc: 'EF05MA08',
    description: 'Metade de 50 é igual a 25.'
  }
];

export const PARES_PORTUGUES: BnccPair[] = [
  {
    id: 'port_1',
    subject: 'portugues',
    prompt: 'Ponto de Exclamação (!)',
    promptLabel: 'Pontuação',
    match: 'Indica surpresa, admiração ou emoção',
    matchLabel: 'Função',
    bncc: 'EF05LP04',
    description: 'Expressa sentimentos e emoções fortes no discurso.'
  },
  {
    id: 'port_2',
    subject: 'portugues',
    prompt: 'Ponto de Interrogação (?)',
    promptLabel: 'Pontuação',
    match: 'Indica uma pergunta direta',
    matchLabel: 'Função',
    bncc: 'EF05LP04',
    description: 'Utilizado para finalizar frases interrogativas diretas.'
  },
  {
    id: 'port_3',
    subject: 'portugues',
    prompt: 'Dois-pontos (:)',
    promptLabel: 'Pontuação',
    match: 'Anuncia a fala de alguém ou uma lista',
    matchLabel: 'Função',
    bncc: 'EF05LP04',
    description: 'Prepara a fala de personagem ou uma enumeração de itens.'
  },
  {
    id: 'port_4',
    subject: 'portugues',
    prompt: 'Travessão (—)',
    promptLabel: 'Pontuação',
    match: 'Marca o início da fala do personagem',
    matchLabel: 'Função',
    bncc: 'EF05LP04',
    description: 'Sinaliza falas em diálogos no discurso direto.'
  },
  {
    id: 'port_5',
    subject: 'portugues',
    prompt: 'Vírgula (,)',
    promptLabel: 'Pontuação',
    match: 'Separa itens de uma lista ou enumeração',
    matchLabel: 'Função',
    bncc: 'EF05LP04',
    description: 'Pausa breve usada para separar termos coordenados ou vocativos.'
  },
  {
    id: 'port_6',
    subject: 'portugues',
    prompt: 'Conectivo "PORÉM"',
    promptLabel: 'Coesão',
    match: 'Ideia de oposição ou contraste',
    matchLabel: 'Sentido',
    bncc: 'EF05LP07',
    description: 'Conjunção adversativa que indica contraste.'
  },
  {
    id: 'port_7',
    subject: 'portugues',
    prompt: 'Reticências (...)',
    promptLabel: 'Pontuação',
    match: 'Indica interrupção ou suspensão de ideia',
    matchLabel: 'Função',
    bncc: 'EF05LP04',
    description: 'Marcam hesitação, continuidade oculta ou suspense.'
  },
  {
    id: 'port_8',
    subject: 'portugues',
    prompt: 'Conectivo "PORTANTO"',
    promptLabel: 'Coesão',
    match: 'Ideia de conclusão ou consequência',
    matchLabel: 'Sentido',
    bncc: 'EF05LP07',
    description: 'Conjunção conclusiva usada para fechar o raciocínio.'
  },
  {
    id: 'port_9',
    subject: 'portugues',
    prompt: 'Ponto Final (.)',
    promptLabel: 'Pontuação',
    match: 'Encerra o pensamento de uma frase declarativa',
    matchLabel: 'Função',
    bncc: 'EF05LP04',
    description: 'Marca o término completo de uma oração declarativa.'
  },
  {
    id: 'port_10',
    subject: 'portugues',
    prompt: 'Conectivo "PORQUE"',
    promptLabel: 'Coesão',
    match: 'Ideia de explicação ou motivo',
    matchLabel: 'Sentido',
    bncc: 'EF05LP07',
    description: 'Conjunção explicativa ou causal que justifica um fato.'
  }
];

export const QUESTOES_GRAMATICA: GrammarQuestion[] = [
  {
    id: 'g1',
    sentence: 'O menino queria muito brincar lá fora no parque, ___ começou a chover forte.',
    options: ['porém', 'portanto', 'porque', 'onde'],
    correctOption: 'porém',
    bncc: 'EF05LP07',
    explanation: 'O conectivo "porém" estabelece uma relação de oposição ou contraste entre a vontade de brincar e a chuva.',
    category: 'Coesão'
  },
  {
    id: 'g2',
    sentence: 'A professora olhou sorridente para a turma e anunciou ___ "Amanhã teremos uma aula especial no museu!"',
    options: [': (dois-pontos)', ', (vírgula)', '? (interrogação)', '— (travessão)'],
    correctOption: ': (dois-pontos)',
    bncc: 'EF05LP04',
    explanation: 'Os dois-pontos anunciam a fala de alguém ou uma citação direta.',
    category: 'Pontuação'
  },
  {
    id: 'g3',
    sentence: '— Olá, Pedro! Você conseguiu resolver os cálculos de frações da lição de casa ___',
    options: ['? (interrogação)', '! (exclamação)', '. (ponto final)', ': (dois-pontos)'],
    correctOption: '? (interrogação)',
    bncc: 'EF05LP04',
    explanation: 'A oração constitui uma pergunta direta, devendo ser encerrada com o ponto de interrogação.',
    category: 'Pontuação'
  },
  {
    id: 'g4',
    sentence: 'Todos os alunos estudaram com afinco e revisaram os conteúdos, ___ tiraram excelentes notas.',
    options: ['portanto', 'porém', 'embora', 'mas'],
    correctOption: 'portanto',
    bncc: 'EF05LP07',
    explanation: '"Portanto" é uma conjunção conclusiva que expressa a consequência lógica do estudo.',
    category: 'Coesão'
  },
  {
    id: 'g5',
    sentence: '— Que vista incrível e deslumbrante ___ exclamou Lucas do alto da montanha.',
    options: ['! (exclamação)', '? (interrogação)', ', (vírgula)', '... (reticências)'],
    correctOption: '! (exclamação)',
    bncc: 'EF05LP04',
    explanation: 'O ponto de exclamação sinaliza forte emoção, entusiasmo e admiração.',
    category: 'Pontuação'
  },
  {
    id: 'g6',
    sentence: 'Na mochila de Mariana havia estojo ___ caderno, livro didático e régua.',
    options: [', (vírgula)', '! (exclamação)', '? (interrogação)', '— (travessão)'],
    correctOption: ', (vírgula)',
    bncc: 'EF05LP04',
    explanation: 'A vírgula é empregada para separar elementos de uma mesma enumeração.',
    category: 'Pontuação'
  },
  {
    id: 'g7',
    sentence: 'Não fomos ao torneio de esportes na quadra ___ ela estava recebendo nova pintura.',
    options: ['porque', 'portanto', 'porém', 'contudo'],
    correctOption: 'porque',
    bncc: 'EF05LP07',
    explanation: '"Porque" introduz a explicação ou o motivo de não terem ido ao torneio.',
    category: 'Coesão'
  },
  {
    id: 'g8',
    sentence: 'O detetive olhou fixamente para as pistas e sussurrou: "E quem estava na sala era ___"',
    options: ['... (reticências)', '! (exclamação)', '? (interrogação)', ', (vírgula)'],
    correctOption: '... (reticências)',
    bncc: 'EF05LP04',
    explanation: 'As reticências indicam suspensão da fala, hesitação ou efeito de mistério/suspense.',
    category: 'Pontuação'
  }
];

export const DESAFIOS_MATEMATICA: MathChallenge[] = [
  {
    id: 'm1',
    prompt: 'Qual representação decimal equivale à fração 1/2?',
    options: ['0,5', '0,2', '0,25', '1,2'],
    correctOption: '0,5',
    bncc: 'EF05MA07',
    explanation: '1 dividido por 2 é igual a 0,5 (metade).',
    category: 'Frações'
  },
  {
    id: 'm2',
    prompt: 'Quanto vale 1/4 da quantidade 20?',
    options: ['5', '4', '10', '8'],
    correctOption: '5',
    bncc: 'EF05MA08',
    explanation: 'Para calcular 1/4 de 20, divide-se 20 por 4 = 5.',
    category: 'Operações'
  },
  {
    id: 'm3',
    prompt: 'Qual fração corresponde ao número decimal 0,75?',
    options: ['3/4', '1/4', '2/3', '7/5'],
    correctOption: '3/4',
    bncc: 'EF05MA07',
    explanation: '75 centésimos equivalem a 3 partes de 4 (3/4).',
    category: 'Decimais'
  },
  {
    id: 'm4',
    prompt: 'Calcule a adição de números decimais: 0,3 + 0,7 = ?',
    options: ['1,0', '0,10', '0,21', '1,3'],
    correctOption: '1,0',
    bncc: 'EF05MA07',
    explanation: '3 décimos + 7 décimos = 10 décimos, que formam 1 inteiro (1,0).',
    category: 'Operações'
  },
  {
    id: 'm5',
    prompt: 'Qual valor decimal representa a fração 1/4?',
    options: ['0,25', '0,4', '0,14', '0,5'],
    correctOption: '0,25',
    bncc: 'EF05MA07',
    explanation: '1 dividido por 4 resulta em 0,25 (vinte e cinco centésimos).',
    category: 'Frações'
  },
  {
    id: 'm6',
    prompt: 'Quanto é 50% de 80?',
    options: ['40', '30', '50', '20'],
    correctOption: '40',
    bncc: 'EF05MA08',
    explanation: '50% representa a metade. Metade de 80 é 40.',
    category: 'Operações'
  },
  {
    id: 'm7',
    prompt: 'Qual fração corresponde ao número decimal 0,1?',
    options: ['1/10', '1/100', '1/2', '10/1'],
    correctOption: '1/10',
    bncc: 'EF05MA07',
    explanation: '0,1 é a leitura direta de um décimo (1/10).',
    category: 'Decimais'
  },
  {
    id: 'm8',
    prompt: 'Quanto é 1/2 de 50?',
    options: ['25', '20', '30', '15'],
    correctOption: '25',
    bncc: 'EF05MA08',
    explanation: 'Metade de 50 é igual a 25.',
    category: 'Operações'
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm_memory_win',
    title: 'Mestre da Memória',
    description: 'Complete 1 partida completa do Jogo da Memória.',
    gameTarget: 'memory',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    xpReward: 120,
    badgeIcon: '🎴',
    bnccCode: 'EF05MA07 / EF05LP04'
  },
  {
    id: 'm_grammar_5',
    title: 'Detetive das Palavras',
    description: 'Acerte 4 casos gramaticais no Detetive da Pontuação.',
    gameTarget: 'grammar',
    targetCount: 4,
    currentCount: 0,
    completed: false,
    xpReward: 150,
    badgeIcon: '🕵️',
    bnccCode: 'EF05LP04 / EF05LP07'
  },
  {
    id: 'm_math_5',
    title: 'Mira Fracionária',
    description: 'Acerte 4 alvos no Alvo Matemático de Frações e Decimais.',
    gameTarget: 'math',
    targetCount: 4,
    currentCount: 0,
    completed: false,
    xpReward: 150,
    badgeIcon: '🎯',
    bnccCode: 'EF05MA07 / EF05MA08'
  },
  {
    id: 'm_level2_win',
    title: 'Desafio Intermediário',
    description: 'Vença o Nível 2 ou Nível 3 da Memória antes do tempo esgotar.',
    gameTarget: 'memory',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    xpReward: 180,
    badgeIcon: '⚡',
    bnccCode: 'Cognitivo / BNCC'
  },
  {
    id: 'm_hint_master',
    title: 'Estrategista Consciente',
    description: 'Use o botão Dica pelo menos 1 vez durante o jogo da memória.',
    gameTarget: 'memory',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    xpReward: 80,
    badgeIcon: '💡',
    bnccCode: 'Estratégia'
  }
];

export const BADGES: Badge[] = [
  {
    id: 'b1',
    title: 'Primeiro Par',
    description: 'Encontrou o primeiro par de conceitos na memória.',
    icon: '🌱',
    unlocked: true
  },
  {
    id: 'b2',
    title: 'Detetive de Coesão',
    description: 'Completou a investigação gramatical com sucesso.',
    icon: '🔍',
    unlocked: false
  },
  {
    id: 'b3',
    title: 'Ás dos Decimais',
    description: 'Dominou os alvos de frações e representações decimais.',
    icon: '📐',
    unlocked: false
  },
  {
    id: 'b4',
    title: 'Mestre da BNCC',
    description: 'Completou todas as missões da jornada do 5º ano.',
    icon: '👑',
    unlocked: false
  }
];

export const DEFAULT_LEADERBOARD = [
  {
    id: 'lead_1',
    studentName: 'Sofia M.',
    avatar: '🦉',
    totalXp: 850,
    studentLevel: 4,
    bestMemoryTimeLevel1: 22,
    bestMemoryTimeLevel2: 34,
    bestMemoryTimeLevel3: 31,
    grammarHighScore: 320,
    mathHighScore: 350,
    updatedAt: 'Hoje',
    isCurrentUser: false
  },
  {
    id: 'lead_2',
    studentName: 'Lucas P.',
    avatar: '🦊',
    totalXp: 720,
    studentLevel: 3,
    bestMemoryTimeLevel1: 26,
    bestMemoryTimeLevel2: 39,
    bestMemoryTimeLevel3: 36,
    grammarHighScore: 280,
    mathHighScore: 310,
    updatedAt: 'Hoje',
    isCurrentUser: false
  },
  {
    id: 'lead_3',
    studentName: 'Beatriz S.',
    avatar: '🚀',
    totalXp: 640,
    studentLevel: 3,
    bestMemoryTimeLevel1: 29,
    bestMemoryTimeLevel2: 42,
    bestMemoryTimeLevel3: 40,
    grammarHighScore: 250,
    mathHighScore: 290,
    updatedAt: 'Ontem',
    isCurrentUser: false
  },
  {
    id: 'lead_4',
    studentName: 'Gabriel C.',
    avatar: '🦁',
    totalXp: 510,
    studentLevel: 3,
    bestMemoryTimeLevel1: 33,
    bestMemoryTimeLevel2: 46,
    bestMemoryTimeLevel3: 43,
    grammarHighScore: 210,
    mathHighScore: 240,
    updatedAt: 'Ontem',
    isCurrentUser: false
  },
  {
    id: 'lead_5',
    studentName: 'Mariana R.',
    avatar: '🐼',
    totalXp: 430,
    studentLevel: 2,
    bestMemoryTimeLevel1: 37,
    bestMemoryTimeLevel2: 50,
    bestMemoryTimeLevel3: undefined,
    grammarHighScore: 190,
    mathHighScore: 220,
    updatedAt: '2 dias atrás',
    isCurrentUser: false
  }
];

