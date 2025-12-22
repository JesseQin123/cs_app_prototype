import React, { useState, useEffect, useRef, useMemo } from 'react';
import { campaignData } from '../../../../../data/mockStore/campaignStore';
import { Search, Filter, ArrowUpRight, CheckCircle2, AlertCircle, Clock, MoreHorizontal, Mail, MessageSquare, Download, Instagram, Facebook, Twitter, Smartphone, Eye, XCircle, RefreshCw, TrendingUp, ChevronRight, X, Award, ChevronDown, Check, FileText, Video, ChevronLeft, User, Bell, Share2, Printer, Info, Flag } from 'lucide-react'; 
import Drawer from '../../../../../components/Drawer';
import { useToast } from '../../../../context/ToastContext';
import NudgeModal, { RISKS } from '../../NudgeModal';
import Tooltip from '../../../../../components/Tooltip';

// Helper to render usage icons (Aligned with BrandCampaignList)
const UsageIcons = ({ usage }) => {
  if (!usage || (Array.isArray(usage) && usage.length === 0) || (typeof usage === 'object' && !usage.social && !usage.email && !usage.downloads)) return <span className="text-gray-300 text-xs">-</span>;

  // Normalize usage object to array logic for visual rendering if needed, 
  // or handle the specific 'usage' object structure from campaignStore.
  // The store usage structure for 'good'/'avg' scenarios is currently mixed in my analysis (array vs boolean flags).
  // Let's standardize on the array format from BrandCampaignList for display consistency: ['instagram', 'email'] etc.
  // OR handle the object { social: true, email: true } -> ['instagram', 'facebook', 'email'] mock.
  
  // Quick Adapter:
  let items = [];
  if (Array.isArray(usage)) {
      items = usage;
  } else if (typeof usage === 'object') {
      if (usage.social) items.push(['instagram', 'facebook']); // Mock social group
      if (usage.email) items.push('email');
      if (usage.downloads) items.push('downloadable');
  }

  const getIcon = (type) => {
    switch(type) {
      case 'instagram': return <Instagram size={12} />;
      case 'facebook': return <Facebook size={12} />;
      case 'twitter': return <Twitter size={12} />;
      case 'email': return <Mail size={12} />;
      case 'sms': return <MessageSquare size={12} />;
      case 'downloadable': return <Download size={12} />;
      case 'print': return <Printer size={12} />;
      default: return <FileText size={12} />;
    }
  };

  const getStyle = (type) => {
     switch(type) {
        case 'email': return 'bg-blue-50 text-blue-600';
        case 'sms': return 'bg-purple-50 text-purple-600';
        case 'downloadable': return 'bg-gray-100 text-gray-600';
        case 'print': return 'bg-orange-50 text-orange-600'; 
        default: return 'bg-gray-100 text-gray-600'; // Fallback
     }
  };

  return (
    <div className="flex items-center gap-1.5">
      {items.map((item, idx) => {
         if (Array.isArray(item)) {
             // Social Group
             return (
                 <div key={idx} className="flex items-center -space-x-1.5">
                    {item.map((sub, sIdx) => (
                        <div key={sIdx} className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center text-pink-600 shadow-xs z-10 relative">
                            {getIcon(sub)}
                        </div>
                    ))}
                 </div>
             );
         }
         return (
             <div key={idx} className={`w-6 h-6 rounded-full flex items-center justify-center ${getStyle(item)}`}>
                 {getIcon(item)}
             </div>
         );
      })}
    </div>
  );
};

// Custom Dropdown Component (Consistent with RetailerList)
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

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6">
      <div className="flex items-center justify-between w-full">
        <div className="text-sm text-gray-700">
          Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1 text-gray-500 rounded-sm hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1 text-gray-500 rounded-sm hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};


const RetailerAdoptionTab = ({ campaign }) => {
  // 1. Data Source Resolution
  // adoptionId can be 'good', 'avg', 'poor'
  const adoptionData = campaignData.adoptionMap[campaign.adoptionId] || campaignData.adoptionMap.avg;
  const retailers = adoptionData.list || [];

  // --- State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all'); 
  const [statusFilter, setStatusFilter] = useState('all'); 
  const [filterZone, setFilterZone] = useState('All'); // Added back
  
  const [isTierOpen, setIsTierOpen] = useState(false); // For Click Trigger
  const [isStatusOpen, setIsStatusOpen] = useState(false); // For Click Trigger
  const [isZoneOpen, setIsZoneOpen] = useState(false); // For Click Trigger
  
  const [showNudgeModal, setShowNudgeModal] = useState(false);
  // nudgeMessage removed as it is handled internally by NudgeModal
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [nudgeTarget, setNudgeTarget] = useState(null);
  const [drawerTab, setDrawerTab] = useState('usage'); // 'usage' | 'timeline'

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('10:45 AM');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- Data Simplification (Single Source of Truth) ---
  // Transforms the raw retailer list based on the store configuration (data.list)
  // No internal random generation allowed.
  const campaignRetailers = useMemo(() => {
    if (!retailers || retailers.length === 0) return [];

    // Helper: Map retailer ID to specific store configuration
    const overrideMap = new Map();
    if (adoptionData && adoptionData.list) {
        adoptionData.list.forEach(item => {
            overrideMap.set(item.id, item);
        });
    }

    return retailers.map((r) => {
      // 1. Get base info from global retailer list
      // Ensure zone/tier exists (App.jsx providers usually mock this, but providing safe defaults if missing)
      const zone = r.location?.zone || r.zone || 'Central';
      const tier = r.tier || 'Standard';

      // 2. Determine Status from Store Config
      // Default to 'Unopened' if no specific data exists in the store for this campaign
      let status = 'Unopened';
      let lastActiveOverride = null;

      if (overrideMap.has(r.id)) {
          const override = overrideMap.get(r.id);
          status = override.status || 'Unopened';
          lastActiveOverride = override.lastActive;
      } else if (adoptionData?.defaultStatus) {
           // Allow store to set a default status for the bulk (e.g. 'Viewed') if needed
           status = adoptionData.defaultStatus;
      }

      // 3. Derive metrics based on decided status (Deterministic)
      const isParticipating = status === 'Participated';
      const isViewed = status === 'Viewed';

      const adoptionRate = isParticipating ? 100 : 0; 
      // Use store 'actions' if available, otherwise default to a realistic number (e.g. 3) for participants
      const totalActions = isParticipating ? (overrideMap.get(r.id)?.actions || 3) : (isViewed ? 1 : 0);
      
      const usage = overrideMap.get(r.id)?.usage || [];

      return {
        ...r,
        tier,
        zone, 
        location: { ...r.location, zone },
        campaignStatus: status,
        adoptionRate,
        totalActions,
        estReach: isParticipating ? (overrideMap.get(r.id)?.estReach || 1500) : 0,
        lastActive: lastActiveOverride || (status !== 'Unopened' ? 'Recently' : null),
        usage,
        impact: overrideMap.get(r.id)?.impact || '-'
      };
    }).filter(Boolean);
  }, [retailers, adoptionData]);

  // --- Derived Metrics ---
  const totalInvited = campaignRetailers.length;
  const participatedCount = campaignRetailers.filter(r => r.campaignStatus === 'Participated').length;
  const adoptionRate = totalInvited > 0 ? Math.round((participatedCount / totalInvited) * 100) : 0;
  
  // Zero-Action: Status is Unopened OR (Viewed with 0 actions)
  // For Camp-0 scenario: 
  // 1 Unopened -> Zero Action.
  // 3 Viewed -> Usually have 1 action (Viewed). So they are NOT Zero-Action, but they are Needs Attention (Viewed but didn't participate).
  // Check PRD/User request: "Zero-Action: 显示1，表述有一个Retailer没有行动". "Needs Attention: 需要mock 4个Retailer". 
  // Needs Attention typically = Unopened + Viewed (but not participated). 1 + 3 = 4. Checks out.
  const zeroActionCount = campaignRetailers.filter(r => r.campaignStatus === 'Unopened' || (r.campaignStatus === 'Viewed' && r.totalActions === 0)).length;
  
  // Metrics for KPI Cards
  const participatingRetailers = campaignRetailers.filter(r => r.campaignStatus === 'Participated');
  const participatingCountFromList = participatingRetailers.length; // distinct from participatedCount defined above? No, same logic.

  // Avg Reach / Partner (Participants only)
  // Logic: Sum of estReach of participants / count
  const totalParticipatingReach = participatingRetailers.reduce((acc, r) => acc + r.estReach, 0); 
  const avgReachPerPartner = participatingCountFromList > 0 
      ? (totalParticipatingReach / participatingCountFromList) 
      : 0;
  // Format: 1200 -> 1.2K
  const formattedAvgReach = avgReachPerPartner >= 1000 
      ? (avgReachPerPartner / 1000).toFixed(1) + 'K' 
      : Math.round(avgReachPerPartner);

  // Avg Actions / Partner (Participants only)
  const totalParticipatingActions = participatingRetailers.reduce((acc, r) => acc + r.totalActions, 0);
  const avgActionsPerPartner = participatingCountFromList > 0 
      ? (totalParticipatingActions / participatingCountFromList).toFixed(1) 
      : 0;


  // Needs Attention List
  // Logic: Platinum/Gold + Unopened/Viewed. 
  // To meet user request "Needs Attention: mock 4个Retailer", we simply filter all Unopened/Viewed for the demo campaign to ensure they show up, regardless of Tier (or ensure those 4 get high tiers).
  // Let's broaden the logic for the specific scenario to ensure they appear.
  const needsAttentionList = campaignRetailers
    .filter(r => {
        // Business Rule: High value retailers (Platinum/Gold) who haven't adopted yet
        return (r.tier === 'Platinum' || r.tier === 'Gold') && (r.campaignStatus === 'Unopened' || r.campaignStatus === 'Viewed');
    })
    .sort((a, b) => {
      // Sort by status (Unopened first) then Tier
      if (a.campaignStatus !== b.campaignStatus) return a.campaignStatus === 'Unopened' ? -1 : 1;
      const tierWeight = { 'Platinum': 2, 'Gold': 1, 'Silver': 0, 'Standard': 0 };
      return tierWeight[b.tier] - tierWeight[a.tier];
    });

  // Top Advocates
  const topAdvocatesList = campaignRetailers
    .filter(r => r.campaignStatus === 'Participated')
    .sort((a, b) => b.totalActions - a.totalActions)
    .slice(0, 5);

  // Filtered List for Table
  const filteredList = campaignRetailers.filter(retailer => {
    const matchesSearch = retailer.name?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // 2. Status Filter
    if (statusFilter !== 'all' && retailer.campaignStatus.toLowerCase() !== statusFilter.toLowerCase()) return false;
    
    // 3. Tier Filter 
    if (tierFilter !== 'all' && retailer.tier !== tierFilter) return false;

    // 4. Zone Filter
    if (filterZone !== 'All' && retailer.zone !== filterZone) return false;

    return true;
  });  

  // Pagination Logic
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // --- Handlers ---
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
  };

  const { addToast } = useToast();

  const handleClearFilters = () => {
    setStatusFilter('all');
    setTierFilter('all');
    setFilterZone('All');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleNudgeAll = () => {
    setNudgeTarget(null); // Ensure bulk mode
    setShowNudgeModal(true);
  };

  const handleNudgeSingle = (retailer, e) => {
      if(e) e.stopPropagation();
      setNudgeTarget(retailer);
      setShowNudgeModal(true);
  };

  const handleSendNudge = (data) => {
    // Mock API call
    console.log(`Sending nudge:`, data);
    setShowNudgeModal(false);
    addToast('Reminder sent successfully!', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* --- 1. Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-lg font-bold text-gray-900">Retailer Performance</h2>
        </div>
        <div className="flex items-center gap-3">
          {campaign.status === 'Active' ? (
              <Tooltip content="Auto-refreshes every 30 minutes">
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[11px] font-bold text-emerald-700 shadow-xs cursor-help">
                    <div className="relative flex items-center justify-center w-2 h-2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600"></span>
                    </div>
                    Live Data
                  </div>
              </Tooltip>
          ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 border border-gray-200 rounded-full text-[11px] font-bold text-gray-600 shadow-xs">
                <Flag size={12} className="fill-gray-500 text-gray-500" />
                Final Results
              </div>
          )}
          

        </div>
      </div>

      {/* --- 2. Adoption Summary (Compact KPI Cards) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Participation Progress */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between h-28 relative group hover:shadow-md transition duration-200">
           <div className="flex items-start justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                  PARTICIPATION PROGRESS
                  <Tooltip content="Percentage of invited retailers who have performed at least one action (download or execute activity).">
                      <Info size={12} className="text-gray-300 hover:text-gray-500 transition"/>
                  </Tooltip>
              </span>
           </div>
           <div>
               <div className="text-3xl font-bold text-gray-900 leading-none mb-1">{adoptionRate}%</div>
               <div className="text-[11px] font-medium text-gray-400">% of invited retailers</div>
           </div>
        </div>

        {/* Card 2: Zero Action (Action Card) */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between h-28 relative group hover:shadow-md transition duration-200">
           <div className="flex items-start justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  ZERO ACTION
                  <Tooltip content="Count of invited retailers who have not downloaded assets or executed any marketing activities yet.">
                      <Info size={12} className="text-gray-300 hover:text-gray-500 transition"/>
                  </Tooltip>
              </span>
           </div>
           <div>
               <div className="text-3xl font-bold text-orange-500 leading-none mb-1">{zeroActionCount}</div>
               <div className="text-[11px] font-medium text-gray-400">Retailers yet to engage</div>
           </div>
        </div>

        {/* Card 3: Avg. Reach / Partner */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between h-28 relative group hover:shadow-md transition duration-200">
           <div className="flex items-start justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  AVG. REACH / PARTNER
                  <Tooltip content="Average estimated reach generated per participating retailer.">
                      <Info size={12} className="text-gray-300 hover:text-gray-500 transition"/>
                  </Tooltip>
              </span>
           </div>
           <div>
               <div className="text-3xl font-bold text-gray-900 leading-none mb-1">{formattedAvgReach}</div>
               <div className="text-[11px] font-medium text-gray-400">Est. opens & impressions</div>
           </div>
        </div>

        {/* Card 4: Avg. Usage / Partner */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between h-28 relative group hover:shadow-md transition duration-200">
           <div className="flex items-start justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  AVG. USAGE / PARTNER
                  <Tooltip content="Average number of assets downloaded and marketing activities executed per participating retailer.">
                      <Info size={12} className="text-gray-300 hover:text-gray-500 transition"/>
                  </Tooltip>
              </span>
           </div>
           <div>
               <div className="text-3xl font-bold text-gray-900 leading-none mb-1">{avgActionsPerPartner}</div>
               <div className="text-[11px] font-medium text-gray-400">Downloads & activities</div>
           </div>
        </div>
      </div>

      {/* --- 3. Engagement Status (Red/Black Lists) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Needs Attention */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col h-full">
          <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-amber-50/50 to-white flex justify-between items-center">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <AlertCircle size={18} className="text-amber-500" />
              Needs Attention
              {needsAttentionList.length > 0 && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">{needsAttentionList.length}</span>}
            </h3>
            {needsAttentionList.length > 0 && (
              <button 
                onClick={handleNudgeAll}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition shadow-xs"
              >
                <Bell size={12} className="fill-amber-700" />
                Nudge All ({needsAttentionList.length})
              </button>
            )}
          </div>
          <div className="p-4 flex-1">
            {needsAttentionList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm py-8">
                <CheckCircle2 size={32} className="mb-2 text-emerald-100" />
                <p>All key retailers are active!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {needsAttentionList.slice(0, 5).map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition group">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${r.logo || 'bg-gray-200'} flex items-center justify-center text-xs font-bold text-white`}>
                        {r.name?.substring(0, 2).toUpperCase() || 'NA'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{r.name}</div>
                        <div className="text-xs text-gray-500">{r.tier}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        r.campaignStatus === 'Unopened' ? 'bg-gray-100 text-gray-500' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {r.campaignStatus}
                      </span>
                      <button 
                        onClick={(e) => handleNudgeSingle(r, e)}
                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-full transition opacity-0 group-hover:opacity-100"
                        title="Send Reminder"
                      >
                        <Bell size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {needsAttentionList.length > 5 && (
                  <div className="text-center pt-2">
                    <button className="text-xs text-gray-500 hover:text-black">View {needsAttentionList.length - 5} more</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Top Advocates */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col h-full">
          <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-emerald-50/50 to-white flex justify-between items-center">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Award size={18} className="text-emerald-500" />
              Top Advocates
            </h3>
          </div>
          <div className="p-4 flex-1">
            {topAdvocatesList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm py-8">
                    <p>No activity yet.</p>
                </div>
            ) : (
                <div className="space-y-2">
                {topAdvocatesList.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 text-xs font-bold text-gray-400">#{i + 1}</div>
                        <div className={`w-8 h-8 rounded-full ${r.logo || 'bg-gray-200'} flex items-center justify-center text-xs font-bold text-white`}>
                        {r.name?.substring(0, 2).toUpperCase() || 'NA'}
                        </div>
                        <div>
                        <div className="text-sm font-medium text-gray-900">{r.name}</div>
                        <div className="text-xs text-gray-500">{r.totalActions} Actions</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">{(r.estReach / 1000).toFixed(1)}k</div>
                        <div className="text-[10px] text-gray-400 uppercase">Reach</div>
                    </div>
                    </div>
                ))}
                </div>
            )}
          </div>
        </div>
      </div>

      {/* --- 4. Retailer Activity Table --- */}
      <div>
        {/* Section Title moved OUT of the table card [Request 1] */}
        <h3 className="text-lg font-bold text-gray-900 mb-4">All Retailer Activity</h3>

        <div className="bg-white rounded-xl border border-gray-200 shadow-xs">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex flex-col xl:flex-row gap-4 justify-between items-center z-20 relative">
              <div className="flex items-center gap-2 w-full xl:w-auto overflow-visible flex-wrap">
                 
                 {/* 1. Tier Filter */}
                 <div className="relative">
                     <button 
                        onClick={() => { setIsTierOpen(!isTierOpen); setIsStatusOpen(false); setIsZoneOpen(false); }}
                        className={`flex items-center gap-2 px-3 py-2 bg-white border ${tierFilter !== 'all' ? 'border-black text-black' : 'border-gray-200 text-gray-700'} rounded-lg hover:bg-gray-50 transition shadow-xs text-sm font-medium`}
                     >
                        <Filter size={14} className={tierFilter !== 'all' ? "text-black" : "text-gray-400"}/>
                        <span>{tierFilter === 'all' ? 'All Tiers' : tierFilter}</span>
                        <ChevronDown size={14} className="text-gray-400" />
                     </button>
                     {isTierOpen && (
                         <>
                         <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsTierOpen(false)}></div>
                         <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95">
                            {['All Tiers', 'Platinum', 'Gold', 'Silver'].map(t => (
                            <button 
                                key={t}
                                onClick={() => { setTierFilter(t === 'All Tiers' ? 'all' : t); setIsTierOpen(false); }}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center justify-between group ${tierFilter === (t === 'All Tiers' ? 'all' : t) ? 'font-bold text-black bg-gray-50' : 'text-gray-600'}`}
                            >
                                {t}
                                {tierFilter === (t === 'All Tiers' ? 'all' : t) && <Check size={14} />}
                            </button>
                            ))}
                         </div>
                         </>
                     )}
                 </div>

                 {/* 2. Zone Filter */}
                 <div className="relative">
                     <button 
                        onClick={() => { setIsZoneOpen(!isZoneOpen); setIsTierOpen(false); setIsStatusOpen(false); }}
                        className={`flex items-center gap-2 px-3 py-2 bg-white border ${filterZone !== 'All' ? 'border-black text-black' : 'border-gray-200 text-gray-700'} rounded-lg hover:bg-gray-50 transition shadow-xs text-sm font-medium`}
                     >
                        <span>{filterZone === 'All' ? 'Sales Zones' : filterZone}</span>
                        <ChevronDown size={14} className="text-gray-400" />
                     </button>
                     {isZoneOpen && (
                         <>
                         <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsZoneOpen(false)}></div>
                         <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 max-h-60 overflow-y-auto">
                            {['All', 'North', 'South', 'East', 'West', 'Central', 'Europe', 'Asia'].map(z => (
                            <button 
                                key={z}
                                onClick={() => { setFilterZone(z); setIsZoneOpen(false); }}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center justify-between group ${filterZone === z ? 'font-bold text-black bg-gray-50' : 'text-gray-600'}`}
                            >
                                {z}
                                {filterZone === z && <Check size={14} />}
                            </button>
                            ))}
                         </div>
                         </>
                     )}
                 </div>

                 {/* 3. Status Filter (Pill Style) */}
                 <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
                    {['All', 'Participated', 'Viewed', 'Unopened'].map(s => (
                       <button 
                          key={s}
                          onClick={() => setStatusFilter(s.toLowerCase())}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${statusFilter === s.toLowerCase() ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                       >
                          {s}
                       </button>
                    ))}
                 </div>
                 
                 {/* Clear Filters */}
                 {(statusFilter !== 'all' || tierFilter !== 'all' || filterZone !== 'All' || searchQuery) && (
                    <button 
                        onClick={handleClearFilters}
                        className="text-xs text-red-600 hover:text-red-800 font-medium whitespace-nowrap px-2 flex items-center gap-1"
                    >
                        <X size={12} /> Clear
                    </button>
                 )}
              </div>

              <div className="relative w-full xl:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search retailer..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-b-xl min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Retailer</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Tier</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Last Active</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Usage Snapshot</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Impact</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedList.map((r, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${r.logo || 'bg-gray-200'} flex items-center justify-center text-xs font-bold text-white`}>
                            {r.name?.substring(0, 2).toUpperCase() || 'NA'}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900">{r.name}</div>
                            <div className="text-xs text-gray-500">{r.zone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         {/* Dot + Text Style */}
                         <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${
                                 r.tier === 'Platinum' ? 'bg-purple-500' :
                                 r.tier === 'Gold' ? 'bg-amber-400' :
                                 r.tier === 'Silver' ? 'bg-gray-400' : 'bg-gray-200'
                             }`}></div>
                             <span className="text-sm font-medium text-gray-700">{r.tier}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          r.campaignStatus === 'Participated' ? 'bg-emerald-50 text-emerald-700' :
                          r.campaignStatus === 'Viewed' ? 'bg-amber-50 text-amber-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            r.campaignStatus === 'Participated' ? 'bg-emerald-500' :
                            r.campaignStatus === 'Viewed' ? 'bg-amber-500' :
                            'bg-gray-400'
                          }`}></span>
                          {r.campaignStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{r.lastActive || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <UsageIcons usage={r.usage} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {r.impact || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedRetailer(r)}
                          className="text-xs font-bold text-gray-900 hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedList.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        No retailers found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
      </div>

      {/* --- 5. Retailer Activity Drawer --- */}
      <Drawer
        isOpen={!!selectedRetailer}
        onClose={() => setSelectedRetailer(null)}
        title={
          selectedRetailer ? (
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${selectedRetailer.logo || 'bg-gray-200'} flex items-center justify-center text-lg font-bold text-white shadow-xs`}>
                {selectedRetailer.name?.substring(0, 2).toUpperCase() || 'NA'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedRetailer.name}</h3>
                <div className="text-sm text-gray-500">{selectedRetailer.contact?.name} • {selectedRetailer.contact?.email}</div>
              </div>
            </div>
          ) : null
        }
        footer={
           <div className="flex gap-3 w-full">
               <button 
                 onClick={(e) => {
                    handleNudgeSingle(selectedRetailer, e);
                 }}
                 className="flex-1 py-2.5 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
               >
                 <Mail size={16} /> Send Reminder
               </button>
               <button 
                 onClick={() => {
                     alert('Navigate to retailer detail');
                 }}
                 className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
               >
                 <User size={16} /> View Details
               </button>
           </div>
        }
      >
        {selectedRetailer && (
          <div className="space-y-0"> { /* Wrapper to maintain internal structure if needed */ }
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 border-b border-gray-100">
              <div className="p-4 text-center border-r border-gray-100">
                <div className="text-xs text-gray-500 uppercase font-medium">Total Actions</div>
                <div className="text-xl font-bold text-gray-900">{selectedRetailer.totalActions}</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-xs text-gray-500 uppercase font-medium">First Seen</div>
                <div className="text-xl font-bold text-gray-900">{selectedRetailer.lastActive || '-'}</div>
              </div>
            </div>

            {/* Drawer Tabs */}
            <div className="flex border-b border-gray-100">
              <button 
                onClick={() => setDrawerTab('usage')}
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${drawerTab === 'usage' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Usage Summary
              </button>
              <button 
                onClick={() => setDrawerTab('timeline')}
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${drawerTab === 'timeline' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Timeline
              </button>
            </div>

            {/* Content */}
            <div className="p-6">

              {drawerTab === 'usage' ? (
                <div className="space-y-6">
                  {/* Social */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                       <Share2 size={16} /> Social Posts
                    </h4>
                    {selectedRetailer.usage?.social ? (
                       <div className="space-y-3">
                         <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">Instagram</span>
                            <span className="text-emerald-600 font-medium flex items-center gap-1"><Check size={14}/> Posted</span>
                         </div>
                         <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">Facebook</span>
                            <span className="text-gray-400 italic">Not used</span>
                         </div>
                       </div>
                    ) : (
                       <div className="text-sm text-gray-400 italic">No social activity recorded</div>
                    )}
                  </div>
                  
                  {/* Email */}
                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                       <Mail size={16} /> Email
                    </h4>
                    {selectedRetailer.usage?.email ? (
                       <div className="text-sm text-gray-700">
                          <div className="flex items-center gap-2 mb-1">
                             <CheckCircle2 size={14} className="text-purple-500" />
                             <span>Spring Collection Blast</span>
                          </div>
                          <div className="text-xs text-gray-400 pl-6">Sent Nov 28, 2025</div>
                       </div>
                    ) : (
                       <div className="text-sm text-gray-400 italic">No emails sent</div>
                    )}
                  </div>

                  {/* Downloads */}
                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Download size={16} /> Downloads
                    </h4>
                    {selectedRetailer.usage?.downloads > 0 ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <FileText size={14} className="text-red-500" /> Lookbook.pdf
                          </div>
                          <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-sm">2x</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Video size={14} className="text-purple-500" /> Teaser.mp4
                          </div>
                          <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-sm">1x</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400 italic">No assets downloaded</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 relative pl-4 border-l border-gray-200 ml-2">
                  {/* Mock Timeline */}
                  {selectedRetailer.campaignStatus === 'Participated' && (
                    <>
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-gray-100"></div>
                        <div className="text-xs text-gray-400 mb-0.5">Today, 10:15 AM</div>
                        <div className="text-sm font-medium text-gray-900">Downloaded "Lookbook.pdf"</div>
                      </div>
                      <div className="relative pt-4">
                        <div className="absolute -left-[21px] top-5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white ring-1 ring-gray-100"></div>
                        <div className="text-xs text-gray-400 mb-0.5">Today, 10:00 AM</div>
                        <div className="text-sm font-medium text-gray-900">Shared to Instagram</div>
                      </div>
                    </>
                  )}
                  {selectedRetailer.campaignStatus !== 'Unopened' && (
                    <div className="relative pt-4">
                      <div className="absolute -left-[21px] top-5 w-3 h-3 bg-gray-400 rounded-full border-2 border-white ring-1 ring-gray-100"></div>
                      <div className="text-xs text-gray-400 mb-0.5">Yesterday, 4:30 PM</div>
                      <div className="text-sm font-medium text-gray-900">Viewed Campaign</div>
                    </div>
                  )}
                  <div className="relative pt-4">
                    <div className="absolute -left-[21px] top-5 w-3 h-3 bg-gray-300 rounded-full border-2 border-white ring-1 ring-gray-100"></div>
                    <div className="text-xs text-gray-400 mb-0.5">Dec 12, 9:00 AM</div>
                    <div className="text-sm font-medium text-gray-900">Invited to Campaign</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* --- Nudge Modal --- */}
      {/* --- Nudge Modal --- */}
      <NudgeModal 
        isOpen={showNudgeModal}
        onClose={() => setShowNudgeModal(false)}
        mode={nudgeTarget ? 'single' : 'bulk'}
        retailer={nudgeTarget}
        retailers={needsAttentionList}
        riskType={RISKS.GENERIC}
        onSend={handleSendNudge}
      />

    </div>
  );
};

export default RetailerAdoptionTab;
