window.HELP_IMPROVE_VIDEOJS = false;

var REDUCED_MOTION = window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Copy BibTeX to clipboard (from the modernized template)
function copyBibTeX() {
  var el = document.getElementById('bibtex-code');
  var btn = document.querySelector('.copy-bibtex-btn');
  if (!el || !btn) return;
  var text = el.textContent;
  var done = function () {
    btn.textContent = 'Copied';
    setTimeout(function () { btn.textContent = 'Copy'; }, 2000);
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
  } else {
    fallbackCopy(text);
    done();
  }
}

function fallbackCopy(text) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'absolute';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch (e) { /* ignore */ }
  document.body.removeChild(ta);
}

// Respect reduced-motion: never autoplay; show controls and the poster instead.
function applyReducedMotion() {
  if (!REDUCED_MOTION) return;
  document.querySelectorAll('video[autoplay], video[data-autoplay]').forEach(function (v) {
    v.removeAttribute('autoplay');
    v.removeAttribute('data-autoplay');
    v.pause();
    v.controls = true;
  });
}

// Muted looping explanatory clips play only while visible (and never with reduced motion).
function setupVisibleAutoplay() {
  if (REDUCED_MOTION || !('IntersectionObserver' in window)) return;
  var vids = document.querySelectorAll('video[data-autoplay]');
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var v = entry.target;
      if (entry.isIntersecting) {
        if (v.preload === 'none') { v.preload = 'auto'; }
        var p = v.play();
        if (p && p.catch) { p.catch(function () { /* autoplay blocked: controls remain */ }); }
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.5 });
  vids.forEach(function (v) { obs.observe(v); });
}

$(document).ready(function () {
  var options = {
    slidesToScroll: 1,
    slidesToShow: 1,
    loop: true,
    infinite: true,
    autoplay: false,
    pagination: true,
    navigationKeys: true
  };
  if (window.bulmaCarousel) {
    bulmaCarousel.attach('.carousel', options);
  }
  applyReducedMotion();
  setupVisibleAutoplay();
});
