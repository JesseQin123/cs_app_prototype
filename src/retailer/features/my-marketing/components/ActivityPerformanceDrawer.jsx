
import React, { useState, useEffect } from 'react';
import Drawer from '@/components/Drawer';
import { 
    Mail, ExternalLink, Eye, X, Send, User, MessageSquare, 
    ThumbsUp, Share2, AlertTriangle, CheckCircle2, Clock, 
    ChevronRight, RefreshCw, BarChart2, Hash, ChevronDown, Filter, MousePointerClick 
} from 'lucide-react';
import { getActivityPerformance } from '@/data/mockStore/activityPerformanceStore';

// Social Icons
import { Instagram, Facebook, Twitter } from 'lucide-react';

// Charts
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

// --- Sub-Components ---

const KPICard = ({ label, value, subtext, highlight = false }) => (
    <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col items-center text-center hover:border-gray-200 transition-colors">
        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">{label}</div>
        <div className={`text-3xl font-light text-gray-900 mb-2 ${highlight ? 'font-normal' : ''}`}>{value}</div>
        {subtext && <div className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{subtext}</div>}
    </div>
);

/**
 * Renders Email Trends with Delivery/Open/Click rates
 */
const EmailTrendAnalysis = ({ data }) => {
    const trends = data.trends || [];
    
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-xs mb-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <BarChart2 size={16} className="text-blue-600"/> Performance Trends
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Delivery vs Engagement over last 14 days</p>
                </div>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                         <defs>
                            <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorClick" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="date" 
                            tick={{fontSize: 10, fill: '#94a3b8'}} 
                            axisLine={false} 
                            tickLine={false} 
                            dy={10}
                        />
                        <YAxis 
                            tick={{fontSize: 10, fill: '#94a3b8'}} 
                            axisLine={false} 
                            tickLine={false} 
                            dx={-10}
                            domain={[0, 100]}
                        />
                        <Tooltip 
                            contentStyle={{borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                            itemStyle={{fontSize: '12px', fontWeight: 600}}
                            labelStyle={{fontSize: '11px', color: '#64748b', marginBottom: '4px'}}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="openRate" 
                            name="Open Rate (%)"
                            stroke="#3b82f6" 
                            strokeWidth={2} 
                            fillOpacity={1} 
                            fill="url(#colorOpen)" 
                        />
                        <Area 
                            type="monotone" 
                            dataKey="clickRate" 
                            name="Click Rate (%)"
                            stroke="#10b981" 
                            strokeWidth={2} 
                            fillOpacity={1} 
                            fill="url(#colorClick)" 
                        />
                        {/* Delivery Rate is usually flat, maybe skip or use line */}
                        <Area 
                            type="step"
                            dataKey="deliveryRate"
                            name="Delivery Rate (%)"
                            stroke="#94a3b8"
                            strokeWidth={1}
                            strokeDasharray="4 4"
                            fill="none"
                        />
                         <Legend iconType="circle" wrapperStyle={{fontSize: '11px', paddingTop: '20px'}}/>
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


/**
 * Renders Social Trends with Chart and Platform Switcher
 */
// --- Social Dashboard Wrapper with Unified Filter ---


// --- Social Dashboard Wrapper with Unified Filter ---
const SocialPerformanceDashboard = ({ data, activity }) => {
    const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');

    // Derive platforms from activity
    const platforms = ['All Platforms'];
    if (Array.isArray(activity.platform)) {
        activity.platform.forEach(p => platforms.push(p.charAt(0).toUpperCase() + p.slice(1)));
    } else if (activity.platform) {
        platforms.push(activity.platform.charAt(0).toUpperCase() + activity.platform.slice(1));
    }

    // Mock Filtering Logic: Scale numbers if filtered
    const isFiltered = selectedPlatform !== 'All Platforms';
    const filterFactor = isFiltered ? 0.6 : 1; // Simulate subset data

    const filteredMetrics = {
        engagement: data.metrics.engagement ? Math.round((parseInt(data.metrics.engagement.toString().replace(/,/g, '').replace(/K/g, '000')) || 0) * filterFactor).toLocaleString() : '0',
        reach: data.metrics.reach ? Math.round((parseInt(data.metrics.reach.toString().replace(/,/g, '').replace(/K/g, '000')) || 0) * filterFactor).toLocaleString() : '0',
        likes: data.metrics.likes ? Math.round((parseInt(data.metrics.likes.toString().replace(/,/g, '').replace(/K/g, '000')) || 0) * filterFactor).toLocaleString() : '0',
        comments: data.metrics.comments ? Math.round((parseInt(data.metrics.comments.toString().replace(/,/g, '').replace(/K/g, '000')) || 0) * filterFactor).toLocaleString() : '0',
    };

    const filteredTrends = (data.trends || []).map(t => ({
        ...t,
        engagement: Math.round(t.engagement * filterFactor),
        reach: Math.round(t.reach * filterFactor)
    }));
    
    // Platform Switcher Helper
    const renderPlatformSwitcher = () => (
        <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2">Platform:</span>
            <div className="flex bg-gray-100 p-1 rounded-lg">
                {platforms.map(p => (
                   <button
                        key={p}
                        onClick={() => setSelectedPlatform(p)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                            selectedPlatform === p 
                                ? 'bg-white text-gray-900 shadow-xs' 
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                   >
                       <div className="flex items-center gap-1.5">
                            {p !== 'All Platforms' && getPlatformIcon(p)}
                            <span>{p === 'All Platforms' ? 'All' : p}</span>
                       </div>
                   </button>
                ))}
            </div>
        </div>
    );

    // Helper to get raw icon for switcher
    const getPlatformIcon = (p) => {
        const lowerP = (p || '').toLowerCase();
        if (lowerP.includes('instagram')) return <Instagram size={12} className="text-pink-600"/>;
        if (lowerP.includes('facebook')) return <div className="w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center text-[8px] text-white font-bold">f</div>;
        if (lowerP.includes('twitter') || lowerP.includes('x')) return <div className="w-3 h-3 bg-black rounded-xs flex items-center justify-center text-white font-black text-[8px]">𝕏</div>;
        return null; // Fallback
    };

    return (
        <div>
            {/* Unified Filter UI */}
            {/* Unified Filter UI */}
            {platforms.length > 2 && renderPlatformSwitcher()}

            {/* Scorecard */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <KPICard label="Engagement" value={filteredMetrics.engagement} subtext="Likes + Comments" highlight />
                <KPICard label="Impressions" value={filteredMetrics.reach} subtext="Total Reach" />
                <KPICard label="Likes" value={filteredMetrics.likes} subtext={<><ThumbsUp size={8} className="inline mr-1"/>Reactions</>} />
                <KPICard label="Comments" value={filteredMetrics.comments} subtext={<><MessageSquare size={8} className="inline mr-1"/>Replies</>} />
            </div>

            {/* Trends Chart */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-xs mb-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <BarChart2 size={16} className="text-emerald-600"/> Engagement Trends
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Daily engagement performance on <span className="font-medium text-gray-600">{selectedPlatform}</span> • Last 14 Days</p>
                    </div>
                </div>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={filteredTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="date" 
                                tick={{fontSize: 10, fill: '#94a3b8'}} 
                                axisLine={false} 
                                tickLine={false} 
                                dy={10}
                            />
                            <YAxis 
                                tick={{fontSize: 10, fill: '#94a3b8'}} 
                                axisLine={false} 
                                tickLine={false} 
                                dx={-10}
                            />
                            <Tooltip 
                                contentStyle={{borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                itemStyle={{fontSize: '12px', fontWeight: 600}}
                                labelStyle={{fontSize: '11px', color: '#64748b', marginBottom: '4px'}}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="engagement" // Green
                                stroke="#10b981" 
                                strokeWidth={2} 
                                fillOpacity={1} 
                                fill="url(#colorEngage)" 
                                name="Engagement"
                            />
                            <Area 
                                type="monotone" 
                                dataKey="reach" // Blue
                                stroke="#60a5fa" 
                                strokeWidth={2} 
                                fillOpacity={1} 
                                fill="url(#colorReach)" 
                                name="Reach"
                            />
                             <Legend iconType="circle" wrapperStyle={{fontSize: '11px', paddingTop: '20px'}}/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const SocialCommentsList = ({ list, activity }) => {
    const [filterPlatform, setFilterPlatform] = useState('All');
    const [isOpen, setIsOpen] = useState(false);

    // Platform Icon Helper (Reused logic)
    const getPlatformIcon = (p) => {
        const lowerP = (p || '').toLowerCase();
        switch(lowerP) {
            case 'instagram': return <Instagram size={12} className="text-pink-600"/>;
            case 'facebook': return <div className="w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center text-[8px] text-white font-bold">f</div>;
            case 'x': 
            case 'twitter': return <div className="w-3 h-3 bg-black rounded-xs flex items-center justify-center text-white font-black text-[8px]">𝕏</div>;
            default: return <MessageSquare size={12} className="text-gray-500"/>;
        }
    };

    // Filter Logic
    const filteredList = filterPlatform === 'All' ? list : list; // In real mock, add platform property to comment items to filter

    const platforms = ['All'];
    if (Array.isArray(activity.platform)) {
        activity.platform.forEach(p => platforms.push(p));
    } else if (activity.platform) {
        platforms.push(activity.platform);
    }

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-gray-100 p-6 shadow-xs overflow-hidden">
             <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                     <MessageSquare size={16} className="text-gray-600"/> Activity Log
                </h3>
                
                {/* Filter Bar */}
                 <div className="relative">
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <Filter size={12}/> {filterPlatform === 'All' ? 'All Platforms' : filterPlatform}
                    </button>
                    {isOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                            <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-lg p-1 z-50 animate-in fade-in zoom-in-95">
                                {platforms.map(p => (
                                    <button 
                                        key={p} 
                                        onClick={() => { setFilterPlatform(p); setIsOpen(false) }}
                                        className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-md capitalize"
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            {filteredList && filteredList.map((item) => (
                <div key={item.id} className="group flex items-start gap-4 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors rounded-lg px-2 -mx-2">
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-white shadow-xs flex items-center justify-center text-xs font-bold text-gray-900 shrink-0">
                        {item?.user?.name?.substring(0,2).toUpperCase() ?? '??'}
                        </div>
                        <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-gray-900 text-sm">{item?.user?.name ?? 'Unknown User'}</h4>
                            <span className="text-[10px] text-gray-400">{item?.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 font-light leading-relaxed">"{item?.content}"</p>
                        <button className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 transition">
                            <MessageSquare size={12}/> 
                            Reply on 
                            {/* Intelligent Icon Display: Handle Array */}
                            {getPlatformIcon(Array.isArray(activity.platform) ? activity.platform[0] : (activity.platform || 'instagram'))}
                        </button>
                        </div>
                </div>
            ))}
            {filteredList.length === 0 && (
                <div className="py-20 text-center text-gray-300 text-sm font-light">No comments yet.</div>
            )}
            </div>
        </div>
    );
};

// --- Main Component ---

const ActivityPerformanceDrawer = ({ isOpen, onClose, activity }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('all'); // Only for Email types now
    const [emailCompose, setEmailCompose] = useState(null); // { contact }

    // Fetch Data on Open
    useEffect(() => {
        if (isOpen && activity) {
            setLoading(true);
            // Simulate API latency
            setTimeout(() => {
                // SMS uses email-like data structure for now (delivery stats)
                const typeArg = ['email', 'sms'].includes(activity.type) ? 'email' : 'social';
                const perfData = getActivityPerformance(activity.id, typeArg);
                setData(perfData);
                setLoading(false);
                // Set default tab based on type
                setActiveTab('all');
            }, 600);
        } else {
            // Do NOT clear data on close to allow exit animation to show content
            // setData(null); 
        }
    }, [isOpen, activity]);

    // Use a safety check for rendering content, but allow Drawer to render for exit animation
    // If activity is null but we are open (shouldn't happen) or closing (might happen if parent clears activity),
    // we try to render if data exists.
    
    // Derived type from activity OR data (if closing)
    const displayActivity = activity || data;

    // --- Renders ---

    const renderChannelIcon = (type) => {
        const t = (type || '').toLowerCase();
        
        // Email
        if (t === 'email') {
            return <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100" title="Email"><Mail size={12}/></div>;
        }
        
        // SMS
        if (t === 'sms') {
             return <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100" title="SMS"><MessageSquare size={12}/></div>;
        }

        // Social Helper
        const getPlatformIcon = (p) => {
            if (typeof p !== 'string') return <MessageSquare size={14} className="text-gray-500"/>;

            const lowerP = (p || '').toLowerCase();
            switch(lowerP) {
                case 'instagram': return <Instagram size={14} className="text-pink-600"/>;
                case 'facebook': return <div className="w-3.5 h-3.5 bg-blue-600 rounded-full flex items-center justify-center text-[9px] text-white font-bold">f</div>;
                case 'x': 
                case 'twitter': return <div className="w-3.5 h-3.5 bg-black rounded-xs flex items-center justify-center text-white font-black text-[10px]">𝕏</div>;
                case 'google':
                case 'gmb': 
                case 'google business profile': return <div className="w-3.5 h-3.5 rounded-xs flex items-center justify-center text-white font-bold text-[9px]" style={{backgroundColor: '#4285F4'}}>G</div>;
                default: return <MessageSquare size={14} className="text-gray-500"/>;
            }
        };

        // If platform is provided, use it (ActivityList logic)
        const platform = activity?.platform; // Use optional chaining as activity might be null during close if cleared in parent
        if (['email', 'sms'].includes(t)) {
             // handled above
        } else {
             // Handle Array of Platforms
             if (Array.isArray(platform)) {
                return (
                    <div className="flex items-center -space-x-1.5">
                        {platform.map((p, idx) => (
                            <div key={idx} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shadow-xs border border-white z-10 relative">
                                {getPlatformIcon(p)}
                            </div>
                        ))}
                    </div>
                );
             }

             // Single Platform
             return (
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shadow-xs border border-white">
                    {getPlatformIcon(platform || type)}
                </div>
            );
        }
    };



    // --- Email Logic ---
    const renderEmailScorecard = () => (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <KPICard label="Open Rate" value={data?.metrics?.openRate ?? '0%'} subtext={`${data?.metrics?.uniqueOpens ?? 0} Opens`} highlight />
            <KPICard label="Click Rate" value={data?.metrics?.clickRate ?? '0%'} subtext={`${data?.metrics?.uniqueClicks ?? 0} Clicks`} highlight />
            <KPICard label="Delivery" value={data?.metrics?.deliveryRate ?? '0%'} subtext={`${data?.metrics?.delivered ?? 0} / ${data?.metrics?.sent ?? 0}`} />
            <KPICard label="Unsubscribes" value={data?.metrics?.unsubscribes ?? 0} subtext="Opt-outs" />
        </div>
    );

    const renderEmailList = () => {
        const filteredList = data.actionableList.filter(item => {
            if (activeTab === 'all') return true;
            return item.type === activeTab;
        });

        return (
            <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-gray-100 p-6 shadow-xs overflow-hidden">
                <div className="flex items-center justify-between mb-4 shrink-0">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                         <MousePointerClick size={16} className="text-gray-600"/> Activity Log
                    </h3>
                    
                    {/* Tabs */}
                    <div className="flex items-center gap-4">
                        {['all', 'clicked', 'opened', 'bounced'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-1 text-xs font-medium border-b-2 transition-colors relative ${
                                    activeTab === tab ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)} 
                                {tab === 'clicked' && <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block align-middle mb-0.5"></span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                    {filteredList.map((item) => (
                        <div key={item.id} className="group flex items-center justify-between py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors rounded-lg px-2 -mx-2">
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div className="relative">
                                    {item?.contact?.avatar || item?.contact?.email?.includes('fake') ? (
                                         <img src={item?.contact?.avatar || `https://ui-avatars.com/api/?name=Unknown`} alt="" className="w-10 h-10 rounded-full object-cover bg-gray-100 ring-2 ring-white" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 ring-2 ring-white"><User size={20}/></div>
                                    )}
                                </div>
                                
                                {/* Content */}
                                <div>
                                    <h4 className="font-medium text-gray-900 text-sm mb-0.5">{item?.contact?.name || item?.contact?.email || 'Unknown Contact'}</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 text-xs">
                                             {item.type === 'clicked' ? (
                                                <span className="text-gray-900 font-medium flex items-center gap-1.5">
                                                    Action: <span className="underline decoration-gray-300 underline-offset-2">{item?.status?.replace('Clicked ', '').replace(/"/g, '')}</span>
                                                </span>
                                            ) : item.type === 'bounced' ? (
                                                <span className="text-red-600 flex items-center gap-1">
                                                    Address not found
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">
                                                    Opened email
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-gray-300">•</span>
                                        <span className="text-[10px] text-gray-400">{item.time}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => setEmailCompose({ contact: item?.contact })}
                                    className="p-2 border border-gray-200 text-gray-700 hover:text-black hover:border-black rounded-lg transition bg-white" 
                                    title="Personal Email Follow-up"
                                >
                                    <Mail size={16}/>
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredList.length === 0 && (
                        <div className="py-20 text-center text-gray-300 text-sm font-light">No activity found in this category.</div>
                    )}
                </div>
            </div>
        );
    };

    // --- Social Logic ---
    // --- Loading State ---

    // --- Loading State ---
    const renderSkeleton = () => (
        <div className="animate-pulse space-y-10 mt-4 h-full">
            <div className="grid grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-50 rounded-xl"></div>)}
            </div>
            <div className="space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-50 rounded-xl"></div>)}
            </div>
        </div>
    );

    // --- Brand Helper ---
    const getBrandInfo = (brandId) => {
        if (brandId === 'b-verragio') return { name: 'Verragio', initial: 'V' };
        if (brandId === 'b-rolex') return { name: 'Rolex', initial: 'R' };
        if (brandId === 'b-cartier') return { name: 'Cartier', initial: 'C' };
        return { name: 'Brand', initial: 'B' };
    };

    const brand = getBrandInfo(activity?.brandId);

    return (
        <Drawer 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Activity Performance"
            width="w-full md:w-[820px]" // User explicit width preference (High Def for Charts)
        >
            <div className="px-10 py-8 font-sans">
                
                {/* Header Section */}
                {/* Compact Header Section */}
                <div className="mb-6 border-b border-gray-100 pb-5">
                     <div className="flex items-start justify-between">
                        <div className="flex-1 pr-8">
                            {/* Row 1: Title & Status */}
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-xl font-medium text-gray-900 tracking-tight leading-none">{displayActivity?.internalName || 'Loading...'}</h2>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                    ['Sent', 'Posted'].includes(data?.status) 
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                        : 'bg-gray-100 text-gray-600 border-gray-200'
                                }`}>
                                    {data?.status || 'Sent'}
                                </span>
                            </div>

                            {/* Row 2: Unified Metadata Line */}
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                {/* Channel & Date */}
                                <div className="flex items-center gap-2">
                                     {displayActivity && renderChannelIcon(displayActivity.type || displayActivity.platform)}
                                     <span className="text-gray-600">
                                        Published on {data?.sentAt || 'Dec 12'}
                                    </span>
                                </div>
                                
                                <span className="text-gray-300">|</span>

                                {/* Source Info (Plain text style to save space) */}
                                <div className="flex items-center gap-1.5">
                                    <span className="text-gray-400">Source:</span>
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold text-gray-900">{brand.name}</span>
                                        <ChevronRight size={10} className="text-gray-300"/>
                                        <span className="text-gray-700 border-b border-gray-200 hover:border-gray-900 cursor-pointer transition-colors pb-px">
                                            {data?.campaignName || 'Summer Sale 2025'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Preview Button */}
                        <button className="shrink-0 flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-700 hover:text-black border border-gray-200 hover:border-gray-900 rounded-lg transition-all" title="View Content Snapshot">
                            <Eye size={14}/> View Content
                        </button>
                     </div>
                </div>

                {/* Scorecard & List Area - Natural Flow (No inner scroll) */}
                <div>
                    {(loading || !data) ? (
                        renderSkeleton()
                    ) : (
                        <>
                            {/* KPI & Charts */}
                            {displayActivity && ['email', 'sms'].includes(displayActivity.type) ? (
                                <>
                                    {renderEmailScorecard()}
                                    <EmailTrendAnalysis data={data} />
                                </>
                            ) : (
                                <SocialPerformanceDashboard data={data} activity={displayActivity} />
                            )}

                            {/* Lists (Comments or Recipients) */}
                            {displayActivity && ['email', 'sms'].includes(displayActivity.type) ? renderEmailList() : <SocialCommentsList list={data.actionableList} activity={displayActivity} />}
                        </>
                    )}
                </div>

            </div>

            {/* Mini Compose Modal Overlay (Email) */}
            {emailCompose && (
                <div className="absolute inset-0 z-10000 bg-white/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 ring-1 ring-black/5 animate-in zoom-in-95 slide-in-from-bottom-5">
                       
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-xs">
                                    <Mail size={14} className="text-gray-900"/>
                                </div>
                                Follow up with {emailCompose.contact.name}
                            </h3>
                            <button onClick={() => setEmailCompose(null)} className="text-gray-400 hover:text-black transition-colors"><X size={20}/></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Subject</label>
                                <input type="text" defaultValue={`Re: ${displayActivity?.internalName}`} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-900 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-gray-200 transition-all"/>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Message</label>
                                <textarea rows={6} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-900 leading-relaxed focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-gray-200 transition-all resize-none" placeholder="Write your personal follow-up..."></textarea>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button onClick={() => setEmailCompose(null)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
                                <button onClick={() => {setEmailCompose(null); alert('Email Sent!')}} className="px-6 py-2.5 text-sm font-bold text-white bg-black hover:bg-gray-800 rounded-lg shadow-lg shadow-black/5 transition-all flex items-center gap-2">
                                    <Send size={14}/> Send Email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Drawer>
    );
};

export default ActivityPerformanceDrawer;
