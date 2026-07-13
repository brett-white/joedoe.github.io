(function () {
  const header = document.querySelector('header.site');
  if (!header) return;

  const flowElements = document.querySelectorAll('body > section, body > footer.site');

  function isDarkElement(el) {
    return el.matches('.hero, .bg-navy, footer.site');
  }

  function updateTheme() {
    const probeY = header.offsetHeight + 1;
    let isDark = false;

    for (const el of flowElements) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= probeY && rect.bottom > probeY) {
        isDark = isDarkElement(el);
        break;
      }
    }

    header.classList.toggle('on-dark', isDark);
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateTheme();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateTheme);
  updateTheme();
})();
