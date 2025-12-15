import React, { useState } from 'react';
import Drawer from '../../../../components/Drawer';
import { XCircle, Mail, MapPin, Building2, Users, Clock, CheckCircle2, AlertCircle, Facebook, Instagram, Linkedin, Globe, Edit, Ban, Store, Map } from 'lucide-react';

const RetailerDrawer = ({ retailer, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile'); // profile, stores, group, quota, activity-log
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [newQuota, setNewQuota] = useState(retailer?.quota?.email?.limit || 10000);

  // Cache retailer for exit animation
  const [cachedRetailer, setCachedRetailer] = useState(retailer);
  
  if (retailer && retailer !== cachedRetailer) {
    setCachedRetailer(retailer);
  }

  const displayRetailer = retailer || cachedRetailer;
  
  if (!displayRetailer) return null;

  return (
    <Drawer
      isOpen={!!retailer}
      onClose={onClose}
      width="w-[600px] max-w-full"
      title={
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${displayRetailer.logo} flex items-center justify-center text-white font-bold text-lg shadow-xs`}>
                {displayRetailer.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
                <h2 className="text-lg font-bold text-gray-900">{displayRetailer.name}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                            displayRetailer.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' :
                            displayRetailer.status === 'Suspended' ? 'bg-red-50 text-red-700 border-red-100' :
                            displayRetailer.status === 'Pending' ? 'bg-gray-50 text-gray-600 border-gray-100' :
                            'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                            {displayRetailer.status}
                        </span>
                        <span className="text-[10px] text-gray-400">ID: {displayRetailer.id.toUpperCase()}</span>
                </div>
            </div>
            {/* Edit Button moved to title area if desired, or keep separate? 
                Drawer title prop is flexible.
            */}
        </div>
      }
      footer={
         <div className="flex justify-end items-center w-full">
            <button className="text-red-600 text-sm font-medium hover:text-red-700 flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-lg transition">
                <Ban size={16} /> Deactivate Retailer
            </button>
         </div>
      }
    >
        <div className="flex flex-col h-full"> {/* Inner wrapper for flex layout if needed for tabs */}

            {/* Tabs */}
            <div className="px-6 border-b border-gray-200">
                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                    {['Profile', 'Stores', 'Group', 'Quota', 'Activity Log'].map((tab) => {
                        const id = tab.toLowerCase().replace(' ', '-');
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 relative">
                {activeTab === 'profile' && (
                    <div className="space-y-8">
                        {/* Basic Info Optimized */}
                        <section>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Building2 size={16} className="text-gray-400"/> Basic Information
                            </h3>
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1 uppercase tracking-wide">Primary Contact</label>
                                    <div className="text-sm font-semibold text-gray-900">{retailer.contact.name}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{retailer.contact.email}</div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1 uppercase tracking-wide">Location</label>
                                    <div className="text-sm font-semibold text-gray-900">{retailer.location.country}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{retailer.location.zone || 'No Zone'}</div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1 uppercase tracking-wide">Joined Date</label>
                                    <div className="text-sm font-semibold text-gray-900">Oct 15, 2024</div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1 uppercase tracking-wide">Website</label>
                                    <div className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">www.{retailer.name.toLowerCase().replace(/\s/g, '')}.com</div>
                                </div>
                            </div>
                        </section>

                        {/* Team Members with Quota */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                    <Users size={16} className="text-gray-400"/> Team Members
                                </h3>
                                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">2 / 5 Seats Used</span>
                            </div>
                            
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs">
                                <div className="grid grid-cols-[1fr_100px_120px] gap-4 px-4 py-2 border-b border-gray-100 text-xs font-medium text-gray-400 bg-gray-50">
                                    <div>User</div>
                                    <div>Role</div>
                                    <div className="text-right">Last Login</div>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    <div className="grid grid-cols-[1fr_100px_120px] gap-4 px-4 py-3 items-center">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{retailer.contact.name}</div>
                                            <div className="text-xs text-gray-500">{retailer.contact.email}</div>
                                        </div>
                                        <div className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-2 py-1 rounded-sm inline-block text-center">Admin</div>
                                        <div className="text-xs text-gray-500 text-right">2 hours ago</div>
                                    </div>
                                    <div className="grid grid-cols-[1fr_100px_120px] gap-4 px-4 py-3 items-center">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Marketing Team</div>
                                            <div className="text-xs text-gray-500">marketing@{retailer.contact.email.split('@')[1]}</div>
                                        </div>
                                        <div className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-2 py-1 rounded-sm inline-block text-center">Editor</div>
                                        <div className="text-xs text-gray-500 text-right">Yesterday</div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'stores' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Store Locations ({retailer.stores})</h3>
                            <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                <Map size={14} /> View on Map
                            </button>
                        </div>

                        {/* Map Placeholder */}
                        <div className="w-full h-48 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-74.006,40.7128,12,0/600x300?access_token=pk.mock')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition duration-500"></div>
                            <div className="z-10 bg-white/80 backdrop-blur-xs px-4 py-2 rounded-lg shadow-xs border border-gray-200 flex items-center gap-2">
                                <MapPin size={16} className="text-red-500" />
                                <span className="text-xs font-medium text-gray-700">Map View Placeholder</span>
                            </div>
                        </div>

                        {/* Stores List */}
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="p-4 bg-white border border-gray-200 rounded-lg hover:border-black/20 transition flex items-start justify-between group">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition">
                                            <Store size={16} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">{retailer.name} - Location {i}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">123 Fashion Ave, New York, NY 10001</div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded-sm border border-green-100">Open</span>
                                                <span className="text-[10px] text-gray-400">10:00 AM - 9:00 PM</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="p-1.5 hover:bg-gray-50 rounded-sm text-gray-400 hover:text-gray-600">
                                        <Edit size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'group' && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                            <Users className="text-blue-600 shrink-0" size={20} />
                            <div>
                                <h4 className="text-sm font-bold text-blue-900">Group Management</h4>
                                <p className="text-xs text-blue-700 mt-1">Assign this retailer to groups to control their access to campaigns and resources.</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-3">Current Groups</h3>
                            <div className="flex flex-wrap gap-2">
                                {retailer.groups.map(g => (
                                    <span key={g} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium flex items-center gap-2 border border-gray-200">
                                        {g}
                                        <button className="hover:text-red-500"><XCircle size={14}/></button>
                                    </span>
                                ))}
                                <button className="px-3 py-1 border border-dashed border-gray-300 text-gray-500 rounded-full text-sm font-medium hover:border-gray-400 hover:text-gray-700 flex items-center gap-1">
                                    <Users size={14} /> Add to Group
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'quota' && (
                    <div className="space-y-8">
                         {/* Brand Pool Status */}
                        <div className="bg-gray-900 text-white rounded-xl p-5 flex items-center justify-between shadow-md">
                            <div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">Brand Email Pool</div>
                                <div className="text-2xl font-bold mt-1">450,000 <span className="text-sm text-gray-500 font-normal">/ 500,000 remaining</span></div>
                            </div>
                            <div className="h-10 w-px bg-gray-700"></div>
                            <div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">Global Profile Limit</div>
                                <div className="text-2xl font-bold mt-1">1 <span className="text-sm text-gray-500 font-normal">per retailer</span></div>
                            </div>
                        </div>

                        {/* Email Quota */}
                        <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Mail className="text-gray-400" size={20} />
                                    <h3 className="font-bold text-gray-900">Email Quota</h3>
                                </div>
                                <button 
                                    onClick={() => setShowQuotaModal(true)}
                                    className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition border border-indigo-100"
                                >
                                    Adjust Allocation
                                </button>
                            </div>
                            
                            <div className="mb-2 flex justify-between text-sm">
                                <span className="font-medium text-gray-900">{retailer.quota.email.used.toLocaleString()} Used</span>
                                <span className="text-gray-500">{retailer.quota.email.limit.toLocaleString()} Allocated</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                                <div 
                                    className={`h-full rounded-full ${
                                        (retailer.quota.email.used / retailer.quota.email.limit) > 0.9 ? 'bg-red-500' : 
                                        (retailer.quota.email.used / retailer.quota.email.limit) > 0.75 ? 'bg-amber-500' : 'bg-green-500'
                                    }`} 
                                    style={{ width: `${(retailer.quota.email.used / retailer.quota.email.limit) * 100}%` }}
                                ></div>
                            </div>
                            
                            {/* Pending Request Mock */}
                            {retailer.id === 'r5' && (
                                <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-3">
                                    <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-amber-900">Requesting +5,000 Credits</div>
                                        <div className="text-xs text-amber-700 mt-0.5">Reason: Holiday Promo Campaign needs more reach.</div>
                                        <div className="flex gap-2 mt-2">
                                            <button className="px-3 py-1 bg-amber-600 text-white text-xs font-medium rounded-sm hover:bg-amber-700">Approve</button>
                                            <button className="px-3 py-1 bg-white border border-amber-200 text-amber-700 text-xs font-medium rounded-sm hover:bg-amber-50">Reject</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Social Profiles */}
                        <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Globe className="text-gray-400" size={20} />
                                    <h3 className="font-bold text-gray-900">Social Profiles</h3>
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    {retailer.quota.social.connected} / {retailer.quota.social.limit} Connected
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center text-white"><Facebook size={16}/></div>
                                        <span className="text-sm font-medium text-gray-900">Facebook</span>
                                    </div>
                                    {retailer.quota.social.platforms.facebook ? (
                                        <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-sm border border-green-100">
                                            <CheckCircle2 size={12}/> Connected
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">Not Connected</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-pink-600 rounded-sm flex items-center justify-center text-white"><Instagram size={16}/></div>
                                        <span className="text-sm font-medium text-gray-900">Instagram</span>
                                    </div>
                                    {retailer.quota.social.platforms.instagram ? (
                                        <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-sm border border-green-100">
                                            <CheckCircle2 size={12}/> Connected
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">Not Connected</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center text-white"><span className="font-bold text-xs">X</span></div>
                                        <span className="text-sm font-medium text-gray-900">X (Twitter)</span>
                                    </div>
                                    {retailer.quota.social.platforms.x ? (
                                        <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-sm border border-green-100">
                                            <CheckCircle2 size={12}/> Connected
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">Not Connected</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-500 rounded-sm flex items-center justify-center text-white"><span className="font-bold text-xs">G</span></div>
                                        <span className="text-sm font-medium text-gray-900">Google Business Profile</span>
                                    </div>
                                    {retailer.quota.social.platforms.gbp ? (
                                        <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-sm border border-green-100">
                                            <CheckCircle2 size={12}/> Connected
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">Not Connected</span>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'activity-log' && (
                    <div className="relative pl-4 border-l border-gray-200 space-y-8">
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white ring-1 ring-gray-200"></div>
                            <div className="text-sm font-medium text-gray-900">Downloaded Resource: Holiday_Guide_2025.pdf</div>
                            <div className="text-xs text-gray-500 mt-1">Today, 10:30 AM • by {retailer.contact.name}</div>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white ring-1 ring-gray-200"></div>
                            <div className="text-sm font-medium text-gray-900">Published Campaign: Winter Collection</div>
                            <div className="text-xs text-gray-500 mt-1">Yesterday, 2:15 PM • by Marketing Team</div>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gray-300 border-2 border-white ring-1 ring-gray-200"></div>
                            <div className="text-sm font-medium text-gray-900">System: Email Quota Warning (80%)</div>
                            <div className="text-xs text-gray-500 mt-1">Nov 28, 2025 • System Automated</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quota Adjustment Modal */}
            {showQuotaModal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-96 p-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Adjust Email Quota</h3>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Allocation Limit</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={newQuota}
                                    onChange={(e) => setNewQuota(parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-black/5 focus:border-black transition"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">emails</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Current usage: {retailer.quota.email.used.toLocaleString()}
                            </p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setShowQuotaModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => setShowQuotaModal(false)}
                                className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg shadow-xs"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </Drawer>
  );
};

export default RetailerDrawer;
