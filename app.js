const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

const toast = $('#toast');
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 4200);
}

const menuToggle = $('.menu-toggle');
const navLinks = $('.nav-links');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  $$('.nav-links a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));
}

const currentPage = location.pathname.split('/').pop() || 'index.html';
$$('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) link.classList.add('active');
});

const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 }) : null;
$$('[data-animate]').forEach(el => observer ? observer.observe(el) : el.classList.add('in-view'));

function setupFilter(groupSelector, cardSelector, attrName) {
  const group = $(groupSelector);
  if (!group) return;
  const buttons = $$('.filter-btn', group);
  const cards = $$(cardSelector);
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const value = button.dataset.filter;
      cards.forEach(card => {
        const match = value === 'all' || card.dataset[attrName] === value;
        card.style.display = match ? '' : 'none';
      });
    });
  });
}
setupFilter('[data-filter-group="services"]', '[data-service]', 'service');
setupFilter('[data-filter-group="projects"]', '[data-project]', 'project');

const calcForm = $('#savingsCalculator');
if (calcForm) {
  const updateCalc = () => {
    const bill = Number($('#monthlyBill')?.value || 0);
    const hours = Number($('#dailyHours')?.value || 0);
    const age = Number($('#systemAge')?.value || 1);
    const efficiency = age >= 10 ? 0.28 : age >= 6 ? 0.20 : 0.12;
    const yearly = Math.max(0, bill * 12 * efficiency);
    const downtime = Math.max(1, Math.round((hours * 30) * (age >= 8 ? 0.09 : 0.04)));
    const payback = yearly > 0 ? Math.max(3, Math.round((bill * 2.4) / (yearly / 12))) : 0;
    $('#annualSavings').textContent = `GH₵ ${yearly.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    $('#downtimeRisk').textContent = `${downtime} hrs`;
    $('#paybackMonths').textContent = `${payback} mo`;
  };
  calcForm.addEventListener('input', updateCalc);
  calcForm.addEventListener('submit', event => {
    event.preventDefault();
    updateCalc();
    showToast('Estimate updated. Book an audit for exact load calculations.');
  });
  updateCalc();
}

const modal = $('#quoteModal');
const quoteForm = $('#quoteForm');
function openModal() {
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  const firstInput = $('input, select, textarea, button', modal);
  firstInput?.focus();
}
function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}
$$('[data-open-quote]').forEach(button => button.addEventListener('click', openModal));
$$('[data-close-modal]').forEach(button => button.addEventListener('click', closeModal));
modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

if (quoteForm) {
  quoteForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(quoteForm);
    const lead = Object.fromEntries(formData.entries());
    lead.createdAt = new Date().toISOString();
    const leads = JSON.parse(localStorage.getItem('coldmanLeads') || '[]');
    leads.push(lead);
    localStorage.setItem('coldmanLeads', JSON.stringify(leads));
    quoteForm.reset();
    closeModal();
    showToast('Audit request captured. ColdMan will contact you shortly.');
  });
}

const quickAudit = $('#quickAudit');
if (quickAudit) {
  quickAudit.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(quickAudit);
    openModal();
    ['client_name', 'client_phone', 'service_type', 'location'].forEach(name => {
      const input = quoteForm?.elements[name];
      const value = data.get(name);
      if (input && value) input.value = value;
    });
    showToast('Your quick audit details have been added to the request form.');
  });
}

$$('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    item?.classList.toggle('open');
  });
});

const backTop = $('.back-top');
if (backTop) {
  window.addEventListener('scroll', () => backTop.classList.toggle('visible', window.scrollY > 500), { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

const contactForm = $('[data-contact-form]');
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    const requiredFields = $$('[required]', contactForm);
    const invalid = requiredFields.find(field => !field.value.trim());
    if (invalid) {
      event.preventDefault();
      invalid.focus();
      showToast('Please complete all required fields before submitting.');
    }
  });
}
