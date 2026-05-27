// Admin routes - staff management, settings, analytics
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../utils/fileHelper');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All admin routes require authentication + admin role
router.use(authenticateToken, requireAdmin);

// ─────────────────────────────────────────
// GET /api/admin/staff
// Get all staff members
// ─────────────────────────────────────────
router.get('/staff', (req, res) => {
  try {
    const data = readData('users.json');
    // Don't send passwords!
    const staff = data.users.map(({ password, ...user }) => user);
    res.json({ success: true, staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching staff' });
  }
});

// ─────────────────────────────────────────
// POST /api/admin/staff
// Add new staff member
// ─────────────────────────────────────────
router.post('/staff', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const data = readData('users.json');

    // Check if email already exists
    if (data.users.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role: role || 'staff',
      active: true,
      createdAt: new Date().toISOString()
    };

    data.users.push(newUser);
    writeData('users.json', data);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ success: true, message: 'Staff added', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding staff' });
  }
});

// ─────────────────────────────────────────
// PUT /api/admin/staff/:id/toggle
// Enable or disable a staff account
// ─────────────────────────────────────────
router.put('/staff/:id/toggle', (req, res) => {
  try {
    const data = readData('users.json');
    const index = data.users.findIndex(u => u.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    data.users[index].active = !data.users[index].active;
    writeData('users.json', data);
    res.json({ success: true, message: 'Staff status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating staff' });
  }
});

// ─────────────────────────────────────────
// GET /api/admin/analytics
// Get restaurant analytics
// ─────────────────────────────────────────
router.get('/analytics', (req, res) => {
  try {
    const ordersData = readData('orders.json');
    const orders = ordersData.orders;

    // Calculate analytics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Today's stats
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => 
      new Date(o.createdAt).toDateString() === today
    );
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

    // Top selling items
    const itemCounts = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
      });
    });
    const topItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.json({
      success: true,
      analytics: {
        totalOrders,
        totalRevenue: totalRevenue.toFixed(2),
        pendingOrders,
        deliveredOrders,
        avgOrderValue: avgOrderValue.toFixed(2),
        todayOrders: todayOrders.length,
        todayRevenue: todayRevenue.toFixed(2),
        topItems
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching analytics' });
  }
});

// ─────────────────────────────────────────
// GET /api/admin/settings
// Get restaurant settings
// ─────────────────────────────────────────
router.get('/settings', (req, res) => {
  try {
    const data = readData('settings.json');
    res.json({ success: true, settings: data.restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching settings' });
  }
});

// ─────────────────────────────────────────
// PUT /api/admin/settings
// Update restaurant settings
// ─────────────────────────────────────────
router.put('/settings', (req, res) => {
  try {
    const data = readData('settings.json');
    data.restaurant = { ...data.restaurant, ...req.body };
    writeData('settings.json', data);
    res.json({ success: true, message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating settings' });
  }
});

// ─────────────────────────────────────────
// GET /api/admin/tables
// Get all tables
// ─────────────────────────────────────────
router.get('/tables', (req, res) => {
  try {
    const data = readData('tables.json');
    res.json({ success: true, tables: data.tables });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching tables' });
  }
});

module.exports = router;