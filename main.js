/* =============================================================
   Jostas Painting Services — main.js  (v2)
   ─────────────────────────────────────────────────────────────
   1.  Footer year
   2.  Scroll-to-top button
   3.  Scroll reveal  (.reveal)
   4.  Portfolio filter
   5.  Navbar — active page highlight + scroll-shrink effect
   6.  Contact form — full validation, focus effects,
       localStorage storage + admin viewer
   ============================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     1. FOOTER YEAR
  ============================================================ */
  document.querySelectorAll('#yr').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });


  /* ============================================================
     2. SCROLL-TO-TOP BUTTON
  ============================================================ */
  var scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    window.addEventListener('scroll', function () {
      scrollBtn.classList.toggle('show', window.scrollY > 300);
    });
    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ============================================================
     3. SCROLL REVEAL
     Every .reveal element fades + slides up when it enters the
     viewport. Fires once then stops observing.
  ============================================================ */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { ro.observe(el); });
  }


  /* ============================================================
     4. PORTFOLIO FILTER  (portfolio.html)
  ============================================================ */
  var filterBtns     = document.querySelectorAll('.filter-btn');
  var portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterBtns.length && portfolioItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = btn.getAttribute('data-filter');

        portfolioItems.forEach(function (item) {
          var match = filter === 'all' || item.getAttribute('data-cat') === filter;
          if (match) {
            item.classList.remove('hidden');
            setTimeout(function () {
              item.style.opacity   = '1';
              item.style.transform = 'translateY(0)';
            }, 10);
          } else {
            item.style.opacity   = '0';
            item.style.transform = 'translateY(10px)';
            setTimeout(function () { item.classList.add('hidden'); }, 300);
          }
        });
      });
    });
  }


  /* ============================================================
     5. NAVBAR ENHANCEMENTS
     ── a. Active-page highlight ──────────────────────────────
     Compares each nav link href to window.location.pathname so
     the correct link is always highlighted regardless of which
     page you are on, without editing HTML per-page.

     ── b. Scroll-shrink ──────────────────────────────────────
     Adds .scrolled to <nav> after 40 px scroll so the bar
     compresses without snapping.
  ============================================================ */

  // ── a. Active link ──
  var navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  var pagePath = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(function (link) {
    var href     = (link.getAttribute('href') || '').split('/').pop();
    var isHome   = (pagePath === '' || pagePath === 'index.html') && href === 'index.html';
    var isMatch  = href === pagePath;

    link.classList.toggle('active', isHome || isMatch);
  });

  // ── b. Scroll-shrink ──
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }


  /* ============================================================
     6. CONTACT FORM  (contact.html only)
     ─────────────────────────────────────────────────────────
     Validation, UX focus effects, localStorage storage,
     and a built-in admin viewer at contact.html?admin=1
  ============================================================ */

  var form        = document.getElementById('contactForm');
  var formFields  = document.getElementById('formFields');
  var formSuccess = document.getElementById('formSuccess');
  var submitBtn   = document.getElementById('submitFormBtn');
  var resetBtn    = document.getElementById('resetFormBtn');
  var charCount   = document.getElementById('charCount');
  var messageEl   = document.getElementById('message');

  if (!form) {
    // Not on contact page — check for admin param anyway
    if (new URLSearchParams(window.location.search).get('admin') === '1') renderAdminPanel();
    return;
  }


  /* ── 6a. Input focus ring + label colour ──────────────────
     When a .contact-form-input gets focus, its nearest
     label (identified by .contact-form-label) turns the brand
     colour and the input gets an extra glow via .input-active.
  ------------------------------------------------------------ */
  document.querySelectorAll('.contact-form-input').forEach(function (el) {
    var wrapper = el.closest('.col-md-6, .mb-3, .mb-4');

    el.addEventListener('focus', function () {
      el.classList.add('input-active');
      if (wrapper) {
        var lbl = wrapper.querySelector('.contact-form-label');
        if (lbl) lbl.classList.add('label-active');
      }
    });

    el.addEventListener('blur', function () {
      el.classList.remove('input-active');
      if (wrapper) {
        var lbl = wrapper.querySelector('.contact-form-label');
        if (lbl) lbl.classList.remove('label-active');
      }
    });
  });


  /* ── 6b. Validation helpers ─────────────────────────────── */

  function setValid(id) {
    var el = document.getElementById(id), err = document.getElementById('err-' + id);
    if (!el) return;
    el.classList.remove('is-invalid'); el.classList.add('is-valid');
    if (err) err.classList.remove('show');
  }

  function setInvalid(id) {
    var el = document.getElementById(id), err = document.getElementById('err-' + id);
    if (!el) return;
    el.classList.remove('is-valid'); el.classList.add('is-invalid');
    el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
    if (err) err.classList.add('show');
  }

  function clearField(id) {
    var el = document.getElementById(id), err = document.getElementById('err-' + id);
    if (!el) return;
    el.classList.remove('is-valid', 'is-invalid', 'shake');
    if (err) err.classList.remove('show');
  }


  /* ── 6c. Validators ─────────────────────────────────────── */

  function validateName() {
    var v = document.getElementById('name').value.trim();
    return v.length >= 2 ? (setValid('name'), true) : (setInvalid('name'), false);
  }

  function validateEmail() {
    var v = document.getElementById('email').value.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? (setValid('email'), true) : (setInvalid('email'), false);
  }

  function validatePhone() {
    // SA: 0XXXXXXXXX or +27XXXXXXXXX — strips spaces/hyphens first
    var v = document.getElementById('phone').value.trim().replace(/[\s\-]/g, '');
    return /^(\+27|0)[6-8][0-9]{8}$/.test(v) ? (setValid('phone'), true) : (setInvalid('phone'), false);
  }

  function validateService() {
    var v = document.getElementById('service').value;
    return v !== '' ? (setValid('service'), true) : (setInvalid('service'), false);
  }

  function validateMessage() {
    var v = document.getElementById('message').value.trim();
    return v.length >= 10 ? (setValid('message'), true) : (setInvalid('message'), false);
  }


  /* ── 6d. Blur + live-clear listeners ───────────────────── */

  var validators = { name: validateName, email: validateEmail, phone: validatePhone, service: validateService, message: validateMessage };

  Object.keys(validators).forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', validators[id]);
    el.addEventListener(id === 'service' ? 'change' : 'input', function () { clearField(id); });
  });


  /* ── 6e. Character counter ─────────────────────────────── */

  if (messageEl && charCount) {
    messageEl.addEventListener('input', function () {
      if (messageEl.value.length > 500) messageEl.value = messageEl.value.slice(0, 500);
      var len = messageEl.value.length;
      charCount.textContent = len;
      var wrap = charCount.closest('.text-end') || charCount.parentElement;
      if (wrap) wrap.style.color = len > 450 ? '#dc3545' : '';
    });
  }


  /* ── 6f. localStorage helpers ──────────────────────────── */

  var STORAGE_KEY = 'jostas_submissions';

  function loadSubmissions() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveSubmission(data) {
    var all = loadSubmissions();
    data.id          = Date.now();
    data.submittedAt = new Date().toLocaleString('en-ZA', {
      timeZone: 'Africa/Johannesburg', dateStyle: 'medium', timeStyle: 'short'
    });
    all.unshift(data);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); return true; }
    catch (e) { console.warn('localStorage full — submission not saved.'); return false; }
  }


  /* ── 6g. Submit ────────────────────────────────────────── */

  if (submitBtn) {
    submitBtn.addEventListener('click', function () {

      var valid = [validateName(), validateEmail(), validatePhone(), validateService(), validateMessage()].every(Boolean);

      if (!valid) {
        var first = form.querySelector('.is-invalid');
        if (first) { first.scrollIntoView({ behavior: 'smooth', block: 'center' }); first.focus(); }
        return;
      }

      var submission = {
        name:    document.getElementById('name').value.trim(),
        email:   document.getElementById('email').value.trim(),
        phone:   document.getElementById('phone').value.trim(),
        service: document.getElementById('service').value,
        message: document.getElementById('message').value.trim()
      };

      saveSubmission(submission);

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Sending…';

      setTimeout(function () {
        if (formFields)  formFields.classList.add('d-none');
        if (formSuccess) formSuccess.classList.remove('d-none');
      }, 1200);
    });
  }


  /* ── 6h. Reset ─────────────────────────────────────────── */

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      form.reset();
      ['name','email','phone','service','message'].forEach(clearField);
      if (charCount) charCount.textContent = '0';
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = 'Send Message <i class="fas fa-arrow-right ms-2"></i>'; }
      if (formSuccess) formSuccess.classList.add('d-none');
      if (formFields)  formFields.classList.remove('d-none');
    });
  }


  /* ── 6i. Admin viewer (?admin=1) ───────────────────────── */

  if (new URLSearchParams(window.location.search).get('admin') === '1') renderAdminPanel();


  /* ============================================================
     ADMIN PANEL — defined outside form guard so it can run on
     any page with ?admin=1 if needed.
  ============================================================ */
  function renderAdminPanel() {
    var submissions = loadSubmissions();

    var rows = submissions.length
      ? submissions.map(function (s, i) {
          return '<tr>'
            + td('#' + (i + 1), '#777')
            + td(s.submittedAt)
            + td(s.name, '#fff')
            + '<td style="' + cell + '"><a href="mailto:' + esc(s.email) + '" style="color:#84c02a">' + esc(s.email) + '</a></td>'
            + '<td style="' + cell + '"><a href="tel:'    + esc(s.phone) + '" style="color:#84c02a">' + esc(s.phone) + '</a></td>'
            + td(s.service)
            + '<td style="' + cell + 'max-width:260px;white-space:pre-wrap;word-break:break-word">' + esc(s.message) + '</td>'
            + '</tr>';
        }).join('')
      : '<tr><td colspan="7" style="padding:2rem;text-align:center;color:#555">No submissions yet.</td></tr>';

    var panel = document.createElement('div');
    panel.id  = 'adminPanel';
    panel.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:9999;overflow-y:auto;padding:2rem';

    panel.innerHTML = ''
      + '<div style="max-width:1160px;margin:0 auto;background:#111;border-radius:14px;padding:2rem;font-family:Poppins,sans-serif">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:12px">'
      + '<h2 style="color:#fff;font-size:1.1rem;margin:0">'
      + '<i class="fas fa-inbox" style="color:#84c02a;margin-right:8px"></i>'
      + 'Jostas — Submissions&nbsp;<span style="color:#444;font-weight:300">(' + submissions.length + ')</span>'
      + '</h2>'
      + '<div style="display:flex;gap:8px">'
      + '<button id="adminExport" style="background:#84c02a;color:#fff;border:none;padding:7px 14px;border-radius:4px;cursor:pointer;font-size:0.75rem">Export CSV</button>'
      + '<button id="adminClear"  style="background:#c0552a;color:#fff;border:none;padding:7px 14px;border-radius:4px;cursor:pointer;font-size:0.75rem">Clear All</button>'
      + '<button id="adminClose"  style="background:#2a2a2a;color:#aaa;border:1px solid #333;padding:7px 14px;border-radius:4px;cursor:pointer;font-size:0.75rem">✕ Close</button>'
      + '</div></div>'
      + '<div style="overflow-x:auto">'
      + '<table style="width:100%;border-collapse:collapse;font-size:0.8rem;color:#bbb">'
      + '<thead><tr style="border-bottom:2px solid #222">'
      + ['#','Date','Name','Email','Phone','Service','Message'].map(function (h) {
          return '<th style="padding:10px 14px;color:#84c02a;font-weight:600;text-align:left;white-space:nowrap">' + h + '</th>';
        }).join('')
      + '</tr></thead>'
      + '<tbody style="border-top:1px solid #222">' + rows + '</tbody>'
      + '</table></div></div>';

    document.body.appendChild(panel);

    document.getElementById('adminClose').addEventListener('click', function () { panel.remove(); });

    document.getElementById('adminClear').addEventListener('click', function () {
      if (confirm('Delete all ' + submissions.length + ' submission(s)? Cannot be undone.')) {
        localStorage.removeItem(STORAGE_KEY);
        panel.remove();
        renderAdminPanel();
      }
    });

    document.getElementById('adminExport').addEventListener('click', function () { exportCSV(submissions); });
  }

  var cell = 'padding:10px 14px;border-bottom:1px solid #1e1e1e;';

  function td(val, color) {
    return '<td style="' + cell + (color ? 'color:' + color + ';' : '') + '">' + esc(val) + '</td>';
  }

  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function exportCSV(data) {
    if (!data.length) return;
    var headers = ['#','Date','Name','Email','Phone','Service','Message'];
    var rows    = data.map(function (s, i) {
      return [i+1, s.submittedAt, s.name, s.email, s.phone, s.service, '"' + (s.message||'').replace(/"/g,'""') + '"'].join(',');
    });
    var blob = new Blob([[headers.join(',')].concat(rows).join('\n')], { type:'text/csv;charset=utf-8;' });
    var a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'jostas_submissions_' + new Date().toISOString().slice(0,10) + '.csv' });
    a.click(); URL.revokeObjectURL(a.href);
  }

}); // end DOMContentLoaded


/* =============================================================
   EXTRA CSS injected by JS
   Keeps everything in one file — no extra <style> tag needed.
   Covers: navbar scroll-shrink, nav link hover pill,
   input focus glow, label colour on focus.
============================================================= */
(function () {
  var s = document.createElement('style');
  s.textContent = [

    /* Navbar shrinks after scrolling */
    '.navbar { transition: padding .3s ease, box-shadow .3s ease; }',
    '.navbar.scrolled { padding-top:.55rem!important; padding-bottom:.55rem!important; box-shadow:0 2px 18px rgba(0,0,0,.09); }',

    /* Nav link hover — subtle pill background + keeps underline from styles.css */
    '.nav-link { border-radius:4px; transition: color .25s ease, background-color .2s ease, padding .2s ease; }',
    '.nav-link:hover  { background-color:rgba(192,85,42,.07); padding-left:.55rem!important; padding-right:.55rem!important; }',
    '.nav-link.active { background-color:rgba(192,85,42,.09); padding-left:.55rem!important; padding-right:.55rem!important; }',

    /* Input focus glow (JS adds .input-active) */
    '.contact-form-input.input-active {',
    '  border-color: var(--color-cta) !important;',
    '  box-shadow: 0 0 0 4px rgba(192,85,42,.13) !important;',
    '  transform: translateY(-1px);',
    '  transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease !important;',
    '}',

    /* Label turns brand colour when its field is focused (JS adds .label-active) */
    '.contact-form-label.label-active {',
    '  color: var(--color-cta) !important;',
    '  transition: color .2s ease;',
    '}',

  ].join('\n');
  document.head.appendChild(s);
}());