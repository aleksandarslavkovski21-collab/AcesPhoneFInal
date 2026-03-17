import React from 'react';

const ContactView: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-600/10 blur-[100px] rounded-full point-events-none -z-10"></div>

      <div className="max-w-2xl w-full px-6 text-center z-10">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-slate-900 dark:text-white mb-4">
          Get in touch.
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-lg mx-auto font-light">
          We're here to help you find the perfect device. Reach out to us via phone or your preferred messaging app.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Phone Card */}
          <a href="tel:+38972240441" className="group flex flex-col items-center justify-center p-8 rounded-3xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800/80 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-slate-700 dark:text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-wider mb-1">Phone</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">072 240 441</p>
          </a>

          {/* WhatsApp Card */}
          <a href="https://wa.me/38972240441" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center justify-center p-8 rounded-3xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800/80 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
            <div className="w-14 h-14 bg-[#25D366]/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-[#25D366]">
              {/* WhatsApp SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path d="M12.031 2c-5.517 0-9.993 4.476-9.993 9.993 0 1.763.461 3.42 1.268 4.86l-1.347 4.919 5.035-1.322c1.404.765 3.004 1.2 4.704 1.2 5.517 0 9.993-4.476 9.993-9.993 0-5.517-4.476-9.993-9.993-9.993zm5.82 14.23c-.25.703-1.442 1.284-1.983 1.364-.492.072-.943.081-2.76-.64-2.31-.92-3.804-3.28-3.92-3.43-.116-.15-.947-1.26-.947-2.4 0-1.14.593-1.7 1.01-1.88.32-.14.71-.23.94-.23.23 0 .46.01.66.02.2.01.47-.09.73.54.26.64.89 2.16.97 2.33.08.17.13.37.02.6-.11.23-.17.37-.34.57-.17.2-.36.45-.52.6-.17.17-.35.35-.15.7.2.35.88 1.45 1.89 2.35 1.3 1.16 2.39 1.52 2.73 1.69.34.17.54.14.74-.09.2-.23.86-1.01 1.09-1.36.23-.35.46-.29.77-.17.31.12 1.97.93 2.31 1.1.34.17.57.26.65.4.08.14.08.83-.17 1.53z"/>
              </svg>
            </div>
            <h3 className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-wider mb-1">WhatsApp</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Message Us</p>
          </a>

          {/* Viber Card */}
          <a href="viber://chat?number=%2B38972240441" className="group flex flex-col items-center justify-center p-8 rounded-3xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800/80 hover:shadow-xl hover:shadow-[#7360f2]/10 transition-all duration-300">
            <div className="w-14 h-14 bg-[#7360f2]/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-[#7360f2]">
              {/* Clean Viber SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-7 h-7">
                <path d="M432.22 83.05c-41.56-42.34-100.86-53-157.92-50.62-73.69 2.58-132.89 31.06-174.67 78.48A185.08 185.08 0 0 0 56 211.52C48 274.61 70.36 348.45 125 401.78l12 11.51-14.82 51.55c-6.84 21.6 3.09 36 21.08 30l67.24-21.57c6-.86 19.34.82 25.12 3.82C318 518 424.81 498.07 472.91 425c34.78-52.93 42.6-118 21.92-181.65-15.54-47-39.75-121.2-62.61-160.3zm-39.3 226s-1.89 5.8-5 13.91c-22.11 50-68.61 71.37-124.63 60.18l-37-3.83-50.62 16.59 13.5-47-5.91-4c-6.07-5-53.11-49.88-51.49-110.15s37.19-81.25 79.28-91c28.51-6.17 62-.64 97 19.11A132 132 0 0 1 405.39 237C410.66 261 405.8 285.8 392.92 309zm-29.43-69.64a5 5 0 0 0 6.6-4.59c-3.15-54.8-19.14-80.44-59.6-105-23.75-14.54-52.5-17.76-65.71-18a5 5 0 0 0-5.11 4.79c-3.7 41 20 73.1 57.19 100.31a96.6 96.6 0 0 0 62.43 23 5 5 0 0 0 4.2-5.51z"></path>
              </svg>
            </div>
            <h3 className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-wider mb-1">Viber</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Chat with Us</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
