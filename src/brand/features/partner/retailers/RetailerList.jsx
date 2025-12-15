import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Mail, Store, Info, MoreHorizontal, ChevronDown, Check, X, Bell, RefreshCw, Plus, Shield } from 'lucide-react';
import Tooltip from '../../../components/Tooltip';
import TierBadge from './TierBadge';

// Custom Dropdown Component
const FilterDropdown = ({ label, options, value, onChange, disabled = false, multi = false }) => {
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
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`px-3 py-2 border rounded-lg text-sm font-medium flex items-center gap-2 transition ${
          isOpen ? 'border-black ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'
        } ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700'}`}
      >
        {label} <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-30 animate-in fade-in zoom-in-95 duration-100">
          <div className="p-1 max-h-60 overflow-y-auto">
            {options.map((option) => {
                const isSelected = multi 
                    ? value.includes(option) 
                    : value === option;
                
                return (
                    <button
                        key={option}
                        onClick={() => {
                            onChange(option);
                            if (!multi) setIsOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between group ${
                            isSelected ? 'bg-gray-50 text-black font-medium' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {option === 'All' ? `All ${label}s` : option}
                        {isSelected && <Check size={14} className="text-black" />}
                    </button>
                );
            })}
          </div>
        </div>
      )}
    </div>
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

const RetailerList = ({ retailers, onSelectRetailer, onEditRetailer, onInviteRetailers }) => {
  const [filters, setFilters] = useState({
    country: 'All',
    zone: 'All',
    groups: [],
    tier: 'All',
    status: 'All',
    pendingOnly: false
  });

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

  const pendingCount = retailers.filter(r => r.hasPendingAction).length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col h-full shadow-xs">
      {/* Filter Bar */}
      <div className="p-4 border-b border-gray-100 flex flex-col gap-4">
        {/* Row 1: Search + Actions + Dropdowns */}
        <div className="flex items-center justify-between gap-4">
             {/* Search */}
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by name, ID, or email..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5 transition"
                />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setFilters({...filters, pendingOnly: !filters.pendingOnly})}
                    className={`px-3 py-2 border rounded-lg text-sm font-medium flex items-center gap-2 transition ${
                        filters.pendingOnly ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                >
                    <Bell size={14} className={filters.pendingOnly ? 'fill-current' : ''} />
                    Pending Actions ({pendingCount})
                </button>
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                <FilterDropdown 
                    label="Country" 
                    options={COUNTRIES} 
                    value={filters.country} 
                    onChange={handleCountryChange} 
                />
                <FilterDropdown 
                    label="Zone" 
                    options={ZONES[filters.country] || ['All']} 
                    value={filters.zone} 
                    onChange={(val) => setFilters({...filters, zone: val})}
                    disabled={!ZONES[filters.country] || filters.country === 'All'}
                />
                <FilterDropdown 
                    label="Groups" 
                    options={GROUPS} 
                    value={filters.groups} 
                    onChange={toggleGroup} 
                    multi={true}
                />
                <FilterDropdown 
                    label="Tier" 
                    options={TIERS} 
                    value={filters.tier} 
                    onChange={(val) => setFilters({...filters, tier: val})} 
                />
                <FilterDropdown 
                    label="Status" 
                    options={STATUSES} 
                    value={filters.status} 
                    onChange={(val) => setFilters({...filters, status: val})} 
                />
            </div>

             <button 
                onClick={onInviteRetailers}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2 shadow-xs ml-4"
             >
                <Plus size={16} /> Invite Retailers
             </button>
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
                {filteredRetailers.map(retailer => (
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
