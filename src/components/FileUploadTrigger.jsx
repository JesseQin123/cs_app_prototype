import React, { useState } from 'react';
import GlobalFilePicker from './GlobalFilePicker';
import { Upload, X } from 'lucide-react';

/**
 * FileUploadTrigger
 * 
 * A reusable "Dropzone" or Button that triggers the GlobalFilePicker.
 * 
 * Props:
 * - onFileSelect: (fileAsset) => void
 * - currentFile: { url, name, id } | null (For displaying preview)
 * - label: string
 * - requiredAspectRatios: number[][]
 * - accept: string
 * - maxUploadSizeMB: number (Default 50)
 * - compressTargetMB: number (Default 1) - If set, triggers auto-compression to this size
 */
const FileUploadTrigger = ({ 
  onFileSelect, 
  currentFile, 
  label = "Upload Image", 
  requiredAspectRatios = [],
  accept = "image/*",
  maxUploadSizeMB = 50,
  compressTargetMB = 2
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleSelect = (asset) => {
    onFileSelect(asset);
    setIsPickerOpen(false);
  };

  return (
    <>
      <div className="w-full">
        {currentFile ? (
          // Preview State
          <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video md:aspect-auto md:h-64">
             <img src={currentFile.url} alt="Preview" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
               <button 
                 onClick={() => setIsPickerOpen(true)}
                 className="bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded hover:bg-gray-100"
               >
                 Replace
               </button>
             </div>
          </div>
        ) : (
          // Empty State
          <div 
            onClick={() => setIsPickerOpen(true)}
            className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 hover:border-brand-gold/50 transition-all cursor-pointer h-40 md:h-64 flex flex-col items-center justify-center group"
          >
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload size={20} className="text-gray-400 group-hover:text-brand-gold transition-colors" />
            </div>
            <span className="text-sm font-bold text-gray-600 group-hover:text-brand-gold transition-colors">{label}</span>
            <span className="text-xs text-gray-400 mt-1">Supports JPG, PNG (Max {maxUploadSizeMB}MB)</span>
          </div>
        )}
      </div>

      <GlobalFilePicker 
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onFileSelect={handleSelect}
        requiredAspectRatios={requiredAspectRatios}
        accept={accept}
        maxUploadSizeMB={maxUploadSizeMB}
        compressTargetMB={compressTargetMB}
      />
    </>
  );
};

export default FileUploadTrigger;
