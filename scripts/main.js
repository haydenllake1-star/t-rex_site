async function fetchCars() {
  const res = await fetch('./data/cars.json', { cache: 'no-store' });
  const cars = await res.json();
  return cars;
}
function carCard(c) {
  return `
    <a class="card" href="./car.html?id=${encodeURIComponent(c.id)}" style="text-decoration:none;color:inherit">
      <img src="${c.photos[0]}" alt="${c.year} ${c.make} ${c.model}" style="width:100%;height:180px;object-fit:cover;border-radius:10px;border:1px solid var(--border)">
      <h4>${c.year} ${c.make} ${c.model}${c.trim ? ' ' + c.trim : ''}</h4>
      <div class="price">$${c.price.toLocaleString()}</div>
      <p>${(c.mileage).toLocaleString()} mi • ${c.body || ''} ${c.transmission ? '• ' + c.transmission : ''}</p>
    </a>
  `;
}
async function loadFeaturedCars() {
  const grid = document.getElementById('featured-cars');
  if (!grid) return;
  const cars = (await fetchCars()).slice(0,3);
  grid.innerHTML = cars.map(carCard).join('');
}
