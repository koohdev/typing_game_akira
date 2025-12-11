import React from 'react';

const CRTOverlay: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden h-full w-full">
        {/* Scanlines */}
        <div className="absolute inset-0 scanlines opacity-10 mix-blend-overlay"></div>
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_60%,rgba(0,0,0,1)_100%)]"></div>
        
        {/* RGB Shift (Subtle) */}
        <div className="absolute inset-0 opacity-[0.03] animate-pulse pointer-events-none mix-blend-screen" style={{background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%'}}></div>
    </div>
  );
};

export default CRTOverlay;