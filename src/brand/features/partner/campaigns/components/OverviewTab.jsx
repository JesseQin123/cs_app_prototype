import React, { useState, useMemo } from 'react';
import { PenLine, ArrowRight, AlertTriangle, Send, FileText, Image as ImageIcon, Timer, Info, Bell, MessageSquare, X, Video, Users, Store, MousePointerClick, Download, Eye, BarChart2, Flag } from 'lucide-react';
import { createPortal } from 'react-dom';
import ReadinessChecklist from './ReadinessChecklist';
import { useToast } from '../../../../context/ToastContext';
import Tooltip from '@/components/Tooltip';
import NudgeModal, { RISKS } from '../../NudgeModal';

const OverviewTab = ({ campaign, data, setActiveTab }) => {
  const isDraft = campaign.status === 'Draft';
  const { addToast } = useToast();

  // Prioritize campaign-specific metrics (if injected) over shared overview archetype data
  const metrics = campaign.metrics || data?.metrics || {};

  const [showNudgeModal, setShowNudgeModal] = useState(false);
  const [nudgeTarget, setNudgeTarget] = useState(null);

  // Ensure retailers have IDs for NudgeModal
  const nudgeRetailers = useMemo(() => {
    return (data?.needsAttention || []).map((r, i) => ({
      ...r,
      id: r.id || `na-temp-${i}`,
      tier: 'Standard',
      name: r.name
    }));
  }, [data?.needsAttention]);

  const handleNudge = (retailerName = null) => {
    if (retailerName) {
        const target = nudgeRetailers.find(r => r.name === retailerName);
        setNudgeTarget(target || { id: `manual-${Date.now()}`, name: retailerName });
    } else {
        setNudgeTarget(null);
    }
    setShowNudgeModal(true);
  };

  const handleSendNudge = (nudgeData) => {
      addToast(`Reminder sent to ${nudgeData.count} retailer(s)`, 'success');
      setShowNudgeModal(false);
  };

  // --- Draft State: Launchpad ---
  if (isDraft) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
        {/* Helper Tip */}
        <div className="flex items-start gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
           <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-xs">
              <PenLine size={20} />
           </div>
           <div>
              <h3 className="font-bold text-indigo-900 text-sm mb-1">{data?.summary || "Let's get this campaign ready for launch"}</h3>
              <p className="text-sm text-indigo-700 leading-relaxed">
                 {data?.nextStep ? `Next Step: ${data.nextStep}. ` : ''} 
                 Complete the checklist below to ensure your retailers have everything they need. Once all items are checked, you can publish this campaign.
              </p>
           </div>
        </div>

        {/* Readiness Checklist */}
        <ReadinessChecklist 
            campaign={campaign} 
            onGoToContent={() => setActiveTab('content')} 
        />

        {/* Action to Content */}
        <div className="flex justify-center">
            <button 
              onClick={() => setActiveTab('content')}
              className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:border-black text-gray-600 hover:text-black font-medium rounded-full transition shadow-xs hover:shadow-md"
            >
              <PenLine size={18} />
              <span>Manage Campaign Content</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>
    );
  }

  // --- Scheduled State ---
  if (campaign.status === 'Scheduled') {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto py-10">
            {/* Status Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden text-center p-12">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Timer size={32} className="text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready for Launch</h2>
                <p className="text-gray-500 max-w-lg mx-auto mb-8">
                    Your campaign is scheduled and all assets are locked. Retailers will be notified automatically on the start date.
                </p>

                <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-10">
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Launch Date</div>
                        <div className="text-lg font-bold text-gray-900">{campaign.startDate}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Time Remaining</div>
                         {/* Mock Countdown */}
                        <div className="text-lg font-bold text-emerald-600">22d 14h 05m</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Assets Locked</div>
                        <div className="text-lg font-bold text-gray-900">{(campaign.downloadableAssets?.length || 0) + (campaign.publishableContent?.length || 0)} Items</div>
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                     <button 
                        onClick={() => setActiveTab('content')}
                        className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition"
                     >
                        Preview Content
                     </button>
                     <button className="px-6 py-2.5 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition shadow-lg shadow-black/20">
                        Edit Schedule
                     </button>
                </div>
            </div>
        </div>
    );
  }

  // --- Active State: Dashboard ---
  const needsAttentionList = data?.needsAttention || [];
  const topContentList = data?.topPerformingContent || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Status & KPI Cards */}
      <div className="space-y-4">
        {/* Status Indicator */}
        <div className="flex items-center justify-between">
           <h3 className="text-gray-900 font-bold hidden md:block">Campaign Performance</h3>
           
           {/* Status Badge */}
           {campaign.status === 'Active' ? (
                <Tooltip content="Auto-refreshes every 30 minutes">
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[11px] font-bold text-emerald-700 shadow-xs cursor-help">
                        <div className="relative flex items-center justify-center w-2 h-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600"></span>
                        </div>
                        Live Data
                        <span className="w-px h-3 bg-emerald-200 mx-1"></span>
                        <span className="text-emerald-600 font-medium">Started: {new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </Tooltip>
           ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 border border-gray-200 rounded-full text-[11px] font-bold text-gray-600 shadow-xs">
                     <Flag size={12} className="fill-gray-500 text-gray-500" />
                     Ended on: {new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
           )}
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Card 1: Retailer Adoption (Slot 1 - Funnel Top) */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs hover:shadow-md transition duration-300 group relative">
                 <div className="flex items-start justify-between mb-2">
                     <div className="flex items-center gap-2">
                        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Retailer Adoption</h4>
                        <Tooltip content="Percentage of invited retailers who have downloaded assets or executed marketing activities.">
                            <Info size={12} className="text-gray-300 hover:text-gray-500 transition"/>
                        </Tooltip>
                     </div>
                     <Store size={18} className="text-gray-400"/>
                 </div>
                 
                 <div className="flex items-baseline gap-2 mb-2">
                     <span className={`text-3xl font-bold tracking-tight ${campaign.status === 'Active' ? 'text-gray-900' : 'text-gray-500'}`}>
                        {metrics?.retailerAdoption ? Math.round((metrics.retailerAdoption.participants / metrics.retailerAdoption.totalInvited) * 100) : campaign.adoptionRate}%
                     </span>
                 </div>
                 <div className="text-[11px] text-gray-400 font-medium">
                     {metrics?.retailerAdoption?.participants || Math.round((campaign.adoptionRate / 100) * 185)} / {metrics?.retailerAdoption?.totalInvited || 185} Participated
                 </div>
            </div>

            {/* Card 2: Total Usage (Slot 2 - B2B Execution) */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs hover:shadow-md transition duration-300 group relative">
                 <div className="flex items-start justify-between mb-2">
                     <div className="flex items-center gap-2">
                        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Total Usage</h4>
                        <Tooltip content="Total volume of assets downloaded and marketing activities executed.">
                            <Info size={12} className="text-gray-300 hover:text-gray-500 transition"/>
                        </Tooltip>
                     </div>
                     <BarChart2 size={18} className="text-gray-400"/>
                 </div>

                 <div className="flex items-baseline gap-2 mb-2">
                     <span className={`text-3xl font-bold tracking-tight ${campaign.status === 'Active' ? 'text-gray-900' : 'text-gray-500'}`}>
                        {((metrics?.totalUsage?.downloads || 0) + (metrics?.totalUsage?.publishes || 0)).toLocaleString()}
                     </span>
                 </div>
                 
                 <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium mt-1">
                    <span className="flex items-center gap-1"><Send size={12} className="text-gray-300"/> {metrics?.totalUsage?.publishes || 0}</span>
                    <span className="w-px h-3 bg-gray-200"></span>
                    <span className="flex items-center gap-1"><Download size={12} className="text-gray-300"/> {metrics?.totalUsage?.downloads || 0}</span>
                 </div>
            </div>

            {/* Card 3: Est. Audience Reach (Slot 3 - C2B Exposure) */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs hover:shadow-md transition duration-300 group relative">
                 <div className="flex items-start justify-between mb-2">
                     <div className="flex items-center gap-2">
                        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Est. Audience Reach</h4>
                        <Tooltip content="Aggregate estimated reach across email opens and social impressions reported by platforms.">
                            <Info size={12} className="text-gray-300 hover:text-gray-500 transition"/>
                        </Tooltip>
                     </div>
                     <Eye size={18} className="text-gray-400"/>
                 </div>

                 <div className="flex items-baseline gap-2 mb-2">
                     <span className="text-3xl font-bold tracking-tight text-gray-900">
                        {/* Interactive Helper for Millions/Thousands */}
                        {((metrics?.audienceReach?.emailOpens || 0) + (metrics?.audienceReach?.socialImpressions || 0)) > 1000000 
                            ? (((metrics?.audienceReach?.emailOpens || 0) + (metrics?.audienceReach?.socialImpressions || 0)) / 1000000).toFixed(1) + 'M'
                            : (((metrics?.audienceReach?.emailOpens || 0) + (metrics?.audienceReach?.socialImpressions || 0)) / 1000).toFixed(1) + 'K'
                        }
                     </span>
                     {/* Dynamic Indicator for Ended campaigns showing growth */}
                     {campaign.status === 'Ended' && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-1 animate-pulse" title="Still growing">+</span>
                     )}
                 </div>
                 <div className="text-[11px] text-gray-400 font-medium">
                    Lifetime opens & impressions
                 </div>
            </div>

            {/* Card 4: Customer Interactions (Slot 4 - C2B Conversion) */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs hover:shadow-md transition duration-300 group relative">
                 <div className="flex items-start justify-between mb-2">
                     <div className="flex items-center gap-2">
                        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Customer Interactions</h4>
                        <Tooltip content="Total clicks, likes, comments, and shares generated by this campaign.">
                            <Info size={12} className="text-gray-300 hover:text-gray-500 transition"/>
                        </Tooltip>
                     </div>
                     <MousePointerClick size={18} className="text-gray-400"/>
                 </div>

                 <div className="flex items-baseline gap-2 mb-2">
                     <span className="text-3xl font-bold tracking-tight text-gray-900">
                        {
                            Object.values(metrics?.customerInteractions || {}).reduce((a, b) => a + b, 0) > 1000
                            ? (Object.values(metrics?.customerInteractions || {}).reduce((a, b) => a + b, 0) / 1000).toFixed(1) + 'K'
                            : Object.values(metrics?.customerInteractions || {}).reduce((a, b) => a + b, 0)
                        }
                     </span>
                      {campaign.status === 'Ended' && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-1 animate-pulse" title="Still growing">+</span>
                     )}
                 </div>
                 
                 <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium mt-1">
                    <span>Clicks & Social Engagement</span>
                 </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Engagement Feed */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Live Engagement Feed</h3>
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
            </span>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {data?.activityFeed && data.activityFeed.length > 0 ? (
              data.activityFeed.map((item) => (
                <div key={item.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-bold">{item.retailer}</span>
                      {' '}
                      {item.action}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                No recent activity to display.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
           {/* Needs Attention - Refactored */}
           <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 relative">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                     <h3 className="font-bold text-gray-900 text-sm">Needs Attention</h3>
                     <div className="group relative">
                        <Info size={14} className="text-gray-400 cursor-help" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 text-center">
                            Based on adoption rate from the last 7 days.
                        </div>
                     </div>
                 </div>
                 <AlertTriangle size={16} className="text-amber-500"/>
              </div>
              <div className="space-y-3 mb-4">
                 {needsAttentionList.length > 0 ? needsAttentionList.map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-sm group">
                       <span className="text-gray-600 truncate max-w-[140px]" title={r.name}>{r.name}</span>
                       <div className="flex items-center gap-2">
                           <span className="text-red-500 font-medium">{r.adoptionRate}%</span>
                           <button 
                                onClick={() => handleNudge(r.name)}
                                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-amber-600 transition opacity-0 group-hover:opacity-100"
                                title="Send Reminder"
                           >
                                <Bell size={12} />
                           </button>
                       </div>
                    </div>
                 )) : (
                    <div className="text-center text-gray-400 text-sm py-4">All good! No urgent items.</div>
                 )}
              </div>
              {needsAttentionList.length > 0 && (
                  <button 
                    onClick={() => handleNudge()}
                    className="w-full py-2 bg-gray-50 hover:bg-amber-50 text-gray-700 hover:text-amber-700 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition border border-transparent hover:border-amber-200"
                  >
                     <Bell size={14}/> Nudge All
                  </button>
              )}
           </div>

           {/* Top Content - Refactored */}
           <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6">
              <h3 className="font-bold text-gray-900 text-sm mb-4">Top Performing Content</h3>
              <div className="space-y-4">
                 {topContentList.length > 0 ? topContentList.map((item, idx) => (
                     <div key={idx} className="flex gap-3 items-center group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden relative border border-gray-200 shrink-0">
                           {item.thumbnail ? (
                               <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                           ) : (
                               item.type === 'video' ? <Video size={20}/> : 
                               item.type === 'image' ? <ImageIcon size={20}/> : <FileText size={20}/>
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="text-xs text-gray-500 uppercase font-medium">{item.metricLabel}</div>
                           <div className="text-sm font-bold text-gray-900 truncate" title={item.title}>{item.title}</div>
                        </div>
                     </div>
                 )) : (
                     <div className="text-center text-gray-400 text-sm py-4">No content insights yet.</div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* --- Global Nudge Modal --- */}
      <NudgeModal
        isOpen={showNudgeModal}
        onClose={() => setShowNudgeModal(false)}
        mode={nudgeTarget ? 'single' : 'bulk'}
        retailer={nudgeTarget}
        retailers={nudgeRetailers}
        riskType={RISKS.GENERIC}
        onSend={handleSendNudge}
      />

    </div>
  );
};

export default OverviewTab;
