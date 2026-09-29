const ADMIN_PASSWORD = 'alana2026';
const ADMIN_NAV = [
  { href: 'dashboard.html', icon: 'dashboard', label: 'Dashboard' },
  { href: 'posts.html', icon: 'article', label: 'Posts' },
  { href: 'categories.html', icon: 'label', label: 'Categorias' },
  { href: 'comentarios.html', icon: 'comment', label: 'Comentários' },
  { href: 'midias.html', icon: 'image', label: 'Mídias' },
  { href: 'configuracoes.html', icon: 'settings', label: 'Configurações' }
];

function checkAuth() {
  if (sessionStorage.getItem('alana_admin') !== 'true') {
    window.location.href = 'index.html';
  }
}

function renderFatalError(message) {
  const shell = document.getElementById('admin-shell');
  if (shell) {
    shell.innerHTML = `
      <div class="flex min-h-screen items-center justify-center bg-surface-container-low p-gutter">
        <div class="bg-surface rounded-xl shadow-sm p-xl max-w-lg w-full text-center">
          <span class="material-symbols-outlined text-error text-5xl">cloud_off</span>
          <h1 class="font-headline-md text-headline-md text-on-surface mt-md">Não foi possível carregar o painel</h1>
          <p class="font-body-md text-on-surface-variant mt-sm">${message}</p>
          <div class="flex gap-sm justify-center mt-lg">
            <button onclick="location.reload()"
              class="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md hover:scale-[1.02] transition-transform">Tentar novamente</button>
            <a href="index.html"
              class="px-lg py-sm rounded-lg font-label-md border border-outline hover:bg-surface-container transition-colors">Voltar ao login</a>
          </div>
        </div>
      </div>`;
  }
}

async function renderAdminShell(pageTitle, activeNav) {
  checkAuth();

  const shell = document.getElementById('admin-shell');
  if (!shell) return;

  let s;
  try {
    s = await DB.getSettings();
  } catch (err) {
    console.error('[Admin] falha ao carregar settings:', err);
    renderFatalError(err.message);
    return false;
  }
  document.title = pageTitle + ' | Admin | ' + s.siteTitle;

  shell.innerHTML = `
    <div class="flex min-h-screen">
      <aside class="w-60 bg-navy text-white flex flex-col shrink-0">
        <div class="p-gutter border-b border-white/10">
          <div class="text-center">
            <span class="font-script-name text-[2.4rem] text-gold leading-none">Alana Pirangi</span>
            <span class="block text-white/80 text-caption font-label-md" style="margin-top: 2px;">Psicanalista</span>
          </div>
        </div>
        <nav class="flex-1 p-gutter space-y-xs">
          ${ADMIN_NAV.map(item => `
            <a href="${item.href}"
              class="flex items-center gap-sm px-md py-sm rounded-lg font-label-md transition-all duration-200
                ${activeNav === item.label ? 'bg-white/20 text-gold' : 'text-white/70 hover:bg-white/10 hover:text-gold'}">
              <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
              ${item.label}
            </a>
          `).join('')}
        </nav>
        <div class="p-gutter border-t border-white/10">
          <a href="../index.html"
            class="flex items-center gap-sm px-md py-sm rounded-lg font-label-md text-white/70 hover:bg-white/10 hover:text-gold transition-all duration-200">
            <span class="material-symbols-outlined text-[20px]">logout</span>
            Sair
          </a>
        </div>
      </aside>
      <main class="flex-1 bg-surface-container-low">
        <div class="max-w-6xl mx-auto px-gutter py-lg">
          <div id="admin-content"></div>
        </div>
      </main>
    </div>
  `;

  // mobile toggle
  const toggle = document.createElement('button');
  toggle.className = 'fixed top-gutter right-gutter z-50 md:hidden bg-navy text-white p-sm rounded-full shadow-lg';
  toggle.innerHTML = '<span class="material-symbols-outlined">menu</span>';
  toggle.onclick = () => document.querySelector('aside').classList.toggle('hidden');
  document.body.appendChild(toggle);

  return true;
}

function showNotification(msg, type) {
  const el = document.getElementById('notification');
  if (!el) return;
  el.textContent = msg;
  el.className = 'fixed top-gutter right-gutter z-50 px-lg py-sm rounded-lg font-label-md shadow-lg transition-all duration-300 translate-y-0 opacity-100 ' +
    (type === 'success' ? 'bg-green-600 text-white' : type === 'error' ? 'bg-red-600 text-white' : 'bg-primary text-on-primary');
  setTimeout(() => { el.className += ' -translate-y-4 opacity-0'; }, 3000);
}
