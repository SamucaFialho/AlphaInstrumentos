const apiUrl = "http://localhost:9000/api/products";

// Função para pegar parâmetros da URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function fetchProduct(id) {
  try {
    const res = await fetch(apiUrl);
    const products = await res.json();
    const product = products.find(p => String(p.id) === String(id));
    if (!product) {
      document.getElementById('product-details').innerHTML = "<p>Produto não encontrado.</p>";
      return;
    }
    renderProduct(product);
  } catch (err) {
    console.error("Erro ao buscar produto:", err);
    document.getElementById('product-details').innerHTML = "<p>Erro ao carregar produto.</p>";
  }
}

function renderProduct(p) {
  const img = p.imageUrl || 'images/product-placeholder.jpg';
  document.getElementById('product-details').innerHTML = `
    <div class="col-md-6 text-center">
      <img src="${img}" alt="${p.name}" class="img-fluid product-img">
    </div>
    <div class="col-md-6">
      <h2 class="product-title">${p.name}</h2>
      <p class="product-description">${p.description || 'Sem descrição disponível.'}</p>
      <p class="product-price">R$ ${Number(p.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
      <button class="btn btn-warning btn-buy" onclick="addToCart(${p.id})">
        Adicionar ao Carrinho
      </button>
    </div>
  `;
}

// Funções carrinho
function getCart() {
  return JSON.parse(localStorage.getItem('alpha_cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('alpha_cart', JSON.stringify(cart));
}
async function addToCart(productId) {
  const res = await fetch(apiUrl);
  const products = await res.json();
  const product = products.find(p => String(p.id) === String(productId));
  if (!product) {
    alert('Produto não encontrado!');
    return;
  }
  await fetch('http://localhost:9000/api/cart/add', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(product)
  });
  const cart = getCart();
  cart.push({ productId, qty: 1 });
  saveCart(cart);
  alert('Produto adicionado ao carrinho!');
}

// Inicializa
document.addEventListener('DOMContentLoaded', () => {
  const id = getQueryParam('id');
  fetchProduct(id);
});


//carrinho adicionado
function productCard(p) {
  const img = p.imageUrl || 'images/product-placeholder.jpg';
  return `
  <div class="col-12 col-sm-6 col-md-4 col-lg-3">
    <div class="card card-product h-100 text-center p-3">
      <a href="produto.html?id=${p.id}">
        <img src="${img}" class="card-img-top" alt="${p.name}">
      </a>
      <div class="card-body">
        <h5 class="card-title">${p.name}</h5>
        <p class="price">R$ ${Number(p.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        <button class="btn btn-buy w-100 btn-add" data-id="${p.id}">Adicionar ao carrinho</button>
        <a href="produto.html?id=${p.id}" class="btn btn-outline-secondary w-100 mt-2">Ver detalhes</a>
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
    document.getElementById('cartTotal').innerHTML = '';
  } else {
    fetch(apiUrl)
      .then(res => res.json())
      .then(all => {
        const items = all.filter(p => cartProductIds.includes(String(p.id)) || cartProductIds.includes(p.id));
        let html = '';
        let total = 0;

        items.forEach(it => {
          const qty = groupedCart[it.id] || groupedCart[String(it.id)] || 1;
          const img = it.imageUrl || 'images/product-placeholder.jpg';
          const subtotal = qty * Number(it.price);
          total += subtotal;

          html += `
            <div class="item d-flex align-items-center mb-3 pb-2 border-bottom">
              <img src="${img}" alt="${it.name}" class="cart-img me-3">
              <div class="flex-grow-1">
                <h6 class="mb-1">${it.name}</h6>
                <small class="cart-price">${qty}x • R$ ${Number(it.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</small>
              </div>
              <button class="btn btn-sm btn-danger ms-2 btn-remove" data-id="${it.id}">Excluir</button>
            </div>
          `;
        });

        document.getElementById('cartItems').innerHTML = html;
        document.getElementById('cartTotal').innerHTML = `
          <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
            <strong>Total:</strong>
            <span class="cart-price">R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        `;

        // Eventos para remover
        document.querySelectorAll('.btn-remove').forEach(btn => {
          btn.addEventListener('click', function() {
            const id = btn.dataset.id;
            removeFromCart(id);
            saveCart(getCart());
            updateCartModal();
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