import React from 'react';
import { Settings as SettingsType } from '../types';
import { resetData } from '../services/storage';

interface SettingsProps {
  settings: SettingsType;
  updateSettings: (k: keyof SettingsType, v: any) => void;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, updateSettings, onClose }) => {
  return (
    <div className="absolute inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
        <div className="border border-gray-800 bg-gray-900/90 p-8 max-w-md w-full relative max-h-screen overflow-y-auto">
            <h2 className="font-header text-2xl text-white mb-6">SYSTEM CONFIG</h2>
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between text-xs text-gray-500 font-ui mb-2">
                        <span>AUDIO OUTPUT</span>
                        <span>{settings.vol}%</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={settings.vol} 
                        className="w-full accent-red-600 h-1 bg-gray-700 appearance-none cursor-pointer"
                        onChange={(e) => updateSettings('vol', Number(e.target.value))}
                    />
                </div>
                
                <div className="border-t border-gray-800 pt-4">
                    <div className="text-xs text-gray-500 font-ui mb-2">FONT SIZE</div>
                    <div className="flex gap-2">
                        {['small', 'medium', 'large'].map((s) => (
                            <button
                                key={s}
                                onClick={() => updateSettings('fontSize', s)}
                                className={`flex-1 py-1 text-xs border ${settings.fontSize === s ? 'border-accent text-accent' : 'border-gray-700 text-gray-500'}`}
                            >
                                {s.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-4">
                    <div className="text-xs text-gray-500 font-ui mb-2">CURSOR STYLE</div>
                    <div className="flex gap-2">
                        {['block', 'underscore', 'beam'].map((s) => (
                            <button
                                key={s}
                                onClick={() => updateSettings('caretStyle', s)}
                                className={`flex-1 py-1 text-xs border ${settings.caretStyle === s ? 'border-accent text-accent' : 'border-gray-700 text-gray-500'}`}
                            >
                                {s.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-800 pt-4">
                    <div className="text-xs text-gray-500 font-ui">VIRTUAL KEYBOARD</div>
                    <button 
                        onClick={() => updateSettings('virtualKeyboard', !settings.virtualKeyboard)}
                        className={`text-xs font-header border px-3 py-1 ${settings.virtualKeyboard ? 'text-accent border-accent' : 'text-gray-500 border-gray-700'}`}
                    >
                        {settings.virtualKeyboard ? 'ON' : 'OFF'}
                    </button>
                </div>

                <div className="flex justify-between items-center border-t border-gray-800 pt-4">
                    <div className="text-xs text-gray-500 font-ui">LOW FX MODE</div>
                    <button 
                        onClick={() => updateSettings('lowFx', !settings.lowFx)}
                        className={`text-xs font-header border px-3 py-1 ${settings.lowFx ? 'text-accent border-accent' : 'text-gray-500 border-gray-700'}`}
                    >
                        {settings.lowFx ? 'ON' : 'OFF'}
                    </button>
                </div>

                <div className="flex justify-between items-center border-t border-gray-800 pt-4">
                    <div className="text-xs text-red-900 font-ui">DANGER ZONE</div>
                    <button onClick={resetData} className="text-[10px] text-red-900 border border-red-900 px-2 py-1 hover:bg-red-900 hover:text-white">
                        WIPE SAVE DATA
                    </button>
                </div>
            </div>
            <button onClick={onClose} className="mt-8 w-full btn-cyber py-3 text-white">SAVE & EXIT</button>
        </div>
    </div>
  );
};

export default Settings;