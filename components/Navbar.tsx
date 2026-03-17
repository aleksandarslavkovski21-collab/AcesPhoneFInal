import React from 'react';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/50 dark:border-white/10 transition-colors duration-500">
      <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => window.location.hash = ""}
        >
          <span className="text-[17px] font-semibold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
            Aces Phones
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => window.location.hash = ""}
            className="text-[14px] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Products
          </button>
          <button 
            onClick={() => window.location.hash = "#/contact"}
            className="text-[14px] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Contact
          </button>
        </nav>
        
        <div className="flex items-center gap-5">
          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>

          {/* Admin Link */}
          {localStorage.getItem('pcp_admin_auth') === 'true' && (
            <button 
              onClick={() => window.location.hash = "#/supersecretpage"}
              className="text-[14px] text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity"
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
            className="text-[15px] text-left text-slate-600 dark:text-slate-300"
          >
            Products
          </button>
          <hr className="border-slate-100 dark:border-white/5" />
          <button 
            onClick={() => { window.location.hash = "#/contact"; document.getElementById('mobile-menu')?.classList.add('hidden'); }}
            className="text-[15px] text-left text-slate-600 dark:text-slate-300"
          >
            Contact
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
