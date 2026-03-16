import React, { useMemo } from 'react';

const ParticleRing = ({ size = 700, className = '' }) => {
  const particles = useMemo(() => {
    const result = [];
    const rings = [
      { count: 20, radius: size * 0.18, opacity: 0.15, sizeRange: [1.5, 2.5] },
      { count: 30, radius: size * 0.30, opacity: 0.10, sizeRange: [1.2, 2.0] },
      { count: 30, radius: size * 0.42, opacity: 0.05, sizeRange: [1.0, 1.8] },
    ];

    rings.forEach((ring) => {
      for (let i = 0; i < ring.count; i++) {
        const angle = (2 * Math.PI * i) / ring.count + (Math.random() - 0.5) * 0.3;
        const r = ring.radius + (Math.random() - 0.5) * size * 0.04;
        const cx = size / 2 + Math.cos(angle) * r;
        const cy = size / 2 + Math.sin(angle) * r;
        const particleSize = ring.sizeRange[0] + Math.random() * (ring.sizeRange[1] - ring.sizeRange[0]);
        result.push({ cx, cy, r: particleSize, opacity: ring.opacity + Math.random() * 0.05 });
      }
    });
    return result;
  }, [size]);

  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)',
        WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="animate-orbit"
        style={{ animationDuration: '80s' }}
      >
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill={`rgba(66, 133, 244, ${p.opacity})`}
          />
        ))}
      </svg>
    </div>
  );
};

export default ParticleRing;
