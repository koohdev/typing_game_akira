import React from 'react';

interface VirtualKeyboardProps {
  activeKey: string | null;
}

const ROWS = [
  [
    { k: 'Q', s: '' }, { k: 'W', s: '' }, { k: 'E', s: '' }, { k: 'R', s: '' }, { k: 'T', s: '' },
    { k: 'Y', s: '' }, { k: 'U', s: '' }, { k: 'I', s: '' }, { k: 'O', s: '' }, { k: 'P', s: '' }
  ],
  [
    { k: 'A', s: '' }, { k: 'S', s: '' }, { k: 'D', s: '' }, { k: 'F', s: '' }, { k: 'G', s: '' },
    { k: 'H', s: '' }, { k: 'J', s: '' }, { k: 'K', s: '' }, { k: 'L', s: '' }
  ],
  [
    { k: 'Z', s: '' }, { k: 'X', s: '' }, { k: 'C', s: '' }, { k: 'V', s: '' }, { k: 'B', s: '' },
    { k: 'N', s: '' }, { k: 'M', s: '' }
  ],
  [
    { k: 'SPACE', w: true, s: '___' }
  ]
];

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ activeKey }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center gap-2 select-none opacity-80 pointer-events-none">
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-2 justify-center w-full">
          {row.map((keyObj) => {
            const isActive = activeKey === keyObj.k || (keyObj.k === 'SPACE' && activeKey === ' ');
            return (
              <div 
                key={keyObj.k}
                className={`
                  relative border transition-all duration-75 flex flex-col items-center justify-center
                  ${keyObj.w ? 'w-64 h-10' : 'w-8 h-10 sm:w-10 sm:h-12 md:w-12 md:h-14'}
                  ${isActive 
                    ? 'border-accent bg-accent text-black translate-y-1 shadow-[0_0_10px_var(--accent)]' 
                    : 'border-gray-800 bg-black/60 text-gray-500 shadow-[0_4px_0_#111]'}
                `}
              >
                <span className={`font-header text-xs sm:text-sm md:text-base ${isActive ? 'font-bold' : ''}`}>
                  {keyObj.k === 'SPACE' ? 'SPACE' : keyObj.k}
                </span>
                {/* Decorative Japanese chars for aesthetic */}
                {!keyObj.w && (
                    <span className={`text-[8px] absolute bottom-1 right-1 opacity-50 font-ui ${isActive ? 'text-black' : 'text-gray-700'}`}>
                        {String.fromCharCode(0x30A0 + (keyObj.k.charCodeAt(0) % 30))}
                    </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;