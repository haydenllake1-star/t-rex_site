async function fetchCars() {
  const res = await fetch('./data/cars.json', { cache: 'no-store' });
  return await res.json();
}
function carCard(c) {
  return `
    <a class="card" href="./car.html?id=${encodeURIComponent(c.id)}" style="text-decoration:none;color:inherit">
      <img src="${c.photos[0]}" alt="${c.year} ${c.make} ${c.model}" style="width:100%;height:180px;object-fit:cover;border-radius:10px;border:1px solid var(--border)">
      <h4>${c.year} ${c.make} ${c.model}${c.trim ? ' ' + c.trim : ''}</h4>
      <div class="price">$${c.price.toLocaleString()}</div>
      <p>${(c.mileage).toLocaleString()} mi • ${c.body || ''} ${c.transmission ? '• ' + c.transmission : ''}</p>
      <p style="margin-top:6px;color:var(--muted)">${c.notes || ''}</p>
    </a>
  `;
}
function passesFilters(c, q, maxPrice) {
  const hay = `${c.year} ${c.make} ${c.model} ${c.trim||''} ${c.body||''} ${c.transmission||''} ${c.notes||''}`.toLowerCase();
  const okQ = q ? hay.includes(q.toLowerCase()) : true;
  const okPrice = maxPrice ? +c.price <= +maxPrice : true;
  return okQ && okPrice;
}
async function renderInventory() {
  const grid = document.getElementById('inventory-grid');
  const q = document.getElementById('q').value.trim();
  const maxPrice = document.getElementById('maxPrice').value;
  const cars = await fetchCars();
  const filtered = cars.filter(c => passesFilters(c, q, maxPrice));
  grid.innerHTML = filtered.map(carCard).join('') || '<p class="muted">No cars match your filters.</p>';
}
function applyFilters() { renderInventory(); }
document.addEventListener('DOMContentLoaded', renderInventory);
