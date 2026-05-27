// Orders routes - handles placing and managing orders
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../utils/fileHelper');
const { authenticateToken, requireStaff } = require('../middleware/auth');

// ─────────────────────────────────────────
// POST /api/orders
// Public - customer places a new order
// ─────────────────────────────────────────
router.post('/', (req, res) => {
  try {
    const { tableId, items, customerName, specialInstructions } = req.body;

    // Validate required fields
    if (!tableId || !items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Table ID and items are required' 
      });
    }

    // Calculate total price
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Read settings to get tax info
    const settings = readData('settings.json');
    const gstAmount = (total * settings.restaurant.gstPercent) / 100;
    const grandTotal = total + gstAmount;

    // Create new order object
    const newOrder = {
      id: uuidv4(),
      orderNumber: `ORD${Date.now()}`,
      tableId,
      customerName: customerName || 'Guest',
      items,
      specialInstructions: specialInstructions || '',
      status: 'pending',        // pending → accepted → preparing → ready → delivered
      subtotal: total,
      gst: gstAmount,
      total: grandTotal,
      paymentStatus: 'paid',   // fake payment - always paid
      paymentMethod: 'online',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        { status: 'pending', time: new Date().toISOString() }
      ]
    };

    // Save to orders.json
    const data = readData('orders.json');
    data.orders.push(newOrder);
    writeData('orders.json', data);

    res.status(201).json({ 
      success: true, 
      message: 'Order placed successfully!', 
      order: newOrder 
    });

  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ success: false, message: 'Error placing order' });
  }
});

// ─────────────────────────────────────────
// GET /api/orders
// Staff/Admin - get all orders
// ─────────────────────────────────────────
router.get('/', authenticateToken, requireStaff, (req, res) => {
  try {
    const data = readData('orders.json');
    // Sort by newest first
    const sorted = data.orders.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json({ success: true, orders: sorted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
});

// ─────────────────────────────────────────
// GET /api/orders/:id
// Public - get single order (for tracking)
// ─────────────────────────────────────────
router.get('/:id', (req, res) => {
  try {
    const data = readData('orders.json');
    const order = data.orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching order' });
  }
});

// ─────────────────────────────────────────
// PUT /api/orders/:id/status
// Staff/Admin - update order status
// ─────────────────────────────────────────
router.put('/:id/status', authenticateToken, requireStaff, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'accepted', 'preparing', 'ready', 'delivered'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const data = readData('orders.json');
    const index = data.orders.findIndex(o => o.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update status and add to history
    data.orders[index].status = status;
    data.orders[index].updatedAt = new Date().toISOString();
    data.orders[index].statusHistory.push({
      status,
      time: new Date().toISOString()
    });

    writeData('orders.json', data);
    res.json({ success: true, message: 'Status updated', order: data.orders[index] });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
});

module.exports = router;