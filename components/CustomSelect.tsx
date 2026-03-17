
import React, { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
  label?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ 
  label, 
  value, 
  options, 
  onChange, 
  placeholder = "Избери...",
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-[11px] font-black text-slate-400 uppercase mb-3 ml-2 tracking-[0.2em]">
          {label}
        </label>
      )}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-50 border ${isOpen ? 'border-blue-300' : 'border-slate-100'} rounded-xl px-5 py-4 text-sm font-bold text-slate-700 cursor-pointer flex items-center justify-between transition-all hover:bg-slate-100/50`}
      >
        <span className={!value ? 'text-slate-400' : 'text-slate-700'}>
          {value || placeholder}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-blue-100 rounded-2xl shadow-xl shadow-blue-200/40 z-50 py-2 max-h-60 overflow-y-auto scrollbar-hide animate-in fade-in slide-in-from-top-2 duration-200">
          {placeholder && (
            <div 
              onClick={() => { onChange(""); setIsOpen(false); }}
              className="px-5 py-3 text-sm font-bold text-slate-400 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
            >
              Сите
            </div>
          )}
          {options.map((opt) => (
            <div 
              key={opt}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className={`px-5 py-3 text-sm font-bold transition-colors cursor-pointer ${value === opt ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'}`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
