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

// Dhalan Ghar — Activities page: Games Corner popup modal
// Appended block, separate from the listener above so nothing
// existing is touched.

document.addEventListener('DOMContentLoaded', () => {

  const modal = document.getElementById('activityModal');
  if (!modal) return; // only runs on pages that have the modal

  const mediaBox = document.getElementById('activityModalMedia');
  const titleEl = document.getElementById('activityModalTitle');
  const descEl = document.getElementById('activityModalDesc');
  const closeBtn = document.getElementById('activityModalClose');
  const cards = document.querySelectorAll('[data-media-type]');

  const openModal = (card) => {
    const type = card.dataset.mediaType;
    const title = card.dataset.title || '';
    const desc = card.dataset.desc || '';

    mediaBox.innerHTML = '';
    mediaBox.classList.remove('activity-modal__media--placeholder');

    if (type === 'video') {
      const video = document.createElement('video');
      video.src = card.dataset.media;
      video.controls = true;
      video.playsInline = true;
      mediaBox.appendChild(video);
    } else if (type === 'image') {
      const img = document.createElement('img');
      img.src = card.dataset.media;
      img.alt = title;
      mediaBox.appendChild(img);
    } else {
      mediaBox.classList.add('activity-modal__media--placeholder');
      const p = document.createElement('p');
      p.className = 'activity-modal__placeholder-text';
      p.textContent = '[Photo or video coming soon]';
      mediaBox.appendChild(p);
    }

    titleEl.textContent = title;
    descEl.textContent = desc;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    const video = mediaBox.querySelector('video');
    if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
    mediaBox.innerHTML = '';
  };

  cards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
  });

  closeBtn.addEventListener('click', closeModal);
  modal.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

});

// Dhalan Ghar — Dining page: interactive menu
// (live search, veg-only filter, and a category chip nav that
// smooth-scrolls and highlights itself as you scroll). Appended
// block, separate from everything above so nothing existing is
// touched.

document.addEventListener('DOMContentLoaded', () => {

  const frame = document.querySelector('.menu-frame');
  if (!frame) return; // only runs on the dining page

  /* Search + veg-only filtering */
  const searchWrap = document.querySelector('.menu-search');
  const searchInput = document.getElementById('menuSearch');
  const searchClear = document.querySelector('.menu-search__clear');
  const vegToggle = document.getElementById('vegOnlyToggle');
  const catSections = document.querySelectorAll('.menu-cat');
  const emptyState = document.getElementById('menuEmpty');

  const applyFilters = () => {
    const query = (searchInput.value || '').trim().toLowerCase();
    const vegOnly = vegToggle.checked;
    searchWrap.classList.toggle('has-value', query.length > 0);

    let anyVisible = 0;

    catSections.forEach(section => {
      let visibleInSection = 0;

      section.querySelectorAll('.menu-group').forEach(group => {
        let visibleInGroup = 0;

        group.querySelectorAll('.menu-filterable').forEach(row => {
          const matchesSearch = !query || (row.dataset.search || '').includes(query);
          const matchesDiet = !vegOnly || row.dataset.diet !== 'nonveg';
          const visible = matchesSearch && matchesDiet;
          row.classList.toggle('is-hidden', !visible);
          if (visible) visibleInGroup++;
        });

        group.classList.toggle('is-hidden', visibleInGroup === 0);
        visibleInSection += visibleInGroup;
      });

      section.classList.toggle('is-hidden', visibleInSection === 0);
      anyVisible += visibleInSection;
    });

    if (emptyState) emptyState.classList.toggle('is-visible', anyVisible === 0);
  };

  searchInput.addEventListener('input', applyFilters);
  vegToggle.addEventListener('change', applyFilters);
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    applyFilters();
  });

  /* Category chip nav: scroll (inside the bounded panel) + scrollspy */
  const chips = document.querySelectorAll('.menu-chip');
  const scrollPanel = document.getElementById('menuScroll');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const target = document.getElementById(chip.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if ('IntersectionObserver' in window && scrollPanel) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        chips.forEach(c => c.classList.toggle('is-active', c.dataset.target === entry.target.id));
      });
    }, { root: scrollPanel, rootMargin: '0px 0px -70% 0px', threshold: 0 });
    catSections.forEach(section => spy.observe(section));
  }

});
