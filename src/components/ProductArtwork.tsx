import type { ArtworkVariant } from '../types.ts';

interface ProductArtworkProps {
  variant: ArtworkVariant;
  className?: string;
}

export function ProductArtwork({ variant, className = '' }: ProductArtworkProps) {
  if (variant === 'hero') {
    return (
      <div
        className={`relative w-full h-full overflow-hidden bg-[#ECEAE4] flex items-center justify-center ${className}`}
        role="img"
        aria-label="Crumb & Co. baking studio workbench with pre-measured Easy Packs, brass whisk, and copper moulds"
      >
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="heroWall" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F3F1EC" />
              <stop offset="100%" stopColor="#E5E1D8" />
            </linearGradient>
            <linearGradient id="marbleTop" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FAF9F6" />
              <stop offset="100%" stopColor="#EBE8E0" />
            </linearGradient>
            <linearGradient id="kraftBox" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D6BE9F" />
              <stop offset="100%" stopColor="#C1A480" />
            </linearGradient>
            <linearGradient id="sageTin" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B5D4D" />
              <stop offset="100%" stopColor="#2A4438" />
            </linearGradient>
          </defs>

          {/* Architectural studio backdrop */}
          <rect width="800" height="600" fill="url(#heroWall)" />
          {/* Soft sunlight diagonal beam */}
          <polygon points="0,0 440,0 640,420 0,420" fill="#FFFFFF" opacity="0.32" />
          {/* Window frame shadow */}
          <line x1="220" y1="0" x2="220" y2="390" stroke="#DDD8CE" strokeWidth="2" />
          <line x1="0" y1="185" x2="800" y2="185" stroke="#DDD8CE" strokeWidth="1.5" />

          {/* Studio Marble Bench */}
          <rect x="0" y="385" width="800" height="215" fill="url(#marbleTop)" />
          <line x1="0" y1="385" x2="800" y2="385" stroke="#D7D2C7" strokeWidth="2" />
          {/* Subtle marble veining */}
          <path d="M 40 440 Q 190 420 330 465 T 650 450" fill="none" stroke="#DFDBD1" strokeWidth="1.5" />
          <path d="M 140 525 Q 320 495 510 540 T 780 510" fill="none" stroke="#E2DFD6" strokeWidth="1.2" />

          {/* Tall glass flour & sugar studio jars (back left) */}
          <g transform="translate(86, 178)">
            <rect x="0" y="28" width="96" height="186" rx="10" fill="#FFFFFF" fillOpacity="0.65" stroke="#CFC9BD" strokeWidth="2" />
            <rect x="8" y="90" width="80" height="114" rx="5" fill="#F7F4EC" />
            <rect x="14" y="10" width="68" height="22" rx="4" fill="#9D7E5D" />
            <rect x="20" y="118" width="56" height="28" rx="2" fill="#FFFFFF" stroke="#D9D3C7" strokeWidth="1" />
            <line x1="30" y1="129" x2="66" y2="129" stroke="#2E4A3D" strokeWidth="2" />
            <line x1="34" y1="137" x2="62" y2="137" stroke="#8C8378" strokeWidth="1.5" />
          </g>

          <g transform="translate(198, 224)">
            <rect x="0" y="24" width="84" height="146" rx="10" fill="#FFFFFF" fillOpacity="0.65" stroke="#CFC9BD" strokeWidth="2" />
            <rect x="8" y="76" width="68" height="86" rx="4" fill="#E6D6BC" />
            <rect x="12" y="8" width="60" height="20" rx="4" fill="#9D7E5D" />
            <rect x="18" y="96" width="48" height="24" rx="2" fill="#FFFFFF" stroke="#D9D3C7" strokeWidth="1" />
            <line x1="26" y1="106" x2="58" y2="106" stroke="#2E4A3D" strokeWidth="2" />
          </g>

          {/* Signature Crumb & Co. Bakers Easy Pack Box (Center) */}
          <g transform="translate(275, 250)">
            {/* Shadow */}
            <ellipse cx="145" cy="182" rx="158" ry="18" fill="#1D1B18" opacity="0.09" />
            {/* Box Base */}
            <rect x="15" y="42" width="260" height="136" rx="6" fill="url(#kraftBox)" stroke="#A78965" strokeWidth="2" />
            {/* Box Lid / Forest Sleeve */}
            <rect x="15" y="42" width="260" height="58" rx="4" fill="url(#sageTin)" />
            <rect x="44" y="57" width="128" height="28" rx="2" fill="#FAF9F6" />
            <line x1="56" y1="68" x2="142" y2="68" stroke="#1D1B18" strokeWidth="2.5" />
            <line x1="56" y1="76" x2="112" y2="76" stroke="#78716C" strokeWidth="1.5" />
            {/* Pre-weighed kraft pouches peeking out top */}
            <path d="M 48 42 L 62 6 L 122 6 L 132 42 Z" fill="#EFE4D2" stroke="#C5B091" strokeWidth="1.5" />
            <path d="M 142 42 L 152 14 L 222 14 L 234 42 Z" fill="#F9F6EE" stroke="#D1C7B7" strokeWidth="1.5" />
            <rect x="74" y="18" width="38" height="14" rx="1" fill="#2E4A3D" />
            {/* Recipe card leaning on box */}
            <rect x="195" y="64" width="66" height="92" rx="3" fill="#FFFFFF" stroke="#D9D3C7" strokeWidth="1.5" transform="rotate(6 228 110)" />
            <line x1="208" y1="84" x2="246" y2="88" stroke="#2E4A3D" strokeWidth="2" />
            <line x1="206" y1="96" x2="242" y2="100" stroke="#A8A29E" strokeWidth="1.5" />
            <line x1="205" y1="106" x2="238" y2="109" stroke="#A8A29E" strokeWidth="1.5" />
            <line x1="204" y1="116" x2="232" y2="119" stroke="#A8A29E" strokeWidth="1.5" />
          </g>

          {/* Ceramic Plate with Fresh Golden Madeleines & Tartlets (Right foreground) */}
          <g transform="translate(530, 395)">
            <ellipse cx="110" cy="76" rx="115" ry="30" fill="#1D1B18" opacity="0.08" />
            <ellipse cx="110" cy="68" rx="112" ry="28" fill="#FFFFFF" stroke="#DDD8CE" strokeWidth="2" />
            <ellipse cx="110" cy="68" rx="82" ry="19" fill="#F6F4EF" />
            {/* Baked Madeleines */}
            <g transform="translate(46, 36) rotate(-14)">
              <path d="M 0 18 Q 22 -8 46 18 Q 22 36 0 18 Z" fill="#C98743" stroke="#9B6127" strokeWidth="1.5" />
              <line x1="12" y1="12" x2="28" y2="22" stroke="#A56A2E" strokeWidth="1.2" />
              <line x1="18" y1="9" x2="34" y2="19" stroke="#A56A2E" strokeWidth="1.2" />
            </g>
            <g transform="translate(98, 28) rotate(8)">
              <path d="M 0 18 Q 24 -10 50 18 Q 24 38 0 18 Z" fill="#D5964E" stroke="#9B6127" strokeWidth="1.5" />
              <line x1="14" y1="12" x2="30" y2="23" stroke="#AD7134" strokeWidth="1.2" />
              <line x1="20" y1="8" x2="36" y2="19" stroke="#AD7134" strokeWidth="1.2" />
            </g>
            <g transform="translate(132, 46) rotate(22)">
              <path d="M 0 16 Q 20 -8 42 16 Q 20 32 0 16 Z" fill="#BC7B39" stroke="#8C541F" strokeWidth="1.5" />
            </g>
          </g>

          {/* Silicone Canele Mould & Brass Whisk (Left foreground) */}
          <g transform="translate(80, 440)">
            <ellipse cx="75" cy="48" rx="76" ry="18" fill="#1D1B18" opacity="0.07" />
            <rect x="8" y="18" width="134" height="44" rx="8" fill="#3B5D4D" stroke="#253D32" strokeWidth="1.5" />
            <ellipse cx="38" cy="24" rx="18" ry="7" fill="#2A4438" />
            <ellipse cx="76" cy="24" rx="18" ry="7" fill="#2A4438" />
            <ellipse cx="114" cy="24" rx="18" ry="7" fill="#2A4438" />
          </g>

          {/* Brass Whisk */}
          <g transform="translate(240, 485) rotate(-18)">
            <rect x="0" y="10" width="88" height="11" rx="5.5" fill="#B58E52" stroke="#8B6A37" strokeWidth="1.2" />
            <path d="M 88 15 C 120 -4, 152 -2, 162 15 C 152 32, 120 34, 88 15 Z" fill="none" stroke="#9E988E" strokeWidth="1.6" />
            <path d="M 88 15 C 118 4, 148 5, 160 15 C 148 25, 118 26, 88 15 Z" fill="none" stroke="#9E988E" strokeWidth="1.4" />
            <line x1="88" y1="15" x2="162" y2="15" stroke="#9E988E" strokeWidth="1.3" />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-[#F1F0EB] flex items-center justify-center ${className}`}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#F1F0EB" />
        {/* Clean architectural studio pedestal */}
        <rect x="0" y="218" width="400" height="82" fill="#E6E4DD" />
        <line x1="0" y1="218" x2="400" y2="218" stroke="#D8D4CA" strokeWidth="1.5" />
        <ellipse cx="200" cy="236" rx="115" ry="14" fill="#1D1B18" opacity="0.07" />

        {variant === 'brownie-pack' && (
          <g>
            {/* Kraft Kit Box */}
            <rect x="92" y="88" width="164" height="142" rx="6" fill="#CBB08D" stroke="#9E825E" strokeWidth="2" />
            <rect x="92" y="88" width="164" height="44" rx="4" fill="#2E4A3D" />
            <rect x="112" y="101" width="96" height="18" rx="2" fill="#FAF9F6" />
            {/* Chocolate callets & cocoa pouch */}
            <path d="M 190 52 L 260 52 L 270 156 L 182 156 Z" fill="#4A3228" stroke="#321F18" strokeWidth="2" />
            <rect x="200" y="86" width="52" height="34" rx="2" fill="#FAF9F6" />
            <line x1="208" y1="98" x2="244" y2="98" stroke="#4A3228" strokeWidth="2.5" />
            <line x1="208" y1="108" x2="236" y2="108" stroke="#9C8F87" strokeWidth="1.5" />
            {/* Fudge brownie stack */}
            <rect x="228" y="182" width="72" height="28" rx="3" fill="#3D261E" stroke="#261610" strokeWidth="1.5" />
            <rect x="234" y="156" width="66" height="26" rx="3" fill="#4B3025" stroke="#261610" strokeWidth="1.5" />
            <circle cx="252" cy="162" r="2" fill="#FAF9F6" />
            <circle cx="274" cy="165" r="2" fill="#FAF9F6" />
          </g>
        )}

        {variant === 'matcha-pack' && (
          <g>
            {/* Cream kraft box */}
            <rect x="88" y="92" width="154" height="136" rx="6" fill="#D9C8AE" stroke="#AD997A" strokeWidth="2" />
            <rect x="88" y="92" width="154" height="40" rx="4" fill="#46694E" />
            <rect x="108" y="104" width="88" height="16" rx="2" fill="#FAF9F6" />
            {/* Matcha pouch */}
            <rect x="196" y="62" width="76" height="96" rx="5" fill="#5A7D5B" stroke="#3B573D" strokeWidth="2" />
            <circle cx="234" cy="108" r="18" fill="#FAF9F6" />
            {/* Baked Matcha Muffins */}
            <g transform="translate(230, 178)">
              <polygon points="8,24 54,24 48,54 14,54" fill="#F5F2EA" stroke="#C8C2B6" strokeWidth="1.5" />
              <path d="M 4 24 C 4 4, 58 4, 58 24 Z" fill="#6D8F5E" stroke="#4D6B41" strokeWidth="1.5" />
            </g>
            <g transform="translate(182, 192)">
              <polygon points="8,20 46,20 42,46 12,46" fill="#F5F2EA" stroke="#C8C2B6" strokeWidth="1.5" />
              <path d="M 4 20 C 4 4, 50 4, 50 20 Z" fill="#7B9D6B" stroke="#4D6B41" strokeWidth="1.5" />
            </g>
          </g>
        )}

        {variant === 'financier-pack' && (
          <g>
            <rect x="98" y="88" width="160" height="138" rx="6" fill="#DFC9A9" stroke="#B39873" strokeWidth="2" />
            <rect x="98" y="88" width="160" height="38" rx="4" fill="#2E4A3D" />
            {/* Almond flour & vanilla pouch */}
            <path d="M 184 54 L 258 54 L 266 154 L 178 154 Z" fill="#F7F3EA" stroke="#C8BEA9" strokeWidth="2" />
            <rect x="198" y="84" width="48" height="28" rx="2" fill="#2E4A3D" />
            {/* Golden Financiers */}
            <rect x="195" y="182" width="88" height="26" rx="5" fill="#C98942" stroke="#9B6225" strokeWidth="1.5" />
            <rect x="210" y="158" width="82" height="24" rx="5" fill="#D89B54" stroke="#9B6225" strokeWidth="1.5" />
          </g>
        )}

        {variant === 'macaron-class' && (
          <g>
            {/* Perforated baking mat */}
            <rect x="66" y="150" width="268" height="84" rx="8" fill="#FAF9F6" stroke="#CFCBC2" strokeWidth="2" />
            {/* Macaron shells */}
            {[
              { x: 118, y: 184, color: '#D8B4A0', fill: '#6E4C3E' },
              { x: 200, y: 184, color: '#8CA38A', fill: '#475E46' },
              { x: 282, y: 184, color: '#E2CE9C', fill: '#A38548' },
            ].map((mac, i) => (
              <g key={i} transform={`translate(${mac.x}, ${mac.y})`}>
                <ellipse cx="0" cy="14" rx="30" ry="10" fill={mac.color} stroke="#9E978D" strokeWidth="1" />
                <rect x="-28" y="4" width="56" height="8" rx="4" fill={mac.fill} />
                <ellipse cx="0" cy="0" rx="30" ry="11" fill={mac.color} stroke="#9E978D" strokeWidth="1" />
              </g>
            ))}
            {/* Pastry piping bag angled down */}
            <g transform="translate(190, 42) rotate(22)">
              <polygon points="0,0 56,12 24,108 16,108" fill="#FFFFFF" stroke="#CFC9BD" strokeWidth="2" />
              <polygon points="16,108 24,108 21,124 19,124" fill="#B5B0A6" />
            </g>
          </g>
        )}

        {variant === 'cheesecake-class' && (
          <g>
            {/* Cake stand */}
            <rect x="184" y="196" width="32" height="36" fill="#FAF9F6" stroke="#D2CDC3" strokeWidth="1.5" />
            <ellipse cx="200" cy="232" rx="56" ry="10" fill="#FAF9F6" stroke="#D2CDC3" strokeWidth="1.5" />
            <ellipse cx="200" cy="196" rx="108" ry="16" fill="#FFFFFF" stroke="#D2CDC3" strokeWidth="2" />
            {/* Basque Burnt Cheesecake */}
            <path d="M 122 188 L 130 104 Q 200 92 270 104 L 278 188 Q 200 202 122 188 Z" fill="#DFB87C" stroke="#9F6B2F" strokeWidth="2" />
            <ellipse cx="200" cy="106" rx="70" ry="14" fill="#5A331C" stroke="#3D2010" strokeWidth="2" />
            <ellipse cx="198" cy="105" rx="44" ry="8" fill="#7D4927" opacity="0.65" />
          </g>
        )}

        {variant === 'brioche-class' && (
          <g>
            {/* Wooden baking board */}
            <rect x="78" y="196" width="244" height="30" rx="6" fill="#C4A47C" stroke="#987A54" strokeWidth="2" />
            {/* Braided Brioche Loaf */}
            <path d="M 102 196 C 102 132, 174 118, 200 132 C 226 118, 298 132, 298 196 Z" fill="#CC873F" stroke="#91571E" strokeWidth="2" />
            <path d="M 148 138 Q 165 168 156 196" fill="none" stroke="#9C5F24" strokeWidth="2" />
            <path d="M 200 132 Q 214 166 202 196" fill="none" stroke="#9C5F24" strokeWidth="2" />
            <path d="M 252 138 Q 262 168 250 196" fill="none" stroke="#9C5F24" strokeWidth="2" />
            {/* Glaze drizzle */}
            <path d="M 134 148 Q 168 158 200 144 T 264 150" fill="none" stroke="#FAF6EE" strokeWidth="5" strokeLinecap="round" />
          </g>
        )}

        {(variant === 'chiffon-premix' || variant === 'hokkaido-premix' || variant === 'speculoos-premix') && (
          <g>
            {/* Main stand-up studio premix pouch */}
            <path
              d="M 124 64 L 276 64 L 288 228 L 112 228 Z"
              fill={
                variant === 'chiffon-premix'
                  ? '#3D2E28'
                  : variant === 'hokkaido-premix'
                  ? '#FAF7F0'
                  : '#D4B996'
              }
              stroke={variant === 'chiffon-premix' ? '#241A16' : '#B8A890'}
              strokeWidth="2"
            />
            {/* Zip seal line */}
            <line
              x1="126"
              y1="84"
              x2="274"
              y2="84"
              stroke={variant === 'chiffon-premix' ? '#6D584F' : '#CFC6B6'}
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            {/* Minimalist label block */}
            <rect x="148" y="106" width="104" height="86" rx="3" fill="#FFFFFF" stroke="#D8D3C8" strokeWidth="1.5" />
            <rect x="162" y="122" width="76" height="8" rx="1" fill="#2E4A3D" />
            <rect x="162" y="138" width="58" height="5" rx="1" fill="#A8A29E" />
            <rect x="162" y="149" width="66" height="5" rx="1" fill="#D6D3CD" />
            <rect x="162" y="170" width="38" height="10" rx="1" fill="#1D1B18" />
          </g>
        )}

        {variant === 'madeleine-mould' && (
          <g>
            {/* 12-cavity silicone madeleine tray */}
            <rect x="64" y="84" width="272" height="146" rx="10" fill="#3B5D4D" stroke="#253E32" strokeWidth="2.5" />
            {[0, 1, 2, 3].map((col) =>
              [0, 1].map((row) => (
                <g key={`${col}-${row}`} transform={`translate(${88 + col * 62}, ${106 + row * 56})`}>
                  <path
                    d="M 18 0 C 30 0, 36 16, 32 34 C 24 44, 12 44, 4 34 C 0 16, 6 0, 18 0 Z"
                    fill="#2A4438"
                    stroke="#4E7563"
                    strokeWidth="1.2"
                  />
                  <line x1="18" y1="6" x2="18" y2="36" stroke="#3F6353" strokeWidth="1" />
                </g>
              ))
            )}
          </g>
        )}

        {variant === 'cake-pan' && (
          <g>
            {/* Anodized loose-base cake pan */}
            <rect x="108" y="106" width="184" height="118" rx="4" fill="#C8CDD1" stroke="#8C9399" strokeWidth="2" />
            <ellipse cx="200" cy="224" rx="92" ry="18" fill="#B5BBC0" stroke="#8C9399" strokeWidth="2" />
            <ellipse cx="200" cy="106" rx="92" ry="18" fill="#E3E6E9" stroke="#8C9399" strokeWidth="2" />
            <ellipse cx="200" cy="106" rx="80" ry="14" fill="#9FA6AC" />
            {/* Lip highlight */}
            <path d="M 102 106 L 108 106 M 292 106 L 298 106" stroke="#8C9399" strokeWidth="3" />
          </g>
        )}

        {variant === 'canele-mould' && (
          <g>
            {/* 6-cavity heavy charcoal silicone canele mould */}
            <rect x="70" y="96" width="260" height="128" rx="10" fill="#2D2D30" stroke="#18181B" strokeWidth="2.5" />
            {[0, 1, 2].map((col) =>
              [0, 1].map((row) => (
                <g key={`${col}-${row}`} transform={`translate(${122 + col * 78}, ${134 + row * 52})`}>
                  <ellipse cx="0" cy="0" rx="24" ry="14" fill="#1B1B1D" stroke="#45454A" strokeWidth="1.5" />
                  <ellipse cx="0" cy="0" rx="14" ry="8" fill="#121214" />
                </g>
              ))
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
