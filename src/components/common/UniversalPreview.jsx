import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Download, FileText, Image as ImageIcon, Film, FileCode, Package, AlertCircle, Loader2, RotateCw, ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const SUPPORTED_PREVIEWS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'mp4', 'webm', 'pdf'];

const UniversalPreview = ({ 
  isOpen, 
  onClose, 
  files = [], 
  initialIndex = 0
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dimensions, setDimensions] = useState(null);
  
  // PDF State
  const [numPages, setNumPages] = useState(null);
  const [pdfPageNumber, setPdfPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  const resetState = () => {
      setIsLoading(true);
      setHasError(false);
      setDimensions(null);
      setNumPages(null);
      setPdfPageNumber(1);
      setScale(1.0);
  };

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
        setCurrentIndex(initialIndex);
        resetState();
    }
  }, [isOpen, initialIndex]);

  const currentItem = files[currentIndex];
  // Normalize file object structure. 
  const file = currentItem?.file || currentItem || {};
  const isDeleted = currentItem?.currentVersionStatus === 'source_deleted';
  const fileType = file.type?.toLowerCase() || '';

  // Helpers
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileType);
  const isVideo = ['mp4', 'webm'].includes(fileType);
  const isPDF = ['pdf'].includes(fileType);
  const isPreviewable = SUPPORTED_PREVIEWS.includes(fileType);

  const handleNext = useCallback(() => {
    if (currentIndex < files.length - 1) {
        setCurrentIndex(prev => prev + 1);
        resetState();
    }
  }, [currentIndex, files.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        resetState();
    }
  }, [currentIndex]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const changePdfPage = (offset) => {
    setPdfPageNumber(prev => Math.min(Math.max(1, prev + offset), numPages));
  };

  const toggleZoom = () => {
      setScale(prev => (prev >= 1.5 ? 1.0 : prev + 0.25));
  };

  const handleDownload = () => {
    if (isDeleted) return;
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Keyboard Navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
        // Only nav files if NOT strictly reading a multi-page PDF focused (simple conflict resolution)
        // For this prototype, arrows switch files unless we add specific PDF paging modifiers.
        // Let's keep arrows for File Navigation primarily, as per PRD.
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);
  
  if (!isOpen || !currentItem) return null;

  // -- Render Content Logic --
  const renderContent = () => {
      if (isDeleted) {
           return (
              <div className="flex flex-col items-center justify-center text-white text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                      <AlertCircle size={48} className="text-red-500" />
                  </div>
                  <h3 className="text-2xl font-light mb-2">Preview Unavailable</h3>
                  <p className="text-gray-400 max-w-md">Source file has been deleted by brand.</p>
              </div>
          );
      }

      if (hasError) {
        return (
            <div className="flex flex-col items-center justify-center text-white text-center p-8">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                    <ImageIcon size={32} className="text-gray-500" />
                </div>
                <h3 className="text-xl font-light mb-2">Failed to load file.</h3>
                <button onClick={resetState} className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm">
                    <RotateCw size={14} /> Retry
                </button>
            </div>
        );
      }

      if (!isPreviewable) {
           let Icon = Package;
           if (fileType.includes('doc')) Icon = FileText;
           if (fileType.includes('zip')) Icon = Package;
           
           return (
               <div className="flex flex-col items-center justify-center text-white text-center p-8 animate-in zoom-in-95 duration-300">
                   <div className="w-24 h-24 mb-6 text-gray-400">
                      <Icon size={96} strokeWidth={1} />
                   </div>
                   <h3 className="text-2xl font-light mb-2">{file.name}</h3>
                   <p className="text-gray-400 mb-8">Preview not available for this file type.</p>
                   
                   <button onClick={handleDownload} className="px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-transform active:scale-95 flex items-center gap-2 shadow-lg shadow-white/10">
                       <Download size={18} /> Download File
                   </button>
               </div>
           );
      }

      // -- Actual Preview Renderers --
      
      // Image (Including WebP)
      if (isImage) {
        return (
            <div className="relative w-full h-full flex items-center justify-center">
                {isLoading && (
                     <div className="absolute inset-0 flex items-center justify-center">
                         <Loader2 className="w-10 h-10 text-white/30 animate-spin" />
                     </div>
                )}
                <img 
                    src={file.url} 
                    alt={file.name}
                    className={`max-w-[90%] max-h-[90%] object-contain transition-opacity duration-300 shadow-2xl ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={(e) => {
                        setIsLoading(false);
                        setDimensions({ width: e.target.naturalWidth, height: e.target.naturalHeight });
                    }}
                    onError={() => { setIsLoading(false); setHasError(true); }}
                />
            </div>
        );
      }

      // Video
      if (isVideo) {
          return (
              <video 
                  controls 
                  className="max-w-[80%] max-h-[90%] outline-hidden shadow-2xl rounded-lg bg-black"
                  src={file.url}
                  onLoadedData={(e) => {
                      setIsLoading(false);
                      setDimensions({ width: e.target.videoWidth, height: e.target.videoHeight });
                  }}
                  onError={() => { setIsLoading(false); setHasError(true); }}
              >
                  Your browser does not support the video tag.
              </video>
          );
      }

      // PDF (React-PDF)
      if (isPDF) {
          return (
              <div className="relative w-full h-full flex flex-col items-center justify-center pt-2">
                 {/* PDF Toolbar */}
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 bg-gray-900/90 backdrop-blur-md rounded-full border border-white/10 shadow-xl transition-opacity hover:opacity-100">
                      <button 
                        onClick={(e) => { e.stopPropagation(); changePdfPage(-1); }}
                        disabled={pdfPageNumber <= 1}
                        className="p-1.5 hover:bg-white/10 rounded-full disabled:opacity-30 text-white transition"
                      >
                         <ChevronLeft size={16} />
                      </button>
                      <span className="text-xs font-medium text-gray-300 min-w-[60px] text-center select-none">
                          {pdfPageNumber} / {numPages || '--'}
                      </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); changePdfPage(1); }}
                        disabled={pdfPageNumber >= numPages}
                        className="p-1.5 hover:bg-white/10 rounded-full disabled:opacity-30 text-white transition"
                      >
                         <ChevronRight size={16} />
                      </button>
                      <div className="w-px h-4 bg-white/20 mx-1"></div>
                      <button onClick={(e) => { e.stopPropagation(); toggleZoom(); }} className="p-1.5 hover:bg-white/10 rounded-full text-white transition" title="Zoom">
                         {scale > 1 ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
                      </button>
                 </div>

                 {isLoading && (
                     <div className="absolute inset-0 flex items-center justify-center z-20">
                         <Loader2 className="w-10 h-10 text-white/30 animate-spin" />
                     </div>
                 )}

                 <div className="overflow-auto w-full h-full flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
                    <Document
                        file={file.url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={() => { setIsLoading(false); setHasError(true); }}
                        loading={null}
                        className="shadow-2xl"
                    >
                        <Page 
                            pageNumber={pdfPageNumber} 
                            scale={scale}
                            renderAnnotationLayer={false}
                            renderTextLayer={false} // Performance opt for preview
                            className="shadow-xl rounded-xs overflow-hidden"
                            height={window.innerHeight * 0.85} // Dynamic height
                        />
                    </Document>
                 </div>
              </div>
          );
      }

      return null;
  };

  return createPortal(
    <div className="fixed inset-0 z-9999 flex flex-col animate-in fade-in duration-200">
      
      {/* 3.1 Background Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-xs"
        onClick={onClose} 
      />

      {/* 3.2 Header Toolbar */}
      <div className="relative z-10 h-16 flex items-center justify-between px-6 border-b border-white/10 bg-linear-to-b from-black/50 to-transparent">
          {/* Left: Info */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="flex flex-col min-w-0">
                  <h2 className="text-white text-sm font-medium truncate pr-4" title={file.name}>
                      {file.name}
                  </h2>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                       <span>{file.size || 'Unknown Size'}</span>
                       
                       {/* Dimensions Display */}
                       {dimensions && (
                           <>
                            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                            <span className="font-mono">{dimensions.width}x{dimensions.height}</span>
                           </>
                       )}

                       {/* Brand info if available in item */}
                       {currentItem?.brandId && (
                           <>
                            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                            <span className="uppercase tracking-wider">
                                {currentItem.brandId.replace('b-', '').toUpperCase()} 
                            </span>
                           </>
                       )}
                  </div>
              </div>
          </div>

          {/* Center: Pagination */}
          <div className="absolute left-1/2 -translate-x-1/2 text-white/50 text-xs font-medium tracking-widest hidden md:block">
              {currentIndex + 1} / {files.length}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
               {!isDeleted && (
                   <button 
                        onClick={handleDownload}
                        className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        title="Download"
                   >
                       <Download size={20} />
                   </button>
               )}
               <button 
                    onClick={onClose}
                    className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    title="Close (Esc)"
               >
                   <X size={20} />
               </button>
          </div>
      </div>

      {/* 3.3 Core Canvas */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 min-h-0 overflow-hidden">
          {renderContent()}
      </div>

      {/* 3.4 Navigation Controls */}
      {/* Previous */}
      {currentIndex > 0 && (
          <button 
              onClick={handlePrev}
              className="fixed left-4 top-1/2 -translate-y-1/2 z-20 p-4 text-white/30 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300 group outline-hidden"
          >
              <ChevronLeft size={40} className="group-active:-translate-x-1 transition-transform" />
          </button>
      )}

      {/* Next */}
      {currentIndex < files.length - 1 && (
          <button 
              onClick={handleNext}
              className="fixed right-4 top-1/2 -translate-y-1/2 z-20 p-4 text-white/30 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300 group outline-hidden"
          >
              <ChevronRight size={40} className="group-active:translate-x-1 transition-transform" />
          </button>
      )}

    </div>,
    document.body
  );
};

export default UniversalPreview;
