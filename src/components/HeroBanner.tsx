import React from 'react';

interface HeroBannerProps {
  totalEffects?: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = () => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#1E1E1E] shadow-2xl bg-[#050505] mb-8 group">
      <img
        src="/banner.png"
        alt="atexteffects hero banner"
        className="w-full h-auto object-cover block select-none rounded-2xl"
        loading="eager"
      />
    </div>
  );
};
