// StudyBuddy Supplies - Orders (localStorage)
// Works together with products.js: placing an order reduces stock;
// cancelling a stock-reduced order restores stock. An order only
// reduces stock once (tracked by stockReduced).

const ORDER_STORAGE_KEY = 'studyBuddy_orders';

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled'];

function getOrders() {
  return JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY)) || [];
}

function saveOrders(orders) {
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}

function generateOrderNumber() {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 9000 + 1000));
  return 'SB' + y + m + d + random;
}

function placeOrder(customerInfo, items, total) {
  const orders = getOrders();

  // Reduce stock for each ordered item (once per order)
  for (const item of items) {
    const product = getProduct(item.product.id);
    if (!product) {
      throw new Error(`Product "${item.product.name}" not found.`);
    }
    if (product.stock < item.qty) {
      throw new Error(`Not enough stock for ${item.product.name}.`);
    }
  }
  for (const item of items) {
    reduceStock(item.product.id, item.qty);
  }

  const order = {
    number: generateOrderNumber(),
    date: new Date().toISOString(),
    status: 'Pending',
    stockReduced: true,
    customer: customerInfo,
    items: items.map(i => ({
      id: i.product.id,
      name: i.product.name,
      color: i.color,
      size: i.size,
      unitPrice: i.unitPrice,
      qty: i.qty,
      price: i.unitPrice,
      subtotal: i.subtotal
    })),
    total: total
  };
  orders.unshift(order);
  saveOrders(orders);
  return order;
}

function getOrder(number) {
  return getOrders().find(o => o.number === number);
}

function updateOrderStatus(orderNumber, newStatus) {
  if (!ORDER_STATUSES.includes(newStatus)) {
    throw new Error('Invalid order status.');
  }
  const orders = getOrders();
  const order = orders.find(o => o.number === orderNumber);
  if (!order) {
    throw new Error('Order not found.');
  }
  const oldStatus = order.status;
  if (oldStatus === newStatus) {
    return true;
  }

  // Leaving Cancelled: stock was restored, reduce it again.
  if (oldStatus === 'Cancelled' && newStatus !== 'Cancelled' && order.stockReduced === false) {
    for (const item of order.items) {
      const product = getProduct(item.id);
      if (product && product.stock < item.qty) {
        throw new Error(`Not enough stock to reactivate ${item.name}.`);
      }
    }
    for (const item of order.items) {
      reduceStock(item.id, item.qty);
    }
    order.stockReduced = true;
  }

  // Entering Cancelled: restore stock if it was previously reduced.
  if (oldStatus !== 'Cancelled' && newStatus === 'Cancelled' && order.stockReduced === true) {
    for (const item of order.items) {
      restoreStock(item.id, item.qty);
    }
    order.stockReduced = false;
  }

  order.status = newStatus;
  saveOrders(orders);
  window.dispatchEvent(new Event('ordersUpdated'));
  return true;
}

function deleteOrder(orderNumber) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.number === orderNumber);
  if (idx === -1) {
    throw new Error('Order not found.');
  }
  const order = orders[idx];
  // Restore stock if this order had reduced it and is not already cancelled-restored.
  if (order.stockReduced === true && order.status !== 'Cancelled') {
    for (const item of order.items) {
      restoreStock(item.id, item.qty);
    }
  }
  orders.splice(idx, 1);
  saveOrders(orders);
  window.dispatchEvent(new Event('ordersUpdated'));
}

function formatOrderDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getCustomers() {
  const orders = getOrders();
  const map = {};
  for (const order of orders) {
    const key = (order.customer && order.customer.contact) || order.number;
    if (!map[key]) {
      map[key] = {
        name: order.customer ? order.customer.name : 'Unknown',
        contact: order.customer ? order.customer.contact : '',
        address: order.customer ? order.customer.address : '',
        orders: []
      };
    }
    map[key].orders.push(order);
  }
  return Object.values(map).map(c => ({
    name: c.name,
    contact: c.contact,
    address: c.address,
    orderCount: c.orders.length,
    totalSpent: c.orders.reduce((sum, o) => sum + o.total, 0),
    orders: c.orders
  }));
}

function getTotalSales() {
  return getOrders()
    .filter(o => o.status === 'Completed')
    .reduce((sum, o) => sum + o.total, 0);
}

function getPendingOrders() {
  return getOrders().filter(o => o.status === 'Pending');
}

function getCompletedOrders() {
  return getOrders().filter(o => o.status === 'Completed');
}
