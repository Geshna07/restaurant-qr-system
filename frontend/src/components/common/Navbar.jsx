import { ShoppingCart, Moon, Sun, UtensilsCrossed } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useState, useEffect } from 'react';

const Navbar = ({ onCartClick }) => {
  const { cartCount } = useCart();
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b border-gray-100 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white text-lg leading-none">
              Spice Garden
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Authentic Indian Cuisine
            </p>
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-3">
          
          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-orange-100 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Cart button */}
          <button
            onClick={onCartClick}
            className="relative p-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {/* Cart count badge */}
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;