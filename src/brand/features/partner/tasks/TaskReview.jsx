import React, { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Clock, ZoomIn, MessageSquare, Grid, List, Search, Filter, ChevronDown, Calendar, User, Info, ImageOff, Inbox } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

const TaskReview = ({ task, onBack, onUpdateTask, notify }) => {
  const { addToast } = useToast();
  const showToast = (msg, type) => {
      if (notify) notify(msg, type);
      else addToast(msg, type);
  };
    
  const [activeSubmissions, setActiveSubmissions] = useState(task.submissions || []);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  
  // View State
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  
  // Filter Details
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); 
  const [tierFilter, setTierFilter] = useState('All'); 
  const [zoneFilter, setZoneFilter] = useState('All'); 

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Derived Data
  const filteredSubmissions = useMemo(() => {
      return activeSubmissions.filter(sub => {
          if (statusFilter !== 'All' && sub.status !== statusFilter) return false;
          if (tierFilter !== 'All' && sub.tier !== tierFilter) return false;
          if (zoneFilter !== 'All' && sub.zone !== zoneFilter) return false;
          if (searchQuery && !sub.retailerName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
          return true;
      });
  }, [activeSubmissions, statusFilter, tierFilter, zoneFilter, searchQuery]);

  // Default Zones
  const defaultZones = ['All', 'Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'];
  const tiers = ['All', 'Platinum', 'Gold', 'Silver'];

  const handleApprove = (submissionId) => {
      const updated = activeSubmissions.map(s => 
          s.id === submissionId ? { ...s, status: 'Approved' } : s
      );
      setActiveSubmissions(updated);
      onUpdateTask({ ...task, submissions: updated });
      showToast('Submission approved', 'success');
      if (selectedSubmission?.id === submissionId) setSelectedSubmission(null);
  };

  const handleReject = (submissionId) => {
      if (!rejectReason.trim()) {
          alert('Please provide a rejection reason.');
          return;
      }
      const updated = activeSubmissions.map(s => 
          s.id === submissionId ? { ...s, status: 'Rejected', rejectionReason: rejectReason } : s
      );
      setActiveSubmissions(updated);
      onUpdateTask({ ...task, submissions: updated });
      showToast('Submission rejected', 'success');
      setRejectReason('');
      if (selectedSubmission?.id === submissionId) setSelectedSubmission(null);
  };

  // --- Components ---

  const FilterPill = ({ label, active, onClick }) => (
      <button 
          onClick={onClick}
          className={`px-3 py-1.5 text-xs font-bold rounded-full transition border ${active ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
      >
          {label}
      </button>
  );

  const StatusBadge = ({ status }) => {
      const styles = {
          'Approved': 'bg-emerald-100 text-emerald-700',
          'Rejected': 'bg-red-100 text-red-700',
          'Pending': 'bg-amber-100 text-amber-700'
      };
      return (
          <span className={`px-2 py-0.5 rounded-sm text-xs font-bold uppercase tracking-wider ${styles[status]}`}>
              {status}
          </span>
      );
  };

  // Image with Fallback
  const SafeImage = ({ src, alt, className }) => {
      const [error, setError] = useState(false);
      
      if (error || !src) {
        return (
            <div className={`flex flex-col items-center justify-center bg-gray-100 text-gray-400 ${className}`}>
                <ImageOff size={24} className="mb-2 opacity-50"/>
                <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
            </div>
        );
      }
      return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
  };

  const DropdownFilter = ({ label, value, options, onChange }) => {
      const [isOpen, setIsOpen] = useState(false);
      
      // Close when clicking outside - simplified for prototype: just usage of a transparent backdrop if open, or simple toggle.
      // For now, simpler toggle with auto-close on select.
      
      return (
          <div className="relative">
               {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>}
               <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className={`relative z-50 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border transition ${value !== 'All' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
               >
                   {value === 'All' ? label : value} <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}/>
               </button>
               
               {isOpen && (
                   <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 shadow-xl rounded-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                       {options.map(opt => (
                           <button 
                               key={opt} 
                               onClick={() => {
                                   onChange(opt);
                                   setIsOpen(false);
                               }}
                               className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 font-medium ${value === opt ? 'bg-gray-50 text-black font-bold' : 'text-gray-600'}`}
                           >
                               {opt}
                           </button>
                       ))}
                   </div>
               )}
          </div>
      );
  }

  return (
    // Replaced -mx-8 -my-6 with proper full layout handling. 
    // Assuming BrandApp shell provides padding, we want this component to fill it but 'break out' for the sticky header if needed.
    // However, user complained about width issues. Safer to respect parent padding and just ensure full height.
    <div className="flex flex-col h-full w-full"> 
       
       {/* [A] Header */}
       <div className="bg-white border-b border-gray-200 px-8 py-5 shadow-xs sticky top-0 z-20 mb-6">
           <div className="flex items-start justify-between mb-6">
               <div className="flex items-start gap-4">
                   <button onClick={onBack} className="mt-1 p-2 hover:bg-gray-100 rounded-full transition text-gray-500">
                       <ArrowLeft size={20} />
                   </button>
                   <div>
                       <div className="flex items-center gap-3 mb-1">
                           <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
                           <span className={`px-2 py-0.5 text-xs rounded-full uppercase tracking-wider font-bold ${task.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                               {task.status}
                           </span>
                       </div>
                       
                       {/* Meta Info */}
                       <div className="flex items-center gap-6 text-sm text-gray-500">
                           <div className="flex items-center gap-2">
                               <Calendar size={14}/> <span>Created {task.createdAt}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              {task.createdBy?.avatar ? <SafeImage src={task.createdBy.avatar} className="w-5 h-5 rounded-full object-cover"/> : <User size={14}/>}
                              <span>By {task.createdBy?.name || 'System'}</span>
                           </div>
                           <button 
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} 
                                className={`flex items-center gap-1 font-bold transition hover:text-black hover:underline ${isDescriptionExpanded ? 'text-black' : 'text-gray-500'}`}
                           >
                               <Info size={14}/> {isDescriptionExpanded ? 'Hide Details' : 'View Details'}
                           </button>
                       </div>
                   </div>
               </div>
               
               {/* Stats */}
               <div className="flex items-center gap-8">
                   <div className="text-right">
                       <div className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">Completion</div>
                       <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                           <div className={`h-full ${task.completionRate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${task.completionRate}%` }}></div>
                       </div>
                       <div className="text-sm font-bold text-gray-900">{task.completionRate}%</div>
                   </div>
               </div>
           </div>

           {/* Expandable Details */}
           {isDescriptionExpanded && (
               <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 mb-6 text-sm text-gray-700 animate-in slide-in-from-top-2">
                   <h3 className="font-bold text-gray-900 mb-2">Description & Instructions</h3>
                   <p className="max-w-3xl leading-relaxed">{task.description}</p>
               </div>
           )}

           {/* [B] Toolbar & Filters - Consolidated Row */}
           <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
               {/* Right Side: Search + View Toggle (Moved to Left/Top for unified row or kept split) 
                   User request: "Search box and view switcher should be in the filter bar row"
               */}
               <div className="flex items-center gap-4 flex-1">
                   {/* Search */}
                   <div className="relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                       <input 
                         type="text"
                         placeholder="Search retailers..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black/5 focus:border-black w-64 transition outline-hidden"
                       />
                   </div>

                   <div className="w-px h-6 bg-gray-200"></div>

                   {/* Filters */}
                   <div className="flex items-center gap-4 flex-wrap">
                       {/* Status Pills */}
                       <div className="flex items-center gap-2">
                           {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
                               <FilterPill key={s} label={s} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
                           ))}
                       </div>

                       <div className="w-px h-6 bg-gray-200"></div>
                       
                       {/* Tier Dropdown */}
                       <DropdownFilter label="Tier" value={tierFilter} options={tiers} onChange={setTierFilter} />

                       {/* Zone Dropdown */}
                       <DropdownFilter label="Zone" value={zoneFilter} options={defaultZones} onChange={setZoneFilter} />
                   </div>
               </div>

               {/* View Switcher */}
               <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
                   <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-sm ${viewMode === 'grid' ? 'bg-white shadow-xs text-black' : 'text-gray-500 hover:text-black'}`}><Grid size={16}/></button>
                   <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-sm ${viewMode === 'list' ? 'bg-white shadow-xs text-black' : 'text-gray-500 hover:text-black'}`}><List size={16}/></button>
               </div>
           </div>
       </div>

       {/* [C] Content */}
       <div className="flex-1 overflow-hidden bg-gray-50 px-8 pb-12 relative">
           {filteredSubmissions.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 animate-in fade-in duration-500">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-xs border border-gray-100">
                        <Inbox size={32} className="opacity-40 text-gray-400"/>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Submissions Yet</h3>
                    <p className="text-sm text-gray-500 max-w-xs text-center leading-relaxed">
                        Retailers haven't uploaded any proofs for this task yet.
                    </p>
                </div>
           ) : (
             <div className="h-full overflow-auto -mr-8 pr-8"> 
                {viewMode === 'grid' ? (
                /* GRID VIEW */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6 animate-in slide-in-from-bottom-2 duration-500">
                    {filteredSubmissions.map(sub => (
                        <div key={sub.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition group">
                            {/* Image Area */}
                            <div 
                                className="aspect-square bg-gray-100 relative cursor-pointer"
                                onClick={() => setSelectedSubmission(sub)}
                            >
                                <SafeImage src={sub.image} alt="Proof" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
                                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md" size={32}/>
                                </div>
                                <div className="absolute top-3 right-3">
                                    <StatusBadge status={sub.status} />
                                </div>
                            </div>

                            {/* Info Area */}
                            <div className="p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden shrink-0">
                                        {sub.retailerAvatar ? <SafeImage src={sub.retailerAvatar} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">{sub.retailerName.slice(0,2)}</div>}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-gray-900 text-sm truncate">{sub.retailerName}</div>
                                        <div className="text-xs text-gray-500 flex gap-2">
                                            <span>{sub.tier}</span>
                                            <span>•</span>
                                            <span>{sub.zone}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {sub.comment && (
                                    <div className="bg-gray-50 p-2 rounded-sm text-xs text-gray-600 italic mb-3 line-clamp-2">
                                        "{sub.comment}"
                                    </div>
                                )}

                                {/* Card Actions */}
                                {sub.status === 'Pending' ? (
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => handleApprove(sub.id)} className="flex-1 py-1.5 bg-black text-white text-xs font-bold rounded-sm">Approve</button>
                                        <button onClick={() => setSelectedSubmission(sub)} className="flex-1 py-1.5 border border-gray-200 text-gray-700 text-xs font-bold rounded-sm">Reject</button>
                                    </div>
                                ) : (
                                    <div className="mt-2 text-xs text-gray-400 font-medium">
                                        {sub.date}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* LIST VIEW */
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs mt-6 animate-in slide-in-from-bottom-2 duration-500">
                     <table className="w-full text-left table-fixed">
                        <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 w-[30%]">Retailer</th>
                                <th className="px-6 py-4 w-[15%]">Location/Tier</th>
                                <th className="px-6 py-4 w-[15%]">Submission</th>
                                <th className="px-6 py-4 w-[15%]">Evidence</th>
                                <th className="px-6 py-4 w-[10%]">Status</th>
                                <th className="px-6 py-4 w-[15%] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredSubmissions.map(sub => (
                                <tr key={sub.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden shrink-0">
                                                {sub.retailerAvatar ? <SafeImage src={sub.retailerAvatar} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">{sub.retailerName.slice(0,2)}</div>}
                                            </div>
                                            <div className="font-bold text-gray-900 text-sm">{sub.retailerName}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{sub.zone}</div>
                                        <div className="text-xs text-gray-500">{sub.tier}</div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        {sub.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-sm overflow-hidden cursor-pointer border border-gray-200" onClick={() => setSelectedSubmission(sub)}>
                                            <SafeImage src={sub.image} className="w-full h-full object-cover hover:scale-110 transition"/>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={sub.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {sub.status === 'Pending' ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleApprove(sub.id)} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-sm hover:bg-emerald-100" title="Approve"><CheckCircle2 size={16}/></button>
                                                <button onClick={() => setSelectedSubmission(sub)} className="p-1.5 bg-red-50 text-red-600 rounded-sm hover:bg-red-100" title="Reject"><XCircle size={16}/></button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-xs">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )} 
          </div>
        )}
       </div>

       {/* Review Modal (Preserved logic, just ensured z-index) */}
       {selectedSubmission && (
           <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4" onClick={() => setSelectedSubmission(null)}>
               <div className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
                   {/* Full Image */}
                   <div className="bg-black flex-1 flex items-center justify-center p-4 relative">
                       <SafeImage src={selectedSubmission.image} alt="Full Proof" className="max-w-full max-h-[80vh] object-contain" />
                       <button onClick={() => setSelectedSubmission(null)} className="absolute top-4 right-4 text-white hover:opacity-70"><XCircle size={24}/></button>
                   </div>
                   
                   {/* Sidebar Controls */}
                   <div className="w-full md:w-80 p-6 flex flex-col bg-white border-l border-gray-100 overflow-y-auto">
                       <div className="flex items-center gap-3 mb-4">
                           <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0">
                                {selectedSubmission.retailerAvatar ? <SafeImage src={selectedSubmission.retailerAvatar} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">{selectedSubmission.retailerName.slice(0,2)}</div>}
                           </div>
                           <div>
                               <h3 className="font-bold text-gray-900 leading-tight">{selectedSubmission.retailerName}</h3>
                               <p className="text-xs text-gray-500">{selectedSubmission.tier} • {selectedSubmission.zone}</p>
                           </div>
                       </div>
                       
                       <div className="py-4 border-t border-gray-100 mb-4">
                           <div className="text-xs font-gray-500 mb-1">Submitted on</div>
                           <div className="font-medium text-sm">{selectedSubmission.date}</div>
                       </div>

                       {selectedSubmission.comment && (
                           <div className="mb-6">
                               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Comment</label>
                               <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">"{selectedSubmission.comment}"</p>
                           </div>
                       )}

                       <div className="mt-auto space-y-3">
                           {selectedSubmission.status === 'Pending' || selectedSubmission.status === 'Rejected' ? (
                               <>
                                   <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Decision</label>
                                   <button 
                                      onClick={() => handleApprove(selectedSubmission.id)}
                                      className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                                   >
                                       <CheckCircle2 size={18}/> Approve
                                   </button>
                                   
                                   <div className="relative my-2">
                                       <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                                       <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Or Reject</span></div>
                                   </div>

                                   <textarea 
                                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden resize-none"
                                      rows={3}
                                      placeholder="Reason... (Required for rejection)"
                                      value={rejectReason}
                                      onChange={(e) => setRejectReason(e.target.value)}
                                   ></textarea>
                                   <button 
                                      onClick={() => handleReject(selectedSubmission.id)}
                                      className="w-full py-2 bg-white text-red-600 border border-red-200 font-bold rounded-lg hover:bg-red-50 transition"
                                   >
                                       Reject Submission
                                   </button>
                               </>
                           ) : (
                               <div className="text-center py-4 bg-emerald-50 rounded-lg text-emerald-800 font-bold">
                                   <CheckCircle2 size={24} className="mx-auto mb-2"/>
                                   Approved
                               </div>
                           )}
                       </div>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

export default TaskReview;
