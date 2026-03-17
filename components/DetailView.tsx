
import React, { useState } from 'react';
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

  const images = phone.images && phone.images.length ? phone.images : [phone.image];
  const priceDen = typeof phone.price === 'string' ? parseFloat(phone.price) : phone.price;

  const nextImg = () => setActiveImgIndex((prev) => (prev + 1) % images.length);
  const prevImg = () => setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleCopy = () => {
    navigator.clipboard.writeText("072 240 441");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-20 pb-20 min-h-screen">
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
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-6">
              <div 
                className="aspect-square bg-white rounded-[2rem] border border-blue-100 p-8 flex items-center justify-center relative soft-shadow overflow-hidden group cursor-zoom-in"
                onClick={() => setShowLightbox(true)}
              >
                {/* Main Image */}
                <img 
                  src={images[activeImgIndex]} 
                  className="max-w-full max-h-full object-contain relative z-10 drop-shadow-2xl transition-all duration-500 hover:scale-105"
                  alt={phone.model}
                />
                
                {/* Carousel Controls */}
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); prevImg(); }}
                      className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-blue-600 hover:text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-slate-100 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); nextImg(); }}
                      className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-blue-600 hover:text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-slate-100 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </>
                )}
                
                {/* Mobile Tap Hints */}
                <div className="absolute inset-y-0 left-0 w-1/4 z-10 sm:hidden" onClick={(e) => { e.stopPropagation(); prevImg(); }} />
                <div className="absolute inset-y-0 right-0 w-1/4 z-10 sm:hidden" onClick={(e) => { e.stopPropagation(); nextImg(); }} />
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
            
            <div className="bg-white rounded-[2rem] p-10 border border-blue-100 soft-shadow">
              <h3 className="text-lg font-black mb-6 uppercase tracking-widest text-blue-600">Опис на уредот</h3>
              <p className="text-slate-600 whitespace-pre-wrap leading-[1.8] font-medium">
                {phone.description || "Нема внесен детален опис."}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-10">
            <div className="bg-white rounded-[2.5rem] p-12 border border-blue-100 soft-shadow relative">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-blue-500 font-black text-[11px] uppercase tracking-[0.3em]">
                    {phone.brand}
                  </div>
                </div>
                
                <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter leading-none">
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

                {/* Info Section */}
                <div className="space-y-4 mb-10">
                  {config.showGlobalNote && config.globalNote && (
                    <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center gap-4 border border-slate-800 animate-pulse">
                      <span className="text-2xl">⏰</span>
                      <div>
                        <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">ВАЖНА ИНФОРМАЦИЈА</div>
                        <div className="text-sm font-black">{config.globalNote}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* New Contact Section */}
                <div className="space-y-6 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <div className="text-center">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Контакт Продавач</span>
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
                  
                  <div className="flex items-center justify-center gap-8 pt-4 border-t border-slate-200">
                    <a 
                      href={`viber://add?number=38972240441`}
                      className="flex flex-col items-center gap-2 group transition-all active:scale-95"
                    >
                      <div className="w-14 h-14 bg-[#7360f2] rounded-full flex items-center justify-center shadow-lg shadow-purple-200 border-4 border-white transition-all group-hover:rotate-6 group-hover:scale-110">
                        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.336 1c-.815 0-1.616.142-2.383.424l-1.464 2.227c-.244.372-.213.856.076 1.157l.836.837c.304.305.304.782 0 1.087l-5.657 5.657c-.305.304-.782.304-1.087 0l-.837-.836c-.301-.289-.785-.32-1.157-.076L6.424 12.935a6.012 6.012 0 01-.424 2.383c.42.872 1.236 2.408 2.052 3.161.801.737 2.012 1.378 3.513 1.378 5.759 0 10.435-4.676 10.435-10.435 0-1.501-.641-2.712-1.378-3.513-.753-.816-2.289-1.632-3.161-2.052-.767-.282-1.341-.421-2.129-.421zm-7.305 15.305l-.01.01s.01-.01 0 0z"/>
                          <path d="M17.5 19c-.3.3-.7.4-1.1.4-1.5 0-3-.5-4.5-2s-2-3-2-4.5c0-.4.1-.8.4-1.1s.7-.4 1.1-.4 1.1.1 1.4.4l1.2 1.2c.3.3.4.7.4 1.1 0 .4-.1.8-.4 1.1l-.5.5c-.3.3-.3.7 0 1l1 1c.3.3.7.3 1 0l.5-.5c.3-.3.7-.4 1.1-.4.4 0 .8.1 1.1.4l1.2 1.2c.3.3.4.7.4 1.1 0 .4-.1.8-.4 1.1z" opacity=".2"/>
                        </svg>
                      </div>
                      <span className="text-[11px] font-black text-[#7360f2] uppercase tracking-widest">Viber</span>
                    </a>
                    
                    <a 
                      href={`https://wa.me/38972240441`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 group transition-all active:scale-95"
                    >
                      <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 border-4 border-white transition-all group-hover:-rotate-6 group-hover:scale-110">
                        <svg className="w-7 h-7 text-white" viewBox="0 0 448 512" fill="currentColor">
                          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.6-.3-8.6 2.5-11.3 2.5-2.5 5.5-6.5 8.3-9.8 2.8-3.3 3.7-5.6 5.6-9.3 1.8-3.7.9-6.9-.5-9.8-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                        </svg>
                      </div>
                      <span className="text-[11px] font-black text-[#25D366] uppercase tracking-widest">WhatsApp</span>
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
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-50 p-4"
            onClick={() => setShowLightbox(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img 
              src={images[activeImgIndex]} 
              className="max-w-full max-h-full object-contain transition-transform duration-300 shadow-2xl"
              style={{ transform: `scale(${zoomScale})` }}
              onClick={(e) => {
                e.stopPropagation();
                setZoomScale(prev => prev === 1 ? 2.5 : 1);
              }}
              alt={phone.model}
            />

            {/* Lightbox Controls */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImg(); setZoomScale(1); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md transition-all hidden sm:flex"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImg(); setZoomScale(1); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md transition-all hidden sm:flex"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </button>
              </>
            )}

            {/* Mobile Navigation Area */}
            <div className="absolute inset-y-0 left-0 w-1/4 sm:hidden" onClick={(e) => { e.stopPropagation(); prevImg(); setZoomScale(1); }} />
            <div className="absolute inset-y-0 right-0 w-1/4 sm:hidden" onClick={(e) => { e.stopPropagation(); nextImg(); setZoomScale(1); }} />

            {/* Image Counter */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white font-black text-sm tracking-widest">
              {activeImgIndex + 1} / {images.length}
            </div>
            
            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] pointer-events-none">
              {zoomScale > 1 ? 'Допрете за да излезете од зум' : 'Допрете за зум • Повлечете лево/десно'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailView;
