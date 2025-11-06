async function fetchCars() {
  const res = await fetch('./data/cars.json', { cache: 'no-store' });
  return await res.json();
}
function param(name) { const url = new URL(window.location.href); return url.searchParams.get(name); }
function specRow(label, value) { return value ? `<tr><th>${label}</th><td>${value}</td></tr>` : ''; }
async function renderCar() {
  const id = param('id');
  const cars = await fetchCars();
  const c = cars.find(x => String(x.id) === String(id));
  if (!c) {
    document.getElementById('title').innerText = 'Vehicle not found';
    document.getElementById('gallery').innerHTML = '';
    return;
  }
  document.title = `${c.year} ${c.make} ${c.model} — Vehicle Details`;
  document.getElementById('title').innerText = `${c.year} ${c.make} ${c.model}${c.trim ? ' ' + c.trim : ''}`;
  document.getElementById('price').innerText = `$${c.price.toLocaleString()}`;
  document.getElementById('desc').innerText = c.description || '';
  const g = document.getElementById('gallery');
  g.innerHTML = c.photos.map(src => `<img src="${src}" style="width:100%;margin-bottom:10px;border-radius:10px;border:1px solid var(--border)" alt="Photo">`).join('');
  const specs = `
    <table class="table">
      ${specRow('Year', c.year)}
      ${specRow('Make', c.make)}
      ${specRow('Model', c.model)}
      ${specRow('Trim', c.trim)}
      ${specRow('Mileage', (c.mileage).toLocaleString() + ' mi')}
      ${specRow('Body', c.body)}
      ${specRow('Transmission', c.transmission)}
      ${specRow('VIN', c.vin)}
      ${specRow('Title', c.titleStatus)}
      ${specRow('MPG', c.mpg)}
      ${specRow('Color', c.color)}
      ${specRow('Drive', c.drive)}
      ${specRow('Features', (c.features||[]).join(', '))}
    </table>
  `;
  document.getElementById('specs').innerHTML = specs;

  // Optional structured data for SEO
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${c.year} ${c.make} ${c.model}`,
    "description": c.description || "Used vehicle",
    "sku": c.vin || c.id,
    "brand": c.make,
    "image": c.photos,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": c.price,
      "availability": "https://schema.org/InStock"
    }
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(ld);
  document.head.appendChild(script);
}
document.addEventListener('DOMContentLoaded', renderCar);
