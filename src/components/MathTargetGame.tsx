/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Target, CheckCircle2, XCircle, RotateCcw, 
  HelpCircle, Sparkles, Timer, Award, ArrowRight
} from 'lucide-react';
import { MathChallenge } from '../types';
import { DESAFIOS_MATEMATICA } from '../data/bnccData';
import { soundManager } from '../utils/soundSystem';

interface MathTargetGameProps {
  onScoreEarned: (points: number) => void;
  onCorrectAnswer: () => void;
}

export default function MathTargetGame({ onScoreEarned, onCorrectAnswer }: MathTargetGameProps) {
  const [challenges, setChallenges] = useState<MathChallenge[]>(() => {
    return [...DESAFIOS_MATEMATICA].sort(() => Math.random() - 0.5);
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [roundTime, setRoundTime] = useState<number>(12);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentChallenge = challenges[currentIndex];

  // Contagem regressiva por rodada
  useEffect(() => {
    if (isAnswered || isFinished) return;
    const interval = setInterval(() => {
      setRoundTime(t => {
        if (t <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, isAnswered, isFinished]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setSelectedOption(null);
    setStreak(0);
    soundManager.playError();
  };

  const handleSelect = (option: string) => {
    if (isAnswered || isFinished) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentChallenge.correctOption;

    if (isCorrect) {
      soundManager.playCorrect();
      // Bônus por rapidez
      const speedBonus = roundTime * 5;
      const streakBonus = streak * 10;
      const points = 50 + speedBonus + streakBonus;
      setScore(s => s + points);
      setStreak(st => st + 1);
      onCorrectAnswer();
      onScoreEarned(points);
    } else {
      soundManager.playError();
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < challenges.length) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setRoundTime(12);
    } else {
      setIsFinished(true);
      soundManager.playVictory();
    }
  };

  const handleRestart = () => {
    setChallenges([...DESAFIOS_MATEMATICA].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setRoundTime(12);
    setIsFinished(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Barra de Status */}
      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-4 mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Desafio</span>
            <div className="text-sm font-black text-slate-900">
              {currentIndex + 1} de {challenges.length}
            </div>
          </div>
        </div>

        {/* Cronômetro da Rodada */}
        <div className="flex items-center gap-1.5">
          <Timer className={`w-4 h-4 ${roundTime <= 4 ? 'text-rose-500 animate-pulse' : 'text-blue-600'}`} />
          <span className={`text-base font-black tabular-nums ${roundTime <= 4 ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
            {roundTime}s
          </span>
        </div>

        {/* Pontuação */}
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase text-slate-400">Pontos</span>
          <div className="text-base font-black text-blue-600 flex items-center justify-end gap-1">
            {score}
            {streak > 1 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-bold">
                🎯 x{streak}
              </span>
            )}
          </div>
        </div>
      </div>

      {!isFinished ? (
        <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 flex flex-col items-center animate-in fade-in duration-200">
          {/* Categoria */}
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
              🎯 Alvo • {currentChallenge.category}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {currentChallenge.bncc}
            </span>
          </div>

          {/* Enunciado */}
          <div className="w-full bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mb-6 text-center">
            <p className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
              {currentChallenge.prompt}
            </p>
          </div>

          <p className="text-xs font-bold text-slate-500 mb-3 self-start">
            Toque no alvo com a resposta correspondente:
          </p>

          {/* Opções de Alvo */}
          <div className="w-full grid grid-cols-2 gap-3 mb-6">
            {currentChallenge.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrectOpt = opt === currentChallenge.correctOption;

              let btnStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 hover:scale-[1.02]';
              if (isAnswered) {
                if (isCorrectOpt) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-black shadow-sm ring-2 ring-emerald-300';
                } else if (isSelected && !isCorrectOpt) {
                  btnStyle = 'bg-rose-50 border-rose-500 text-rose-900 font-bold';
                } else {
                  btnStyle = 'opacity-40 border-slate-200 text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(opt)}
                  disabled={isAnswered}
                  className={`p-5 rounded-2xl border-2 text-center font-black text-lg sm:text-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrectOpt && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Correto
                    </span>
                  )}
                  {isAnswered && isSelected && !isCorrectOpt && (
                    <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                      <XCircle className="w-4 h-4 text-rose-600" /> Incorreto
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explicação Pedagógica */}
          {isAnswered && (
            <div className="w-full bg-blue-50/80 border border-blue-200 rounded-2xl p-4 mb-5 text-left text-xs text-blue-950 animate-in fade-in duration-300 leading-relaxed">
              <div className="flex items-center gap-1.5 font-black text-blue-800 mb-1">
                <HelpCircle className="w-4 h-4" />
                Resolução Pedagógica ({currentChallenge.bncc}):
              </div>
              <p>{currentChallenge.explanation}</p>
            </div>
          )}

          {/* Avançar */}
          {isAnswered && (
            <button
              onClick={handleNext}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentIndex + 1 === challenges.length ? 'Ver Resultado Final' : 'Próximo Alvo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* Tela Final do Alvo */
        <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 text-center animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
            <Award className="w-10 h-10 animate-bounce" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-1">
            Treino de Alvo Concluído! 🎯
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-5">
            Você praticou conversões entre frações e decimais alinhadas à BNCC.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
            <div className="text-3xl font-black text-blue-600">{score}</div>
            <div className="text-[10px] font-bold uppercase text-slate-400">Pontos Acumulados</div>
          </div>

          <button
            onClick={handleRestart}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Jogar Novamente
          </button>
        </div>
      )}
    </div>
  );
}
