import React, { useState } from 'react';
import { Plus, MoreHorizontal, Trash2, Edit2, GripVertical, AlertCircle, Check, X, Shield, Users } from 'lucide-react';

const SegmentationManager = () => {
  // Mock Data - Tiers
  const [tiers, setTiers] = useState([
    { id: 't1', name: 'Platinum', color: 'bg-purple-500', emailQuota: 50000, retailersCount: 5 },
    { id: 't2', name: 'Gold', color: 'bg-amber-500', emailQuota: 25000, retailersCount: 12 },
    { id: 't3', name: 'Silver', color: 'bg-gray-400', emailQuota: 10000, retailersCount: 20 },
    { id: 't4', name: 'Default Tier', color: 'bg-slate-200', emailQuota: 5000, retailersCount: 8, isDefault: true }
  ]);

  // Mock Data - Groups
  const [groups, setGroups] = useState([
    { id: 'g1', name: 'VIP', retailersCount: 8 },
    { id: 'g2', name: 'New Openings', retailersCount: 3 },
    { id: 'g3', name: 'Holiday Promo', retailersCount: 0 },
    { id: 'g4', name: 'Q1 Launch Test', retailersCount: 0 }
  ]);

  const [editingTier, setEditingTier] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [draggedTier, setDraggedTier] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // --- Tier Handlers ---

  const handleSaveTier = (tierData) => {
    if (editingTier) {
      setTiers(tiers.map(t => t.id === editingTier.id ? { ...t, ...tierData } : t));
    } else {
      setTiers([...tiers, { id: `t${Date.now()}`, retailersCount: 0, ...tierData }]);
    }
    setIsTierModalOpen(false);
    setEditingTier(null);
  };

  const handleDeleteTier = (id) => {
    const tier = tiers.find(t => t.id === id);
    if (tier.retailersCount > 0) {
      alert(`Cannot delete tier "${tier.name}" because it is assigned to ${tier.retailersCount} retailers.`);
      return;
    }
    if (tier.isDefault) {
        alert("Cannot delete the default system tier.");
        return;
    }
    setTiers(tiers.filter(t => t.id !== id));
  };

  const openTierModal = (tier = null) => {
    setEditingTier(tier);
    setIsTierModalOpen(true);
  };

  // --- Drag and Drop Handlers ---

  const handleDragStart = (e, index) => {
    setDraggedTier(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedTier === null || draggedTier === dropIndex) {
      setDraggedTier(null);
      setDragOverIndex(null);
      return;
    }

    const newTiers = [...tiers];
    const [draggedItem] = newTiers.splice(draggedTier, 1);
    newTiers.splice(dropIndex, 0, draggedItem);
    
    setTiers(newTiers);
    setDraggedTier(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedTier(null);
    setDragOverIndex(null);
  };

  // --- Group Handlers ---

  const handleSaveGroup = (groupData) => {
    if (editingGroup) {
      setGroups(groups.map(g => g.id === editingGroup.id ? { ...g, ...groupData } : g));
    } else {
      setGroups([...groups, { id: `g${Date.now()}`, retailersCount: 0, ...groupData }]);
    }
    setIsGroupModalOpen(false);
    setEditingGroup(null);
  };

  const handleDeleteGroup = (id) => {
    const group = groups.find(g => g.id === id);
    if (group.retailersCount > 0) {
      alert(`Cannot delete group "${group.name}" because it is assigned to ${group.retailersCount} retailers.`);
      return;
    }
    setGroups(groups.filter(g => g.id !== id));
  };

  const openGroupModal = (group = null) => {
    setEditingGroup(group);
    setIsGroupModalOpen(true);
  };

  // --- Components ---

  const TierModal = () => {
    const [formData, setFormData] = useState(editingTier || { name: '', color: 'bg-gray-500', emailQuota: 10000 });
    
    const colors = [
        'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500', 
        'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500', 
        'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 
        'bg-pink-500', 'bg-rose-500', 'bg-slate-500', 'bg-gray-500', 'bg-zinc-500'
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsTierModalOpen(false)}></div>
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">{editingTier ? 'Edit Tier' : 'Add New Tier'}</h3>
                    <button onClick={() => setIsTierModalOpen(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tier Name <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5"
                            placeholder="e.g. Platinum Plus"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color Tag</label>
                        <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg">
                            {colors.map(c => (
                                <button 
                                    key={c}
                                    onClick={() => setFormData({...formData, color: c})}
                                    className={`w-6 h-6 rounded-full ${c} ${formData.color === c ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Default Configuration</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Pool Size (Quota)</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={formData.emailQuota}
                                    onChange={e => setFormData({...formData, emailQuota: parseInt(e.target.value) || 0})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">emails / period</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Default quota for retailers in this tier.</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={() => setIsTierModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium">Cancel</button>
                    <button 
                        onClick={() => handleSaveTier(formData)}
                        disabled={!formData.name}
                        className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
  };

  const GroupModal = () => {
    const [formData, setFormData] = useState(editingGroup || { name: '' });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsGroupModalOpen(false)}></div>
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">{editingGroup ? 'Edit Group' : 'Add New Group'}</h3>
                    <button onClick={() => setIsGroupModalOpen(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Group Name <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-black/5"
                            placeholder="e.g. Q1 Launch Test"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={() => setIsGroupModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium">Cancel</button>
                    <button 
                        onClick={() => handleSaveGroup(formData)}
                        disabled={!formData.name}
                        className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save Group
                    </button>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Module 1: Retailer Tier Management */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Shield size={18} className="text-indigo-600" />
                    Retailer Tier Management
                </h2>
                <p className="text-sm text-gray-500 mt-1">Define retailer value tiers and their default system configurations.</p>
            </div>
            <button 
                onClick={() => openTierModal()}
                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-xs flex items-center gap-2"
            >
                <Plus size={16} /> Add New Tier
            </button>
        </div>
        
        <div className="divide-y divide-gray-100">
            {tiers.map((tier, index) => (
                <div 
                    key={tier.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition group ${
                        draggedTier === index ? 'opacity-50' : ''
                    } ${
                        dragOverIndex === index && draggedTier !== index ? 'border-t-2 border-indigo-500' : ''
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <div className="text-gray-300 cursor-grab active:cursor-grabbing hover:text-gray-500">
                            <GripVertical size={16} />
                        </div>
                        <div className={`w-3 h-3 rounded-full ${tier.color}`}></div>
                        <div>
                            <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                {tier.name}
                                {tier.isDefault && <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-sm uppercase tracking-wider font-medium">Default</span>}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                                {tier.emailQuota.toLocaleString()} emails quota • {tier.retailersCount} retailers
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => openTierModal(tier)} 
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <Edit2 size={16} />
                        </button>
                        {!tier.isDefault && (
                            <button 
                                onClick={() => handleDeleteTier(tier.id)} 
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Module 2: Custom Group Management */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Users size={18} className="text-emerald-600" />
                    Custom Group Management
                </h2>
                <p className="text-sm text-gray-500 mt-1">Create flexible tags for ad-hoc grouping and targeted campaigns.</p>
            </div>
            <button 
                onClick={() => openGroupModal()}
                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-xs flex items-center gap-2"
            >
                <Plus size={16} /> Add New Group
            </button>
        </div>
        
        <div className="divide-y divide-gray-100">
            {groups.length > 0 ? (
                groups.map((group) => (
                    <div key={group.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition group">
                        <div className="flex items-center gap-4">
                            <div>
                                <div className="text-sm font-medium text-gray-900">{group.name}</div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                    Used by {group.retailersCount} retailers
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openGroupModal(group)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteGroup(group.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="px-6 py-12 text-center text-gray-500 text-sm">
                    No custom groups created yet.
                </div>
            )}
        </div>
      </section>

      {/* Modals */}
      {isTierModalOpen && <TierModal />}
      {isGroupModalOpen && <GroupModal />}

    </div>
  );
};

export default SegmentationManager;
