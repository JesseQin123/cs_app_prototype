import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Loader2 } from 'lucide-react';
import { Cropper, RectangleStencil } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';

/**
 * ImageProcessModal
 * 
 * Uses 'react-advanced-cropper' with explicit RectangleStencil.
 * Features:
 * 1. Key-based remounting for reliable ratio switching.
 * 2. Proper z-index layering and layout to prevent clipping.
 * 3. Smart Logic: Skips processing if crop is full image; Delays UI for fast operations.
 * 4. Dynamic Compression: Iteratively reduces quality to meet maxFileSizeMB.
 * 5. Flexible Input: Supports both File objects and Library Assets (= {url, name}).
 */

const predefinedRatios = [
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4/3 },
  { label: '3:4', value: 3/4 },
  { label: '16:9', value: 16/9 },
  { label: '9:16', value: 9/16 },
];

const ImageProcessModal = ({ 
    isOpen, 
    file, 
    onClose, 
    onComplete, 
    requiredAspectRatios = [],
    maxFileSizeMB = 5 
}) => {
  
  const [selectedRatio, setSelectedRatio] = useState(() => {
      if (requiredAspectRatios && requiredAspectRatios.length > 0) {
          const [w, h] = requiredAspectRatios[0];
          return w / h;
      }
      return 1; // Default to 1:1 or free
  }); 
  // const [imageSrc, setImageSrc] = useState(null); // Replaced by useMemo
  const cropperRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRatioSwitching, setIsRatioSwitching] = useState(false); // New State
  const loadingTimerRef = useRef(null);
  
  const [cropperKey, setCropperKey] = useState(0);
  // const blobUrlRef = useRef(null); // Replaced by useMemo usage
  const [fileDetails, setFileDetails] = useState({ name: '', size: '', dim: '' }); 

  const [imageSrc, setImageSrc] = useState(null);

  // Manage Object URL Lifecycle strictly via useEffect to handle StrictMode double-invoke
  useEffect(() => {
    if (!file) {
        setImageSrc(null);
        return;
    }

    let url = null;
    if (file instanceof File || file instanceof Blob) {
        url = URL.createObjectURL(file);
        setImageSrc(url);
    } else if (file.url) {
        url = file.url;
        setImageSrc(url);
    }

    return () => {
        if (url && (file instanceof File || file instanceof Blob)) {
            URL.revokeObjectURL(url);
        }
    };
  }, [file]);
  
  // (Old useMemo removed)

  // Load Metadata independently
  useEffect(() => {
      if (!imageSrc) return;
      
      let isMounted = true;
      const img = new Image();
      
      img.onload = () => {
          if (!isMounted) return;
          
          let sizeDisplay = '';
          if (file.size && typeof file.size === 'number') {
              sizeDisplay = (file.size / 1024 / 1024).toFixed(2) + ' MB';
          } else if (file.size && typeof file.size === 'string') {
               sizeDisplay = file.size; 
          }
          
          setFileDetails({
              name: file.name || 'External Asset',
              size: sizeDisplay,
              dim: `${img.width} x ${img.height} px`
          });
      };
      
      img.src = imageSrc;
      
      return () => {
          isMounted = false;
          img.onload = null;
          img.src = ''; 
          if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      };
  }, [imageSrc, file]);

  // Reset Cropper Key on File Change
  useEffect(() => {
      if (file) {
        if (requiredAspectRatios.length > 0) {
            const [w, h] = requiredAspectRatios[0];
            setSelectedRatio(w / h);
        } else {
            setSelectedRatio(1); 
        }
        setCropperKey(prev => prev + 1);
      }
  }, [file, requiredAspectRatios]); 

  useEffect(() => {
    if (requiredAspectRatios.length > 0 && !selectedRatio) {
      const [w, h] = requiredAspectRatios[0];
      setSelectedRatio(w / h);
    }
  }, [requiredAspectRatios, selectedRatio]);

  /**
   * Helper to generate blob with specific quality
   */
  const getBlob = (canvas, quality) => {
      return new Promise((resolve) => {
          canvas.toBlob((blob) => {
              resolve(blob);
          }, 'image/jpeg', quality);
      });
  };

  const handleProcessAndSave = async () => {
    if (!cropperRef.current) return;

    const state = cropperRef.current.getState();

    // 1. Smart Check: Is the crop essentially the whole image?
    if (state && state.coordinates && state.imageSize) {
        const { width: cW, height: cH, left: cL, top: cT } = state.coordinates;
        const { width: iW, height: iH } = state.imageSize;
        
        const isFullWidth = Math.abs(cW - iW) < iW * 0.01;
        const isFullHeight = Math.abs(cH - iH) < iH * 0.01;
        const isAtOrigin = Math.abs(cL) < iW * 0.01 && Math.abs(cT) < iH * 0.01;

        if (isFullWidth && isFullHeight && isAtOrigin) {
            console.log("Smart Skip: Full image detected.");
            
            // Logic: 
            // If input is a File object, check size.
            // If input is Library Asset, we don't know size easily without fetching, 
            // OR we assume library assets are already optimized? 
            // User requirement: "Automatic compression". 
            // If library asset is huge, we should probably compress it.
            // But if it's a URL, we can't check 'file.size' directly unless we fetch HEAD.
            
            // For Safety in Prototype:
            // If it is a File object, respect 'Smart Skip' unless it violates max size.
            // If it is a Library Asset (URL), we assume it might need processing if we are strict.
            // However, downloading, re-encoding and uploading a library asset just to "make sure" 
            // might be wasteful if user didn't crop.
            // Let's stick to: If user didn't crop, trust the source (or return it as is).
            
            if (file instanceof File) {
                if (file.size <= maxFileSizeMB * 1024 * 1024) {
                    onComplete(file);
                    return;
                }
            } else {
                // For library assets, if no crop, just return original asset descriptor
                onComplete(file);
                return;
            }
        }
    }
    
    // 2. Start Processing
    loadingTimerRef.current = setTimeout(() => {
        setIsProcessing(true);
    }, 200);
    
    const canvas = cropperRef.current.getCanvas();
    if (!canvas) {
        if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
        onComplete(file);
        return;
    }

    try {
        const maxBytes = maxFileSizeMB * 1024 * 1024;
        let quality = 0.95;
        let blob = await getBlob(canvas, quality);
        
        // Iterative compression loop
        let attempts = 0;
        while (blob && blob.size > maxBytes && quality > 0.5 && attempts < 5) {
             quality -= 0.1;
             console.log(`File too large (${(blob.size/1024/1024).toFixed(2)}MB). Retrying with quality: ${quality.toFixed(1)}`);
             blob = await getBlob(canvas, quality);
             attempts++;
        }

        if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
        setIsProcessing(false);

        if (blob) {
             const fileName = file.name || "processed-image.jpg";
             const newFile = new File([blob], fileName, { type: "image/jpeg" });
             onComplete(newFile);
        } else {
             onComplete(file);
        }
    } catch (err) {
        console.error("Compression error:", err);
        if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
        setIsProcessing(false);
        onComplete(file);
    }
  };

  const handleRatioSelect = (val) => {
      // Prevent double triggers
      if (isRatioSwitching || Math.abs(selectedRatio - val) < 0.001) return;

      setIsRatioSwitching(true);
      
      // Deliberate delay for transition effect
      setTimeout(() => {
          setSelectedRatio(val);
          setCropperKey(prev => prev + 1);
          setIsRatioSwitching(false);
      }, 400);
  };

  if (!isOpen) return null;

  const getRatioLabel = (val) => {
      const found = predefinedRatios.find(r => Math.abs(r.value - val) < 0.01);
      if (found) return found.label;
      return `${Math.round(val * 100) / 100}`;
  };

  const showSidebar = requiredAspectRatios.length > 1;

  return createPortal(
    <div className="fixed inset-0 z-[20000] flex bg-black w-screen h-screen">
            {/* Sidebar (Full Height, Left) */}
            {showSidebar && (
                <div className="w-24 flex-shrink-0 bg-[#080808] border-r border-white/5 flex flex-col items-center py-8 gap-6 z-30 relative">
                    <h4 className="text-[10px] items-start w-full px-4 font-bold text-gray-500 uppercase tracking-widest mb-1 text-center">Ratio</h4>
                    <div className="flex flex-col gap-4 w-full px-2 overflow-y-auto custom-scrollbar">
                    {requiredAspectRatios.map(([w, h], idx) => {
                        const val = w / h;
                        const isActive = selectedRatio && Math.abs(selectedRatio - val) < 0.001;
                        const label = getRatioLabel(val);

                        return (
                            <button
                                key={idx}
                                onClick={() => handleRatioSelect(val)}
                                className="group flex flex-col items-center gap-2 w-full"
                                title={`${w}:${h}`}
                            >
                                <div 
                                    className={`
                                        flex items-center justify-center transition-all duration-300 rounded overflow-hidden relative
                                        ${isActive 
                                            ? 'bg-white/10' 
                                            : 'hover:bg-white/5'}
                                    `}
                                    style={{ width: '48px', height: '48px' }}
                                >
                                    <div 
                                        className={`transition-all duration-300 border-[1.5px] rounded-[1px]
                                            ${isActive ? 'border-brand-gold shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'border-gray-500 group-hover:border-gray-300'}
                                        `}
                                        style={{ 
                                            width: val >= 1 ? '20px' : `${20 * val}px`,
                                            height: val >= 1 ? `${20 / val}px` : '20px',
                                        }}
                                    />
                                </div>
                                <span className={`text-[9px] font-medium tracking-wide uppercase ${isActive ? 'text-brand-gold' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                    {label}
                                </span>
                            </button>
                        )
                    })}
                    </div>
                </div>
            )}

            {/* Main Content (Full Screen) */}
            <div className="flex-1 flex flex-col min-w-0 relative bg-black">
                
                {/* Header */}
                <div className="h-20 px-8 flex items-center justify-between bg-black border-b border-white/5 flex-shrink-0 z-30 relative">
                    <div>
                        <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-1">Image Editor</h3>
                        {imageSrc && (
                            <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
                                <span>{fileDetails.name}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                <span>{fileDetails.dim}</span>
                                {fileDetails.size && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                        <span>{fileDetails.size}</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 -mr-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Cropper Container */}
                <div 
                    className="flex-1 flex items-center justify-center bg-black min-h-0 relative z-10"
                    style={{ padding: '40px' }}
                >
                    {isRatioSwitching ? (
                        <div className="flex flex-col items-center justify-center animate-in fade-in duration-200">
                             <Loader2 className="w-8 h-8 text-brand-gold animate-spin mb-3" />
                             <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">Adjusting Ratio...</span>
                        </div>
                    ) : (
                         imageSrc && (
                             <Cropper
                                key={cropperKey}
                                ref={cropperRef}
                                src={imageSrc}
                                stencilComponent={RectangleStencil}
                                stencilProps={{
                                    aspectRatio: selectedRatio,
                                    grid: true,
                                }}
                                className="cropper-container cropper-overflow-visible animate-in fade-in duration-300"
                                defaultSize={({ imageSize }) => {
                                    let width, height;
                                    const imageRatio = imageSize.width / imageSize.height;
                                    
                                    if (imageRatio > selectedRatio) {
                                        // Image is wider than target ratio -> Fit Height (100%)
                                        height = imageSize.height;
                                        width = height * selectedRatio;
                                    } else {
                                        // Image is taller or equal -> Fit Width (100%)
                                        width = imageSize.width;
                                        height = width / selectedRatio;
                                    }
                                    
                                    return {
                                        width,
                                        height,
                                        left: (imageSize.width - width) / 2,
                                        top: (imageSize.height - height) / 2
                                    };
                                }}
                                style={{ 
                                    maxHeight: '100%', 
                                    maxWidth: '100%',
                                    overflow: 'visible' 
                                }}
                                crossOrigin="anonymous" 
                             />
                        )
                    )}
                </div>

                {/* Footer */}
                <div className="h-20 px-8 bg-black border-t border-white/5 flex items-center justify-end gap-6 flex-shrink-0 z-30 relative">
                    <button 
                        onClick={onClose} 
                        className="px-6 py-3 rounded text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-wider"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleProcessAndSave} 
                        className="px-8 py-3 rounded bg-white text-black hover:bg-gra-200 text-xs font-bold transition-all shadow-lg flex items-center gap-2 uppercase tracking-wider hover:opacity-90"
                    >
                        <Check size={14} strokeWidth={4} />
                        Save changes
                    </button>
                </div>

                {/* Processing Overlay */}
                {isProcessing && (
                    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                            <h3 className="text-sm font-bold text-white tracking-widest uppercase">Processing High-Res</h3>
                        </div>
                    </div>
                )}
            </div>
    </div>,
    document.body
  );
};

export default ImageProcessModal;
