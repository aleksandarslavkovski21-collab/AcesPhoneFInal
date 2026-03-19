import React from 'react';

const SellView: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-brand-babyblue py-6 sm:py-12">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-blue-50 flex flex-col lg:flex-row items-stretch">
          
          {/* Content Section */}
          <div className="flex-1 p-6 sm:p-10 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.15] mb-6 sm:mb-8 tracking-tight">
              Сакаш да го продадеш твојот стар телефон?
            </h1>
            
            <p className="text-lg sm:text-xl font-bold text-slate-600 leading-relaxed mb-8">
              Постирај го на нашата страница и продај го по компетитивни цени.
            </p>

            <div className="space-y-4 sm:space-y-6 mb-10">
              <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 transition-transform hover:scale-[1.02]">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0 font-black text-lg">0%</div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm sm:text-base uppercase tracking-wide">Без почетни трошоци</h4>
                  <p className="text-sm text-slate-500 font-medium">Ние не ви наплаќаме ништо на почеток за да го огласите вашиот уред.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 transition-transform hover:scale-[1.02]">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0 font-black text-lg">5%</div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm sm:text-base uppercase tracking-wide">Мала провизија</h4>
                  <p className="text-sm text-slate-500 font-medium">Доколку телефонот се продаде преку нас, земаме само 5% од крајната цена.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 transition-transform hover:scale-[1.02]">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0 text-2xl">🔄</div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm sm:text-base uppercase tracking-wide">Trade-In опција</h4>
                  <p className="text-sm text-slate-500 font-medium">Можеме да направиме и замена (старо за ново) доколку сакате да го подновите вашиот уред.</p>
                </div>
              </div>
            </div>

            <div className="mt-2 text-center lg:text-left">
              <a 
                href="#/contact" 
                className="inline-block w-full sm:w-auto bg-blue-600 text-white px-8 py-5 rounded-[1.5rem] font-black text-lg text-center shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all"
              >
                Контактирај Не Веднаш
              </a>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex-1 bg-slate-100 relative min-h-[300px] sm:min-h-[400px] lg:min-h-auto order-1 lg:order-2">
            <img 
              src="/sell.jpg" 
              className="absolute inset-0 w-full h-full object-cover" 
              alt="Sell your phone" 
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default SellView;
