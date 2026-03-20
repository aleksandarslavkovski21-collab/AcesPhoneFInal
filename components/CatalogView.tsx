
import React, { useState } from 'react';
import { PhoneModel, Filters, AppConfig } from '../types';
import PhoneCard from './PhoneCard';
import CustomSelect from './CustomSelect';
import { sortOptions } from '../src/utils';

interface CatalogViewProps {
  phones: PhoneModel[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onSelectPhone: (id: string) => void;
  allPhones: PhoneModel[];
  config: AppConfig;
}

const CatalogView: React.FC<CatalogViewProps> = ({ 
  phones, 
  filters, 
  setFilters, 
  onSelectPhone,
  allPhones,
  config
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(20);

  // Reset display limit when phones list (filtered) changes
  React.useEffect(() => {
    setDisplayLimit(20);
  }, [phones]);

  // Infinite scroll logic
  React.useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 200 >=
        document.documentElement.offsetHeight
      ) {
        if (displayLimit < phones.length) {
          setDisplayLimit(prev => prev + 20);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayLimit, phones.length]);

  const visiblePhones = phones.slice(0, displayLimit);

  return (
    <div className="relative pt-12 grid-pattern min-h-screen">
      <div className="container mx-auto px-6 pb-20 max-w-[1440px]">
        
        {/* Subtle Admin Link */}
        {localStorage.getItem('pcp_admin_auth') === 'true' && (
          <div className="flex justify-end mb-6">
             <button 
               onClick={() => window.location.hash = "#/supersecretpage"}
               className="text-[12px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all flex items-center gap-2"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
               АДМИН
             </button>
          </div>
        )}

        {/* Unified Search/Filter Container (Morphed on Mobile) */}
        <div 
          className={`mb-16 bg-white border border-blue-100 rounded-[1.5rem] soft-shadow relative z-40 transition-all duration-500 ease-in-out
            ${showFilters ? 'p-8 overflow-visible' : 'p-0 md:p-8 overflow-hidden md:overflow-visible'} 
            ${!showFilters ? 'hover:border-blue-300' : ''}`}
        >
          {/* Mobile Toggle Trigger Area */}
          <div className={`md:hidden flex flex-col gap-3 transition-all duration-500 px-6 ${showFilters ? 'py-0 h-0 opacity-0 mb-4' : 'py-5 h-auto opacity-100'}`}>
            <button 
              onClick={() => setShowFilters(true)}
              className="w-full flex items-center justify-between"
            >
              <span className="text-lg font-black text-slate-800 uppercase tracking-widest">
                Пребарај Телефон
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </button>
            <button 
              onClick={() => setFilters(prev => ({ ...prev, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' }))}
              className="w-full py-4 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <span className="font-black text-xs uppercase tracking-widest">Сортирај по цена</span>
              <span className="font-black text-sm">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
            </button>
          </div>

          {/* Internal Content (Filters) */}
          <div className={`transition-all duration-500 ease-in-out ${showFilters ? 'opacity-100' : 'opacity-0 md:opacity-100 h-0 md:h-auto overflow-hidden md:overflow-visible pointer-events-none md:pointer-events-auto'}`}>
            {/* Mobile Close Button (Inside) */}
            <div className="md:hidden flex justify-between items-center mb-6">
              <span className="text-[12px] font-black text-blue-600 uppercase tracking-widest">Опции за пребарување</span>
              <button 
                onClick={() => setShowFilters(false)}
                className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 items-end">
              <div className="relative group/search">
                <label 
                  htmlFor="search-query"
                  className="block text-[11px] font-black text-slate-400 uppercase mb-3 ml-2 tracking-[0.2em]"
                >
                  Пребарај
                </label>
                <input 
                  id="search-query"
                  type="text" 
                  placeholder="Внеси модел..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:border-blue-300 transition-all font-bold"
                  value={filters.searchQuery}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                />
              </div>
              
              <CustomSelect 
                id="brand-filter"
                label="Бренд"
                value={filters.brand}
                options={sortOptions(config.brands || [])}
                placeholder="Сите"
                onChange={(val) => setFilters(prev => ({ ...prev, brand: val }))}
              />

              <CustomSelect 
                id="storage-filter"
                label="Меморија"
                value={filters.storage}
                options={sortOptions(config.storageOptions || [])}
                placeholder="Сите"
                onChange={(val) => setFilters(prev => ({ ...prev, storage: val }))}
              />

              <CustomSelect 
                id="location-filter"
                label="Локација"
                value={filters.location}
                options={config.locations || []}
                placeholder="Сите"
                onChange={(val) => setFilters(prev => ({ ...prev, location: val }))}
              />

              <CustomSelect 
                id="ram-filter"
                label="RAM"
                value={filters.ram}
                options={sortOptions(config.ramOptions || [])}
                placeholder="Сите"
                onChange={(val) => setFilters(prev => ({ ...prev, ram: val }))}
              />

              <CustomSelect 
                id="feature-filter"
                label="Екстра Опции"
                value={filters.feature}
                options={sortOptions(config.featureOptions || [])}
                placeholder="Сите"
                onChange={(val) => setFilters(prev => ({ ...prev, feature: val }))}
              />

              {/* Budget Slider */}
              <div className="flex flex-col justify-end h-full">
                <div className="flex justify-between items-center mb-3 ml-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Буџет</label>
                  <span className="text-[12px] font-black text-blue-600">{filters.priceMax.toLocaleString()} МКД</span>
                </div>
                <div className="px-2 pb-4">
                  <input 
                    type="range" min="0" max="150000" step="1000"
                    className="w-full accent-blue-500 h-1 bg-blue-100 rounded-full appearance-none cursor-pointer"
                    value={filters.priceMax}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceMax: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <CustomSelect 
                label="Сортирај"
                value={filters.sortOrder === 'desc' ? 'Високо до Ниско' : 'Ниско до Високо'}
                options={['Високо до Ниско', 'Ниско до Високо']}
                placeholder="Сортирај"
                onChange={(val) => setFilters(prev => ({ 
                  ...prev, 
                  sortOrder: val === 'Високо до Ниско' ? 'desc' : 'asc' 
                }))}
              />

              <div className="flex items-end h-[54px] md:h-[58px]">
                <button 
                  onClick={() => setFilters({
                    searchQuery: '',
                    brand: '',
                    storage: '',
                    location: '',
                    ram: '',
                    feature: '',
                    condition: '',
                    priceMax: 150000,
                    sortOrder: 'desc'
                  })}
                  className="w-full h-full bg-slate-100 text-slate-500 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Ресетирај
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
          {visiblePhones.length > 0 ? (
            visiblePhones.map(phone => (
              <PhoneCard key={phone.id} phone={phone} config={config} onClick={() => onSelectPhone(phone.id)} />
            ))
          ) : (
            <div className="col-span-full py-12 md:py-24 text-center">
              <span className="text-3xl md:text-4xl">🔎</span>
              <p className="text-slate-400 mt-4 font-black uppercase tracking-widest text-[10px] md:text-[12px]">Нема резултати</p>
            </div>
          )}
        </div>

        {/* Infinite Scroll Footer */}
        {displayLimit < phones.length && (
          <div className="mt-12 flex justify-center pb-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Вчитување на повеќе производи...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogView;
