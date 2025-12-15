import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Filter, ChevronDown, Store } from 'lucide-react';
import { retailers, zones, tiers } from '../../../data/mockStore/retailerStore';
import Drawer from '../../../components/Drawer';

const RetailerPicker = ({ isOpen, onClose, selectedIds = [], onConfirm }) => {
  const [localSelected, setLocalSelected] = useState(new Set(selectedIds));
  const [searchQuery, setSearchQuery] = useState('');
  const [activeZone, setActiveZone] = useState('all');
  const [activeTier, setActiveTier] = useState('all');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'selected'
  
  // UI State for dropdowns
  const [showZoneFilter, setShowZoneFilter] = useState(false);
  const [showTierFilter, setShowTierFilter] = useState(false);
  const filterRef = useRef(null);

  // Sync prop changes to local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelected(new Set(selectedIds));
      setSearchQuery('');
      setActiveZone('all');
      setActiveTier('all');
      setActiveTab('all');
    }
  }, [isOpen, selectedIds]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
        if (filterRef.current && !filterRef.current.contains(event.target)) {
            setShowZoneFilter(false);
            setShowTierFilter(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredList = useMemo(() => {
    let result = retailers;

    // 1. Tab Filter
    if (activeTab === 'selected') {
      result = result.filter(r => localSelected.has(r.id));
    }

    // 2. Zone Filter
    if (activeZone !== 'all') {
      result = result.filter(r => r.zone === activeZone);
    }
    
    // 3. Tier Filter
    if (activeTier !== 'all') {
      result = result.filter(r => r.tier === activeTier);
    }

    // 4. Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.email.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeTab, activeZone, activeTier, searchQuery, localSelected]);

  const toggleSelection = (id) => {
    const newSet = new Set(localSelected);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setLocalSelected(newSet);
  };

  const handleSelectAll = (shouldSelect) => {
    const newSet = new Set(localSelected);
    filteredList.forEach(r => {
      if (shouldSelect) newSet.add(r.id);
      else newSet.delete(r.id);
    });
    setLocalSelected(newSet);
  };

  const areAllVisibleSelected = filteredList.length > 0 && filteredList.every(r => localSelected.has(r.id));

  return (
    <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title="Select Retailers"
        footer={
           <div className="flex gap-3">
              <button 
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition shadow-xs"
              >
                  Cancel
              </button>
              <button 
                  onClick={() => onConfirm(Array.from(localSelected))}
                  className="flex-1 py-2.5 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition shadow-md"
              >
                  Confirm ({localSelected.size})
              </button>
           </div>
        }
    >
        {/* Sticky Header Content inside Body */}
        <div className="sticky top-0 bg-white z-20 px-6 pt-2 pb-4 border-b border-gray-100 space-y-4 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)]">
            {/* Search & Filter Bar */}
            <div className="space-y-3" ref={filterRef}>
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by name, location..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-black/5 transition"
                    />
                </div>
                
                <div className="flex gap-2">
                    {/* Zone Filter */}
                    <div className="relative">
                        <button 
                            onClick={() => { setShowZoneFilter(!showZoneFilter); setShowTierFilter(false); }}
                            className={`px-3 py-1.5 border rounded-md text-xs font-medium flex items-center gap-2 transition ${activeZone !== 'all' ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
                        >
                            {activeZone === 'all' ? 'All Zones' : zones.find(z => z.id === activeZone)?.label}
                            <ChevronDown size={12} />
                        </button>
                        {showZoneFilter && (
                            <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-30 animate-in zoom-in-95 origin-top-left">
                                <div 
                                    className="px-3 py-2 text-xs hover:bg-gray-50 cursor-pointer font-medium"
                                    onClick={() => { setActiveZone('all'); setShowZoneFilter(false); }}
                                >
                                    All Zones
                                </div>
                                {zones.map(z => (
                                    <div 
                                        key={z.id}
                                        className={`px-3 py-2 text-xs hover:bg-gray-50 cursor-pointer ${activeZone === z.id ? 'font-bold bg-gray-50' : ''}`}
                                        onClick={() => { setActiveZone(z.id); setShowZoneFilter(false); }}
                                    >
                                        {z.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tier Filter */}
                    <div className="relative">
                        <button 
                            onClick={() => { setShowTierFilter(!showTierFilter); setShowZoneFilter(false); }}
                            className={`px-3 py-1.5 border rounded-md text-xs font-medium flex items-center gap-2 transition ${activeTier !== 'all' ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
                        >
                            {activeTier === 'all' ? 'All Tiers' : tiers.find(t => t.id === activeTier)?.label}
                            <ChevronDown size={12} />
                        </button>
                        {showTierFilter && (
                            <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-30 animate-in zoom-in-95 origin-top-left">
                                <div 
                                    className="px-3 py-2 text-xs hover:bg-gray-50 cursor-pointer font-medium"
                                    onClick={() => { setActiveTier('all'); setShowTierFilter(false); }}
                                >
                                    All Tiers
                                </div>
                                {tiers.map(t => (
                                    <div 
                                        key={t.id}
                                        className={`px-3 py-2 text-xs hover:bg-gray-50 cursor-pointer ${activeTier === t.id ? 'font-bold bg-gray-50' : ''}`}
                                        onClick={() => { setActiveTier(t.id); setShowTierFilter(false); }}
                                    >
                                        {t.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex">
                <button 
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 pb-2 text-sm font-medium transition relative ${activeTab === 'all' ? 'text-black' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    All Retailers ({retailers.length})
                    {activeTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>}
                </button>
                <button 
                    onClick={() => setActiveTab('selected')}
                    className={`flex-1 pb-2 text-sm font-medium transition relative ${activeTab === 'selected' ? 'text-black' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Selected ({localSelected.size})
                    {activeTab === 'selected' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>}
                </button>
            </div>
        </div>

        {/* List Header (Select All) - Also Sticky below previous block? 
            Ideally this scrolls. But sticking it gives better UX. 
            I'll let it scroll for now or merge into sticky block.
            Let's merge into sticky block to keep 'Select All' available.
        */}

        
        {/* Re-implementing List Header as simple scrolling element for now to avoid layout complexity inside Drawer children */}
        <div className="px-6 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs font-medium text-gray-500">
           <span>{filteredList.length} Retailers found</span>
           <button 
              onClick={() => handleSelectAll(!areAllVisibleSelected)}
              className="text-black hover:underline transition font-bold"
           >
              {areAllVisibleSelected ? 'Deselect All' : 'Select All'}
           </button>
        </div>

        {/* List Content */}
        <div className="pb-4">
           {filteredList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                 <Store size={32} className="mb-2 opacity-50"/>
                 <span className="text-sm">No retailers found</span>
              </div>
           ) : (
             <div className="divide-y divide-gray-50">
                {filteredList.map(retailer => {
                   const isSelected = localSelected.has(retailer.id);
                   const tierLabel = tiers.find(t => t.id === retailer.tier)?.label || retailer.tier;
                   
                   return (
                      <div 
                         key={retailer.id}
                         onClick={(e) => {
                             if (e.target.type !== 'checkbox') toggleSelection(retailer.id);
                         }}
                         className={`px-6 py-4 flex items-center gap-4 cursor-pointer transition hover:bg-gray-50 ${isSelected ? 'bg-indigo-50/10' : ''}`}
                      >
                         {/* Checkbox */}
                         <div className="flex items-center justify-center">
                            <input 
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelection(retailer.id)}
                                className="w-5 h-5 rounded-sm border-gray-300 text-black focus:ring-black transition cursor-pointer"
                            />
                         </div>

                         {/* Content */}
                         <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                               <span className={`text-sm font-semibold truncate ${isSelected ? 'text-black' : 'text-gray-900'}`}>{retailer.name}</span>
                               <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider leading-none ${
                                   retailer.tier === 't-1' ? 'bg-slate-900 text-white' : 
                                   retailer.tier === 't-2' ? 'bg-amber-100 text-amber-800' : 
                                   'bg-gray-100 text-gray-600'
                               }`}>
                                   {tierLabel}
                               </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                               <span className="truncate">{retailer.location}</span>
                               <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                               <span>{zones.find(z => z.id === retailer.zone)?.label}</span>
                            </div>
                         </div>
                      </div>
                   );
                })}
             </div>
           )}
        </div>
    </Drawer>
  );
};

export default RetailerPicker;
