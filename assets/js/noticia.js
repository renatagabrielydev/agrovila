// assets/js/noticia.js
document.addEventListener('DOMContentLoaded', () => {
  // --- Config ---
  window.isLoggedIn = false;
  const validCredentials = { username: 'adm', password: '@agrovila25luiz' };

  // inicializa notícias (sempre começa com esta lista)
  let news = [
    {
      id: 1,
      image: "https://horadecodar.com.br/wp-content/uploads/2023/03/programacao-no-dia-a-dia.jpg",
      title: "Agrovila são luiz vai ao ar",
      caption: "Neste dia 15 finalmente será possível acessar nosso site pela primeira vez",
      text: " Nosso objetivo é transformar a Cozinha Comunitária em um centro de produção e comercialização de alimentos, envolvendo 50 famílias de agricultores. Verificar o sucesso através da participação e desempenho nos cursos, funcionamento regular da cozinha e avaliações de satisfação e desempenho econômico social dos produtores.",
      date: "15 de Dezembro de 2025"
    }
  ];

  // --- Helpers ---
  function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  function updateUIForAuth() {
    const loginSection = document.getElementById('loginSection');
    const loggedInSection = document.getElementById('loggedInSection');

    if (!loginSection || !loggedInSection) return;

    if (isLoggedIn) {
      loginSection.classList.add('hidden');
      loggedInSection.classList.remove('hidden');
    } else {
      loginSection.classList.remove('hidden');
      loggedInSection.classList.add('hidden');
    }
  }

  // --- Render ---
  function renderNews() {
    const container = document.getElementById('newsContainer');
    if (!container) {
      console.error('#newsContainer não encontrado no DOM');
      return;
    }

    if (news.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h2>🌾 Nenhuma notícia encontrada</h2>
      `;
      return;
    }

    container.innerHTML = news.map(item => `
      <article class="news-item" data-id="${item.id}">
        ${isLoggedIn ? `<button class="delete-btn" data-id="${item.id}" title="Excluir notícia">×</button>` : ''}
        <img src="${item.image}" alt="${item.title}" class="news-image" onerror="this.src='https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'">
        <div class="news-content">
          <h1 class="news-title">${item.title}</h1>
          <p class="news-caption">${item.caption}</p>
          <div class="news-text">${item.text}</div>
          <div class="news-date">📅 ${item.date}</div>
        </div>
      </article>
    `).join('');
  }

  // --- Delete via delegação de evento ---
  const newsContainerEl = document.getElementById('newsContainer');
  if (newsContainerEl) {
    newsContainerEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.delete-btn');
      if (!btn) return;
      const id = Number(btn.dataset.id);
      deleteNewsById(id);
    });
  }

  window.deleteNewsById = function(id) {
    if (!isLoggedIn) {
      showNotification('🔐 Faça login para gerenciar notícias!', 'error');
      return;
    }
    if (!id) {
      console.warn('deleteNewsById chamado com id inválido:', id);
      return;
    }
    if (confirm('Tem certeza que deseja excluir esta notícia?')) {
      news = news.filter(item => item.id !== id);
      renderNews();
      showNotification('🗑️ Notícia excluída com sucesso!', 'info');
    }
  };

  // --- Adicionar notícia ---
  function addNews(image, title, caption, text) {
    const newNews = {
      id: Date.now(),
      image,
      title,
      caption,
      text,
      date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    news.unshift(newNews);
    renderNews();
  }
  window.addNews = addNews;

  // --- Login / Logout / Modais ---
  window.openLoginModal = function() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
  };
  window.closeLoginModal = function() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    const lf = document.getElementById('loginForm');
    if (lf) lf.reset();
    const le = document.getElementById('loginError'); if (le) le.style.display = 'none';
  };

  window.openModal = function() {
    if (!isLoggedIn) {
      showNotification('🔐 Faça login para adicionar notícias!', 'info');
      setTimeout(() => window.openLoginModal(), 800);
      return;
    }
    document.getElementById('newsModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
  };
  window.closeModal = function() {
    document.getElementById('newsModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    const nf = document.getElementById('newsForm'); if (nf) nf.reset();
  };

  window.showLoginMessage = function() {
    showNotification('🔐 Faça login para adicionar notícias!', 'info');
    setTimeout(() => window.openLoginModal(), 800);
  };

  function login(username, password) {
    if (username === validCredentials.username && password === validCredentials.password) {
      isLoggedIn = true;
      updateUIForAuth();
      renderNews();
      closeLoginModal();
      showNotification('✅ Login realizado com sucesso!', 'success');
      return true;
    } else {
      showNotification('❌ Credenciais inválidas!', 'error');
      return false;
    }
  }
  window.logout = function() {
    if (confirm('Tem certeza que deseja sair?')) {
      isLoggedIn = false;
      updateUIForAuth();
      renderNews();
      showNotification('👋 Logout realizado com sucesso!', 'info');
    }
  };

  // --- Form handlers ---
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const ok = login(username, password);
      if (!ok) {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
          errorDiv.textContent = '❌ Usuário ou senha incorretos!';
          errorDiv.style.display = 'block';
          setTimeout(() => { errorDiv.style.display = 'none'; }, 3000);
        }
      }
    });
  }

  const newsForm = document.getElementById('newsForm');
  if (newsForm) {
    newsForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const image = document.getElementById('newsImage').value;
      const title = document.getElementById('newsTitle').value;
      const caption = document.getElementById('newsCaption').value;
      const text = document.getElementById('newsText').value;
      addNews(image, title, caption, text);
      closeModal();
      showNotification('✨ Notícia adicionada com sucesso!', 'success');
      setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 100);
    });
  }

  // Fechar modais clicando fora
  window.addEventListener('click', (event) => {
    const newsModal = document.getElementById('newsModal');
    const loginModal = document.getElementById('loginModal');
    if (event.target === newsModal) closeModal();
    if (event.target === loginModal) closeLoginModal();
  });
  // ESC fecha
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') { closeModal(); closeLoginModal(); }
  });

  // Inicialização
  updateUIForAuth();
  renderNews();

  // Debug helpers
  window.__debug = {
    getNews: () => news
  };
});
