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
  const stock = Number(p.stock) || 0;
  document.getElementById('product-details').innerHTML = `
    <div class="row g-4">
      <!-- Coluna Esquerda (Imagens) -->
      <div class="col-md-6 text-center">
        <div class="product-gallery">
          <img src="${img}" alt="${p.name}" class="img-fluid product-img main-img mb-3">
          <div class="d-flex justify-content-center gap-2 flex-wrap">
            <img src="${img}" class="thumb-img" alt="${p.name}">
            <img src="${img}" class="thumb-img" alt="${p.name}">
            <img src="${img}" class="thumb-img" alt="${p.name}">
          </div>
        </div>
      </div>

      <!-- Coluna Direita (Detalhes) -->
      <div class="col-md-6">
        <nav class="breadcrumb small mb-3">
          <a href="index.html">Início</a> / 
          <a href="#">Categoria</a> /
          <span>${p.name}</span>
        </nav>

        <h2 class="product-title mb-3">${p.name}</h2>

        <div class="product-price mb-2">
          <span class="fs-4 fw-bold text-danger">
            R$ ${Number(p.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <p class="pix">No Pix ou Transferência Bancária</p>
        <p>Ou em até <strong>12x de R$ ${(p.price/12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> no cartão</p>

        <p class="product-stock ${stock > 0 ? 'in-stock text-success' : 'out-of-stock text-danger'}">
  ${stock > 0 ? `Em estoque (${stock} disponíveis)` : 'Esgotado'}
</p>

        <div class="frete-box mb-3">
          <label for="cep" class="form-label">Simule seu frete</label>
          <div class="d-flex gap-2">
            <input type="text" id="cep" class="form-control" placeholder="Informe seu CEP">
            <button class="btn btn-outline-secondary">Calcular</button>
          </div>
        </div>

        <div class="d-flex flex-column gap-2">
          <button class="btn btn-warning btn-lg" onclick="addToCart(${p.id})">
            Adicionar ao Carrinho
          </button>
          <button class="btn btn-success btn-lg">
            Comprar pelo WhatsApp
          </button>
        </div>

        <div class="mt-4">
          <h5>Benefícios e Garantias</h5>
          <ul class="list-unstyled">
            <li>✅ Pagamento em até 12x</li>
            <li>✅ Envio em até 48h após confirmação</li>
            <li>✅ Garantia de qualidade</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  // Ativa troca de imagem ao clicar na miniatura
  document.querySelectorAll('.thumb-img').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelector('.main-img').src = thumb.src;
    });
  });
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

/* -------------------------------
   Vistos Recentemente
--------------------------------*/

// Salva produto visualizado no localStorage
function saveRecentlyViewed(product) {
  let viewed = JSON.parse(localStorage.getItem("recently_viewed") || "[]");

  // remove duplicados
  viewed = viewed.filter(p => p.id !== product.id);

  // adiciona no início
  viewed.unshift(product);

  // mantém só os 4 últimos
  if (viewed.length > 4) viewed = viewed.slice(0, 4);

  localStorage.setItem("recently_viewed", JSON.stringify(viewed));
}

// Renderiza a seção
function renderRecentlyViewed() {
  const container = document.getElementById("recently-viewed");
  if (!container) return;

  const viewed = JSON.parse(localStorage.getItem("recently_viewed") || "[]");

  if (viewed.length === 0) {
    container.innerHTML = "<p>Nenhum produto visto recentemente.</p>";
    return;
  }

  let html = `
    <h3 class="mt-5 mb-3 pb-3 text-center">Vistos Recentemente</h3>
    <div class="row">
  `;

  viewed.forEach(p => {
    const img = p.imageUrl || "images/product-placeholder.jpg";
    const price = p.price ? Number(p.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "0,00";

    html += `
      <div class="col-6 col-md-3">
        <div class="card card-product h-100 text-center p-2">
          <a href="produto.html?id=${p.id}">
            <img src="${img}" class="card-img-top" alt="${p.name}">
          </a>
          <div class="card-body">
            <h6 class="card-title">${p.name}</h6>
            <p class="price">R$ ${price}</p>
          </div>
        </div>
      </div>
    `;
  });

  html += "</div>";
  container.innerHTML = html;
}

/* ---------------------------------
   Uso na página do produto
---------------------------------- */
// quando carregar a página do produto
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (productId) {
    try {
      const res = await fetch(`${apiUrl}/${productId}`);
      const product = await res.json();

      if (product) {
        saveRecentlyViewed(product);
        renderRecentlyViewed();
      }
    } catch (err) {
      console.error("Erro ao carregar produto:", err);
    }
  }
});



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