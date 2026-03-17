import React from 'react';

const ContactView: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-600/10 blur-[100px] rounded-full point-events-none -z-10"></div>

      <div className="max-w-2xl w-full px-6 text-center z-10">
        <h1 className="text-3xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white mb-4 uppercase">
          Контакт
        </h1>
        <p className="text-md md:text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-lg mx-auto font-medium">
          Тука сме за да ви помогнеме да го најдете совршениот уред. Контактирајте не преку телефон или вашата омилена апликација.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {/* Phone Card */}
          <a href="tel:+38972240441" className="group flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800/80 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-slate-700 dark:text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-[10px] md:text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">Телефон</h3>
            <p className="text-sm font-black text-blue-600">072 240 441</p>
          </a>

          {/* WhatsApp Card */}
          <a href="https://wa.me/38972240441" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800/80 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-[#25D366]/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-[#25D366]">
              <svg viewBox="0 0 448 512" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.6-.3-8.6 2.5-11.3 2.5-2.5 5.5-6.5 8.3-9.8 2.8-3.3 3.7-5.6 5.6-9.3 1.8-3.7.9-6.9-.5-9.8-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
              </svg>
            </div>
            <h3 className="text-[10px] md:text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">WhatsApp</h3>
            <p className="text-sm font-black text-[#25D366]">Пиши ни</p>
          </a>

          {/* Viber Card */}
          <a href="viber://add?number=38972240441" className="group flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800/80 hover:shadow-xl hover:shadow-[#7360f2]/10 transition-all duration-300">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-[#7360f2]/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-[#7360f2]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                <path d="M19.336 1c-.815 0-1.616.142-2.383.424l-1.464 2.227c-.244.372-.213.856.076 1.157l.836.837c.304.305.304.782 0 1.087l-5.657 5.657c-.305.304-.782.304-1.087 0l-.837-.836c-.301-.289-.785-.32-1.157-.076L6.424 12.935a6.012 6.012 0 01-.424 2.383c.42.872 1.236 2.408 2.052 3.161.801.737 2.012 1.378 3.513 1.378 5.759 0 10.435-4.676 10.435-10.435 0-1.501-.641-2.712-1.378-3.513-.753-.816-2.289-1.632-3.161-2.052-.767-.282-1.341-.421-2.129-.421zm-7.305 15.305l-.01.01s.01-.01 0 0z"/>
              </svg>
            </div>
            <h3 className="text-[10px] md:text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">Viber</h3>
            <p className="text-sm font-black text-[#7360f2]">Пиши ни</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
