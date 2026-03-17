
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
            <div className="aspect-square bg-white rounded-[2rem] border border-blue-100 p-12 flex items-center justify-center relative soft-shadow overflow-hidden group">
              {/* Main Image */}
              <img 
                src={images[activeImgIndex]} 
                className="max-w-full max-h-full object-contain relative z-10 drop-shadow-2xl transition-all duration-500"
                alt={phone.model}
              />
              
              {/* Carousel Controls */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); prevImg(); }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-blue-600 hover:text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-slate-100 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); nextImg(); }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-blue-600 hover:text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-slate-100 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                  </button>
                  
                  {/* Indicators */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-40 h-1 bg-slate-100 rounded-full">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500 relative" 
                      style={{ width: `${((activeImgIndex + 1) / images.length) * 100}%` }}
                    >
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg" />
                    </div>
                    {/* Clickable segments */}
                    <div className="absolute inset-0 flex">
                      {images.map((_, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setActiveImgIndex(idx)}
                          className="h-full flex-grow cursor-pointer"
                        />
                      ))}
                    </div>
                  </div>
                </>
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
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-14 h-14 bg-[#7360f2] rounded-full flex items-center justify-center shadow-lg shadow-purple-200 border-4 border-white transition-transform hover:scale-110">
                        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.14 2.18c-.88-.42-1.72-.08-2.12.52l-1.38 2.1c-.24.36-.2.84.1 1.14l.84.84c.3.3.3.78 0 1.08l-5.66 5.66c-.3.3-.78.3-1.08 0l-.84-.84c-.3-.3-.78-.34-1.14-.1l-2.1 1.38c-.6.4-.94 1.24-.52 2.12 1.56 3.3 4.54 5.74 8.12 6.66.88.22 1.76-.1 2.16-.7l1.38-2.1c.24-.36.2-.84-.1-1.14l-.84-.84c-.3-.3-.3-.78 0-1.08l5.66-5.66c.3-.3.78-.3 1.08 0l.84.84c.3.3.78.34 1.14.1l2.1-1.38c.6-.4.94-1.24.52-2.12-1.56-3.3-4.54-5.74-8.12-6.66z"/>
                        </svg>
                      </div>
                      <span className="text-[11px] font-black text-[#7360f2] uppercase tracking-widest">Viber</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 border-4 border-white transition-transform hover:scale-110">
                        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.031 2c-5.517 0-9.993 4.476-9.993 9.993 0 1.763.461 3.42 1.268 4.86l-1.347 4.919 5.035-1.322c1.404.765 3.004 1.2 4.704 1.2 5.517 0 9.993-4.476 9.993-9.993 0-5.517-4.476-9.993-9.993-9.993zm5.82 14.23c-.25.703-1.442 1.284-1.983 1.364-.492.072-.943.081-2.76-.64-2.31-.92-3.804-3.28-3.92-3.43-.116-.15-.947-1.26-.947-2.4 0-1.14.593-1.7 1.01-1.88.32-.14.71-.23.94-.23.23 0 .46.01.66.02.2.01.47-.09.73.54.26.64.89 2.16.97 2.33.08.17.13.37.02.6-.11.23-.17.37-.34.57-.17.2-.36.45-.52.6-.17.17-.35.35-.15.7.2.35.88 1.45 1.89 2.35 1.3 1.16 2.39 1.52 2.73 1.69.34.17.54.14.74-.09.2-.23.86-1.01 1.09-1.36.23-.35.46-.29.77-.17.31.12 1.97.93 2.31 1.1.34.17.57.26.65.4.08.14.08.83-.17 1.53z"/>
                        </svg>
                      </div>
                      <span className="text-[11px] font-black text-[#25D366] uppercase tracking-widest">WhatsApp</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
