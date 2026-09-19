const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');
const backToTop = document.querySelector('.back-to-top');
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('#site-nav a')];

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  backToTop.classList.toggle('show', window.scrollY > window.innerHeight);
}, { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal:not(.visible)').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
  revealObserver.observe(element);
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const sectionNavMap = { thanks: 'message', 'take-care': 'surprise' };
    const current = sectionNavMap[entry.target.id] || entry.target.id;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  });
}, { rootMargin: '-35% 0px -55%', threshold: 0 });
sections.forEach((section) => sectionObserver.observe(section));

const typingTarget = document.querySelector('[data-typing]');
const typingText = typingTarget.dataset.typing;
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  typingTarget.textContent = '';
  let charIndex = 0;
  const typeNext = () => {
    typingTarget.textContent = typingText.slice(0, ++charIndex);
    if (charIndex < typingText.length) setTimeout(typeNext, 95);
  };
  setTimeout(typeNext, 550);
}

const gallery = document.querySelector('.gallery-grid');
const galleryCards = [...document.querySelectorAll('.gallery-card')];
const galleryPrev = document.querySelector('.gallery-arrow.prev');
const galleryNext = document.querySelector('.gallery-arrow.next');
const galleryDots = document.querySelector('.gallery-dots');
const desktopGallery = window.matchMedia('(min-width: 721px)');
const galleryPageSize = 6;
const galleryPageCount = Math.max(1, Math.ceil(galleryCards.length / galleryPageSize));
let galleryPage = 0;

const buildGalleryDots = () => {
  galleryDots.replaceChildren();
  for (let page = 0; page < galleryPageCount; page += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `ดูชุดรูปที่ ${page + 1}`);
    dot.addEventListener('click', () => {
      galleryPage = page;
      if (desktopGallery.matches) {
        renderGalleryPage();
      } else {
        galleryCards[page * galleryPageSize]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
    galleryDots.append(dot);
  }
};

const updateGalleryControls = () => {
  [...galleryDots.children].forEach((dot, index) => {
    dot.classList.toggle('active', index === galleryPage);
    dot.setAttribute('aria-current', index === galleryPage ? 'true' : 'false');
  });
  if (desktopGallery.matches) {
    galleryPrev.disabled = galleryPage === 0;
    galleryNext.disabled = galleryPage === galleryPageCount - 1;
  } else {
    galleryPrev.disabled = gallery.scrollLeft <= 4;
    galleryNext.disabled = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 4;
  }
  gallery.setAttribute('aria-label', `แกลเลอรีรูปความทรงจำ ชุดที่ ${galleryPage + 1} จาก ${galleryPageCount}`);
};

const renderGalleryPage = () => {
  galleryCards.forEach((card, index) => {
    const isOnPage = index >= galleryPage * galleryPageSize && index < (galleryPage + 1) * galleryPageSize;
    card.hidden = !isOnPage;
    if (isOnPage) {
      card.classList.remove('page-enter');
      requestAnimationFrame(() => card.classList.add('page-enter'));
    }
  });
  gallery.scrollLeft = 0;
  updateGalleryControls();
};

const syncGalleryLayout = () => {
  if (desktopGallery.matches) {
    galleryPage = Math.min(galleryPage, galleryPageCount - 1);
    renderGalleryPage();
  } else {
    galleryCards.forEach((card) => {
      card.hidden = false;
      card.classList.remove('page-enter');
    });
    updateGalleryControls();
  }
};

galleryPrev.addEventListener('click', () => {
  if (desktopGallery.matches) {
    galleryPage = Math.max(0, galleryPage - 1);
    renderGalleryPage();
  } else {
    gallery.scrollBy({ left: -gallery.clientWidth * 0.82, behavior: 'smooth' });
  }
});

galleryNext.addEventListener('click', () => {
  if (desktopGallery.matches) {
    galleryPage = Math.min(galleryPageCount - 1, galleryPage + 1);
    renderGalleryPage();
  } else {
    gallery.scrollBy({ left: gallery.clientWidth * 0.82, behavior: 'smooth' });
  }
});

gallery.addEventListener('scroll', () => {
  if (desktopGallery.matches) return;
  const center = gallery.scrollLeft + gallery.clientWidth / 2;
  const closestIndex = galleryCards.reduce((best, card, index) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    return Math.abs(cardCenter - center) < Math.abs(galleryCards[best].offsetLeft + galleryCards[best].offsetWidth / 2 - center) ? index : best;
  }, 0);
  galleryPage = Math.min(galleryPageCount - 1, Math.floor(closestIndex / galleryPageSize));
  updateGalleryControls();
}, { passive: true });

buildGalleryDots();
syncGalleryLayout();
desktopGallery.addEventListener('change', syncGalleryLayout);

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('p');
galleryCards.forEach((card) => {
  card.addEventListener('click', () => {
    const sourceImage = card.querySelector('img');
    lightboxImage.src = card.dataset.full;
    lightboxImage.alt = sourceImage.alt;
    lightboxCaption.textContent = sourceImage.alt;
    lightbox.showModal();
    document.body.classList.add('no-scroll');
  });
});
const closeLightbox = () => {
  lightbox.close();
  document.body.classList.remove('no-scroll');
};
lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
lightbox.addEventListener('close', () => document.body.classList.remove('no-scroll'));

const videoModal = document.querySelector('.video-modal');
const videoPlayer = videoModal.querySelector('video');
const videoTitle = videoModal.querySelector('#video-modal-title');
const videoError = videoModal.querySelector('.video-error');
const videoStart = videoModal.querySelector('.video-start');

const playCurrentVideo = async () => {
  videoStart.disabled = true;
  videoError.hidden = true;
  try {
    await videoPlayer.play();
    videoStart.hidden = true;
  } catch (error) {
    videoStart.disabled = false;
    videoStart.hidden = false;
    videoStart.querySelector('small').textContent = 'แตะอีกครั้งเพื่อเล่น';
    videoError.textContent = 'หากคลิปยังไม่เริ่ม ลองเปิดเว็บด้วย Chrome, Edge หรือ Safari เวอร์ชันล่าสุดนะ';
    videoError.hidden = false;
  }
};

document.querySelectorAll('.video-button').forEach((button) => {
  button.addEventListener('click', async () => {
    videoTitle.textContent = button.dataset.videoTitle || 'คลิปความทรงจำของเรา';
    videoError.hidden = true;
    videoPlayer.hidden = false;
    videoStart.hidden = false;
    videoStart.disabled = false;
    videoPlayer.src = button.dataset.video;
    videoModal.showModal();
    videoPlayer.load();
    document.body.classList.add('no-scroll');
    await playCurrentVideo();
  });
});

videoStart.addEventListener('click', async () => {
  await playCurrentVideo();
});

videoPlayer.addEventListener('play', () => { videoStart.hidden = true; });
videoPlayer.addEventListener('pause', () => {
  if (!videoPlayer.ended && videoPlayer.currentTime > 0) videoStart.hidden = false;
});
videoPlayer.addEventListener('ended', () => {
  videoStart.querySelector('small').textContent = 'เล่นอีกครั้ง';
  videoStart.hidden = false;
  videoStart.disabled = false;
});

videoPlayer.addEventListener('error', () => {
  videoPlayer.hidden = true;
  videoStart.hidden = true;
  videoError.hidden = false;
});

const closeVideoModal = () => {
  videoPlayer.pause();
  videoPlayer.removeAttribute('src');
  videoPlayer.load();
  videoStart.querySelector('small').textContent = 'แตะเพื่อเล่นคลิป';
  videoModal.close();
  document.body.classList.remove('no-scroll');
};

videoModal.querySelector('.video-modal-close').addEventListener('click', closeVideoModal);
videoModal.addEventListener('click', (event) => { if (event.target === videoModal) closeVideoModal(); });
videoModal.addEventListener('close', () => {
  videoPlayer.pause();
  videoPlayer.removeAttribute('src');
  videoStart.querySelector('small').textContent = 'แตะเพื่อเล่นคลิป';
  document.body.classList.remove('no-scroll');
});

const surprise = document.querySelector('.surprise-section');
const startDate = new Date(surprise.dataset.startDate).getTime();
const unitElements = Object.fromEntries([...document.querySelectorAll('[data-unit]')].map((el) => [el.dataset.unit, el]));
const formatNumber = (value) => new Intl.NumberFormat('th-TH').format(value);
const updateCounter = () => {
  const elapsed = Math.max(Date.now() - startDate, 0);
  const totalSeconds = Math.floor(elapsed / 1000);
  const days = Math.floor(totalSeconds / 86400);
  unitElements.days.textContent = formatNumber(days);
  unitElements.hours.textContent = formatNumber(Math.floor(totalSeconds / 3600));
  unitElements.minutes.textContent = formatNumber(Math.floor(totalSeconds / 60));
  unitElements.seconds.textContent = formatNumber(totalSeconds);
  document.querySelector('#days-inline').textContent = formatNumber(days);
};
updateCounter();
setInterval(updateCounter, 1000);

let heartClicks = 0;
document.querySelector('.secret-heart').addEventListener('click', () => {
  heartClicks += 1;
  if (heartClicks >= 5) {
    const secret = document.querySelector('.secret-message');
    secret.hidden = false;
    secret.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});

const careButton = document.querySelector('.care-button');
const prescription = document.querySelector('.prescription');
const careConfetti = document.querySelector('.care-confetti');

careButton.addEventListener('click', () => {
  const isFirstDose = prescription.hidden;
  prescription.hidden = false;
  careButton.setAttribute('aria-expanded', 'true');
  careButton.innerHTML = '<span aria-hidden="true">♥</span> ขอกำลังใจเพิ่มอีกนิด';

  for (let index = 0; index < 14; index += 1) {
    const heart = document.createElement('span');
    heart.textContent = index % 3 === 0 ? '♡' : '♥';
    const angle = (Math.PI * 2 * index) / 14;
    const distance = 90 + Math.random() * 120;
    heart.style.setProperty('--heart-x', `${Math.cos(angle) * distance}px`);
    heart.style.setProperty('--heart-y', `${Math.sin(angle) * distance}px`);
    heart.style.setProperty('--heart-r', `${-90 + Math.random() * 180}deg`);
    careConfetti.append(heart);
    heart.addEventListener('animationend', () => heart.remove());
  }

  if (isFirstDose) prescription.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

nav.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});
