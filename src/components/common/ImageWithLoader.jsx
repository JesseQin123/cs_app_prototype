import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

const ImageWithLoader = ({ 
  src, 
  alt, 
  className = "", 
  containerClassName = "",
  fallbackSrc = null
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative w-full h-full overflow-hidden bg-gray-100 ${containerClassName}`}>
      {/* 1. Skeleton / Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-gray-200">
           <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-[shimmer_1.5s_infinite] -translate-x-full"></div>
        </div>
      )}

      {/* 2. Image */}
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        />
      ) : (
        /* 3. Error Fallback */
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
             {fallbackSrc ? (
                 <img src={fallbackSrc} alt={alt} className="w-full h-full object-cover opacity-60 grayscale" />
             ) : (
                 <ImageIcon size={24} className="opacity-50" />
             )}
        </div>
      )}
    </div>
  );
};

export default ImageWithLoader;
