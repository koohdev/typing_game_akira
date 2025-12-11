import React from 'react';

interface HelmetHUDProps {
  damageTrigger: number; // Increment to trigger effect
}

const HelmetHUD: React.FC<HelmetHUDProps> = ({ damageTrigger }) => {
  const [isDamaged, setIsDamaged] = React.useState(false);

  React.useEffect(() => {
    if (damageTrigger > 0) {
      setIsDamaged(true);
      const t = setTimeout(() => setIsDamaged(false), 300);
      return () => clearTimeout(t);
    }
  }, [damageTrigger]);

  if (!isDamaged) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[55] w-full h-full">
       {/* Damage Flash Overlay */}
       <div className="absolute inset-0 bg-red-500 mix-blend-overlay opacity-30 transition-opacity duration-100"></div>
    </div>
  );
};

export default HelmetHUD;