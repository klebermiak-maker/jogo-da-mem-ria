/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, CheckCircle2, XCircle, RotateCcw, 
  HelpCircle, Sparkles, Heart, Award, ArrowRight
} from 'lucide-react';
import { GrammarQuestion } from '../types';
import { QUESTOES_GRAMATICA } from '../data/bnccData';
import { soundManager } from '../utils/soundSystem';

interface GrammarDetectiveGameProps {
  onScoreEarned: (points: number) => void;
  onCorrectAnswer: () => void;
}

export default function GrammarDetectiveGame({ onScoreEarned, onCorrectAnswer }: GrammarDetectiveGameProps) {
  const [questions, setQuestions] = useState<GrammarQuestion[]>(() => {
    return [...QUESTOES_GRAMATICA].sort(() => Math.random() - 0.5);
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = questions[currentIndex];

  const handleSelect = (option: string) => {
    if (isAnswered || isFinished) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctOption;

    if (isCorrect) {
      soundManager.playCorrect();
      const streakBonus = streak * 10;
      const points = 50 + streakBonus;
      setScore(s => s + points);
      setStreak(st => st + 1);
      onCorrectAnswer();
      onScoreEarned(points);
    } else {
      soundManager.playError();
      setStreak(0);
      setLives(l => {
        const next = l - 1;
        if (next <= 0) {
          setTimeout(() => {
            setIsFinished(true);
            soundManager.playTimeout();
          }, 1200);
        }
        return next;
      });
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length && lives > 0) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      soundManager.playVictory();
    }
  };

  const handleRestart = () => {
    setQuestions([...QUESTOES_GRAMATICA].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setLives(3);
    setIsFinished(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Barra de Status do Detetive */}
      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-4 mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Caso</span>
            <div className="text-sm font-black text-slate-900">
              {currentIndex + 1} de {questions.length}
            </div>
          </div>
        </div>

        {/* Vidas / Vigor */}
        <div className="flex items-center gap-1">
          {[1, 2, 3].map(heartIdx => (
            <Heart
              key={heartIdx}
              className={`w-5 h-5 transition-transform ${
                heartIdx <= lives
                  ? 'text-rose-500 fill-rose-500 scale-100'
                  : 'text-slate-300 scale-90'
              }`}
            />
          ))}
        </div>

        {/* Pontuação & Combo */}
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase text-slate-400">Pontos</span>
          <div className="text-base font-black text-emerald-600 flex items-center justify-end gap-1">
            {score}
            {streak > 1 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-bold">
                🔥 x{streak}
              </span>
            )}
          </div>
        </div>
      </div>

      {!isFinished ? (
        <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 flex flex-col items-center animate-in fade-in duration-200">
          {/* Categoria BNCC */}
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              🕵️ Investigação • {currentQ.category}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {currentQ.bncc}
            </span>
          </div>

          {/* Enunciado do Enigma */}
          <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 mb-6 text-center">
            <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed">
              "{currentQ.sentence}"
            </p>
          </div>

          <p className="text-xs font-bold text-slate-500 mb-3 self-start">
            Selecione a opção que completa a frase corretamente:
          </p>

          {/* Opções de Resposta */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrectOpt = opt === currentQ.correctOption;

              let btnStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
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
                  className={`p-4 rounded-xl border-2 text-left font-bold text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Caixa de Explicação Pedagógica */}
          {isAnswered && (
            <div className="w-full bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 mb-5 text-left text-xs text-emerald-950 animate-in fade-in duration-300 leading-relaxed">
              <div className="flex items-center gap-1.5 font-black text-emerald-800 mb-1">
                <HelpCircle className="w-4 h-4" />
                Explicação Pedagógica ({currentQ.bncc}):
              </div>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {/* Botão de Avançar */}
          {isAnswered && lives > 0 && (
            <button
              onClick={handleNext}
              className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentIndex + 1 === questions.length ? 'Finalizar Caso' : 'Próxima Pista'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* Tela Final do Detetive */
        <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 text-center animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
            <Award className="w-10 h-10 animate-bounce" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-1">
            {lives > 0 ? 'Caso Solucionado com Sucesso! 🔍' : 'Pistas Esgotadas! 🛑'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-5">
            {lives > 0 
              ? 'Você demonstrou excelente domínio das regras de pontuação e coesão textual!' 
              : 'Você perdeu todas as vidas, mas aprendeu importantes regras da BNCC!'}
          </p>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
            <div>
              <div className="text-2xl font-black text-emerald-600">{score}</div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Pontuação Total</div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800">{lives}/3</div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Vidas Restantes</div>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Jogar Novo Caso
          </button>
        </div>
      )}
    </div>
  );
}
