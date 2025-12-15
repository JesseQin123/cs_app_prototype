import React, { useState } from 'react';
import { 
  Plus, Mail, MessageSquare, Instagram, ChevronDown, ChevronUp, MoreHorizontal, 
  Search, Filter, Calendar, Zap, Users, BarChart3, ArrowRight, ArrowUpRight, 
  ArrowDownRight, CheckCircle2, Clock, Edit3, Trash2
} from 'lucide-react';
import PerformanceOverview from '../partner/PerformanceOverview';
import EmptyState from '../../components/EmptyState';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ActivityEditorModal from './ActivityEditorModal';
import { X } from 'lucide-react';


const DirectMarketingPage = () => {
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('All'); // All, Scheduled, Drafts, Sent
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [editorType, setEditorType] = useState(null); // email, social, sms

  // Mock Data
  const activities = [
    { id: 1, name: 'Summer Sale VIP Invite', type: 'email', audience: 'VIP Group', schedule: 'Draft', performance: null, status: 'Draft', date: '2025-06-01' },
    { id: 2, name: 'New Arrival Teaser', type: 'social', platform: 'Instagram', audience: 'All Followers', schedule: 'Tomorrow, 10am', performance: null, status: 'Scheduled', date: '2025-12-08' },
    { id: 3, name: 'Flash Sale Alert', type: 'sms', audience: 'High Spenders', schedule: 'Sent', performance: { metric: '15% Clicks', value: 15 }, status: 'Sent', date: '2025-12-05' },
    { id: 4, name: 'Weekly Newsletter', type: 'email', audience: 'All Subscribers', schedule: 'Sent', performance: { metric: '24% Open Rate', value: 24 }, status: 'Sent', date: '2025-12-01' },
    { id: 5, name: 'Product Spotlight', type: 'social', platform: 'Facebook', audience: 'All Followers', schedule: 'Sent', performance: { metric: '120 Likes', value: 120 }, status: 'Sent', date: '2025-11-28' },
  ];

  const kpis = [
    { label: 'Total Reach (MTD)', value: '2.4M', trend: '+12%', trendDir: 'up', icon: <Users size={16} /> },
    { label: 'Avg. Engagement', value: '4.2%', trend: '+0.8%', trendDir: 'up', icon: <MessageSquare size={16} /> },
    { label: 'Avg. Open Rate', value: '28%', trend: '-2%', trendDir: 'down', icon: <Mail size={16} /> },
    { label: 'Conversion Value', value: '$45.2k', trend: '+15%', trendDir: 'up', icon: <Zap size={16} /> },
  ];

  const filteredActivities = activities.filter(a => {
    if (activeTab === 'All') return true;
    return a.status === activeTab;
  });

  const getIcon = (type) => {
    switch(type) {
      case 'email': return <Mail size={16} className="text-blue-600" />;
      case 'social': return <Instagram size={16} className="text-pink-600" />;
      case 'sms': return <MessageSquare size={16} className="text-purple-600" />;
      default: return <Zap size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Draft': return 'bg-gray-100 text-gray-600';
      case 'Scheduled': return 'bg-blue-50 text-blue-700';
      case 'Sent': return 'bg-emerald-50 text-emerald-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden relative">
      <ActivityEditorModal isOpen={!!editorType} onClose={() => setEditorType(null)} type={editorType} />

      {/* --- 1. Sticky Header --- */}
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center sticky top-0 z-30 shadow-xs">
         <h1 className="text-2xl font-bold text-gray-900">Direct Marketing</h1>
         
         <div className="relative">
            <button 
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-lg ring-1 ring-black/5"
            >
              <Plus size={18} />
              Create Activity
            </button>
            
            {showCreateMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                 <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">Select Channel</div>
                 <button onClick={() => { setEditorType('email'); setShowCreateMenu(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 group">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition"><Mail size={16} /></div>
                    Create Email Blast
                 </button>
                 <button onClick={() => { setEditorType('social'); setShowCreateMenu(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 group">
                    <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center group-hover:bg-pink-100 transition"><Instagram size={16} /></div>
                    Create Social Post
                 </button>
                 <button onClick={() => { setEditorType('sms'); setShowCreateMenu(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 group">
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-100 transition"><MessageSquare size={16} /></div>
                    Create SMS
                 </button>
              </div>
            )}
            {/* Backdrop to close menu */}
            {showCreateMenu && <div className="fixed inset-0 z-40" onClick={() => setShowCreateMenu(false)}></div>}
         </div>
      </div>

      {/* --- Main Scrollable Content --- */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
        
        {/* --- 2. Performance Pulse (Section A) --- */}
        <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                   Performance Pulse
                   <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Live</span>
                </h2>
                <button 
                  onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                  className="text-gray-400 hover:text-black transition p-1 hover:bg-gray-100 rounded-full"
                >
                   {isOverviewExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
             </div>

             {isOverviewExpanded && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-300">
                  {kpis.map((kpi, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between h-32 hover:border-gray-300 transition group">
                       <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{kpi.label}</span>
                          <span className="text-gray-300 group-hover:text-gray-500 transition">{kpi.icon}</span>
                       </div>
                       <div>
                          <div className="text-3xl font-medium text-gray-900 mb-1">{kpi.value}</div>
                          <div className={`text-xs font-bold flex items-center gap-1 ${kpi.trendDir === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                             {kpi.trendDir === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                             {kpi.trend}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
             )}
        </div>

        {/* --- 3. Unified Activity List (Section B) --- */}
        <div className="space-y-6">
           {/* Tabs */}
           <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-fit">
              {['All', 'Scheduled', 'Drafts', 'Sent'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${activeTab === tab ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab}
                </button>
              ))}
           </div>

           {/* Grid List */}
           <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden min-h-[400px]">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wide">
                 <div className="col-span-4">Activity Name</div>
                 <div className="col-span-1 text-center">Type</div>
                 <div className="col-span-2">Audience</div>
                 <div className="col-span-2">Schedule</div>
                 <div className="col-span-2">Performance</div>
                 <div className="col-span-1 text-right">Action</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-100">
                 {filteredActivities.length === 0 ? (
                    <EmptyState 
                      icon={Calendar}
                      title="No activities found"
                      description={`You haven't created any ${activeTab.toLowerCase()} activities yet.`}
                      actionLabel="Create Activity"
                      onAction={() => setShowCreateMenu(true)}
                    />
                 ) : (
                    filteredActivities.map((activity) => (
                      <div key={activity.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition group">
                         {/* Name */}
                         <div className="col-span-4">
                            <div className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition cursor-pointer">{activity.name}</div>
                            <div className="text-xs text-gray-400 mt-0.5 font-mono">{activity.platform || 'Subject: ' + activity.name}</div>
                         </div>
                         
                         {/* Type */}
                         <div className="col-span-1 flex justify-center">
                            <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center">
                               {getIcon(activity.type)}
                            </div>
                         </div>

                         {/* Audience */}
                         <div className="col-span-2 text-sm text-gray-600 font-medium">
                            {activity.audience}
                         </div>

                         {/* Schedule */}
                         <div className="col-span-2">
                             {activity.status === 'Draft' && <span className="text-gray-300 font-mono">—</span>}
                             {activity.status === 'Scheduled' && (
                               <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-1 rounded-sm text-xs font-bold w-fit">
                                  <Clock size={12} /> {activity.schedule}
                               </div>
                             )}
                             {activity.status === 'Sent' && (
                               <div className="text-xs text-gray-500">
                                  {activity.date}
                               </div>
                             )}
                         </div>

                         {/* Performance */}
                         <div className="col-span-2">
                             {activity.performance ? (
                                <div className="flex items-center gap-2">
                                   <div className="text-sm font-bold text-gray-900">{activity.performance.metric}</div>
                                   {/* Mini Sparkline Idea */}
                                </div>
                             ) : (
                                <span className="text-gray-300 text-xs">No data</span>
                             )}
                         </div>
                         
                         {/* Action / Status */}
                         <div className="col-span-1 flex justify-end gap-2 items-center">
                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                               {activity.status}
                            </span>
                            <button className="text-gray-300 hover:text-gray-600 p-1 opacity-0 group-hover:opacity-100 transition">
                               <MoreHorizontal size={16} />
                            </button>
                         </div>
                      </div>
                    ))
                 )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default DirectMarketingPage;
