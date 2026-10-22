// StudyBuddy Supplies - Shopping Cart (localStorage)
// Supports product variants (color + size/package) as separate cart items.

const CART_STORAGE_KEY = 'studyBuddy_cart';

let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

function variantKey(item) {
  return `${item.id}|${item.color || ''}|${item.size || ''}`;
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
}

function addToCart(productId, qty = 1, color = null, size = null, unitPrice = null) {
  const product = getProduct(productId);
  if (!product) return { ok: false, message: 'Product not found.' };

  const price = unitPrice !== null && unitPrice !== undefined ? Number(unitPrice) : product.price;
  const key = `${productId}|${color || ''}|${size || ''}`;
  const existing = cart.find(item => `${item.id}|${item.color || ''}|${item.size || ''}` === key);
  const currentQty = existing ? existing.qty : 0;
  const newTotal = currentQty + qty;

  if (newTotal > product.stock) {
    return {
      ok: false,
      message: `Only ${product.stock} ${product.name}(s) available in stock.`
    };
  }

  const item = {
    id: productId,
    name: product.name,
    color: color || null,
    size: size || null,
    unitPrice: price,
    qty: newTotal
  };

  if (existing) {
    existing.qty = newTotal;
    existing.unitPrice = price;
  } else {
    cart.push(item);
  }

  saveCart();
  return { ok: true, message: `${product.name} added to cart.` };
}

function setQty(productId, color, size, qty) {
  qty = Math.max(0, Math.floor(qty));
  const product = getProduct(productId);
  if (!product) return;
  const key = `${productId}|${color || ''}|${size || ''}`;
  const item = cart.find(i => `${i.id}|${i.color || ''}|${i.size || ''}` === key);
  if (!item) return;
  if (qty > product.stock) {
    alert(`Only ${product.stock} ${product.name}(s) available in stock.`);
    qty = product.stock;
  }
  if (qty <= 0) {
    removeItem(productId, color, size);
  } else {
    item.qty = qty;
    saveCart();
  }
}

function removeItem(productId, color = null, size = null) {
  const key = `${productId}|${color || ''}|${size || ''}`;
  cart = cart.filter(item => `${item.id}|${item.color || ''}|${item.size || ''}` !== key);
  saveCart();
}

function clearCart() {
  cart = [];
  saveCart();
}

function getCartItems() {
  return cart.map(item => {
    const product = getProduct(item.id);
    if (!product) return null;
    return {
      product,
      color: item.color,
      size: item.size,
      unitPrice: item.unitPrice,
      qty: item.qty,
      subtotal: item.unitPrice * item.qty
    };
  }).filter(Boolean);
}

function getTotal() {
  return getCartItems().reduce((sum, item) => sum + item.subtotal, 0);
}

function getItemCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function onCartUpdated(callback) {
  window.addEventListener('cartUpdated', callback);
}
