import React from 'react';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white/70 backdrop-blur-md border-b border-slate-200/50">
      <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer group" 
          onClick={() => window.location.hash = ""}
        >
          {/* iPhone SVG Logo */}
          <div className="bg-slate-900 text-white p-1 rounded-lg group-hover:bg-blue-600 transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="3" ry="3"></rect>
              <line x1="12" y1="18" x2="12.01" y2="18"></line>
            </svg>
          </div>
          <span className="text-[19px] font-black tracking-tight text-slate-900 transition-colors duration-300">
            Aces Phones
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => window.location.hash = ""}
            className="text-[14px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors"
          >
            Products
          </button>
          <button 
            onClick={() => window.location.hash = "#/contact"}
            className="text-[14px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors"
          >
            Contact
          </button>
        </nav>
        
        <div className="flex items-center gap-5">
          {/* Sell Phone Button - Hidden on mobile, shown in dropdown */}
          <button 
            onClick={() => window.location.hash = "#/sell"}
            className="hidden md:flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-[13px] font-black uppercase tracking-wider shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all whitespace-nowrap"
          >
            <span>Продај телефон</span>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" stroke="#ffffff">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z" fill="#ffffff"></path>
            </svg>
          </button>

          {/* Admin Link */}
          {localStorage.getItem('pcp_admin_auth') === 'true' && (
            <button 
              onClick={() => window.location.hash = "#/supersecretpage"}
              className="text-[13px] font-black uppercase tracking-widest text-blue-600 hover:opacity-80 transition-opacity"
            >
              Admin
            </button>
          )}
          
          {/* Mobile Menu Button (Visible only on small screens) */}
          <button className="md:hidden text-slate-900 dark:text-white" onClick={() => {
            // Very simple mobile toggle logic for now - user clicks, we show/hide a menu overlay
            // Alternatively, in a real scenario we'd use state
            const menu = document.getElementById('mobile-menu');
            if (menu) {
              menu.classList.toggle('hidden');
            }
          }}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      <div id="mobile-menu" className="hidden md:hidden bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/10 px-6 py-4 absolute w-full shadow-lg z-[9999]">
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => { window.location.hash = ""; document.getElementById('mobile-menu')?.classList.add('hidden'); }}
            className="text-[15px] text-left text-slate-600"
          >
            Products
          </button>
          <hr className="border-slate-100" />
          <button 
            onClick={() => { window.location.hash = "#/contact"; document.getElementById('mobile-menu')?.classList.add('hidden'); }}
            className="text-[15px] font-bold text-left text-slate-600"
          >
            Contact
          </button>
          <hr className="border-slate-100" />
          <button 
            onClick={() => { window.location.hash = "#/sell"; document.getElementById('mobile-menu')?.classList.add('hidden'); }}
            className="flex items-center justify-between w-full bg-blue-600 text-white px-5 py-4 rounded-2xl text-[15px] font-black uppercase tracking-widest shadow-xl shadow-blue-100"
          >
            <span>Продај телефон</span>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" stroke="#ffffff">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z" fill="#ffffff"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
