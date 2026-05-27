import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { menuAPI } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

// Add/Edit Item Modal
const ItemModal = ({ item, categories, onSave, onClose }) => {
  const [form, setForm] = useState(item || {
    name: '', description: '', price: '',
    categoryId: categories[0]?.id || '',
    image: '', isVeg: true, isSpicy: false,
    isBestseller: false, prepTime: 15, rating: 4.0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      toast.error('Please fill all required fields');
      return;
    }
    onSave({ ...form, price: Number(form.price) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-bold text-gray-900 dark:text-white text-lg">
            {item ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              Item Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              placeholder="e.g. Butter Chicken"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Describe the dish..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm({...form, price: e.target.value})}
                placeholder="250"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                Prep Time (min)
              </label>
              <input
                type="number"
                value={form.prepTime}
                onChange={e => setForm({...form, prepTime: Number(e.target.value)})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              Category *
            </label>
            <select
              value={form.categoryId}
              onChange={e => setForm({...form, categoryId: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={form.image}
              onChange={e => setForm({...form, image: e.target.value})}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'isVeg', label: '🌱 Veg' },
              { key: 'isSpicy', label: '🌶️ Spicy' },
              { key: 'isBestseller', label: '🏆 Best' }
            ].map(toggle => (
              <button
                key={toggle.key}
                type="button"
                onClick={() => setForm({...form, [toggle.key]: !form[toggle.key]})}
                className={`py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                  form[toggle.key]
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                }`}
              >
                {toggle.label}
              </button>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
          >
            {item ? '✅ Update Item' : '➕ Add Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Main Admin Menu Page
const AdminMenuPage = () => {
  const [menu, setMenu] = useState({ categories: [], items: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => { fetchMenu(); }, []);

  const fetchMenu = async () => {
    try {
      const response = await menuAPI.getAllMenu();
      setMenu(response.data);
    } catch (error) {
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (itemData) => {
    try {
      if (editItem) {
        await menuAPI.updateItem(editItem.id, itemData);
        toast.success('Item updated!');
      } else {
        await menuAPI.addItem(itemData);
        toast.success('Item added!');
      }
      setShowModal(false);
      setEditItem(null);
      fetchMenu();
    } catch (error) {
      toast.error('Failed to save item');
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await menuAPI.deleteItem(itemId);
      toast.success('Item deleted');
      fetchMenu();
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleToggleAvailable = async (item) => {
    try {
      await menuAPI.updateItem(item.id, { ...item, available: !item.available });
      toast.success(`Item ${item.available ? 'hidden' : 'shown'}`);
      fetchMenu();
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  const filteredItems = activeCategory === 'all'
    ? menu.items
    : menu.items.filter(i => i.categoryId === activeCategory);

  return (
    <AdminLayout>
      <div className="p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Menu Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {menu.items.length} total items
            </p>
          </div>
          <button
            onClick={() => { setEditItem(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-semibold transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeCategory === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
            }`}
          >
            All ({menu.items.length})
          </button>
          {menu.categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
              }`}
            >
              {cat.icon} {cat.name} ({menu.items.filter(i => i.categoryId === cat.id).length})
            </button>
          ))}
        </div>

        {/* Menu Items Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl animate-bounce mb-4">🍛</div>
            <p className="text-gray-500">Loading menu...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Item</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Category</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Price</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredItems.map(item => {
                    const category = menu.categories.find(c => c.id === item.categoryId);
                    return (
                      <tr key={item.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!item.available ? 'opacity-50' : ''}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover"
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'; }}
                            />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white text-sm">
                                {item.name}
                              </p>
                              <div className="flex gap-1 mt-0.5">
                                {item.isVeg && <span className="text-xs text-green-600">🌱</span>}
                                {item.isSpicy && <span className="text-xs">🌶️</span>}
                                {item.isBestseller && <span className="text-xs">🏆</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {category?.icon} {category?.name}
                        </td>
                        <td className="px-4 py-3 font-bold text-orange-500">
                          ₹{item.price}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleAvailable(item)}
                            className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                              item.available
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            {item.available ? '✅ Available' : '❌ Hidden'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setEditItem(item); setShowModal(true); }}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <ItemModal
          item={editItem}
          categories={menu.categories}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditItem(null); }}
        />
      )}
    </AdminLayout>
  );
};

export default AdminMenuPage;