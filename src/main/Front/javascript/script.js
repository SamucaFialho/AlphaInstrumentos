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
    <div class="card card-product h-100 text-center p-3">
      <img src="${img}" class="card-img-top" alt="${p.name}">
      <div class="card-body">
        <h5 class="card-title">${p.name}</h5>
        <p class="price">R$ ${Number(p.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        <button class="btn btn-buy w-100 btn-add" data-id="${p.id}">Adicionar ao carrinho</button>
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
async function addToCart(productId) {
  // Buscar detalhes do produto
  const res = await fetch(apiUrl);
  const products = await res.json();
  const product = products.find(p => String(p.id) === String(productId));
  if (!product) {
    alert('Produto não encontrado!');
    return;
  }
  // Envia ao backend
  await fetch('http://localhost:9000/api/cart/add', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(product)
  });
  // Salva no localStorage (mantém funcionalidade local)
  const cart = getCart();
  cart.push({productId, qty:1});
  saveCart(cart);
  alert('Produto adicionado ao carrinho!');
}

/* Modal do carrinho (exibe IDs; para produzir corretamente, buscar produtos por id) */

// Função para agrupar produtos e quantidades
function getGroupedCart() {
  const cart = getCart();
  const grouped = {};
  cart.forEach(item => {
    if (grouped[item.productId]) {
      grouped[item.productId] += item.qty || 1;
    } else {
      grouped[item.productId] = item.qty || 1;
    }
  });
  return grouped;
}

// Função para remover produto do carrinho
function removeFromCart(productId) {
  let cart = getCart();
  // Remove todas as ocorrências do produto
  cart = cart.filter(item => String(item.productId) !== String(productId));
  saveCart(cart);
}

// Função para atualizar o conteúdo do modal do carrinho
function updateCartModal() {
  const groupedCart = getGroupedCart();
  const cartProductIds = Object.keys(groupedCart);
  if (cartProductIds.length === 0) {
    document.getElementById('cartItems').innerHTML = '<p>Carrinho vazio.</p>';
    // Fecha o modal se estiver aberto
    const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    if (modal) modal.hide();
  } else {
    fetch(apiUrl)
      .then(res => res.json())
      .then(all => {
        const items = all.filter(p => cartProductIds.includes(String(p.id)) || cartProductIds.includes(p.id));
        let html = '<ul class="list-group">';
        items.forEach(it => {
          const qty = groupedCart[it.id] || groupedCart[String(it.id)] || 1;
          html += `<li class="list-group-item bg-dark text-white d-flex justify-content-between align-items-center">
            <span>${it.name} <span class="badge bg-warning text-dark ms-2">${qty}x</span></span>
            <span>R$ ${Number(it.price).toFixed(2)}</span>
            <button class="btn btn-sm btn-danger ms-2 btn-remove" data-id="${it.id}">Excluir</button>
          </li>`;
        });
        html += '</ul>';
        document.getElementById('cartItems').innerHTML = html;
        // Adiciona evento aos botões Excluir
        document.querySelectorAll('.btn-remove').forEach(btn => {
          btn.addEventListener('click', function() {
            const id = btn.dataset.id;
            removeFromCart(id);
            saveCart(getCart()); // atualiza contador
            updateCartModal(); // atualiza modal sem reabrir
          });
        });
      });
  }
}

document.getElementById('cartBtn').addEventListener('click', async () => {
  updateCartModal();
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
