export function Flag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <rect width="60" height="40" rx="3" fill="var(--color-rojo)" />
      <rect y="10" width="60" height="20" fill="var(--color-gualda)" />
      <rect x="13" y="14" width="7" height="12" rx="2" fill="var(--color-rojo)" opacity=".55" />
    </svg>
  );
}

export function Skyline({ className = "" }: { className?: string }) {
  const arches = Array.from({ length: 9 }, (_, i) => 160 + i * 30);
  return (
    <svg viewBox="0 0 1200 260" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden fill="currentColor">
      {/* Molino de La Mancha */}
      <polygon points="62,260 72,150 102,150 112,260" />
      <polygon points="64,152 87,122 110,152" />
      <g stroke="currentColor" strokeWidth="7" strokeLinecap="round">
        <line x1="45" y1="120" x2="129" y2="204" />
        <line x1="129" y1="120" x2="45" y2="204" />
      </g>
      {/* Acueducto de Segovia */}
      <rect x="150" y="120" width="282" height="18" />
      <rect x="150" y="176" width="282" height="12" />
      {arches.map((x) => (
        <rect key={x} x={x - 10} y="138" width="12" height="122" />
      ))}
      <rect x="150" y="138" width="10" height="122" />
      {/* Giralda */}
      <rect x="462" y="86" width="36" height="174" />
      <rect x="468" y="54" width="24" height="32" />
      <rect x="474" y="34" width="12" height="20" />
      <polygon points="474,34 480,14 486,34" />
      {/* Puerta de Alcalá */}
      <path d="M535 260V150h230v110h-28v-60a20 20 0 0 0-40 0v60h-26v-70a26 26 0 0 0-52 0v70h-26v-60a20 20 0 0 0-40 0v60z" />
      <rect x="525" y="140" width="250" height="12" />
      <rect x="612" y="112" width="76" height="28" />
      <polygon points="604,112 650,88 696,112" />
      {/* Sagrada Família */}
      <rect x="800" y="150" width="170" height="110" />
      {[812, 842, 872, 902, 932, 958].map((x, i) => (
        <polygon key={x} points={`${x - 9},150 ${x},${i === 2 || i === 3 ? 26 : 60} ${x + 9},150`} />
      ))}
      <polygon points="878,150 887,6 896,150" />
      {/* Torre de Hércules */}
      <rect x="1010" y="78" width="44" height="182" />
      <rect x="1018" y="50" width="28" height="28" />
      <polygon points="1018,50 1032,32 1046,50" />
      {/* Molino */}
      <polygon points="1100,260 1110,160 1138,160 1148,260" />
      <polygon points="1102,162 1124,134 1146,162" />
      <g stroke="currentColor" strokeWidth="7" strokeLinecap="round">
        <line x1="1088" y1="134" x2="1160" y2="206" />
        <line x1="1160" y1="134" x2="1088" y2="206" />
      </g>
      <rect y="252" width="1200" height="8" />
    </svg>
  );
}
