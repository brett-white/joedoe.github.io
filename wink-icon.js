window.addEventListener('load', function () {
  if (!window.rive) return;

  document.querySelectorAll('canvas[data-rive-wink]').forEach(function (canvas) {
    var r = new rive.Rive({
      src: '/assets/joedoe-wink.riv',
      canvas: canvas,
      autoplay: true,
      onLoad: function () {
        r.resizeDrawingSurfaceToCanvas();
      }
    });

    var wrap = canvas.closest('[data-rive-wink-wrap]');
    if (wrap) {
      wrap.addEventListener('mouseenter', function () {
        r.reset();
        r.play();
      });
    }
  });
});
