/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Trophy, Medal, Timer, Zap, Search, Target, 
  RotateCcw, User, Edit2, Check, Sparkles, School
} from 'lucide-react';
import { LeaderboardEntry } from '../types';

export type LeaderboardCategory = 'xp' | 'memory1' | 'memory2' | 'memory3' | 'grammar' | 'math';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentStudentName: string;
  currentStudentAvatar: string;
  onUpdateProfile: (name: string, avatar: string) => void;
  onResetLeaderboard: () => void;
}

const AVAILABLE_AVATARS = ['🦊', '🦁', '🦉', '🚀', '🐼', '🌟', '🐬', '🦖', '🎨', '👑'];

export default function Leaderboard({
  entries,
  currentStudentName,
  currentStudentAvatar,
  onUpdateProfile,
  onResetLeaderboard
}: LeaderboardProps) {
  const [category, setCategory] = useState<LeaderboardCategory>('xp');
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(currentStudentName);
  const [tempAvatar, setTempAvatar] = useState<string>(currentStudentAvatar);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Ordenação por categoria
  const sortedEntries = [...entries].sort((a, b) => {
    if (category === 'xp') {
      return b.totalXp - a.totalXp;
    }
    if (category === 'memory1') {
      const tA = a.bestMemoryTimeLevel1 ?? 9999;
      const tB = b.bestMemoryTimeLevel1 ?? 9999;
      return tA - tB;
    }
    if (category === 'memory2') {
      const tA = a.bestMemoryTimeLevel2 ?? 9999;
      const tB = b.bestMemoryTimeLevel2 ?? 9999;
      return tA - tB;
    }
    if (category === 'memory3') {
      const tA = a.bestMemoryTimeLevel3 ?? 9999;
      const tB = b.bestMemoryTimeLevel3 ?? 9999;
      return tA - tB;
    }
    if (category === 'grammar') {
      return (b.grammarHighScore ?? 0) - (a.grammarHighScore ?? 0);
    }
    if (category === 'math') {
      return (b.mathHighScore ?? 0) - (a.mathHighScore ?? 0);
    }
    return 0;
  });

  const currentUserRank = sortedEntries.findIndex(e => e.isCurrentUser) + 1;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateProfile(tempName.trim(), tempAvatar);
      setIsEditingProfile(false);
    }
  };

  const getMetricDisplay = (entry: LeaderboardEntry) => {
    switch (category) {
      case 'xp':
        return (
          <div className="flex items-center gap-1 font-black text-amber-600 text-sm sm:text-base">
            <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{entry.totalXp} XP</span>
          </div>
        );
      case 'memory1':
        return (
          <div className="flex items-center gap-1 font-black text-blue-600 text-sm sm:text-base tabular-nums">
            <Timer className="w-4 h-4 text-blue-500" />
            <span>{entry.bestMemoryTimeLevel1 ? `${entry.bestMemoryTimeLevel1}s` : '—'}</span>
          </div>
        );
      case 'memory2':
        return (
          <div className="flex items-center gap-1 font-black text-blue-600 text-sm sm:text-base tabular-nums">
            <Timer className="w-4 h-4 text-blue-500" />
            <span>{entry.bestMemoryTimeLevel2 ? `${entry.bestMemoryTimeLevel2}s` : '—'}</span>
          </div>
        );
      case 'memory3':
        return (
          <div className="flex items-center gap-1 font-black text-purple-600 text-sm sm:text-base tabular-nums">
            <Timer className="w-4 h-4 text-purple-500" />
            <span>{entry.bestMemoryTimeLevel3 ? `${entry.bestMemoryTimeLevel3}s` : '—'}</span>
          </div>
        );
      case 'grammar':
        return (
          <div className="flex items-center gap-1 font-black text-emerald-600 text-sm sm:text-base">
            <Search className="w-4 h-4 text-emerald-500" />
            <span>{entry.grammarHighScore ? `${entry.grammarHighScore} pts` : '—'}</span>
          </div>
        );
      case 'math':
        return (
          <div className="flex items-center gap-1 font-black text-blue-600 text-sm sm:text-base">
            <Target className="w-4 h-4 text-blue-500" />
            <span>{entry.mathHighScore ? `${entry.mathHighScore} pts` : '—'}</span>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Banner Superior do Jogador e Sala de Aula */}
      <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shadow-inner border border-amber-200">
            {currentStudentAvatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                Seu Perfil na Turma
              </span>
              <button
                onClick={() => {
                  setTempName(currentStudentName);
                  setTempAvatar(currentStudentAvatar);
                  setIsEditingProfile(true);
                }}
                className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Editar Nome e Avatar"
              >
                <Edit2 className="w-3 h-3" /> Editar
              </button>
            </div>
            <h3 className="text-lg font-black text-slate-900 leading-tight">
              {currentStudentName}
            </h3>
            <p className="text-xs text-slate-500">
              Sua posição atual nesta categoria: <strong className="text-emerald-700">#{currentUserRank} lugar</strong>
            </p>
          </div>
        </div>

        {/* Informações da Sala / Ação do Professor */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reiniciar o torneio local da sala"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reiniciar Torneio</span>
          </button>
        </div>
      </div>

      {/* Modal de Edição de Nome e Avatar */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              Editar Dados do Aluno
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Escolha seu avatar e como seu nome aparecerá no mural da sala:
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Escolha seu Avatar:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {AVAILABLE_AVATARS.map(av => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setTempAvatar(av)}
                      className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all cursor-pointer ${
                        tempAvatar === av
                          ? 'bg-emerald-100 border-2 border-emerald-500 scale-105 shadow-xs'
                          : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nome ou Apelido:
                </label>
                <input
                  type="text"
                  value={tempName}
                  maxLength={25}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-slate-800"
                  placeholder="Ex: Sofia (5º Ano B)"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Salvar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmação de Reset de Torneio */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-slate-900 mb-1">
              Reiniciar Torneio da Sala?
            </h4>
            <p className="text-xs text-slate-500 mb-5">
              Isso restaurará os recordes e pontuações originais da turma no seu navegador.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  onResetLeaderboard();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs cursor-pointer"
              >
                Sim, Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SELETOR DE CATEGORIA DO RANKING */}
      <div className="w-full flex items-center gap-1.5 bg-slate-200/80 p-1.5 rounded-2xl overflow-x-auto shadow-inner">
        <button
          onClick={() => setCategory('xp')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 ${
            category === 'xp'
              ? 'bg-white text-amber-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Geral (XP Total)</span>
        </button>

        <button
          onClick={() => setCategory('memory1')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 ${
            category === 'memory1'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Timer className="w-3.5 h-3.5" />
          <span>Fácil (4p)</span>
        </button>

        <button
          onClick={() => setCategory('memory2')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 ${
            category === 'memory2'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Timer className="w-3.5 h-3.5" />
          <span>Médio (6p)</span>
        </button>

        <button
          onClick={() => setCategory('memory3')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 ${
            category === 'memory3'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Timer className="w-3.5 h-3.5" />
          <span>Difícil (8p)</span>
        </button>

        <button
          onClick={() => setCategory('grammar')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 ${
            category === 'grammar'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Detetive</span>
        </button>

        <button
          onClick={() => setCategory('math')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 ${
            category === 'math'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Alvo</span>
        </button>
      </div>

      {/* PÓDIO DOS 3 PRIMEIROS LUGARES */}
      <div className="w-full grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4 pb-2">
        {/* 2º Lugar */}
        {sortedEntries[1] && (
          <div className="bg-slate-100/90 rounded-2xl p-3 sm:p-4 text-center border border-slate-200 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-800 text-xs font-black flex items-center justify-center mb-2 shadow-xs">
              2º
            </div>
            <div className="text-3xl mb-1">{sortedEntries[1].avatar}</div>
            <div className="text-xs font-black text-slate-900 truncate max-w-full">
              {sortedEntries[1].studentName}
            </div>
            <div className="mt-1">{getMetricDisplay(sortedEntries[1])}</div>
          </div>
        )}

        {/* 1º Lugar (Campeão / Destaque Alto) */}
        {sortedEntries[0] && (
          <div className="bg-gradient-to-b from-amber-50 to-white rounded-2xl p-4 sm:p-5 text-center border-2 border-amber-300 shadow-md flex flex-col items-center -translate-y-2">
            <div className="w-9 h-9 rounded-full bg-amber-400 text-amber-950 text-sm font-black flex items-center justify-center mb-2 shadow-sm ring-2 ring-amber-200">
              👑 1º
            </div>
            <div className="text-4xl mb-1">{sortedEntries[0].avatar}</div>
            <div className="text-sm font-black text-slate-900 truncate max-w-full">
              {sortedEntries[0].studentName}
            </div>
            <div className="mt-1">{getMetricDisplay(sortedEntries[0])}</div>
          </div>
        )}

        {/* 3º Lugar */}
        {sortedEntries[2] && (
          <div className="bg-amber-50/60 rounded-2xl p-3 sm:p-4 text-center border border-amber-200 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 text-xs font-black flex items-center justify-center mb-2 shadow-xs">
              3º
            </div>
            <div className="text-3xl mb-1">{sortedEntries[2].avatar}</div>
            <div className="text-xs font-black text-slate-900 truncate max-w-full">
              {sortedEntries[2].studentName}
            </div>
            <div className="mt-1">{getMetricDisplay(sortedEntries[2])}</div>
          </div>
        )}
      </div>

      {/* TABELA COMPLETA DE CLASSIFICAÇÃO */}
      <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h4 className="text-base font-black text-slate-900">
              Quadro de Líderes da Turma
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {sortedEntries.length} Alunos Registrados
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {sortedEntries.map((entry, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            const isCurrent = entry.isCurrentUser;

            return (
              <div
                key={entry.id}
                className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                  isCurrent 
                    ? 'bg-emerald-50/80 border-l-4 border-emerald-500 font-bold' 
                    : isTop3 
                    ? 'bg-amber-50/20' 
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Posição */}
                  <div className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                    rank === 1 
                      ? 'bg-amber-400 text-amber-950 shadow-xs' 
                      : rank === 2 
                      ? 'bg-slate-300 text-slate-800' 
                      : rank === 3 
                      ? 'bg-amber-200 text-amber-900' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {rank}º
                  </div>

                  {/* Avatar & Nome */}
                  <div className="text-2xl shrink-0">{entry.avatar}</div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isCurrent ? 'font-black text-emerald-950' : 'font-bold text-slate-900'}`}>
                        {entry.studentName}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-emerald-200 text-emerald-900">
                          Você
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Nível {entry.studentLevel} • Atualizado: {entry.updatedAt}
                    </span>
                  </div>
                </div>

                {/* Métrica da Categoria */}
                <div>
                  {getMetricDisplay(entry)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
