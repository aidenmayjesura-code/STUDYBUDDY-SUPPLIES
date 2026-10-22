// StudyBuddy Supplies - Shared product data layer
// Products and stock are persisted in localStorage so the client shop
// and admin dashboard share the same data (single-browser demo only).

const PRODUCTS_STORAGE_KEY = 'studyBuddy_products';
const LOW_STOCK_THRESHOLD = 10;

const DEFAULT_PRODUCTS = [
  {
    id: 'notebook',
    name: 'Notebook',
    price: 35,
    stock: 50,
    category: 'paper',
    image: 'images/products/notebook.jpg',
    description: 'A cute lined notebook perfect for taking down class notes and doodles.',
    variants: {
      colors: ['Pink', 'Blue', 'Purple', 'Green', 'Yellow'],
      sizes: [
        { label: 'Small (80 pages)', price: 35 },
        { label: 'Large (120 pages)', price: 50 }
      ]
    }
  },
  {
    id: 'ballpen',
    name: 'Ballpen',
    price: 12,
    stock: 100,
    category: 'writing',
    image: 'images/products/ballpen.jpg',
    description: 'Smooth-writing ballpen for everyday school use.',
    variants: {
      colors: null,
      sizes: [
        { label: 'Single', price: 12 },
        { label: 'Pack of 5', price: 50 }
      ]
    }
  },
  {
    id: 'pencil',
    name: 'Pencil',
    price: 10,
    stock: 120,
    category: 'writing',
    image: 'images/products/pencil.jpg',
    description: 'Classic wooden pencil with eraser, ideal for sketching and writing.',
    variants: {
      colors: null,
      sizes: [
        { label: 'Single', price: 10 },
        { label: 'Pack of 12', price: 100 }
      ]
    }
  },
  {
    id: 'eraser',
    name: 'Eraser',
    price: 8,
    stock: 80,
    category: 'writing',
    image: 'images/products/eraser.jpg',
    description: 'Soft eraser that cleanly removes pencil marks without smudging.',
    variants: {
      colors: null,
      sizes: [
        { label: 'Single', price: 8 },
        { label: 'Pack of 5', price: 35 }
      ]
    }
  },
  {
    id: 'ruler',
    name: 'Ruler',
    price: 15,
    stock: 60,
    category: 'tools',
    image: 'images/products/ruler.jpg',
    description: 'Clear plastic ruler for drawing straight lines and measuring.',
    variants: {
      colors: null,
      sizes: [
        { label: 'Single', price: 15 },
        { label: 'Pack of 3', price: 40 }
      ]
    }
  },
  {
    id: 'crayons',
    name: 'Crayons',
    price: 45,
    stock: 40,
    category: 'art',
    image: 'images/products/crayons.jpg',
    description: 'Vibrant wax crayons for coloring and art projects.',
    variants: {
      colors: null,
      sizes: [
        { label: 'Box of 24', price: 45 },
        { label: 'Pack of 2 boxes', price: 85 }
      ]
    }
  },
  {
    id: 'colored-pencils',
    name: 'Colored Pencils',
    price: 60,
    stock: 40,
    category: 'art',
    image: 'images/products/colored-pencils.jpg',
    description: 'Richly pigmented colored pencils for drawing and shading.',
    variants: {
      colors: null,
      sizes: [
        { label: 'Box of 12', price: 60 },
        { label: 'Pack of 2 boxes', price: 110 }
      ]
    }
  },
  {
    id: 'school-bag',
    name: 'School Bag',
    price: 350,
    stock: 20,
    category: 'bags',
    image: 'images/products/school-bag.jpg',
    description: 'Spacious and cute school bag to carry all your supplies.',
    variants: {
      colors: ['Pink', 'Purple', 'Mint Green', 'Black'],
      sizes: [
        { label: 'Small', price: 350 },
        { label: 'Large', price: 450 }
      ]
    }
  },
  {
    id: 'pencil-case',
    name: 'Pencil Case',
    price: 80,
    stock: 30,
    category: 'bags',
    image: 'images/products/pencil-case.jpg',
    description: 'Compact pencil case to keep pens and pencils organized.',
    variants: {
      colors: null,
      sizes: [
        { label: 'Single', price: 80 },
        { label: 'Pack of 2', price: 150 }
      ]
    }
  },
  {
    id: 'bond-paper',
    name: 'Bond Paper Pack',
    price: 120,
    stock: 25,
    category: 'paper',
    image: 'images/products/bond-paper.jpg',
    description: 'Premium bond paper pack for printing and school assignments.',
    variants: {
      colors: null,
      sizes: [
        { label: 'A4, 500 sheets', price: 120 },
        { label: 'Long, 500 sheets', price: 150 }
      ]
    }
  },
  {
    id: 'scissors',
    name: 'Scissors',
    price: 25,
    stock: 35,
    category: 'tools',
    image: 'images/products/scissors.jpg',
    description: 'Safety scissors with a cute design for arts and crafts.',
    variants: {
      colors: null,
      sizes: [
        { label: 'Single', price: 25 },
        { label: 'Pack of 2', price: 45 }
      ]
    }
  },
  {
    id: 'glue',
    name: 'Glue',
    price: 20,
    stock: 45,
    category: 'art',
    image: 'images/products/glue.jpg',
    description: 'Washable school glue for paper crafts and projects.',
    variants: {
      colors: null,
      sizes: [
        { label: 'Single', price: 20 },
        { label: 'Pack of 3', price: 50 }
      ]
    }
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'writing', name: 'Writing' },
  { id: 'paper', name: 'Paper' },
  { id: 'art', name: 'Art' },
  { id: 'tools', name: 'Tools' },
  { id: 'bags', name: 'Bags' }
];

let products = loadProducts();

function loadProducts() {
  const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      // fall back to defaults
    }
  }
  return DEFAULT_PRODUCTS.map(p => ({ ...p }));
}

function saveProducts() {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event('productsUpdated'));
}

function getProducts() {
  return products;
}

function getProduct(id) {
  return products.find(p => p.id === id);
}

function getProductsByCategory(categoryId) {
  if (categoryId === 'all') return products;
  return products.filter(p => p.category === categoryId);
}

function formatPrice(amount) {
  return '₱' + Number(amount).toFixed(2);
}

function resolveImagePath(image) {
  const isAdmin = location.pathname.includes('/admin/');
  return (isAdmin ? '../' : '') + (image || 'images/placeholder.jpg');
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function variantKey(color, size) {
  return `${color || ''}|${size || ''}`;
}

function validateProduct({ name, price, stock, category }) {
  if (!name || !String(name).trim()) {
    throw new Error('Product name is required.');
  }
  const p = Number(price);
  if (!Number.isFinite(p) || p < 0) {
    throw new Error('Price must be a valid non-negative number.');
  }
  const s = Math.floor(Number(stock));
  if (!Number.isFinite(s) || s < 0) {
    throw new Error('Stock must be a valid non-negative whole number.');
  }
  if (!category) {
    throw new Error('Category is required.');
  }
  return { name: String(name).trim(), price: p, stock: s, category: String(category) };
}

function addProduct(product) {
  const cleaned = validateProduct(product);
  const id = product.id || slugify(cleaned.name);
  if (getProduct(id)) {
    throw new Error('A product with this name already exists.');
  }
  const newProduct = {
    id,
    name: cleaned.name,
    price: cleaned.price,
    stock: cleaned.stock,
    category: cleaned.category,
    image: product.image || 'images/products/placeholder.jpg',
    description: product.description || '',
    variants: product.variants || { colors: null, sizes: null }
  };
  products.push(newProduct);
  saveProducts();
  return newProduct;
}

function updateProduct(id, changes) {
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) {
    throw new Error('Product not found.');
  }
  const merged = { ...products[idx], ...changes };
  validateProduct(merged);
  products[idx] = merged;
  saveProducts();
  return products[idx];
}

function deleteProduct(id) {
  const exists = getProduct(id);
  if (!exists) {
    throw new Error('Product not found.');
  }
  products = products.filter(p => p.id !== id);
  saveProducts();
  return exists;
}

function reduceStock(productId, qty) {
  const product = getProduct(productId);
  if (!product) return false;
  const q = Math.floor(Number(qty));
  if (!Number.isFinite(q) || q < 0) return false;
  if (product.stock < q) return false;
  product.stock -= q;
  saveProducts();
  return true;
}

function restoreStock(productId, qty) {
  const product = getProduct(productId);
  if (!product) return;
  const q = Math.floor(Number(qty));
  if (!Number.isFinite(q) || q < 0) return;
  product.stock += q;
  saveProducts();
}

function getLowStockProducts() {
  return products.filter(p => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD);
}

function getOutOfStockProducts() {
  return products.filter(p => p.stock <= 0);
}

function getTotalStockValue() {
  return products.reduce((sum, p) => sum + p.price * p.stock, 0);
}
