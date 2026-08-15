// Highlights the nav link for whichever section is currently in view.
// Only same-page hash links (href="#id") are eligible — cross-page links
// like "/partners/" or "/#pricing" are left alone since there's no local
// section for them to track.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  var tracked = links
    .map(function (link) {
      var section = document.getElementById(link.getAttribute('href').slice(1));
      return section ? { link: link, section: section } : null;
    })
    .filter(Boolean);

  if (!tracked.length) return;

  function setActive(link) {
    links.forEach(function (l) { l.classList.toggle('is-active', l === link); });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var match = tracked.find(function (t) { return t.section === entry.target; });
      if (match) setActive(match.link);
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  tracked.forEach(function (t) { observer.observe(t.section); });
})();
