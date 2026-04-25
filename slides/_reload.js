// Auto-reload — polls the current page's Last-Modified header and reloads on change.
// Only works over http:// (file:// strips Last-Modified from fetch responses).
(async () => {
  let baseTime = null;
  setInterval(async () => {
    try {
      const r = await fetch(location.pathname + '?_=' + Date.now(), { method: 'HEAD' });
      const t = r.headers.get('Last-Modified');
      if (baseTime === null) { baseTime = t; return; }
      if (t && t !== baseTime) location.reload();
    } catch {}
  }, 1500);
})();
