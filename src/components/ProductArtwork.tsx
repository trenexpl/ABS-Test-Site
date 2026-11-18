import type { ArtworkVariant } from '../types.ts';

interface ProductArtworkProps {
  variant: ArtworkVariant;
  className?: string;
}

export function ProductArtwork({ variant, className = '' }: ProductArtworkProps) {
  if (variant === 'hero') {
    return (
      <div
        className={`relative w-full h-full overflow-hidden bg-[#F9EDE0] flex items-center justify-center ${className}`}
        role="img"
        aria-label="ATB Baking Studio workbench with pre-measured Easy Packs, brass whisk, and studio moulds"
      >
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="heroWall" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF6EB" />
              <stop offset="100%" stopColor="#F5E4D2" />
            </linearGradient>
            <linearGradient id="marbleTop" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFDF9" />
              <stop offset="100%" stopColor="#F4E5D5" />
            </linearGradient>
            <linearGradient id="kraftBox" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E6C9AC" />
              <stop offset="100%" stopColor="#CFA983" />
            </linearGradient>
            <linearGradient id="coralTin" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E47D61" />
              <stop offset="100%" stopColor="#C6583E" />
            </linearGradient>
          </defs>

          {/* Warm Cream Studio Backdrop */}
          <rect width="800" height="600" fill="url(#heroWall)" />
          <polygon points="0,0 440,0 640,420 0,420" fill="#FFFFFF" opacity="0.38" />
          <line x1="220" y1="0" x2="220" y2="390" stroke="#EAD4BF" strokeWidth="2" />
          <line x1="0" y1="185" x2="800" y2="185" stroke="#EAD4BF" strokeWidth="1.5" />

          {/* Studio Pastry Counter */}
          <rect x="0" y="385" width="800" height="215" fill="url(#marbleTop)" />
          <line x1="0" y1="385" x2="800" y2="385" stroke="#E5CBB5" strokeWidth="2" />
          <path d="M 40 440 Q 190 420 330 465 T 650 450" fill="none" stroke="#EDD8C5" strokeWidth="1.5" />
          <path d="M 140 525 Q 320 495 510 540 T 780 510" fill="none" stroke="#EFE0D0" strokeWidth="1.2" />

          {/* Tall glass flour & sugar studio jars with blush ribbon */}
          <g transform="translate(86, 178)">
            <rect x="0" y="28" width="96" height="186" rx="10" fill="#FFFFFF" fillOpacity="0.72" stroke="#D9BFAA" strokeWidth="2" />
            <rect x="8" y="90" width="80" height="114" rx="5" fill="#FFF9F0" />
            <rect x="14" y="10" width="68" height="22" rx="4" fill="#C68B6B" />
            <rect x="20" y="118" width="56" height="28" rx="3" fill="#FFFFFF" stroke="#E8CEBA" strokeWidth="1" />
            <line x1="30" y1="129" x2="66" y2="129" stroke="#C6583E" strokeWidth="2" />
            <line x1="34" y1="137" x2="62" y2="137" stroke="#8C6A58" strokeWidth="1.5" />
          </g>

          <g transform="translate(198, 224)">
            <rect x="0" y="24" width="84" height="146" rx="10" fill="#FFFFFF" fillOpacity="0.72" stroke="#D9BFAA" strokeWidth="2" />
            <rect x="8" y="76" width="68" height="86" rx="4" fill="#F2E2CC" />
            <rect x="12" y="8" width="60" height="20" rx="4" fill="#C68B6B" />
            <rect x="18" y="96" width="48" height="24" rx="3" fill="#FFFFFF" stroke="#E8CEBA" strokeWidth="1" />
            <line x1="26" y1="106" x2="58" y2="106" stroke="#C6583E" strokeWidth="2" />
          </g>

          {/* Signature ATB Baking Studio Easy Pack Box (Center) */}
          <g transform="translate(275, 250)">
            <ellipse cx="145" cy="182" rx="158" ry="18" fill="#472E22" opacity="0.09" />
            <rect x="15" y="42" width="260" height="136" rx="8" fill="url(#kraftBox)" stroke="#B08968" strokeWidth="2" />
            <rect x="15" y="42" width="260" height="58" rx="6" fill="url(#coralTin)" />
            <rect x="44" y="57" width="128" height="28" rx="3" fill="#FFFDF9" />
            <line x1="56" y1="68" x2="142" y2="68" stroke="#472E22" strokeWidth="2.5" />
            <line x1="56" y1="76" x2="112" y2="76" stroke="#8C6A58" strokeWidth="1.5" />
            {/* Pre-weighed kraft pouches */}
            <path d="M 48 42 L 62 6 L 122 6 L 132 42 Z" fill="#F9ECDD" stroke="#D4B79B" strokeWidth="1.5" />
            <path d="M 142 42 L 152 14 L 222 14 L 234 42 Z" fill="#FFFDF8" stroke="#DEC9B6" strokeWidth="1.5" />
            <rect x="74" y="18" width="38" height="14" rx="2" fill="#E47D61" />
            {/* Recipe card */}
            <rect x="195" y="64" width="66" height="92" rx="4" fill="#FFFFFF" stroke="#E5CEBC" strokeWidth="1.5" transform="rotate(6 228 110)" />
            <line x1="208" y1="84" x2="246" y2="88" stroke="#C6583E" strokeWidth="2" />
            <line x1="206" y1="96" x2="242" y2="100" stroke="#B09483" strokeWidth="1.5" />
            <line x1="205" y1="106" x2="238" y2="109" stroke="#B09483" strokeWidth="1.5" />
            <line x1="204" y1="116" x2="232" y2="119" stroke="#B09483" strokeWidth="1.5" />
          </g>

          {/* Ceramic Cake Stand with Iced Sponge Cake & Botanical Flowers (Right foreground) */}
          <g transform="translate(530, 395)">
            <ellipse cx="110" cy="76" rx="115" ry="30" fill="#472E22" opacity="0.08" />
            <ellipse cx="110" cy="68" rx="112" ry="28" fill="#FFFFFF" stroke="#E5CEBC" strokeWidth="2" />
            <ellipse cx="110" cy="68" rx="82" ry="19" fill="#FFF7EE" />
            {/* Golden Madeleines */}
            <g transform="translate(46, 36) rotate(-14)">
              <path d="M 0 18 Q 22 -8 46 18 Q 22 36 0 18 Z" fill="#DDA059" stroke="#A66A2D" strokeWidth="1.5" />
              <line x1="12" y1="12" x2="28" y2="22" stroke="#B67635" strokeWidth="1.2" />
              <line x1="18" y1="9" x2="34" y2="19" stroke="#B67635" strokeWidth="1.2" />
            </g>
            <g transform="translate(98, 28) rotate(8)">
              <path d="M 0 18 Q 24 -10 50 18 Q 24 38 0 18 Z" fill="#E6AD68" stroke="#A66A2D" strokeWidth="1.5" />
              <line x1="14" y1="12" x2="30" y2="23" stroke="#BA7B3A" strokeWidth="1.2" />
              <line x1="20" y1="8" x2="36" y2="19" stroke="#BA7B3A" strokeWidth="1.2" />
            </g>
            {/* Blush flower garnish */}
            <g transform="translate(158, 56)">
              <circle cx="0" cy="-6" r="5" fill="#F3A2A5" />
              <circle cx="6" cy="0" r="5" fill="#F3A2A5" />
              <circle cx="-6" cy="0" r="5" fill="#F3A2A5" />
              <circle cx="0" cy="6" r="5" fill="#F3A2A5" />
              <circle cx="0" cy="0" r="3" fill="#F6D57A" />
            </g>
          </g>

          {/* Coral Silicone Mould (Left foreground) */}
          <g transform="translate(80, 440)">
            <ellipse cx="75" cy="48" rx="76" ry="18" fill="#472E22" opacity="0.07" />
            <rect x="8" y="18" width="134" height="44" rx="8" fill="#E47D61" stroke="#C6583E" strokeWidth="1.5" />
            <ellipse cx="38" cy="24" rx="18" ry="7" fill="#C6583E" />
            <ellipse cx="76" cy="24" rx="18" ry="7" fill="#C6583E" />
            <ellipse cx="114" cy="24" rx="18" ry="7" fill="#C6583E" />
          </g>

          {/* Warm Wood & Brass Whisk */}
          <g transform="translate(240, 485) rotate(-18)">
            <rect x="0" y="10" width="88" height="11" rx="5.5" fill="#C9925B" stroke="#9A6838" strokeWidth="1.2" />
            <path d="M 88 15 C 120 -4, 152 -2, 162 15 C 152 32, 120 34, 88 15 Z" fill="none" stroke="#9B8271" strokeWidth="1.6" />
            <path d="M 88 15 C 118 4, 148 5, 160 15 C 148 25, 118 26, 88 15 Z" fill="none" stroke="#9B8271" strokeWidth="1.4" />
            <line x1="88" y1="15" x2="162" y2="15" stroke="#9B8271" strokeWidth="1.3" />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-[#F9EDE0] flex items-center justify-center ${className}`}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#FDF3E7" />
        {/* Warm Biscuit Studio Pedestal */}
        <rect x="0" y="218" width="400" height="82" fill="#F4E2D0" />
        <line x1="0" y1="218" x2="400" y2="218" stroke="#E7CBB2" strokeWidth="1.5" />
        <ellipse cx="200" cy="236" rx="115" ry="14" fill="#472E22" opacity="0.08" />

        {variant === 'brownie-pack' && (
          <g>
            <rect x="92" y="88" width="164" height="142" rx="8" fill="#DFBE9B" stroke="#B38D67" strokeWidth="2" />
            <rect x="92" y="88" width="164" height="44" rx="6" fill="#E47D61" />
            <rect x="112" y="101" width="96" height="18" rx="3" fill="#FFFDF9" />
            <path d="M 190 52 L 260 52 L 270 156 L 182 156 Z" fill="#5D3D2E" stroke="#3E271C" strokeWidth="2" />
            <rect x="200" y="86" width="52" height="34" rx="3" fill="#FFFDF9" />
            <line x1="208" y1="98" x2="244" y2="98" stroke="#5D3D2E" strokeWidth="2.5" />
            <line x1="208" y1="108" x2="236" y2="108" stroke="#B09483" strokeWidth="1.5" />
            <rect x="228" y="182" width="72" height="28" rx="4" fill="#472E22" stroke="#2D1B13" strokeWidth="1.5" />
            <rect x="234" y="156" width="66" height="26" rx="4" fill="#5D3D2E" stroke="#2D1B13" strokeWidth="1.5" />
            <circle cx="252" cy="162" r="2" fill="#FFFDF9" />
            <circle cx="274" cy="165" r="2" fill="#FFFDF9" />
          </g>
        )}

        {variant === 'matcha-pack' && (
          <g>
            <rect x="88" y="92" width="154" height="136" rx="8" fill="#E6CCB0" stroke="#BA9978" strokeWidth="2" />
            <rect x="88" y="92" width="154" height="40" rx="6" fill="#7C8C4E" />
            <rect x="108" y="104" width="88" height="16" rx="3" fill="#FFFDF9" />
            <rect x="196" y="62" width="76" height="96" rx="6" fill="#7C8C4E" stroke="#5C6A36" strokeWidth="2" />
            <circle cx="234" cy="108" r="18" fill="#FFFDF9" />
            <g transform="translate(230, 178)">
              <polygon points="8,24 54,24 48,54 14,54" fill="#FFFDF9" stroke="#DFC8B4" strokeWidth="1.5" />
              <path d="M 4 24 C 4 4, 58 4, 58 24 Z" fill="#8A9C57" stroke="#66753D" strokeWidth="1.5" />
            </g>
            <g transform="translate(182, 192)">
              <polygon points="8,20 46,20 42,46 12,46" fill="#FFFDF9" stroke="#DFC8B4" strokeWidth="1.5" />
              <path d="M 4 20 C 4 4, 50 4, 50 20 Z" fill="#98AA64" stroke="#66753D" strokeWidth="1.5" />
            </g>
          </g>
        )}

        {variant === 'financier-pack' && (
          <g>
            <rect x="98" y="88" width="160" height="138" rx="8" fill="#E7CEB2" stroke="#BC9C79" strokeWidth="2" />
            <rect x="98" y="88" width="160" height="38" rx="6" fill="#E47D61" />
            <path d="M 184 54 L 258 54 L 266 154 L 178 154 Z" fill="#FFF9F0" stroke="#DFC8B2" strokeWidth="2" />
            <rect x="198" y="84" width="48" height="28" rx="3" fill="#E47D61" />
            <rect x="195" y="182" width="88" height="26" rx="5" fill="#D5964C" stroke="#A66A2D" strokeWidth="1.5" />
            <rect x="210" y="158" width="82" height="24" rx="5" fill="#E3A75F" stroke="#A66A2D" strokeWidth="1.5" />
          </g>
        )}

        {variant === 'macaron-class' && (
          <g>
            <rect x="66" y="150" width="268" height="84" rx="8" fill="#FFFDF9" stroke="#E5CEBC" strokeWidth="2" />
            {[
              { x: 118, y: 184, color: '#F3A2A5', fill: '#C6583E' },
              { x: 200, y: 184, color: '#B0BE80', fill: '#66753D' },
              { x: 282, y: 184, color: '#F0CF9B', fill: '#9A6838' },
            ].map((mac, i) => (
              <g key={i} transform={`translate(${mac.x}, ${mac.y})`}>
                <ellipse cx="0" cy="14" rx="30" ry="10" fill={mac.color} stroke="#B89B8B" strokeWidth="1" />
                <rect x="-28" y="4" width="56" height="8" rx="4" fill={mac.fill} />
                <ellipse cx="0" cy="0" rx="30" ry="11" fill={mac.color} stroke="#B89B8B" strokeWidth="1" />
              </g>
            ))}
            <g transform="translate(190, 42) rotate(22)">
              <polygon points="0,0 56,12 24,108 16,108" fill="#FFFFFF" stroke="#DFC8B4" strokeWidth="2" />
              <polygon points="16,108 24,108 21,124 19,124" fill="#C9A894" />
            </g>
          </g>
        )}

        {variant === 'cheesecake-class' && (
          <g>
            <rect x="184" y="196" width="32" height="36" fill="#FFFDF9" stroke="#DFC8B4" strokeWidth="1.5" />
            <ellipse cx="200" cy="232" rx="56" ry="10" fill="#FFFDF9" stroke="#DFC8B4" strokeWidth="1.5" />
            <ellipse cx="200" cy="196" rx="108" ry="16" fill="#FFFFFF" stroke="#DFC8B4" strokeWidth="2" />
            <path d="M 122 188 L 130 104 Q 200 92 270 104 L 278 188 Q 200 202 122 188 Z" fill="#ECC382" stroke="#A66D32" strokeWidth="2" />
            <ellipse cx="200" cy="106" rx="70" ry="14" fill="#6B3D24" stroke="#472615" strokeWidth="2" />
            <ellipse cx="198" cy="105" rx="44" ry="8" fill="#8C5332" opacity="0.65" />
          </g>
        )}

        {variant === 'brioche-class' && (
          <g>
            <rect x="78" y="196" width="244" height="30" rx="6" fill="#D4B089" stroke="#A37D58" strokeWidth="2" />
            <path d="M 102 196 C 102 132, 174 118, 200 132 C 226 118, 298 132, 298 196 Z" fill="#D99047" stroke="#9B5C22" strokeWidth="2" />
            <path d="M 148 138 Q 165 168 156 196" fill="none" stroke="#A36326" strokeWidth="2" />
            <path d="M 200 132 Q 214 166 202 196" fill="none" stroke="#A36326" strokeWidth="2" />
            <path d="M 252 138 Q 262 168 250 196" fill="none" stroke="#A36326" strokeWidth="2" />
            <path d="M 134 148 Q 168 158 200 144 T 264 150" fill="none" stroke="#FFF9F0" strokeWidth="5" strokeLinecap="round" />
          </g>
        )}

        {(variant === 'chiffon-premix' || variant === 'hokkaido-premix' || variant === 'speculoos-premix') && (
          <g>
            <path
              d="M 124 64 L 276 64 L 288 228 L 112 228 Z"
              fill={
                variant === 'chiffon-premix'
                  ? '#5D3D2E'
                  : variant === 'hokkaido-premix'
                  ? '#FFFDF8'
                  : '#E2C3A1'
              }
              stroke={variant === 'chiffon-premix' ? '#3E271C' : '#C6A684'}
              strokeWidth="2"
            />
            <line
              x1="126"
              y1="84"
              x2="274"
              y2="84"
              stroke={variant === 'chiffon-premix' ? '#8C6A58' : '#D9C2AC'}
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <rect x="148" y="106" width="104" height="86" rx="4" fill="#FFFFFF" stroke="#E5CEBC" strokeWidth="1.5" />
            <rect x="162" y="122" width="76" height="8" rx="2" fill="#E47D61" />
            <rect x="162" y="138" width="58" height="5" rx="1" fill="#A88977" />
            <rect x="162" y="149" width="66" height="5" rx="1" fill="#DEC8B6" />
            <rect x="162" y="170" width="38" height="10" rx="2" fill="#472E22" />
          </g>
        )}

        {variant === 'madeleine-mould' && (
          <g>
            <rect x="64" y="84" width="272" height="146" rx="12" fill="#E47D61" stroke="#C6583E" strokeWidth="2.5" />
            {[0, 1, 2, 3].map((col) =>
              [0, 1].map((row) => (
                <g key={`${col}-${row}`} transform={`translate(${88 + col * 62}, ${106 + row * 56})`}>
                  <path
                    d="M 18 0 C 30 0, 36 16, 32 34 C 24 44, 12 44, 4 34 C 0 16, 6 0, 18 0 Z"
                    fill="#C6583E"
                    stroke="#F29E88"
                    strokeWidth="1.2"
                  />
                  <line x1="18" y1="6" x2="18" y2="36" stroke="#DF7053" strokeWidth="1" />
                </g>
              ))
            )}
          </g>
        )}

        {variant === 'cake-pan' && (
          <g>
            <rect x="108" y="106" width="184" height="118" rx="4" fill="#D5CCC3" stroke="#9C8F84" strokeWidth="2" />
            <ellipse cx="200" cy="224" rx="92" ry="18" fill="#C2B8AE" stroke="#9C8F84" strokeWidth="2" />
            <ellipse cx="200" cy="106" rx="92" ry="18" fill="#EDE7E0" stroke="#9C8F84" strokeWidth="2" />
            <ellipse cx="200" cy="106" rx="80" ry="14" fill="#B3A79C" />
            <path d="M 102 106 L 108 106 M 292 106 L 298 106" stroke="#9C8F84" strokeWidth="3" />
          </g>
        )}

        {variant === 'canele-mould' && (
          <g>
            <rect x="70" y="96" width="260" height="128" rx="12" fill="#5D3D2E" stroke="#3E271C" strokeWidth="2.5" />
            {[0, 1, 2].map((col) =>
              [0, 1].map((row) => (
                <g key={`${col}-${row}`} transform={`translate(${122 + col * 78}, ${134 + row * 52})`}>
                  <ellipse cx="0" cy="0" rx="24" ry="14" fill="#3E271C" stroke="#7B5D4D" strokeWidth="1.5" />
                  <ellipse cx="0" cy="0" rx="14" ry="8" fill="#2A1912" />
                </g>
              ))
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
