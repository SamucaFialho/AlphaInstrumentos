const API_BASE = "http://localhost:9000/api";

// Renderiza uma lista de categorias (espera: GET /api/categories)
async function loadCategories() {
  const container = document.getElementById('categories');
  container.innerHTML = '<p>Carregando categorias...</p>';

  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) {
      // fallback: se não existir endpoint /categories
      console.warn('GET /categories retornou', res.status);
      container.innerHTML = '<p class="text-muted">Não foi possível carregar categorias do servidor.</p>';
      return;
    }

    const categories = await res.json();
    if (!Array.isArray(categories) || categories.length === 0) {
      container.innerHTML = '<p class="text-muted">Nenhuma categoria cadastrada.</p>';
      return;
    }

    // monta os cards
    container.innerHTML = categories.map(cat => categoryCardHTML(cat)).join('');
    attachCategoryHandlers();
  } catch (err) {
    console.error('Erro ao buscar categorias:', err);
    container.innerHTML = '<p class="text-muted">Erro ao carregar categorias.</p>';
  }
}

function categoryCardHTML(cat) {
  // espera-se cat = { id, nome || name, description || descricao, imageUrl || image_url }
  const id = cat.id ?? cat._id ?? '';
  const nome = cat.nome || cat.name || 'Categoria';
  const desc = cat.description || cat.descricao || '';
  const img = cat.imageUrl || cat.image_url || '/src/assets/images/placeholder-category.png';

  // link para a página de categoria (vocẽ implementará category.html depois)
  return `
    <a href="/src/main/Front/categoria.html?id=${encodeURIComponent(id)}" class="text-decoration-none">
      <div class="category-card">
        <img src="${img}" alt="${escapeHtml(nome)}">
        <h3 class="category-title">${escapeHtml(nome)}</h3>
        <p class="category-desc">${escapeHtml(desc)}</p>
      </div>
    </a>
  `;
}

function attachCategoryHandlers() {
  // se quiser comportamento JS extra (ex: analytics), colocar aqui
}

function escapeHtml(s){
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[c]);
}

// inicia
document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
});
