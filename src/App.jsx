import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Globe, User, ChevronRight } from 'lucide-react';

const Slot = ({ number }) => {
  const [hasError, setHasError] = useState(false);
  return (
    <div className="relative w-[98px] h-[174px] border-[3px] border-dashed border-[#7e22ce] bg-[#fdf5e6]/40 rounded-sm flex flex-col items-center justify-center overflow-hidden shadow-[inset_0_4px_10px_rgba(0,0,0,0.1)] group hover:bg-[#fdf5e6]/60 transition-colors">
      {!hasError ? (
        <img
          src={`/figurinhas/${number}.png`}
          alt={`Figurinha ${number}`}
          className="w-full h-full object-contain select-none pointer-events-none"
          draggable="false"
          onError={() => setHasError(true)}
        />
      ) : (
        <>
          <div className="absolute top-2 left-2 text-[#6b21a8] font-black text-sm drop-shadow-sm">{number}</div>
          <User className="w-12 h-12 text-[#a855f7] opacity-40 mb-2 group-hover:scale-110 transition-transform duration-300" />
          <div className="w-16 h-3 bg-[#9333ea]/20 rounded-[100%] blur-[2px]"></div>
          <div className="absolute bottom-1.5 w-full text-center text-[9px] font-bold text-[#9333ea]/50 tracking-[0.2em] uppercase">P-26</div>
        </>
      )}
    </div>
  );
};

const InnerPage = ({ title, startSlot, pageNum }) => (
  <div className="w-full h-full bg-[#f2e6c5] p-8 flex flex-col relative overflow-hidden text-center page-texture shadow-[inset_0_0_40px_rgba(107,33,168,0.1)]">
    <Globe className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] text-[#a855f7] opacity-[0.06]" />

    <div className="absolute top-5 left-5 right-5 bottom-5 border border-[#a855f7]/40 pointer-events-none"></div>
    <div className="absolute top-6 left-6 right-6 bottom-6 border border-[#6b21a8]/20 pointer-events-none"></div>

    <div className="relative z-10 flex flex-col h-full">
      <h2 className="text-2xl font-bold text-[#6b21a8] mb-4 tracking-[0.25em] uppercase border-b border-[#a855f7]/50 pb-2">
        {title}
      </h2>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="flex justify-center gap-8 w-full">
          <Slot number={startSlot} />
          <Slot number={startSlot + 1} />
        </div>
        <div className="flex justify-center w-full my-1">
          <Slot number={startSlot + 2} />
        </div>
        <div className="flex justify-center gap-8 w-full">
          <Slot number={startSlot + 3} />
          <Slot number={startSlot + 4} />
        </div>
      </div>

      <div className="text-[#6b21a8]/60 text-xs font-semibold tracking-widest mt-4">
        {pageNum} / 4
      </div>
    </div>

    <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-black/20 to-transparent pointer-events-none"></div>
  </div>
);

const stickers = [
  ...Array.from({ length: 6 }, (_, i) => ({ id: i + 1, rarity: 'Comum' })),
  ...Array.from({ length: 6 }, (_, i) => ({ id: i + 7, rarity: 'Raro' })),
  ...Array.from({ length: 5 }, (_, i) => ({ id: i + 13, rarity: 'Super Raro' })),
  ...Array.from({ length: 3 }, (_, i) => ({ id: i + 18, rarity: 'Lendário' })),
];

const rarityConfig = {
  'Comum': { label: 'Comum', color: 'from-zinc-500 to-zinc-400', border: 'border-zinc-500/50', text: 'text-zinc-300', badge: 'bg-zinc-600' },
  'Raro': { label: 'Raro', color: 'from-blue-500 to-blue-400', border: 'border-blue-500/50', text: 'text-blue-300', badge: 'bg-blue-600' },
  'Super Raro': { label: 'Super Raro', color: 'from-purple-500 to-fuchsia-400', border: 'border-purple-500/50', text: 'text-purple-300', badge: 'bg-purple-600' },
  'Lendário': { label: 'Lendário', color: 'from-amber-500 to-orange-400', border: 'border-amber-500/50', text: 'text-amber-300', badge: 'bg-amber-600' },
};

const StickerCard = ({ id, rarity }) => {
  const [hasError, setHasError] = useState(false);
  const cfg = rarityConfig[rarity];
  return (
    <div className={`relative w-[180px] h-[320px] border-[2px] ${cfg.border} bg-[#1a0f24] rounded-sm flex flex-col items-center justify-center overflow-hidden shadow-lg group`}>
      {!hasError ? (
        <img src={`/figurinhas/${id}.png`} alt={`#${id}`} className="w-full h-full object-contain select-none pointer-events-none" draggable="false" onError={() => setHasError(true)} />
      ) : (
        <>
          <div className="absolute top-1.5 left-1.5 text-white/30 font-bold text-xs">{id}</div>
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${cfg.color} opacity-30 mb-1`}></div>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.text}`}>{rarity}</span>
        </>
      )}
    </div>
  );
};

const App = () => {
  const [category, setCategory] = useState('album');
  const [activeSheet, setActiveSheet] = useState(0);
  const [scale, setScale] = useState(1);
  const dragData = useRef({ isDragging: false, startX: 0 });
  const [dragRender, setDragRender] = useState({ target: null, progress: 0 });

  const TOTAL_SHEETS = 4;
  const PAGE_WIDTH = 512;

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const targetWidth = 1072;
      const targetHeight = 720;

      let newScale = Math.min(1, screenWidth / targetWidth);

      if (screenHeight < targetHeight * newScale) {
        newScale = screenHeight / targetHeight;
      }

      setScale(newScale);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (e) => {
    dragData.current = { isDragging: true, startX: e.clientX };
    setDragRender({ target: null, progress: 0 });
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!dragData.current.isDragging) return;

      const delta = (e.clientX - dragData.current.startX) / scale;

      let target = null;
      let progress = 0;

      if (delta < 0 && activeSheet < TOTAL_SHEETS) {
        target = activeSheet;
        progress = Math.max(-180, (delta / PAGE_WIDTH) * 180);
      } else if (delta > 0 && activeSheet > 0) {
        target = activeSheet - 1;
        progress = Math.min(180, (delta / PAGE_WIDTH) * 180);
      }

      setDragRender({ target, progress });
    };

    const handleUp = () => {
      if (!dragData.current.isDragging) return;
      dragData.current.isDragging = false;

      const prev = dragRender;
      let newActive = activeSheet;
      if (prev.progress < -45 && prev.target === activeSheet) {
        newActive++;
      } else if (prev.progress > 45 && prev.target === activeSheet - 1) {
        newActive--;
      }

      setActiveSheet(newActive);
      setDragRender({ target: null, progress: 0 });
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, [activeSheet, scale, dragRender]);

  const renderSheet = (index) => {
    let rot = 0;
    let isDragged = dragData.current.isDragging && dragRender.target === index;

    if (isDragged) {
      rot = index === activeSheet ? dragRender.progress : -180 + dragRender.progress;
    } else {
      rot = index < activeSheet ? -180 : 0;
    }

    const zIndex = isDragged ? 50 : (index < activeSheet ? index : 40 - index);
    const isCover = index === 0 || index === 3;

    return (
      <div
        key={index}
        className={`absolute top-0 left-0 w-full h-full transform-style-preserve-3d origin-left ${!isDragged ? 'transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]' : ''}`}
        style={{ transform: `rotateY(${rot}deg)`, zIndex }}
      >
        <div className={`absolute w-full h-full backface-hidden flex flex-col overflow-hidden ${isCover ? 'shadow-[-2px_0_5px_rgba(0,0,0,0.5)] rounded-r-md' : 'shadow-sm'}`}>
          {index === 0 && (
            <div className="w-full h-full relative overflow-hidden border-r-4 border-[#6b21a8]">
              <img src="/capa.png" alt="Capa" className="w-full h-full object-cover select-none pointer-events-none" draggable="false" />
            </div>
          )}

          {index === 1 && <InnerPage title="Seleção Ouro" startSlot={1} pageNum={1} />}
          {index === 2 && <InnerPage title="Estrelas do Futuro" startSlot={11} pageNum={3} />}

          {index === 3 && (
            <div className="w-full h-full relative overflow-hidden border-r-4 border-[#6b21a8]">
              <img src="/contra-capa-traseira.png" alt="Contra Capa Traseira" className="w-full h-full object-cover select-none pointer-events-none" draggable="false" />
            </div>
          )}
        </div>

        <div className={`absolute w-full h-full backface-hidden rotate-y-180 flex flex-col overflow-hidden ${isCover ? 'shadow-[2px_0_5px_rgba(0,0,0,0.5)] rounded-l-md' : 'shadow-sm'}`}>
          {index === 0 && (
            <div className="w-full h-full relative overflow-hidden border-l-4 border-[#6b21a8]">
              <img src="/contra-capa.png" alt="Contra Capa" className="w-full h-full object-cover select-none pointer-events-none" draggable="false" />
            </div>
          )}

          {index === 1 && <InnerPage title="Lendas do Gramado" startSlot={6} pageNum={2} />}
          {index === 2 && <InnerPage title="O Presságio" startSlot={16} pageNum={4} />}

          {index === 3 && (
            <div className="w-full h-full relative overflow-hidden border-l-4 border-[#6b21a8]">
              <img src="/capa-traseira.png" alt="Contracapa" className="w-full h-full object-cover select-none pointer-events-none" draggable="false" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        .perspective-container { perspective: 2500px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .origin-left { transform-origin: left center; }
        .rotate-y-180 { transform: rotateY(180deg); }

        .cover-texture {
          background-image:
            radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%),
            linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent);
          background-size: 100% 100%, 4px 4px;
        }
        .page-texture {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        }
      `}</style>

      <div className="w-full h-dvh bg-[#0d0a14] flex overflow-hidden font-sans select-none relative">

        <div className="absolute inset-0 bg-[url(/bg.jpg)] bg-cover bg-center pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0a14]/70 via-[#0d0a14]/40 to-[#0d0a14]/70 pointer-events-none"></div>

        <nav className="group relative z-40 flex flex-col justify-center gap-3 w-16 hover:w-48 border-r border-[#a855f7]/20 bg-gradient-to-r from-[#1a0f24]/95 to-[#0d0a14]/80 backdrop-blur-sm shrink-0 transition-all duration-300 ease-in-out overflow-hidden">
          <span onClick={() => { setCategory('album'); setActiveSheet(0); }} className={`flex items-center gap-3 py-2.5 pl-[22px] group-hover:pl-3 cursor-pointer transition-all rounded-md hover:bg-white/5 shrink-0 ${category === 'album' ? 'text-[#a855f7] font-semibold' : 'text-[#7e22ce]'} hover:text-[#a855f7]`}>
            <svg className="shrink-0 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v7"/><path d="M16 8v3"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="M8 8v3"/></svg>
            <span className="text-sm tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75">Álbum da Copa</span>
          </span>
          <span onClick={() => setCategory('banca')} className={`flex items-center gap-3 py-2.5 pl-[22px] group-hover:pl-3 cursor-pointer transition-all rounded-md hover:bg-white/5 shrink-0 ${category === 'banca' ? 'text-[#a855f7] font-semibold' : 'text-[#7e22ce]'} hover:text-[#a855f7]`}>
            <svg className="shrink-0 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5"/><path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244"/><path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05"/></svg>
            <span className="text-sm tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75">Banca de Jornal</span>
          </span>
          <span onClick={() => setCategory('figurinhas')} className={`flex items-center gap-3 py-2.5 pl-[22px] group-hover:pl-3 cursor-pointer transition-all rounded-md hover:bg-white/5 shrink-0 ${category === 'figurinhas' ? 'text-[#a855f7] font-semibold' : 'text-[#7e22ce]'} hover:text-[#a855f7]`}>
            <svg className="shrink-0 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 8h-3"/><path d="m15 2-1 2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3"/><path d="M16.899 22A5 5 0 0 0 7.1 22"/><path d="m9 2 3 6"/><circle cx="12" cy="15" r="3"/></svg>
            <span className="text-sm tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75">Figurinhas</span>
          </span>
          <span onClick={() => setCategory('trocas')} className={`flex items-center gap-3 py-2.5 pl-[22px] group-hover:pl-3 cursor-pointer transition-all rounded-md hover:bg-white/5 shrink-0 ${category === 'trocas' ? 'text-[#a855f7] font-semibold' : 'text-[#7e22ce]'} hover:text-[#a855f7]`}>
            <svg className="shrink-0 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
            <span className="text-sm tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75">Trocas</span>
          </span>
        </nav>

        {category === 'figurinhas' ? (
          <div className="flex-1 flex items-start justify-center relative overflow-y-auto py-8 px-4">
            <div className="max-w-4xl w-full">
              <h1 className="text-3xl font-black text-[#a855f7] tracking-[0.15em] uppercase mb-8 text-center">Figurinhas</h1>
              {['Comum', 'Raro', 'Super Raro', 'Lendário'].map((rarity) => {
                const cfg = rarityConfig[rarity];
                const group = stickers.filter((s) => s.rarity === rarity);
                return (
                  <div key={rarity} className="mb-8">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${cfg.badge} bg-opacity-80 mb-4 ml-1`}>
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${cfg.color}`}></div>
                      <span className={`text-sm font-bold uppercase tracking-widest ${cfg.text}`}>{cfg.label} ({group.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {group.map((s) => (
                        <StickerCard key={s.id} id={s.id} rarity={s.rarity} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center relative">
            <div className="relative" style={{ transform: `scale(${scale})` }}>
            <div
              className="relative w-0 h-0 transition-transform duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] z-10"
              style={{ transform: activeSheet > 0 ? 'translateX(0px)' : `translateX(-${PAGE_WIDTH/2}px)` }}
            >
              <div
                className="absolute top-[-352px] left-0 perspective-container cursor-grab active:cursor-grabbing"
                style={{ width: `${PAGE_WIDTH}px`, height: '704px', touchAction: 'none' }}
                onPointerDown={handlePointerDown}
              >

                {renderSheet(3)}
                {renderSheet(2)}
                {renderSheet(1)}
                {renderSheet(0)}

                {activeSheet === 0 && (
                  <div className="absolute -right-28 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-[#a855f7] animate-pulse pointer-events-none">
                    <span className="text-lg font-bold tracking-[0.15em]">ARRASTE</span>
                    <ChevronRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default App;
