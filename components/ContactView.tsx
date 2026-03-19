import React from 'react';

const ContactView: React.FC = () => {
  return (
    <div className="min-h-screen pt-0 pb-0 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/20 blur-[100px] rounded-full point-events-none -z-10"></div>

      <div className="max-w-6xl w-full px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text & Buttons */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 uppercase">
              Контакт
            </h1>
            <p className="text-lg text-slate-500 mb-10 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
              Тука сме за да ви помогнеме да го најдете совршениот уред. Контактирајте не преку телефон или вашата омилена апликација.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Phone Card */}
              <a href="tel:+38972240441" className="group flex flex-col items-center justify-center p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-slate-200/50 hover:bg-white hover:shadow-2xl transition-all duration-300">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 text-slate-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Телефон</h3>
                <p className="text-[12px] font-black text-blue-600">072 240 441</p>
              </a>

              {/* WhatsApp Card */}
              <a href="https://wa.me/38972240441" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center justify-center p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-slate-200/50 hover:bg-white hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
                <div className="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 text-[#25D366]">
                  <svg viewBox="0 0 448 512" fill="currentColor" className="w-6 h-6">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.6-.3-8.6 2.5-11.3 2.5-2.5 5.5-6.5 8.3-9.8 2.8-3.3 3.7-5.6 5.6-9.3 1.8-3.7.9-6.9-.5-9.8-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                  </svg>
                </div>
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">WhatsApp</h3>
                <p className="text-[12px] font-black text-[#25D366]">Пиши ни</p>
              </a>

              {/* Viber Card */}
              <a href="viber://add?number=38972240441" className="group flex flex-col items-center justify-center p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-slate-200/50 hover:bg-white hover:shadow-2xl hover:shadow-[#7360f2]/10 transition-all duration-300">
                <div className="w-12 h-12 bg-[#7360f2]/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 text-[#7360f2]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.177.693 6.698.623 9.82c-.06 3.11-.13 8.95 5.5 10.541v2.42s-.038.97.602 1.17c.79.25 1.24-.499 1.99-1.299l1.4-1.58c3.85.32 6.8-.419 7.14-.529.78-.25 5.181-.811 5.901-6.652.74-6.031-.36-9.831-2.34-11.551l-.01-.002c-.6-.55-3-2.3-8.37-2.32 0 0-.396-.025-1.038-.016zm.067 1.697c.545-.003.88.02.88.02 4.54.01 6.711 1.38 7.221 1.84 1.67 1.429 2.528 4.856 1.9 9.892-.6 4.88-4.17 5.19-4.83 5.4-.28.09-2.88.73-6.152.52 0 0-2.439 2.941-3.199 3.701-.12.13-.26.17-.35.15-.13-.03-.17-.19-.16-.41l.02-4.019c-4.771-1.32-4.491-6.302-4.441-8.902.06-2.6.55-4.732 2-6.172 1.957-1.77 5.475-2.01 7.11-2.02zm.36 2.6a.299.299 0 0 0-.3.299.3.3 0 0 0 .3.3 5.631 5.631 0 0 1 4.03 1.59c1.09 1.06 1.621 2.48 1.641 4.34a.3.3 0 0 0 .3.3v-.009a.3.3 0 0 0 .3-.3 6.451 6.451 0 0 0-1.81-4.76c-1.19-1.16-2.692-1.76-4.462-1.76zm-3.954.69a.955.955 0 0 0-.615.12h-.012c-.41.24-.788.54-1.148.94-.27.32-.421.639-.461.949a1.24 1.24 0 0 0 .05.541l.02.01a13.722 13.722 0 0 0 1.2 2.6 15.383 15.383 0 0 0 2.32 3.171l.03.04.04.03.03.03.03.03a15.603 15.603 0 0 0 3.18 2.33c1.32.72 2.122 1.06 2.602 1.2v.01c.14.04.268.06.398.06a1.84 1.84 0 0 0 1.102-.472c.39-.35.7-.738.93-1.148v-.01c.23-.43.15-.841-.18-1.121a13.632 13.632 0 0 0-2.15-1.54c-.51-.28-1.03-.11-1.24.17l-.45.569c-.23.28-.65.24-.65.24l-.012.01c-3.12-.8-3.95-3.959-3.95-3.959s-.04-.43.25-.65l.56-.45c.27-.22.46-.74.17-1.25a13.522 13.522 0 0 0-1.54-2.15.843.843 0 0 0-.504-.3zm4.473.89a.3.3 0 0 0 .002.6 3.78 3.78 0 0 1 2.65 1.15 3.5 3.5 0 0 1 .9 2.57.3.3 0 0 0 .3.299l.01.012a.3.3 0 0 0 .3-.301c.03-1.19-.34-2.19-1.07-2.99-.73-.8-1.75-1.25-3.05-1.34a.3.3 0 0 0-.042 0zm.49 1.619a.305.305 0 0 0-.018.611c.99.05 1.47.55 1.53 1.58a.3.3 0 0 0 .3.29h.01a.3.3 0 0 0 .29-.32c-.07-1.34-.8-2.091-2.1-2.161a.305.305 0 0 0-.012 0z"/>
                  </svg>
                </div>
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Viber</h3>
                <p className="text-[12px] font-black text-[#7360f2]">Пиши ни</p>
              </a>
            </div>
          </div>

          {/* Right Column: Promotional Photo */}
          <div className="animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            <div className="relative group">
              <div className="absolute -inset-4 bg-blue-500/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <img 
                src="/promo.png" 
                alt="Ace Phones Promo" 
                className="w-full max-w-[500px] mx-auto rounded-[3rem] shadow-2xl border-8 border-white transition-all duration-500 relative z-10 hover:scale-[1.03]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
