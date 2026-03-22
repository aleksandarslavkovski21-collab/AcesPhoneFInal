
import React, { useState, useRef } from 'react';
import { PhoneModel, AppConfig } from '../types';
import { INITIAL_CONFIG } from '../data';
import CustomSelect from './CustomSelect';
import { sortOptions } from '../src/utils';

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
  const [previews, setPreviews] = useState<{original: string, thumbnail: string}[]>([]);
  const [draggedSpecIndex, setDraggedSpecIndex] = useState<number | null>(null);
  const [draggedImgIndex, setDraggedImgIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<{index: number, position: 'before' | 'after'} | null>(null);
  const [newOption, setNewOption] = useState({ brand: '', ram: '', storage: '', location: '', feature: '', specId: '', specLabel: '' });
  const [statusMessage, setStatusMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [showSkuPopup, setShowSkuPopup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<{ original: string, thumbnail: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const process = (maxW: number, maxH: number, quality: number) => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > height) {
              if (width > maxW) {
                height *= maxW / width;
                width = maxW;
              }
            } else {
              if (height > maxH) {
                width *= maxH / height;
                height = maxH;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            return canvas.toDataURL('image/webp', quality);
          };

          const original = process(1080, 1080, 0.85); // 1080p high quality
          const thumbnail = process(600, 600, 0.82);   // Improved quality and resolution for listing
          resolve({ original, thumbnail });
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
        // If the server sends a token through a cookie or we need to fetch it, 
        // we'd handle it here. For now, Google Auth also relies on pcp_admin_auth signal.
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

  // Check for missing SKUs
  React.useEffect(() => {
    if (isAuthenticated && phones.length > 0) {
      const missingSku = phones.some(p => !p.sku);
      if (missingSku) {
        setShowSkuPopup(true);
      }
    }
  }, [isAuthenticated, phones]);

  const handleGenerateSkus = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('pcp_admin_token');
      const res = await fetch('/api/generate-skus', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        // Refresh data by calling a parent update or just reloading
        window.location.reload(); 
      } else {
        alert('Грешка при генерирање на SKU.');
      }
    } catch (e) {
      alert('Проблем со серверот.');
    } finally {
      setIsSubmitting(false);
      setShowSkuPopup(false);
    }
  };

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
        if (data.token) {
          localStorage.setItem('pcp_admin_token', data.token);
        }
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
    localStorage.removeItem('pcp_admin_token');
    window.location.hash = "";
  };

  const defaultActiveSpecs = (config.specTypes || []).map(s => s.id);

  const [formData, setFormData] = useState({
    brand: (config.brands && config.brands[0]) || '',
    sku: '',
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
    icloud: 'Off' as 'On' | 'Off',
    googleServices: true,
    selectedFeatures: [] as string[],
    specOrder: defaultActiveSpecs,
    activeSpecs: defaultActiveSpecs,
    infoText: 'Инфо после 16ч',
    infoEmoji: '⏰',
    infoBgColor: '#fef3c7' // Amber-100
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
    
    if (window.confirm(`Дали сте сигурни дека сакате да ја избришете опцијата "${value}"?`)) {
      onConfigUpdate({ 
        ...config, 
        [type]: (config[type] as string[]).filter(opt => opt !== value) 
      });
      setStatusMessage({ text: `Опцијата "${value}" е избришана.`, type: 'success' });
      setTimeout(() => setStatusMessage(null), 3000);
    }
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
    setDraggedSpecIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedSpecIndex === null || draggedSpecIndex === index) return;

    const newOrder = [...formData.specOrder];
    const item = newOrder.splice(draggedSpecIndex, 1)[0];
    newOrder.splice(index, 0, item);
    
    setDraggedSpecIndex(index);
    setFormData({ ...formData, specOrder: newOrder });
  };

  const handleDragEnd = () => {
    setDraggedSpecIndex(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsSubmitting(true);
    try {
      const compressedResults = await Promise.all(
        Array.from(files).map((file: File) => compressImage(file))
      );
      setPreviews(prev => [...prev, ...compressedResults]);
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

  // Image Drag & Drop Handlers
  const handleImgDragStart = (e: React.DragEvent, index: number) => {
    setDraggedImgIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Create a ghost image if needed, or just let default behavior work
  };

  const handleImgDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedImgIndex === null) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = x < rect.width / 2 ? 'before' : 'after';

    if (draggedImgIndex === index || 
       (draggedImgIndex === index - 1 && position === 'before') ||
       (draggedImgIndex === index + 1 && position === 'after')) {
      setDropTargetIndex(null);
    } else {
      setDropTargetIndex({ index, position });
    }
  };

  const handleImgDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedImgIndex === null || dropTargetIndex === null) {
      setDraggedImgIndex(null);
      setDropTargetIndex(null);
      return;
    }

    const newPreviews = [...previews];
    const itemToMove = newPreviews.splice(draggedImgIndex, 1)[0];
    
    let targetIdx = dropTargetIndex.index;
    if (draggedImgIndex < targetIdx && dropTargetIndex.position === 'before') {
      targetIdx -= 1;
    } else if (draggedImgIndex > targetIdx && dropTargetIndex.position === 'after') {
      targetIdx += 1;
    }
    
    newPreviews.splice(targetIdx, 0, itemToMove);
    setPreviews(newPreviews);
    setDraggedImgIndex(null);
    setDropTargetIndex(null);
  };

  const handleImgDragEnd = () => {
    setDraggedImgIndex(null);
    setDropTargetIndex(null);
  };

  const handleEditInit = (phone: PhoneModel) => {
    setEditingPhoneId(phone.id);
    setFormData({
      brand: phone.brand,
      sku: phone.sku || '',
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
      icloud: phone.icloud || 'Off',
      googleServices: phone.googleServices ?? true,
      selectedFeatures: phone.extraFeatures || [],
      specOrder: phone.specOrder || defaultActiveSpecs,
      activeSpecs: phone.activeSpecs || defaultActiveSpecs,
      infoText: phone.infoText || '',
      infoEmoji: phone.infoEmoji || '⏰',
      infoBgColor: phone.infoBgColor || '#fef3c7'
    });
    // For editing, we treat the existing URL as both original and thumbnail
    const existingImages = (phone.images || [phone.image]).map(img => 
      typeof img === 'string' ? { original: img, thumbnail: phone.thumbnail || img } : img
    );
    setPreviews(existingImages);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingPhoneId(null);
    setFormData({
      brand: config.brands[0] || '', sku: '', model: '', 
      price: '', 
      ram: config.ramOptions[0] || '', storage: config.storageOptions[0] || '', screen: '', condition: 'New', description: '',
      customNote: '',
      unlocked: true,
      lockedTo: '',
      fmi: 'Off', batteryHealth: '', trueTone: false, faceId: false, touchId: false,
      icloud: 'Off',
      googleServices: true, selectedFeatures: [],
      specOrder: defaultActiveSpecs,
      activeSpecs: defaultActiveSpecs,
      infoText: 'Инфо после 16ч',
      infoEmoji: '⏰',
      infoBgColor: '#fef3c7'
    });
    setPreviews([]);
  };

  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Uniqueness Check
    if (formData.sku) {
      const isDuplicate = phones.some(p => p.sku === formData.sku && p.id !== editingPhoneId);
      if (isDuplicate) {
        setStatusMessage({ text: `ГРЕШКА: SKU "${formData.sku}" веќе се користи!`, type: 'error' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setStatusMessage(null), 5000);
        return;
      }
    }

    setIsSubmitting(true);

    const commonData = {
      brand: formData.brand,
      sku: formData.sku,
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
      infoText: formData.infoText,
      infoEmoji: formData.infoEmoji,
      infoBgColor: formData.infoBgColor,
      image: (previews[0] && previews[0].original) || '/favicon.svg',
      thumbnail: (previews[0] && previews[0].thumbnail) || '/favicon.svg',
      images: previews.map(p => p.original)
    };

    const finalData = {
      ...commonData,
      ...(isApple ? { 
        fmi: formData.fmi, 
        batteryHealth: formData.batteryHealth, 
        trueTone: formData.trueTone, 
        faceId: formData.faceId, 
        touchId: formData.touchId,
        icloud: formData.icloud
      } : {}),
      ...(isHuawei ? { googleServices: formData.googleServices } : {})
    };

    if (editingPhoneId) {
      onUpdate(phones.map(p => p.id === editingPhoneId ? { ...p, ...finalData } : p));
    } else {
      onUpdate([{ id: `phone-${Date.now()}`, ...finalData } as PhoneModel, ...phones]);
    }
    
    handleCancelEdit();
    setIsSubmitting(false);
    setStatusMessage({ 
      text: editingPhoneId ? 'Огласот е успешно ажуриран!' : 'Огласот е успешно објавен!', 
      type: 'success' 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl animate-in fade-in duration-500">
      {statusMessage && (
        <div 
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-2xl shadow-2xl border font-black text-sm uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-500 text-white border-emerald-400' 
              : 'bg-red-500 text-white border-red-400'
          }`}
        >
          {statusMessage.type === 'success' ? '✅' : '❌'} {statusMessage.text}
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
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
                        <div 
                          key={`${idx}-${(src.original || '').substring(0, 30)}`} 
                          draggable
                          onDragStart={(e) => handleImgDragStart(e, idx)}
                          onDragOver={(e) => handleImgDragOver(e, idx)}
                          onDrop={handleImgDrop}
                          onDragEnd={handleImgDragEnd}
                          className={`relative aspect-square rounded-2xl overflow-hidden group border border-slate-100 shadow-sm transition-all duration-200 cursor-move ${draggedImgIndex === idx ? 'opacity-30 scale-95' : 'opacity-100'} ${dropTargetIndex?.index === idx ? (dropTargetIndex.position === 'before' ? 'ring-l-4 ring-blue-500 pl-1' : 'ring-r-4 ring-blue-500 pr-1') : ''}`}
                        >
                          {/* Drop Indicator Light up */}
                          {dropTargetIndex?.index === idx && (
                            <div className={`absolute inset-y-0 w-1 bg-blue-500 z-50 animate-pulse ${dropTargetIndex.position === 'before' ? 'left-0' : 'right-0'}`} />
                          )}

                          <img 
                            src={src.thumbnail || src.original} 
                            onError={(e) => {
                              e.currentTarget.src = '/favicon.svg';
                              e.currentTarget.classList.remove('object-cover');
                              e.currentTarget.classList.add('object-contain', 'p-4');
                            }}
                            className="w-full h-full object-cover pointer-events-none" 
                            alt="preview" 
                          />
                          
                          {/* Order Badge */}
                          <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[12px] font-black w-6 h-6 rounded-lg flex items-center justify-center backdrop-blur-sm z-10 pointer-events-none">
                            {idx + 1}
                          </div>

                          {/* Controls Overlay */}
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                            <div className="flex gap-1">
                              <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); moveImage(idx, 'left'); }}
                                disabled={idx === 0}
                                className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-xl disabled:opacity-30 transition-all focus:outline-none"
                                title="Помести лево"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all focus:outline-none"
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
                                className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-xl disabled:opacity-30 transition-all focus:outline-none"
                                title="Помести десно"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                            {idx === 0 && <span className="text-[10px] font-black text-white uppercase tracking-widest bg-blue-600 px-2 py-1 rounded-md pointer-events-none">Главна слика</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="block text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">Бренд</label>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions(config.brands).map(opt => (
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone-sku" className="block text-[12px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">SKU (3 цифри)</label>
                    <input id="phone-sku" type="text" placeholder="пр. 001" className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-blue-300 outline-none w-full font-bold" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value.substring(0, 5)})}/>
                  </div>
                  <div>
                    <label htmlFor="phone-model" className="block text-[12px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Модел</label>
                    <input id="phone-model" type="text" placeholder="пр. P60 Pro" required className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-blue-300 outline-none w-full font-bold" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})}/>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="phone-price" className="block text-[12px] font-black text-slate-400 uppercase mb-2 tracking-widest ml-1">Цена</label>
                    <input id="phone-price" type="number" required className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm w-full font-black text-blue-600 outline-none focus:ring-2 focus:ring-blue-300" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}/>
                  </div>
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
                        <label htmlFor="locked-to" className="block text-[11px] font-black text-amber-600 uppercase mb-2 ml-1 tracking-widest">На кои мрежи е заклучен?</label>
                        <input 
                          id="locked-to"
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
                    {sortOptions(config.ramOptions || []).map(opt => (
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
                    {sortOptions(config.storageOptions || []).map(opt => (
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

                {/* Apple-Specific Settings */}
                {isApple && (
                  <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-xl">🍎</span>
                       <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Apple Специфични Подесувања</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, faceId: !formData.faceId})}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${formData.faceId ? 'bg-white border-blue-200 text-blue-700 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                      >
                        <span className="text-[11px] font-black uppercase tracking-widest">FaceID</span>
                        <div className={`w-10 h-6 rounded-full relative transition-colors ${formData.faceId ? 'bg-blue-600' : 'bg-slate-300'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.faceId ? 'right-1' : 'left-1'}`} />
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({...formData, icloud: formData.icloud === 'On' ? 'Off' : 'On'})}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${formData.icloud === 'Off' ? 'bg-white border-emerald-200 text-emerald-700 shadow-sm' : 'bg-red-50 border-red-100 text-red-600'}`}
                      >
                        <span className="text-[11px] font-black uppercase tracking-widest">iCloud {formData.icloud === 'Off' ? '🔓' : '🔒'}</span>
                        <span className="text-[11px] font-black">{formData.icloud === 'Off' ? 'OFF' : 'ON'}</span>
                      </button>
                    </div>

                    <div>
                      <label htmlFor="battery-health" className="block text-[11px] font-black text-slate-400 uppercase mb-2 tracking-widest ml-1">Battery Health 🔋</label>
                      <div className="relative">
                        <input 
                          id="battery-health"
                          type="text" 
                          placeholder="пр. 92%..." 
                          className="w-full bg-white border border-blue-100 rounded-xl px-4 py-4 text-sm font-black text-slate-700 outline-none focus:ring-2 focus:ring-blue-300"
                          value={formData.batteryHealth}
                          onChange={e => setFormData({...formData, batteryHealth: e.target.value})}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg">🔋</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label htmlFor="screen-size" className="block text-[12px] font-black text-slate-400 uppercase mb-2 tracking-widest ml-1">Screen</label>
                    <input id="screen-size" type="text" placeholder='пр. 6.7"' className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-300 w-full" value={formData.screen} onChange={e => setFormData({...formData, screen: e.target.value})}/>
                  </div>
                </div>

                <div className="space-y-2">
                   <label htmlFor="phone-desc" className="block text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">Опис</label>
                   <textarea 
                     id="phone-desc"
                     className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm w-full font-bold outline-none focus:ring-2 focus:ring-blue-300 min-h-[100px]"
                     value={formData.description}
                     onChange={e => setFormData({...formData, description: e.target.value})}
                   />
                </div>

                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="info-color" className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">Важна Информација (⏰)</label>
                    <input 
                      id="info-color"
                      type="color" 
                      value={formData.infoBgColor} 
                      onChange={e => setFormData({...formData, infoBgColor: e.target.value})}
                      className="w-8 h-8 rounded-lg overflow-hidden border-none cursor-pointer p-0"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input 
                      id="info-emoji"
                      type="text" 
                      placeholder="⏰" 
                      className="w-16 bg-white border border-slate-100 rounded-xl px-3 py-3 text-center text-lg outline-none focus:ring-2 focus:ring-blue-300"
                      value={formData.infoEmoji}
                      onChange={e => setFormData({...formData, infoEmoji: e.target.value})}
                    />
                    <input 
                      id="info-text"
                      type="text" 
                      placeholder="Инфо после 16ч..." 
                      className="flex-grow bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-300"
                      value={formData.infoText}
                      onChange={e => setFormData({...formData, infoText: e.target.value})}
                    />
                  </div>
                </div>

                <div className="bg-red-600 p-6 rounded-3xl border border-red-700 shadow-xl">
                  <label htmlFor="custom-note" className="block text-[12px] font-black text-red-100 uppercase tracking-widest mb-2">Специјална напомена / Дефект</label>
                  <input 
                    id="custom-note"
                    type="text" 
                    placeholder="пр. Скршено стакло" 
                    className="bg-red-700 border border-red-500 rounded-xl px-4 py-3 text-sm w-full font-black text-white outline-none focus:ring-2 focus:ring-white placeholder:text-red-400"
                    value={formData.customNote}
                    onChange={e => setFormData({...formData, customNote: e.target.value})}
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
                    <img 
                      src={p.image} 
                      onError={(e) => { 
                        e.currentTarget.src = '/favicon.svg'; 
                        e.currentTarget.classList.remove('object-cover');
                        e.currentTarget.classList.add('object-contain', 'p-4');
                      }}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-200 bg-white shadow-sm" 
                    />
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-black text-slate-900 text-lg">{p.brand} {p.model}</h4>
                        {p.sku && <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 uppercase tracking-widest shrink-0">SKU: {p.sku}</span>}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-widest">{p.price.toLocaleString()} МКД</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Images: {(p.size_kb || 0) > 1024 ? `${((p.size_kb || 0)/1024).toFixed(1)} MB` : `${p.size_kb || 0} KB`}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">• {p.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditInit(p)} className="p-3 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl border border-blue-100 transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg></button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Дали сте сигурни дека сакате да го избришете огласот за "${p.brand} ${p.model}"?`)) {
                            onUpdate(phones.filter(item => item.id !== p.id));
                            setStatusMessage({ text: 'Огласот е успешно избришан.', type: 'success' });
                            setTimeout(() => setStatusMessage(null), 3000);
                          }
                        }} 
                        className="p-3 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl border border-red-100 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6 bg-white p-8 rounded-[2rem] border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Важна Информација (Глобална)</h3>
                  <p className="text-sm text-slate-400 font-medium italic">Прикажи/Скриј ја нотата на сите огласи.</p>
                </div>
                <button
                  type="button"
                  onClick={() => onConfigUpdate({...config, showGlobalNote: !config.showGlobalNote})}
                  className={`w-14 h-8 rounded-full relative transition-all duration-300 ${config.showGlobalNote ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-sm ${config.showGlobalNote ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
              <textarea 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-300 min-h-[100px] transition-all"
                value={config.globalNote}
                onChange={e => onConfigUpdate({...config, globalNote: e.target.value})}
                placeholder="Внесете ја глобалната порака тука..."
              />
            </div>
            
            <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-slate-200 h-fit">
               <div className="text-sm font-black text-slate-800 uppercase tracking-widest">Целосно Ресетирање</div>
               <button onClick={handleResetToDefaults} className="bg-red-50 text-red-600 px-6 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm">🔄 Ресетирај конфигурација</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {[
               { id: 'brands', label: 'Брендови', icon: '🏷️', field: 'brand' },
               { id: 'ramOptions', label: 'RAM Опции', icon: '💾', field: 'ram' },
               { id: 'storageOptions', label: 'Меморија', icon: '📀', field: 'storage' }
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
      {/* SKU Generator Popup */}
      {showSkuPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner border border-blue-100 animate-bounce">
              🔢
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Недостасуваат SKU кодови!</h3>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              Пронајдовме телефони без SKU кодови. За подобра организација и пребарување, препорачуваме автоматско генерирање на 3-цифрени кодови за сите нив.
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleGenerateSkus}
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Генерирај SKU за сите ✨</>
                )}
              </button>
              <button 
                onClick={() => setShowSkuPopup(false)}
                className="w-full bg-slate-50 text-slate-400 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                Подоцна
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
