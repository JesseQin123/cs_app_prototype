
import React, { useState } from 'react';
import GlobalFilePicker from './GlobalFilePicker';
import { Upload, X, RefreshCw, Image as ImageIcon } from 'lucide-react';

/**
 * FileUploadTrigger
 * 
 * A reusable, luxury-styled file uploader.
 * 
 * Props:
 * - onFileSelect: (fileAsset) => void
 * - currentFile: { url, name, id } | null (For displaying preview)
 * - label: string (Button/Header text)
 * - mode: 'card' | 'button' (Default: 'card')
 * - helperText: { 
 *      ratio: string, 
 *      size: string, 
 *      format: string,
 *      note: string 
 *   }
 * - requiredAspectRatios: number[][]
 * - accept: string
 * - maxUploadSizeMB: number
 * - compressTargetMB: number
 */
const FileUploadTrigger = ({ 
  onFileSelect, 
  currentFile, 
  label = "Upload Image", 
  mode = 'card',
  helperText = {},
  requiredAspectRatios = [],
  accept = "image/*",
  maxUploadSizeMB = 30,
  compressTargetMB = 2,
  allowedSources = ['local', 'library']
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [localInitialFile, setLocalInitialFile] = useState(null);
  const hiddenInputRef = React.useRef(null);

  // Default Helper Text Merger
  const texts = {
      ratio: helperText.ratio || "Recommended Ratio: 1:1",
      size: helperText.size || ("Max File Size: " + maxUploadSizeMB + "MB"), 
      format: helperText.format || "Supports JPG, PNG, WebP",
      note: helperText.note || "Cropping and compression available after upload",
      ...helperText
  };

  const handleSelect = (asset) => {
    onFileSelect(asset);
    setIsPickerOpen(false);
    setLocalInitialFile(null); // Reset
  };

  const handleClick = () => {
      // If only 'local' is allowed, bypass UI and open native picker
      if (allowedSources.length === 1 && allowedSources.includes('local')) {
          hiddenInputRef.current.click();
      } else {
          setIsPickerOpen(true);
      }
  };

  const handleNativeFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          setLocalInitialFile(file);
          setIsPickerOpen(true); // Open picker but logic inside will detect file and auto-process
      }
  };

  // -- RENDERERS --

  const renderCardMode = () => {
    if (currentFile) {
        return (
            <div className="relative group rounded bg-gray-50 border border-gray-200 overflow-hidden">
                <div className="aspect-video w-full relative">
                    <img src={currentFile.url} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[1px]">
                        <button 
                            onClick={handleClick}
                            className="bg-white text-black text-xs font-bold px-5 py-2.5 rounded hover:bg-brand-gold hover:text-white transition-colors uppercase tracking-wider flex items-center gap-2"
                        >
                            <RefreshCw size={12} /> Replace
                        </button>
                    </div>
                </div>

            </div>
        );
    }

    return (
        <div 
            onClick={handleClick}
            className="border border-dashed border-gray-300 rounded bg-gray-50/30 hover:bg-gray-50 hover:border-brand-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all cursor-pointer h-48 flex flex-col items-center justify-center group gap-3"
        >
            <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform group-hover:border-brand-gold/30">
                <Upload size={18} className="text-gray-400 group-hover:text-brand-gold transition-colors" />
            </div>
            <div className="text-center">
                <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide group-hover:text-brand-gold mb-1">{label}</span>
                <span className="block text-[10px] text-gray-400">{texts.format}</span>
            </div>
        </div>
    );
  };

  const renderButtonMode = () => {
    return (
        <div className="flex items-start gap-6 p-4 border border-gray-100 rounded-lg bg-gray-50/50">
            {/* Left: Info & Action */}
            <div className="flex-1 min-w-0 flex flex-col items-start gap-4">
                 
                 {/* Text Block */}
                 <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-2">
                           <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">{label}</span>
                      </div>
                      
                      {/* Meta Info */}
                      <div className="flex flex-col gap-0.5 text-[11px] text-gray-500 leading-relaxed font-medium">
                          <p>• {texts.ratio}</p>
                          <p>• {texts.size}</p>
                          <p>• {texts.format}</p>
                          <p className="text-gray-400 pt-1 italic">{texts.note}</p>
                      </div>
                 </div>

                 {/* Action Button */}
                 <button
                    type="button"
                    onClick={handleClick}
                    className={`
                        px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2
                        ${currentFile 
                            ? 'bg-white border border-gray-200 text-gray-700 hover:border-brand-gold hover:text-brand-gold shadow-sm' 
                            : 'bg-black text-white hover:bg-gray-800 shadow-md'}
                    `}
                 >
                    {currentFile ? (
                        <>
                           <RefreshCw size={14} /> <span>Replace Image</span>
                        </>
                    ) : (
                        <>
                           <Upload size={14} /> <span>{label}</span>
                        </>
                    )}
                 </button>
            </div>

            {/* Right: Preview Area */}
            {/* Fixed Aspect Ratio Container depending on req ratio, else 16:9 default */}
            <div className={`
                flex-shrink-0 relative overflow-hidden rounded bg-gray-200 border border-gray-300 shadow-inner
                ${currentFile ? 'bg-white' : ''}
            `}
                style={{ 
                    width: '180px',
                    aspectRatio: requiredAspectRatios[0] ? `${requiredAspectRatios[0][0]}/${requiredAspectRatios[0][1]}` : '16/9'
                }}
            >
                {currentFile ? (
                    <img src={currentFile.url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                        <ImageIcon size={24} className="opacity-50" />
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-50">Preview</span>
                    </div>
                )}
            </div>
        </div>
    );
  };

  return (
    <>
      <div className="w-full">
        {mode === 'button' ? renderButtonMode() : renderCardMode()}
      </div>

      <GlobalFilePicker 
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onFileSelect={handleSelect}
        requiredAspectRatios={requiredAspectRatios}
        accept={accept}
        maxUploadSizeMB={maxUploadSizeMB}
        compressTargetMB={compressTargetMB}
        allowedSources={allowedSources}
        initialFile={localInitialFile}
      />
      
      {/* Hidden Input for Local-Only Mode */}
      <input 
          type="file" 
          ref={hiddenInputRef} 
          className="hidden" 
          accept={accept} 
          onChange={handleNativeFileChange}
      />
    </>
  );
};

export default FileUploadTrigger;
