import React from 'react';
import { PlayerStats } from '../types';
import { ACHIEVEMENTS } from '../constants';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { User, Award, Activity, History } from 'lucide-react';

interface ProfileProps {
  stats: PlayerStats;
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ stats, onClose }) => {
  const avatar = stats.highScore > 80 ? "[ O_O ]\n/ | \\" : stats.highScore > 40 ? "( -_- )\n< | >" : "( ._. )\n  |  ";
  const title = stats.highScore > 80 ? "AKIRA CLASS" : stats.highScore > 40 ? "OPERATOR" : "ROOKIE";
  const data = stats.history.slice(-20).map((h, i) => ({ val: h.wpm, i }));

  return (
    <div className="absolute inset-0 z-40 bg-[#050505] flex flex-col p-6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6 shrink-0">
            <div className="flex items-center gap-3">
                <User className="text-accent" size={28}/>
                <h2 className="font-header text-2xl text-white">PERSONNEL DOSSIER</h2>
            </div>
            <button onClick={onClose} className="text-xs font-ui border border-gray-700 px-4 py-2 hover:border-white transition-colors">CLOSE LOG</button>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: ID Card & Stats */}
            <div className="lg:col-span-4 space-y-6">
                {/* ID CARD */}
                <div className="border border-gray-700 bg-gray-900/30 p-6 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="w-32 h-32 border-2 border-accent bg-black flex items-center justify-center mb-4 relative">
                        <pre className="font-code text-accent text-xs leading-tight whitespace-pre">{avatar}</pre>
                        <div className="absolute bottom-0 right-0 bg-accent text-black text-[9px] px-1 font-bold">LVL {stats.prestigeLevel}</div>
                    </div>
                    <div className="text-xl font-header text-white mb-1">GUEST OPERATOR</div>
                    <div className="text-xs font-ui text-gray-500 mb-4">{title}</div>
                    
                    <div className="w-full grid grid-cols-2 gap-4 border-t border-gray-800 pt-4">
                        <div>
                            <div className="text-[10px] text-gray-500">GAMES</div>
                            <div className="text-white font-code">{stats.gamesPlayed}</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500">BEST WPM</div>
                            <div className="text-white font-code text-accent">{stats.highScore}</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500">KEYS</div>
                            <div className="text-white font-code">{stats.decryptionKeys}</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500">TOTAL WORDS</div>
                            <div className="text-white font-code">{stats.totalWordsTyped}</div>
                        </div>
                    </div>
                </div>

                {/* Graph */}
                <div className="border border-gray-800 p-4 bg-black">
                     <div className="flex items-center gap-2 mb-4 text-gray-400">
                        <Activity size={14}/>
                        <span className="text-[10px] font-header">PERFORMANCE GRAPH (LAST 20)</span>
                     </div>
                     <div className="w-full h-32 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <Line type="monotone" dataKey="val" stroke="var(--accent)" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Right Column: Achievements & History */}
            <div className="lg:col-span-8 space-y-6">
                
                {/* Achievements */}
                <div className="border border-gray-800 bg-gray-900/10 p-6">
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
                        <Award size={16} className="text-accent"/>
                        <span className="font-header text-sm text-white">MEDALS & ACHIEVEMENTS</span>
                        <span className="ml-auto text-xs text-gray-500">{stats.unlockedAchievements.length} / {ACHIEVEMENTS.length}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ACHIEVEMENTS.map(ach => {
                            const isUnlocked = stats.unlockedAchievements.includes(ach.id);
                            return (
                                <div key={ach.id} className={`flex items-center gap-3 p-3 border ${isUnlocked ? 'border-accent/50 bg-accent/5' : 'border-gray-800 bg-black opacity-50'}`}>
                                    <div className="text-2xl">{ach.icon}</div>
                                    <div>
                                        <div className={`text-xs font-bold ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>{ach.name}</div>
                                        <div className="text-[9px] text-gray-500">{ach.desc}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent History */}
                <div className="border border-gray-800 bg-gray-900/10 p-6">
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
                        <History size={16} className="text-gray-400"/>
                        <span className="font-header text-sm text-white">RECENT OPERATIONS</span>
                    </div>
                    <table className="w-full text-left">
                        <thead className="text-[10px] text-gray-500 font-ui border-b border-gray-800">
                            <tr><th className="pb-2">TIME</th><th className="pb-2">STATUS</th><th className="pb-2">WPM</th><th className="pb-2 text-right">CREDITS</th></tr>
                        </thead>
                        <tbody className="font-code text-[11px] text-gray-400">
                            {stats.history.slice().reverse().slice(0, 5).map((h, i) => (
                                <tr key={i} className="border-b border-gray-800/50 hover:bg-white/5">
                                    <td className="py-2">{h.date}</td>
                                    <td className={`py-2 ${h.result === 'WIN' ? 'text-accent' : h.result === 'ZEN' ? 'text-blue-400' : 'text-gray-600'}`}>{h.result}</td>
                                    <td className="py-2">{h.wpm}</td>
                                    <td className="py-2 text-right">¥{h.yen}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>
  );
};

export default Profile;