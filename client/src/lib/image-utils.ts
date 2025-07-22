import { useState, useRef, useEffect, useMemo } from 'react';
import type { FC, ImgHTMLAttributes } from 'react';

/**
 * Image optimization utilities
 * 
 * Usage:
 * import { getOptimizedImage, LazyImage } from '@/lib/image-utils';
 * 
 * // In your component:
 * const imageUrl = getOptimizedImage('/path/to/image.jpg', { width: 800, quality: 80 });
 * 
 * // For lazy loading:
 * <LazyImage 
 *   src="/path/to/image.jpg" 
 *   alt="Description" 
 *   options={{ width: 800, quality: 80 }}
 * />
 */

type ImageOptions = {
  width?: number;
  quality?: number;
  format?: 'webp' | 'png' | 'jpg' | 'jpeg';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
};

/**
 * Generate optimized image URL with query parameters for the image server
 */
export function getOptimizedImage(src: string, options: ImageOptions = {}): string {
  if (!src) return '';
  
  // Skip if it's an external URL
  if (src.startsWith('http')) return src;
  
  const params = new URLSearchParams();
  
  // Set default options
  const {
    width = 1200,
    quality = 80,
    format = 'webp',
    fit = 'cover',
  } = options;
  
  // Add parameters
  if (width) params.append('w', width.toString());
  if (quality) params.append('q', quality.toString());
  if (format) params.append('format', format);
  if (fit) params.append('fit', fit);
  
  // For development, use the original image
  if (process.env.NODE_ENV === 'development') {
    return src;
  }
  
  // For production, add the optimization parameters
  return `${src}?${params.toString()}`;
}

/**
 * Preload an image to improve perceived performance
 */
export function preloadImage(src: string): void {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
}

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  options?: ImageOptions;
}

/**
 * Lazy load image component with intersection observer
 */
export const LazyImage: FC<LazyImageProps> = ({ 
  src, 
  alt, 
  options, 
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let didCancel = false;
    
    const imgElement = imgRef.current;
    
    if (imgElement) {
      if (typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!didCancel && (entry.isIntersecting || entry.intersectionRatio > 0)) {
                const img = entry.target as HTMLImageElement;
                const src = img.getAttribute('data-src');
                if (src) {
                  setImageSrc(src);
                }
                observer?.unobserve(img);
              }
            });
          },
          {
            threshold: 0.01,
            rootMargin: '75%',
          }
        );
        
        observer.observe(imgElement);
      } else {
        // Fallback for browsers that don't support IntersectionObserver
        setImageSrc(src);
      }
    }
    
    return () => {
      didCancel = true;
      if (observer && imgElement) {
        observer.unobserve(imgElement);
      }
    };
  }, [src]);
  
  const optimizedSrc = useMemo(() => {
    return getOptimizedImage(imageSrc || src, options);
  }, [imageSrc, src, options]);
  
  const handleLoad = () => {
    setIsLoaded(true);
  };
  
  // Create a new props object without the options prop to avoid passing it to the img element
  const { options: _, ...imgProps } = props;
  
  return (
    <img
      ref={imgRef}
      src={imageSrc ? optimizedSrc : ''}
      data-src={src}
      alt={alt}
      onLoad={handleLoad}
      loading="lazy"
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        ...(props.style || {}),
      }}
      {...imgProps}
    />
  );
};
