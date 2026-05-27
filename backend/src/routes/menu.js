// Menu routes - handles getting and managing menu items
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../utils/fileHelper');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// ─────────────────────────────────────────
// GET /api/menu
// Public - anyone can view the menu
// ─────────────────────────────────────────
router.get('/', (req, res) => {
  try {
    const data = readData('menu.json');
    res.json({ 
      success: true, 
      categories: data.categories.filter(c => c.active),
      items: data.items.filter(i => i.available)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching menu' });
  }
});

// ─────────────────────────────────────────
// GET /api/menu/all
// Admin only - gets all items including unavailable
// ─────────────────────────────────────────
router.get('/all', authenticateToken, requireAdmin, (req, res) => {
  try {
    const data = readData('menu.json');
    res.json({ success: true, categories: data.categories, items: data.items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching menu' });
  }
});

// ─────────────────────────────────────────
// POST /api/menu/items
// Admin only - add a new menu item
// ─────────────────────────────────────────
router.post('/items', authenticateToken, requireAdmin, (req, res) => {
  try {
    const data = readData('menu.json');
    const newItem = {
      id: uuidv4(),
      ...req.body,
      available: true
    };
    data.items.push(newItem);
    writeData('menu.json', data);
    res.status(201).json({ success: true, message: 'Item added', item: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding item' });
  }
});

// ─────────────────────────────────────────
// PUT /api/menu/items/:id
// Admin only - update a menu item
// ─────────────────────────────────────────
router.put('/items/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const data = readData('menu.json');
    const index = data.items.findIndex(i => i.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    data.items[index] = { ...data.items[index], ...req.body };
    writeData('menu.json', data);
    res.json({ success: true, message: 'Item updated', item: data.items[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating item' });
  }
});

// ─────────────────────────────────────────
// DELETE /api/menu/items/:id
// Admin only - delete a menu item
// ─────────────────────────────────────────
router.delete('/items/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const data = readData('menu.json');
    data.items = data.items.filter(i => i.id !== req.params.id);
    writeData('menu.json', data);
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting item' });
  }
});

module.exports = router;