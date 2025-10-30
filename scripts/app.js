/* Navigation */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
}

/* Footer Year */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Toast helper */
const toastEl = document.getElementById('toast');
function showToast(message, type) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.style.borderColor = type === 'success' ? 'rgba(34,197,94,0.45)' : type === 'danger' ? 'rgba(239,68,68,0.45)' : 'rgba(255,255,255,0.12)';
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2600);
}

/* Newsletter */
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Subscribed successfully!', 'success');
    newsletterForm.reset();
  });
}

/* Quick Search redirect */
const quickSearch = document.getElementById('quickSearch');
if (quickSearch) {
  quickSearch.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(quickSearch);
    const q = encodeURIComponent(form.get('q') || '');
    const type = encodeURIComponent(form.get('type'));
    const price = encodeURIComponent(form.get('price'));
    window.location.href = `properties.html?q=${q}&type=${type}&price=${price}`;
  });
}

/* Storage helpers */
const storage = {
  get(key, fallback) { try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; } },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
};
const favKey = 'pe_favorites';
function getFavs() { return new Set(storage.get(favKey, [])); }
function setFavs(set) { storage.set(favKey, [...set]); updateFavBadge(); }
function updateFavBadge() { const c = document.getElementById('favCount'); if (c) c.textContent = String(getFavs().size); }

/* Auth UI */
function getUser(){ try{ return JSON.parse(localStorage.getItem('pe_user')||'null'); }catch{return null;} }
function renderAuthSlot(){ const slot=document.getElementById('authSlot'); if(!slot) return; const u=getUser(); if(u){ slot.innerHTML = `<span class="nav-user" style="display:inline-flex;align-items:center;gap:.45rem;">
  <span style="opacity:.9;">Hi, ${u.name||u.email}</span>
  <button class="btn btn-sm btn-ghost" id="btnSignOut"><i class="fa-solid fa-right-from-bracket"></i> Sign Out</button>
</span>`; document.getElementById('btnSignOut')?.addEventListener('click', ()=>{ localStorage.removeItem('pe_user'); showToast('Signed out','success'); setTimeout(()=> location.reload(), 400); }); }
else { slot.innerHTML = `<a href="auth.html" class="btn btn-sm btn-ghost"><i class="fa-regular fa-user"></i> Sign In</a>`; } }
renderAuthSlot();

/* Currency */
const INR_FMT0 = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const INR_FMT2 = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

/* Featured cards (demo data) */
const featuredGrid = document.getElementById('featuredGrid');
if (featuredGrid) {
  const listings = [
    { id: 1, title: 'Modern Family House', city: 'San Francisco', price: 1250000, beds: 4, baths: 3, area: 2200, img: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?q=80&w=2070&auto=format&fit=crop' },
    { id: 2, title: 'Luxury Downtown Condo', city: 'New York', price: 980000, beds: 2, baths: 2, area: 1200, img: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=2070&auto=format&fit=crop' },
    { id: 3, title: 'Beachfront Villa', city: 'Miami', price: 2450000, beds: 5, baths: 4, area: 3500, img: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?q=80&w=2070&auto=format&fit=crop' },
    { id: 4, title: 'Cozy Suburban Home', city: 'Seattle', price: 650000, beds: 3, baths: 2, area: 1650, img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2069&auto=format&fit=crop' }
  ];
  const fmt = (n) => INR_FMT0.format(n);
  featuredGrid.innerHTML = listings.map(l => `
    <article class="card">
      <div class="card-media">
        <img src="${l.img}" alt="${l.title}">
        <div class="card-badge">${l.city}</div>
      </div>
      <div class="card-body">
        <div class="price">${fmt(l.price)}</div>
        <h3>${l.title}</h3>
        <div class="meta"><span><i class="fa-solid fa-bed"></i> ${l.beds} bd</span><span><i class="fa-solid fa-bath"></i> ${l.baths} ba</span><span><i class="fa-solid fa-vector-square"></i> ${l.area} sqft</span></div>
        <div class="card-actions">
          <a class="btn btn-sm" href="property.html?id=${l.id}"><i class="fa-regular fa-eye"></i> View</a>
          <button class="btn btn-sm btn-ghost" data-like="${l.id}"><i class="fa-regular fa-heart"></i> Save</button>
        </div>
      </div>
    </article>
  `).join('');
  featuredGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-like]');
    if (btn) { const id = Number(btn.getAttribute('data-like')); const s = getFavs(); s.add(id); setFavs(s); showToast('Saved to favorites', 'success'); }
  });
}

/* Properties page logic */
const propsGrid = document.getElementById('propertiesGrid');
if (propsGrid) {
  const params = new URLSearchParams(window.location.search);
  const q = (params.get('q') || '').toLowerCase();
  const type = params.get('type');
  const price = params.get('price');
  const all = [
    { id: 1, title: 'Modern Family House', city: 'San Francisco', type: 'House', price: 1250000, beds: 4, baths: 3, area: 2200, img: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?q=80&w=2070&auto=format&fit=crop' },
    { id: 2, title: 'Luxury Downtown Condo', city: 'New York', type: 'Condo', price: 980000, beds: 2, baths: 2, area: 1200, img: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=2070&auto=format&fit=crop' },
    { id: 3, title: 'Beachfront Villa', city: 'Miami', type: 'Villa', price: 2450000, beds: 5, baths: 4, area: 3500, img: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?q=80&w=2070&auto=format&fit=crop' },
    { id: 4, title: 'Cozy Suburban Home', city: 'Seattle', type: 'House', price: 650000, beds: 3, baths: 2, area: 1650, img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2069&auto=format&fit=crop' },
    { id: 5, title: 'City Apartment', city: 'Chicago', type: 'Apartment', price: 520000, beds: 2, baths: 1, area: 980, img: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2070&auto=format&fit=crop' },
    { id: 6, title: 'Lakeview Cottage', city: 'Denver', type: 'House', price: 780000, beds: 3, baths: 2, area: 1500, img: 'https://images.unsplash.com/photo-1622015663319-1117e81f8a88?q=80&w=2070&auto=format&fit=crop' }
  ];
  const inPriceRange = (p, range) => {
    if (!range || range === 'any') return true;
    if (range.endsWith('+')) return p >= parseInt(range);
    const [min, max] = range.split('-').map(Number); return p >= min && p <= max;
  };
  let filtered = all.filter(x =>
    (!q || x.title.toLowerCase().includes(q) || x.city.toLowerCase().includes(q)) &&
    (!type || type === 'any' || x.type === type) &&
    inPriceRange(x.price, price)
  );
  const sort = (new URLSearchParams(window.location.search).get('sort')) || 'relevance';
  const sorters = {
    'price-asc': (a,b)=>a.price-b.price,
    'price-desc': (a,b)=>b.price-a.price,
    'beds-desc': (a,b)=>b.beds-a.beds
  };
  if (sorters[sort]) filtered = filtered.slice().sort(sorters[sort]);

  // pagination
  let page = Number(new URLSearchParams(window.location.search).get('page')||'1');
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  page = Math.min(Math.max(1, page), totalPages);
  const start = (page-1)*pageSize; const pageItems = filtered.slice(start, start+pageSize);
  const fmt = (n) => INR_FMT0.format(n);
  // skeletons while rendering
  propsGrid.innerHTML = Array.from({length: Math.min(pageItems.length || 6, 6)}).map(()=>`
    <article class="card skeleton">
      <div class="card-media"></div>
      <div class="card-body"><div></div><div></div><div></div></div>
    </article>`).join('');
  setTimeout(()=>{ propsGrid.innerHTML = pageItems.map(l => `
    <article class="card">
      <div class="card-media">
        <img src="${l.img}" alt="${l.title}">
        <div class="card-badge">${l.city}</div>
      </div>
      <div class="card-body">
        <div class="price">${fmt(l.price)}</div>
        <h3>${l.title}</h3>
        <div class="meta"><span><i class="fa-solid fa-bed"></i> ${l.beds} bd</span><span><i class="fa-solid fa-bath"></i> ${l.baths} ba</span><span><i class="fa-solid fa-vector-square"></i> ${l.area} sqft</span></div>
        <div class="card-actions">
          <a class="btn btn-sm" href="property.html?id=${l.id}"><i class="fa-regular fa-eye"></i> View</a>
          <button class="btn btn-sm btn-ghost" data-like="${l.id}"><i class="fa-regular fa-heart"></i> Save</button>
        </div>
      </div>
    </article>
  `).join(''); }, 250);
  propsGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-like]');
    if (btn) { const id = Number(btn.getAttribute('data-like')); const s = getFavs(); s.add(id); setFavs(s); showToast('Saved to favorites', 'success'); }
  });
  const pageInfo = document.getElementById('pageInfo'); const prev = document.getElementById('prevPage'); const next = document.getElementById('nextPage');
  if (pageInfo) pageInfo.textContent = `Page ${page} / ${totalPages}`;
  const updatePage = (p)=>{ const u = new URL(window.location.href); u.searchParams.set('page', p); window.location.href = u.toString(); };
  prev?.addEventListener('click', ()=> page>1 && updatePage(page-1));
  next?.addEventListener('click', ()=> page<totalPages && updatePage(page+1));
}

/* Property detail */
const detailRoot = document.getElementById('propertyDetail');
if (detailRoot) {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id') || '1');
  const db = {
    1: { title: 'Modern Family House', city: 'San Francisco', price: 1250000, beds: 4, baths: 3, area: 2200, desc: 'Beautifully designed modern home with open floor plan, close to parks and cafes.', images: [
      'https://images.unsplash.com/photo-1576941089067-2de3c901e126?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2069&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=2070&auto=format&fit=crop'
    ] },
    2: { title: 'Luxury Downtown Condo', city: 'New York', price: 980000, beds: 2, baths: 2, area: 1200, desc: 'High-rise condo with skyline views and concierge amenities.', images: [
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=2070&auto=format&fit=crop'
    ] }
  };
  const data = db[id] || db[1];
  const fmt = (n) => INR_FMT0.format(n);
  detailRoot.innerHTML = `
    <div class="container">
      <div class="section-head"><h2>${data.title}</h2><div class="price">${fmt(data.price)}</div></div>
      <div class="gallery" id="gallery">
        ${data.images.map((src, i) => `<img class="gimg ${i===0?'active':''}" src="${src}" alt="${data.title} image ${i+1}">`).join('')}
      </div>
      <div class="meta" style="margin:.7rem 0 1rem;">
        <span><i class="fa-solid fa-location-dot"></i> ${data.city}</span>
        <span><i class="fa-solid fa-bed"></i> ${data.beds} bd</span>
        <span><i class="fa-solid fa-bath"></i> ${data.baths} ba</span>
        <span><i class="fa-solid fa-vector-square"></i> ${data.area} sqft</span>
      </div>
      <p style="color:var(--muted)">${data.desc}</p>
      <div class="card-actions" style="margin-top:1rem;">
        <button class="btn" id="btnSchedule"><i class="fa-regular fa-calendar"></i> Schedule a Visit</button>
        <button class="btn btn-ghost" id="btnShare"><i class="fa-solid fa-share-nodes"></i> Share</button>
      </div>
    </div>
    <div class="visit-modal hidden" id="visitModal">
      <div class="visit-card">
        <h3>Schedule a Visit</h3>
        <form id="visitForm" class="visit-form">
          <input type="text" name="name" placeholder="Your name" required>
          <input type="email" name="email" placeholder="Your email" required>
          <input type="date" name="date" required>
          <button class="btn" type="submit">Request</button>
          <button class="btn btn-ghost" type="button" id="btnCloseVisit">Cancel</button>
        </form>
      </div>
    </div>
  `;
  const gallery = document.getElementById('gallery');
  if (gallery) {
    gallery.addEventListener('click', (e) => {
      const img = e.target.closest('.gimg');
      if (!img) return;
      gallery.querySelectorAll('.gimg').forEach(n => n.classList.remove('active'));
      img.classList.add('active');
    });
  }
  const visitModal = document.getElementById('visitModal');
  const btnSchedule = document.getElementById('btnSchedule');
  const btnCloseVisit = document.getElementById('btnCloseVisit');
  const visitForm = document.getElementById('visitForm');
  btnSchedule?.addEventListener('click', () => visitModal.classList.remove('hidden'));
  btnCloseVisit?.addEventListener('click', () => visitModal.classList.add('hidden'));
  visitForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    visitModal.classList.add('hidden');
    showToast('Visit requested! We will contact you shortly.', 'success');
  });
  // update breadcrumb title
  const crumb = document.getElementById('propBreadcrumb');
  if (crumb) {
    const last = crumb.querySelector('span[aria-current="page"]');
    if (last) last.textContent = data.title;
  }
}

/* Detail page styles via JS-injected CSS classes */
const style = document.createElement('style');
style.textContent = `
  .gallery { display:grid; grid-template-columns: 2fr 1fr 1fr; gap:.6rem; }
  .gallery img { width:100%; height:220px; object-fit:cover; border-radius:.6rem; border:1px solid rgba(255,255,255,0.08); opacity:.85; cursor:pointer; }
  .gallery img.active { grid-column: 1 / -1; height: 360px; opacity:1; }
  .visit-modal { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:grid; place-items:center; }
  .visit-card { width:min(520px, 90%); background:var(--card); border:1px solid rgba(255,255,255,0.12); border-radius:.9rem; padding:1rem; }
  .visit-form { display:grid; gap:.6rem; }
  .visit-form input { padding:.7rem .9rem; border-radius:.6rem; border:1px solid rgba(255,255,255,0.12); background: rgba(10,16,28,0.8); color: var(--text); }
`;
document.head.appendChild(style);

/* Dashboard table actions */
const tableRoot = document.getElementById('dashboardTable');
if (tableRoot) {
  const u = getUser();
  if (!u) { showToast('Please sign in to access dashboard', 'danger'); setTimeout(()=> location.href='auth.html', 600); }
  tableRoot.addEventListener('click', (e) => {
    const del = e.target.closest('[data-del]');
    const edit = e.target.closest('[data-edit]');
    if (del) showToast('Listing archived', 'danger');
    if (edit) showToast('Edit action clicked', 'success');
  });
}

/* Favorites Modal + badge init */
updateFavBadge();
const btnFavorites = document.getElementById('btnFavorites');
const favModal = document.getElementById('favoritesModal');
const favClose = document.getElementById('favClose');
const favGrid = document.getElementById('favGrid');
btnFavorites?.addEventListener('click', (e)=>{ e.preventDefault(); const ids = getFavs(); if (favGrid) {
  const dataMap = {
    1: { title:'Modern Family House', city:'San Francisco', price:1250000, img:'https://images.unsplash.com/photo-1576941089067-2de3c901e126?q=80&w=2070&auto=format&fit=crop' },
    2: { title:'Luxury Downtown Condo', city:'New York', price:980000, img:'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=2070&auto=format&fit=crop' },
    3: { title:'Beachfront Villa', city:'Miami', price:2450000, img:'https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?q=80&w=2070&auto=format&fit=crop' },
    4: { title:'Cozy Suburban Home', city:'Seattle', price:650000, img:'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2069&auto=format&fit=crop' }
  };
  const fmt = (n)=>`$${n.toLocaleString()}`;
  favGrid.innerHTML = [...ids].map(id=>({id, ...dataMap[id]})).filter(x=>x.title).map(l=>`
    <article class="card">
      <div class="card-media"><img src="${l.img}" alt="${l.title}"><div class="card-badge">${l.city}</div></div>
      <div class="card-body"><div class="price">${fmt(l.price)}</div><h3>${l.title}</h3>
        <div class="card-actions">
          <a class="btn btn-sm" href="property.html?id=${l.id}"><i class="fa-regular fa-eye"></i> View</a>
          <button class="btn btn-sm btn-ghost" data-unlike="${l.id}"><i class="fa-solid fa-xmark"></i> Remove</button>
        </div>
      </div>
    </article>`).join('') || '<p style="color:var(--muted)">No favorites yet.</p>';
}
favModal?.classList.remove('hidden'); });
favClose?.addEventListener('click', ()=> favModal.classList.add('hidden'));
favGrid?.addEventListener('click', (e)=>{ const btn = e.target.closest('[data-unlike]'); if (!btn) return; const id = Number(btn.getAttribute('data-unlike')); const s = getFavs(); s.delete(id); setFavs(s); btn.closest('.card').remove(); });

/* Testimonials carousel */
const slides = document.querySelectorAll('#testimonials .slide');
if (slides.length) {
  let idx = 0; setInterval(()=>{ slides[idx].classList.remove('active'); idx = (idx+1)%slides.length; slides[idx].classList.add('active'); }, 3500);
}

/* Scroll to top */
let topBtn = document.querySelector('.scroll-top');
if (!topBtn) {
  topBtn = document.createElement('button');
  topBtn.className = 'scroll-top'; topBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  document.body.appendChild(topBtn);
}
window.addEventListener('scroll', ()=>{ if (window.scrollY > 320) topBtn.classList.add('show'); else topBtn.classList.remove('show'); });
topBtn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

/* Mortgage calculator */
const mForm = document.getElementById('mortgageForm');
if (mForm) {
  const out = document.getElementById('mResult');
  mForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const P = Number(document.getElementById('mPrice').value) - Number(document.getElementById('mDown').value);
    const r = Number(document.getElementById('mRate').value)/100/12;
    const n = Number(document.getElementById('mYears').value)*12;
    if (P<=0 || r<=0 || n<=0) { out.textContent = 'Please enter valid numbers.'; return; }
    const m = P * (r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
    out.textContent = `Estimated monthly payment: ${INR_FMT0.format(m)}`;
  });
}


