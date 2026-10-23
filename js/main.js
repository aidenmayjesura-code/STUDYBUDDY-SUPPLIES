// StudyBuddy Supplies - Shared UI (header, footer, cart badge, auth nav)

// Navigation links for logged-out state (only login)
const NAV_LINKS_LOGGED_OUT = [
  { href: 'index.html', label: 'Home' },
  { href: 'about.html', label: 'About Us' },
  { href: 'shop.html', label: 'Products' },
  { href: 'login.html', label: 'Login' }
];

// Navigation links for logged-in customers
const NAV_LINKS_CUSTOMER = [
  { href: 'index.html', label: 'Home' },
  { href: 'shop.html', label: 'Shop' },
  { href: 'shop.html', label: 'Categories' },
  { href: 'about.html', label: 'About Us' },
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
        <a href="${user && user.role === 'admin' ? 'admin/dashboard.html' : 'index.html'}" class="logo"><img src="images/studybuddy-logo.png.png" alt="StudyBuddy Supplies logo" class="logo-img">StudyBuddy<span>Supplies</span></a>
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

    <button class="floating-cart" aria-label="Open shopping cart" onclick="location.href='cart.html'">
      <svg class="cart-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#fff" d="M6 2c-1.1 0-1.99.9-1.99 2L4 4c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H6zm0 2c1.1 0 2 .9 2 2v1h6c1.1 0 2 .9 2 2s-.9 2-2 2H8c-1.1 0-2-.9-2-2s.9-2 2-2v-1c0-1.1.9-2 2-2zm7 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM4 6h2c1.1 0 2 .9 2 2s-.9 2-2 2H4c-1.1 0-2-.9-2-2s.9-2 2-2zm16 10c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2z"/>
      </svg>
      <span class="floating-cart-badge" id="floating-cart-badge">0</span>
    </button>
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
  const count = typeof getItemCount === 'function' ? getItemCount() : 0;
  const navBadge = document.getElementById('cart-badge');
  const floatBadge = document.getElementById('floating-cart-badge');
  if (navBadge) {
    navBadge.textContent = count;
    navBadge.style.display = count > 0 ? 'inline-block' : 'none';
  }
  if (floatBadge) {
    floatBadge.textContent = count;
    floatBadge.style.display = count > 0 ? 'flex' : 'none';
  }
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
