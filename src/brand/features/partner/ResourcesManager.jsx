import React, { useState } from 'react';
import { 
  Plus, FolderOpen, Search, Filter, MoreHorizontal, 
  ArrowLeft, FileText, Download, Trash2, Eye, EyeOff, 
  Settings, Grip, List as ListIcon, Grid as GridIcon,
  CheckCircle2, AlertCircle, RefreshCw, Layers
} from 'lucide-react';
import { resourceData } from '../../../data/mockStore/resourceStore';
import { useToast } from '../../context/ToastContext';
import AudienceSelector from '../../components/audience/AudienceSelector';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// --- Components ---

const CreateFolderModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [audience, setAudience] = useState({ type: 'all', segments: [], retailers: [] });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple Validation
    const newErrors = {};
    if (audience.type === 'segment' && audience.segments.length === 0) newErrors.audience = 'Select at least one segment';
    if (audience.type === 'specific' && audience.retailers.length === 0) newErrors.audience = 'Select at least one retailer';
    
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    // Format for legacy/display compatibility
    let audienceLabel = 'All Retailers';
    if (audience.type === 'segment') audienceLabel = 'Targeted Segment';
    if (audience.type === 'specific') audienceLabel = `${audience.retailers.length} Specific Retailers`;

    onCreate({ name, audience: audienceLabel }); // Keeping simple signature for now
    setName(''); 
    setAudience({ type: 'all', segments: [], retailers: [] });
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200" 
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold mb-1">New Resource Folder</h2>
        <p className="text-sm text-gray-500 mb-6">Create a destination for guidelines and assets.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Folder Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Visual Merchandising 2025"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-black/5 focus:border-black transition"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Audience</label>
            <AudienceSelector 
                value={audience}
                onChange={(val) => {
                    setAudience(val);
                    if (errors.audience) setErrors({...errors, audience: null});
                }}
            />
            {errors.audience && <p className="text-xs text-red-500 mt-1">{errors.audience}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition">Cancel</button>
            <button type="submit" className="px-5 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition shadow-xs">Create Folder</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Component ---

const ResourcesManager = () => {
  const { addToast } = useToast();
  const [folders, setFolders] = useState(resourceData.folders);
  const [files, setFiles] = useState(resourceData.files);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const currentFolder = folders.find(f => f.id === currentFolderId);
  const currentFiles = currentFolderId ? (files[currentFolderId] || []) : [];

  const handleCreateFolder = (data) => {
    const newFolder = {
      id: `res-${Date.now()}`,
      title: data.name,
      coverImage: null, // Would be default cover in real app
      coverColor: 'bg-gray-100',
      status: 'Visible',
      audience: data.audience,
      updatedAt: 'Just now',
      fileCount: 0,
      isNew: true
    };
    setFolders([newFolder, ...folders]);
    setFiles(prev => ({ ...prev, [newFolder.id]: [] }));
    setIsCreateModalOpen(false);
    addToast(`Folder "${newFolder.title}" created`, 'success');
    setCurrentFolderId(newFolder.id); // Jump to detail
  };

  const handleToggleVisibility = (folder) => {
    const newStatus = folder.status === 'Visible' ? 'Hidden' : 'Visible';
    setFolders(folders.map(f => f.id === folder.id ? { ...f, status: newStatus } : f));
    addToast(`Folder is now ${newStatus}`, 'success');
  };

  const handleAddFilesMock = () => {
    if (window.confirm("Simulating import from Brand Library.\n\nNOTE: Resources uses a flat structure for simplicity. All files inside sub-folders will be imported directly into this list. Continue?")) {
        // Add a mock file
        const newFile = {
            id: `f-${Date.now()}`,
            name: `Imported_Asset_${currentFiles.length + 1}.jpg`,
            type: 'image',
            size: '2.4 MB',
            addedAt: 'Just now'
        };
        setFiles(prev => ({
            ...prev,
            [currentFolderId]: [newFile, ...prev[currentFolderId]]
        }));
        
        // Update folder count
        setFolders(folders.map(f => f.id === currentFolderId ? { ...f, fileCount: f.fileCount + 1, updatedAt: 'Just now' } : f));
        addToast('Files imported successfully', 'success');
    }
  };

  // --- Views ---

  const renderFolderList = () => {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="relative w-full md:w-96 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition" size={18} />
                <input 
                    type="text" 
                    placeholder="Search folders..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-black/5 focus:border-black transition"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto self-end">
                 <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    <Filter size={16}/> Filter
                 </button>
            </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {folders.filter(f => f.title.toLowerCase().includes(searchQuery.toLowerCase())).map(folder => (
                <div 
                    key={folder.id}
                    onClick={() => setCurrentFolderId(folder.id)}
                    className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-gray-300 transition-all duration-300 group cursor-pointer flex flex-col h-[280px]"
                >
                    {/* Visual Area (Top) */}
                    <div className={cn("h-[65%] relative overflow-hidden", folder.coverColor)}>
                        {folder.coverImage ? (
                            <img src={folder.coverImage} alt={folder.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-10">
                                <FolderOpen size={64}/>
                            </div>
                        )}
                        
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                            {folder.status === 'Visible' ? (
                                <span className="bg-emerald-500/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-xs">Visible</span>
                            ) : (
                                <span className="bg-gray-500/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-xs">Hidden</span>
                            )}
                        </div>

                         {/* Overlay Action */}
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                            <button className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition duration-300 bg-white text-black px-4 py-2 rounded-full font-medium text-sm shadow-lg">
                                Manage Folder
                            </button>
                         </div>
                    </div>

                    {/* Info Area (Bottom) */}
                    <div className="p-5 flex-1 flex flex-col justify-between bg-white relative">
                        <div>
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-gray-900 group-hover:text-brand-gold transition-colors line-clamp-1" title={folder.title}>{folder.title}</h3>
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                                {folder.fileCount} Files • Updated {folder.updatedAt}
                            </div>
                        </div>

                        {folder.audience !== 'All Retailers' && (
                             <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-700 rounded-sm text-[10px] font-bold uppercase tracking-wide w-fit">
                                <Layers size={10} /> {folder.audience}
                             </div>
                        )}
                    </div>
                </div>
            ))}
            
        </div>
      </div>
    );
  };

  const renderFolderDetail = () => {
    if (!currentFolder) return null;

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Header */}
            <div className="flex flex-col gap-6 mb-8 pb-6 border-b border-gray-100">
                <button 
                  onClick={() => setCurrentFolderId(null)} 
                  className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-black transition w-fit mb-2"
                >
                    <ArrowLeft size={16}/> Back to Resources
                </button>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                           <h1 className="text-3xl font-bold text-gray-900">{currentFolder.title}</h1>
                           {currentFolder.status === 'Visible' ? (
                                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Visible</span>
                            ) : (
                                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Hidden</span>
                            )}
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                             <div className="flex items-center gap-2">
                                <Layers size={14} /> Shared with: <span className="font-medium text-gray-900">{currentFolder.audience}</span>
                             </div>
                             <div>
                                Updated {currentFolder.updatedAt}
                             </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            onClick={() => handleToggleVisibility(currentFolder)}
                        >
                            {currentFolder.status === 'Visible' ? <EyeOff size={16}/> : <Eye size={16}/>}
                            {currentFolder.status === 'Visible' ? 'Hide' : 'Publish'}
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition">
                            <Settings size={16}/> Settings
                        </button>
                        <button 
                            onClick={handleAddFilesMock}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition shadow-xs"
                        >
                            <Plus size={16} /> Add Files
                        </button>
                    </div>
                </div>
            </div>

            {/* File List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs flex-1 flex flex-col">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div>Name</div>
                    <div>Type</div>
                    <div>Size</div>
                    <div>Date Added</div>
                    <div></div>
                </div>
                
                <div className="overflow-auto flex-1">
                    {currentFiles.length === 0 ? (
                         <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <FileText size={32} className="opacity-20"/>
                            </div>
                            <p className="font-medium mb-1">This folder is empty</p>
                            <p className="text-sm">Add files from your library to get started.</p>
                         </div>
                    ) : (
                        currentFiles.map(file => (
                            <div key={file.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 px-6 py-4 border-b border-gray-100 items-center hover:bg-gray-50 transition group">
                                <div className="flex items-center gap-3">
                                    <Grip size={14} className="text-gray-300 cursor-move opacity-0 group-hover:opacity-100 transition" />
                                    <div className="p-2 bg-gray-100 rounded-sm text-gray-500">
                                        <FileText size={18} />
                                    </div>
                                    <span className="font-medium text-gray-900">{file.name}</span>
                                </div>
                                <div className="text-sm text-gray-500 uppercase">{file.type}</div>
                                <div className="text-sm text-gray-500">{file.size}</div>
                                <div className="text-sm text-gray-500">{file.addedAt}</div>
                                <div className="flex justify-end relative">
                                    <button className="text-gray-400 hover:text-black transition">
                                        <MoreHorizontal size={18}/>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                 {/* Footer Info */}
                 <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-400 flex justify-between">
                     <span>{currentFiles.length} items</span>
                     <span className="flex items-center gap-1"><CheckCircle2 size={12}/> All changes saved</span>
                 </div>
            </div>
        </div>
    );
  };

  return (
    <div className="h-full flex flex-col px-8 py-6 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      {!currentFolderId && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Partner Resources</h1>
              <p className="text-gray-500 text-sm max-w-2xl">Manage evergreen guidelines, manuals, and standard assets.</p>
            </div>
            <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition shadow-xs"
            >
                <Plus size={18} /> New Folder
            </button>
          </div>
      )}

      <div className="flex-1">
        {currentFolderId ? renderFolderDetail() : renderFolderList()}
      </div>

      <CreateFolderModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateFolder}
      />
    </div>
  );
};

export default ResourcesManager;
