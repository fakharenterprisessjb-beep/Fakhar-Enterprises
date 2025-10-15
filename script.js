// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Footer year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Cookie notice (on Home)
const cookieStrip = document.getElementById('cookieStrip');
const cookieOk = document.getElementById('cookieOk');
if (cookieStrip && cookieOk) {
  const KEY = 'fe_cookie_ok_v1';
  if (localStorage.getItem(KEY)) cookieStrip.style.display = 'none';
  cookieOk.addEventListener('click', () => {
    localStorage.setItem(KEY, '1');
    cookieStrip.style.display = 'none';
  });
}

// Contact form → mailto
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const msg = document.getElementById('message').value.trim();
    const to = 'contact@inphoenixaviation.com';
    const subject = encodeURIComponent(`Website inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });
}