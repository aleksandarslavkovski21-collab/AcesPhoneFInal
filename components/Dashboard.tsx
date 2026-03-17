
import React, { useState, useRef } from 'react';
import { PhoneModel, AppConfig } from '../types';
import { INITIAL_CONFIG } from '../data';
import CustomSelect from './CustomSelect';

interface DashboardProps {
  phones: PhoneModel[];
  onUpdate: (phones: PhoneModel[]) => void;
  config: AppConfig;
  onConfigUpdate: (config: AppConfig) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ phones, onUpdate, config, onConfigUpdate }) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'settings'>('listings');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPhoneId, setEditingPhoneId] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [newOption, setNewOption] = useState({ brand: '', ram: '', storage: '', location: '', feature: '', specId: '', specLabel: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/webp', 0.8);
          resolve(dataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Password Protection State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('pcp_admin_auth') === 'true';
  });
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        setIsAuthenticated(true);
        localStorage.setItem('pcp_admin_auth', 'true');
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'google_auth_success') {
        setIsAuthenticated(true);
        localStorage.setItem('pcp_admin_auth', 'true');
        localStorage.removeItem('google_auth_success');
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      const { url } = await res.json();
      window.open(url, 'google_auth', 'width=500,height=600');
    } catch (e) {
      setAuthError('Неуспешно поврзување со Google.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('pcp_admin_auth', 'true');
      } else {
        setAuthError(data.error || data.message?.error || 'Погрешна лозинка');
      }
    } catch (e) {
      setAuthError('Проблем со серверот. Пробајте подоцна.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pcp_admin_auth');
    window.location.hash = "";
  };

  const defaultActiveSpecs = (config.specTypes || []).map(s => s.id);

  const [formData, setFormData] = useState({
    brand: (config.brands && config.brands[0]) || '',
    model: '',
    price: '',
    ram: (config.ramOptions && config.ramOptions[0]) || '',
    storage: (config.storageOptions && config.storageOptions[0]) || '',
    screen: '',
    condition: 'New',
    description: '',
    customNote: '',
    unlocked: true,
    lockedTo: '',
    fmi: 'Off' as 'On' | 'Off',
    batteryHealth: '',
    trueTone: false,
    faceId: false,
    touchId: false,
    googleServices: true,
    selectedFeatures: [] as string[],
    specOrder: defaultActiveSpecs,
    activeSpecs: defaultActiveSpecs
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-8 shadow-inner border border-blue-100">🔒</div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Админ Пристап</h2>
          <p className="text-slate-400 font-medium mb-8">Внесете ја лозинката за да продолжите.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Лозинка" 
              className={`w-full bg-slate-50 border ${authError ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-100'} rounded-2xl px-6 py-4 text-center font-black outline-none focus:ring-2 focus:ring-blue-300 transition-all`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {authError && <p className="text-red-500 text-[11px] font-black uppercase tracking-widest animate-pulse">{authError}</p>}
            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl active:scale-[0.98] transition-all">Влези</button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[11px] font-black uppercase tracking-widest"><span className="bg-white px-4 text-slate-400">или</span></div>
            </div>

            <button 
              type="button" 
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-black text-lg shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Влези со Google
            </button>

            <button type="button" onClick={() => window.location.hash = ""} className="w-full text-slate-400 text-[11px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors pt-4">Назад кон продавница</button>
          </form>
        </div>
      </div>
    );
  }

  const isApple = formData.brand.toLowerCase() === 'apple';
  const isHuawei = formData.brand.toLowerCase() === 'huawei';

  const handleAddGlobalOption = (type: keyof AppConfig) => {
    if (type === 'globalNote' || type === 'showGlobalNote') return;
    
    const fieldMap: Record<string, keyof typeof newOption> = {
      brands: 'brand',
      ramOptions: 'ram',
      storageOptions: 'storage',
      locations: 'location',
      featureOptions: 'feature'
    };
    
    const field = fieldMap[type as string];
    const value = (newOption[field] || "").trim();
    
    if (!value) return;

    if ((config[type as keyof AppConfig] as string[]).some(opt => opt.toLowerCase() === value.toLowerCase())) {
      alert(`Опцијата "${value}" веќе постои!`);
      return;
    }

    onConfigUpdate({ ...config, [type]: [...(config[type as keyof AppConfig] as string[]), value] });
    setNewOption({ ...newOption, [field]: '' });
  };

  const handleRemoveGlobalOption = (type: keyof AppConfig, value: string) => {
    let isInUse = false;
    
    switch (type) {
      case 'brands': isInUse = phones.some(p => p.brand === value); break;
      case 'ramOptions': isInUse = phones.some(p => p.ram === value); break;
      case 'storageOptions': isInUse = phones.some(p => p.storage === value); break;
      case 'locations': isInUse = phones.some(p => p.location === value); break;
      case 'featureOptions': isInUse = phones.some(p => p.extraFeatures?.includes(value)); break;
    }

    if (isInUse) {
      alert(`ГРЕШКА: Опцијата "${value}" не може да се избрише бидејќи се користи во активни огласи!`);
      return;
    }

    onConfigUpdate({ 
      ...config, 
      [type]: (config[type] as string[]).filter(opt => opt !== value) 
    });
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Дали сакате да ги вратите сите подесувања на фабрички вредности?')) {
      onConfigUpdate(INITIAL_CONFIG);
    }
  };

  const toggleSpecActive = (key: string) => {
    setFormData(prev => ({
      ...prev,
      activeSpecs: prev.activeSpecs.includes(key)
        ? prev.activeSpecs.filter(s => s !== key)
        : [...prev.activeSpecs, key]
    }));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newOrder = [...formData.specOrder];
    const item = newOrder.splice(draggedIndex, 1)[0];
    newOrder.splice(index, 0, item);
    
    setDraggedIndex(index);
    setFormData({ ...formData, specOrder: newOrder });
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsSubmitting(true);
    try {
      const compressedImages = await Promise.all(
        Array.from(files).map((file: File) => compressImage(file))
      );
      setPreviews(prev => [...prev, ...compressedImages]);
    } catch (err) {
      console.error('Error compressing images:', err);
      alert('Грешка при обработка на сликите.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newPreviews = [...previews];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newPreviews.length) return;
    
    const temp = newPreviews[index];
    newPreviews[index] = newPreviews[targetIndex];
    newPreviews[targetIndex] = temp;
    setPreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditInit = (phone: PhoneModel) => {
    setEditingPhoneId(phone.id);
    setFormData({
      brand: phone.brand,
      model: phone.model,
      price: phone.price.toString(),
      ram: phone.ram,
      storage: phone.storage,
      screen: phone.screen || '',
      condition: phone.condition,
      description: phone.description,
      customNote: phone.customNote || '',
      unlocked: phone.unlocked ?? true,
      lockedTo: phone.lockedTo || '',
      fmi: phone.fmi || 'Off',
      batteryHealth: phone.batteryHealth?.toString() || '',
      trueTone: !!phone.trueTone,
      faceId: !!phone.faceId,
      touchId: !!phone.touchId,
      googleServices: phone.googleServices ?? true,
      selectedFeatures: phone.extraFeatures || [],
      specOrder: phone.specOrder || defaultActiveSpecs,
      activeSpecs: phone.activeSpecs || defaultActiveSpecs
    });
    setPreviews(phone.images || [phone.image]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingPhoneId(null);
    setFormData({
      brand: config.brands[0] || '', model: '', price: '', 
      ram: config.ramOptions[0] || '', storage: config.storageOptions[0] || '', screen: '', condition: 'New', description: '',
      customNote: '',
      unlocked: true,
      lockedTo: '',
      fmi: 'Off', batteryHealth: '', trueTone: false, faceId: false, touchId: false,
      googleServices: true, selectedFeatures: [],
      specOrder: defaultActiveSpecs,
      activeSpecs: defaultActiveSpecs
    });
    setPreviews([]);
  };

  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const commonData = {
      brand: formData.brand,
      model: formData.model,
      price: formData.price,
      ram: formData.ram,
      storage: formData.storage,
      screen: formData.screen,
      condition: formData.condition,
      description: formData.description,
      customNote: formData.customNote,
      unlocked: formData.unlocked,
      lockedTo: formData.unlocked ? '' : formData.lockedTo,
      extraFeatures: formData.selectedFeatures,
      specOrder: formData.specOrder,
      activeSpecs: formData.activeSpecs,
      image: previews[0] || 'https://via.placeholder.com/300x300',
      images: previews
    };

    const finalData = {
      ...commonData,
      ...(isApple ? { fmi: formData.fmi, batteryHealth: formData.batteryHealth, trueTone: formData.trueTone, faceId: formData.faceId, touchId: formData.touchId } : {}),
      ...(isHuawei ? { googleServices: formData.googleServices } : {})
    };

    if (editingPhoneId) {
      onUpdate(phones.map(p => p.id === editingPhoneId ? { ...p, ...finalData } : p));
    } else {
      onUpdate([{ id: `phone-${Date.now()}`, ...finalData } as PhoneModel, ...phones]);
    }
    
    handleCancelEdit();
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1400px]">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
             <h2 className="text-4xl font-black text-slate-900 tracking-tight">Админ Контрола</h2>
             <button onClick={() => window.location.hash = ""} className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest border border-blue-100 hover:bg-blue-600 hover:text-white transition-all">Види продавница</button>
             <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-600 hover:text-white transition-all">Одјави се</button>
          </div>
          <p className="text-slate-400 font-medium italic">Персонализирај сè според твоите потреби.</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-[2rem] border border-slate-200 shadow-inner w-full lg:w-auto">
          {['listings', 'settings'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-grow lg:flex-none px-8 py-3.5 rounded-[1.5rem] text-sm font-black transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-lg shadow-slate-200' : 'text-slate-500 hover:text-slate-800 uppercase tracking-widest'}`}>
              {tab === 'listings' ? 'Огласи' : 'Подесувања'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'listings' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-2xl shadow-slate-200/50 sticky top-12 z-[100]">
              <h3 className="text-2xl font-black mb-8">{editingPhoneId ? 'Уреди оглас' : 'Нов оглас'}</h3>
              <form onSubmit={handleSubmitListing} className="space-y-6">
                
                <div className="space-y-4">
                  <label className="block text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">Слики</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-100 rounded-3xl p-8 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📸</div>
                    <div className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Додади слики</div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      multiple 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  
                  {previews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                      {previews.map((src, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-100 shadow-sm">
                          <img src={src} className="w-full h-full object-cover" alt="preview" />
                          
                          {/* Order Badge */}
                          <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[12px] font-black w-6 h-6 rounded-lg flex items-center justify-center backdrop-blur-sm z-10">
                            {idx + 1}
                          </div>

                          {/* Controls Overlay */}
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                            <div className="flex gap-1">
                              <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); moveImage(idx, 'left'); }}
                                disabled={idx === 0}
                                className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-xl disabled:opacity-30 transition-all"
                                title="Помести лево"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all"
                                title="Избриши"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                              <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); moveImage(idx, 'right'); }}
                                disabled={idx === previews.length - 1}
                                className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-xl disabled:opacity-30 transition-all"
                                title="Помести десно"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                            {idx === 0 && <span className="text-[10px] font-black text-white uppercase tracking-widest bg-blue-600 px-2 py-1 rounded-md">Главна слика</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="block text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">Бренд</label>
                  <div className="flex flex-wrap gap-2">
                    {config.brands.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormData({...formData, brand: opt})}
                        className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${formData.brand === opt ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Модел</label>
                  <input type="text" placeholder="пр. P60 Pro" required className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-blue-300 outline-none w-full font-bold" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})}/>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-4">Опции за мрежа и состојба</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, unlocked: !formData.unlocked})}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${formData.unlocked ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}
                    >
                      <span className="text-xs font-black uppercase tracking-widest">
                        {formData.unlocked ? 'Отклучен на сите мрежи и картички' : 'Заклучен на мрежа 🔒📵'}
                      </span>
                      <div className={`w-10 h-6 rounded-full relative transition-colors ${formData.unlocked ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.unlocked ? 'right-1' : 'left-1'}`} />
                      </div>
                    </button>

                    {!formData.unlocked && (
                      <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <label className="block text-[11px] font-black text-amber-600 uppercase mb-2 ml-1 tracking-widest">На кои мрежи е заклучен?</label>
                        <input 
                          type="text" 
                          placeholder="пр. T-Mobile, A1..." 
                          className="w-full bg-white border border-amber-200 rounded-xl px-4 py-3 text-sm font-bold text-amber-900 outline-none focus:ring-2 focus:ring-amber-300"
                          value={formData.lockedTo}
                          onChange={e => setFormData({...formData, lockedTo: e.target.value})}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-red-600 p-6 rounded-3xl border border-red-700 shadow-xl">
                  <h4 className="text-[12px] font-black text-red-100 uppercase tracking-widest mb-2">Специјална напомена / Дефект</h4>
                  <input 
                    type="text" 
                    placeholder="пр. Скршено стакло" 
                    className="bg-red-700 border border-red-500 rounded-xl px-4 py-3 text-sm w-full font-black text-white outline-none focus:ring-2 focus:ring-white placeholder:text-red-400"
                    value={formData.customNote}
                    onChange={e => setFormData({...formData, customNote: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[12px] font-black text-slate-400 uppercase mb-2 tracking-widest ml-1">Цена</label>
                    <input type="number" required className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm w-full font-black text-blue-600 outline-none focus:ring-2 focus:ring-blue-300" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}/>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-4">Видливи спецификации на картичка</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {(config.specTypes || []).map(spec => (
                      <div key={spec.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                        <input 
                          type="checkbox" 
                          id={`spec-${spec.id}`}
                          checked={formData.activeSpecs.includes(spec.id)}
                          onChange={() => toggleSpecActive(spec.id)}
                          className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                        />
                        <label htmlFor={`spec-${spec.id}`} className="text-[12px] font-black text-slate-700 uppercase cursor-pointer">
                          {spec.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">RAM</label>
                  <div className="flex flex-wrap gap-2">
                    {(config.ramOptions || []).map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormData({...formData, ram: opt})}
                        className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${formData.ram === opt ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">Меморија</label>
                  <div className="flex flex-wrap gap-2">
                    {(config.storageOptions || []).map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormData({...formData, storage: opt})}
                        className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${formData.storage === opt ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-[12px] font-black text-slate-400 uppercase mb-2 tracking-widest ml-1">Screen</label>
                    <input type="text" placeholder='пр. 6.7"' className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-300" value={formData.screen} onChange={e => setFormData({...formData, screen: e.target.value})}/>
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="block text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">Опис</label>
                   <textarea 
                     className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm w-full font-bold outline-none focus:ring-2 focus:ring-blue-300 min-h-[100px]"
                     value={formData.description}
                     onChange={e => setFormData({...formData, description: e.target.value})}
                   />
                </div>

                <div className="flex gap-2">
                  <button type="submit" disabled={isSubmitting} className="flex-grow bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl active:scale-[0.97] transition-all">
                    {isSubmitting ? 'Се зачувува...' : editingPhoneId ? 'Зачувај' : 'Објави'}
                  </button>
                  {editingPhoneId && (
                    <button type="button" onClick={handleCancelEdit} className="bg-slate-200 text-slate-600 px-6 py-5 rounded-[1.5rem] font-black text-lg hover:bg-slate-300 transition-all">
                      X
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between"><h3 className="text-xl font-black text-slate-800 tracking-tight">Сите Огласи ({phones.length})</h3></div>
              <div className="divide-y divide-slate-100">
                {phones.map((p) => (
                  <div key={p.id} className="p-6 flex items-center gap-6 hover:bg-slate-50 group">
                    <img src={p.image} className="w-20 h-20 rounded-2xl object-cover border border-slate-200 bg-white shadow-sm" />
                    <div className="flex-grow">
                      <h4 className="font-black text-slate-900 text-lg">{p.brand} {p.model}</h4>
                      <p className="text-sm text-slate-400 font-bold">{p.price.toLocaleString()} ден. • {p.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditInit(p)} className="p-3 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl border border-blue-100 transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg></button>
                      <button onClick={() => onUpdate(phones.filter(item => item.id !== p.id))} className="p-3 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl border border-red-100 transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200">
             <div className="text-sm font-black text-slate-800 uppercase tracking-widest">Конфигурација на опции</div>
             <button onClick={handleResetToDefaults} className="bg-red-50 text-red-600 px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm">🔄 Ресетирај</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {[
              { id: 'brands', label: 'Брендови', icon: '🏷️', field: 'brand' },
              { id: 'ramOptions', label: 'RAM Опции', icon: '💾', field: 'ram' },
              { id: 'storageOptions', label: 'Меморија', icon: '📀', field: 'storage' },
              { id: 'featureOptions', label: 'Додатни Опции', icon: '⚡', field: 'feature' }
            ].map(sect => (
              <section key={sect.id} className="bg-white rounded-[2.5rem] p-6 border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
                <div className="flex items-center justify-between mb-6 shrink-0"><h3 className="text-sm font-black flex items-center gap-2"><span className="text-lg">{sect.icon}</span> {sect.label}</h3></div>
                
                {/* Fixed Layout to keep plus button inside */}
                <div className="flex items-center gap-2 mb-6 shrink-0 w-full">
                  <input 
                    type="text" 
                    placeholder="Ново..." 
                    className="flex-grow min-w-0 bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-300 transition-all" 
                    value={(newOption as any)[sect.field]} 
                    onChange={e => setNewOption({...newOption, [sect.field]: e.target.value})} 
                    onKeyDown={(e) => e.key === 'Enter' && handleAddGlobalOption(sect.id as any)}
                  />
                  <button 
                    onClick={() => handleAddGlobalOption(sect.id as any)} 
                    className="shrink-0 bg-blue-600 text-white w-10 h-10 rounded-xl font-black shadow-lg shadow-blue-100 active:scale-90 transition-all flex items-center justify-center text-lg"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[300px] scrollbar-hide flex-grow pr-1">
                  {(config[sect.id as keyof AppConfig] as string[] || []).map(opt => (
                    <div key={opt} className="group bg-slate-50 pl-3 pr-1 py-1.5 rounded-xl flex items-center gap-2 border border-slate-100 transition-all hover:border-red-200 hover:bg-red-50/30">
                      <span className="text-[12px] font-black text-slate-700">{opt}</span>
                      <button onClick={() => handleRemoveGlobalOption(sect.id as any, opt)} className="text-slate-300 hover:text-red-600 transition-colors p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg></button>
                    </div>
                  ))}
                  {(config[sect.id as keyof AppConfig] as string[]).length === 0 && (
                    <p className="text-[12px] text-slate-400 italic py-2">Нема додадено.</p>
                  )}
                </div>
              </section>
            ))}

            {/* Spec Types Management */}
            <section className="bg-white rounded-[2.5rem] p-6 border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between mb-6 shrink-0"><h3 className="text-sm font-black flex items-center gap-2"><span className="text-lg">⚙️</span> Видливи Спец.</h3></div>
              
              <div className="space-y-2 mb-6 shrink-0">
                <input 
                  type="text" 
                  placeholder="ID (пр. ram)..." 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-300 transition-all" 
                  value={newOption.specId} 
                  onChange={e => setNewOption({...newOption, specId: e.target.value})} 
                />
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Наслов (пр. RAM)..." 
                    className="flex-grow min-w-0 bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-300 transition-all" 
                    value={newOption.specLabel} 
                    onChange={e => setNewOption({...newOption, specLabel: e.target.value})} 
                  />
                  <button 
                    onClick={() => {
                      if (!newOption.specId || !newOption.specLabel) return;
                      onConfigUpdate({ ...config, specTypes: [...(config.specTypes || []), { id: newOption.specId, label: newOption.specLabel }] });
                      setNewOption({ ...newOption, specId: '', specLabel: '' });
                    }} 
                    className="shrink-0 bg-blue-600 text-white w-10 h-10 rounded-xl font-black shadow-lg shadow-blue-100 active:scale-90 transition-all flex items-center justify-center text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[300px] scrollbar-hide flex-grow pr-1">
                {(config.specTypes || []).map(spec => (
                  <div key={spec.id} className="group bg-slate-50 pl-3 pr-1 py-1.5 rounded-xl flex items-center gap-2 border border-slate-100 transition-all hover:border-red-200 hover:bg-red-50/30">
                    <span className="text-[12px] font-black text-slate-700">{spec.label} <span className="text-[10px] text-slate-400">({spec.id})</span></span>
                    <button 
                      onClick={() => onConfigUpdate({ ...config, specTypes: (config.specTypes || []).filter(s => s.id !== spec.id) })} 
                      className="text-slate-300 hover:text-red-600 transition-colors p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
