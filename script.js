/**
 * Cara Prince — Platform Interactions & Logic
 * Community · Clarity · Progress
 */

document.addEventListener('DOMContentLoaded', () => {
  initLondonClock();
  initMobileNav();
  initServicePillSelectors();
  initContactForm();
  initCopyright();
  handleUrlPreselection();
});

/**
 * 1. Accurate Live London Time (GMT / BST)
 */
function initLondonClock() {
  const clockEl = document.getElementById('londonClock');
  if (!clockEl) return;

  function update() {
    try {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now);

      const tzStr = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        timeZoneName: 'short'
      }).formatToParts(now).find(p => p.type === 'timeZoneName')?.value || 'GMT';

      clockEl.textContent = `${timeStr} ${tzStr} · London, UK`;
    } catch (e) {
      const fallback = new Date().toTimeString().split(' ')[0];
      clockEl.textContent = `${fallback} GMT · London, UK`;
    }
  }

  update();
  setInterval(update, 1000);
}

/**
 * 2. Mobile Drawer Navigation
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileNavDrawer');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isVisible = drawer.style.display === 'flex';
    if (isVisible) {
      drawer.style.display = 'none';
      toggleBtn.textContent = 'Menu';
    } else {
      drawer.style.display = 'flex';
      toggleBtn.textContent = 'Close';
    }
  });
}

/**
 * 3. Interactive Service Checkbox Pills on Contact Form
 */
function initServicePillSelectors() {
  const pills = document.querySelectorAll('.service_pill_choice');
  pills.forEach(pill => {
    const checkbox = pill.querySelector('input[type="checkbox"]');
    if (!checkbox) return;

    pill.addEventListener('click', (e) => {
      // Toggle if clicked directly on pill
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }
      if (checkbox.checked) {
        pill.classList.add('is_checked');
      } else {
        pill.classList.remove('is_checked');
      }
    });

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        pill.classList.add('is_checked');
      } else {
        pill.classList.remove('is_checked');
      }
    });
  });
}

/**
 * 4. Pre-select Service via URL Parameter (e.g. contact.html?service=...)
 */
function handleUrlPreselection() {
  const urlParams = new URLSearchParams(window.location.search);
  const targetService = urlParams.get('service');
  if (!targetService) return;

  const decoded = decodeURIComponent(targetService).toLowerCase();
  const checkboxes = document.querySelectorAll('.service_pill_choice input[type="checkbox"]');

  checkboxes.forEach(cb => {
    if (cb.value.toLowerCase().includes(decoded) || decoded.includes(cb.value.toLowerCase())) {
      cb.checked = true;
      const parent = cb.closest('.service_pill_choice');
      if (parent) parent.classList.add('is_checked');
    }
  });
}

/**
 * 5. Proposal Form Handler with Feedback
 */
function initContactForm() {
  const form = document.getElementById('proposalContactForm');
  const feedback = document.getElementById('formFeedback');

  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstName')?.value || '';
    const lastName = document.getElementById('lastName')?.value || '';
    const fullName = (firstName + ' ' + lastName).trim() || 'Client';
    const orgInput = document.getElementById('orgName')?.value || 'your organisation';

    feedback.innerHTML = `
      <strong>Thanks, ${escapeHtml(firstName || fullName)}!</strong><br />
      I've received your note regarding <em>${escapeHtml(orgInput)}</em>. I read every submission myself and will get back to you within a day or two. If it feels like a fit, we'll set up a quick 20-minute call to chat through the details.
    `;
    feedback.classList.add('is_visible');
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const btn = form.querySelector('.btn_chic');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span>Brief Sent to Cara ✓</span>`;
      btn.style.backgroundColor = '#24415c';
      btn.style.borderColor = '#24415c';
    }
  });
}

/**
 * 6. Dynamic Year
 */
function initCopyright() {
  const yearEls = document.querySelectorAll('.dynamic_year');
  const current = new Date().getFullYear();
  yearEls.forEach(el => { el.textContent = current; });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}
