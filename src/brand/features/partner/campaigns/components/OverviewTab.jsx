import React, { useState } from 'react';
import { PenLine, ArrowRight, AlertTriangle, Send, FileText, Image as ImageIcon, Timer, Info, Bell, MessageSquare, X, Video } from 'lucide-react';
import { createPortal } from 'react-dom';
import ReadinessChecklist from './ReadinessChecklist';
import { useToast } from '../../../../context/ToastContext';

const OverviewTab = ({ campaign, data, setActiveTab }) => {
  const isDraft = campaign.status === 'Draft';
  const { addToast } = useToast();

  const [showNudgeModal, setShowNudgeModal] = useState(false);
  const [nudgeMessage, setNudgeMessage] = useState('');
  
  const handleNudge = (retailerName = null) => {
    setNudgeMessage(`Hi ${retailerName ? 'Partner' : 'Team'}, \n\nJust a friendly reminder that our ${campaign.title} campaign is live. We'd love for you to participate!\n\nBest,\nThe CrownSync Team`);
    setShowNudgeModal(true);
  };

  const confirmSendNudge = () => {
    setShowNudgeModal(false);
    setNudgeMessage('');
    addToast('Reminder sent successfully!', 'success');
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
  const adoptionRate = data?.metrics?.adoptionRate ?? campaign.adoptionRate ?? 0;
  const downloads = data?.metrics?.downloads ?? campaign.downloads ?? 0;
  const totalViews = data?.metrics?.totalViews ?? campaign.views ?? 0;
  const timeLeft = data?.metrics?.timeLeft || (campaign.endDate === 'Permanent' ? '∞' : '5 Days');
  
  const needsAttentionList = data?.needsAttention || [];
  const topContentList = data?.topPerformingContent || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Adoption Rate</div>
          <div className="text-3xl font-bold text-gray-900">{adoptionRate}%</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">+5% from last week</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Views</div>
          <div className="text-3xl font-bold text-gray-900">{totalViews.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1 font-medium">Retailer impressions</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Downloads</div>
          <div className="text-3xl font-bold text-gray-900">{downloads.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1 font-medium">Asset downloads</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Time Left</div>
          <div className="text-3xl font-bold text-gray-900">
            {timeLeft}
          </div>
          <div className="text-xs text-gray-400 mt-1 font-medium">{campaign.endDate === 'Permanent' ? 'No Expiration' : `Ends ${campaign.endDate}`}</div>
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
              <button 
                onClick={() => handleNudge()}
                className="w-full py-2 bg-gray-50 hover:bg-amber-50 text-gray-700 hover:text-amber-700 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition border border-transparent hover:border-amber-200"
              >
                 <Bell size={14}/> Nudge All
              </button>
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

      {/* --- Nudge Modal --- */}
      {showNudgeModal && createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in" onClick={() => setShowNudgeModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <MessageSquare size={20} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Smart Nudge</h3>
                  <p className="text-sm text-gray-500">Customize your reminder message</p>
                </div>
              </div>
              <button onClick={() => setShowNudgeModal(false)} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
                <X size={20}/>
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Content
              </label>
              <textarea
                value={nudgeMessage}
                onChange={(e) => setNudgeMessage(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                placeholder="Write a friendly reminder..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowNudgeModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmSendNudge}
                className="px-6 py-2 text-sm font-bold text-white bg-black hover:bg-gray-800 rounded-lg shadow-xs transition"
              >
                Send Reminder
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default OverviewTab;
