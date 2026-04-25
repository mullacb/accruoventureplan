// Auto-reload — polls Last-Modified for the current page AND the shared
// design-system CSS, reloads the tab on any change.
// Only works over http:// (file:// strips Last-Modified from fetch responses).
(async () => {
  const watched = [location.pathname, '_design-system.css'];
  const baseTimes = {};
  setInterval(async () => {
    try {
      for (const f of watched) {
        const r = await fetch(f + '?_=' + Date.now(), { method: 'HEAD' });
        const t = r.headers.get('Last-Modified');
        if (baseTimes[f] === undefined) { baseTimes[f] = t; continue; }
        if (t && t !== baseTimes[f]) { location.reload(); return; }
      }
    } catch {}
  }, 1500);
})();
