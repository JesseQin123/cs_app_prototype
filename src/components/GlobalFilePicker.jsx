import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, File, AlertCircle, Check, Search, ChevronDown } from 'lucide-react';
import { fileStore } from '@/data/mockStore/fileStore';
import { uploadStore } from '@/data/mockStore/uploadStore';
import ImageProcessModal from './ImageProcessModal'; 
import Drawer from './Drawer'; 

const GlobalFilePicker = ({ 
  isOpen, 
  onClose, 
  onFileSelect, 
  accept = "image/*", 
  maxUploadSizeMB = 50, 
  compressTargetMB = 5, 
  requiredAspectRatios = [], 
}) => {
  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'upload'
  const [selectedLibraryFile, setSelectedLibraryFile] = useState(null);
  const [processingFile, setProcessingFile] = useState(null);
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // -- Handlers --

  const handleDeviceUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > maxUploadSizeMB * 1024 * 1024) {
      setError(`File too large. Max upload size is ${maxUploadSizeMB}MB.`);
      return;
    }
    setError(null);

    if (file.type.startsWith('image/') && (requiredAspectRatios.length > 0 || compressTargetMB)) {
      setProcessingFile(file);
    } else {
      const tempAsset = uploadStore.addTempFile(file);
      onFileSelect(tempAsset);
      onClose();
    }
  };

  const handleLibrarySelect = () => {
    if (selectedLibraryFile) {
        // Trigger processor based on same logic: if Image + Constraints
        const isImage = selectedLibraryFile.type.startsWith('image') || ['jpg','png','jpeg','webp'].includes(selectedLibraryFile.type);
        const needsProcessing = isImage && (requiredAspectRatios.length > 0 || compressTargetMB);

      if (needsProcessing) {
        setProcessingFile(selectedLibraryFile);
      } else {
        onFileSelect(selectedLibraryFile);
        onClose();
      }
    }
  };

  // Fixed: Restored missing handler
  const handleProcessComplete = (processedBlob) => {
    // If it's a blob/file, wrap it. If it's original library file (passed back), use it.
    // UploadStore handles both File objects and logic.
    const name = processingFile.name || "processed.jpg";
    const tempAsset = uploadStore.addTempFile(processedBlob, { name: name, isDerived: true });
    onFileSelect(tempAsset);
    setProcessingFile(null);
    onClose();
  };

  // -- Render Content --

  const renderTabs = () => (
      <div className="flex items-center gap-8 border-b border-gray-200 px-8 mb-6">
          {['library', 'upload'].map(tab => {
              const isActive = activeTab === tab;
              const labels = { library: 'Image library', upload: 'Upload image' };
              return (
                  <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                          py-4 text-sm font-medium transition-all relative
                          ${isActive ? 'text-black' : 'text-gray-500 hover:text-gray-800'}
                      `}
                  >
                      {labels[tab]}
                      {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full animate-in zoom-in-x duration-200"></div>}
                  </button>
              )
          })}
      </div>
  );

  const renderLibraryContent = () => {
    const filteredFiles = fileStore.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
            <div className="flex-1 overflow-y-auto px-8 pb-20">
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {filteredFiles.map(f => {
                        const isSelected = selectedLibraryFile?.id === f.id;
                        return (
                            <div 
                                key={f.id}
                                onClick={() => setSelectedLibraryFile(f)}
                                className={`
                                    relative group cursor-pointer aspect-square rounded-xl overflow-hidden transition-all duration-300 border
                                    ${isSelected ? 'ring-2 ring-black border-transparent shadow-lg scale-[0.98]' : 'border-gray-100 hover:shadow-md hover:scale-[1.01] hover:border-gray-200'}
                                `}
                            >
                                {/* Image / Icon */}
                                {f.type.startsWith('image') || ['jpg','png','jpeg','webp'].includes(f.type) ? (
                                    <img src={f.url} alt={f.name} className="w-full h-full object-cover bg-gray-50" />
                                ) : (
                                    <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                                        <File size={24} strokeWidth={1} />
                                        <span className="text-[10px] mt-2 font-medium uppercase tracking-wider">{f.type}</span>
                                    </div>
                                )}

                                {/* Overlay Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    <div className="absolute bottom-3 left-3 right-3 text-white">
                                        <p className="text-[10px] font-medium truncate">{f.name}</p>
                                        <p className="text-[9px] opacity-70">{f.size}</p>
                                    </div>
                                </div>

                                {/* Selection Indicator */}
                                {isSelected && (
                                    <div className="absolute top-2 right-2 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center shadow-sm animate-in zoom-in">
                                        <Check size={10} strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
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

  // If processing, show ImageProcessor
  if (processingFile) {
     return (
       <ImageProcessModal 
         isOpen={true}
         file={processingFile}
         onClose={() => setProcessingFile(null)}
         onComplete={handleProcessComplete}
         requiredAspectRatios={requiredAspectRatios}
         maxFileSizeMB={compressTargetMB} 
       />
     );
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Select image"
      placement="bottom"
      // User Req: "Distance from top ~80px" -> Height = Screen - 40px (per user edit)
      height="h-[calc(100vh-40px)]" 
    >
      <div className="flex flex-col h-full bg-white">
          {renderTabs()}
          
          <div className="flex-1 overflow-hidden relative bg-white">
              {activeTab === 'library' && renderLibraryContent()}
              {activeTab === 'upload' && renderUploadContent()}
          </div>
      
          {/* Footer for confirm (only if selection exists in Library mode) */}
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
  );
};

export default GlobalFilePicker;
