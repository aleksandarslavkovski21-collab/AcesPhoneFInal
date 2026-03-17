
import React from 'react';
import { PhoneModel, AppConfig } from '../types';

interface PhoneCardProps {
  phone: PhoneModel;
  config: AppConfig;
  onClick: () => void;
}

const PhoneCard: React.FC<PhoneCardProps> = ({ phone, config, onClick }) => {
  const isApple = phone.brand.toLowerCase() === 'apple';
  const isHuawei = phone.brand.toLowerCase() === 'huawei';
  const priceDen = typeof phone.price === 'string' ? parseFloat(phone.price) : phone.price;

  const activeSpecs = phone.activeSpecs || (config.specTypes || []).map(s => s.id);

  // Function to render each badge
  const renderBadge = (specId: string) => {
    if (!activeSpecs.includes(specId)) return null;

    const specType = (config.specTypes || []).find(s => s.id === specId);
    if (!specType) return null;

    // Base styling for all badges to keep them large and visible
    const baseClass = "px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-tight border shadow-sm whitespace-nowrap transition-all group-hover:scale-105";
    
    // Neutral style for general specs
    const neutralClass = `${baseClass} bg-white text-slate-800 border-slate-200`;
    
    // Vibrant styles for critical specs
    const icloudClass = `${baseClass} bg-emerald-600 text-white border-emerald-700`;
    const batteryClass = `${baseClass} bg-lime-500 text-white border-lime-600`;

    switch (specId) {
      case 'ram':
        return (
          <div key="ram" className={neutralClass}>
            {phone.ram}
          </div>
        );
      case 'storage':
        return (
          <div key="storage" className={neutralClass}>
            {phone.storage}
          </div>
        );
      case 'battery':
        return isApple && phone.batteryHealth ? (
          <div key="battery" className={batteryClass}>
            {phone.batteryHealth}% 🔋
          </div>
        ) : null;
      case 'icloud':
        return isApple && phone.fmi === 'Off' ? (
          <div key="icloud" className={icloudClass}>
            iCloud Off
          </div>
        ) : null;
      case 'biometrics':
        return (
          <React.Fragment key="biometrics">
            {isApple && phone.faceId && (
              <div className={neutralClass}>
                Face ID
              </div>
            )}
            {isApple && phone.touchId && (
              <div className={neutralClass}>
                Touch ID
              </div>
            )}
          </React.Fragment>
        );
      case 'extra':
        return (
          <React.Fragment key="extra">
            {phone.extraFeatures?.slice(0, 2).map(f => (
              <div key={f} className={neutralClass}>
                {f}
              </div>
            ))}
          </React.Fragment>
        );
      case 'googleplay':
        return isHuawei && phone.googleServices ? (
          <div key="googleplay" className={neutralClass}>
            Google Play
          </div>
        ) : null;
      case 'unlocked':
        return (
          <div key="unlocked" className={phone.unlocked ? "px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-tight border shadow-sm whitespace-nowrap transition-all group-hover:scale-105 bg-emerald-50 text-emerald-700 border-emerald-200" : "px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-tight border shadow-sm whitespace-nowrap transition-all group-hover:scale-105 bg-amber-50 text-amber-700 border-amber-200"}>
            {phone.unlocked ? 'Отклучен на сите мрежи и картички' : `Заклучен ${phone.lockedTo ? `: ${phone.lockedTo}` : ''} 🔒📵`}
          </div>
        );
      default:
        // For any other custom spec added by the user
        // We can check if it's in extraFeatures or just show the label if it's a boolean-like feature
        // For now, let's just show the label if it's not one of the hardcoded ones but is active
        return (
          <div key={specId} className={neutralClass}>
            {specType.label}
          </div>
        );
    }
  };

  // Reorder badges based on config.specTypes order, but ensure battery and icloud are last
  const getOrderedBadges = () => {
    const allSpecIds = (config.specTypes || []).map(spec => spec.id);
    const priorityIds = allSpecIds.filter(id => id !== 'battery' && id !== 'icloud' && id !== 'unlocked');
    
    const badges = priorityIds.map(id => renderBadge(id));
    const unlockedBadge = renderBadge('unlocked');
    const batteryBadge = renderBadge('battery');
    const icloudBadge = renderBadge('icloud');
    
    return [...badges, unlockedBadge, batteryBadge, icloudBadge];
  };

  return (
    <div 
      className="group bg-white border border-blue-50 rounded-[1.25rem] overflow-hidden transition-all duration-300 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-200/50 cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] bg-slate-50 p-6 flex items-center justify-center shrink-0">
        <img 
          src={phone.image} 
          alt={phone.model} 
          className="max-w-[80%] max-h-[80%] object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-xl"
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4 min-h-[48px]">
          <div className="text-[12px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">{phone.brand}</div>
          <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
            {phone.model}
          </h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5 min-h-[80px] content-start">
          {getOrderedBadges()}
          {phone.customNote && (
            <div className="bg-red-600 text-white px-2.5 py-1 rounded-lg text-[12px] font-black uppercase tracking-widest border border-red-700 flex items-center gap-1.5 shadow-lg animate-pulse">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              {phone.customNote}
            </div>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between pt-4 border-t border-slate-50">
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tighter">
              {priceDen.toLocaleString()} <span className="text-[12px] font-bold text-slate-400">МКД</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneCard;
