import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  adKey: string;
  format: string;
  height: number;
  width: number;
}

export default function AdBanner({ adKey, format, height, width }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any stale ad container content
    containerRef.current.innerHTML = '';

    // Create container element
    const wrapper = document.createElement('div');
    wrapper.style.display = 'inline-block';
    wrapper.style.width = `${width}px`;
    wrapper.style.height = `${height}px`;

    // 1. Script for setting atOptions
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.innerHTML = `
      var atOptions = {
        'key' : '${adKey}',
        'format' : '${format}',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;

    // 2. Script for loading invoke.js
    const loadScript = document.createElement('script');
    loadScript.type = 'text/javascript';
    loadScript.src = `https://endedstrung.com/${adKey}/invoke.js`;

    // Append both scripts to the wrapper
    wrapper.appendChild(configScript);
    wrapper.appendChild(loadScript);

    // Append wrapper to the container
    containerRef.current.appendChild(wrapper);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [adKey, format, height, width]);

  return (
    <div className="flex justify-center items-center my-4 overflow-hidden w-full select-none">
      <div 
        ref={containerRef} 
        className="max-w-full overflow-x-auto no-scrollbar" 
        style={{ minWidth: `${width}px`, minHeight: `${height}px` }} 
      />
    </div>
  );
}
