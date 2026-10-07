import React, { useMemo } from 'react';

interface AdBannerProps {
  adKey: string;
  format: string;
  height: number;
  width: number;
}

export default function AdBanner({ adKey, format, height, width }: AdBannerProps) {
  // Isolate third-party ad script execution inside a self-contained iframe.
  // This prevents any cross-origin network errors, ad-blocker blocks, or invoke.js script failures
  // from bubbling up as unhandled "Script error." in the parent application window.
  const iframeContent = useMemo(() => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Advertisement</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: ${width}px;
      height: ${height}px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
    }
  </style>
  <script>
    window.onerror = function() { return true; };
    window.addEventListener('error', function(e) {
      if (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
      return true;
    }, true);
  </script>
</head>
<body>
  <script type="text/javascript">
    var atOptions = {
      'key' : '${adKey}',
      'format' : '${format}',
      'height' : ${height},
      'width' : ${width},
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="https://endedstrung.com/${adKey}/invoke.js" onerror="this.onerror=null;"></script>
</body>
</html>`;
  }, [adKey, format, height, width]);

  return (
    <aside
      aria-label="Advertisement"
      className="flex justify-center items-center my-4 overflow-hidden w-full select-none"
    >
      <div
        className="max-w-full overflow-hidden flex justify-center"
        style={{ minWidth: `${Math.min(width, 300)}px`, minHeight: `${height}px` }}
      >
        <iframe
          title={`Advertisement ${width}x${height}`}
          srcDoc={iframeContent}
          width={width}
          height={height}
          style={{
            border: 'none',
            overflow: 'hidden',
            maxWidth: '100%',
          }}
          scrolling="no"
          loading="lazy"
        />
      </div>
    </aside>
  );
}
