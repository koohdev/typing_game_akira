import React from 'react';
import { PlayerStats } from '../types';
import { ACHIEVEMENTS } from '../constants';
import { Target, CheckCircle2, Lock } from 'lucide-react';

interface MissionsProps {
  stats: PlayerStats;
  onClose: () => void;
  bounty: { text: string; reward: number };
}

const Missions: React.FC<MissionsProps> = ({ stats, onClose, bounty }) => {
  return (
    <div className="absolute inset-0 z-40 bg-[#050505] flex flex-col p-6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6 shrink-0">
            <div className="flex items-center gap-3">
                <Target className="text-accent" size={28}/>
                <div>
                    <h2 className="font-header text-2xl text-white">MISSION CONTROL</h2>
                    <div className="text-xs font-ui text-gray-500">OBJECTIVES & MILESTONES</div>
                </div>
            </div>
            <button onClick={onClose} className="text-xs font-ui border border-gray-700 px-4 py-2 hover:border-white transition-colors">RETURN</button>
        </div>

        <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Active Bounty Section */}
                <div className="border border-accent bg-accent/5 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-accent text-black text-xs font-bold px-2 py-1">ACTIVE PRIORITY</div>
                    <div className="text-xs font-ui text-accent mb-2">DAILY BOUNTY</div>
                    <div className="text-2xl font-code text-white mb-2">{bounty.text}</div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <span>REWARD:</span>
                        <span className="text-white">¥{bounty.reward}</span>
                    </div>
                </div>

                {/* Achievements Grid */}
                <div>
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="font-header text-lg text-white">ACHIEVEMENT DATABASE</h3>
                        <span className="text-xs font-ui text-gray-500">
                            {stats.unlockedAchievements.length} / {ACHIEVEMENTS.length} COMPLETED
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ACHIEVEMENTS.map(ach => {
                            const isUnlocked = stats.unlockedAchievements.includes(ach.id);
                            return (
                                <div 
                                    key={ach.id} 
                                    className={`p-4 border flex items-center gap-4 transition-all
                                        ${isUnlocked ? 'border-gray-700 bg-gray-900/30' : 'border-gray-800 bg-black opacity-60'}
                                    `}
                                >
                                    <div className={`w-12 h-12 flex items-center justify-center rounded border
                                        ${isUnlocked ? 'border-accent bg-accent/20 text-2xl' : 'border-gray-800 bg-gray-900 text-gray-600'}
                                    `}>
                                        {isUnlocked ? ach.icon : <Lock size={20}/>}
                                    </div>
                                    <div className="flex-1">
                                        <div className={`font-header text-sm mb-1 ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                                            {ach.name}
                                        </div>
                                        <div className="text-xs font-ui text-gray-500">
                                            {ach.desc}
                                        </div>
                                    </div>
                                    {isUnlocked && <CheckCircle2 size={16} className="text-accent" />}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};

export default Missions;