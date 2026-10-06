/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Trophy, CheckCircle2, Sparkles, Award, 
  ArrowRight, ShieldCheck, Zap
} from 'lucide-react';
import { Mission, Badge } from '../types';

interface MissionsPanelProps {
  missions: Mission[];
  badges: Badge[];
  studentXp: number;
  studentLevel: number;
  onNavigateToGame: (gameTab: 'memory' | 'grammar' | 'math') => void;
}

export default function MissionsPanel({ 
  missions, 
  badges, 
  studentXp, 
  studentLevel, 
  onNavigateToGame 
}: MissionsPanelProps) {
  const xpForNextLevel = studentLevel * 250;
  const xpCurrentProgress = studentXp % 250;
  const progressPercent = Math.min(100, Math.round((xpCurrentProgress / 250) * 100));

  const completedCount = missions.filter(m => m.completed).length;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
      {/* Cartão de Perfil / Nível do Estudante */}
      <div className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl shadow-inner border border-white/20">
              🏅
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-100">
                Jornada do Conhecimento BNCC
              </span>
              <h2 className="text-xl sm:text-2xl font-black leading-tight">
                Estudante Nível {studentLevel}
              </h2>
              <p className="text-xs text-white/80">
                {completedCount} de {missions.length} missões concluídas
              </p>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 self-stretch sm:self-auto text-right">
            <span className="text-[10px] font-bold text-white/70 uppercase">XP Total</span>
            <div className="text-xl font-black text-yellow-300 flex items-center justify-end gap-1">
              <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              {studentXp} XP
            </div>
          </div>
        </div>

        {/* Barra de Progresso de Nível */}
        <div className="mt-5 relative z-10">
          <div className="flex justify-between text-xs font-bold text-white/90 mb-1.5">
            <span>Progresso para o Nível {studentLevel + 1}</span>
            <span>{xpCurrentProgress} / 250 XP ({progressPercent}%)</span>
          </div>
          <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-yellow-300 to-emerald-300 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lista de Missões Pedagógicas */}
      <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-black text-slate-900">
              Missões Ativas da Rodada
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {completedCount}/{missions.length} Concluídas
          </span>
        </div>

        <div className="space-y-3">
          {missions.map(mission => {
            const isDone = mission.completed;
            const progress = Math.min(mission.targetCount, mission.currentCount);
            const missionPct = Math.round((progress / mission.targetCount) * 100);

            return (
              <div
                key={mission.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDone 
                    ? 'bg-emerald-50/70 border-emerald-200 shadow-xs' 
                    : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                    isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {mission.badgeIcon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        {mission.title}
                      </h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600">
                        {mission.bnccCode}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {mission.description}
                    </p>

                    {/* Mini Barra de Progresso */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-28 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            isDone ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${missionPct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-500">
                        {progress}/{mission.targetCount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs font-black text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                    +{mission.xpReward} XP
                  </span>

                  {isDone ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Concluída
                    </span>
                  ) : (
                    mission.gameTarget !== 'all' && (
                      <button
                        onClick={() => onNavigateToGame(mission.gameTarget as 'memory' | 'grammar' | 'math')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        Jogar <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insígnias e Medalhas Desbloqueáveis */}
      <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-black text-slate-900">
            Insígnias de Mérito da BNCC
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map(badge => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                badge.unlocked
                  ? 'bg-gradient-to-b from-amber-50/50 to-white border-amber-200 shadow-xs'
                  : 'bg-slate-50/50 border-slate-200 opacity-50 grayscale'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl mb-2 shadow-inner">
                {badge.icon}
              </div>
              <h4 className="text-xs font-black text-slate-900 mb-0.5">
                {badge.title}
              </h4>
              <p className="text-[10px] text-slate-500 leading-tight">
                {badge.description}
              </p>
              <span className={`text-[9px] font-bold mt-2 px-2 py-0.5 rounded-full ${
                badge.unlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {badge.unlocked ? 'Desbloqueada' : 'Bloqueada'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
