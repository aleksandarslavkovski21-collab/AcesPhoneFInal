
import React, { useState, useEffect } from 'react';
import { PhoneModel, AppConfig } from '../types';

interface DetailViewProps {
  phone: PhoneModel;
  onBack: () => void;
  config: AppConfig;
}

const DetailView: React.FC<DetailViewProps> = ({ phone, onBack, config }) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOrigin, setDragOrigin] = useState({ x: 0, y: 0 });

  // Auto-scroll to top on mouth
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const images = phone.images && phone.images.length ? phone.images : [phone.image];
  const priceDen = typeof phone.price === 'string' ? parseFloat(phone.price) : phone.price;

  const nextImg = () => {
    setActiveImgIndex((prev) => (prev + 1) % images.length);
    setTranslateX(0);
  };
  const prevImg = () => {
    setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
    setTranslateX(0);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("072 240 441");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (showLightbox && zoomScale > 1) {
      setIsDragging(true);
      setDragOrigin({ 
        x: e.targetTouches[0].clientX - translateX, 
        y: e.targetTouches[0].clientY - translateY 
      });
    } else {
      setTouchStart(e.targetTouches[0].clientX);
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && showLightbox && zoomScale > 1) {
      setTranslateX(e.targetTouches[0].clientX - dragOrigin.x);
      setTranslateY(e.targetTouches[0].clientY - dragOrigin.y);
    } else if (touchStart !== null) {
      const currentX = e.targetTouches[0].clientX;
      const diff = currentX - touchStart;
      setTranslateX(diff);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (showLightbox && zoomScale > 1) {
      setIsDragging(false);
    } else if (touchStart !== null) {
      const touchEnd = e.changedTouches[0].clientX;
      const diff = touchEnd - touchStart;
      
      setIsDragging(false);

      if (Math.abs(diff) > 80) { 
        if (diff > 0) prevImg();
        else nextImg();
      } else {
        setTranslateX(0); 
      }
      setTouchStart(null);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (showLightbox) {
      e.preventDefault();
      const delta = e.deltaY;
      setZoomScale(prev => {
        const newScale = prev - delta * 0.002;
        return Math.min(Math.max(newScale, 1), 5);
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (showLightbox && zoomScale > 1) {
      setIsDragging(true);
      setDragOrigin({ 
        x: e.clientX - translateX, 
        y: e.clientY - translateY 
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && showLightbox && zoomScale > 1) {
      setTranslateX(e.clientX - dragOrigin.x);
      setTranslateY(e.clientY - dragOrigin.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Improved Viber SVG
  const ViberIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.177.693 6.698.623 9.82c-.06 3.11-.13 8.95 5.5 10.541v2.42s-.038.97.602 1.17c.79.25 1.24-.499 1.99-1.299l1.4-1.58c3.85.32 6.8-.419 7.14-.529.78-.25 5.181-.811 5.901-6.652.74-6.031-.36-9.831-2.34-11.551l-.01-.002c-.6-.55-3-2.3-8.37-2.32 0 0-.396-.025-1.038-.016zm.067 1.697c.545-.003.88.02.88.02 4.54.01 6.711 1.38 7.221 1.84 1.67 1.429 2.528 4.856 1.9 9.892-.6 4.88-4.17 5.19-4.83 5.4-.28.09-2.88.73-6.152.52 0 0-2.439 2.941-3.199 3.701-.12.13-.26.17-.35.15-.13-.03-.17-.19-.16-.41l.02-4.019c-4.771-1.32-4.491-6.302-4.441-8.902.06-2.6.55-4.732 2-6.172 1.957-1.77 5.475-2.01 7.11-2.02zm.36 2.6a.299.299 0 0 0-.3.299.3.3 0 0 0 .3.3 5.631 5.631 0 0 1 4.03 1.59c1.09 1.06 1.621 2.48 1.641 4.34a.3.3 0 0 0 .3.3v-.009a.3.3 0 0 0 .3-.3 6.451 6.451 0 0 0-1.81-4.76c-1.19-1.16-2.692-1.76-4.462-1.76zm-3.954.69a.955.955 0 0 0-.615.12h-.012c-.41.24-.788.54-1.148.94-.27.32-.421.639-.461.949a1.24 1.24 0 0 0 .05.541l.02.01a13.722 13.722 0 0 0 1.2 2.6 15.383 15.383 0 0 0 2.32 3.171l.03.04.04.03.03.03.03.03a15.603 15.603 0 0 0 3.18 2.33c1.32.72 2.122 1.06 2.602 1.2v.01c.14.04.268.06.398.06a1.84 1.84 0 0 0 1.102-.472c.39-.35.7-.738.93-1.148v-.01c.23-.43.15-.841-.18-1.121a13.632 13.632 0 0 0-2.15-1.54c-.51-.28-1.03-.11-1.24.17l-.45.569c-.23.28-.65.24-.65.24l-.012.01c-3.12-.8-3.95-3.959-3.95-3.959s-.04-.43.25-.65l.56-.45c.27-.22.46-.74.17-1.25a13.522 13.522 0 0 0-1.54-2.15.843.843 0 0 0-.504-.3zm4.473.89a.3.3 0 0 0 .002.6 3.78 3.78 0 0 1 2.65 1.15 3.5 3.5 0 0 1 .9 2.57.3.3 0 0 0 .3.299l.01.012a.3.3 0 0 0 .3-.301c.03-1.19-.34-2.19-1.07-2.99-.73-.8-1.75-1.25-3.05-1.34a.3.3 0 0 0-.042 0zm.49 1.619a.305.305 0 0 0-.018.611c.99.05 1.47.55 1.53 1.58a.3.3 0 0 0 .3.29h.01a.3.3 0 0 0 .29-.32c-.07-1.34-.8-2.091-2.1-2.161a.305.305 0 0 0-.012 0z"/>
    </svg>
  );

  return (
    <div className="pt-10 md:pt-20 pb-20 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={onBack}
            className="group flex items-center gap-3 text-slate-400 hover:text-blue-600 font-black text-[11px] uppercase tracking-widest transition-all"
          >
            <div className="p-2 rounded-full border border-slate-200 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </div>
            Назад
          </button>

          <button 
            onClick={() => window.location.hash = "#/dashboard"}
            className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            АДМИН
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Gallery with Carousel */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              <div 
                className="aspect-square bg-white rounded-[1.5rem] md:rounded-[2rem] border border-blue-100 p-4 md:p-8 flex items-center justify-center relative soft-shadow overflow-hidden group cursor-zoom-in"
                onClick={() => setShowLightbox(true)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Image Slider Wrapper */}
                <div 
                  className={`w-full h-full flex items-center justify-center transition-transform ${isDragging ? '' : 'duration-300'}`}
                  style={{ transform: `translateX(${translateX}px)` }}
                >
                  <img 
                    src={images[activeImgIndex]} 
                    className="max-w-[90%] max-h-[90%] object-contain relative z-10 drop-shadow-2xl transition-all duration-500 hover:scale-105"
                    alt={phone.model}
                  />
                </div>
                
                {/* Carousel Controls */}
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); prevImg(); }}
                      className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-blue-600 hover:text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg border border-slate-100 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 active:scale-90"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); nextImg(); }}
                      className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-blue-600 hover:text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg border border-slate-100 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 active:scale-90"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </>
                )}
              </div>

              {/* Centered Indicators Below Image */}
              {images.length > 1 && (
                <div className="flex justify-center items-center gap-2 py-2">
                  {images.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${activeImgIndex === idx ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-200 hover:bg-slate-300'}`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-10">
            <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-12 border border-blue-100 soft-shadow relative">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-blue-500 font-black text-[11px] uppercase tracking-[0.3em]">
                    {phone.brand}
                  </div>
                </div>
                
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-6 md:mb-8 tracking-tighter leading-tight">
                  {phone.model}
                </h1>

                <div className="bg-blue-50 rounded-2xl p-8 text-center mb-10 border border-blue-100">
                  <div className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">ЦЕНА</div>
                  <div className="text-4xl font-black text-blue-600 tracking-tighter">{priceDen.toLocaleString()} <span className="text-sm">МКД</span></div>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-12">
                  {[
                    { label: 'RAM Меморија', value: phone.ram },
                    { label: 'Големина на екран', value: phone.screen || '6.7"' },
                    { label: 'Внатрешна Меморија', value: phone.storage },
                    { 
                      label: 'Мрежен Статус', 
                      value: phone.unlocked 
                        ? 'Отклучен на сите мрежи и картички' 
                        : `Заклучен ${phone.lockedTo ? `: ${phone.lockedTo}` : ''} 🔒📵`,
                      highlight: true
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                      <span className={`text-md font-black tracking-tight ${item.highlight ? (phone.unlocked ? 'text-emerald-600' : 'text-amber-600') : 'text-slate-800'}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Info & Description Section */}
                <div className="space-y-6 mb-10">
                  {phone.infoText ? (
                    <div 
                      className="p-6 rounded-2xl flex items-center gap-4 border shadow-sm animate-pulse"
                      style={{ backgroundColor: phone.infoBgColor || '#fef3c7', borderColor: 'rgba(0,0,0,0.05)' }}
                    >
                      <span className="text-2xl">{phone.infoEmoji || '⏰'}</span>
                      <div>
                        <div className="text-[11px] font-black uppercase tracking-widest text-slate-500 opacity-60">ВАЖНА ИНФОРМАЦИЈА</div>
                        <div className="text-sm font-black text-slate-900">{phone.infoText}</div>
                      </div>
                    </div>
                  ) : (config.showGlobalNote && config.globalNote && (
                    <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center gap-4 border border-slate-800 animate-pulse">
                      <span className="text-2xl">⏰</span>
                      <div>
                        <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">ВАЖНА ИНФОРМАЦИЈА</div>
                        <div className="text-sm font-black">{config.globalNote}</div>
                      </div>
                    </div>
                  ))}

                  <div className="bg-slate-50 rounded-[1.5rem] p-8 border border-slate-100">
                    <h3 className="text-blue-500 font-black text-[11px] uppercase tracking-widest mb-4">Опис на уредот</h3>
                    <p className="text-slate-600 whitespace-pre-wrap leading-relaxed font-medium text-sm">
                      {phone.description || "Нема внесен детален опис."}
                    </p>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="space-y-6 bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100/50">
                  <div className="text-center">
                    <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest mb-2 block">Контакт Продавач</span>
                    <div className="text-3xl font-black text-slate-900 mb-4">072 240 441</div>
                    <button 
                      onClick={handleCopy}
                      className={`w-full py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${copied ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600 shadow-sm'}`}
                    >
                      {copied ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          Копирано!
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          Копирај број
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-center gap-8 pt-4 border-t border-blue-100">
                    <a 
                      href={`viber://add?number=38972240441`}
                      className="flex flex-col items-center gap-2 group transition-all active:scale-95"
                    >
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-[#7360f2] rounded-full flex items-center justify-center shadow-lg shadow-purple-200 border-[3px] md:border-4 border-white transition-all group-hover:rotate-6 group-hover:scale-110">
                        <ViberIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <span className="text-[10px] md:text-[11px] font-black text-[#7360f2] uppercase tracking-widest">Viber</span>
                    </a>
                    
                    <a 
                      href={`https://wa.me/38972240441`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 group transition-all active:scale-95"
                    >
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 border-[3px] md:border-4 border-white transition-all group-hover:-rotate-6 group-hover:scale-110">
                        <svg className="w-6 h-6 md:w-7 md:h-7 text-white" viewBox="0 0 448 512" fill="currentColor">
                          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.6-.3-8.6 2.5-11.3 2.5-2.5 5.5-6.5 8.3-9.8 2.8-3.3 3.7-5.6 5.6-9.3 1.8-3.7.9-6.9-.5-9.8-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                        </svg>
                      </div>
                      <span className="text-[10px] md:text-[11px] font-black text-[#25D366] uppercase tracking-widest">WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div 
          className="fixed inset-0 z-[1000] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-300"
          onClick={() => setShowLightbox(false)}
        >
          <button 
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[1050] p-4"
            onClick={() => setShowLightbox(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div 
              className={`w-full h-full flex items-center justify-center ${isDragging ? '' : 'transition-transform duration-300'}`}
              style={{ transform: zoomScale > 1 ? `translate(${translateX}px, ${translateY}px)` : `translateX(${translateX}px)` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              <img 
                src={images[activeImgIndex]} 
                className="max-w-[100%] max-h-[100%] object-contain transition-transform duration-300 shadow-2xl pointer-events-none select-none"
                style={{ transform: `scale(${zoomScale})` }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (zoomScale > 1) {
                    setZoomScale(1);
                    setTranslateX(0);
                    setTranslateY(0);
                  } else {
                    setZoomScale(2.5);
                  }
                }}
                alt={phone.model}
              />
            </div>

            {/* Lightbox Controls */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImg(); setZoomScale(1); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-50 shadow-2xl active:scale-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImg(); setZoomScale(1); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-50 shadow-2xl active:scale-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white font-black text-sm tracking-widest z-50">
              {activeImgIndex + 1} / {images.length}
            </div>
            
            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] pointer-events-none z-50 hidden sm:block">
              {zoomScale > 1 ? 'Допрете за да излезете од зум' : 'Допрете за зум • Повлечете лево/десно'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailView;
