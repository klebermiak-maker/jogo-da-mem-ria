/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, RotateCcw, Timer, Move, Lightbulb, 
  Calculator, BookMarked, Sparkles, CheckCircle2, XCircle, 
  ArrowRight, ShieldAlert
} from 'lucide-react';
import { CardItem, GameMode, DifficultyLevel, BnccPair } from '../types';
import { DIFFICULTY_LEVELS, PARES_MATEMATICA, PARES_PORTUGUES } from '../data/bnccData';
import { soundManager } from '../utils/soundSystem';

interface MemoryGameProps {
  onWin: (level: number, timeTaken: number) => void;
  onUseHint: () => void;
}

export default function MemoryGame({ onWin, onUseHint }: MemoryGameProps) {
  const [mode, setMode] = useState<GameMode>('matematica');
  const [level, setLevel] = useState<number>(2);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(new Set());
  const [hintIndices, setHintIndices] = useState<number[]>([]);
  const [showPenaltyBadge, setShowPenaltyBadge] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isTimeout, setIsTimeout] = useState<boolean>(false);
  const [errorIndices, setErrorIndices] = useState<number[]>([]);

  const currentLevelConfig: DifficultyLevel = useMemo(() => {
    return DIFFICULTY_LEVELS.find(l => l.level === level) || DIFFICULTY_LEVELS[1];
  }, [level]);

  const [timeLeft, setTimeLeft] = useState<number>(currentLevelConfig.timeLimit);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && !isWon && !isTimeout) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsTimeout(true);
            soundManager.playTimeout();
            return 0;
          }
          if (prev <= 6 && prev > 1) {
            soundManager.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isWon, isTimeout]);

  // Setup Deck
  const setupDeck = (selectedMode: GameMode, selectedLevel: number) => {
    const config = DIFFICULTY_LEVELS.find(l => l.level === selectedLevel) || DIFFICULTY_LEVELS[1];
    setIsTimerRunning(false);
    setTimeLeft(config.timeLimit);
    setMoves(0);
    setFlippedIndices([]);
    setMatchedPairIds(new Set());
    setHintIndices([]);
    setErrorIndices([]);
    setShowPenaltyBadge(false);
    setIsLocked(false);
    setIsWon(false);
    setIsTimeout(false);

    let basePairs: BnccPair[] = [];
    if (selectedMode === 'matematica') {
      basePairs = [...PARES_MATEMATICA].sort(() => Math.random() - 0.5).slice(0, config.pairs);
    } else if (selectedMode === 'portugues') {
      basePairs = [...PARES_PORTUGUES].sort(() => Math.random() - 0.5).slice(0, config.pairs);
    } else {
      const half = Math.floor(config.pairs / 2);
      const mathSlice = [...PARES_MATEMATICA].sort(() => Math.random() - 0.5).slice(0, half);
      const portSlice = [...PARES_PORTUGUES].sort(() => Math.random() - 0.5).slice(0, config.pairs - half);
      basePairs = [...mathSlice, ...portSlice].sort(() => Math.random() - 0.5);
    }

    const deck: CardItem[] = [];
    basePairs.forEach((pair, idx) => {
      deck.push({
        uid: `${pair.id}_prompt_${idx}`,
        pairId: pair.id,
        type: 'prompt',
        text: pair.prompt,
        roleLabel: pair.promptLabel,
        subject: pair.subject,
        bncc: pair.bncc,
        description: pair.description
      });
      deck.push({
        uid: `${pair.id}_match_${idx}`,
        pairId: pair.id,
        type: 'match',
        text: pair.match,
        roleLabel: pair.matchLabel,
        subject: pair.subject,
        bncc: pair.bncc,
        description: pair.description
      });
    });

    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
  };

  useEffect(() => {
    setupDeck(mode, level);
  }, [mode, level]);

  const handleUseHint = () => {
    if (isLocked || isWon || isTimeout) return;
    if (matchedPairIds.size === currentLevelConfig.pairs) return;

    const remainingPairIds: string[] = [];
    cards.forEach(c => {
      if (!matchedPairIds.has(c.pairId) && !remainingPairIds.includes(c.pairId)) {
        remainingPairIds.push(c.pairId);
      }
    });

    if (remainingPairIds.length === 0) return;

    const targetPairId = remainingPairIds[Math.floor(Math.random() * remainingPairIds.length)];
    const targetIndices: number[] = [];
    cards.forEach((c, idx) => {
      if (c.pairId === targetPairId) targetIndices.push(idx);
    });

    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    soundManager.playHint();
    onUseHint();

    setTimeLeft(prev => Math.max(1, prev - 5));
    setShowPenaltyBadge(true);
    setTimeout(() => setShowPenaltyBadge(false), 1400);

    setIsLocked(true);
    setHintIndices(targetIndices);

    setTimeout(() => {
      setHintIndices([]);
      setIsLocked(false);
    }, 1500);
  };

  const handleCardClick = (index: number) => {
    if (isLocked || isTimeout) return;
    if (flippedIndices.includes(index) || hintIndices.includes(index)) return;
    const clickedCard = cards[index];
    if (matchedPairIds.has(clickedCard.pairId)) return;

    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    soundManager.playFlip();

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves(m => m + 1);

      const [firstIdx, secondIdx] = newFlipped;
      const c1 = cards[firstIdx];
      const c2 = cards[secondIdx];

      const isMatch = c1.pairId === c2.pairId && c1.type !== c2.type;

      if (isMatch) {
        setTimeout(() => {
          soundManager.playMatch();
          setMatchedPairIds(prev => {
            const next = new Set(prev);
            next.add(c1.pairId);
            if (next.size === currentLevelConfig.pairs) {
              const timeTaken = Math.max(1, currentLevelConfig.timeLimit - timeLeft);
              setTimeout(() => {
                soundManager.playVictory();
                setIsWon(true);
                setIsTimerRunning(false);
                onWin(level, timeTaken);
              }, 400);
            }
            return next;
          });
          setFlippedIndices([]);
          setIsLocked(false);
        }, 320);
      } else {
        setTimeout(() => {
          soundManager.playError();
          setErrorIndices([firstIdx, secondIdx]);

          setTimeout(() => {
            setErrorIndices([]);
            setFlippedIndices([]);
            setIsLocked(false);
          }, 900);
        }, 220);
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const accuracy = useMemo(() => {
    if (moves === 0) return 100;
    return Math.min(100, Math.round((currentLevelConfig.pairs / moves) * 100));
  }, [moves, currentLevelConfig.pairs]);

  const starCount = useMemo(() => {
    if (accuracy >= 75 && timeLeft >= currentLevelConfig.timeLimit * 0.3) return 3;
    if (accuracy >= 50) return 2;
    return 1;
  }, [accuracy, timeLeft, currentLevelConfig.timeLimit]);

  const timerPercent = useMemo(() => {
    return Math.max(0, (timeLeft / currentLevelConfig.timeLimit) * 100);
  }, [timeLeft, currentLevelConfig.timeLimit]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Controles de Modo e Nível */}
      <div className="w-full mb-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Seletor de Modo */}
        <div className="inline-flex p-1 bg-slate-200/80 rounded-xl shadow-inner">
          <button
            onClick={() => setMode('matematica')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'matematica'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4 text-blue-600" />
            Matemática
          </button>
          <button
            onClick={() => setMode('portugues')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'portugues'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookMarked className="w-4 h-4 text-emerald-600" />
            Português
          </button>
          <button
            onClick={() => setMode('misto')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'misto'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            Misto
          </button>
        </div>

        {/* Níveis de Dificuldade */}
        <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl shadow-inner">
          {DIFFICULTY_LEVELS.map(lvl => (
            <button
              key={lvl.level}
              onClick={() => setLevel(lvl.level)}
              className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                level === lvl.level
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={lvl.description}
            >
              <span>{lvl.badge.split(' ')[0]}</span>
              <span>{lvl.name}</span>
              <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">
                ({lvl.pairs}p/{lvl.timeLimit}s)
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Superior */}
      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-4 mb-3 flex flex-wrap items-center justify-between gap-4 relative">
        <div className="flex items-center gap-6">
          {/* Cronômetro */}
          <div className="flex items-center gap-2.5 relative">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              timeLeft <= 10 
                ? 'bg-rose-100 text-rose-700 animate-pulse' 
                : timeLeft <= 25 
                ? 'bg-amber-100 text-amber-700' 
                : 'bg-blue-50 text-blue-600'
            }`}>
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tempo Restante</div>
              <div className={`text-xl font-black tabular-nums transition-colors ${
                timeLeft <= 10 ? 'text-rose-600 animate-pulse' : 'text-slate-800'
              }`}>
                {formatTime(timeLeft)}
              </div>
            </div>

            {showPenaltyBadge && (
              <div className="absolute -top-3 right-0 bg-rose-500 text-white font-black text-[11px] px-2 py-0.5 rounded-full shadow-md animate-bounce">
                -5s ⏳
              </div>
            )}
          </div>

          {/* Jogadas */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Move className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Jogadas</div>
              <div className="text-xl font-black text-slate-800 tabular-nums">
                {moves}
              </div>
            </div>
          </div>

          {/* Pares */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pares Encontrados</div>
              <div className="text-xl font-black text-emerald-700 tabular-nums">
                {matchedPairIds.size} / {currentLevelConfig.pairs}
              </div>
            </div>
          </div>
        </div>

        {/* Botão Dica e Reiniciar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUseHint}
            disabled={isLocked || matchedPairIds.size === currentLevelConfig.pairs || isWon || isTimeout}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-bold text-xs shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Revela as cartas de um par não encontrado por 1,5s (Penalidade: -5 segundos)"
          >
            <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-400 animate-pulse" />
            <span>Dica</span>
            <span className="text-[10px] bg-amber-200/90 text-amber-950 px-1.5 py-0.5 rounded font-black">
              -5s
            </span>
          </button>

          <button
            onClick={() => setupDeck(mode, level)}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar
          </button>
        </div>
      </div>

      {/* Barra de Progresso do Tempo */}
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-5">
        <div
          className={`h-full transition-all duration-1000 ease-linear rounded-full ${
            timeLeft <= 10
              ? 'bg-rose-500 animate-pulse'
              : timeLeft <= 25
              ? 'bg-amber-500'
              : 'bg-emerald-500'
          }`}
          style={{ width: `${timerPercent}%` }}
        />
      </div>

      {/* Grade de Cartas */}
      <div
        className={`w-full grid gap-3 sm:gap-4 perspective-1000 ${
          currentLevelConfig.pairs === 4
            ? 'grid-cols-2 sm:grid-cols-4'
            : currentLevelConfig.pairs === 6
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
            : 'grid-cols-2 sm:grid-cols-4 md:grid-cols-4'
        }`}
      >
        {cards.map((card, index) => {
          const isFlipped = flippedIndices.includes(index);
          const isMatched = matchedPairIds.has(card.pairId);
          const isHint = hintIndices.includes(index);
          const isError = errorIndices.includes(index);

          return (
            <div
              key={card.uid}
              onClick={() => handleCardClick(index)}
              className={`w-full aspect-[4/3.3] sm:aspect-[4/3.2] perspective-1000 cursor-pointer ${
                isMatched ? 'cursor-default' : ''
              }`}
            >
              <div
                className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-500 rounded-2xl ${
                  isFlipped || isMatched || isHint ? 'rotate-y-180' : ''
                } ${isError ? 'animate-card-shake' : ''} ${isMatched ? 'animate-card-pulse' : ''} ${
                  isHint ? 'animate-card-pulse' : ''
                }`}
              >
                {/* Verso */}
                <div
                  className={`absolute inset-0 backface-hidden rounded-2xl p-3 flex flex-col items-center justify-center text-white border-2 border-white/30 shadow-md transition-all hover:scale-[1.02] ${
                    card.subject === 'matematica'
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-700'
                      : 'bg-gradient-to-br from-emerald-600 to-teal-700'
                  }`}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/15 flex items-center justify-center mb-1.5 backdrop-blur-xs shadow-inner">
                    {card.subject === 'matematica' ? (
                      <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
                    ) : (
                      <BookMarked className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase opacity-90">
                    {card.subject === 'matematica' ? 'Matemática' : 'Português'}
                  </span>
                  <span className="text-[9px] text-white/70 font-medium">Toque para virar</span>
                </div>

                {/* Frente */}
                <div
                  className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-between items-center bg-white shadow-md border-2 transition-all ${
                    isHint
                      ? 'border-amber-400 bg-amber-50/95 shadow-amber-400/40 ring-4 ring-amber-300'
                      : isMatched
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-emerald-500/20'
                      : isError
                      ? 'border-rose-500 bg-rose-50/70 shadow-rose-500/20'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="w-full flex items-center justify-between gap-1">
                    <span
                      className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isHint
                          ? 'bg-amber-200 text-amber-900 font-extrabold'
                          : card.type === 'prompt'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isHint ? '💡 Dica' : card.roleLabel}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400">
                      {card.bncc}
                    </span>
                  </div>

                  <div className="my-auto text-center px-1">
                    <p
                      className={`font-black leading-tight break-words ${
                        card.text.length > 25
                          ? 'text-xs sm:text-sm font-bold text-slate-800 line-clamp-3'
                          : card.text.length > 10
                          ? 'text-sm sm:text-base text-slate-900'
                          : 'text-xl sm:text-2xl text-slate-900'
                      }`}
                    >
                      {card.text}
                    </p>
                  </div>

                  <div className="w-full flex items-center justify-center pt-1 border-t border-slate-100">
                    {isHint ? (
                      <span className="text-[10px] font-extrabold text-amber-800 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Memorize rápido!
                      </span>
                    ) : isMatched ? (
                      <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Par Correto!
                      </span>
                    ) : isError ? (
                      <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Tente novamente
                      </span>
                    ) : (
                      <span className="text-[9px] font-medium text-slate-400">
                        {card.type === 'prompt' ? 'Procure a resposta' : 'Procure a pergunta'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Timeout */}
      {isTimeout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-100">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3 shadow-inner">
              <ShieldAlert className="w-10 h-10 animate-bounce" />
            </div>

            <h2 className="text-2xl font-black text-rose-600 mb-1">
              O Tempo Esgotou! ⏳
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-4">
              O limite de {currentLevelConfig.timeLimit} segundos acabou para o {currentLevelConfig.name}. Não desista!
            </p>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 mb-5 text-xs text-rose-900">
              <p className="font-bold">
                Você encontrou {matchedPairIds.size} de {currentLevelConfig.pairs} pares.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setupDeck(mode, level)}
                className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Vitória */}
      {isWon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-100 relative">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 shadow-inner">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-1">
              {level === 3 ? 'Você Zerou o Desafio! 👑' : `${currentLevelConfig.name} Concluído! 🎉`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-3">
              Missão de Memória cumprida com sucesso!
            </p>

            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3].map(st => (
                <span
                  key={st}
                  className={`text-2xl sm:text-3xl transition-transform ${
                    st <= starCount ? 'scale-110' : 'opacity-25 grayscale'
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-4">
              <div>
                <div className="text-lg font-black text-emerald-600">{timeLeft}s</div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Tempo Sobrou</div>
              </div>
              <div>
                <div className="text-lg font-black text-slate-800">{moves}</div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Jogadas</div>
              </div>
              <div>
                <div className="text-lg font-black text-blue-600">{accuracy}%</div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Precisão</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setupDeck(mode, level)}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Repetir Nível
              </button>

              {level < 3 && (
                <button
                  onClick={() => setLevel(level + 1)}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Avançar Nível {level + 1}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
