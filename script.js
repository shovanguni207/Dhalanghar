// Dhalan Ghar — Simple Homepage interactions

document.addEventListener('DOMContentLoaded', () => {

  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the mobile menu after tapping a link
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu if window is resized past mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Gallery lightbox — only runs on pages that actually have a gallery
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const galleryItems = document.querySelectorAll('.polaroid[data-full], .gallery-grid__item[data-full]');

    const openLightbox = (src, alt) => {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
    };

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        openLightbox(item.dataset.full, img ? img.alt : '');
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // Gallery filter tabs — only runs on pages that have the filter bar
  const filters = document.getElementById('galleryFilters');
  if (filters) {
    const filterBtns = filters.querySelectorAll('.gallery-filters__btn');
    const gridItems = document.querySelectorAll('.gallery-grid__item');
    const emptyMsg = document.getElementById('galleryEmpty');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');

        const filter = btn.dataset.filter;
        let visibleCount = 0;

        gridItems.forEach(item => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.classList.toggle('is-filtered-out', !match);
          if (match) visibleCount++;
        });

        if (emptyMsg) emptyMsg.hidden = visibleCount !== 0;
      });
    });
  }

});
