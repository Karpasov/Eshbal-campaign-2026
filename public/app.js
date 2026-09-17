(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('motion');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  }

  const progress = document.querySelector('.reading-progress');
  let ticking = false;
  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, window.scrollY / max * 100) : 0}%`;
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; } }, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  function closeMenu() { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation'); mobileNav.hidden = true; }
  toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') === 'true'; toggle.setAttribute('aria-expanded', String(!open)); toggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation'); mobileNav.hidden = open; });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); toggle.focus(); } });
  window.matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function chooseRoom(index, focus = false) {
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; document.getElementById(tab.getAttribute('aria-controls')).hidden = i !== index; });
    const visual = document.querySelector('.room-visual');
    visual.dataset.mode = index === 0 ? 'daily' : 'safe';
    document.getElementById('room-core-title').innerHTML = index === 0 ? 'Room to<br><em>learn.</em>' : 'Room to<br><em>feel safe.</em>';
    document.querySelector('.orbit-top').textContent = index === 0 ? 'CARE' : 'SAFETY';
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => chooseRoom(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = 1 - index;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = 1;
      if (next !== undefined) { event.preventDefault(); chooseRoom(next, true); }
    });
  });

  const form = document.getElementById('gift-form');
  const custom = document.getElementById('custom-amount');
  const error = document.getElementById('gift-error');
  const submit = document.querySelector('.gift-discuss');
  const money = (value, decimals = 0) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
  let selectedAmount = 2500;
  function giftState() {
    const amount = custom.value !== '' ? Number(custom.value) : selectedAmount;
    const years = Number(form.querySelector('input[name="years"]:checked').value);
    const valid = !custom.validity.badInput && Number.isFinite(amount) && Number.isInteger(amount) && amount >= 1 && amount <= 10000000;
    return { amount, years, valid };
  }
  function updateGift() {
    const { amount, years, valid } = giftState();
    error.hidden = valid; custom.setAttribute('aria-invalid', String(!valid)); submit.disabled = !valid;
    if (!valid) { document.getElementById('gift-per-year').textContent = 'Choose an amount'; document.getElementById('gift-total').textContent = ''; return; }
    let tier = 'Friend of the Center';
    let impact = 'Be part of a caring community supporting young people, dogs and horses.';
    if (amount >= 100000) { tier = 'Transformational Partner'; impact = 'Help anchor the center’s future. Ask us about a major partnership and the limited naming opportunities.'; }
    else if (amount >= 50000) { tier = 'Leadership Partner'; impact = 'Help create momentum for the protected space and a sustainable future for the whole center.'; }
    else if (amount >= 25000) { tier = 'Founding Partner'; impact = 'Join the founding circle helping establish a safe, permanent foundation for the center’s next chapter.'; }
    else if (amount >= 10000) { tier = 'Builder'; impact = 'Help bring the protected space and the center’s educational vision closer to reality.'; }
    else if (amount >= 2500) { tier = 'Sustaining Partner'; impact = 'Help sustain the programs, equipment and daily care that make connection possible.'; }
    document.getElementById('gift-tier').textContent = tier;
    const value = document.getElementById('gift-per-year');
    value.replaceChildren(document.createTextNode(money(amount / years, years > 1 ? 2 : 0)));
    const suffix = document.createElement('small'); suffix.textContent = years > 1 ? ' / year' : ' total'; value.append(suffix);
    document.getElementById('gift-total').textContent = years > 1 ? `${money(amount)} total commitment over ${years} years` : 'A single gift toward the campaign';
    document.getElementById('gift-impact').textContent = impact;
  }
  form.querySelectorAll('input[name="gift"]').forEach(input => input.addEventListener('change', () => { selectedAmount = Number(input.value); custom.value = ''; updateGift(); }));
  custom.addEventListener('input', () => { form.querySelectorAll('input[name="gift"]').forEach(input => input.checked = custom.value === '' && Number(input.value) === selectedAmount); updateGift(); });
  form.querySelectorAll('input[name="years"]').forEach(input => input.addEventListener('change', updateGift));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const { amount, years, valid } = giftState();
    if (!valid) { updateGift(); custom.focus(); return; }
    const subject = 'A Safe Place to Grow — gift conversation';
    const body = `Hi Gilad,\n\nI would like to discuss supporting the Eshbal Center for Human–Animal Connection.\n\nTotal gift I am considering: ${money(amount)} USD\nPayment preference: ${years === 1 ? 'One gift' : `Over ${years} years (approximately ${money(amount / years, 2)} per year)`}\n\nPlease help me confirm the giving route, receipt arrangements and next steps.\n\nMy name:\nMy country:\nPreferred way to connect:\n\nThank you!`;
    window.location.href = `mailto:gilad@drorisrael.org.il?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
  updateGift();
  if (document.modelContext?.registerTool) {
    const lifecycle = new AbortController();
    window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
    try {
      Promise.resolve(document.modelContext.registerTool({
        name: 'configure_gift_estimate',
        title: 'Explore an Eshbal campaign gift',
        description: 'Set the visible gift calculator in USD and return an illustrative annual amount. Does not submit a pledge, send email or make a payment.',
        inputSchema: { type: 'object', properties: { amount: { type: 'integer', minimum: 1, maximum: 10000000 }, years: { type: 'integer', enum: [1, 3] } }, required: ['amount', 'years'], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          if (!input || !Number.isInteger(input.amount) || input.amount < 1 || input.amount > 10000000 || ![1, 3].includes(input.years) || Object.keys(input).some(key => !['amount', 'years'].includes(key))) throw new Error('Provide a whole-dollar amount from 1 to 10000000 and a payment period of 1 or 3 years.');
          custom.value = String(input.amount);
          document.getElementById('gift-planner').open = true;
          form.querySelectorAll('input[name="gift"]').forEach(radio => radio.checked = false);
          form.querySelectorAll('input[name="years"]').forEach(radio => radio.checked = Number(radio.value) === input.years);
          updateGift();
          return { totalUSD: input.amount, years: input.years, approximateAnnualUSD: Math.round(input.amount / input.years * 100) / 100, partnership: document.getElementById('gift-tier').textContent, pledgeSubmitted: false };
        }
      }, { signal: lifecycle.signal })).catch(() => {});
    } catch { /* The website remains fully usable without optional agent tools. */ }
  }
})();
