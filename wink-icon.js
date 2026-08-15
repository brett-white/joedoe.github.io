// Resolved from this script's own URL (captured synchronously, before the
// deferred 'load' handler below runs) rather than hardcoded as '/assets/...'
// — a root-absolute path only works when the site is served from an actual
// server root. Under a local dev server whose document root is a parent of
// this project (e.g. MAMP pointed at a shared Sites folder), '/assets/...'
// resolves outside the project and 404s, so the animation silently fails to
// load and the CSS fallback icon shows instead.
var rivSrc = document.currentScript
  ? new URL('assets/joedoe-wink.riv', document.currentScript.src).href
  : 'assets/joedoe-wink.riv';

window.addEventListener('load', function () {
  document.querySelectorAll('canvas[data-rive-wink]').forEach(function (canvas) {
    var wrap = canvas.closest('[data-rive-wink-wrap]');

    // No Rive runtime at all (CDN blocked/unreachable) — the animation was
    // never going to load, so show the static fallback immediately.
    if (!window.rive) {
      if (wrap) wrap.classList.add('is-fallback');
      return;
    }

    var ready = false;
    var r = new rive.Rive({
      src: rivSrc,
      canvas: canvas,
      autoplay: true,
      onLoad: function () {
        ready = true;
        r.resizeDrawingSurfaceToCanvas();
      },
      onLoadError: function () {
        if (wrap) wrap.classList.add('is-fallback');
      }
    });

    if (wrap) {
      wrap.addEventListener('mouseenter', function () {
        if (!ready) return;
        r.reset();
        r.play();
      });
    }
  });
});
