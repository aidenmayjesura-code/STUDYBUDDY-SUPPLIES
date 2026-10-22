// StudyBuddy Supplies - Admin shared UI
// Renders the sidebar and highlights the current page.

const ADMIN_PAGES = [
  { href: 'dashboard.html', label: 'Dashboard' },
  { href: 'products.html', label: 'Manage Products' },
  { href: 'orders.html', label: 'Manage Orders' },
  { href: 'inventory.html', label: 'Inventory' },
  { href: 'customers.html', label: 'Customers' },
  { href: 'settings.html', label: 'Settings' }
];

function renderAdminSidebar() {
  const sidebar = document.getElementById('admin-sidebar');
  if (!sidebar) return;
  const current = location.pathname.split('/').pop() || 'dashboard.html';
  sidebar.innerHTML = `
    <aside class="admin-sidebar">
      <div class="admin-brand">
        <div class="logo">StudyBuddy<span>Supplies</span></div>
        <div class="admin-subtitle">Admin Panel</div>
      </div>
      <nav class="admin-nav">
        <ul>
          ${ADMIN_PAGES.map(p => `
            <li><a href="${p.href}" class="${current === p.href ? 'active' : ''}">${p.label}</a></li>
          `).join('')}
          <li><a href="#" class="logout-btn" id="admin-logout">Logout</a></li>
        </ul>
      </nav>
      <div class="admin-footer-note">
        <p>Frontend demo — data saved in browser only.</p>
      </div>
    </aside>
  `;
  const logoutBtn = document.getElementById('admin-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Log out of the admin panel?')) {
        logout();
        location.href = '../login.html';
      }
    });
  }
}

function adminStatCard(label, value, color) {
  return `
    <div class="stat-card" style="--stat-color: ${color}">
      <div class="stat-value">${value}</div>
      <div class="stat-label">${label}</div>
    </div>
  `;
}

function toast(message, type = 'info') {
  let el = document.getElementById('admin-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'admin-toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.className = 'admin-toast show ' + type;
  setTimeout(() => { el.classList.remove('show'); }, 3000);
}
