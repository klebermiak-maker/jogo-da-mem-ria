/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Volume2, VolumeX, BookOpen, Download, 
  Copy, Check, GraduationCap, Calculator, 
  BookMarked, Target, Search, Zap, Medal, ArrowRight, Sparkles
} from 'lucide-react';
import MemoryGame from './components/MemoryGame';
import GrammarDetectiveGame from './components/GrammarDetectiveGame';
import MathTargetGame from './components/MathTargetGame';
import MissionsPanel from './components/MissionsPanel';
import Leaderboard from './components/Leaderboard';
import { INITIAL_MISSIONS, BADGES, PARES_MATEMATICA, PARES_PORTUGUES, DEFAULT_LEADERBOARD } from './data/bnccData';
import { soundManager } from './utils/soundSystem';
import { globalConfetti } from './utils/confettiCannon';
import { Mission, Badge, LeaderboardEntry } from './types';

export type ActiveTab = 'memory' | 'grammar' | 'math' | 'missions' | 'leaderboard';

const STORAGE_KEYS = {
  XP: 'bncc_student_xp',
  PROFILE: 'bncc_student_profile',
  LEADERBOARD: 'bncc_leaderboard_data',
  MISSIONS: 'bncc_missions_data',
  BADGES: 'bncc_badges_data',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('memory');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Perfil do Estudante com persistência via localStorage
  const [studentProfile, setStudentProfile] = useState<{ name: string; avatar: string }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : { name: 'Você (Aluno 5º Ano)', avatar: '🦁' };
    } catch {
      return { name: 'Você (Aluno 5º Ano)', avatar: '🦁' };
    }
  });

  // XP do Estudante com persistência
  const [studentXp, setStudentXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.XP);
      return saved ? JSON.parse(saved) : 120;
    } catch {
      return 120;
    }
  });

  // Missões com persistência
  const [missions, setMissions] = useState<Mission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MISSIONS);
      return saved ? JSON.parse(saved) : INITIAL_MISSIONS;
    } catch {
      return INITIAL_MISSIONS;
    }
  });

  // Insígnias com persistência
  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BADGES);
      return saved ? JSON.parse(saved) : BADGES;
    } catch {
      return BADGES;
    }
  });

  // Leaderboard com persistência
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      if (saved) return JSON.parse(saved);
    } catch {}

    const userEntry: LeaderboardEntry = {
      id: 'user_current',
      studentName: 'Você (Aluno 5º Ano)',
      avatar: '🦁',
      totalXp: 120,
      studentLevel: 1,
      bestMemoryTimeLevel1: undefined,
      bestMemoryTimeLevel2: undefined,
      bestMemoryTimeLevel3: undefined,
      grammarHighScore: 0,
      mathHighScore: 0,
      updatedAt: 'Hoje',
      isCurrentUser: true,
    };
    return [userEntry, ...DEFAULT_LEADERBOARD];
  });
  
  // Canvas de confetes comemorativos
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Modal comemorativo de missão concluída com impacto visual
  const [missionCelebration, setMissionCelebration] = useState<{
    title: string;
    description: string;
    badgeIcon: string;
    xpReward: number;
    bnccCode: string;
  } | null>(null);

  // Modais
  const [showPedagogicalGuide, setShowPedagogicalGuide] = useState<boolean>(false);
  const [showHtmlExportModal, setShowHtmlExportModal] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const studentLevel = Math.floor(studentXp / 250) + 1;

  // Inicializar e sincronizar Canvas de Confetes
  useEffect(() => {
    if (canvasRef.current) {
      globalConfetti.attach(canvasRef.current);
    }
    const handleResize = () => {
      globalConfetti.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      globalConfetti.stop();
    };
  }, []);

  useEffect(() => {
    soundManager.enabled = soundEnabled;
  }, [soundEnabled]);

  // Sincronizar XP e Perfil no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.XP, JSON.stringify(studentXp));
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(studentProfile));
      localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
      localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
    } catch {}
  }, [studentXp, studentProfile, missions, badges]);

  // Sincronizar a entrada do usuário atual no Leaderboard sempre que XP ou perfil mudar
  useEffect(() => {
    setLeaderboard(prev => {
      const updated = prev.map(entry => {
        if (entry.isCurrentUser) {
          return {
            ...entry,
            studentName: studentProfile.name,
            avatar: studentProfile.avatar,
            totalXp: studentXp,
            studentLevel: studentLevel,
            updatedAt: 'Agora'
          };
        }
        return entry;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [studentXp, studentProfile, studentLevel]);

  // Atualizar perfil
  const handleUpdateProfile = (name: string, avatar: string) => {
    setStudentProfile({ name, avatar });
  };

  // Resetar leaderboard (ação do professor)
  const handleResetLeaderboard = () => {
    const userEntry: LeaderboardEntry = {
      id: 'user_current',
      studentName: studentProfile.name,
      avatar: studentProfile.avatar,
      totalXp: studentXp,
      studentLevel: studentLevel,
      bestMemoryTimeLevel1: undefined,
      bestMemoryTimeLevel2: undefined,
      bestMemoryTimeLevel3: undefined,
      grammarHighScore: 0,
      mathHighScore: 0,
      updatedAt: 'Agora',
      isCurrentUser: true,
    };
    const fresh = [userEntry, ...DEFAULT_LEADERBOARD];
    setLeaderboard(fresh);
    try {
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(fresh));
    } catch {}
  };

  // Atualizador de missões com disparo de confetes via Canvas nativo
  const triggerMissionProgress = (missionId: string, amount: number = 1) => {
    setMissions(prevMissions => {
      let justCompletedMission: Mission | null = null;

      const updated = prevMissions.map(m => {
        if (m.id === missionId && !m.completed) {
          const newCount = m.currentCount + amount;
          const isDone = newCount >= m.targetCount;
          if (isDone) {
            justCompletedMission = {
              ...m,
              currentCount: newCount,
              completed: true,
            };
          }
          return {
            ...m,
            currentCount: newCount,
            completed: isDone,
          };
        }
        return m;
      });

      // Se uma missão pendente foi completada agora:
      if (justCompletedMission) {
        const completedM = justCompletedMission as Mission;
        
        // 1. Dispara a função de confetes via Canvas nativo em tela cheia comemorando
        globalConfetti.fire(4200);

        // 2. Toca fanfarra / áudio festivo via Web Audio API
        soundManager.playVictory();

        // 3. Incrementa XP do estudante
        setStudentXp(xp => xp + completedM.xpReward);

        // 4. Exibe modal de comemoração de alto impacto visual
        setMissionCelebration({
          title: completedM.title,
          description: completedM.description,
          badgeIcon: completedM.badgeIcon,
          xpReward: completedM.xpReward,
          bnccCode: completedM.bnccCode,
        });

        // 5. Se todas as missões foram cumpridas, desbloqueia insígnia de Mestre
        const allFinished = updated.every(item => item.completed);
        if (allFinished) {
          unlockBadge('b4');
        }
      }

      return updated;
    });
  };

  const unlockBadge = (badgeId: string) => {
    setBadges(prev => prev.map(b => b.id === badgeId ? { ...b, unlocked: true } : b));
  };

  // Handlers dos jogos integrados com Ranking e Tempos
  const handleMemoryWin = (lvl: number, timeTaken: number) => {
    triggerMissionProgress('m_memory_win', 1);
    unlockBadge('b1');
    if (lvl >= 2) {
      triggerMissionProgress('m_level2_win', 1);
    }
    setStudentXp(xp => xp + 80);

    // Atualiza melhor tempo no ranking local do usuário
    setLeaderboard(prev => {
      return prev.map(entry => {
        if (entry.isCurrentUser) {
          const currentBestKey = lvl === 1 
            ? 'bestMemoryTimeLevel1' 
            : lvl === 2 
            ? 'bestMemoryTimeLevel2' 
            : 'bestMemoryTimeLevel3';
          const oldBest = entry[currentBestKey];
          const newBest = oldBest ? Math.min(oldBest, timeTaken) : timeTaken;

          return {
            ...entry,
            [currentBestKey]: newBest,
            totalXp: entry.totalXp + 80,
            updatedAt: 'Agora'
          };
        }
        return entry;
      });
    });
  };

  const handleMemoryHintUsed = () => {
    triggerMissionProgress('m_hint_master', 1);
  };

  const handleGrammarCorrect = () => {
    triggerMissionProgress('m_grammar_5', 1);
    unlockBadge('b2');
  };

  const handleMathCorrect = () => {
    triggerMissionProgress('m_math_5', 1);
    unlockBadge('b3');
  };

  const handleScoreEarned = (points: number, gameType: 'grammar' | 'math') => {
    setStudentXp(xp => xp + Math.round(points / 2));

    // Atualiza recorde de pontuação no ranking
    setLeaderboard(prev => {
      return prev.map(entry => {
        if (entry.isCurrentUser) {
          const scoreKey = gameType === 'grammar' ? 'grammarHighScore' : 'mathHighScore';
          const oldScore = entry[scoreKey] ?? 0;
          return {
            ...entry,
            [scoreKey]: Math.max(oldScore, points),
            updatedAt: 'Agora'
          };
        }
        return entry;
      });
    });
  };

  const handleDownloadSingleFile = () => {
    const link = document.createElement('a');
    link.href = '/jogo-da-memoria-bncc.html';
    link.download = 'jogos-pedagogicos-missoes-bncc.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyDirectLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans select-none relative">
      {/* Topo Institucional BNCC com XP, Nível e Perfil */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  BNCC • 5º Ano Fundamental
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">•</span>
                <span className="text-xs text-slate-500 hidden sm:inline">Rank & Missões de Aprendizagem</span>
              </div>
              <h1 className="text-lg font-black text-slate-900 leading-tight">
                Jornada Gamificada BNCC
              </h1>
            </div>
          </div>

          {/* Medidor de XP, Nível do Aluno e Ações */}
          <div className="flex items-center gap-2">
            {/* Status do Aluno Clicável para abrir o Ranking */}
            <div 
              onClick={() => setActiveTab('leaderboard')}
              className="bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
              title="Abrir o Rank de Líderes"
            >
              <div className="text-xl">
                {studentProfile.avatar}
              </div>
              <div className="text-left">
                <div className="text-[9px] font-extrabold uppercase text-amber-800">
                  {studentProfile.name.split(' ')[0]} • Nvl {studentLevel}
                </div>
                <div className="text-xs font-black text-amber-950 flex items-center gap-0.5">
                  <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {studentXp} XP
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPedagogicalGuide(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5"
              title="Matriz de Habilidades BNCC"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Matriz BNCC</span>
            </button>

            <button
              onClick={() => setShowHtmlExportModal(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1.5"
              title="Exportar arquivo autônomo offline"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Single File</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg border transition-colors ${
                soundEnabled
                  ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
              }`}
              title={soundEnabled ? 'Silenciar Áudio' : 'Ativar Áudio'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* NAVEGAÇÃO ENTRE OS JOGOS, MISSÕES E RANKING (TABS) */}
        <div className="max-w-5xl mx-auto px-4 border-t border-slate-100 flex items-center gap-1 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('memory')}
            className={`flex items-center gap-2 px-3.5 py-2 border-b-2 text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'memory'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>🎴 Jogo da Memória</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
              3 Níveis
            </span>
          </button>

          <button
            onClick={() => setActiveTab('grammar')}
            className={`flex items-center gap-2 px-3.5 py-2 border-b-2 text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'grammar'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-emerald-600" />
            <span>Detetive da Pontuação</span>
            <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-full font-bold">
              EF05LP04/07
            </span>
          </button>

          <button
            onClick={() => setActiveTab('math')}
            className={`flex items-center gap-2 px-3.5 py-2 border-b-2 text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'math'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-blue-600" />
            <span>Alvo Matemático</span>
            <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded-full font-bold">
              EF05MA07/08
            </span>
          </button>

          <button
            onClick={() => setActiveTab('missions')}
            className={`flex items-center gap-2 px-3.5 py-2 border-b-2 text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'missions'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Missões</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-black">
              {missions.filter(m => m.completed).length}/{missions.length}
            </span>
          </button>

          {/* TAB DE RANK DE LÍDERES */}
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-3.5 py-2 border-b-2 text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'border-amber-500 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Medal className="w-3.5 h-3.5 text-amber-500" />
            <span>Rank de Líderes</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-black">
              Turma 🏆
            </span>
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center">
        {activeTab === 'memory' && (
          <MemoryGame 
            onWin={handleMemoryWin}
            onUseHint={handleMemoryHintUsed}
          />
        )}

        {activeTab === 'grammar' && (
          <GrammarDetectiveGame 
            onScoreEarned={(points) => handleScoreEarned(points, 'grammar')}
            onCorrectAnswer={handleGrammarCorrect}
          />
        )}

        {activeTab === 'math' && (
          <MathTargetGame 
            onScoreEarned={(points) => handleScoreEarned(points, 'math')}
            onCorrectAnswer={handleMathCorrect}
          />
        )}

        {activeTab === 'missions' && (
          <MissionsPanel 
            missions={missions}
            badges={badges}
            studentXp={studentXp}
            studentLevel={studentLevel}
            onNavigateToGame={(game) => setActiveTab(game)}
            onTriggerConfetti={() => {
              globalConfetti.fire(3500);
              soundManager.playVictory();
            }}
          />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard 
            entries={leaderboard}
            currentStudentName={studentProfile.name}
            currentStudentAvatar={studentProfile.avatar}
            onUpdateProfile={handleUpdateProfile}
            onResetLeaderboard={handleResetLeaderboard}
          />
        )}
      </main>

      {/* MODAL MATRIZ BNCC */}
      {showPedagogicalGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Matriz Curricular BNCC (5º Ano)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Habilidades e jogos pedagógicos associados
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPedagogicalGuide(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5 text-xs sm:text-sm">
              <div>
                <h4 className="font-bold text-blue-700 flex items-center gap-1.5 mb-2 text-sm">
                  <Calculator className="w-4 h-4" /> Matemática • EF05MA07 / EF05MA08
                </h4>
                <div className="space-y-2">
                  {PARES_MATEMATICA.slice(0, 6).map(p => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-200">
                          {p.prompt}
                        </span>
                        <span className="text-blue-400">↔</span>
                        <span className="font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
                          {p.match}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">{p.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-emerald-700 flex items-center gap-1.5 mb-2 text-sm">
                  <BookMarked className="w-4 h-4" /> Língua Portuguesa • EF05LP04 / EF05LP07
                </h4>
                <div className="space-y-2">
                  {PARES_PORTUGUES.slice(0, 6).map(p => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {p.prompt}
                        </span>
                        <span className="text-emerald-400">↔</span>
                        <span className="font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
                          {p.match}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">{p.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex justify-end">
              <button
                onClick={() => setShowPedagogicalGuide(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs"
              >
                Fechar Matriz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EXPORTAR SINGLE FILE */}
      {showHtmlExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full flex flex-col shadow-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Arquivo Single File HTML Completo
                  </h3>
                  <p className="text-xs text-slate-500">
                    Disponível para execução offline em salas de aula e laboratórios
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowHtmlExportModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 mb-5 leading-relaxed space-y-2">
              <p>
                O arquivo autônomo está pronto para ser baixado e executado diretamente em qualquer computador sem necessidade de internet:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-700">
                <li>Jogos da Memória, Níveis e Dica com Web Audio API nativo.</li>
                <li>Zero dependências de internet ou CDNs.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleDownloadSingleFile}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Baixar jogo-da-memoria-bncc.html
              </button>
              <button
                onClick={handleCopyDirectLink}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copiedCode ? 'Link Copiado!' : 'Copiar Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL COMEMORATIVO DE CONCLUSÃO DE MISSÃO COM CONFETES */}
      {missionCelebration && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border-2 border-amber-300 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-emerald-200/40 rounded-full blur-2xl pointer-events-none" />

            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-white flex items-center justify-center mb-3 shadow-lg ring-4 ring-amber-100 text-3xl animate-bounce">
              {missionCelebration.badgeIcon}
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px] mb-2 uppercase tracking-wide">
              <span>🎉</span> Missão Concluída! <span>⭐</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
              {missionCelebration.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 mb-4 px-2">
              {missionCelebration.description}
            </p>

            <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200 rounded-2xl p-3.5 mb-5 flex items-center justify-around">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Recompensa</span>
                <div className="text-lg font-black text-amber-600 flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                  +{missionCelebration.xpReward} XP
                </div>
              </div>
              <div className="h-8 w-px bg-amber-200" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Habilidade BNCC</span>
                <div className="text-xs font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200 mt-0.5">
                  {missionCelebration.bnccCode}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  globalConfetti.fire(3500);
                  soundManager.playVictory();
                }}
                className="py-3 px-3 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Disparar mais confetes"
              >
                <span>🎊</span> Mais Confetes
              </button>
              <button
                onClick={() => setMissionCelebration(null)}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Incrível! Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANVAS NATIVO EM TELA CHEIA PARA CHUVA DE CONFETES */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-[100] w-full h-full"
      />

      {/* Rodapé */}
      <footer className="w-full bg-white border-t border-slate-200 mt-auto py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Jornada de Missões e Rank de Líderes • <strong>5º ano do Ensino Fundamental</strong>
          </span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Persistência Local (localStorage)</span>
            <span>•</span>
            <span>EF05MA07/08</span>
            <span>•</span>
            <span>EF05LP04/07</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
