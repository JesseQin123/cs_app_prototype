import React, { useState } from 'react';
import { Plus, Search, Grid, List as ListIcon, ChevronDown, Check, MoreHorizontal, Edit, Copy, Trash2, BarChart3, Clock, Download, Eye, Users, FileText, Image as ImageIcon, Video, Mail, Smartphone, Instagram, Pin, Flame, Archive, XCircle, Pencil, ArrowRight, MessageSquare, Facebook, Twitter, MapPin, Calendar, Infinity as InfinityIcon, Upload, Activity, Send } from 'lucide-react';
import PerformanceOverview from './PerformanceOverview';
import EmptyState from '../../components/EmptyState';
import Tooltip from '../../../components/Tooltip';
import { campaignData } from '../../../data/mockStore/campaignStore';

const BrandCampaignList = ({ campaigns, onCreate, onSelect, onEdit, onDelete, onDuplicate, onPin, onArchive, onEnd, onPublish }) => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const [visibleCount, setVisibleCount] = useState(12);

  // Filter Logic
  const filteredCampaigns = campaigns.filter(c => {
      if (filterStatus !== 'All' && c.status !== filterStatus) return false;
      if (filterStatus === 'All' && c.status === 'Archived') return false; // Don't show Archived in All
      if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
  }).sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      if (sortBy === 'newest') {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          if (dateA.getTime() !== dateB.getTime()) return dateB - dateA; // Sort by Date Descending
          return b.id.toString().localeCompare(a.id.toString()); // Fallback to ID
      }
      if (sortBy === 'ending') {
          if (a.endDate === 'Permanent') return 1;
          if (b.endDate === 'Permanent') return -1;
          return new Date(a.endDate) - new Date(b.endDate);
      }
      if (sortBy === 'active') {
        const usageA = (a.activityCount || 0) + (a.downloadCount || 0);
        const usageB = (b.activityCount || 0) + (b.downloadCount || 0);
        return usageB - usageA;
      }
      return 0;
  });

  const displayedCampaigns = filteredCampaigns.slice(0, visibleCount);

  // Reset pagination when filter changes
  React.useEffect(() => {
    setVisibleCount(12);
  }, [filterStatus, searchQuery, sortBy]);

  const statusTabs = [
      { id: 'All', label: 'All' },
      { id: 'Active', label: 'Active' },
      { id: 'Draft', label: 'Draft' },
      { id: 'Scheduled', label: 'Scheduled' },
      { id: 'Ended', label: 'Ended' },
      { id: 'Archived', label: 'Archived' }
  ];

  const sortOptions = [
      { id: 'newest', label: 'Newest Created' },
      { id: 'ending', label: 'Ending Soon' },
      { id: 'active', label: 'Most Active' }
  ];

  // Helper for availability status
  const getAvailabilityStatus = (campaign) => {
      // 1. Permanent
      if (campaign.endDate === 'Permanent') {
          return { 
              type: 'permanent', 
              label: 'Always available', 
              color: 'text-green-600', 
              icon: <InfinityIcon size={14} className="text-green-600"/>,
              tooltip: `Active since ${formatDate(campaign.startDate)}`
          };
      }

      const now = new Date('2025-11-26');
      const start = new Date(campaign.startDate);
      const end = new Date(campaign.endDate);
      const diffTime = end - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // 2. Scheduled (Future Start)
      if (start > now) {
           return { 
              type: 'scheduled', 
              label: `Starts ${formatDateShort(start)}`, 
              color: 'text-gray-500', 
              icon: <Calendar size={14} className="text-gray-400"/>,
              tooltip: `Availability: Starts ${formatDate(start)}`
           };
      }

      // 3. Expired
      if (diffDays <= 0 || campaign.status === 'Ended' || campaign.status === 'Archived') {
           return { 
              type: 'expired', 
              label: `Expired ${formatDateShort(end)}`, 
              color: 'text-gray-400', 
              icon: null,
              tooltip: `Expired on ${formatDate(end)}`
           };
      }

      // 4. Urgent / Ends Today (< 24h) - Logic implies diffDays <= 1 means today/tomorrow depending on calc
      if (diffDays <= 1) {
           return { 
               type: 'critical', 
               label: 'Ends Today', 
               color: 'text-red-600', 
               icon: <Flame size={14} className="fill-red-600 text-red-600"/>,
               tooltip: `Ends: Today at 11:59 PM`
           };
      }

      // 5. Warning (< 7 days)
      if (diffDays <= 7) {
          return { 
              type: 'warning', 
              label: `Ends in ${diffDays} days`, 
              color: 'text-amber-600', 
              icon: <Clock size={14} className="text-amber-600"/>,
              tooltip: `Ends: ${formatDate(end)} at 11:59 PM`
           };
      }

      // 6. Active (Far future)
      return { 
          type: 'active', 
          label: `Until ${formatDateShort(end)}`, 
          color: 'text-gray-500', 
          icon: <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>,
          tooltip: `Availability: Until ${formatDate(end)}`
      };
  };

  // Date Formatters
  const formatDate = (dateStr) => {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const formatDateShort = (date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Helper for status badge
  const renderStatusBadge = (campaign) => {
      const styles = {
          'Draft': 'bg-gray-100 text-gray-600',
          'Scheduled': 'bg-blue-50 text-blue-700',
          'Active': 'bg-emerald-50 text-emerald-700',
          'Ended': 'bg-gray-800 text-white',
          'Archived': 'bg-gray-50 text-gray-400 border border-gray-200'
      };
      
      return (
          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-sm uppercase tracking-wider text-[10px] font-bold whitespace-nowrap ${styles[campaign.status] || styles['Draft']}`}>
              {campaign.status}
          </span>
      );
  };

  // Helper for asset icons
  const renderAssetIcons = (campaign) => {
      let contentTypes = campaign.contentType;

      // Dynamic Derivation if Manual Config is missing
      if (!contentTypes || contentTypes.length === 0) {
          const content = campaignData.contentMap[campaign.contentId];
          contentTypes = [];
          
          if (content) {
             const socialPlatforms = new Set();
             let hasEmail = false;
             let hasSms = false;
             
             // Scan Publishable
             (content.publishable || []).forEach(item => {
                 if (item.type === 'social post' && Array.isArray(item.platform)) {
                     item.platform.forEach(p => socialPlatforms.add(p.toLowerCase()));
                 } else if (item.type === 'email') {
                     hasEmail = true;
                 } else if (item.type === 'sms') {
                     hasSms = true;
                 }
             });

             // Build Types Array
             if (socialPlatforms.size > 0) {
                 contentTypes.push(Array.from(socialPlatforms));
             }
             if (hasEmail) contentTypes.push('email');
             if (hasSms) contentTypes.push('sms');
             
             // Scan Downloadable
             if (content.downloadable && content.downloadable.length > 0) {
                 contentTypes.push('downloadable');
             }
          }
      }

      const getPlatformIcon = (p) => {
          const lowerP = p.toLowerCase();
          switch(lowerP) {
              case 'instagram': return <Instagram size={14} className="text-pink-600"/>;
              case 'facebook': return <div className="w-3.5 h-3.5 bg-blue-600 rounded-full flex items-center justify-center text-[9px] text-white font-bold">f</div>;
              case 'x': 
              case 'twitter': return <div className="w-3.5 h-3.5 bg-black rounded-xs flex items-center justify-center text-white font-black text-[10px]">𝕏</div>;
              case 'google':
              case 'gmb': 
              case 'google business profile': return <div className="w-3.5 h-3.5 rounded-xs flex items-center justify-center text-white font-bold text-[9px]" style={{backgroundColor: '#4285F4'}}>G</div>;
              default: return null;
          }
      };

      return (
          <div className="flex items-center gap-1.5 text-gray-400">
              {contentTypes.map((type, index) => {
                  // 1. Grouped Social Icons (Array)
                  if (Array.isArray(type)) {
                      return (
                          <div key={index} className="flex items-center -space-x-1.5">
                              {type.map(p => (
                                  <div key={p} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shadow-xs z-10 relative border border-white">
                                      {getPlatformIcon(p)}
                                  </div>
                              ))}
                          </div>
                      );
                  }

                  // 2. Single Types (String)
                  switch(type) {
                      case 'email': 
                          return <div key={index} className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600" title="Email"><Mail size={12}/></div>;
                      case 'sms': 
                          return <div key={index} className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center text-purple-600" title="SMS"><Smartphone size={12}/></div>;
                      case 'downloadable': 
                      case 'file':
                          return <div key={index} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600" title="Downloadable Assets"><Download size={12}/></div>;
                      case 'print':
                           return <div key={index} className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center text-orange-600" title="Print"><FileText size={12}/></div>;
                      default:
                          return null;
                  }
              })}
          </div>
      );
  };



  // Helper for Action Menu
  const renderActionMenu = (campaign, closeMenu) => {
      const isDraft = campaign.status === 'Draft';
      const isScheduled = campaign.status === 'Scheduled';
      const isActive = campaign.status === 'Active';
      const isEnded = campaign.status === 'Ended';
      const isArchived = campaign.status === 'Archived';
      
      const canEdit = !isEnded && !isArchived;
      const canPin = !isEnded && !isArchived;
      const canPublish = isDraft;
      const canEnd = isActive;
      const canArchive = isEnded;
      const canDuplicate = !isDraft; // Draft cannot duplicate
      const canViewAnalytics = !isDraft && !isScheduled; // Draft/Scheduled cannot view analytics

      return (
          <>
              <div className="fixed inset-0 z-30" onClick={(e) => {e.stopPropagation(); closeMenu()}}></div>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-40 animate-in fade-in zoom-in-95 text-left">
                  {canPublish && <button onClick={(e) => {e.stopPropagation(); onPublish && onPublish(campaign.id); closeMenu()}} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-indigo-600"><Upload size={14}/> Publish</button>}
                  {canPin && <button onClick={(e) => {e.stopPropagation(); onPin(campaign.id); closeMenu()}} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"><Pin size={14}/> {campaign.isPinned ? 'Unpin' : 'Pin to Top'}</button>}
                  {canEdit && <button onClick={(e) => {e.stopPropagation(); onEdit(campaign); closeMenu()}} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"><Edit size={14}/> Edit Campaign</button>}
                  {canViewAnalytics && <button onClick={(e) => {e.stopPropagation(); closeMenu()}} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"><BarChart3 size={14}/> View Analytics</button>}
                  {canDuplicate && <button onClick={(e) => {e.stopPropagation(); onDuplicate(campaign); closeMenu()}} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"><Copy size={14}/> Duplicate</button>}
                  {canEnd && <button onClick={(e) => {e.stopPropagation(); onEnd(campaign.id); closeMenu()}} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-amber-600"><XCircle size={14}/> End Now</button>}
                  {canArchive && <button onClick={(e) => {e.stopPropagation(); onArchive(campaign.id); closeMenu()}} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-600"><Archive size={14}/> Archive</button>}
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button onClick={(e) => {e.stopPropagation(); onDelete(campaign.id); closeMenu()}} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 flex items-center gap-2 text-red-600"><Trash2 size={14}/> Delete</button>
              </div>
          </>
      );
  };

  // Empty State
  if (campaigns.length === 0 && !searchQuery) {
      return <EmptyState title="Launch your first Campaign" description="Create a collection of assets for your retailers." action="Create Campaign" onAction={onCreate} />;
  }

  return (
    <div className="h-full overflow-auto pb-10">
      {/* [A] Page Header */}



      {/* [B] Performance Overview */}
      <div className="px-8">
          <PerformanceOverview campaigns={campaigns} />
      </div>

      {/* [C] Filter & Control Bar (Sticky) */}
      <div className="sticky top-0 z-40 bg-gray-50 pt-2 pb-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 px-8 shadow-xs">
         {/* Left: Status Tabs */}
         <div className="flex items-center gap-2 flex-wrap">
            {statusTabs.map(tab => {
                const count = campaigns.filter(c => tab.id === 'All' ? c.status !== 'Archived' : c.status === tab.id).length;
                const isActive = filterStatus === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setFilterStatus(tab.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${
                            isActive ? 'bg-black text-white shadow-xs' : 'bg-white text-gray-600 hover:bg-gray-100 border border-transparent'
                        }`}
                    >
                        {tab.label} <span className={`text-xs ml-1 ${isActive ? 'text-white/70' : 'text-gray-400'}`}>({count})</span>
                    </button>
                );
            })}
         </div>

         {/* Right: Tools */}
         <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
               <input 
                 type="text"
                 placeholder="Search campaigns..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5 focus:border-black w-48 transition shadow-xs"
               />
            </div>

            {/* Sort */}
            <div className="relative">
               <button 
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition min-w-[160px] justify-between shadow-xs"
               >
                  <span>{sortOptions.find(o => o.id === sortBy)?.label}</span>
                  <ChevronDown size={14} className="text-gray-500"/>
               </button>
               {isSortDropdownOpen && (
                  <>
                      <div className="fixed inset-0 z-30" onClick={() => setIsSortDropdownOpen(false)}></div>
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-40 animate-in fade-in zoom-in-95">
                          {sortOptions.map(opt => (
                              <button
                                  key={opt.id}
                                  onClick={() => { setSortBy(opt.id); setIsSortDropdownOpen(false); }}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between group"
                              >
                                  {opt.label}
                                  {sortBy === opt.id && <Check size={14} className="text-black"/>}
                              </button>
                          ))}
                      </div>
                  </>
               )}
            </div>

            {/* View Switcher */}
            <div className="flex bg-gray-200 p-1 rounded-lg">
               <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-sm ${viewMode === 'grid' ? 'bg-white shadow-xs text-black' : 'text-gray-500 hover:text-black'}`}><Grid size={16}/></button>
               <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-sm ${viewMode === 'list' ? 'bg-white shadow-xs text-black' : 'text-gray-500 hover:text-black'}`}><ListIcon size={16}/></button>
            </div>
         </div>
      </div>

      {/* [D] Content Area */}
      <div className="px-8 pb-20">
      {viewMode === 'grid' ? (
          /* [D1] Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedCampaigns.map(campaign => {
                  const availability = getAvailabilityStatus(campaign);
                  return (
                  <div 
                      key={campaign.id} 
                      className="group relative bg-white border border-gray-200 rounded-xl hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
                      onClick={() => onSelect(campaign)}
                  >
                      {/* Cover Image Area */}
                      <div className={`aspect-video relative bg-gray-100 rounded-t-xl overflow-hidden`}>
                          {campaign.coverImage ? (
                              <img 
                                src={campaign.coverImage} 
                                alt={campaign.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                              />
                          ) : null}
                          <div className={`w-full h-full ${campaign.cover} absolute inset-0 ${campaign.coverImage ? 'hidden' : ''}`}></div>

                          {/* Status Badge */}
                          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                              {renderStatusBadge(campaign)}
                              {campaign.updatePending && campaign.status === 'Active' && (
                                  <div className="bg-amber-100 text-amber-700 p-1 rounded-sm shadow-xs border border-amber-200 group/edit" title="Update Pending">
                                      <Pencil size={12} />
                                      <div className="absolute left-full ml-2 top-0 bg-gray-900 text-white text-xs px-2 py-1 rounded-sm opacity-0 group-hover/edit:opacity-100 whitespace-nowrap pointer-events-none transition">Update Pending</div>
                                  </div>
                              )}
                          </div>
                      </div>

                      {/* Hover Actions Menu - MOVED OUTSIDE OVERFLOW-HIDDEN CONTAINER */}
                      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="relative">
                              <button 
                                  onClick={(e) => {e.stopPropagation(); setOpenMenuId(openMenuId === campaign.id ? null : campaign.id)}}
                                  className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 text-gray-700"
                              >
                                  <MoreHorizontal size={16}/>
                              </button>
                              {openMenuId === campaign.id && renderActionMenu(campaign, () => setOpenMenuId(null))}
                          </div>
                      </div>

                      {/* Info Area */}
                      <div className="p-5 flex-1 flex flex-col">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                  <Tooltip content={campaign.title}>
                                    <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-2 group-hover:text-brand-gold transition">{campaign.title}</h3>
                                  </Tooltip>
                                  {campaign.isPinned && <Pin size={14} className="fill-black shrink-0 mt-1"/>}
                              </div>
                          
                          <div className="mb-4">
                              {campaign.endDate === 'Permanent' ? (
                                  <Tooltip content={availability.tooltip}>
                                      <div className="flex items-center gap-1.5 text-green-600 font-medium text-xs">
                                          <InfinityIcon size={14} />
                                          <span>Always available</span>
                                      </div>
                                  </Tooltip>
                              ) : (
                                  <Tooltip content={availability.tooltip}>
                                      <div className={`text-xs font-medium ${availability.color} flex items-center gap-1.5`}>
                                          {availability.icon}
                                          {availability.label}
                                      </div>
                                  </Tooltip>
                              )}
                          </div>

                          {/* Metrics Row */}
                          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                                <span className="text-gray-400 text-xs font-normal">Adoption</span>
                                {campaign.adoptionRate !== null ? `${campaign.adoptionRate}%` : '--'}
                              </div>
                              <div className="flex items-center gap-3">
                                  <Tooltip content="Activities Executed">
                                      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                                        <Send size={12} className="text-gray-400" />
                                        {campaign.activityCount !== null && campaign.activityCount !== undefined ? campaign.activityCount : '--'}
                                      </div>
                                  </Tooltip>
                                  <Tooltip content="Assets Downloaded">
                                      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                                        <Download size={12} className="text-gray-400" />
                                        {campaign.downloadCount !== null && campaign.downloadCount !== undefined ? campaign.downloadCount : '--'}
                                      </div>
                                  </Tooltip>
                              </div>
                          </div>

                          {/* Asset Icons */}
                          <div className="mt-auto flex items-center gap-1.5">
                              {renderAssetIcons(campaign)}
                              <div className="ml-auto text-gray-300 group-hover:text-indigo-600 transition"><ArrowRight size={16}/></div>
                          </div>
                      </div>
                  </div>
              )})}
          </div>
      ) : (
          /* [D2] List View */
          <div className="bg-white border border-gray-200 rounded-xl shadow-xs">
              <table className="w-full text-left table-fixed">
                  <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <tr>
                          <th className="px-6 py-4 w-[25%]">Campaign</th>
                          <th className="px-6 py-4 w-[8%]">Status</th>
                          <th className="px-6 py-4 w-[13%]">Availability</th>
                          <th className="px-6 py-4 w-[11%]">Audience</th>
                          <th className="px-6 py-4 w-[17%]">Content</th>
                          <th className="px-6 py-4 w-[10%]">Adoption</th>
                          <th className="px-6 py-4 w-[10%]">Usage</th>
                          <th className="px-6 py-4 w-[6%] text-right"></th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {displayedCampaigns.map(campaign => {
                          const availability = getAvailabilityStatus(campaign);
                          return (
                          <tr 
                              key={campaign.id} 
                              className="group hover:bg-gray-50 transition cursor-pointer"
                              onClick={() => onSelect(campaign)}
                          >
                              <td className="px-6 py-4">
                                  <div className="flex items-start gap-4">
                                      <div className="w-16 h-9 rounded-sm bg-gray-100 shrink-0 shadow-xs mt-1 overflow-hidden relative">
                                          {campaign.coverImage ? (
                                              <img 
                                                src={campaign.coverImage} 
                                                alt={campaign.title} 
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                              />
                                          ) : null}
                                          <div className={`w-full h-full ${campaign.cover} absolute inset-0 ${campaign.coverImage ? 'hidden' : ''}`}></div>
                                      </div>
                                      <div>
                                          <div className="flex items-start gap-2">
                                              <Tooltip content={campaign.title}>
                                                <div className="font-bold text-gray-900 group-hover:text-brand-gold transition line-clamp-2 text-ellipsis">
                                                    {campaign.title}
                                                </div>
                                              </Tooltip>
                                              {campaign.isPinned && <Pin size={12} className="fill-black shrink-0 mt-1"/>}
                                          </div>
                                          <div className="text-xs text-gray-500 line-clamp-2 mt-0.5 max-w-[200px]">{campaign.description || 'No description provided for this campaign.'}</div>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  {renderStatusBadge(campaign)}
                              </td>
                              <td className="px-6 py-4">
                                  <div className="flex flex-col">
                                      <Tooltip content={availability.tooltip}>
                                          <div className={`text-xs font-medium ${availability.color} flex items-center gap-1.5 whitespace-nowrap`}>
                                              {availability.icon}
                                              {availability.label}
                                          </div>
                                      </Tooltip>
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-xs text-gray-600">
                                  {campaign.audience === 'Unspecified' ? (
                                      <span className="text-gray-400 italic">Unspecified</span>
                                  ) : (
                                      campaign.audience
                                  )}
                              </td>
                              <td className="px-6 py-4">
                                  {renderAssetIcons(campaign)}
                              </td>
                              <td className="px-6 py-4">
                                  {campaign.adoptionRate !== null ? (
                                      <>
                                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                              <div className="h-full bg-brand-gold rounded-full" style={{ width: `${campaign.adoptionRate}%` }}></div>
                                          </div>
                                          <div className="text-xs text-gray-400 mt-1">{campaign.adoptionRate}%</div>
                                      </>
                                  ) : <span className="text-gray-400 text-xs">--</span>}
                              </td>
                              <td className="px-6 py-4 text-xs text-gray-600">
                                 <div className="flex items-center gap-3">
                                  <Tooltip content="Activities Executed">
                                      <div className="flex items-center gap-1.5">
                                          <Send size={12} className="text-gray-400" />
                                          <span>{campaign.activityCount !== null && campaign.activityCount !== undefined ? campaign.activityCount : '--'}</span>
                                      </div>
                                  </Tooltip>
                                  <Tooltip content="Assets Downloaded">
                                      <div className="flex items-center gap-1.5">
                                          <Download size={12} className="text-gray-400" />
                                          <span>{campaign.downloadCount !== null && campaign.downloadCount !== undefined ? campaign.downloadCount : '--'}</span>
                                      </div>
                                  </Tooltip>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-right relative" onClick={e => e.stopPropagation()}>
                                  <button 
                                      onClick={(e) => {e.stopPropagation(); setOpenMenuId(openMenuId === campaign.id ? null : campaign.id)}}
                                      className="p-2 hover:bg-gray-200 rounded-sm text-gray-400 hover:text-black transition"
                                  >
                                      <MoreHorizontal size={16}/>
                                  </button>
                                  {openMenuId === campaign.id && renderActionMenu(campaign, () => setOpenMenuId(null))}
                              </td>
                          </tr>
                      )})}
                  </tbody>
              </table>
          </div>
      )}

      {/* Load More Section */}
      <div className="mt-8 text-center">
          {visibleCount < filteredCampaigns.length ? (
              <button 
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 transition shadow-xs"
              >
                  Load More
              </button>
          ) : (
              filteredCampaigns.length > 0 && (
                  <p className="text-gray-400 text-sm">No more campaigns to load</p>
              )
          )}
      </div>
      </div>
    </div>
  );
};

export default BrandCampaignList;
