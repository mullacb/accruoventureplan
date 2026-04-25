// Auto-reload — polls Last-Modified for the current page AND the shared
// design-system CSS. CSS changes swap the <link> href (cache-busted) so the
// new stylesheet is guaranteed to load; HTML changes do a full page reload.
// Scroll position is preserved across reloads via sessionStorage.
// Only works over http:// (file:// strips Last-Modified from fetch responses).
(() => {
  const SCROLL_KEY = '_reload_scroll:' + location.pathname;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  // Save scroll on every unload (covers manual Cmd+R as well as the auto-reloader).
  const saveScroll = () => sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
  window.addEventListener('beforeunload', saveScroll);
  window.addEventListener('pagehide', saveScroll);
  // Restore on load.
  const saved = sessionStorage.getItem(SCROLL_KEY);
  if (saved !== null) {
    const y = parseInt(saved, 10);
    window.addEventListener('load', () => window.scrollTo(0, y));
  }
  const reloadKeepingScroll = () => {
    saveScroll();
    location.reload();
  };
  const watched = [location.pathname, '_design-system.css'];
  const baseTimes = {};
  setInterval(async () => {
    try {
      for (const f of watched) {
        const r = await fetch(f + '?_=' + Date.now(), { method: 'HEAD' });
        const t = r.headers.get('Last-Modified');
        if (baseTimes[f] === undefined) { baseTimes[f] = t; continue; }
        if (t && t !== baseTimes[f]) {
          baseTimes[f] = t;
          if (f.endsWith('.css')) {
            for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
              const u = new URL(link.href, location.href);
              if (u.pathname.endsWith('/' + f) || u.pathname.endsWith(f)) {
                u.searchParams.set('_', Date.now());
                link.href = u.toString();
              }
            }
          } else {
            reloadKeepingScroll();
          }
          return;
        }
      }
    } catch {}
  }, 1500);
})();
