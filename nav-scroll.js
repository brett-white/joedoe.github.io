(function () {
  const header = document.querySelector('header.site');
  if (!header) return;

  const flowElements = document.querySelectorAll('body > section, body > footer.site');

  function isDarkElement(el) {
    return el.matches('.hero, .bg-navy, footer.site');
  }

  function updateTheme() {
    // at the very top of the page the hero is always what's under the
    // header — iOS Safari's rubber-band bounce at this boundary doesn't
    // reliably fire 'scroll' events, so this case is decided directly
    // rather than relying on the generic probe below.
    if (window.scrollY <= 0) {
      header.classList.add('on-dark');
      return;
    }

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
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateTheme);
  }
  updateTheme();

  const toggle = header.querySelector('.nav-toggle');
  if (toggle) {
    const closeMenu = () => {
      header.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    header.querySelectorAll('.nav-links a, .nav-cta a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }
})();
