import React, { useEffect, useState } from 'react';
import { BOSS_ROSTER, BOSS_ART } from '../constants';
import { Skull, ShieldAlert, Crosshair, ChevronLeft } from 'lucide-react';

interface BountyBoardProps {
  onSelect: (bossId: string) => void;
  onBack: () => void;
}

const BountyBoard: React.FC<BountyBoardProps> = ({ onSelect, onBack }) => {
  const [hoveredBoss, setHoveredBoss] = useState<string | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onBack();
        const num = parseInt(e.key);
        if (!isNaN(num) && num > 0 && num <= BOSS_ROSTER.length) {
            onSelect(BOSS_ROSTER[num - 1].id);
        }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onBack, onSelect]);

  const activeInfo = BOSS_ROSTER.find(b => b.id === hoveredBoss) || BOSS_ROSTER[0];

  return (
    <div className="absolute inset-0 z-40 bg-black flex flex-col items-center justify-center p-4 bg-transparent">
        <div className="w-full max-w-6xl h-full max-h-[800px] border border-gray-800 bg-panel-bg/90 relative flex flex-col md:flex-row shadow-2xl overflow-hidden clip-corner-2">
            
            {/* Left: List */}
            <div className="w-full md:w-1/2 p-6 border-r border-gray-800 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                     <div>
                        <h2 className="font-header text-2xl text-accent">WANTED LIST</h2>
                        <p className="font-ui text-[10px] text-gray-500">PRIORITY TARGETS // LETHAL FORCE AUTH.</p>
                     </div>
                     <button onClick={onBack} className="text-gray-500 hover:text-white flex items-center gap-1 text-xs font-ui">
                        <ChevronLeft size={14}/> BACK [ESC]
                     </button>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                    {BOSS_ROSTER.map((boss, index) => (
                        <button 
                            key={boss.id}
                            onMouseEnter={() => setHoveredBoss(boss.id)}
                            onClick={() => onSelect(boss.id)}
                            className={`w-full text-left p-4 border relative group transition-all ${hoveredBoss === boss.id ? 'border-accent bg-accent/10' : 'border-gray-800 bg-black/40'}`}
                        >
                            <div className="flex justify-between items-start">
                                <span className="font-header text-lg text-white group-hover:text-accent">
                                    <span className="text-gray-600 mr-2">0{index+1}</span>
                                    {boss.name}
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 border ${boss.difficulty === 'NIGHTMARE' ? 'border-purple-500 text-purple-500' : 'border-gray-600 text-gray-500'}`}>
                                    {boss.difficulty}
                                </span>
                            </div>
                            <div className="mt-2 flex justify-between text-[10px] font-ui text-gray-500 group-hover:text-gray-300">
                                <span>REWARD: ¥{boss.reward.toLocaleString()}</span>
                                <span className="flex items-center gap-1"><Crosshair size={10}/> SELECT [ {index+1} ]</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Info Panel */}
            <div className="hidden md:flex w-1/2 p-6 bg-black/50 flex-col relative">
                <div className="absolute inset-0 caution-tape opacity-5 pointer-events-none"></div>
                
                <div className="flex-1 flex flex-col items-center justify-center border border-gray-800 mb-6 relative">
                     <div className="absolute top-2 left-2 text-[10px] text-accent font-ui">TARGET VISUAL</div>
                     <pre className="font-ui text-xs text-accent leading-none opacity-80 whitespace-pre">
                         {BOSS_ART}
                     </pre>
                     <div className="absolute bottom-2 right-2 text-[10px] text-gray-600 font-ui animate-pulse">ANALYZING...</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 p-3 border-l-2 border-accent">
                        <div className="text-[10px] text-gray-500 font-ui">INTEGRITY (HP)</div>
                        <div className="text-xl text-white font-header">{activeInfo.hp}</div>
                    </div>
                    <div className="bg-gray-900/50 p-3 border-l-2 border-red-500">
                        <div className="text-[10px] text-gray-500 font-ui">THREAT LEVEL</div>
                        <div className="text-xl text-red-500 font-header">{activeInfo.attackDamage}/sec</div>
                    </div>
                </div>

                <div className="mt-6 border-t border-gray-800 pt-4">
                    <h3 className="text-xs font-header text-gray-400 mb-2">TACTICAL NOTES</h3>
                    <p className="font-ui text-xs text-gray-600 leading-relaxed">
                        Target utilizes high-frequency hex dumps to overwhelm connection stability. 
                        Maintain high typing accuracy to generate HEAT and trigger massive damage bursts.
                        <br/><br/>
                        <span className="text-accent">RECOMMENDATION:</span> Equip Synaptic Accel hardware before engagement.
                    </p>
                </div>
                
                <button 
                    onClick={() => onSelect(activeInfo.id)}
                    className="mt-auto w-full py-4 bg-accent hover:bg-red-600 text-black font-header text-lg clip-corner-1 transition-colors"
                >
                    INITIATE LINK
                </button>
            </div>

        </div>
    </div>
  );
};

export default BountyBoard;