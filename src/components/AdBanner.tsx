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

    // Create a fully isolated iframe to encapsulate cross-origin script errors
    const iframe = document.createElement('iframe');
    iframe.style.width = `${width}px`;
    iframe.style.height = `${height}px`;
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.scrolling = 'no';
    
    // Append the iframe first
    containerRef.current.appendChild(iframe);

    // Write the ad scripts inside the iframe document context
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              html, body {
                margin: 0;
                padding: 0;
                overflow: hidden;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                background: transparent;
              }
            </style>
          </head>
          <body>
            <div id="ad-container"></div>
            <script type="text/javascript">
              var atOptions = {
                'key' : '${adKey}',
                'format' : '${format}',
                'height' : ${height},
                'width' : ${width},
                'params' : {}
              };
              
              // Handle and ignore internal script errors within this iframe
              window.onerror = function() { return true; };
            </script>
            <script type="text/javascript" src="https://endedstrung.com/${adKey}/invoke.js"></script>
          </body>
        </html>
      `);
      iframeDoc.close();
    }

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
