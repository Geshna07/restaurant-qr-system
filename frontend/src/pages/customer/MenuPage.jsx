import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, X } from 'lucide-react';
import { menuAPI } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import MenuItemCard from '../../components/customer/MenuItemCard';
import Navbar from '../../components/common/Navbar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const MenuPage = () => {
  const { tableId } = useParams(); // Gets table ID from URL
  const navigate = useNavigate();
  const { setTableId, cartCount, cartTotal, cart } = useCart();

  const [menu, setMenu] = useState({ categories: [], items: [] });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);

  // When page loads, save the table ID
  useEffect(() => {
    if (tableId) {
      setTableId(tableId);
      localStorage.setItem('tableId', tableId);
    }
    fetchMenu();
  }, [tableId]);

  const fetchMenu = async () => {
    try {
      const response = await menuAPI.getMenu();
      setMenu(response.data);
    } catch (error) {
      toast.error('Failed to load menu. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on category and search
  const filteredItems = menu.items.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.categoryId === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <LoadingSpinner message="Loading Menu..." />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Navbar */}
      <Navbar onCartClick={() => setShowCart(true)} />

      <div className="max-w-4xl mx-auto px-4 py-4">

        {/* Table Info Banner */}
        {tableId && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-3 mb-4 flex items-center gap-2">
            <span className="text-xl">🪑</span>
            <p className="text-orange-700 dark:text-orange-300 font-medium text-sm">
              You are at <strong>Table {tableId.replace('table', '')}</strong> — Order directly from here!
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search food items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeCategory === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
            }`}
          >
            🍽️ All
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
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {filteredItems.length} items found
        </p>

        {/* Menu Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {filteredItems.map(item => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No items found for "{searchQuery}"
            </p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-40">
          <button
            onClick={() => navigate(`/cart/${tableId}`)}
            className="w-full max-w-md mx-auto flex items-center justify-between bg-orange-500 hover:bg-orange-600 text-white px-5 py-4 rounded-2xl shadow-xl transition-all active:scale-95"
          >
            <div className="flex items-center gap-2">
              <span className="bg-white text-orange-500 w-6 h-6 rounded-lg flex items-center justify-center font-bold text-sm">
                {cartCount}
              </span>
              <span className="font-semibold">View Cart</span>
            </div>
            <span className="font-bold">₹{cartTotal}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;