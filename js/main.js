// StudyBuddy Supplies - Shared UI (header, footer, cart badge, auth nav)

// Navigation links for logged-out state (only login)
const NAV_LINKS_LOGGED_OUT = [
  { href: 'login.html', label: 'Login' }
];

// Navigation links for logged-in customers
const NAV_LINKS_CUSTOMER = [
  { href: 'index.html', label: 'Home' },
  { href: 'shop.html', label: 'Shop' },
  { href: 'shop.html', label: 'Categories' },
  { href: 'cart.html', label: 'My Cart' },
  { href: 'orders.html', label: 'My Orders' }
];

// Navigation links for logged-in admins
const NAV_LINKS_ADMIN = [
  { href: 'admin/dashboard.html', label: 'Dashboard' },
  { href: 'admin/products.html', label: 'Manage Products' },
  { href: 'admin/orders.html', label: 'Manage Orders' },
  { href: 'admin/inventory.html', label: 'Inventory' },
  { href: 'admin/customers.html', label: 'Customers' },
  { href: 'admin/settings.html', label: 'Settings' }
];

function getNavLinks() {
  const user = getCurrentUser();
  if (!user) return NAV_LINKS_LOGGED_OUT;
  if (user.role === 'admin') return NAV_LINKS_ADMIN;
  return NAV_LINKS_CUSTOMER;
}

function renderHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const activePage = location.pathname.split('/').pop() || 'index.html';
  const user = getCurrentUser();
  const links = getNavLinks();

  let logoutHtml = '';
  if (user) {
    logoutHtml = `
      <a href="#" class="cart-link logout-link" onclick="handleLogout(event)">
        Logout
      </a>
    `;
  }

  header.innerHTML = `
    <header class="site-header">
      <div class="header-inner">
        <a href="${user && user.role === 'admin' ? 'admin/dashboard.html' : 'index.html'}" class="logo">StudyBuddy<span>Supplies</span></a>
        <nav class="main-nav">
          <ul>
            ${links.map(link => `
              <li><a href="${link.href}" class="${activePage === link.href ? 'active' : ''}">${link.label}</a></li>
            `).join('')}
          </ul>
          <a href="cart.html" class="cart-link">
            My Cart <span class="cart-badge" id="cart-badge">0</span>
          </a>
          ${logoutHtml}
        </nav>
        <button class="nav-toggle" aria-label="Toggle menu">&#9776;</button>
      </div>
    </header>
  `;
}

function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  footer.innerHTML = `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="logo">StudyBuddy<span>Supplies</span></div>
          <p>Your friendly neighborhood school supplies shop.</p>
        </div>
        <div class="footer-contact">
          <h4>Contact Us</h4>
          <p>&#9993; studybuddysupplies@email.com</p>
          <p>&#9742; +63 912 345 6789</p>
          <p>&#127968; Manila, Philippines</p>
        </div>
        <div class="footer-hours">
          <h4>Hours</h4>
          <p>Mon - Fri: 8:00 AM - 5:00 PM</p>
          <p>Sat: 9:00 AM - 3:00 PM</p>
          <p>Sunday: Closed</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 StudyBuddy Supplies. Frontend demo — orders saved in browser only.</p>
      </div>
    </footer>
  `;
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const count = typeof getItemCount === 'function' ? getItemCount() : 0;
  badge.textContent = count;
  badge.style.display = count > 0 ? 'inline-block' : 'none';
}

function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

function handleLogout(e) {
  e.preventDefault();
  if (confirm('Log out?')) {
    logout();
    location.href = 'login.html';
  }
}
