import React, { useState, useMemo } from 'react';
import { Download, Search, Filter, Calendar, FileText, Image as ImageIcon, Film, FileSpreadsheet, AlertCircle, Clock, CheckCircle2, User, Info, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { getDownloadHistory, addDownloadLog } from '../../../data/mockStore/downloadStore';
import { memberStore } from '../../../data/mockStore/memberStore';
import { brands as mockBrands } from '../../../data/mockStore/brandStore'; // Direct Import
import { useToast } from '../../../brand/context/ToastContext';
import Tooltip from '../../../components/Tooltip';
import DropdownSelect from '../../../components/common/DropdownSelect';
import UniversalPreview from '../../../components/common/UniversalPreview';
import Popover from '../../../components/common/Popover';

// Helper to format date relative (simplified)
const getRelativeTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};

// Helper to format full date for tooltip
const formatDate = (isoString) => {
    return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }).format(new Date(isoString));
};

// Helper to format log date
const formatLogDate = (isoString) => {
    return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric',
        hour12: true 
    }).format(new Date(isoString));
};

// Helper for file icons
const getFileIcon = (file, isDeleted) => {
    const type = file.type?.toLowerCase();
    
    // If it's an image and has a URL and NOT deleted
    if (['jpg', 'png', 'image'].includes(type) && file.url && !isDeleted) {
        return <img src={file.url} alt={file.name} className="w-full h-full object-cover rounded-lg" />;
    }

    // Default Icons
    switch (type) {
        case 'pdf': return <FileText size={16} />;
        case 'image':
        case 'jpg':
        case 'png': return <ImageIcon size={16} />;
        case 'video':
        case 'mp4': return <Film size={16} />;
        case 'sheet':
        case 'xlsx': return <FileSpreadsheet size={16} />;
        default: return <FileText size={16} />;
    }
};

const ITEMS_per_PAGE = 8; 

// Note: brands prop might be passed, but we use mockBrands for direct reliability in this prototype stage
const DownloadHistory = ({ brands = mockBrands, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState(getDownloadHistory());
  const { addToast: showToast } = useToast();
  
  // Preview State
  const [previewState, setPreviewState] = useState({ isOpen: false, initialIndex: 0 });

  // States for filters
  const [brandFilter, setBrandFilter] = useState('All Brands');
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [userFilter, setUserFilter] = useState('All Users');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const handleDownload = (item) => {
      if (item.currentVersionStatus === 'source_deleted') return;

      // Mock Download Action
      addDownloadLog(item.fileId, item.brandId, item.sourceType, item.sourceTitle, 'Me'); 
      
      // Refresh Data (Store updates and moves to top)
      setHistory(getDownloadHistory());
      setCurrentPage(1); // Reset to first page on update

      showToast(`File downloaded. History updated.`, 'success');
  };

  const handleSourceClick = (item) => {
      // Allow navigation even if source is deleted
      const targetPage = item.sourceType.toLowerCase() === 'campaign' 
        ? 'brand-center-campaigns' 
        : 'brand-center-resources';
    
      if (onNavigate) {
          onNavigate(targetPage);
          showToast(`Navigating to ${item.sourceType}...`, 'info'); 
      }
  };

  const filteredHistory = useMemo(() => {
      return history.filter(item => {
          // 1. Search
          const textMatch = item.file.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.sourceTitle.toLowerCase().includes(searchTerm.toLowerCase());
          if (!textMatch) return false;

          // 2. Brand Filter
          if (brandFilter !== 'All Brands') {
              const brand = brands.find(b => b.id === item.brandId);
              if (brand?.name !== brandFilter) return false;
          }

          // 3. Time Filter
          if (timeFilter !== 'All Time') {
              const date = new Date(item.downloadedAt);
              const now = new Date(); 
              const diffTime = Math.abs(now - date);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
              
              if (timeFilter === 'Last 7 Days' && diffDays > 7) return false;
              if (timeFilter === 'Last 30 Days' && diffDays > 30) return false;
          }

          // 4. Type Filter
          if (typeFilter !== 'All Types') {
              const ext = item.file.type?.toLowerCase();
              if (typeFilter === 'Documents' && !['pdf', 'doc', 'docx'].includes(ext)) return false;
              if (typeFilter === 'Images' && !['jpg', 'png', 'image'].includes(ext)) return false;
              if (typeFilter === 'Videos' && !['mp4', 'mov', 'video'].includes(ext)) return false;
          }

          // 5. Status Filter
          if (statusFilter !== 'All Statuses') {
              if (statusFilter === 'Update' && item.currentVersionStatus !== 'update_available') return false;
              if (statusFilter === 'Deleted' && item.currentVersionStatus !== 'source_deleted') return false;
              if (statusFilter === 'Latest' && item.currentVersionStatus !== 'latest') return false;
          }

          // 6. User Filter
          if (userFilter !== 'All Users') {
              if (userFilter === 'Me' && item.downloadedBy !== 'Me' && item.downloadedBy !== 'Sarah Jenkins') return false; 
              if (userFilter !== 'Me' && item.downloadedBy !== userFilter) return false;
          }
          
          return true;
      });
  }, [history, searchTerm, brandFilter, timeFilter, typeFilter, statusFilter, userFilter, brands]);

  // Handle Preview
  const handlePreview = (item) => {
      // Find the index of this item in the filtered list (so we can navigate left/right through the current view)
      const index = filteredHistory.findIndex(i => i.id === item.id);
      if (index !== -1) {
          setPreviewState({ isOpen: true, initialIndex: index });
      }
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredHistory.length / ITEMS_per_PAGE);
  const paginatedData = filteredHistory.slice((currentPage - 1) * ITEMS_per_PAGE, currentPage * ITEMS_per_PAGE);

  return (
    <div className="px-8 pb-8 h-full flex flex-col min-h-0">
      {/* 1. Filters & Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by file name..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C5A065]/20 focus:border-[#C5A065] transition-all outline-hidden"
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
             {/* Brand Filter */}
             <DropdownSelect 
                value={brandFilter}
                onChange={(val) => { setBrandFilter(val); setCurrentPage(1); }}
                options={['All Brands', ...brands.map(b => b.name)]}
                icon={Filter}
                className="w-[180px]"
             />

             {/* User Filter */}
             <DropdownSelect 
                value={userFilter}
                onChange={(val) => { setUserFilter(val); setCurrentPage(1); }}
                options={['All Users', 'Me', ...memberStore.members.map(m => m.name)]}
                icon={User}
                className="w-[160px]"
             />

             {/* Type Filter */}
             <DropdownSelect 
                value={typeFilter}
                onChange={(val) => { setTypeFilter(val); setCurrentPage(1); }}
                options={['All Types', 'Documents', 'Images', 'Videos']}
                icon={FileText}
                className="w-[150px]"
             />

             {/* Status Filter */}
             <DropdownSelect 
                value={statusFilter}
                onChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
                options={['All Statuses', 'Update', 'Deleted', 'Latest']}
                icon={LayoutGrid}
                className="w-[150px]"
             />

             {/* Time Filter */}
             <DropdownSelect 
                value={timeFilter}
                onChange={(val) => { setTimeFilter(val); setCurrentPage(1); }}
                options={['All Time', 'Last 7 Days', 'Last 30 Days']}
                icon={Clock}
                className="w-[150px]"
             />
        </div>
      </div>

      {/* 2. Table and Pagination Container */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden flex flex-col flex-1 min-h-0">
        
        {/* Scrollable Table Area */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left relative border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10 shadow-xs">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider font-sans w-[25%]">File</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider font-sans w-[15%]">Brand</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider font-sans w-[15%]">Source</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider font-sans w-[10%]">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider font-sans w-[15%]">
                    <div className="flex items-center gap-1">
                        User
                        <Tooltip content="Last person to download this file">
                           <Info size={12} className="text-gray-400 cursor-help" />
                        </Tooltip>
                    </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider font-sans w-[5%]">
                    <div className="flex items-center justify-center gap-1">
                        Count
                        <Tooltip content="Total downloads by store">
                           <Info size={12} className="text-gray-400 cursor-help" />
                        </Tooltip>
                    </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider font-sans w-[10%]">
                    <div className="flex items-center gap-1">
                        Date
                        <Tooltip content="This is the latest download time">
                           <Info size={12} className="text-gray-400 cursor-help" />
                        </Tooltip>
                    </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedData.map(item => {
                const brand = brands.find(b => b.id === item.brandId) || { name: 'Unknown', logo: '' };
                const isUpdateAvailable = item.currentVersionStatus === 'update_available';
                const isDeleted = item.currentVersionStatus === 'source_deleted';
                
                // Mock Avatar based on name (User Initials)
                const userInitials = item.downloadedBy.split(' ').map(n=>n[0]).join('').slice(0,2);
                
                // Generate a consistent neutral color based on name length for variety without being visually overwhelming
                // Or just use subtle gray as requested by refined PRD.
                const avatarBg = "bg-gray-200 text-gray-600"; 

                return (
                  <tr key={item.id} className="group hover:bg-gray-50 transition-colors duration-200">
                    {/* File Info */}
                    <td className="px-6 py-4">
                       <div 
                         className={`flex items-center gap-3 group/file ${isDeleted ? 'cursor-default' : 'cursor-pointer'}`}
                         onClick={() => !isDeleted && handlePreview(item)}
                       >
                          <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center overflow-hidden transition-transform duration-200 ${isDeleted ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-600 group-hover/file:scale-105'}`}>
                             {getFileIcon(item.file, isDeleted)}
                          </div>
                          <div className="min-w-0">
                              {/* Filename hover: NO change in color. Deleted: Strikethrough */}
                              <div className={`font-medium text-sm truncate max-w-[200px] transition-colors ${isDeleted ? 'text-red-400 line-through' : 'text-gray-900 group-hover/file:text-[#C5A065]'}`}>
                                {item.file.name}
                              </div>
                              <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mt-0.5">
                                {item.file.type || 'FILE'}
                              </div>
                          </div>
                       </div>
                    </td>

                    {/* Brand */}
                    <td className="px-6 py-4">
                        <div 
                            className="flex items-center gap-2 cursor-pointer group/brand"
                            onClick={() => onNavigate && onNavigate('brand-dashboard')}
                        >
                           {/*  
                               Handling brand logo which could be a URL (string) or a CSS class (string starting with 'bg-').
                           */}
                            {brand.logo && !brand.logo.startsWith('bg-') ? (
                                <img src={brand.logo} alt={brand.name} className="w-6 h-6 rounded-full object-cover border border-gray-100 group-hover/brand:opacity-80 transition-opacity" />
                            ) : (
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border border-gray-100 group-hover/brand:opacity-80 transition-opacity ${brand.logo?.startsWith('bg-') ? brand.logo : 'bg-gray-200 text-gray-600'}`}>
                                    {!brand.logo?.startsWith('bg-') && brand.name[0]}
                                </div>
                            )}
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[120px] group-hover/brand:text-[#C5A065] transition-colors">{brand.name}</span>
                        </div>
                    </td>

                    {/* Source */}
                    <td className="px-6 py-4">
                        <div 
                            className="flex flex-col cursor-pointer"
                            onClick={() => handleSourceClick(item)}
                            title="Go to source"
                        >
                             <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                                {item.sourceType}
                             </span>
                             {/* Requirement: Source clickable even if deleted. Text color logic tailored. */}
                             <span className={`text-sm font-medium transition-colors truncate max-w-[140px] ${isDeleted ? 'text-gray-400 hover:text-[#C5A065] hover:underline' : 'text-gray-800 hover:text-[#C5A065] hover:underline'}`}>
                                {item.sourceTitle}
                             </span>
                        </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                        {isUpdateAvailable ? (
                             <Tooltip content="Brand has updated this file">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100 cursor-help">
                                    Update
                                </span>
                             </Tooltip>
                        ) : isDeleted ? (
                            <Tooltip content="Source file removed by brand.">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100 cursor-help">
                                    Deleted
                                </span>
                            </Tooltip>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                                Latest
                            </span>
                        )}
                    </td>

                    {/* User */}
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                             <div className={`w-6 h-6 rounded-full ${avatarBg} flex items-center justify-center text-[10px] font-bold`}>
                                {userInitials}
                             </div>
                             <span className="text-sm text-gray-700 truncate max-w-[100px]">{item.downloadedBy}</span>
                        </div>
                    </td>

                    {/* Frequency / Count */}
                    <td className="px-6 py-4 text-center">
                         {(() => {
                             // Prepare mock logs if not present
                             const logs = item.logs || [
                                 { 
                                     userName: item.downloadedBy, 
                                     date: item.downloadedAt, 
                                     status: item.currentVersionStatus === 'latest' ? 'Latest' : 'Previous' 
                                 }
                             ];

                             const LogListContent = (
                                 <div className="min-w-[300px] max-h-[300px] overflow-y-auto pb-2">
                                     <div className="px-4 py-2 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider sticky top-0 bg-white z-10">
                                         Download History
                                     </div>
                                     <div className="divide-y divide-gray-50">
                                        {logs.map((log, idx) => {
                                            const initials = log.userName.split(' ').map(n=>n[0]).join('').slice(0,2);
                                            // Status Badge Logic
                                            const isLatest = log.status.toLowerCase() === 'latest';
                                            
                                            return (
                                                <div key={idx} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                                                    {/* Avatar */}
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold shrink-0">
                                                        {initials}
                                                    </div>
                                                    
                                                    {/* Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2 mb-0.5">
                                                            <span className="text-sm font-medium text-gray-900 truncate">{log.userName}</span>
                                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm border ${isLatest ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                                                                {log.status}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {formatLogDate(log.date)}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                     </div>
                                 </div>
                             );

                             return (
                                <div className="flex justify-center">
                                    <Popover 
                                        position="bottom"
                                        trigger={
                                            <div className="group/badge"> 
                                                <Tooltip content="View download logs">
                                                    <div className="bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full transition-colors cursor-pointer border border-transparent hover:border-gray-300">
                                                        {item.frequency}
                                                    </div>
                                                </Tooltip>
                                            </div>
                                        }
                                        content={LogListContent}
                                    />
                                </div>
                             );
                         })()}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                        <span className="text-sm text-gray-500 whitespace-nowrap cursor-default" title={formatDate(item.downloadedAt)}>
                            {getRelativeTime(item.downloadedAt)}
                        </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                       <button 
                            onClick={() => handleDownload(item)}
                            disabled={isDeleted}
                            className={`p-2 rounded-full transition-all duration-200 ${
                                isDeleted 
                                    ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
                                    : 'text-gray-400 hover:text-white hover:bg-gray-900 active:scale-95'
                            }`}
                            title={isDeleted ? 'Source file deleted' : 'Download again'}
                       >
                          <Download size={18} />
                       </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredHistory.length === 0 && (
             <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                    <Download size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No downloads found</h3>
                <p className="text-gray-500 max-w-sm">
                    Try adjusting your filters or search terms.
                </p>
             </div>
          )}
        </div>

        {/* Pagination Footer - Sticky at bottom of card */}
        {totalPages > 1 && (
            <div className="shrink-0 flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                 <div className="text-xs text-gray-500">
                     Showing {((currentPage - 1) * ITEMS_per_PAGE) + 1} to {Math.min(currentPage * ITEMS_per_PAGE, filteredHistory.length)} of {filteredHistory.length} entries
                 </div>
                 <div className="flex items-center gap-2">
                     <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className={`p-1.5 rounded-lg border border-gray-200 text-gray-600 transition ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:shadow-xs'}`}
                     >
                         <ChevronLeft size={16} />
                     </button>
                     <span className="text-xs font-medium text-gray-700 px-2">
                         Page {currentPage} of {totalPages}
                     </span>
                     <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className={`p-1.5 rounded-lg border border-gray-200 text-gray-600 transition ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:shadow-xs'}`}
                     >
                         <ChevronRight size={16} />
                     </button>
                 </div>
            </div>
        )}
      </div>

      {/* Universal File Previewer */}
      <UniversalPreview 
         isOpen={previewState.isOpen}
         onClose={() => setPreviewState(prev => ({ ...prev, isOpen: false }))}
         files={filteredHistory}
         initialIndex={previewState.initialIndex}
      />
    </div>
  );
};

export default DownloadHistory;
