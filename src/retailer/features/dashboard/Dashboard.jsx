import React, { useState } from 'react';
import { 
  CheckCircle, ArrowRight, Mail, MessageCircle, 
  Users, TrendingUp, Zap, Target,
  Instagram, Facebook, Twitter, MapPin, 
  ChevronLeft, ChevronRight, Layers, FileText, MessageSquare, AlertCircle, ArrowUpRight,
  Eye, UserCheck // Added Icons
} from 'lucide-react';
import { 
  retailerStatus, onboardingTasks, dashboardStats, actionQueue, 
  inboxSnapshot, recentActivity, getFreshDrops, showEmptyState 
} from '../../../data/mockStore/dashboardStore';
import { brands } from '../../../data/mockStore/brandStore';
import { currentRetailerUser } from '../../../data/mockStore/retailerStore';

const emptyStats = {
  activities: { value: 0, brands: 0, channels: { email: 0, social: 0 } },
  reach: { value: 0, trend: 0 },
  inbox: { value: 0, channels: { email: 0, chat: 0 } },
};

// --- Styles for Hover Scrollbar ---
const scrollbarStyles = `
  .hover-scroll::-webkit-scrollbar {
    width: 4px;
  }
  .hover-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .hover-scroll::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 20px;
  }
  .hover-scroll:hover::-webkit-scrollbar-thumb {
    background: #E5E7EB; /* gray-200 */
  }
`;

// --- Widget Components ---

const OnboardingGuide = ({ tasks, progress }) => {
  return (
    <div className="col-span-full bg-gray-900 text-white rounded-xl p-6 shadow-sm mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-medium mb-1">Welcome to CrownSync! Let's activate your store.</h2>
          <p className="text-gray-400 text-sm">Complete these steps to unlock full platform potential.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold mb-1">{progress}/{tasks.length}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Completed</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className={`p-4 rounded-lg border transition-colors ${task.status === 'completed' ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-gray-800 bg-gray-800/50'}`}>
            <div className="flex justify-between items-start mb-3">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${task.priority === 'P0' ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-400'}`}>
                {task.priority}
              </span>
              {task.status === 'completed' && <CheckCircle size={16} className="text-emerald-500" />}
            </div>
            <h3 className="font-semibold text-sm mb-1">{task.title}</h3>
            <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">{task.desc}</p>
            {task.status !== 'completed' && (
              <button className="w-full py-2 text-xs font-semibold bg-white text-gray-900 rounded hover:bg-gray-200 transition-colors">
                {task.action}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const StatsBar = ({ stats, onNavigate }) => {
  // Check emptiness based on values (assuming 0 means empty for this logic)
  const isActivitiesEmpty = stats.activities.value === 0;
  const isReachEmpty = stats.reach.value === 0;
  const isInboxEmpty = stats.inbox.value === 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* Card 1: Activities Published (The Hustle) */}
      <div 
        className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow flex flex-col justify-between h-36"
      >
        <div className="flex justify-between items-start">
           <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Activities Published <span className="normal-case opacity-60 ml-0.5 font-medium tracking-normal">(30d)</span></h3>
           <Zap size={18} className="text-gray-400" />
        </div>
        <div>
          {isActivitiesEmpty ? (
             <>
               <div className="text-3xl font-bold text-gray-200 tracking-tight mb-2">0</div>
               <button 
                 onClick={() => onNavigate('brand-center-campaigns')}
                 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-900 group"
               >
                 <span className="border-b border-gray-300 group-hover:border-brand-gold transition-colors pb-0.5">Pick a Campaign</span>
                 <ArrowRight size={10} className="text-gray-400 group-hover:text-brand-gold transition-colors -ml-0.5" />
               </button>
             </>
          ) : (
            <>
              <div className="text-3xl font-bold text-gray-900 tracking-tight mb-2">{stats.activities.value}</div>
              <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                <span className="text-gray-900 font-bold">{stats.activities.brands} Brand</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="flex items-center gap-1"><Mail size={12} /> {stats.activities.channels.email}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="flex items-center gap-1"><Instagram size={12} /> {stats.activities.channels.social}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Card 2: Audience Reached (The Impact) */}
      <div 
        onClick={() => onNavigate('analytics')}
        className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow flex flex-col justify-between h-36 cursor-pointer group"
      >
        <div className="flex justify-between items-start">
           <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide group-hover:text-brand-gold transition-colors">Audience Reached <span className="normal-case opacity-60 ml-0.5 font-medium tracking-normal">(30d)</span></h3>
           <div className="relative w-5 h-5">
              <Eye size={18} className="text-gray-400 absolute top-0 right-0 transition-all duration-300 group-hover:opacity-0 group-hover:scale-75" />
              <ChevronRight size={18} className="text-brand-gold absolute top-0 right-0 transition-all duration-300 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100" />
           </div>
        </div>
        <div>
          {isReachEmpty ? (
            <>
               <div className="text-3xl font-bold text-gray-200 tracking-tight mb-2">--</div>
               <div className="text-xs text-gray-400 font-medium">Start marketing to see impact.</div>
            </>
          ) : (
            <>
              <div className="text-3xl font-bold text-gray-900 tracking-tight mb-2">{stats.reach.value.toLocaleString()}</div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-600">
                   <ArrowUpRight size={10} className="mr-1" /> {stats.reach.trend}%
                </span>
                <span className="text-xs text-gray-400 font-medium">vs last 30d</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Card 3: Needs Reply (The Urgency) */}
      <div 
        onClick={() => onNavigate('inbox')}
        className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow flex flex-col justify-between h-36 cursor-pointer group"
      >
        <div className="flex justify-between items-start">
           <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide group-hover:text-brand-gold transition-colors">Needs Reply</h3>
           <div className="relative w-5 h-5">
              <MessageSquare size={18} className="text-gray-400 absolute top-0 right-0 transition-all duration-300 group-hover:opacity-0 group-hover:scale-75" />
              <ChevronRight size={18} className="text-brand-gold absolute top-0 right-0 transition-all duration-300 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100" />
           </div>
        </div>
        <div>
           {isInboxEmpty ? (
             <>
                <div className="text-3xl font-bold text-gray-200 tracking-tight mb-2">0</div>
                <div className="flex items-center gap-1.5">
                   <CheckCircle size={12} className="text-emerald-500" />
                   <span className="text-xs text-gray-400 font-medium">You're all caught up!</span>
                </div>
             </>
           ) : (
             <>
                <div className="text-3xl font-bold text-gray-900 tracking-tight mb-2">{stats.inbox.value}</div>
                <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                  <span className="flex items-center gap-1"><Mail size={12} /> {stats.inbox.channels.email}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="flex items-center gap-1"><MessageCircle size={12} /> {stats.inbox.channels.chat}</span>
                </div>
             </>
           )}
        </div>
      </div>
    </div>
  );
};

const ActionQueueWidget = ({ items }) => {
  const getTypeIcon = (type) => {
    switch (type.toUpperCase()) {
      case 'DRAFT': return <FileText size={16} className="text-orange-500" />;
      case 'INBOX': return <MessageSquare size={16} className="text-blue-500" />;
      case 'SYSTEM': return <AlertCircle size={16} className="text-purple-500" />;
      default: return <Zap size={16} className="text-gray-500" />;
    }
  };

  const getTypeStyle = (type) => {
     switch (type.toUpperCase()) {
       case 'DRAFT': return 'bg-orange-50 border-orange-100 text-orange-700';
       case 'INBOX': return 'bg-blue-50 border-blue-100 text-blue-700';
       case 'SYSTEM': return 'bg-purple-50 border-purple-100 text-purple-700';
       default: return 'bg-gray-50 border-gray-200';
     }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] h-full flex flex-col overflow-hidden">
      <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-white z-10 shrink-0">
        <h3 className="font-semibold text-gray-900 flex items-center gap-3 text-base">
          <Zap size={18} className="text-gray-400" /> Action Queue
        </h3>
        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-full uppercase tracking-wider">{items.length} Pending</span>
      </div>
      <div className="p-2 flex-1 overflow-y-auto hover-scroll">
        {items.map((item) => (
          <div key={item.id} className="p-3 hover:bg-gray-50 rounded-lg transition-all cursor-pointer group flex gap-3 items-start mb-1">
            
            {/* Type Icon Box */}
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${getTypeStyle(item.type)}`}>
               {getTypeIcon(item.type)}
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <h4 className="font-medium text-gray-900 text-sm mb-0.5">{item.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-1 font-normal group-hover:text-gray-600">
                <span className="font-semibold uppercase text-[10px] tracking-wide opacity-70 mr-1.5">{item.type}</span>
                {item.desc}
              </p>
            </div>
             <div className="self-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight size={14} className="text-gray-400" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InboxSnapshotWidget = ({ messages }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] h-full flex flex-col overflow-hidden">
      <div className="p-5 border-b border-gray-50 flex justify-between items-center shrink-0">
        <h3 className="font-semibold text-gray-900 flex items-center gap-3 text-base">
          <Mail size={18} className="text-gray-400" /> Inbox Snapshot
        </h3>
        <button className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1 group">
           View All <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
      <div className="divide-y divide-gray-50 overflow-y-auto flex-1 hover-scroll">
        {messages.map((msg) => (
          <div key={msg.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 items-start group">
            <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden shrink-0 ring-1 ring-gray-100 mt-0.5">
               <img 
                 src={msg.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.user.name)}&background=f4f4f5&color=18181b`} 
                 alt={msg.user.name} 
                 className="w-full h-full object-cover" 
               />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h4 className="font-medium text-sm text-gray-900 truncate">{msg.user.name}</h4>
                <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">{msg.time}</span>
              </div>
              <p className="text-xs text-gray-500 truncate group-hover:text-gray-700 transition-colors font-normal">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecommendedCampaignsWidget = ({ campaigns }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featured = campaigns.length > 0 ? campaigns[currentIndex] : null;

  // Find the exact brand object using the name or default to existing data
  const brand = featured ? brands.find(b => b.name === featured.brandName) : null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % campaigns.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-5 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-3 text-base">
          <Layers size={18} className="text-gray-400" />Recommended Campaigns
        </h3>
        <div className="flex gap-2">
           <button 
             onClick={handlePrev}
             disabled={campaigns.length <= 1}
             className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-400"
           >
              <ChevronLeft size={14} />
           </button>
           <button 
             onClick={handleNext}
             disabled={campaigns.length <= 1}
             className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-400"
           >
              <ChevronRight size={14} />
           </button>
        </div>
      </div>
      
      {featured ? (
        <div className="flex-1 flex overflow-hidden rounded-xl bg-gray-50 border border-gray-100 shadow-sm transition-all hover:shadow-md group">
           {/* Left: Image (Fixed 16:9 Ratio based on container height) */}
           <div className="relative h-full aspect-video shrink-0 bg-gray-200">
              <img 
                src={featured.coverImage} 
                alt={featured.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              
              {/* New Tag */}
              {featured.isNew && (
                <div className="absolute top-3 left-3 bg-[#FCD34D] text-gray-900 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider shadow-sm z-10">
                   New
                </div>
              )}
           </div>
           
           {/* Right: Content */}
           <div className="flex-1 p-5 lg:p-6 flex flex-col justify-center text-left bg-white relative">
             
             {/* Brand */}
             <div className="flex items-center gap-2 mb-3">
               <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-gray-100 overflow-hidden shrink-0 shadow-sm p-0.5">
                  {brand?.logo ? (
                    <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-[10px] font-bold text-gray-900">{featured.brandName?.[0] || "V"}</span>
                  )}
               </div>
               <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                  {featured.brandName || "Verragio"}
               </span>
             </div>
             
             {/* Title */}
             <h4 className="text-gray-900 font-bold text-base lg:text-lg leading-tight mb-4 line-clamp-2">
                {featured.title}
             </h4>
             
             {/* Action */}
             <div className="mt-auto">
               <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-900 hover:text-gray-600 transition-colors group/btn">
                 View Campaign
                 <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
               </button>
             </div>
           </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm font-medium">No new recommendations</p>
        </div>
      )}
    </div>
  );
};

const PerformanceWidget = ({ activities }) => {
  const getIcon = (platform) => {
    switch(platform) {
      case 'instagram': return <Instagram size={16} />;
      case 'facebook': return <Facebook size={16} />;
      case 'gbp': return <MapPin size={16} />;
      case 'twitter': return <Twitter size={16} />;
      case 'email': return <Mail size={16} />;
      default: return <Users size={16} />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-5 h-full flex flex-col overflow-hidden">
      <h3 className="font-semibold text-gray-900 flex items-center gap-3 text-base mb-4 shrink-0">
        <TrendingUp size={18} className="text-gray-400" /> Recent Performance
      </h3>
      <div className="space-y-4 flex-1 overflow-y-auto hover-scroll pr-1">
        {activities.map((act) => {
          // Parse Metric: Separate Number/Value from Text Unit
          // simple split by first space finding
          const parts = act.metric.split(' ');
          const value = parts[0]; 
          const unit = parts.slice(1).join(' ');

          return (
            <div key={act.id} className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0 group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center transition-all group-hover:bg-gray-100 group-hover:text-gray-800 shrink-0 border border-gray-100">
                  {getIcon(act.platform)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate max-w-[140px] leading-tight mb-0.5">{act.title}</div>
                  <div className="text-[10px] text-gray-400 font-medium badge uppercase tracking-wide">
                    Updated {act.date}
                  </div>
                </div>
              </div>
              
              {/* Metric Display */}
              <div className="text-right shrink-0 pl-2">
                <div className="flex flex-col items-end justify-center">
                    <span className="text-base font-bold text-gray-900 leading-none">{value}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{unit}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// --- Main Page Component ---

const Dashboard = ({ user = currentRetailerUser, onNavigate }) => {
  // Use mock data
  const { isOnboarding, onboardingProgress } = retailerStatus;
  const freshDrops = getFreshDrops();
  
  // Conditionally use empty stats if showEmptyState is true
  const currentStats = showEmptyState ? emptyStats : dashboardStats;

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="p-8 w-full bg-gray-50/30 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
        
          {/* Dynamic Warning Header (If Onboarding) or Smart Welcome Header */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                Welcome back, {user.name}
              </h1>
              <p className="text-gray-500">Here’s what’s happening in {user.storeName || 'your store'} today.</p>
            </div>
            {/* Removed Date Widget as requested */}
          </div>

          {/* Dynamic Top Section */}
          {isOnboarding ? (
            <OnboardingGuide tasks={onboardingTasks} progress={onboardingProgress} />
          ) : (
            <StatsBar stats={currentStats} onNavigate={onNavigate} />
          )}

          {/* Core Workspace - Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">
            
            {/* Top Row */}
            <div className="col-span-2 h-[280px]">
              <ActionQueueWidget items={actionQueue} />
            </div>
            <div className="col-span-1 h-[280px]">
              <InboxSnapshotWidget messages={inboxSnapshot} />
            </div>

            {/* Bottom Row */}
            <div className="col-span-2 h-[280px]">
              <RecommendedCampaignsWidget campaigns={freshDrops} />
            </div>
            <div className="col-span-1 h-[280px]">
              <PerformanceWidget activities={recentActivity} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
