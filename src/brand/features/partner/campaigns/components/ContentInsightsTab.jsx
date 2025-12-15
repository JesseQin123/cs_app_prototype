import React, { useState, useRef } from 'react';
import { 
  Instagram, Facebook, Twitter, MessageCircle, Video, Mail, Smartphone, 
  Download, Users, TrendingUp, Eye, MousePointer, FileText, Image as ImageIcon, 
  BarChart3, AlertCircle, RefreshCw, ChevronDown, ChevronRight, Info, MapPin 
} from 'lucide-react';

const ContentInsightsTab = ({ campaign, data }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Today, 10:45 AM');

  const socialRef = useRef(null);
  const emailRef = useRef(null);
  const smsRef = useRef(null);
  const assetsRef = useRef(null);

  // --- Mock Data Generation ---
  
  // --- Mock Data Consumption (from Store) ---
  
  const socialContent = data?.socialContent || [];
  const emailContent = data?.emailContent || [];
  const smsContent = data?.smsContent || [];
  const assetContent = data?.assetContent || [];

  // Counts for filters
  const counts = {
    all: socialContent.length + emailContent.length + smsContent.length + assetContent.length,
    social: socialContent.length,
    email: emailContent.length,
    sms: smsContent.length,
    downloads: assetContent.length
  };

  // --- Actions ---

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastUpdated(`Today, ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`);
    }, 1500);
  };

  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    switch(filter) {
      case 'social': scrollToSection(socialRef); break;
      case 'email': scrollToSection(emailRef); break;
      case 'sms': scrollToSection(smsRef); break;
      case 'downloads': scrollToSection(assetsRef); break;
      default: {
        // Scroll to top of the container
        const container = socialRef.current?.closest('.overflow-y-auto');
        if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      }
    }
  };

  // Helper to get platform icon
  const getPlatformIcon = (platform, size = 14) => {
    switch(platform) {
      case 'instagram': return <Instagram size={size} className="text-pink-600" />;
      case 'facebook': return <Facebook size={size} className="text-blue-600" />;
      case 'twitter': return <Twitter size={size} className="text-black" />; // X (Twitter)
      case 'google_business': return <MapPin size={size} className="text-blue-500" />;
      default: return null;
    }
  };

  // Helper to get file icon
  const getFileIcon = (type) => {
    switch(type) {
      case 'PDF': return <FileText size={20} className="text-red-500" />;
      case 'Video': return <Video size={20} className="text-purple-500" />;
      case 'ZIP': return <Download size={20} className="text-gray-500" />;
      case 'Image': return <ImageIcon size={20} className="text-blue-500" />;
      default: return <FileText size={20} className="text-gray-400" />;
    }
  };

  // Empty State Handling
  // Show if status is Draft OR if data explicitly says no data
  const showEmptyState = campaign.status === 'Draft' || (data && data.hasData === false);

  if (showEmptyState) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <BarChart3 size={32} className="text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
            {data?.message || "No Content Insights Yet"}
        </h3>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          {campaign.status === 'Scheduled' 
            ? "Insights will start appearing once the campaign goes live."
            : "Analytics and retailer activity will appear here once you publish this campaign and retailers start interacting with it."
          }
        </p>
        
        {campaign.status === 'Draft' && (
            <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm max-w-lg mx-auto border border-blue-100 flex gap-3 text-left">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div>
                <div className="font-bold mb-1">Ready to launch?</div>
                <div>Go to the Overview tab to complete your checklist and publish this campaign.</div>
            </div>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      
      {/* --- Sticky Header: Filters & Actions --- */}
      <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-md border-b border-gray-200 shadow-xs py-3 mb-6">
        <div className="flex items-center justify-between px-6 gap-4">
          
          {/* Left: Smart Content Filter */}
          <div className="flex items-center gap-2 no-scrollbar pl-1 py-1">
            {[
              { id: 'all', label: 'All Content', count: counts.all },
              { id: 'social', label: 'Social Post', count: counts.social },
              { id: 'email', label: 'Email', count: counts.email },
              { id: 'sms', label: 'SMS', count: counts.sms },
              { id: 'downloads', label: 'Downloads', count: counts.downloads },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterClick(filter.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap border ${
                  activeFilter === filter.id
                    ? 'bg-black text-white border-black shadow-md transform'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                }`}
              >
                {filter.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeFilter === filter.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Right: Status & Refresh */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Last Updated - Compact with Hover */}
            <div className="group relative flex items-center gap-2 text-[10px] text-gray-400 bg-white border border-gray-200 px-2 py-1 rounded-full shadow-xs cursor-help">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>Updated {lastUpdated.split(',')[1]}</span>
              
              {/* Tooltip */}
              <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                Last updated: {lastUpdated}
                <br />
                Auto-refreshes every 1 hour
              </div>
            </div>

            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-200 rounded-full transition disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>

        </div>
      </div>

      <div className="w-full space-y-10 px-6">
        
        {/* --- Section 1: Social Post --- */}
        <div ref={socialRef} className="scroll-mt-40">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Instagram size={24} className="text-pink-500" />
              Social Post
            </h2>
            <div className="flex gap-4">
               <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-xs">
                  <div className="text-xs text-gray-500 uppercase font-bold">Total Shares</div>
                  <div className="text-lg font-bold text-gray-900">445</div>
               </div>
               <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-xs">
                  <div className="text-xs text-gray-500 uppercase font-bold">Top Platform</div>
                  <div className="text-lg font-bold text-gray-900 flex items-center gap-1">
                    <Instagram size={14} /> Instagram
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-5">Content Name</div>
              <div className="col-span-2 text-right">Total Shares</div>
              <div className="col-span-2 text-right">Est. Reach</div>
              <div className="col-span-2 text-right">Engagement</div>
              <div className="col-span-1 text-center">Details</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {socialContent.map((post) => (
                <div key={post.id} className="group bg-white transition hover:bg-gray-50/50">
                  {/* Master Row */}
                  <div 
                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center cursor-pointer"
                    onClick={() => toggleRow(post.id)}
                  >
                    <div className="col-span-5 flex items-center gap-4">
                      <img src={post.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover shadow-xs border border-gray-100" />
                      <div>
                        <div className="font-bold text-gray-900 text-sm mb-1">{post.title}</div>
                        <div className="flex gap-1">
                          {post.platforms.map(p => (
                            <div key={p} className="p-1 bg-gray-100 rounded-md">
                              {getPlatformIcon(p, 12)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 text-right font-bold text-gray-900">{post.totalShares}</div>
                    <div className="col-span-2 text-right text-gray-500 text-sm">{post.estReach.toLocaleString()}</div>
                    <div className="col-span-2 text-right">
                      <div className="flex items-center justify-end gap-1 font-medium text-emerald-600">
                        {post.avgEngagement}% <TrendingUp size={12} />
                      </div>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button className={`p-1 rounded-full transition ${expandedRows.has(post.id) ? 'bg-gray-200 rotate-180' : 'hover:bg-gray-100'}`}>
                        <ChevronDown size={16} className="text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* Detail Row (Expandable) */}
                  {expandedRows.has(post.id) && (
                    <div className="bg-gray-50/80 border-t border-gray-100 px-6 py-4 animate-in slide-in-from-top-2 duration-200">
                      <div className="space-y-2 pl-[64px]"> {/* Indent to align with text */}
                        {post.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2 w-24 font-medium text-gray-700">
                              {getPlatformIcon(detail.platform)}
                              <span className="capitalize">{detail.platform.replace('_', ' ')}</span>
                            </div>
                            <div className="flex gap-6 text-gray-600">
                              <span><span className="font-medium text-gray-900">{detail.shares}</span> Shares</span>
                              {detail.likes && <span><span className="font-medium text-gray-900">{detail.likes.toLocaleString()}</span> Likes</span>}
                              {detail.comments && <span><span className="font-medium text-gray-900">{detail.comments}</span> Comments</span>}
                              {detail.views && <span><span className="font-medium text-gray-900">{detail.views.toLocaleString()}</span> Views</span>}
                              {detail.clicks && <span><span className="font-medium text-gray-900">{detail.clicks.toLocaleString()}</span> Clicks</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Section 2: Email --- */}
        <div ref={emailRef} className="scroll-mt-40">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Mail size={24} className="text-blue-500" />
              Email
            </h2>
            <div className="flex gap-4">
               <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-xs">
                  <div className="text-xs text-gray-500 uppercase font-bold">Total Usage</div>
                  <div className="text-lg font-bold text-gray-900">47</div>
               </div>
               <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-xs">
                  <div className="text-xs text-gray-500 uppercase font-bold">Active Retailers</div>
                  <div className="text-lg font-bold text-gray-900">38</div>
               </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-5">Subject Line</div>
              <div className="col-span-2 text-right">Sent</div>
              <div className="col-span-2 text-right">Open Rate</div>
              <div className="col-span-2 text-right">Click Rate</div>
              <div className="col-span-1 text-center">Usage</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {emailContent.map((email) => (
                <div key={email.id} className="group bg-white transition hover:bg-gray-50/50">
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                    <div className="col-span-5">
                      <div className="font-bold text-gray-900 text-sm mb-1 truncate" title={email.subject}>{email.subject}</div>
                      <div className="text-xs text-gray-500">Template ID: {email.id}</div>
                    </div>
                    <div className="col-span-2 text-right font-bold text-gray-900">{email.sent}</div>
                    <div className="col-span-2 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-bold text-gray-900">{email.openRate}%</span>
                        <div className="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${email.openRate}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 text-right font-bold text-gray-900">{email.clickRate}%</div>
                    <div className="col-span-1 flex justify-center">
                      <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {email.usageCount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Section 3: SMS --- */}
        <div ref={smsRef} className="scroll-mt-40">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Smartphone size={24} className="text-emerald-500" />
              SMS
            </h2>
            <div className="flex gap-4">
               <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-xs">
                  <div className="text-xs text-gray-500 uppercase font-bold">Total Usage</div>
                  <div className="text-lg font-bold text-gray-900">77</div>
               </div>
               <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-xs">
                  <div className="text-xs text-gray-500 uppercase font-bold">Active Retailers</div>
                  <div className="text-lg font-bold text-gray-900">52</div>
               </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-5">Message Preview</div>
              <div className="col-span-2 text-right">Sent</div>
              <div className="col-span-2 text-right">Delivery Rate</div>
              <div className="col-span-2 text-right">Click Rate</div>
              <div className="col-span-1 text-center">Usage</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {smsContent.map((sms) => (
                <div key={sms.id} className="group bg-white transition hover:bg-gray-50/50">
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                    <div className="col-span-5">
                      <div className="font-medium text-gray-900 text-sm mb-1 truncate" title={sms.message}>{sms.message}</div>
                    </div>
                    <div className="col-span-2 text-right font-bold text-gray-900">{sms.sent}</div>
                    <div className="col-span-2 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-bold text-gray-900">{sms.deliveryRate}%</span>
                        <div className="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${sms.deliveryRate}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 text-right font-bold text-gray-900">{sms.clickRate}%</div>
                    <div className="col-span-1 flex justify-center">
                      <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {sms.usageCount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Section 4: Downloadable Assets --- */}
        <div ref={assetsRef} className="scroll-mt-40">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Download size={24} className="text-purple-500" />
              Downloadable Assets
            </h2>
            <div className="flex gap-4">
               <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-xs">
                  <div className="text-xs text-gray-500 uppercase font-bold">Total Downloads</div>
                  <div className="text-lg font-bold text-gray-900">548</div>
               </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-16">Preview</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">File Name</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Type & Size</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Downloads</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Coverage</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Last Activity</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assetContent.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getFileIcon(asset.type)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 text-sm truncate max-w-[200px]" title={asset.name}>
                        {asset.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {asset.type} • {asset.size}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">{asset.downloads}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${asset.coverage}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500">{asset.coverage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {asset.lastActivity}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline opacity-0 group-hover:opacity-100 transition">
                        Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Load More / Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
              <button className="text-sm font-medium text-gray-600 hover:text-black transition">
                View All 15 Assets
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContentInsightsTab;
