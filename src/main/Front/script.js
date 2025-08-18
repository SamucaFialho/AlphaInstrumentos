const apiUrl = "http://localhost:9000/api/products"; // ajustar se backend em outra porta

async function fetchProducts() {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    renderProducts(data);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    document.getElementById('products').innerHTML = '';
  }
}

function renderProducts(products) {
  const container = document.getElementById('products');
  container.innerHTML = products.map(p => productCard(p)).join('');
  attachBuyButtons();
}

function productCard(p) {
  const img = p.imageUrl || 'images/product-placeholder.jpg';
  return `
  <div class="col-12 col-sm-6 col-md-4 col-lg-3">
    <div class="card card-product h-100">
      <img src="${img}" class="card-img-top" alt="${p.name}" style="height:180px; object-fit:cover;">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${p.name}</h5>
        <p class="card-text small text-muted">${p.category || ''}</p>
        <p class="price mt-auto">R$ ${Number(p.price).toFixed(2)}</p>
        <div class="mt-2 d-grid">
          <button class="btn btn-buy btn-add" data-id="${p.id}">Adicionar ao carrinho</button>
        </div>
      </div>
    </div>
  </div>`;
}

function attachBuyButtons() {
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      addToCart(id);
    });
  });
}

/* Carrinho simples em localStorage */
function getCart() {
  return JSON.parse(localStorage.getItem('alpha_cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('alpha_cart', JSON.stringify(cart));
  document.getElementById('cart-count').innerText = cart.length;
}
function addToCart(productId) {
  const cart = getCart();
  cart.push({productId, qty:1});
  saveCart(cart);
  alert('Produto adicionado ao carrinho!');
}

/* Modal do carrinho (exibe IDs; para produzir corretamente, buscar produtos por id) */

document.getElementById('cartBtn').addEventListener('click', async () => {
  const cart = getCart();
  if (cart.length === 0) {

    document.getElementById('cartItems').innerHTML = '<p>Carrinho vazio.</p>';

  } else {

    // buscar detalhes de cada produto (melhor: manter cache)
    const ids = cart.map(c => c.productId);

    // para simplificar, buscamos todos e filtramos
    const res = await fetch(apiUrl);
    const all = await res.json();
    const items = all.filter(p => ids.includes(String(p.id)) || ids.includes(p.id));
    let html = '<ul class="list-group">';
    items.forEach(it => html += `<li class="list-group-item bg-dark text-white d-flex justify-content-between">${it.name}<span>R$ ${Number(it.price).toFixed(2)}</span></li>`);
    html += '</ul>';
    document.getElementById('cartItems').innerHTML = html;
  }
  new bootstrap.Modal(document.getElementById('cartModal')).show();
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
  // Exemplo: POST /api/orders -> implementar no backend
  alert('Checkout simulado. Implementar endpoint /api/orders para finalizar a compra.');
});

/* inicializa */
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  saveCart(getCart()); // atualiza contagem
});


'use strict'

const loginContainer = document.getElementById('login-container')

const moveOverlay = () => loginContainer.classList.toggle('move')

document.getElementById('open-register').addEventListener('click', moveOverlay)
document.getElementById('open-login').addEventListener('click', moveOverlay)