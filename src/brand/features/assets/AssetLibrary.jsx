import React, { useState } from 'react';
import { campaignData } from '../../../data/mockStore/campaignStore'; // Import store for asset lookup
import { Plus, Filter, MoreHorizontal, Download, FileText, Image as ImageIcon, Video, Mail, Smartphone, Instagram, Facebook, Twitter, Edit2, Eye, Trash2, Folder, FolderOpen, ChevronRight, ChevronDown, CheckCircle2, Lock, LayoutGrid, List as ListIcon, Grid, ArrowUpRight, Search, RefreshCw, Box, FolderTree, Info, Megaphone, X, Clock, Tag } from 'lucide-react';
import EmptyState from '../../components/EmptyState';

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileDetailModal = ({ file, isOpen, onClose, campaigns, onDelete }) => {
  if (!isOpen || !file) return null;

  const usedIn = campaigns.filter(c => {
      const contentValues = campaignData.contentMap[c.contentId];
      const assets = contentValues?.downloadable || [];
      return assets.some(a => a.id === file.id);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xs animate-fade-in" onClick={onClose}></div>
      <div className="relative w-full h-full bg-white sm:rounded-none overflow-hidden shadow-2xl animate-slide-up flex flex-col sm:flex-row z-10">
         
         {/* Close Button (Mobile/Desktop) */}
         <button onClick={onClose} className="absolute top-6 right-6 z-20 p-2 bg-white/10 hover:bg-black/10 text-black rounded-full transition">
            <X size={24}/>
         </button>

         {/* Preview Section */}
         <div className="w-full sm:w-3/4 bg-gray-50 flex items-center justify-center p-8 relative h-[40vh] sm:h-full border-b sm:border-b-0 sm:border-r border-gray-200">
            {file.type === 'image' ? (
               <div className="relative shadow-2xl rounded-lg overflow-hidden max-w-full max-h-full">
                  <img src="/api/placeholder/1200/800" alt={file.name} className="max-w-full max-h-full object-contain"/>
                  {/* Fallback if image fails (simulated here since we use placeholder) */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 -z-10">
                     <ImageIcon size={64} className="text-gray-300"/>
                  </div>
               </div>
            ) : (
               <div className="w-96 h-96 bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center text-gray-400 border border-gray-100">
                  {file.type === 'video' && <Video size={80} className="mb-6 text-purple-500"/>}
                  {file.type === 'pdf' && <FileText size={80} className="mb-6 text-orange-500"/>}
                  {file.type === 'folder' && <Folder size={80} className="mb-6 text-yellow-500"/>}
                  <span className="text-2xl font-medium uppercase tracking-wider text-gray-500">{file.type} Preview</span>
               </div>
            )}
         </div>

         {/* Details Section */}
         <div className="w-full sm:w-1/4 bg-white flex flex-col h-full overflow-hidden">
            <div className="p-8 border-b border-gray-100">
               <h2 className="text-2xl font-bold text-gray-900 wrap-break-word leading-tight">{file.name}</h2>
               <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                  <Clock size={14}/>
                  <span>Added on {file.date}</span>
               </div>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto flex-1">
               {/* Tags Section [NEW] */}
               <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                     <Tag size={12}/> Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                     {['Campaign', 'Social', 'Q4'].map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium hover:bg-gray-200 cursor-pointer transition">
                           {tag}
                        </span>
                     ))}
                     <button className="px-2 py-1 border border-dashed border-gray-300 text-gray-400 text-xs rounded-md hover:border-gray-400 hover:text-gray-600 transition flex items-center gap-1">
                        <Plus size={10}/> Add Tag
                     </button>
                  </div>
               </div>

               {/* Metadata */}
               <div className="space-y-2 text-xs">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">File Metadata</h3>
                  <div className="flex justify-between py-1.5 border-b border-gray-50">
                     <span className="text-gray-500">Type</span>
                     <span className="font-medium capitalize text-gray-900">{file.extension || file.type}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-50">
                     <span className="text-gray-500">Size</span>
                     <span className="font-medium text-gray-900">{formatBytes(file.size)}</span>
                  </div>
                  {file.dimensions && (
                  <div className="flex justify-between py-1.5 border-b border-gray-50">
                     <span className="text-gray-500">Dimensions</span>
                     <span className="font-medium text-gray-900">{file.dimensions}</span>
                  </div>
                  )}
                  <div className="flex justify-between py-1.5 border-b border-gray-50">
                     <span className="text-gray-500">Date Added</span>
                     <span className="font-medium text-gray-900">{file.date}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-50">
                     <span className="text-gray-500">Modified</span>
                     <span className="font-medium text-gray-900">{file.date}</span>
                  </div>
               </div>
               {/* Usage Info */}
               {file.type !== 'folder' && (
               <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                     Usage History <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">{usedIn.length}</span>
                  </h3>
                  {usedIn.length === 0 ? (
                     <div className="text-sm text-gray-500 italic bg-gray-50 p-6 rounded-xl border border-dashed border-gray-200 text-center">
                        Not currently used in any campaigns.
                     </div>
                  ) : (
                     <div className="space-y-3">
                        {usedIn.map(c => (
                           <div key={c.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition group cursor-pointer bg-white shadow-xs">
                              <div className={`w-10 h-10 rounded-lg ${c.cover} shrink-0 shadow-xs`}></div>
                              <div className="flex-1 min-w-0">
                                 <div className="text-sm font-bold text-gray-900 truncate">{c.title}</div>
                                 <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Live' ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                                    {c.status}
                                 </div>
                              </div>
                              <ArrowUpRight size={16} className="text-gray-300 group-hover:text-indigo-600"/>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
               )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
               <button className="flex-1 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2">
                  <Download size={18}/> Download
               </button>
               {!file.isSystem && (
               <button onClick={() => onDelete(file.id)} className="px-5 py-3 bg-white border border-gray-200 text-red-600 rounded-xl font-medium hover:bg-red-50 hover:border-red-100 transition flex items-center justify-center gap-2 shadow-xs">
                  <Trash2 size={18}/>
               </button>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

const FolderTreeItem = ({ folder, files, currentFolderId, onSelect, level = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const children = files.filter(f => f.parentId === folder.id && f.type === 'folder');
    const hasChildren = children.length > 0;
    const isSelected = currentFolderId === folder.id;

    return (
        <div>
            <div 
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer transition select-none ${isSelected ? 'bg-white shadow-xs text-black font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                style={{ paddingLeft: `${level * 12 + 12}px` }}
                onClick={() => onSelect(folder.id)}
            >
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                    className={`p-0.5 rounded-sm hover:bg-gray-200 text-gray-400 ${hasChildren ? 'opacity-100' : 'opacity-0'}`}
                >
                    {isExpanded ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}
                </button>
                
                {folder.source === 'dropbox' ? (
                   <Box size={14} className="text-[#0061FF]"/>
                ) : folder.isSystem ? (
                   <Lock size={14} className="text-gray-400"/>
                ) : (
                   isSelected ? <FolderOpen size={14} className="text-yellow-500 fill-yellow-500"/> : <Folder size={14} className="text-yellow-500"/>
                )}
                
                <span className="truncate">{folder.name}</span>
            </div>
            {isExpanded && hasChildren && (
                <div>
                    {children.map(child => (
                        <FolderTreeItem 
                            key={child.id} 
                            folder={child} 
                            files={files} 
                            currentFolderId={currentFolderId} 
                            onSelect={onSelect}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const NewFolderDialog = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
       <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95">
          <h3 className="text-lg font-bold mb-4">Create New Folder</h3>
          <input 
             autoFocus
             value={name}
             onChange={e => setName(e.target.value)}
             placeholder="Folder Name"
             className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-black focus:outline-hidden"
             onKeyDown={e => e.key === 'Enter' && name && onCreate(name)}
          />
          <div className="flex justify-end gap-2">
             <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
             <button onClick={() => onCreate(name)} disabled={!name} className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50">Create</button>
          </div>
       </div>
    </div>
  );
};

const AssetLibrary = ({ files, setFiles, campaigns, notify, isEmpty }) => {
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [detailFile, setDetailFile] = useState(null);
  const [currentFolderId, setCurrentFolderId] = useState(null); // null means root
  const [isFolderPanelOpen, setIsFolderPanelOpen] = useState(true);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest'
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isFolderActionsOpen, setIsFolderActionsOpen] = useState(false);
  const [activeActionFileId, setActiveActionFileId] = useState(null); // [NEW] Track active dropdown

  // Mock Storage Data
  const storageUsed = 90.4; // GB
  const storageTotal = 100; // GB
  const storagePercent = (storageUsed / storageTotal) * 100;

  if (isEmpty) return <EmptyState title="Asset Library Empty" description="Your asset library is the central hub for all your brand assets." action="Upload Files" onAction={() => notify('Upload Clicked', 'success')} />;

  // Filter files based on current folder and search/type
  const currentFolder = files.find(f => f.id === currentFolderId);
  
  const filteredFiles = files.filter(f => {
    // 1. Folder Level Filter
    if (f.parentId !== currentFolderId) return false;

    // 2. Search Filter
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    
    // 3. Type Filter (Folders are always shown unless filtered out by search, but usually we want folders + files)
    // If filterType is 'all', show everything. If specific type, show that type AND folders (optional, but usually good UX)
    // For now, let's say filterType applies to files only, folders always show if 'all' or if matches search
    const isFolder = f.type === 'folder';
    const matchesType = filterType === 'all' ? true : f.type === filterType;

    return matchesSearch && (isFolder || matchesType);
  }).sort((a, b) => {
      // 1. System Folders Top
      if (a.isSystem && !b.isSystem) return -1;
      if (!a.isSystem && b.isSystem) return 1;
      
      // 2. Folders before Files
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;

      // 3. Sort
      if (sortBy === 'newest') {
          return b.date.localeCompare(a.date);
      } else {
          return a.date.localeCompare(b.date);
      }
  });

  // Breadcrumbs Logic
  const getBreadcrumbs = () => {
     const crumbs = [];
     
     // Recursive function to build path
     const buildPath = (folderId) => {
        const folder = files.find(f => f.id === folderId);
        if (folder) {
           if (folder.parentId) {
              buildPath(folder.parentId);
           }
           crumbs.push({ id: folder.id, name: folder.name });
        }
     };

     if (currentFolderId) {
        buildPath(currentFolderId);
     }
     
     // Prepend Root
     crumbs.unshift({ id: null, name: 'All Assets' });

     // Remove current folder from breadcrumbs (as per user request, since it's in the header)
     if (currentFolderId) {
        crumbs.pop();
     }

     return crumbs;
  };

  const toggleSelection = (id) => {
      if (selectedFiles.includes(id)) {
          setSelectedFiles(selectedFiles.filter(fid => fid !== id));
      } else {
          setSelectedFiles([...selectedFiles, id]);
      }
  };

  const handleDeleteSelected = () => {
      // Check for usage
      const usedFiles = selectedFiles.filter(fid => {
         const file = files.find(f => f.id === fid);
         return file && !file.isSystem && campaigns.some(c => {
             const contentValues = campaignData.contentMap[c.contentId];
             const assets = contentValues?.downloadable || [];
             return assets.some(a => a.id === fid);
         });
      });

      if (usedFiles.length > 0) {
         alert(`Warning: ${usedFiles.length} selected file(s) are currently being used in active campaigns. Deleting them will cause missing assets in those campaigns.`);
         return; // Or allow with confirmation
      }

      if (confirm(`Delete ${selectedFiles.length} items?`)) {
          setFiles(files.filter(f => !selectedFiles.includes(f.id)));
          setSelectedFiles([]);
          notify('Files deleted', 'success');
      }
  };

  const handleDeleteSingle = (id) => {
      const file = files.find(f => f.id === id);
      if (file.isSystem) {
         notify('Cannot delete system folder', 'error');
         return;
      }

      // If folder, check if empty
      if (file.type === 'folder') {
          const hasChildren = files.some(f => f.parentId === id);
          if (hasChildren) {
              notify('Cannot delete non-empty folder', 'error');
              return;
          }
      }

      // Check usage
      const usedIn = campaigns.filter(c => {
          const contentValues = campaignData.contentMap[c.contentId];
          const assets = contentValues?.downloadable || [];
          return assets.some(a => a.id === id);
      });
      if (usedIn.length > 0) {
         const campaignNames = usedIn.map(c => c.title).join(', ');
         if (!confirm(`WARNING: This file is being used by '${campaignNames}'. Deleting it will cause missing assets in these campaigns. Are you sure?`)) {
            return;
         }
      } else {
         if (!confirm(`Delete this ${file.type === 'folder' ? 'folder' : 'file'}?`)) return;
      }

      setFiles(files.filter(f => f.id !== id));
      if (detailFile && detailFile.id === id) setDetailFile(null);
      
      // If we deleted the current folder (from header), go up
      if (currentFolderId === id) {
          setCurrentFolderId(file.parentId);
      }
      
      notify(`${file.type === 'folder' ? 'Folder' : 'File'} deleted`, 'success');
  };

  const handleSelectAll = () => {
      if (selectedFiles.length === filteredFiles.length) {
          setSelectedFiles([]);
      } else {
          setSelectedFiles(filteredFiles.map(f => f.id));
      }
  };

  const handleCreateNewFolder = (name) => {
     const newFolder = {
        id: `fol${Date.now()}`,
        name,
        type: 'folder',
        size: 0,
        date: new Date().toISOString().split('T')[0],
        parentId: currentFolderId
     };
     setFiles([newFolder, ...files]);
     setCurrentFolderId(newFolder.id); // Auto-navigate
     setNewFolderDialogOpen(false);
     notify('Folder created', 'success');
  };

  const handleItemClick = (file) => {
     if (file.type === 'folder') {
        setCurrentFolderId(file.id);
        setSelectedFiles([]); // Clear selection on nav
     } else {
        setDetailFile(file);
     }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* [A] Page Header */}
      <div className="px-8 py-6 flex items-center justify-between bg-white border-b border-gray-100">
         <div>
             <h1 className="text-2xl font-bold text-gray-900 mb-1">Brand Files</h1>
             <p className="text-gray-500 text-sm">The centralized library for all your internal media, documents, and creative assets.</p>
         </div>
         
         {/* Compact Storage Status */}
         <div className="hidden md:flex items-center bg-white rounded-xl border border-gray-200 shadow-xs py-2 px-5 gap-6">
             {/* Storage Pool */}
             <div className="flex flex-col gap-1.5 min-w-[200px]">
                 <div className="flex items-center justify-between">
                     <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Storage</span>
                     <span className="text-gray-900 font-medium text-xs tabular-nums">{storageUsed}GB / {storageTotal}GB</span>
                 </div>
                 <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#B8A77E]" style={{ width: `${storagePercent}%` }}></div>
                 </div>
             </div>

             <div className="w-px h-8 bg-gray-100"></div>

             <button className="text-indigo-600 hover:text-indigo-700 text-xs font-bold uppercase tracking-wider hover:underline transition px-1">
                 Upgrade
             </button>
         </div>
       </div>

      {/* [C] Main Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Panel */}
          <div className={`${isFolderPanelOpen ? 'w-60 opacity-100' : 'w-0 opacity-0'} transition-all duration-300 border-r border-gray-100 bg-gray-50 flex flex-col overflow-hidden`}>
              <div className="p-4 font-medium text-xs text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <FolderTree size={14}/> Folder Structure
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {/* Root Item */}
                  <button 
                      onClick={() => setCurrentFolderId(null)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition ${currentFolderId === null ? 'bg-white shadow-xs text-black font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                      <Folder size={14} className="text-gray-400"/> All Assets
                  </button>
                  
                  {/* Recursive Tree */}
                  {files.filter(f => f.type === 'folder' && !f.parentId).map(folder => (
                      <FolderTreeItem 
                          key={folder.id} 
                          folder={folder} 
                          files={files} 
                          currentFolderId={currentFolderId} 
                          onSelect={setCurrentFolderId}
                      />
                  ))}
              </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-white">
              {/* [D] Control Center */}
          <div className="px-8 py-6 border-b border-gray-100 bg-white z-10">
             {/* D1: Top Row (Breadcrumbs & Search) */}
             <div className="flex flex-col gap-4 mb-4">
                {/* Row 1: Breadcrumbs */}
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <button 
                           onClick={() => setIsFolderPanelOpen(!isFolderPanelOpen)}
                           className={`p-2 rounded-lg transition ${isFolderPanelOpen ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}
                        >
                           <FolderTree size={18} className={isFolderPanelOpen ? "" : ""}/>
                        </button>
                        <div className="absolute top-full left-0 mt-2 px-2 py-1 bg-black text-white text-xs rounded-sm opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-20">
                           {isFolderPanelOpen ? 'Hide Folder Tree' : 'Show Folder Tree'}
                        </div>
                    </div>
                    <div className="h-4 w-px bg-gray-200"></div>
                     <div className="flex items-center text-sm text-gray-500">
                        {getBreadcrumbs().map((crumb, index, arr) => (
                           <React.Fragment key={crumb.id || 'root'}>
                              <span 
                                 className={`hover:text-black cursor-pointer transition ${index === arr.length - 1 ? 'font-medium text-black' : ''}`}
                                 onClick={() => setCurrentFolderId(crumb.id)}
                              >
                                 {crumb.name}
                              </span>
                              {index < arr.length - 1 && <ChevronRight size={14} className="mx-2 text-gray-300"/>}
                           </React.Fragment>
                        ))}
                     </div>
                 </div>
             </div>

                 {/* Row 2: Folder Header & Actions */}
                 <div className="flex items-center justify-between animate-in fade-in slide-in-from-left-2 mb-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                           {currentFolder ? currentFolder.name : 'All Assets'}
                           {currentFolder && currentFolder.isSystem && <Lock size={16} className="text-gray-400"/>}
                        </h2>
                        <span className="text-gray-400 text-sm font-medium">{filteredFiles.length} items</span>
                        
                        {/* More Actions Dropdown (Only for non-system folders) */}
                        {currentFolder && !currentFolder.isSystem && (
                        <div className="relative">
                           <button 
                              onClick={() => setIsFolderActionsOpen(!isFolderActionsOpen)}
                              className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition"
                           >
                              <MoreHorizontal size={18} />
                           </button>
                           {isFolderActionsOpen && (
                              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-30 animate-in fade-in zoom-in-95">
                                 <button onClick={() => { notify('Rename Folder', 'success'); setIsFolderActionsOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2 text-gray-700"><Edit2 size={14}/> Rename</button>
                                 <button onClick={() => { notify('Folder Info', 'success'); setIsFolderActionsOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2 text-gray-700"><Info size={14}/> Folder Info</button>
                                 <div className="h-px bg-gray-100 my-1"></div>
                                 <button onClick={() => { handleDeleteSingle(currentFolderId); setIsFolderActionsOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm flex items-center gap-2 text-red-600"><Trash2 size={14}/> Delete Folder</button>
                              </div>
                           )}
                        </div>
                        )}
                    </div>

                    {/* Folder Actions: Sync, New Folder & Upload */}
                    <div className="flex items-center gap-3">
                        {/* Sync Dropdown */}
                        <div className="relative">
                            <button 
                               className={`flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-xs text-sm font-medium ${isSyncOpen ? 'bg-gray-50 ring-2 ring-black/5' : ''}`}
                               onClick={() => setIsSyncOpen(!isSyncOpen)}
                               title="Sync from external sources"
                            >
                               <RefreshCw size={16} /> <span className="hidden sm:inline">Sync</span> <ChevronDown size={14}/>
                            </button>
                            {isSyncOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20 animate-in fade-in slide-in-from-top-2">
                               <button onClick={() => { notify('Syncing Dropbox...', 'success'); setIsSyncOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"><Box size={14} className="text-[#0061FF]"/> Dropbox</button>
                               <button onClick={() => { notify('Syncing OneDrive...', 'success'); setIsSyncOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"><div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">O</div> OneDrive</button>
                               <button onClick={() => { notify('Syncing Google Drive...', 'success'); setIsSyncOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"><div className="w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">G</div> Google Drive</button>
                            </div>
                            )}
                        </div>

                        <button 
                           className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-xs text-sm font-medium"
                           onClick={() => setNewFolderDialogOpen(true)}
                        >
                           <Plus size={16} /> New Folder
                        </button>
                        <button 
                           className="flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition shadow-xs text-sm font-medium" 
                           onClick={() => notify('Upload Dialog', 'success')}
                        >
                           <Plus size={16} /> Upload
                        </button>
                    </div>
                 </div>

              {/* D2: Bottom Row (Search, Filters & View) */}
              {/* Only show if folder is NOT empty OR if there is a search active */}
              {(filteredFiles.length > 0 || search || files.some(f => f.parentId === currentFolderId)) && (
              <div className="flex items-center justify-between h-10">
                 {selectedFiles.length > 0 ? (
                     /* Inline Batch Action Bar */
                     <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2 w-full">
                        <span className="font-medium text-sm bg-black text-white px-3 py-1 rounded-full">{selectedFiles.length} selected</span>
                        <div className="h-4 w-px bg-gray-200"></div>
                        <div className="flex items-center gap-2">
                           <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition" title="Download">
                              <Download size={16} /> Download
                           </button>
                           <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-red-50 rounded-lg text-sm font-medium text-red-600 transition" title="Delete" onClick={handleDeleteSelected}>
                              <Trash2 size={16} /> Delete
                           </button>
                           <div className="flex-1"></div>
                           <button className="text-gray-400 hover:text-black text-sm" onClick={() => setSelectedFiles([])}>
                              Cancel
                           </button>
                        </div>
                     </div>
                 ) : (
                     /* Search, Filters & View Switcher */
                     <>
                         <div className="flex items-center gap-4 flex-1">
                            {/* Search (Left Aligned) */}
                            <div className="relative">
                               <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                               <input 
                                  value={search}
                                  onChange={(e) => setSearch(e.target.value)}
                                  className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-black w-64 text-sm transition focus:bg-white"
                                  placeholder="Search files..."
                               />
                            </div>

                            <div className="h-6 w-px bg-gray-200"></div>

                            {/* File Type Dropdown */}
                            <div className="relative">
                               <button 
                                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-xs text-sm font-medium capitalize min-w-[120px] justify-between"
                               >
                                  <span>{filterType === 'all' ? 'All Types' : filterType + 's'}</span>
                                  <ChevronDown size={14} className="text-gray-400"/>
                               </button>
                               {isFilterDropdownOpen && (
                                  <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95">
                                     {['all', 'image', 'video', 'pdf', 'doc', 'zip'].map(type => (
                                        <button 
                                           key={type}
                                           onClick={() => { setFilterType(type); setIsFilterDropdownOpen(false); }}
                                           className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm capitalize ${filterType === type ? 'font-bold text-black bg-gray-50' : 'text-gray-600'}`}
                                        >
                                           {type === 'all' ? 'All Types' : type + 's'}
                                        </button>
                                     ))}
                                  </div>
                               )}
                            </div>
                         </div>

                         <div className="flex items-center gap-4">
                            {/* Sort Dropdown */}
                            <div className="relative">
                               <button 
                                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                                  className="font-medium text-black flex items-center gap-1 hover:opacity-70 text-sm"
                               >
                                  <span className="text-gray-400 font-normal mr-1">Sort by:</span> 
                                  {sortBy === 'newest' ? 'Date Added (Newest)' : 'Date Added (Oldest)'} 
                                  <ChevronDown size={14}/>
                               </button>
                               {isSortDropdownOpen && (
                                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95">
                                     <button onClick={() => { setSortBy('newest'); setIsSortDropdownOpen(false); }} className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${sortBy === 'newest' ? 'font-bold text-black bg-gray-50' : 'text-gray-600'}`}>Date Added (Newest)</button>
                                     <button onClick={() => { setSortBy('oldest'); setIsSortDropdownOpen(false); }} className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${sortBy === 'oldest' ? 'font-bold text-black bg-gray-50' : 'text-gray-600'}`}>Date Added (Oldest)</button>
                                  </div>
                               )}
                            </div>

                            {/* View Switcher */}
                            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                               <button onClick={() => setView('grid')} className={`p-1.5 rounded-sm ${view === 'grid' ? 'bg-white shadow-xs text-black' : 'text-gray-400 hover:text-black'}`}><Grid size={16}/></button>
                               <button onClick={() => setView('list')} className={`p-1.5 rounded-sm ${view === 'list' ? 'bg-white shadow-xs text-black' : 'text-gray-400 hover:text-black'}`}><ListIcon size={16}/></button>
                            </div>
                         </div>
                     </>
                 )}
              </div>
              )}
           </div>

      {/* [E] Main Asset Grid */}
      <div className="flex-1 overflow-y-auto p-8 bg-white relative">
         {filteredFiles.length === 0 ? (
             search ? (
               <div className="h-full flex flex-col items-center justify-center text-gray-400">
                 <Search size={48} className="mb-4 opacity-20"/>
                 <p>No files found matching "{search}".</p>
               </div>
             ) : (
               <div 
                  className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer min-h-[400px]"
                  onClick={() => notify('Upload Dialog', 'success')}
               >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                     <Plus size={32} className="text-gray-400"/>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">This folder is empty</h3>
                  <p className="text-sm mt-1">Click to upload files or drag and drop</p>
               </div>
             )
         ) : view === 'grid' ? (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-24">
             {filteredFiles.map(file => {
                const usageCount = campaigns.filter(c => {
                    const contentValues = campaignData.contentMap[c.contentId];
                    const assets = contentValues?.downloadable || [];
                    return assets.some(a => a.id === file.id);
                }).length;
                const isSelected = selectedFiles.includes(file.id);
                const isFolder = file.type === 'folder';
                
                return (
                   <div 
                     key={file.id} 
                     className={`group relative bg-white border rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${isSelected ? 'border-indigo-600 ring-1 ring-indigo-600 shadow-md' : 'border-gray-200 hover:shadow-lg hover:border-gray-300'}`} 
                     onClick={() => handleItemClick(file)}
                   >
                     {/* Selection Checkbox (Visible on Hover or Selected) - Not for system folders if we want to lock them completely, but user might want to select to copy? Let's allow select but disable delete */}
                     {!file.isSystem && (
                     <div 
                        className={`absolute top-3 left-3 z-10 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                        onClick={(e) => { e.stopPropagation(); toggleSelection(file.id); }}
                     >
                         <div className={`w-5 h-5 rounded-sm border flex items-center justify-center transition ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 hover:border-gray-400 shadow-xs'}`}>
                            {isSelected && <CheckCircle2 size={12}/>}
                         </div>
                     </div>
                     )}

                     {/* More Actions (Visible on Hover or if Active) */}
                     <div className={`absolute top-3 right-3 z-20 transition-opacity duration-200 ${activeActionFileId === file.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <div className="relative">
                           <button 
                              className={`p-1 rounded-sm border shadow-xs text-gray-600 transition ${activeActionFileId === file.id ? 'bg-gray-100 border-gray-300 text-black' : 'bg-white border-gray-200 hover:bg-gray-50'}`} 
                              onClick={(e) => { e.stopPropagation(); setActiveActionFileId(activeActionFileId === file.id ? null : file.id); }}
                           >
                              <MoreHorizontal size={16}/>
                           </button>
                           {activeActionFileId === file.id && (
                              <div className="absolute top-full right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-30 animate-in fade-in zoom-in-95">
                                 <button onClick={(e) => { e.stopPropagation(); notify('Rename', 'success'); setActiveActionFileId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-xs flex items-center gap-2 text-gray-700"><Edit2 size={12}/> Rename</button>
                                 <div className="h-px bg-gray-100 my-1"></div>
                                 <button onClick={(e) => { e.stopPropagation(); handleDeleteSingle(file.id); setActiveActionFileId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-xs flex items-center gap-2 text-red-600"><Trash2 size={12}/> Delete</button>
                              </div>
                           )}
                        </div>
                     </div>
                     
                     {/* Preview */}
                      <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
                         {isFolder ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-yellow-50/50 text-yellow-500">
                               {file.source === 'dropbox' ? (
                                  <Box size={48} className="mb-2 text-[#0061FF]"/>
                               ) : file.isSystem ? (
                                  <Lock size={48} className="mb-2 text-gray-400"/>
                               ) : (
                                  <Folder size={48} className="mb-2"/>
                               )}
                               {file.isSystem && <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{file.source === 'dropbox' ? 'Dropbox' : 'System Locked'}</span>}
                            </div>
                         ) : file.type === 'image' ? (
                           <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                              <ImageIcon size={48} />
                           </div>
                        ) : (
                           <div className="text-gray-400 flex flex-col items-center">
                              {file.type === 'video' && <Video size={32} className="mb-2"/>}
                              {file.type === 'pdf' && <FileText size={32} className="mb-2"/>}
                              <span className="text-xs uppercase font-bold">{file.type}</span>
                           </div>
                        )}
                        {/* Usage Badge - REMOVED from Preview to avoid overlap */}
                     </div>
 
                     <div className="p-3 relative flex flex-col">
                        <div className="flex items-start justify-between mb-auto">
                           <h3 className="font-medium text-gray-900 truncate pr-2 text-sm" title={file.name}>
                              {/* Hide extension for files */}
                              {!isFolder && file.name.includes('.') ? file.name.substring(0, file.name.lastIndexOf('.')) : file.name}
                           </h3>
                        </div>
                        
                        {/* Type Tag (Bottom Right of Preview - using negative top to overlap preview) */}
                        {!isFolder && (
                           <div className="absolute top-[-28px] right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1">
                              {file.type === 'image' ? <ImageIcon size={10}/> :
                               file.type === 'video' ? <Video size={10}/> :
                               file.type === 'pdf' ? <FileText size={10}/> : <FileText size={10}/>}
                              <span className="uppercase">{file.extension || file.type}</span>
                           </div>
                        )}

                        {/* Metadata: Size, Dimensions, Date */}
                        <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                           {isFolder ? (
                              <span>{files.filter(f => f.parentId === file.id).length} items</span>
                           ) : (
                              <>
                                 <div className="flex items-center gap-2">
                                    <span>{formatBytes(file.size)}</span>
                                    {file.dimensions && (
                                       <>
                                          <span className="w-0.5 h-0.5 bg-gray-300 rounded-full"></span>
                                          <span>{file.dimensions}</span>
                                       </>
                                    )}
                                 </div>
                                 <div className="text-gray-400 text-[10px]">{file.date}</div>
                              </>
                           )}
                        </div>

                        {/* Usage Info (Bottom) */}
                        {!isFolder && usageCount > 0 && (
                           <div className="mt-2 pt-2 border-t border-gray-100">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-medium border border-indigo-100">
                                 <Megaphone size={10} /> Used in {usageCount} campaigns
                              </span>
                           </div>
                        )}
                     </div>
                   </div>
                );
             })}
           </div>
         ) : (
           <div className="bg-white border border-gray-200 rounded-lg overflow-hidden pb-24">
              <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10">
                     <tr>
                        <th className="p-4 w-12">
                           <div className="w-4 h-4 border border-gray-300 rounded-sm bg-white flex items-center justify-center cursor-pointer" onClick={handleSelectAll}>
                              {selectedFiles.length > 0 && <div className="w-2 h-2 bg-black rounded-xs"></div>}
                           </div>
                        </th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Dimensions</th>
                        <th className="py-3 px-4">Usage</th>
                        <th className="py-3 px-4">Size</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 w-10"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {filteredFiles.map(file => {
                        const usageCount = campaigns.filter(c => {
                            const contentValues = campaignData.contentMap[c.contentId];
                            const assets = contentValues?.downloadable || [];
                            return assets.some(a => a.id === file.id);
                        }).length;
                        const isFolder = file.type === 'folder';
                        return (
                           <tr key={file.id} className={`hover:bg-gray-50 group cursor-pointer ${selectedFiles.includes(file.id) ? 'bg-indigo-50/50' : ''}`} onClick={() => handleItemClick(file)}>
                              <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                 <button onClick={() => toggleSelection(file.id)} className={`w-4 h-4 border rounded-sm flex items-center justify-center transition ${selectedFiles.includes(file.id) ? 'bg-black border-black text-white' : 'border-gray-300 bg-white hover:border-gray-400'}`}>
                                    {selectedFiles.includes(file.id) && <CheckCircle2 size={10} className="fill-current"/>}
                                 </button>
                              </td>
                              <td className="py-3 px-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-sm flex items-center justify-center text-gray-500">
                                       {isFolder ? <Folder size={16} className="text-yellow-500 fill-yellow-500"/> : 
                                        file.type === 'image' ? <ImageIcon size={16}/> :
                                        file.type === 'video' ? <Video size={16}/> :
                                        file.type === 'pdf' ? <FileText size={16}/> : <FileText size={16}/>}
                                    </div>
                                    <span className="font-medium text-gray-900 text-sm">
                                       {/* Hide extension in List View */}
                                       {!isFolder && file.name.includes('.') ? file.name.substring(0, file.name.lastIndexOf('.')) : file.name}
                                    </span>
                                 </div>
                              </td>
                              <td className="py-3 px-4">
                                 {!isFolder && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md w-fit">
                                       {file.type === 'image' ? <ImageIcon size={12}/> :
                                        file.type === 'video' ? <Video size={12}/> :
                                        file.type === 'pdf' ? <FileText size={12}/> : <FileText size={12}/>}
                                       <span className="uppercase font-medium">{file.extension || file.type}</span>
                                    </div>
                                 )}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-500">
                                 {file.dimensions || '-'}
                              </td>
                              <td className="p-4">
                                 {usageCount > 0 ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">
                                       <Megaphone size={10} /> {usageCount}
                                    </span>
                                 ) : <span className="text-gray-400 text-xs">-</span>}
                              </td>
                              <td className="p-4 text-sm text-gray-500 font-mono">{isFolder ? '-' : formatBytes(file.size)}</td>
                              <td className="p-4 text-sm text-gray-500">{file.date}</td>
                              <td className="p-4 text-right relative">
                                 <div className="relative">
                                    <button 
                                       className={`p-1.5 rounded-sm text-gray-400 hover:text-gray-900 transition ${activeActionFileId === file.id ? 'opacity-100 bg-gray-100 text-gray-900' : 'opacity-0 group-hover:opacity-100 hover:bg-gray-200'}`}
                                       onClick={(e) => { e.stopPropagation(); setActiveActionFileId(activeActionFileId === file.id ? null : file.id); }}
                                    >
                                       <MoreHorizontal size={16} />
                                    </button>
                                    {activeActionFileId === file.id && (
                                       <div className="absolute top-full right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-30 animate-in fade-in zoom-in-95 text-left">
                                          <button onClick={(e) => { e.stopPropagation(); notify('Rename', 'success'); setActiveActionFileId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-xs flex items-center gap-2 text-gray-700"><Edit2 size={12}/> Rename</button>
                                          <div className="h-px bg-gray-100 my-1"></div>
                                          <button onClick={(e) => { e.stopPropagation(); handleDeleteSingle(file.id); setActiveActionFileId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-xs flex items-center gap-2 text-red-600"><Trash2 size={12}/> Delete</button>
                                       </div>
                                    )}
                                 </div>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
              </table>
           </div>
         )}
      </div>

      </div>
      </div>

      <FileDetailModal 
         file={detailFile} 
         isOpen={!!detailFile} 
         onClose={() => setDetailFile(null)} 
         campaigns={campaigns}
         onDelete={handleDeleteSingle}
      />
      
      <NewFolderDialog 
         isOpen={newFolderDialogOpen}
         onClose={() => setNewFolderDialogOpen(false)}
         onCreate={handleCreateNewFolder}
      />
    </div>
  );
};

export default AssetLibrary;
