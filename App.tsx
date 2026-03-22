
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PhoneModel, Filters, AppConfig } from './types';
import { getAllPhones, INITIAL_CONFIG } from './data';
import CatalogView from './components/CatalogView';
import DetailView from './components/DetailView';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import ContactView from './components/ContactView';

const App: React.FC = () => {
  const [phones, setPhones] = useState<PhoneModel[]>([]);
  const [config, setConfig] = useState<AppConfig>(INITIAL_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [currentView, setCurrentView] = useState<'catalog' | 'detail' | 'dashboard' | 'contact'>('catalog');
  const [selectedPhoneId, setSelectedPhoneId] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<Filters>({
    brand: "",
    ram: "",
    storage: "",
    condition: "",
    priceMax: 150000, 
    searchQuery: "",
    sortOrder: "desc",
    location: "",
    feature: ""
  });

  const skipNextSave = useRef(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        const data = await res.json();
        
        if (data.phones && data.phones.length > 0) {
          setPhones(data.phones);
        } else {
          setPhones(getAllPhones());
        }

        if (data.config) {
          setConfig({
            ...INITIAL_CONFIG,
            ...data.config,
            specTypes: data.config.specTypes || INITIAL_CONFIG.specTypes
          });
        }
        setHasLoaded(true);
      } catch (e) {
        console.error('Failed to fetch data', e);
        setPhones(getAllPhones());
        setHasLoaded(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Save phones when changed
  useEffect(() => {
    if (!hasLoaded || isLoading) return;
    
    // Skip the first save event which is triggered by initial data fetch
    if (skipNextSave.current) {
      // We don't reset skipNextSave here because we have two effects 
      // check if both have had a chance to run or use a more specific guard
      return;
    }

    const savePhones = async () => {
      try {
        const token = localStorage.getItem('pcp_admin_token');
        const isAuth = localStorage.getItem('pcp_admin_auth') === 'true';
        
        if (!isAuth || !token) return;

        await fetch('/api/phones', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(phones)
        });
      } catch (e) {
        console.error('Failed to save phones', e);
      }
    };
    savePhones();
  }, [phones, isLoading, hasLoaded]);

  // Save config when changed
  useEffect(() => {
    if (!hasLoaded || isLoading) return;

    if (skipNextSave.current) {
      // After both potential initial triggers, we can allow future saves
      // Small timeout to ensure both effects have checked the ref
      setTimeout(() => {
        skipNextSave.current = false;
      }, 100);
      return;
    }

    const saveConfig = async () => {
      try {
        const token = localStorage.getItem('pcp_admin_token');
        const isAuth = localStorage.getItem('pcp_admin_auth') === 'true';

        if (!isAuth || !token) return;

        await fetch('/api/config', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(config)
        });
      } catch (e) {
        console.error('Failed to save config', e);
      }
    };
    saveConfig();
  }, [config, isLoading, hasLoaded]);


  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/phone/')) {
        setSelectedPhoneId(hash.replace('#/phone/', ''));
        setCurrentView('detail');
      } else if (hash === '#/supersecretpage') {
        setCurrentView('dashboard');
        setSelectedPhoneId(null);
      } else if (hash === '#/contact') {
        setCurrentView('contact');
        setSelectedPhoneId(null);
      } else {
        setCurrentView('catalog');
        setSelectedPhoneId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const filteredPhones = useMemo(() => {
    return phones.filter(p => {
      const priceNum = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
      const matchesBrand = !filters.brand || p.brand === filters.brand;
      const matchesRam = !filters.ram || p.ram === filters.ram;
      const matchesStorage = !filters.storage || p.storage === filters.storage;
      const matchesCondition = !filters.condition || p.condition === filters.condition;
      const matchesPrice = priceNum <= filters.priceMax;
      const matchesLocation = !filters.location || p.location === filters.location;
      const matchesFeature = !filters.feature || p.extraFeatures?.includes(filters.feature);
      const matchesSearch = !filters.searchQuery || 
        `${p.brand} ${p.model}`.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      return matchesBrand && matchesRam && matchesStorage && matchesCondition && matchesPrice && matchesSearch && matchesLocation && matchesFeature;
    }).sort((a, b) => {
      const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
      const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
      
      if (filters.sortOrder === 'asc') {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });
  }, [phones, filters]);

  const selectedPhone = useMemo(() => 
    phones.find(p => p.id === selectedPhoneId) || null
  , [phones, selectedPhoneId]);

  const handleSelectPhone = (id: string) => {
    window.location.hash = `#/phone/${id}`;
  };

  const handleBack = () => {
    window.location.hash = "";
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Се вчитува...</div>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
          phones={phones} 
          onUpdate={setPhones} 
          config={config} 
          onConfigUpdate={setConfig} 
        />;
      case 'detail':
        return selectedPhone ? <DetailView phone={selectedPhone} onBack={handleBack} config={config} /> : null;
      case 'contact':
        return <ContactView />;
      default:
        return <CatalogView 
          phones={filteredPhones} 
          filters={filters} 
          setFilters={setFilters} 
          onSelectPhone={handleSelectPhone}
          allPhones={phones}
          config={config}
        />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-babyblue text-slate-900 selection:bg-blue-200 selection:text-blue-900">
      <Navbar />
      <main className="pt-14 flex-grow">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
