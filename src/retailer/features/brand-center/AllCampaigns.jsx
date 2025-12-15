import React, { useState } from 'react';
import { Filter, ChevronRight, LayoutGrid, List, Search, Instagram, Facebook, Mail, Download, MessageSquare, Smartphone, Check, ArrowRight, Flame, ChevronDown, X, Pin, Lock } from 'lucide-react';
import Tooltip from '../../../components/Tooltip';
import CampaignCard from './components/CampaignCard';

const AllCampaigns = ({ campaigns, brands, templates, files, initialBrandId = 'all' }) => {
  const [filterStatus, setFilterStatus] = useState('active'); // 'active', 'past'
  const [filterBrand, setFilterBrand] = useState(initialBrandId);
  const [filterAssetTypes, setFilterAssetTypes] = useState([]); // Multi-select
  const [filterUsage, setFilterUsage] = useState('all'); // 'all', 'unused', 'used'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'expiring'
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isBrandFilterOpen, setIsBrandFilterOpen] = useState(false); // Nested dropdown inside filter popover
  
  // Pending Filter State (for deferred application)
  const [pendingFilterBrand, setPendingFilterBrand] = useState(initialBrandId);
  const [pendingFilterAssetTypes, setPendingFilterAssetTypes] = useState([]);
  const [pendingFilterUsage, setPendingFilterUsage] = useState('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Sync pending state when opening filter dropdown
  const openFilterDropdown = () => {
      setPendingFilterBrand(filterBrand);
      setPendingFilterAssetTypes(filterAssetTypes);
      setPendingFilterUsage(filterUsage);
      setIsFilterDropdownOpen(true);
  };

  // Apply pending filters
  const applyFilters = () => {
      setFilterBrand(pendingFilterBrand);
      setFilterAssetTypes(pendingFilterAssetTypes);
      setFilterUsage(pendingFilterUsage);
      setIsFilterDropdownOpen(false);
      setCurrentPage(1); // Reset to page 1 on filter change
  };

  // Clear pending filters
  const clearPendingFilters = () => {
      setPendingFilterBrand('all');
      setPendingFilterAssetTypes([]);
      setPendingFilterUsage('all');
  };

  // --- Calculate Counts for Tabs ---
  const now = new Date('2025-11-26'); // Simulated Now
  
  const getCampaignStatus = (c) => {
      let isExpired = false;
      if (c.endDate !== 'Permanent') {
          const end = new Date(c.endDate);
          const diffTime = end - now;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays <= 0) isExpired = true;
      }
      if (c.status === 'Archived' || c.status === 'Ended') isExpired = true;
      return isExpired ? 'past' : 'active';
  };

  const availableCount = campaigns.filter(c => getCampaignStatus(c) === 'active').length;
  const pastCount = campaigns.filter(c => getCampaignStatus(c) === 'past').length;
  
  // --- Filtering Logic for Main Grid ---
  const filteredCampaigns = campaigns.filter(c => {
      // 0. StartDate Filter (Hide Scheduled Campaigns)
      // Only show campaigns that have started (startDate <= now)
      const now = new Date('2025-11-26'); // Simulated Now
      if (c.startDate) {
          const start = new Date(c.startDate);
          if (start > now) return false; // Hide scheduled campaigns
      }

      // 1. Status Filter (Active vs Past)
      let isExpired = false;
      
      if (c.endDate !== 'Permanent') {
          const end = new Date(c.endDate);
          const diffTime = end - now;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays <= 0) isExpired = true;
      }
      
      // Also treat 'Archived' or 'Ended' status from Brand side as Expired
      if (c.status === 'Archived' || c.status === 'Ended') isExpired = true;

      if (filterStatus === 'active') {
          // Show: New, Active, Expiring Soon
          // Hide: Expired
          if (isExpired) return false;
      } else {
          // Past View
          // Show: Expired only
          if (!isExpired) return false; // This is correct: Past tab shows ONLY expired. Expiring Soon is NOT expired, so it stays in Active.
      }

      // Search Filter
      if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      // Brand Filter
      if (filterBrand !== 'all' && c.brandId !== filterBrand) return false;

      // Usage Filter
      const isUsed = c.retailerUsage && Object.values(c.retailerUsage).some(v => v === true);
      if (filterUsage === 'unused' && isUsed) return false;
      if (filterUsage === 'used' && !isUsed) return false;

      // Asset Type Filter (Multi-select OR logic)
      if (filterAssetTypes.length > 0) {
          const linkedTemplates = templates.filter(t => c.templates?.includes(t.id));
          const linkedAssets = files.filter(f => c.assets?.includes(f.id));
          
          const hasSocial = linkedTemplates.some(t => t.type === 'social');
          const hasEmail = linkedTemplates.some(t => t.type === 'email');
          const hasSMS = linkedTemplates.some(t => t.type === 'sms');
          const hasFiles = linkedAssets.length > 0;

          const matches = filterAssetTypes.some(type => {
              if (type === 'social') return hasSocial;
              if (type === 'email') return hasEmail;
              if (type === 'sms') return hasSMS;
              if (type === 'files') return hasFiles;
              return false;
          });
          if (!matches) return false;
      }

      return true;
  }).sort((a, b) => {
      // Sort Logic
      const getDate = (d) => d === 'Permanent' ? new Date('2099-12-31') : new Date(d);

      if (sortBy === 'expiring') {
          return getDate(a.endDate) - getDate(b.endDate); // Ascending (Soonest first)
      }
      if (sortBy === 'expired_recent') {
          return getDate(b.endDate) - getDate(a.endDate); // Descending (Most recently ended first)
      }
      
      // Default: Newest (using ID as proxy for creation time, assuming higher ID = newer)
      return b.id - a.id; 
  });

  const togglePendingAssetTypeFilter = (type) => {
      setPendingFilterAssetTypes(prev => 
          prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
      );
  };

  const toggleAssetTypeFilter = (type) => {
      setFilterAssetTypes(prev => 
          prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
      );
  };

  const getPlatformIcon = (p) => {
      switch(p) {
          case 'instagram': return <Instagram size={14} className="text-pink-600"/>;
          case 'facebook': return <div className="w-3.5 h-3.5 bg-blue-600 rounded-full flex items-center justify-center text-[9px] text-white font-bold">f</div>;
          case 'x': 
          case 'twitter': return <div className="w-3.5 h-3.5 bg-black rounded-xs flex items-center justify-center text-white font-black text-[10px]">𝕏</div>;
          case 'google': 
          case 'gmb': return <div className="w-3.5 h-3.5 rounded-xs flex items-center justify-center text-white font-bold text-[9px]" style={{backgroundColor: '#4285F4'}}>G</div>;
          default: return <Smartphone size={14} className="text-gray-400"/>;
      }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
       {/* 1. Global Filter Bar (Sticky) */}
       <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-xs transition-all">
          <div className="px-6 py-3 flex items-center justify-between gap-4 h-[72px]">
             
             {/* LEFT GROUP: Tabs + Search + Filter */}
             <div className="flex items-center gap-3 flex-1">
                 {/* Tabs (Available | Past) */}
                 <div className="flex items-center bg-gray-100 rounded-md p-1 shrink-0">
                    <button 
                       onClick={() => { setFilterStatus('active'); setSortBy('newest'); }}
                       className={`px-4 py-2 text-sm font-bold rounded-xs transition flex items-center gap-2 ${filterStatus === 'active' ? 'bg-white shadow-xs text-black' : 'text-gray-500 hover:text-black'}`}
                    >
                       Available <span className={`text-xs ${filterStatus === 'active' ? 'text-gray-900' : 'text-gray-400'}`}>({availableCount})</span>
                    </button>
                    <button 
                       onClick={() => { setFilterStatus('past'); setSortBy('expired_recent'); }}
                       className={`px-4 py-2 text-sm font-bold rounded-xs transition flex items-center gap-2 ${filterStatus === 'past' ? 'bg-white shadow-xs text-black' : 'text-gray-500 hover:text-black'}`}
                    >
                       Past <span className={`text-xs ${filterStatus === 'past' ? 'text-gray-900' : 'text-gray-400'}`}>({pastCount})</span>
                    </button>
                 </div>

                 {/* Search Bar */}
                 <div className="relative w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-md text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5 focus:border-black transition shadow-xs"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-1 rounded-md hover:bg-gray-100 transition"
                        >
                            <X size={14} />
                        </button>
                    )}
                 </div>

                 {/* Filter Icon Trigger */}
                 <div className="relative">
                    <button 
                        onClick={openFilterDropdown}
                        className={`p-2.5 rounded-md border transition ${isFilterDropdownOpen || filterBrand !== 'all' || filterAssetTypes.length > 0 || filterUsage !== 'all' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black'}`}
                    >
                        <Filter size={18} />
                    </button>

                     {/* Filter Popover */}
                     {isFilterDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-in fade-in zoom-in-95 flex flex-col">
                           <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center">
                               <span className="font-bold text-sm">Filters</span>
                           </div>
                           
                           <div className="p-4 space-y-6 flex-1 overflow-y-auto max-h-[400px]">
                               {/* Brand Filter (Dropdown) */}
                               <div className="space-y-2">
                                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brand</label>
                                   <div className="relative">
                                       <button 
                                           onClick={() => setIsBrandFilterOpen(!isBrandFilterOpen)}
                                           className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
                                       >
                                           <div className="flex items-center gap-2">
                                               {pendingFilterBrand !== 'all' && (
                                                   <div className={`w-4 h-4 rounded-full ${brands.find(b => b.id === pendingFilterBrand)?.logo} flex items-center justify-center text-white text-[6px] font-bold`}>
                                                       {brands.find(b => b.id === pendingFilterBrand)?.name.substring(0,1)}
                                                   </div>
                                               )}
                                               <span>{pendingFilterBrand === 'all' ? 'All Brands' : brands.find(b => b.id === pendingFilterBrand)?.name}</span>
                                           </div>
                                           <ChevronDown size={14} className="text-gray-500"/>
                                       </button>
                                       
                                       {isBrandFilterOpen && (
                                           <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-[200px] overflow-y-auto">
                                               <button 
                                                   onClick={() => { setPendingFilterBrand('all'); setIsBrandFilterOpen(false); }}
                                                   className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${pendingFilterBrand === 'all' ? 'font-bold bg-gray-50' : ''}`}
                                               >
                                                   All Brands
                                               </button>
                                               {brands.map(b => (
                                                   <button 
                                                       key={b.id}
                                                       onClick={() => { setPendingFilterBrand(b.id); setIsBrandFilterOpen(false); }}
                                                       className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${pendingFilterBrand === b.id ? 'font-bold bg-gray-50' : ''}`}
                                                   >
                                                       <div className={`w-4 h-4 rounded-full ${b.logo} flex items-center justify-center text-white text-[6px] font-bold`}>
                                                           {b.name.substring(0,1)}
                                                       </div>
                                                       {b.name}
                                                   </button>
                                               ))}
                                           </div>
                                       )}
                                   </div>
                               </div>
 
                               {/* Usage Filter */}
                               <div className="space-y-2">
                                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">My Usage</label>
                                   <div className="flex bg-gray-100 rounded-md p-1">
                                      {[
                                         { id: 'all', label: 'All' },
                                         { id: 'unused', label: 'Unused' },
                                         { id: 'used', label: 'Used' }
                                      ].map(opt => (
                                         <button 
                                            key={opt.id}
                                            onClick={() => setPendingFilterUsage(opt.id)}
                                            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-xs transition ${pendingFilterUsage === opt.id ? 'bg-white shadow-xs text-black' : 'text-gray-500 hover:text-black'}`}
                                         >
                                            {opt.label}
                                         </button>
                                      ))}
                                   </div>
                               </div>
 
                               {/* Asset Type Filter (Vertical List) */}
                               <div className="space-y-2">
                                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Asset Types</label>
                                   <div className="space-y-1">
                                       {[
                                           { id: 'social', label: 'Social Posts', icon: <Instagram size={14}/> },
                                           { id: 'email', label: 'Email Drafts', icon: <Mail size={14}/> },
                                           { id: 'sms', label: 'SMS Messages', icon: <MessageSquare size={14}/> },
                                           { id: 'files', label: 'Downloads', icon: <Download size={14}/> }
                                       ].map(type => (
                                           <button 
                                               key={type.id}
                                               onClick={() => togglePendingAssetTypeFilter(type.id)}
                                               className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm border transition ${pendingFilterAssetTypes.includes(type.id) ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                                           >
                                               <div className="flex items-center gap-2">
                                                   {type.icon}
                                                   <span>{type.label}</span>
                                               </div>
                                               {pendingFilterAssetTypes.includes(type.id) && <Check size={14} />}
                                           </button>
                                       ))}
                                   </div>
                               </div>
                           </div>

                           {/* Footer Actions */}
                           <div className="p-4 border-t border-gray-100 flex items-center gap-3 bg-gray-50 rounded-b-xl">
                               <button 
                                   onClick={clearPendingFilters}
                                   className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-200 rounded-md transition"
                               >
                                   Clear
                               </button>
                               <button 
                                   onClick={applyFilters}
                                   className="flex-1 px-4 py-2 text-sm font-bold text-white bg-black hover:bg-gray-800 rounded-md transition shadow-xs"
                               >
                                   Confirm
                               </button>
                           </div>
                        </div>
                     )}
                     {isFilterDropdownOpen && (
                        <div className="fixed inset-0 z-40" onClick={() => setIsFilterDropdownOpen(false)}></div>
                     )}
                     {isBrandFilterOpen && (
                        <div className="fixed inset-0 z-40" onClick={() => setIsBrandFilterOpen(false)}></div>
                     )}
                 </div>
             </div>

             {/* RIGHT GROUP: Sort + View Toggle */}
             <div className="flex items-center gap-4 shrink-0">
                {/* Sort Dropdown */}
                <div className="relative">
                   <button 
                      onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                      className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 transition px-4 py-2.5 rounded-md text-sm font-medium text-gray-700 focus:ring-2 focus:ring-black cursor-pointer min-w-[160px] justify-between"
                   >
                      <span className="text-gray-500 text-xs uppercase tracking-wider mr-1">Sort:</span>
                      <span className="font-bold text-gray-900">
                          {sortBy === 'newest' && 'Newest'}
                          {sortBy === 'expiring' && 'Ending Soon'}
                          {sortBy === 'expired_recent' && 'Recently Expired'}
                      </span>
                      <ChevronDown size={14} className="text-gray-400"/>
                   </button>
                   
                   {isSortDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95">
                         <button 
                            onClick={() => { setSortBy('newest'); setIsSortDropdownOpen(false); }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center justify-between group text-gray-700"
                         >
                            <span>Newest</span>
                            {sortBy === 'newest' && <Check size={14} className="text-black"/>}
                         </button>
                         <button 
                            onClick={() => { setSortBy('expiring'); setIsSortDropdownOpen(false); }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center justify-between group text-gray-700"
                         >
                            <span>Ending Soon</span>
                            {sortBy === 'expiring' && <Check size={14} className="text-black"/>}
                         </button>
                         <button 
                            onClick={() => { setSortBy('expired_recent'); setIsSortDropdownOpen(false); }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center justify-between group text-gray-700"
                         >
                            <span>Recently Expired</span>
                            {sortBy === 'expired_recent' && <Check size={14} className="text-black"/>}
                         </button>
                      </div>
                   )}
                   {isSortDropdownOpen && (
                      <div className="fixed inset-0 z-40" onClick={() => setIsSortDropdownOpen(false)}></div>
                   )}
                </div>
                
                <div className="h-4 w-px bg-gray-300"></div>

                <div className="flex bg-gray-100 rounded-md p-0.5">
                   <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-xs ${viewMode === 'grid' ? 'bg-white shadow-xs text-black' : 'text-gray-400 hover:text-black'}`}><LayoutGrid size={14}/></button>
                   <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-xs ${viewMode === 'list' ? 'bg-white shadow-xs text-black' : 'text-gray-400 hover:text-black'}`}><List size={14}/></button>
                </div>
             </div>
          </div>

          {/* Active Filters Row */}
          {(filterBrand !== 'all' || filterAssetTypes.length > 0 || filterUsage !== 'all') && (
              <div className="px-6 pb-3 flex items-center gap-2 animate-in slide-in-from-top-2">
                  {filterBrand !== 'all' && (
                      <div className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                          <span>Brand: {brands.find(b => b.id === filterBrand)?.name}</span>
                          <button onClick={() => setFilterBrand('all')} className="hover:text-gray-300"><X size={12}/></button>
                      </div>
                  )}
                  {filterUsage !== 'all' && (
                      <div className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                          <span>Usage: {filterUsage.charAt(0).toUpperCase() + filterUsage.slice(1)}</span>
                          <button onClick={() => setFilterUsage('all')} className="hover:text-gray-300"><X size={12}/></button>
                      </div>
                  )}
                  {filterAssetTypes.map(type => (
                      <div key={type} className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                          <span>Type: {type.charAt(0).toUpperCase() + type.slice(1)}</span>
                          <button onClick={() => toggleAssetTypeFilter(type)} className="hover:text-gray-300"><X size={12}/></button>
                      </div>
                  ))}
                  <button 
                      onClick={() => { setFilterBrand('all'); setFilterAssetTypes([]); setFilterUsage('all'); }}
                      className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline ml-2"
                  >
                      Clear All
                  </button>
              </div>
          )}
       </div>

       {/* Content Area */}
       <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Main Content Flow */}
          <section id="main-content">                          {filteredCampaigns.length === 0 ? (
                 /* Empty State */
                 <div className="flex flex-col items-center justify-center py-20 text-center">
                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                         <Search size={32} className="text-gray-400"/>
                     </div>
                     <h3 className="text-lg font-bold text-gray-900 mb-2">No campaigns found</h3>
                     <p className="text-gray-500 max-w-sm mb-6">
                         We couldn't find any campaigns matching your current filters. Try adjusting your search or clearing filters.
                     </p>
                     <button 
                         onClick={() => { setFilterBrand('all'); setFilterAssetTypes([]); setFilterUsage('all'); setSearchQuery(''); }}
                         className="px-6 py-2 bg-black text-white rounded-full text-sm font-bold hover:bg-gray-800 transition"
                     >
                         Clear All Filters
                     </button>
                 </div>
              ) : viewMode === 'grid' ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCampaigns.slice(0, currentPage * ITEMS_PER_PAGE).map(campaign => (
                       <div key={campaign.id} className="flex flex-col">
                          <CampaignCard 
                            campaign={campaign} 
                            brand={brands.find(b => b.id === campaign.brandId)}
                            templates={templates}
                            files={files}
                          />
                       </div>
                    ))}
                 </div>
              ) : (
                /* List View - Light Data Grid */
                <div className="bg-white rounded-lg overflow-hidden border border-gray-200 overflow-x-auto">
                   {/* Header Row */}
                     <div className="min-w-[1000px] grid grid-cols-[1fr_120px_160px_300px_140px_120px] w-full gap-4 px-6 py-3 border-b border-gray-100 text-xs font-medium text-gray-400 uppercase tracking-wider">
                       <div className="whitespace-nowrap min-w-72">Campaign Info</div>
                       <div className="whitespace-nowrap hidden md:block">Status</div>
                       <div className="whitespace-nowrap hidden lg:block">Brand</div>
                       <div className="whitespace-nowrap hidden sm:block">Assets & Usage</div>
                       <div className="text-left whitespace-nowrap hidden xl:block">Ends On</div>
                       <div className="whitespace-nowrap hidden 2xl:block">Last Updated</div>
                    </div>

                   {/* Data Rows */}
                    <div className="divide-y divide-gray-50">
                       {filteredCampaigns.slice(0, currentPage * ITEMS_PER_PAGE).map(campaign => {
                          const brand = brands.find(b => b.id === campaign.brandId);
                         
                         // Calculate Assets
                         const linkedTemplates = templates.filter(t => campaign.templates?.includes(t.id));
                         const linkedAssets = files.filter(f => campaign.assets?.includes(f.id));
                         const socialTemplates = linkedTemplates.filter(t => t.type === 'social');
                         const platforms = [...new Set(socialTemplates.flatMap(t => t.platforms || []))];
                         const hasEmail = linkedTemplates.some(t => t.type === 'email');
                         const hasSMS = linkedTemplates.some(t => t.type === 'sms');
                         const hasFiles = linkedAssets.length > 0;

                          // Expiration Logic
                          const getExpiration = () => {
                             // Override if status is explicitly Ended/Archived
      if (campaign.status === 'Ended' || campaign.status === 'Archived') {
         return { isExpired: true, isExpiring: false, label: `${campaign.endDate}`, color: 'text-gray-400', icon: <Lock size={14} /> };
      }

      if (campaign.endDate === 'Permanent') return { isExpired: false, isExpiring: false, label: 'No Expiration', color: 'text-green-600', icon: <span className="text-lg leading-none">∞</span> };
                             const end = new Date(campaign.endDate);
                             const now = new Date('2025-11-26');
                             const diffTime = end - now;
                             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                             
                             if (diffDays <= 0) return { label: campaign.endDate, color: 'text-gray-400', isExpired: true };
                             if (diffDays <= 1) return { label: 'Ends Today', color: 'text-red-600', icon: <Flame size={12} className="fill-red-600"/>, isExpiring: true };
                             if (diffDays <= 7) return { label: `${diffDays} Days Left`, color: 'text-amber-600', isExpiring: true };
                             return { label: campaign.endDate, color: 'text-gray-500' };
                          };
                          const expiration = getExpiration();

                          // Usage Logic
                          const usage = campaign.retailerUsage || {};

                          // New & Blue Dot Logic
                          const now = new Date('2025-11-26');
                          const start = new Date(campaign.startDate);
                          const lastUpdated = campaign.lastUpdated ? new Date(campaign.lastUpdated) : null;
                          const isNew = (now - start) / (1000 * 60 * 60 * 24) <= 3;
                           const isUpdated = !isNew && lastUpdated && (now - lastUpdated) / (1000 * 60 * 60) <= 48;

                          return (
                             <div key={campaign.id} className="min-w-[1000px] grid grid-cols-[1fr_120px_160px_300px_140px_120px] w-full gap-4 px-6 py-4 items-start hover:bg-gray-50 transition group cursor-pointer">
                                {/* Campaign Info */}
                                <div className="flex items-start gap-4 min-w-72 pr-4">
                                   <div 
                                      className={`w-16 h-9 rounded-sm shrink-0 bg-cover bg-center shadow-xs mt-1 bg-gray-100 ${campaign.coverImage && typeof campaign.coverImage === 'string' && campaign.coverImage.startsWith('http') ? '' : campaign.cover}`}
                                      style={campaign.coverImage ? { backgroundImage: `url(${campaign.coverImage})` } : {}}
                                   ></div>
                                    <div className="min-w-0 flex-1">
                                       <Tooltip content={campaign.title}>
                                            <h3 className="font-bold text-gray-900 leading-tight line-clamp-2 text-ellipsis group-hover:text-[#C5A065] transition">
                                                {isNew && (
                                                   <span className="inline-flex items-center justify-center align-middle mr-1.5 relative overflow-hidden bg-linear-to-r from-amber-200 to-yellow-400 text-yellow-900 text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-xs uppercase tracking-wider border border-yellow-300">
                                                       <span className="relative z-10">New</span>
                                                       <div className="absolute inset-0 bg-white/40 skew-x-12 animate-[shimmer_2s_infinite] -translate-x-full"></div>
                                                   </span>
                                                )}
                                                {isUpdated && (
                                                   <span className="inline-flex items-center justify-center align-middle mr-1.5 relative overflow-hidden bg-linear-to-r from-blue-500 to-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-xs uppercase tracking-wider border border-blue-400">
                                                       <span className="relative z-10">Updated</span>
                                                       <div className="absolute inset-0 bg-white/20 skew-x-12 animate-[shimmer_2s_infinite] -translate-x-full"></div>
                                                   </span>
                                                )}
                                                <span className="align-middle">{campaign.title}</span>
                                            </h3>
                                       </Tooltip>
                                      <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{campaign.description}</p>
                                   </div>
                                    {campaign.isPinned && (
                                       <Pin size={14} className="fill-black shrink-0 mt-1" />
                                    )}
                                </div>


                                {/* Status Column */}
                                <div className="self-center">
                                {/* Status Column */}
                                <div className="hidden md:block">
                                   {expiration.isExpired ? (
                                       <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold bg-gray-100 text-gray-500">
                                           Expired
                                       </span>
                                   ) : expiration.isExpiring ? (
                                       <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold bg-amber-100 text-amber-700">
                                           Expiring Soon
                                       </span>
                                   ) : (
                                       <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold bg-green-100 text-green-700">
                                           Active
                                       </span>
                                   )}
                                </div>
                                </div>

                                {/* Brand (Logo + Name with Tooltip) */}
                                <div className="hidden lg:flex items-center gap-2 group/brand relative cursor-help min-w-0 self-center">
                                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 overflow-hidden ${brand?.logo?.startsWith('bg-') ? `${brand.logo} text-white` : 'bg-white'}`}>
                                      {brand?.logo?.startsWith('bg-') ? (
                                         brand?.name?.substring(0,1)
                                      ) : (
                                         <img src={brand?.logo} alt={brand?.name} className="w-full h-full object-cover" />
                                      )}
                                   </div>
                                   <span className="text-xs font-medium text-gray-900 truncate">{brand?.name}</span>
                                   {/* Tooltip */}
                                   <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-sm opacity-0 group-hover/brand:opacity-100 transition pointer-events-none whitespace-nowrap z-50 shadow-lg">
                                      {brand?.name}
                                   </div>
                                </div>

                                {/* Assets & Usage (Merged) */}
                                <div className="hidden sm:flex items-center gap-1.5 flex-wrap self-center">
                                   {/* Social Platforms */}
                                   {platforms.map(p => {
                                       const isUsed = usage.social;
                                       const count = socialTemplates.filter(t => t.platforms?.includes(p)).length;
                                       return (
                                           <div key={p} className="relative group/icon cursor-help">
                                               <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isUsed ? 'bg-white border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                                                   {getPlatformIcon(p)}
                                               </div>
                                               {isUsed && (
                                                   <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                       <Check size={8} className="text-white" strokeWidth={4} />
                                                   </div>
                                               )}
                                               {/* Tooltip */}
                                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-sm opacity-0 group-hover/icon:opacity-100 transition pointer-events-none whitespace-nowrap z-30 shadow-lg">
                                                   <div>{count} posts available.</div>
                                                   {isUsed && <div className="text-green-300 font-medium">Used 1 time.</div>}
                                               </div>
                                           </div>
                                       );
                                   })}
                                   
                                   {/* Email */}
                                   {hasEmail && (
                                       <div className="relative group/icon cursor-help">
                                           <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${usage.email ? 'bg-white border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                                               <Mail size={14} className={usage.email ? 'text-green-600' : 'text-blue-600'}/>
                                           </div>
                                           {usage.email && (
                                               <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                   <Check size={8} className="text-white" strokeWidth={4} />
                                               </div>
                                           )}
                                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-sm opacity-0 group-hover/icon:opacity-100 transition pointer-events-none whitespace-nowrap z-30 shadow-lg">
                                               <div>{linkedTemplates.filter(t => t.type === 'email').length} emails available.</div>
                                               {usage.email && <div className="text-green-300 font-medium">Used 1 time.</div>}
                                           </div>
                                       </div>
                                   )}

                                   {/* SMS */}
                                   {hasSMS && (
                                       <div className="relative group/icon cursor-help">
                                           <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${usage.sms ? 'bg-white border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                                               <MessageSquare size={14} className={usage.sms ? 'text-green-600' : 'text-purple-600'}/>
                                           </div>
                                           {usage.sms && (
                                               <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                   <Check size={8} className="text-white" strokeWidth={4} />
                                               </div>
                                           )}
                                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-sm opacity-0 group-hover/icon:opacity-100 transition pointer-events-none whitespace-nowrap z-30 shadow-lg">
                                               <div>{linkedTemplates.filter(t => t.type === 'sms').length} messages available.</div>
                                               {usage.sms && <div className="text-green-300 font-medium">Used 1 time.</div>}
                                           </div>
                                       </div>
                                   )}

                                   {/* Downloads */}
                                   {hasFiles && (
                                       <div className="relative group/icon cursor-help">
                                           <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${usage.download ? 'bg-white border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                                               <Download size={14} className={usage.download ? 'text-green-600' : 'text-gray-600'}/>
                                           </div>
                                           {usage.download && (
                                               <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                   <Check size={8} className="text-white" strokeWidth={4} />
                                               </div>
                                           )}
                                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-sm opacity-0 group-hover/icon:opacity-100 transition pointer-events-none whitespace-nowrap z-30 shadow-lg">
                                               <div>{linkedAssets.length} files available.</div>
                                               {usage.download && <div className="text-green-300 font-medium">Used 1 time.</div>}
                                           </div>
                                       </div>
                                   )}
                                </div>

                                {/* Ends On (Left Aligned) */}
                                <div className="hidden xl:flex text-left items-center justify-start gap-2 min-w-0 self-center">
                                   <div className={`text-sm font-normal whitespace-nowrap ${expiration.color} flex items-center gap-1`}>
                                      {expiration.icon}
                                      {expiration.label}
                                   </div>
                                </div>

                                {/* Last Updated */}
                                <div className="hidden 2xl:block text-sm text-gray-500 font-normal whitespace-nowrap self-center">
                                    {campaign.lastUpdated ? new Date(campaign.lastUpdated).toLocaleDateString('en-CA') : '--'}
                                </div>
                            </div>
                         );
                      })}
                   </div>
                </div>
             )}
          </section>

           {/* Footer: Pagination */}
           {filteredCampaigns.length > 0 && (
               <div className="flex justify-center pt-8 pb-4">
                   {filteredCampaigns.length > currentPage * ITEMS_PER_PAGE ? (
                       <button 
                           onClick={() => setCurrentPage(prev => prev + 1)}
                           className="px-6 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-black transition shadow-xs"
                       >
                           Load More
                       </button>
                   ) : (
                       <p className="text-sm text-gray-400">You've reached the end of the list.</p>
                   )}
               </div>
           )}
       </div>
    </div>
  );
};

export default AllCampaigns;
