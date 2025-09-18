const apiUrl = "http://localhost:9000/api/products"; // ajustar se backend em outra porta

async function fetchProducts() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log("Produtos recebidos:", data); // debug
    renderProducts(data); // chamando a função correta
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  }
}

function renderProducts(products) {
  const container = document.getElementById('products');
  if (!container) {
    console.error("Elemento #products não encontrado no HTML");
    return;
  }

  if (!products || products.length === 0) {
    container.innerHTML = "<p class='text-center'>Nenhum produto disponível.</p>";
    return;
  }

  container.innerHTML = products.map(p => productCard(p)).join('');
  attachBuyButtons();
}

function productCard(p) {
  const img = p.imageUrl || 'images/product-placeholder.jpg';
  const price = p.price ? Number(p.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : "0,00";
  const estoque = p.quantidade ?? 0;

  return `
  <div class="col-12 col-sm-6 col-md-4 col-lg-3">
    <div class="card card-product h-100 text-center p-3">
      <a href="produto.html?id=${p.id}">
        <img src="${img}" class="card-img-top" alt="${p.name}">
      </a>
      <div class="card-body">
        <h5 class="card-title">${p.name}</h5>
        <p class="price">R$ ${price}</p>
        <p class="stock">Disponível: ${estoque}</p>
        <button class="btn btn-buy w-100 btn-add" data-id="${p.id}" ${estoque <= 0 ? "disabled" : ""}>
          ${estoque > 0 ? "Adicionar ao carrinho" : "Esgotado"}
        </button>
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
  try {
    // Verifica produto no backend
    const res = await fetch(`${apiUrl}/${productId}`);
    const product = await res.json();

    if (!product) {
      alert("Produto não encontrado!");
      return;
    }

    if (product.quantidade <= 0) {
      alert("Produto esgotado!");
      return;
    }

    // Se deu certo, adiciona no carrinho local
    const cart = getCart();
    cart.push({ productId, qty: 1 });
    saveCart(cart);

    // Envia ao backend
    await fetch('http://localhost:9000/api/cart/add', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ productId, qty: 1 })
    });

    alert("Produto adicionado ao carrinho!");
  } catch (err) {
    console.error("Erro ao adicionar ao carrinho:", err);
    alert("Erro ao adicionar produto ao carrinho!");
  }
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

document.getElementById('checkoutBtn').addEventListener('click', async () => {
  const cart = getGroupedCart();

  const res = await fetch('http://localhost:9000/api/orders', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(cart)
  });

  if (res.ok) {
    alert('Compra finalizada com sucesso!');
    localStorage.removeItem('alpha_cart');
    saveCart([]); 
    updateCartModal();
  } else {
    const msg = await res.text();
    alert('Erro no checkout: ' + msg);
  }
});


/* inicializa */
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  saveCart(getCart());
});

'use strict'

const loginContainer = document.getElementById('login-container')

const moveOverlay = () => loginContainer.classList.toggle('move')

document.getElementById('open-register').addEventListener('click', moveOverlay)
document.getElementById('open-login').addEventListener('click', moveOverlay)
