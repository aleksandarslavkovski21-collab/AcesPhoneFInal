
import React from 'react';
import { PhoneModel, Filters, AppConfig } from '../types';
import PhoneCard from './PhoneCard';
import CustomSelect from './CustomSelect';

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
  // Directly use all filtered phones without pagination as requested
  const visiblePhones = phones;

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

        {/* Filters Panel */}
        <div className="mb-16 bg-white border border-blue-100 p-8 rounded-[1.5rem] soft-shadow relative z-40">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 items-end">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase mb-3 ml-2 tracking-[0.2em]">Пребарај</label>
              <input 
                type="text" 
                placeholder="Внеси модел..."
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:border-blue-300 transition-all"
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              />
            </div>
            
            <CustomSelect 
              label="Бренд"
              value={filters.brand}
              options={config.brands || []}
              placeholder="Сите"
              onChange={(val) => setFilters(prev => ({ ...prev, brand: val }))}
            />

            <CustomSelect 
              label="Меморија"
              value={filters.storage}
              options={config.storageOptions || []}
              placeholder="Сите"
              onChange={(val) => setFilters(prev => ({ ...prev, storage: val }))}
            />

            <CustomSelect 
              label="RAM"
              value={filters.ram}
              options={config.ramOptions || []}
              placeholder="Сите"
              onChange={(val) => setFilters(prev => ({ ...prev, ram: val }))}
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
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {visiblePhones.length > 0 ? (
            visiblePhones.map(phone => (
              <PhoneCard key={phone.id} phone={phone} config={config} onClick={() => onSelectPhone(phone.id)} />
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <span className="text-4xl">🔎</span>
              <p className="text-slate-400 mt-4 font-bold uppercase tracking-widest text-[12px]">Нема резултати</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogView;
