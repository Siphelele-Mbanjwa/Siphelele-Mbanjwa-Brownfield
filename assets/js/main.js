/* ================================================================
   Jostas Painting Services — main.js  (v6 — definitive fix)
   ================================================================ */


/* ================================================================
   SECTION A — localStorage  (top-level, runs immediately)
================================================================ */

var STORAGE_KEY = 'jostas_submissions';

function loadSubmissions() {
  try   { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch (e) { return []; }
}

function saveSubmission(data) {
  var all = loadSubmissions();
  data.id          = Date.now();
  data.submittedAt = new Date().toLocaleString('en-ZA', {
    timeZone: 'Africa/Johannesburg',
    dateStyle: 'medium',
    timeStyle: 'short'
  });
  all.unshift(data);
  try   { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); }
  catch (e) { console.warn('localStorage full — submission not saved.'); }
}


/* ================================================================
   SECTION B — Admin panel
================================================================ */

function renderAdminPanel() {
  if (document.getElementById('jostas-admin')) return;

  var subs = loadSubmissions();
  var CELL = 'padding:10px 14px;border-bottom:1px solid #222;vertical-align:top;font-size:0.8rem;';

  function esc(s) {
    return String(s || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  var rows = subs.length
    ? subs.map(function (s, i) {
        return [
          '<tr>',
          '<td style="'+CELL+'color:#888">#'+(i+1)+'</td>',
          '<td style="'+CELL+'">'  +esc(s.submittedAt)+'</td>',
          '<td style="'+CELL+'color:#fff">'+esc(s.name)+'</td>',
          '<td style="'+CELL+'"><a href="mailto:'+esc(s.email)+'" style="color:#84c02a;text-decoration:none">'+esc(s.email)+'</a></td>',
          '<td style="'+CELL+'"><a href="tel:'+esc(s.phone)+'"    style="color:#84c02a;text-decoration:none">'+esc(s.phone)+'</a></td>',
          '<td style="'+CELL+'">'  +esc(s.service)+'</td>',
          '<td style="'+CELL+'max-width:220px;white-space:pre-wrap;word-break:break-word">'+esc(s.message)+'</td>',
          '</tr>'
        ].join('');
      }).join('')
    : '<tr><td colspan="7" style="padding:2rem;text-align:center;color:#555">No submissions yet.</td></tr>';

  var overlay = document.createElement('div');
  overlay.id  = 'jostas-admin';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:10000;overflow-y:auto;padding:2rem;font-family:Poppins,sans-serif';

  overlay.innerHTML = [
    '<div style="max-width:1200px;margin:0 auto;background:#111;border-radius:14px;padding:2rem">',

    /* header */
    '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:1.5rem">',
    '<h2 style="color:#fff;font-size:1rem;font-weight:600;margin:0">',
    '<i class="fas fa-inbox" style="color:#84c02a;margin-right:8px"></i>',
    'Jostas — Submissions <span style="color:#444;font-weight:300">('+subs.length+')</span>',
    '</h2>',
    '<div style="display:flex;gap:8px;flex-wrap:wrap">',
    '<button id="adm-export" style="background:#84c02a;color:#fff;border:none;padding:7px 14px;border-radius:4px;cursor:pointer;font-size:0.75rem;font-weight:600;font-family:inherit">Export CSV</button>',
    '<button id="adm-clear"  style="background:#c0552a;color:#fff;border:none;padding:7px 14px;border-radius:4px;cursor:pointer;font-size:0.75rem;font-weight:600;font-family:inherit">Clear All</button>',
    '<button id="adm-close"  style="background:#2a2a2a;color:#aaa;border:1px solid #333;padding:7px 14px;border-radius:4px;cursor:pointer;font-size:0.75rem;font-family:inherit">&#10005; Close</button>',
    '</div></div>',

    /* table */
    '<div style="overflow-x:auto">',
    '<table style="width:100%;border-collapse:collapse;color:#bbb;min-width:700px">',
    '<thead><tr style="border-bottom:2px solid #2a2a2a">',
    ['#','Date','Name','Email','Phone','Service','Message'].map(function(h){
      return '<th style="padding:10px 14px;color:#84c02a;font-weight:600;text-align:left;white-space:nowrap;font-size:0.8rem">'+h+'</th>';
    }).join(''),
    '</tr></thead>',
    '<tbody>'+rows+'</tbody>',
    '</table></div></div>'
  ].join('');

  document.body.appendChild(overlay);

  document.getElementById('adm-close').onclick  = function () { overlay.remove(); };
  document.getElementById('adm-export').onclick = function () { adminExportCSV(loadSubmissions()); };
  document.getElementById('adm-clear').onclick  = function () {
    var n = loadSubmissions().length;
    if (!n) { alert('Nothing to clear.'); return; }
    if (confirm('Delete all '+n+' submission(s)? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      overlay.remove();
      renderAdminPanel();
    }
  };
}

function adminExportCSV(data) {
  if (!data.length) { alert('No submissions to export.'); return; }
  var cols = ['#','Date','Name','Email','Phone','Service','Message'];
  var rows = data.map(function (s, i) {
    return [i+1, s.submittedAt, s.name, s.email, s.phone, s.service, s.message]
      .map(function (v) { return '"'+String(v||'').replace(/"/g,'""')+'"'; }).join(',');
  });
  var blob = new Blob([[cols.join(',')].concat(rows).join('\r\n')], { type:'text/csv;charset=utf-8;' });
  var a    = Object.assign(document.createElement('a'), {
    href:     URL.createObjectURL(blob),
    download: 'jostas_submissions_'+new Date().toISOString().slice(0,10)+'.csv'
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}


/* ================================================================
   SECTION C 
================================================================ */
(function injectCSS() {
  var s = document.createElement('style');
  s.textContent = [
    /* Shake animation */
    '@keyframes jostas-shake{',
    '0%,100%{transform:translateX(0)}',
    '20%{transform:translateX(-5px)}',
    '40%{transform:translateX(5px)}',
    '60%{transform:translateX(-3px)}',
    '80%{transform:translateX(3px)}}',
    '.jostas-shake{animation:jostas-shake .4s ease}',

    /* Lightbox */
    '#jostas-lb{position:fixed;inset:0;background:rgba(0,0,0,.93);z-index:11000;',
    'display:none;align-items:center;justify-content:center;',
    'opacity:0;transition:opacity .3s ease;cursor:zoom-out}',
    '#jostas-lb.lb-on{display:flex}',
    '#jostas-lb.lb-open{opacity:1}',
    '#jostas-lb img{max-width:92vw;max-height:88vh;border-radius:8px;object-fit:contain;',
    'box-shadow:0 24px 80px rgba(0,0,0,.7);transform:scale(.92);transition:transform .3s ease}',
    '#jostas-lb.lb-open img{transform:scale(1)}',
    '#jostas-lb-close{position:absolute;top:18px;right:22px;background:rgba(255,255,255,.1);',
    'border:1px solid rgba(255,255,255,.2);color:#fff;font-size:1.2rem;width:36px;height:36px;',
    'border-radius:50%;display:flex;align-items:center;justify-content:center;',
    'cursor:pointer;transition:background .2s;line-height:1}',
    '#jostas-lb-close:hover{background:rgba(255,255,255,.22)}',
    '#jostas-lb-cap{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);',
    'color:rgba(255,255,255,.5);font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;',
    'font-family:Poppins,sans-serif;pointer-events:none;white-space:nowrap}',
  ].join('');
  document.head.appendChild(s);
}());


/* ================================================================
   SECTION D — DOMContentLoaded
================================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* --------------------------------------------------------------
     D1. Footer year
  -------------------------------------------------------------- */
  document.querySelectorAll('#yr').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });


  /* --------------------------------------------------------------
     D2. Scroll-to-top
  -------------------------------------------------------------- */
  var scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    window.addEventListener('scroll', function () {
      scrollBtn.classList.toggle('show', window.scrollY > 300);
    }, { passive: true });
    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* --------------------------------------------------------------
     D3. Scroll reveal
  -------------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function (el) { ro.observe(el); });
  }


  /* --------------------------------------------------------------
     D4. Portfolio filter
  -------------------------------------------------------------- */
  var filterBtns     = document.querySelectorAll('.filter-btn');
  var portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterBtns.length && portfolioItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.getAttribute('data-filter');

        portfolioItems.forEach(function (item) {
          var match = f === 'all' || item.getAttribute('data-cat') === f;
          if (match) {
            item.classList.remove('hidden');
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                item.style.opacity   = '1';
                item.style.transform = 'translateY(0)';
              });
            });
          } else {
            item.style.opacity   = '0';
            item.style.transform = 'translateY(10px)';
            setTimeout(function () { item.classList.add('hidden'); }, 280);
          }
        });
      });
    });
  }


  /* --------------------------------------------------------------
     D5. Portfolio lightbox
  -------------------------------------------------------------- */
  if (portfolioItems.length) {
    var lb = document.createElement('div');
    lb.id  = 'jostas-lb';
    lb.innerHTML = '<button id="jostas-lb-close" aria-label="Close">&#10005;</button>'
                 + '<img id="jostas-lb-img" src="" alt="" />'
                 + '<div id="jostas-lb-cap"></div>';
    document.body.appendChild(lb);

    var lbImg = document.getElementById('jostas-lb-img');
    var lbCap = document.getElementById('jostas-lb-cap');

    function lbOpen(src, alt) {
      lbImg.src = src; lbImg.alt = alt || '';
      lbCap.textContent = alt || '';
      lb.classList.add('lb-on');
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { lb.classList.add('lb-open'); });
      });
    }
    function lbClose() {
      lb.classList.remove('lb-open');
      document.body.style.overflow = '';
      setTimeout(function () { lb.classList.remove('lb-on'); lbImg.src = ''; }, 300);
    }

    portfolioItems.forEach(function (item) {
      item.addEventListener('click', function () {
        if (item.classList.contains('hidden')) return;
        var img = item.querySelector('img');
        if (img) lbOpen(img.src, img.alt);
      });
    });
    document.getElementById('jostas-lb-close').addEventListener('click', function (e) {
      e.stopPropagation(); lbClose();
    });
    lb.addEventListener('click', function (e) { if (e.target === lb) lbClose(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('lb-open')) lbClose();
    });
  }


  /* --------------------------------------------------------------
     D6. Navbar active link + scroll-shrink
  -------------------------------------------------------------- */
  var navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  var page     = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(function (link) {
    var href   = (link.getAttribute('href') || '').split('/').pop();
    var isHome = (page === '' || page === 'index.html') && href === 'index.html';
    link.classList.toggle('active', isHome || (href !== '' && href === page));
  });

  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }


  /* --------------------------------------------------------------
     D7. Admin panel check (every page)
  -------------------------------------------------------------- */
  if (new URLSearchParams(window.location.search).get('admin') === '1') {
    renderAdminPanel();
  }


  /* ==============================================================
     D8. CONTACT FORM
  ============================================================== */

  var form        = document.getElementById('contactForm');
  var formFields  = document.getElementById('formFields');
  var formSuccess = document.getElementById('formSuccess');
  var submitBtn   = document.getElementById('submitFormBtn');
  var resetBtn    = document.getElementById('resetFormBtn');
  var messageEl   = document.getElementById('message');
  var charCount   = document.getElementById('charCount');

  if (!form) return; /* not on contact page */


  /* ── Helper: show/hide an error message ── */
  function showError(id, show) {
    var err = document.getElementById('err-' + id);
    if (err) err.style.display = show ? 'block' : 'none';
  }

  /* ── Helper: mark field valid ── */
  function markValid(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('is-invalid');
    el.classList.add('is-valid');
    showError(id, false);
  }

  /* ── Helper: mark field invalid + shake + show error ── */
  function markInvalid(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('is-valid');
    el.classList.add('is-invalid');
    /* restart shake */
    el.classList.remove('jostas-shake');
    void el.offsetWidth;
    el.classList.add('jostas-shake');
    showError(id, true);
  }

  /* ── Helper: clear field back to neutral ── */
  function clearField(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('is-valid', 'is-invalid', 'jostas-shake');
    showError(id, false);
  }


  /* ── Validators — each returns true/false ── */

  function checkName() {
    var v = document.getElementById('name').value.trim();
    if (v.length >= 2) { markValid('name');    return true; }
    markInvalid('name'); return false;
  }

  function checkEmail() {
    var v = document.getElementById('email').value.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { markValid('email');   return true; }
    markInvalid('email'); return false;
  }

  function checkPhone() {
    /* Strips spaces/hyphens so "071 234 5678" passes */
    var v = document.getElementById('phone').value.trim().replace(/[\s\-]/g, '');
    if (/^(\+27|0)[6-8][0-9]{8}$/.test(v)) { markValid('phone');   return true; }
    markInvalid('phone'); return false;
  }

  function checkService() {
    var v = document.getElementById('service').value;
    if (v !== '') { markValid('service');  return true; }
    markInvalid('service'); return false;
  }

  function checkMessage() {
    var v = document.getElementById('message').value.trim();
    if (v.length >= 10) { markValid('message'); return true; }
    markInvalid('message'); return false;
  }


  var CHECKS = {
    name: checkName, email: checkEmail,
    phone: checkPhone, service: checkService, message: checkMessage
  };

  Object.keys(CHECKS).forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    /* validate on blur */
    el.addEventListener('blur', CHECKS[id]);
    /* clear error as soon as user edits again */
    el.addEventListener(id === 'service' ? 'change' : 'input', function () {
      clearField(id);
    });
  });


  /* ── Character counter ── */
  if (messageEl && charCount) {
    messageEl.addEventListener('input', function () {
      if (messageEl.value.length > 500) messageEl.value = messageEl.value.slice(0, 500);
      var len = messageEl.value.length;
      charCount.textContent = len;
      charCount.style.color = len > 450 ? '#dc3545' : '';
    });
  }


  /* ── Submit button ── */
  if (submitBtn) {
    submitBtn.addEventListener('click', function () {

      /* Run all checks, collect results */
      var valid = [
        checkName(),
        checkEmail(),
        checkPhone(),
        checkService(),
        checkMessage()
      ].every(Boolean);

      if (!valid) {
        /* Scroll to and focus the first red field */
        var firstBad = form.querySelector('.is-invalid');
        if (firstBad) {
          firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstBad.focus();
        }
        return; /* stop — do not proceed */
      }

      /* All valid — save and show success */
      saveSubmission({
        name:    document.getElementById('name').value.trim(),
        email:   document.getElementById('email').value.trim(),
        phone:   document.getElementById('phone').value.trim(),
        service: document.getElementById('service').value,
        message: document.getElementById('message').value.trim()
      });

      submitBtn.disabled  = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending…';

      setTimeout(function () {
        formFields.style.display  = 'none';
        formSuccess.style.display = 'block';
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 1000);
    });
  }


  /* ── Reset button ── */
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      form.reset();
      Object.keys(CHECKS).forEach(clearField);
      if (charCount) { charCount.textContent = '0'; charCount.style.color = ''; }
      if (submitBtn) {
        submitBtn.disabled  = false;
        submitBtn.innerHTML = 'Send Message <i class="fas fa-arrow-right ms-2"></i>';
      }
      formSuccess.style.display = 'none';
      formFields.style.display  = 'block';
    });
  }

}); /* end DOMContentLoaded */