import React, { useState } from 'react';
import { PlayerStats, Inventory } from '../types';
import { SHOP_DATA } from '../constants';
import { ShoppingCart, Cpu, Palette, Zap, Shield, Clock, Type } from 'lucide-react';

interface ShopProps {
  stats: PlayerStats;
  onPurchase: (category: 'software' | 'hardware' | 'themes', item: any) => void;
  onPrestige: () => void;
  onClose: () => void;
}

const Shop: React.FC<ShopProps> = ({ stats, onPurchase, onPrestige, onClose }) => {
  const [activeTab, setActiveTab] = useState<'software' | 'hardware' | 'themes'>('software');
  
  const isPrestigeReady = stats.hardware.length >= SHOP_DATA.hardware.length;

  const getIcon = (id: string, type: string) => {
      if (type === 'software') {
          if (id === 'time_freeze') return <Clock size={20}/>;
          if (id === 'auto_word') return <Type size={20}/>;
          if (id === 'proxy_shield') return <Shield size={20}/>;
      }
      if (type === 'hardware') return <Cpu size={20}/>;
      if (type === 'themes') return <Palette size={20}/>;
      return <Zap size={20}/>;
  };

  return (
    <div className="absolute inset-0 z-40 bg-[#050505] flex flex-col p-6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
            <div className="flex items-center gap-3">
                <ShoppingCart className="text-accent" size={32}/>
                <div>
                    <h2 className="font-header text-3xl text-white tracking-wide">BLACK MARKET</h2>
                    <div className="text-xs font-ui text-gray-500">UNREGISTERED VENDOR NODE</div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-[10px] text-gray-500 font-ui uppercase">Available Funds</div>
                <div className="text-2xl font-header text-accent">¥{stats.yen.toLocaleString()}</div>
            </div>
        </div>

        <div className="flex flex-1 gap-6 overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-48 flex flex-col gap-2">
                {['software', 'hardware', 'themes'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`p-4 text-left font-header text-sm transition-all border-l-2 ${activeTab === tab ? 'bg-gray-900 border-accent text-white' : 'border-gray-800 text-gray-600 hover:text-gray-400'}`}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
                
                <button onClick={onClose} className="mt-auto p-4 text-left font-ui text-xs border border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 transition-colors">
                    &lt; RETURN TO DASH
                </button>
            </div>

            {/* Grid Content */}
            <div className="flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SHOP_DATA[activeTab].map((item: any) => {
                        const owned = (activeTab === 'themes' && stats.ownedThemes.includes(item.id)) || 
                                      (activeTab === 'hardware' && stats.hardware.includes(item.id));
                        const canAfford = stats.yen >= item.cost;
                        
                        return (
                            <button 
                                key={item.id}
                                onClick={() => onPurchase(activeTab, item)}
                                disabled={owned || !canAfford}
                                className={`relative group p-6 border bg-black text-left flex flex-col h-40 transition-all
                                    ${owned ? 'border-gray-800 opacity-50' : canAfford ? 'border-gray-700 hover:border-accent hover:shadow-[0_0_20px_rgba(225,33,32,0.1)]' : 'border-red-900/30 opacity-70'}
                                `}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`p-2 bg-gray-900 rounded ${owned ? 'text-gray-600' : 'text-accent'}`}>
                                        {getIcon(item.id, activeTab)}
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 border ${owned ? 'border-gray-700 text-gray-600' : canAfford ? 'border-gray-600 text-white' : 'border-red-900 text-red-700'}`}>
                                        {owned ? 'OWNED' : `¥${item.cost}`}
                                    </span>
                                </div>
                                
                                <div className="mt-auto">
                                    <div className="font-header text-sm text-white group-hover:text-accent transition-colors">{item.name}</div>
                                    <div className="font-ui text-[10px] text-gray-500">{item.desc}</div>
                                </div>

                                {!owned && canAfford && (
                                    <div className="absolute inset-0 border-2 border-accent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Prestige Section */}
                {activeTab === 'hardware' && (
                    <div className="mt-8 border border-gray-800 bg-gray-900/20 p-6 relative overflow-hidden">
                         <div className="absolute inset-0 scanlines opacity-20"></div>
                         <div className="relative z-10 flex justify-between items-center">
                             <div>
                                 <h3 className="text-white font-header text-lg mb-1">SYSTEM REBOOT (PRESTIGE)</h3>
                                 <p className="text-[10px] text-gray-500 max-w-md">
                                     Requires all hardware. Wipes inventory/hardware/yen but grants PERMANENT BADGE & +10% EARNINGS.
                                 </p>
                             </div>
                             <button
                                onClick={onPrestige}
                                disabled={!isPrestigeReady}
                                className={`px-6 py-3 font-header text-sm border ${isPrestigeReady ? 'border-accent text-accent hover:bg-accent hover:text-black animate-pulse' : 'border-gray-800 text-gray-600 cursor-not-allowed'}`}
                             >
                                 {isPrestigeReady ? 'INITIATE REBOOT' : 'LOCKED'}
                             </button>
                         </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default Shop;