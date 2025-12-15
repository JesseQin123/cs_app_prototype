import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, File as FileIcon, AlertCircle, Check, Search, Eye } from 'lucide-react';
import { fileStore } from '@/data/mockStore/fileStore';
import { uploadStore } from '@/data/mockStore/uploadStore';
import ImageProcessModal from './ImageProcessModal'; 
import Drawer from './Drawer'; 
import UniversalPreview from '@/components/common/UniversalPreview';

const getImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        
        img.onload = () => {
            const dimensions = { width: img.width, height: img.height };
            URL.revokeObjectURL(url);
            resolve(dimensions);
        };
        
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Could not load image"));
        };
        
        img.src = url;
    });
};

const GlobalFilePicker = ({ 
  isOpen, 
  onClose, 
  onFileSelect, 
  accept = "image/*", 
  maxUploadSizeMB = 50, 
  compressTargetMB = 5, 
  requiredAspectRatios = [], 
  allowedSources = ['local', 'library'], // ['local', 'library']
  initialFile = null, 
}) => {
  // If 'library' is allowed, default to it. Otherwise default to 'upload' (which corresponds to 'local' source)
  const [activeTab, setActiveTab] = useState(allowedSources.includes('library') ? 'library' : 'upload'); 
  const [selectedLibraryFile, setSelectedLibraryFile] = useState(null);
  const [processingFile, setProcessingFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(24);
  const [isContentReady, setIsContentReady] = useState(false);

  // Helper: Check if file needs processing (Source Agnostic)
  // Logic: 
  // 1. Must be image
  // 2. If ratio/constraint exists, check "Smart Bypass"
  const checkAndProcessFile = React.useCallback(async (file) => {
      // 1. Size Check (Hard limit)
      if (file instanceof File && file.size > maxUploadSizeMB * 1024 * 1024) {
          setError(`File too large. Max upload size is ${maxUploadSizeMB}MB.`);
          return;
      }
      setError(null);

      const isImage = file.type.startsWith('image/') || 
                      (file.name && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) ||
                      (file.url && /\.(jpg|jpeg|png|webp)$/i.test(file.url));

      // If not image, skip constraints
      if (!isImage) {
           const tempAsset = uploadStore.addTempFile(file);
           onFileSelect(tempAsset);
           onClose();
           return;
      }

      // If no constraints, skip processing
      if (requiredAspectRatios.length === 0 && !compressTargetMB) {
           const tempAsset = uploadStore.addTempFile(file);
           onFileSelect(tempAsset);
           onClose();
           return;
      }

      // SMART BYPASS: Check if image ALREADY meets criteria
      // Only works if we can load the image (File or URL)
      if (file instanceof File) {
          // Check size first -> if smaller than target limit (e.g. 1MB), good start
          if (compressTargetMB && file.size <= compressTargetMB * 1024 * 1024) {
              // Now check aspect ratio
              if (requiredAspectRatios.length > 0) {
                  try {
                       const dim = await getImageDimensions(file);
                       const ratio = dim.width / dim.height;
                       
                       // Check if any target ratio matches (within 0.01 tolerance)
                       const match = requiredAspectRatios.some(([w, h]) => Math.abs(ratio - (w/h)) < 0.01);
                       
                       if (match) {
                           console.log("Smart Bypass: Image matches size and ratio.");
                           const tempAsset = uploadStore.addTempFile(file);
                           onFileSelect(tempAsset);
                           onClose();
                           return;
                       }
                  } catch (e) {
                      console.warn("Could not load image for smart check", e);
                  }
              } else {
                   // No ratio requirement, and size is good -> Bypass
                   const tempAsset = uploadStore.addTempFile(file);
                   onFileSelect(tempAsset);
                   onClose();
                   return;
              }
          }
      }

      // If we are here, we need to process/check in editor
      setProcessingFile(file);
  }, [maxUploadSizeMB, onFileSelect, onClose, requiredAspectRatios, compressTargetMB]);

  // Effect: Handle Initial File (Direct Upload)
  useEffect(() => {
    if (initialFile) {
        checkAndProcessFile(initialFile);
    }
  }, [initialFile, checkAndProcessFile]);

  // Effect: Delay Content Rendering for smoother Open Animation
  useEffect(() => {
      if (isOpen) {
          const timer = setTimeout(() => {
              setIsContentReady(true);
          }, 350); // Slightly longer than Drawer 300ms transition
          return () => {
              clearTimeout(timer);
              setIsContentReady(false);
          };
      }
  }, [isOpen]);

  // -- Handlers --

  const handleDeviceUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    checkAndProcessFile(file);
  };

  const handleLibrarySelect = () => {
    if (selectedLibraryFile) {
        // Library assets might rely on 'url'. 
        // For Smart Bypass on library assets, we might need to fetch HEAD or just assume 'processing required' if ratio check fails?
        // For simplicity in prototype, let's treat library assets as "Needs Check if Constraints Exist" 
        // passing to processor allows user to see/crop.
        // If user wants smart bypass on Library, we'd need to know dimensions.
        // Let's pass to checkAndProcessFile (it handles non-File objects partially, might skip size check)
        
        // For now, force processor for Library if constraints exist, to be safe.
        // Or adapt logic?
        // Let's reuse checkAndProcessFile but handle the object type
        
       const isImage = selectedLibraryFile.type.startsWith('image') || ['jpg','png','jpeg','webp'].includes(selectedLibraryFile.type);
       
       if (isImage && (requiredAspectRatios.length > 0 || compressTargetMB)) {
           setProcessingFile(selectedLibraryFile);
       } else {
           onFileSelect(selectedLibraryFile);
           onClose();
       }
    }
  };

  const handleProcessComplete = (processedBlob) => {
    const name = processingFile.name || "processed.jpg";
    const tempAsset = uploadStore.addTempFile(processedBlob, { name: name, isDerived: true });
    onFileSelect(tempAsset);
    setProcessingFile(null);
    onClose();
  };

  const handleEditorClose = () => {
      setProcessingFile(null);
      // Logic: If we are in "Local Only" mode, we should close the entire picker, 
      // because there is no 'underlying drawer' to return to.
      // If "Library" mode, we just close the editor and reveal the drawer underneath.
      
      const shouldClosePickerToo = allowedSources.length === 1 && allowedSources.includes('local');
      if (shouldClosePickerToo) {
          onClose();
      }
  };

  // -- Render Content --

  const renderTabs = () => {
      if (allowedSources.length <= 1) return null;

      return (
        <div className="flex items-center gap-8 border-b border-gray-200 px-8 mb-6">
            {allowedSources.includes('library') && (
                <button
                    onClick={() => setActiveTab('library')}
                    className={`
                        py-4 text-sm font-medium transition-all relative
                        ${activeTab === 'library' ? 'text-black' : 'text-gray-500 hover:text-gray-800'}
                    `}
                >
                    Image library
                    {activeTab === 'library' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full animate-in zoom-in-x duration-200"></div>}
                </button>
            )}
            {allowedSources.includes('local') && (
                <button
                    onClick={() => setActiveTab('upload')}
                    className={`
                        py-4 text-sm font-medium transition-all relative
                        ${activeTab === 'upload' ? 'text-black' : 'text-gray-500 hover:text-gray-800'}
                    `}
                >
                    Upload image
                    {activeTab === 'upload' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full animate-in zoom-in-x duration-200"></div>}
                </button>
            )}
        </div>
      );
  };

  const renderLibraryContent = () => {
    // 1. Show Loading State during Drawer Animation
    if (!isContentReady) {
        return (
            <div className="flex flex-col h-full items-center justify-center text-gray-400">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-medium uppercase tracking-wider">Loading Library...</p>
            </div>
        )
    }

    const filteredFiles = fileStore.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Simple accept-based filtering for Prototype
        let matchesType = true;
        if (accept.includes('image')) {
            matchesType = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(f.type) || f.type.startsWith('image');
        } else if (accept.includes('video')) {
            matchesType = ['mp4', 'mov', 'webm'].includes(f.type) || f.type.startsWith('video');
        }
        
        return matchesSearch && matchesType;
    });

    return (
        <div className="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Filter Bar */}
            <div className="flex items-center gap-3 px-8 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by name" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded text-sm focus:ring-1 focus:ring-black focus:border-black placeholder:text-gray-400 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Grid View - Denser (6 cols) */}
            <div 
                className="flex-1 overflow-y-auto px-8 pb-20 scroll-smooth"
                onScroll={(e) => {
                    const { scrollTop, scrollHeight, clientHeight } = e.target;
                    // Load more when user scrolls near bottom (buffer 200px)
                    if (scrollHeight - scrollTop - clientHeight < 200) {
                        if (visibleCount < filteredFiles.length) {
                            setVisibleCount(prev => prev + 24);
                        }
                    }
                }}
            >
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {filteredFiles.slice(0, visibleCount).map(f => {
                        const isSelected = selectedLibraryFile?.id === f.id;
                        return (
                            <div 
                                key={f.id}
                                className={`
                                    relative group cursor-pointer aspect-square rounded-xl overflow-hidden transition-all duration-300 border
                                    ${isSelected ? 'ring-2 ring-[#b5984d] border-transparent shadow-lg scale-[0.98]' : 'border-gray-100 hover:shadow-md hover:scale-[1.01] hover:border-gray-200'}
                                `}
                                onClick={() => setSelectedLibraryFile(f)}
                            >
                                {/* Image / Icon */}
                                {f.type.startsWith('image') || ['jpg','png','jpeg','webp'].includes(f.type) ? (
                                    <img src={f.url} alt={f.name} className="w-full h-full object-cover bg-gray-50" loading="lazy" />
                                ) : (
                                    <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                                        <FileIcon size={24} strokeWidth={1} />
                                        <span className="text-[10px] mt-2 font-medium uppercase tracking-wider">{f.type}</span>
                                    </div>
                                )}

                                {/* Overlay Gradient & Actions */}
                                <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    {/* Top Right: Selection Indicator */}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                         {/* Preview Button (Only on Hover) */}
                                         <button 
                                            onClick={(e) => { e.stopPropagation(); setPreviewFile(f); }}
                                            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-black flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 transform hover:scale-110"
                                            title="Preview"
                                        >
                                            <Eye size={14} />
                                        </button>
                                        
                                        {/* Selection Check */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${isSelected ? 'bg-[#b5984d] text-white scale-100' : 'bg-white/20 hover:bg-white hover:text-black text-transparent scale-90'}`}>
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                    </div>

                                    {/* Bottom: Info */}
                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent pt-8 text-white">
                                        <p className="text-[10px] font-medium truncate">{f.name}</p>
                                        <p className="text-[9px] opacity-70">{f.size}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {visibleCount < filteredFiles.length && (
                    <div className="py-8 flex justify-center text-gray-400">
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </div>
    );
  };

  const renderUploadContent = () => (
      <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div 
              onClick={() => fileInputRef.current.click()}
              className="w-full max-w-2xl border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-white hover:border-black/10 transition-all cursor-pointer flex flex-col items-center justify-center py-20 group"
          >
              <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept={accept}
                  onChange={handleDeviceUpload}
              />
              <div className="w-16 h-16 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Upload size={28} className="text-gray-400 group-hover:text-black transition-colors" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Upload Image</h3>
              <p className="text-sm text-gray-400 mb-6">Click or drag file to this area to upload</p>
              <div className="text-[10px] bg-gray-100 px-3 py-1 rounded-full text-gray-500 font-medium">Max {maxUploadSizeMB}MB</div>
          </div>
          {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle size={16} /> {error}
              </div>
          )}
      </div>
  );

  // New Render Logic:
  // 1. Drawer always mounts if sources allow it (keeps state/animation correct)
  // 2. ImageProcessModal mounts as a sibling (on top), independent of Drawer unmount logic
  
  const showDrawer = allowedSources.includes('library') || allowedSources.length > 1;

  return (
    <>
      {/* Drawer Component */}
      {showDrawer && (
          <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Select image"
            placement="bottom"
            height="h-[calc(100vh-40px)]" 
          >
            <div className="flex flex-col h-full bg-white">
                {renderTabs()}
                
                <div className="flex-1 overflow-hidden relative bg-white">
                    {activeTab === 'library' && renderLibraryContent()}
                    {activeTab === 'upload' && renderUploadContent()}
                </div>
            
                {activeTab === 'library' && (
                   <div className="flex-shrink-0 p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                       <button onClick={onClose} className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-white hover:border-gray-400 transition-all">
                           Cancel
                       </button>
                       <button 
                           disabled={!selectedLibraryFile}
                           onClick={handleLibrarySelect} 
                           className="px-8 py-2.5 rounded-lg bg-black text-white text-sm font-bold shadow-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                       >
                           Select Image
                       </button>
                   </div>
                )}
            </div>
          </Drawer>
      )}

      {/* Editor Overlay - Independent */}
      {processingFile && (
          <ImageProcessModal 
              isOpen={true}
              file={processingFile}
              onClose={handleEditorClose} // Use smart close handler
              onComplete={handleProcessComplete}
              requiredAspectRatios={requiredAspectRatios}
              maxFileSizeMB={compressTargetMB} 
          />
      )}

      {/* Preview Overlay */}
      {previewFile && (
          <UniversalPreview 
              isOpen={!!previewFile}
              initialIndex={fileStore.filter(f => {
                    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
                    let matchesType = true;
                    if (accept.includes('image')) {
                        matchesType = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(f.type) || f.type.startsWith('image');
                    } else if (accept.includes('video')) {
                        matchesType = ['mp4', 'mov', 'webm'].includes(f.type) || f.type.startsWith('video');
                    }
                    return matchesSearch && matchesType;
              }).findIndex(f => f.id === previewFile.id)}
              files={fileStore.filter(f => {
                    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
                    let matchesType = true;
                    if (accept.includes('image')) {
                        matchesType = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(f.type) || f.type.startsWith('image');
                    } else if (accept.includes('video')) {
                        matchesType = ['mp4', 'mov', 'webm'].includes(f.type) || f.type.startsWith('video');
                    }
                    return matchesSearch && matchesType;
              })} 
              onClose={() => setPreviewFile(null)}
          />
      )}
    </>
  );
};

export default GlobalFilePicker;
