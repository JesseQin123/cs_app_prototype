import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, ExternalLink, MoreHorizontal, CheckCircle2, Ban, Store, Users, BarChart3, Clock, AlertCircle, Edit2, Building2, Map, ChevronDown, ChevronUp, XCircle, Globe, Facebook, Instagram, Plus } from 'lucide-react';
import TierBadge from './TierBadge';

const RetailerDetail = ({ retailer, onBack, onEditProfile }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isAdjustingQuota, setIsAdjustingQuota] = useState(false);
  const [newQuota, setNewQuota] = useState(retailer?.quota?.email?.limit || 10000);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [isTierDropdownOpen, setIsTierDropdownOpen] = useState(false);
  const [currentTier, setCurrentTier] = useState(retailer?.tier || 'Default Tier');

  if (!retailer) return null;

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in fade-in duration-300">
        {/* Header Navigation */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition flex items-center gap-2"
                >
                    <ArrowLeft size={20} />
                    <span className="text-sm font-medium">Back to Retailers</span>
                </button>
                <div className="h-6 w-px bg-gray-200"></div>
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${retailer.logo} flex items-center justify-center text-white font-bold text-sm shadow-xs`}>
                        {retailer.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">{retailer.name}</h1>
                            <TierBadge tier={retailer.tier || 'Default Tier'} size="md" />
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                retailer.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 
                                retailer.status === 'Suspended' ? 'bg-red-50 text-red-700 border-red-100' :
                                'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                                {retailer.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                             <span className="text-xs text-gray-400">ID: {retailer.id.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button 
                    onClick={onEditProfile}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-xs"
                >
                    Edit Profile
                </button>
                {retailer.status === 'Inactive' ? (
                    <button className="px-4 py-2 bg-green-50 border border-green-100 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition shadow-xs flex items-center gap-2">
                        <CheckCircle2 size={16} /> Reactivate
                    </button>
                ) : (
                    <button className="px-4 py-2 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition shadow-xs flex items-center gap-2">
                        <Ban size={16} /> Deactivate
                    </button>
                )}
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-8 py-8">
                {/* Tabs */}
                <div className="border-b border-gray-200 mb-8">
                    <div className="flex items-center gap-8">
                        {['Profile', 'Stores', 'Segmentation', 'Quota', 'Activity & Performance', 'Communication'].map((tab) => {
                            const id = tab.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
                            return (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`py-4 text-sm font-medium transition relative whitespace-nowrap ${
                                        activeTab === id ? 'text-black' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab}
                                    {activeTab === id && (
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-t-full"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            {/* Basic Info */}
                            <section>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Building2 size={16} className="text-gray-400"/> Basic Information
                                </h3>
                                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs space-y-6">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-1 uppercase tracking-wide">Primary Contact</label>
                                            <div className="text-base font-semibold text-gray-900">{retailer.contact.name}</div>
                                            <div className="text-sm text-gray-500 mt-0.5">{retailer.contact.email}</div>
                                            {retailer.contact.phone && <div className="text-sm text-gray-500">{retailer.contact.phone}</div>}
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-1 uppercase tracking-wide">Location</label>
                                            <div className="text-base font-semibold text-gray-900">{retailer.location.country}</div>
                                            <div className="text-sm text-gray-500 mt-0.5">{retailer.location.zone || 'No Zone'}</div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-1 uppercase tracking-wide">Joined Date</label>
                                            <div className="text-base font-semibold text-gray-900">{retailer.joinedDate || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-1 uppercase tracking-wide">Website</label>
                                            <a href={`https://${retailer.website}`} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-blue-600 hover:underline cursor-pointer">
                                                {retailer.website || 'N/A'}
                                            </a>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-1 uppercase tracking-wide">Address</label>
                                            <div className="text-base font-semibold text-gray-900">{retailer.address || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-1 uppercase tracking-wide">Timezone</label>
                                            <div className="text-base font-semibold text-gray-900">{retailer.timezone || 'N/A'}</div>
                                        </div>
                                    </div>
                                    
                                    {retailer.internalNotes && (
                                        <div className="pt-6 border-t border-gray-100">
                                            <label className="text-xs text-gray-500 block mb-2 uppercase tracking-wide">Internal Notes</label>
                                            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-900">
                                                {retailer.internalNotes}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Team Members */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                        <Users size={16} className="text-gray-400"/> Team Members
                                    </h3>
                                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full border border-gray-200">2 / 5 Seats Used</span>
                                </div>
                                
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
                                    <div className="grid grid-cols-[1fr_150px_150px] gap-4 px-6 py-3 border-b border-gray-100 text-xs font-medium text-gray-400 bg-gray-50 uppercase tracking-wider">
                                        <div>User</div>
                                        <div>Role</div>
                                        <div className="text-right">Last Login</div>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        <div className="grid grid-cols-[1fr_150px_150px] gap-4 px-6 py-4 items-center hover:bg-gray-50 transition">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{retailer.contact.name}</div>
                                                <div className="text-xs text-gray-500">{retailer.contact.email}</div>
                                            </div>
                                            <div><span className="text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 px-2 py-1 rounded-sm">Admin</span></div>
                                            <div className="text-xs text-gray-500 text-right">2 hours ago</div>
                                        </div>
                                        <div className="grid grid-cols-[1fr_150px_150px] gap-4 px-6 py-4 items-center hover:bg-gray-50 transition">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">Marketing Team</div>
                                                <div className="text-xs text-gray-500">marketing@{retailer.contact.email.split('@')[1]}</div>
                                            </div>
                                            <div><span className="text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 px-2 py-1 rounded-sm">Editor</span></div>
                                            <div className="text-xs text-gray-500 text-right">Yesterday</div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'stores' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Store Locations ({retailer.stores})</h3>
                                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition">
                                    <Map size={16} /> View on Map
                                </button>
                            </div>

                            {/* Map Placeholder */}
                            <div className="w-full h-64 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center relative overflow-hidden group shadow-xs">
                                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-74.006,40.7128,12,0/800x400?access_token=pk.mock')] bg-cover bg-center opacity-60 grayscale group-hover:grayscale-0 transition duration-700"></div>
                                <div className="z-10 bg-white/90 backdrop-blur-xs px-4 py-2 rounded-lg shadow-xs border border-gray-200 flex items-center gap-2">
                                    <MapPin size={16} className="text-red-500" />
                                    <span className="text-xs font-medium text-gray-700">Interactive Map Placeholder</span>
                                </div>
                            </div>

                            {/* Stores List */}
                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="p-5 bg-white border border-gray-200 rounded-xl hover:border-black/20 hover:shadow-md transition flex items-start justify-between group cursor-pointer">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition">
                                                <Store size={20} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">{retailer.name} - Location {i}</div>
                                                <div className="text-xs text-gray-500 mt-1">123 Fashion Ave, New York, NY 10001</div>
                                                <div className="flex items-center gap-2 mt-3">
                                                    <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100 font-medium">Open</span>
                                                    <span className="text-[10px] text-gray-400">10:00 AM - 9:00 PM</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'segmentation' && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            {/* Header */}
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-blue-900">Segmentation Management</h4>
                                    <p className="text-sm text-blue-700 mt-1 max-w-2xl">Manage this retailer's tier and group assignments to control their access and benefits.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Retailer Tier Section */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs h-full">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Retailer Tier</h3>
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-500">Current Tier Assignment</p>
                                        <div className="relative">
                                            <button 
                                                onClick={() => setIsTierDropdownOpen(!isTierDropdownOpen)}
                                                className="w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-lg flex items-center justify-between hover:border-gray-300 transition"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-2 h-2 rounded-full ${
                                                        (currentTier === 'Platinum' ? 'bg-purple-500' : 
                                                        currentTier === 'Gold' ? 'bg-amber-500' : 
                                                        currentTier === 'Silver' ? 'bg-gray-400' : 'bg-slate-200')
                                                    }`}></span>
                                                    <span className="text-sm font-medium">{currentTier}</span>
                                                </div>
                                                <ChevronDown size={16} className={`transition-transform duration-200 ${isTierDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            {isTierDropdownOpen && (
                                                <>
                                                    <div 
                                                        className="fixed inset-0 z-10" 
                                                        onClick={() => setIsTierDropdownOpen(false)}
                                                    ></div>
                                                    <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-20 animate-in fade-in zoom-in-95">
                                                        {['Platinum', 'Gold', 'Silver', 'Default Tier'].map((tier) => (
                                                            <button
                                                                key={tier}
                                                                onClick={() => {
                                                                    setCurrentTier(tier);
                                                                    setIsTierDropdownOpen(false);
                                                                }}
                                                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition ${
                                                                    currentTier === tier ? 'bg-gray-50 font-medium text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                                }`}
                                                            >
                                                                <span className={`w-2 h-2 rounded-full ${
                                                                    (tier === 'Platinum' ? 'bg-purple-500' : 
                                                                    tier === 'Gold' ? 'bg-amber-500' : 
                                                                    tier === 'Silver' ? 'bg-gray-400' : 'bg-slate-200')
                                                                }`}></span>
                                                                {tier}
                                                                {currentTier === tier && <CheckCircle2 size={14} className="ml-auto text-black" />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Changing the tier will update the retailer's benefits and access levels immediately.
                                        </div>
                                    </div>
                                </div>

                                {/* Group Management Section */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs h-full">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Custom Groups</h3>
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        {retailer.groups.map(g => (
                                            <span key={g} className="pl-4 pr-2 py-2 bg-gray-50 text-gray-700 rounded-full text-sm font-medium flex items-center gap-2 border border-gray-200 hover:bg-gray-100 transition group">
                                                {g}
                                                <button className="p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-red-500 transition"><XCircle size={14}/></button>
                                            </span>
                                        ))}
                                    </div>
                                    
                                    {/* Add Group Dropdown */}
                                    <div className="relative">
                                        <button 
                                            onClick={() => setIsAddingGroup(!isAddingGroup)}
                                            className={`w-full px-4 py-2 border border-dashed border-gray-300 text-gray-500 rounded-lg text-sm font-medium hover:border-gray-400 hover:text-gray-900 hover:bg-gray-50 transition flex items-center justify-center gap-2 ${isAddingGroup ? 'bg-gray-50 border-gray-400 text-gray-900' : ''}`}
                                        >
                                            <Plus size={16} /> Add to Group
                                        </button>
                                        
                                        {isAddingGroup && (
                                            <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-20 animate-in fade-in zoom-in-95">
                                                <div className="mb-2 px-2 pt-1">
                                                    <input 
                                                        autoFocus
                                                        placeholder="Search or create new..." 
                                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5"
                                                    />
                                                </div>
                                                <div className="max-h-48 overflow-y-auto space-y-1">
                                                    <div className="px-2 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Available Groups</div>
                                                    {['VIP', 'Department Store', 'Luxury', 'International', 'Boutique'].filter(g => !retailer.groups.includes(g)).map(g => (
                                                        <button 
                                                            key={g}
                                                            onClick={() => setIsAddingGroup(false)}
                                                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between group"
                                                        >
                                                            {g}
                                                            <span className="opacity-0 group-hover:opacity-100 text-xs text-gray-400">Add</span>
                                                        </button>
                                                    ))}
                                                    <div className="border-t border-gray-100 my-1"></div>
                                                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-blue-600 hover:bg-blue-50 font-medium flex items-center gap-2">
                                                        <Plus size={14} /> Create New Group
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {(activeTab === 'activity-performance' || activeTab === 'communication') && (
                        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                <Clock size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Coming Soon</h3>
                            <p className="text-gray-500 mt-2">This feature is currently under development.</p>
                        </div>
                    )}

                    {activeTab === 'quota' && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                             {/* Brand Pool Status */}
                            <div className="bg-gray-900 text-white rounded-xl p-6 flex items-center justify-between shadow-lg">
                                <div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">Brand Email Pool</div>
                                    <div className="text-3xl font-bold mt-2">450,000 <span className="text-sm text-gray-500 font-normal">/ 500,000 remaining</span></div>
                                </div>
                                <div className="h-12 w-px bg-gray-700"></div>
                                <div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">Global Profile Limit</div>
                                    <div className="text-3xl font-bold mt-2">1 <span className="text-sm text-gray-500 font-normal">per retailer</span></div>
                                </div>
                                <div className="h-12 w-px bg-gray-700"></div>
                                <div>
                                     <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">Plan Status</div>
                                     <div className="text-sm font-medium mt-2 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span> Enterprise Plan
                                     </div>
                                     <button className="text-[#B8A77E] hover:text-[#9f8f6b] font-bold uppercase tracking-wider text-[10px] hover:underline mt-2">Upgrade</button>
                                </div>
                            </div>

                            {/* Email Quota */}
                            <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Email Quota</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">Monthly sending limit for this retailer</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mb-2 flex justify-between text-sm">
                                    <span className="font-medium text-gray-900">{retailer.quota.email.used.toLocaleString()} Used</span>
                                    <span className="text-gray-500">{retailer.quota.email.limit.toLocaleString()} Allocated</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
                                    <div 
                                        className={`h-full rounded-full ${
                                            (retailer.quota.email.used / retailer.quota.email.limit) > 0.9 ? 'bg-red-500' : 
                                            (retailer.quota.email.used / retailer.quota.email.limit) > 0.75 ? 'bg-amber-500' : 'bg-green-500'
                                        }`} 
                                        style={{ width: `${(retailer.quota.email.used / retailer.quota.email.limit) * 100}%` }}
                                    ></div>
                                </div>

                                {/* Inline Adjustment */}
                                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                    <button 
                                        onClick={() => setIsAdjustingQuota(!isAdjustingQuota)}
                                        className="w-full flex items-center justify-between p-4 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                                    >
                                        <span>Adjust Allocation</span>
                                        {isAdjustingQuota ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    
                                    {isAdjustingQuota && (
                                        <div className="p-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
                                            <div className="flex items-end gap-4">
                                                <div className="flex-1">
                                                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">New Limit</label>
                                                    <div className="relative">
                                                        <input 
                                                            type="number" 
                                                            value={newQuota}
                                                            onChange={(e) => setNewQuota(parseInt(e.target.value))}
                                                            className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-black/5 focus:border-black transition text-sm"
                                                        />
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">EMAILS</span>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => setIsAdjustingQuota(false)}
                                                    className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-xs h-[38px]"
                                                >
                                                    Update Limit
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-3">
                                                Note: Increasing the limit will deduct from the global Brand Email Pool immediately.
                                            </p>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Pending Request Mock */}
                                {retailer.id === 'r5' && (
                                    <div className="mt-6 bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start gap-3">
                                        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                                        <div className="flex-1">
                                            <div className="text-sm font-bold text-amber-900">Requesting +5,000 Credits</div>
                                            <div className="text-xs text-amber-700 mt-1">Reason: Holiday Promo Campaign needs more reach.</div>
                                            <div className="flex gap-3 mt-3">
                                                <button className="px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700 shadow-xs">Approve Request</button>
                                                <button className="px-3 py-1.5 bg-white border border-amber-200 text-amber-700 text-xs font-medium rounded-lg hover:bg-amber-50">Reject</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Social Profiles */}
                            <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center text-pink-600">
                                            <Globe size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Social Profiles</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">Connected social media accounts</p>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                                        {retailer.quota.social.connected} / {retailer.quota.social.limit} Connected
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-xs"><Facebook size={20}/></div>
                                            <span className="text-sm font-bold text-gray-900">Facebook</span>
                                        </div>
                                        {retailer.quota.social.platforms.facebook ? (
                                            <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                                                <CheckCircle2 size={12}/> Connected
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-400 font-medium">Not Connected</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-linear-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-lg flex items-center justify-center text-white shadow-xs"><Instagram size={20}/></div>
                                            <span className="text-sm font-bold text-gray-900">Instagram</span>
                                        </div>
                                        {retailer.quota.social.platforms.instagram ? (
                                            <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                                                <CheckCircle2 size={12}/> Connected
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-400 font-medium">Not Connected</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white shadow-xs"><span className="font-bold text-lg">X</span></div>
                                            <span className="text-sm font-bold text-gray-900">X (Twitter)</span>
                                        </div>
                                        {retailer.quota.social.platforms.x ? (
                                            <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                                                <CheckCircle2 size={12}/> Connected
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-400 font-medium">Not Connected</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white shadow-xs"><span className="font-bold text-lg">G</span></div>
                                            <span className="text-sm font-bold text-gray-900">Google Business</span>
                                        </div>
                                        {retailer.quota.social.platforms.gbp ? (
                                            <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                                                <CheckCircle2 size={12}/> Connected
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-400 font-medium">Not Connected</span>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}


                </div>
            </div>
        </div>
    </div>
  );
};

export default RetailerDetail;
