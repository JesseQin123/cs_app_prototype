import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Mail, Store, Info, MoreHorizontal, ChevronDown, Check, X, Bell, RefreshCw, Plus, Shield, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Tooltip from '../../../components/Tooltip';
import TierBadge from './TierBadge';
import Popover from '../../../../components/common/Popover';
import DropdownSelect from '../../../../components/common/DropdownSelect';

// Reusable Dropdown for Sort
const FilterDropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`h-10 px-4 border rounded-lg text-sm font-medium flex items-center gap-2 transition min-w-[160px] justify-between ${
          isOpen ? 'border-black ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'
        } bg-white text-gray-700`}
      >
        <span className="truncate">{label}</span> 
        <ChevronDown size={14} className={`transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-30 animate-in fade-in zoom-in-95 duration-100">
          <div className="p-1 max-h-60 overflow-y-auto">
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => { onChange(option); setIsOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between group ${
                        value === option ? 'bg-gray-50 text-black font-medium' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    {option}
                    {value === option && <Check size={14} className="text-black" />}
                </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};



// Filter Content Component (passed to standard Popover)
const FilterContent = ({ filters, onApply, onCancel, options }) => {
    const [tempFilters, setTempFilters] = useState(filters);
    const [groupSearch, setGroupSearch] = useState('');
    
    // Create filtered options for Group Selection
    const filteredGroups = options.GROUPS.filter(g => 
        g.toLowerCase().includes(groupSearch.toLowerCase())
    );

    // Initialize temp filters when component mounts (Popover opens)
    useEffect(() => {
        setTempFilters(filters);
    }, []); 

    const handleClear = () => {
        setTempFilters({
            country: 'All',
            zone: 'All',
            groups: [],
            tier: 'All',
            status: 'All', // Assuming status is handled outside, but keeping structure
            pendingOnly: tempFilters.pendingOnly
        });
    };

    const activeCount = 
        (filters.tier !== 'All' ? 1 : 0) + 
        (filters.groups.length > 0 ? 1 : 0) + 
        (filters.country !== 'All' ? 1 : 0);

    return (
        <div className="w-80 flex flex-col">
            <div className="p-5 space-y-6 max-h-[600px] overflow-y-auto">
                {/* Tier Section */}
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tier</label>
                    <div className="grid grid-cols-2 gap-2">
                        {options.TIERS.map(tier => (
                            <button
                                key={tier}
                                onClick={() => setTempFilters({...tempFilters, tier})}
                                className={`px-3 py-2 rounded-lg text-xs font-medium transition text-left border ${
                                    tempFilters.tier === tier
                                        ? 'bg-gray-50 border-black text-black ring-1 ring-black'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {tier === 'All' ? 'All Tiers' : tier}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Groups Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Groups</label>
                        {tempFilters.groups.length > 0 && (
                            <button 
                                onClick={() => setTempFilters({...tempFilters, groups: []})}
                                className="text-[10px] text-gray-500 hover:text-black underline"
                            >
                                Clear ({tempFilters.groups.length})
                            </button>
                        )}
                    </div>
                    
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                        <input 
                            type="text" 
                            placeholder="Search groups..." 
                            value={groupSearch}
                            onChange={(e) => setGroupSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:outline-hidden focus:border-black transition"
                        />
                    </div>

                    <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1">
                        {filteredGroups.length > 0 ? filteredGroups.map(group => {
                            const isSelected = tempFilters.groups.includes(group);
                            return (
                                <label key={group} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition shrink-0 ${isSelected ? 'bg-black border-black text-white' : 'border-gray-300 bg-white'}`}>
                                        {isSelected && <Check size={10} strokeWidth={3} />}
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={isSelected}
                                        onChange={() => {
                                            const newGroups = isSelected
                                                ? tempFilters.groups.filter(g => g !== group)
                                                : [...tempFilters.groups, group];
                                            setTempFilters({...tempFilters, groups: newGroups});
                                        }}
                                    />
                                    <span className={`text-xs font-medium truncate ${isSelected ? 'text-black' : 'text-gray-600'}`}>{group}</span>
                                </label>
                            );
                        }) : (
                            <div className="text-center py-4">
                                <span className="text-xs text-gray-400">No groups found</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Location Section */}
                <div className="space-y-3 pt-2 border-t border-gray-100">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</label>
                     <div className="flex flex-col gap-3">
                        <DropdownSelect 
                            label="Country" 
                            value={tempFilters.country}
                            options={options.COUNTRIES}
                            onChange={(val) => setTempFilters({...tempFilters, country: val, zone: 'All'})}
                            usePortal={true}
                        />
                        <DropdownSelect 
                            label="Zone" 
                            value={tempFilters.zone}
                            options={options.ZONES[tempFilters.country] || ['All']}
                            onChange={(val) => setTempFilters({...tempFilters, zone: val})}
                            disabled={tempFilters.country === 'All'} // Note: DropdownSelect needs disabled prop
                            usePortal={true}
                        />
                     </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex items-center justify-between">
                <button 
                    onClick={handleClear}
                    className="text-xs font-medium text-gray-500 hover:text-black transition"
                >
                    Clear All
                </button>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onCancel}
                        className="text-xs font-medium text-gray-500 hover:text-black transition"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => onApply(tempFilters)}
                        className="text-xs font-medium bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition shadow-sm"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

// Filter Popover wrapper using standard components
const FilterPopover = ({ filters, onApply, options }) => {
    const [isOpen, setIsOpen] = useState(false);

    const activeCount = 
        (filters.tier !== 'All' ? 1 : 0) + 
        (filters.groups.length > 0 ? 1 : 0) + 
        (filters.country !== 'All' ? 1 : 0);

    return (
        <Popover
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            trigger={
                <button 
                    className={`h-10 px-4 border rounded-lg text-sm font-medium flex items-center gap-2 transition ${
                        isOpen || activeCount > 0 ? 'border-black ring-1 ring-black bg-gray-50' : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                    }`}
                >
                    <Filter size={16} />
                    More Filters
                    {activeCount > 0 && (
                        <span className="flex items-center justify-center bg-black text-white text-[10px] font-bold h-5 w-5 rounded-full ml-0.5">
                            {activeCount}
                        </span>
                    )}
                </button>
            }
            content={
                <FilterContent 
                    filters={filters} 
                    onApply={(vals) => { onApply(vals); setIsOpen(false); }} 
                    onCancel={() => setIsOpen(false)}
                    options={options} 
                />
            }
            position="bottom"
            offset={8}
        />
    );
};

// Action Menu Component
const ActionMenu = ({ onEdit, onDeactivate, onReactivate, status }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef} onClick={e => e.stopPropagation()}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`p-1.5 rounded-lg transition ${isOpen ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-black hover:bg-gray-100'}`}
            >
                <MoreHorizontal size={16} />
            </button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95">
                    <button 
                        onClick={() => { onEdit(); setIsOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                        Edit
                    </button>
                    {status === 'Inactive' || status === 'Suspended' ? (
                         <button 
                            onClick={() => { onReactivate(); setIsOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                        >
                            Reactivate
                        </button>
                    ) : (
                        <button 
                            onClick={() => { onDeactivate(); setIsOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                            Deactivate
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

const RetailerList = ({ retailers, onSelectRetailer, onEditRetailer, onInviteRetailers, initialParams }) => {
  // Initialize filters based on props (deep link support)
  const [filters, setFilters] = useState({
    country: 'All',
    zone: 'All',
    groups: [],
    tier: 'All',
    status: initialParams?.status || 'All', // e.g., 'Active'
    pendingOnly: false
  });

  // Sorting State
  const [sortKey, setSortKey] = useState(initialParams?.sortBy ? `${initialParams.sortBy}_${initialParams.sortDir || 'desc'}` : 'lastActive_desc');

  // Sync with initialParams changes
  useEffect(() => {
    if (initialParams?.status) {
        setFilters(prev => ({ ...prev, status: initialParams.status }));
    }
    if (initialParams?.sortBy) {
        setSortKey(`${initialParams.sortBy}_${initialParams.sortDir || 'desc'}`);
    }
  }, [initialParams]);

  // Mock Options
  const COUNTRIES = ['All', 'United States', 'Canada'];
  const ZONES = {
    'United States': ['All', 'West', 'Midwest', 'South', 'Northeast', 'Northwest'],
    'Canada': ['All', 'None'],
    'All': ['All']
  };
  const GROUPS = ['VIP', 'Department Store', 'Luxury', 'International', 'Boutique', 'Iconic', 'New Openings'];
  const TIERS = ['All', 'Platinum', 'Gold', 'Silver', 'Default Tier'];
  const STATUSES = ['All', 'Active', 'Inactive', 'Suspended'];
  
  const SORT_OPTIONS = [
    'Recent Activity', 
    'Adoption: High to Low', 
    'Adoption: Low to High', 
    'Retailer Name (A-Z)'
  ];

  const SORT_MAPPING = {
    'Recent Activity': { key: 'lastActive', dir: 'desc' },
    'Adoption: High to Low': { key: 'adoptionRate', dir: 'desc' },
    'Adoption: Low to High': { key: 'adoptionRate', dir: 'asc' },
    'Retailer Name (A-Z)': { key: 'name', dir: 'asc' }
  };
  
  // Inverse Mapping for initial state
  const getSortLabel = (key) => {
      const entry = Object.entries(SORT_MAPPING).find(([_, config]) => `${config.key}_${config.dir}` === key);
      return entry ? entry[0] : 'Recent Activity';
  };

  const handleCountryChange = (val) => {
    setFilters({ ...filters, country: val, zone: 'All' });
  };

  const toggleGroup = (group) => {
    const newGroups = filters.groups.includes(group)
      ? filters.groups.filter(g => g !== group)
      : [...filters.groups, group];
    setFilters({ ...filters, groups: newGroups });
  };

  const clearFilters = () => {
    setFilters({
        country: 'All',
        zone: 'All',
        groups: [],
        tier: 'All',
        status: 'All',
        pendingOnly: false
    });
    setSortKey('lastActive_desc');
  };

  const hasActiveFilters = filters.country !== 'All' || filters.zone !== 'All' || filters.groups.length > 0 || filters.tier !== 'All' || filters.status !== 'All' || filters.pendingOnly;

  // Filter Logic
  const filteredRetailers = retailers.filter(r => {
      if (filters.pendingOnly && !r.hasPendingAction) return false;
      if (filters.country !== 'All' && r.location.country !== filters.country) return false;
      if (filters.zone !== 'All' && r.location.zone !== filters.zone) return false;
      if (filters.status !== 'All' && r.status !== filters.status) return false;
      if (filters.tier !== 'All' && r.tier !== filters.tier) return false;
      if (filters.groups.length > 0 && !filters.groups.some(g => r.groups.includes(g))) return false;
      return true;
  });

  // Sorting Logic
  const sortedRetailers = [...filteredRetailers].sort((a, b) => {
      const label = getSortLabel(sortKey);
      const { key, dir } = SORT_MAPPING[label] || { key: 'lastActive', dir: 'desc' };
      
      let valA, valB;
      
      switch(key) {
          case 'adoptionRate':
              valA = a.adoptionRate;
              valB = b.adoptionRate;
              break;
          case 'name':
              valA = a.name.toLowerCase();
              valB = b.name.toLowerCase();
              break;
          case 'lastActive':
          default:
              valA = new Date(a.lastActive).getTime();
              valB = new Date(b.lastActive).getTime();
              break;
      }

      if (valA < valB) return dir === 'asc' ? -1 : 1;
      if (valA > valB) return dir === 'asc' ? 1 : -1;
      return 0;
  });

  const pendingCount = retailers.filter(r => r.hasPendingAction).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col h-full">
      {/* Filter Bar */}
      <div className="p-4 border-b border-gray-100 flex flex-col gap-4">
        {/* Top Actions Row */}
        <div className="flex items-center justify-between gap-4">
            
            {/* Left Group: Search & Primary Filters */}
            <div className="flex items-center gap-3 flex-1">
                 {/* Search */}
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search retailers..." 
                        className="w-full pl-10 pr-4 h-10 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5 transition"
                    />
                </div>

                <div className="w-px h-6 bg-gray-200"></div>

                {/* Status Dropdown (Primary) */}
                 <div className="relative">
                     <FilterDropdown 
                        label={filters.status === 'All' ? 'Status' : filters.status} 
                        options={STATUSES} 
                        value={filters.status} 
                        onChange={(val) => setFilters({...filters, status: val})} 
                    />
                 </div>

                {/* More Filters Popover (Tier, Group, Geo) */}
                <FilterPopover 
                    filters={filters} 
                    onApply={setFilters}
                    options={{ TIERS, GROUPS, COUNTRIES, ZONES }}
                />

                {/* Quick Filter: Pending */}
                 <button 
                    onClick={() => setFilters({...filters, pendingOnly: !filters.pendingOnly})}
                    className={`h-10 px-3 border rounded-lg text-sm font-medium flex items-center gap-2 transition ${
                        filters.pendingOnly ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                >
                    <Bell size={14} className={filters.pendingOnly ? 'fill-current' : ''} />
                    Pending ({pendingCount})
                </button>
            </div>

            {/* Right Group: Sort & Main Action */}
            <div className="flex items-center gap-3">
                 <div className="relative">
                    <FilterDropdown 
                        label={getSortLabel(sortKey)} 
                        options={SORT_OPTIONS}
                        value={getSortLabel(sortKey)}
                        onChange={(val) => {
                            const config = SORT_MAPPING[val];
                            if (config) setSortKey(`${config.key}_${config.dir}`);
                        }}
                    />
                </div>

                 <button 
                    onClick={onInviteRetailers}
                    className="h-10 px-4 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2 shadow-xs"
                 >
                    <Plus size={16} /> Invite Retailers
                 </button>
            </div>
        </div>
        
        {/* Row 2: Active Filter Pills */}
        {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <span className="text-xs font-medium text-gray-500 mr-1">Active Filters:</span>
                
                {filters.pendingOnly && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100">
                        Pending Actions Only
                        <button onClick={() => setFilters({...filters, pendingOnly: false})} className="hover:text-amber-900"><X size={12}/></button>
                    </span>
                )}
                {filters.country !== 'All' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                        Country: {filters.country}
                        <button onClick={() => handleCountryChange('All')} className="hover:text-black"><X size={12}/></button>
                    </span>
                )}
                {filters.zone !== 'All' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                        Zone: {filters.zone}
                        <button onClick={() => setFilters({...filters, zone: 'All'})} className="hover:text-black"><X size={12}/></button>
                    </span>
                )}
                {filters.groups.map(g => (
                    <span key={g} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                        Group: {g}
                        <button onClick={() => toggleGroup(g)} className="hover:text-black"><X size={12}/></button>
                    </span>
                ))}
                {filters.tier !== 'All' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                        Tier: {filters.tier}
                        <button onClick={() => setFilters({...filters, tier: 'All'})} className="hover:text-black"><X size={12}/></button>
                    </span>
                )}
                {filters.status !== 'All' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                        Status: {filters.status}
                        <button onClick={() => setFilters({...filters, status: 'All'})} className="hover:text-black"><X size={12}/></button>
                    </span>
                )}

                <button 
                    onClick={clearFilters}
                    className="text-xs text-red-600 hover:text-red-700 font-medium ml-2 hover:underline"
                >
                    Clear All
                </button>
            </div>
        )}
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
            <thead className="bg-white sticky top-0 z-10">
                <tr className="border-b border-gray-100 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-3 font-medium">Retailer Name</th>
                    <th className="px-6 py-3 font-medium">Primary Contact</th>
                    <th className="px-6 py-3 font-medium">Tier</th>
                    <th className="px-6 py-3 font-medium">Location</th>
                    <th className="px-6 py-3 font-medium w-40">Group</th>
                    <th className="px-6 py-3 font-medium w-24 text-center">Stores</th>
                    <th className="px-6 py-3 font-medium w-40">
                        <div className="flex items-center gap-1">
                            Adoption 
                            <Tooltip content="30-day Adoption Rate">
                                <Info size={12} className="text-gray-400 cursor-help" />
                            </Tooltip>
                        </div>
                    </th>
                    <th className="px-6 py-3 font-medium w-32">Last Active</th>
                    <th className="px-6 py-3 font-medium w-28 text-right">Status</th>
                    <th className="px-6 py-3 font-medium w-16"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {sortedRetailers.map(retailer => (
                <tr 
                    key={retailer.id} 
                    onClick={() => onSelectRetailer(retailer)}
                    className="hover:bg-gray-50 transition cursor-pointer group"
                >
                    {/* Name */}
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${retailer.logo} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                                {retailer.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <div className="font-medium text-gray-900 group-hover:text-brand-gold transition truncate max-w-[180px] flex items-center gap-2">
                                    {retailer.hasPendingAction && (
                                        <Tooltip content="Pending Request">
                                            <Bell size={14} className="text-amber-500 fill-amber-500 animate-pulse" />
                                        </Tooltip>
                                    )}
                                    {retailer.name}
                                </div>
                                <div className="text-xs text-gray-500">ID: {retailer.id.toUpperCase()}</div>
                            </div>
                        </div>
                    </td>

                    {/* Primary Contact */}
                    <td className="px-6 py-4">
                        <div className="min-w-0">
                            <div className="text-sm text-gray-900 truncate max-w-[160px]">{retailer.contact.name}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[160px]">{retailer.contact.email}</div>
                        </div>
                    </td>

                    {/* Tier */}
                    <td className="px-6 py-4">
                        <TierBadge tier={retailer.tier || 'Default Tier'} />
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4">
                        <div className="min-w-0">
                            <div className="text-sm text-gray-900 truncate">{retailer.location.country}</div>
                            {retailer.location.zone && <div className="text-xs text-gray-500 truncate">{retailer.location.zone}</div>}
                        </div>
                    </td>

                    {/* Group */}
                    <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                            {retailer.groups.slice(0, 2).map(g => (
                                <span key={g} className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-medium border border-gray-200 whitespace-nowrap">{g}</span>
                            ))}
                            {retailer.groups.length > 2 && (
                                <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded-full text-[10px] font-medium border border-gray-100">+{retailer.groups.length - 2}</span>
                            )}
                        </div>
                    </td>

                    {/* Stores */}
                    <td className="px-6 py-4 text-center">
                        <div className="text-sm text-gray-600 inline-flex items-center gap-1.5">
                            <Store size={14} className="text-gray-400"/> {retailer.stores}
                        </div>
                    </td>

                    {/* Adoption */}
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[40px]">
                                <div 
                                    className={`h-full rounded-full ${retailer.adoptionRate >= 80 ? 'bg-green-500' : retailer.adoptionRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                                    style={{ width: `${retailer.adoptionRate}%` }}
                                ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-600 w-8 text-right">{retailer.adoptionRate}%</span>
                        </div>
                    </td>

                    {/* Last Active */}
                    <td className="px-6 py-4">
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                            {new Date(retailer.lastActive).toLocaleDateString()}
                        </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            retailer.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' :
                            retailer.status === 'Suspended' ? 'bg-red-50 text-red-700 border-red-100' :
                            retailer.status === 'Inactive' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-gray-50 text-gray-600 border-gray-100'
                        }`}>
                            {retailer.status}
                        </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                        <ActionMenu 
                            status={retailer.status}
                            onEdit={() => onEditRetailer(retailer)}
                            onDeactivate={() => {}}
                            onReactivate={() => {}}
                        />
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default RetailerList;
