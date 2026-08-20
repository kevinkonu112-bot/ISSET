"use client";

export default function IssetLogo() {
  return (
    <div className="w-full flex flex-col items-center text-center">
      {/* Logo ISSET animé étendu au maximum */}
      <div className="w-full">
        <svg className="w-full h-auto drop-shadow-2xl overflow-visible" viewBox="0 0 600 130">
          <defs>
            <style>{`
              .anim-path {
                fill: none;
                stroke: #22d3ee;
                stroke-width: 5;
                stroke-linecap: round;
                stroke-dasharray: 14 14;
                animation: dash-animation 3s linear infinite;
              }
              @keyframes dash-animation { 
                to { stroke-dashoffset: -280; } 
              }
            `}</style>
          </defs>
          <text 
            x="50%" 
            y="75%" 
            textAnchor="middle" 
            className="anim-path tracking-wider" 
            style={{ fontSize: '110px', fontWeight: 900, fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            ISSET
          </text>
        </svg>
      </div>
      
      {/* Définition en mode plein écran, très large, massive et sans marges latérales */}
      <h2 className="mt-6 w-full px-0 font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.1]">
        INSTITUTIONS SCIENTIFIQUES SUPÉRIEURES <br className="hidden sm:block" />
        ET D’ENSEIGNEMENT TECHNIQUE
      </h2>
    </div>
  );
}