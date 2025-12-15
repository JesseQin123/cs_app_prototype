import React, { useState } from 'react';
import { ArrowRight, Bell, AlertTriangle, FileText, TrendingUp, Search, Star, ChevronDown, Check } from 'lucide-react';

const PartnerBrands = ({ brands, onSelectBrand }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest'); // 'latest', 'engagement_high', 'engagement_low', 'starred', 'az'
  const [starredBrands, setStarredBrands] = useState(
    brands.filter(b => b.isStarred).map(b => b.id)
  );
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const toggleStar = (e, brandId) => {
    e.stopPropagation();
    setStarredBrands(prev => 
      prev.includes(brandId) ? prev.filter(id => id !== brandId) : [...prev, brandId]
    );
  };

  // Filter & Sort Logic
  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    // Always prioritize starred brands
    const isAStarred = starredBrands.includes(a.id);
    const isBStarred = starredBrands.includes(b.id);
    if (isAStarred && !isBStarred) return -1;
    if (!isAStarred && isBStarred) return 1;

    // Then apply selected sort
    if (sortBy === 'engagement_high') return b.engagement - a.engagement;
    if (sortBy === 'engagement_low') return a.engagement - b.engagement;
    if (sortBy === 'az') return a.name.localeCompare(b.name);
    if (sortBy === 'starred') return 0; // Already handled by priority
    // Default 'latest' (mock logic: ID based or random for now, let's use engagement as proxy for activity)
    return 0; 
  });

  const sortOptions = [
     { id: 'latest', label: 'Latest Activity' },
     { id: 'engagement_high', label: 'Highest Engagement' },
     { id: 'engagement_low', label: 'Lowest Engagement' },
     { id: 'starred', label: 'Starred First' },
     { id: 'az', label: 'A-Z' }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Sticky Header: Search & Sort */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-xs transition-all">
         <div className="px-6 py-4 flex items-center justify-between gap-4">
            {/* Left: Search */}
            <div className="relative flex-1 max-w-md">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
               <input 
                 type="text"
                 placeholder="Search Brand Name..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5 focus:border-black transition"
               />
            </div>

            {/* Right: Sort Dropdown */}
            <div className="flex items-center gap-2">
               <span className="text-sm text-gray-500">Sort by:</span>
               <div className="relative">
                  <button 
                     onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                     className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 transition px-4 py-2 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-black cursor-pointer min-w-[180px] justify-between"
                  >
                     <span>{sortOptions.find(o => o.id === sortBy)?.label}</span>
                     <ChevronDown size={14} className="text-gray-500"/>
                  </button>
                  
                  {isSortDropdownOpen && (
                     <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95">
                        {sortOptions.map(opt => (
                           <button 
                              key={opt.id}
                              onClick={() => { setSortBy(opt.id); setIsSortDropdownOpen(false); }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center justify-between group text-gray-700"
                           >
                              <span>{opt.label}</span>
                              {sortBy === opt.id && <Check size={14} className="text-black"/>}
                           </button>
                        ))}
                     </div>
                  )}
                  {isSortDropdownOpen && (
                     <div className="fixed inset-0 z-40" onClick={() => setIsSortDropdownOpen(false)}></div>
                  )}
               </div>
            </div>
         </div>
      </div>

      <div className="p-6 pb-20 overflow-y-auto">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredBrands.map(brand => {
             const isStarred = starredBrands.includes(brand.id);
             return (
               <div 
                 key={brand.id} 
                 className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col relative"
                 onClick={() => onSelectBrand(brand)}
               >
                 {/* Star Button (Visible on Hover OR if Starred) */}
                 <button 
                    onClick={(e) => toggleStar(e, brand.id)}
                    className={`absolute top-3 right-3 z-20 p-2 rounded-full transition ${isStarred ? 'bg-white/90 text-yellow-400 opacity-100' : 'bg-white/20 text-white opacity-0 group-hover:opacity-100 hover:bg-white/40'}`}
                 >
                    <Star size={18} className={isStarred ? "fill-yellow-400" : ""} />
                 </button>
   
                 {/* Hero Section */}
                 <div 
                    className={`h-32 relative p-6 flex items-end ${brand.heroImage?.startsWith('bg-') ? brand.heroImage : 'bg-cover bg-center bg-no-repeat'}`}
                    style={!brand.heroImage?.startsWith('bg-') ? { backgroundImage: `url(${brand.heroImage})` } : {}}
                 >
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition"></div>
                    
                    {/* Logo */}
                    <div className={`w-16 h-16 rounded-full border-4 border-white shadow-md flex items-center justify-center text-xl font-bold absolute bottom-[-20px] left-6 z-10 overflow-hidden ${brand.logo?.startsWith('bg-') ? brand.logo : 'bg-white'}`}>
                       {brand.logo?.startsWith('bg-') ? (
                          brand.name.substring(0,1)
                       ) : (
                          <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" />
                       )}
                    </div>
                 </div>
   
                 {/* Content Section */}
                 <div className="pt-8 px-6 pb-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#C5A065] transition">{brand.name}</h3>
                          <p className="text-xs text-gray-500">{brand.campaigns} Campaigns • {brand.catalogs} Resources</p>
                       </div>
                       {/* Engagement Score */}
                       <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                             <TrendingUp size={12} />
                             {brand.engagement}%
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1">Engagement</span>
                       </div>
                    </div>
   
                    {/* Status Indicators */}
                    <div className="space-y-2 mb-6 flex-1">
                       {brand.unreadCampaigns > 0 && (
                          <div className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                             <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                             {brand.unreadCampaigns} New Campaigns
                          </div>
                       )}
                       {brand.expiringCampaigns > 0 && (
                          <div className="flex items-center gap-2 text-xs font-medium text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                             <AlertTriangle size={12} />
                             {brand.expiringCampaigns} Expiring Soon
                          </div>
                       )}
                       {brand.newResources > 0 && (
                          <div className="flex items-center gap-2 text-xs font-medium text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
                             <FileText size={12} />
                             {brand.newResources} New Resources
                          </div>
                       )}
                       {brand.unreadCampaigns === 0 && brand.expiringCampaigns === 0 && brand.newResources === 0 && (
                          <div className="text-xs text-gray-400 italic py-2">No new updates</div>
                       )}
                    </div>
   
                    {/* CTA (Icon Only) */}
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-end text-gray-400 group-hover:text-[#C5A065] transition">
                       <ArrowRight size={20} className="transform group-hover:translate-x-1 transition" />
                    </div>
                 </div>
               </div>
             );
           })}
         </div>
      </div>
    </div>
  );
};

export default PartnerBrands;
