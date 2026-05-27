import { Plus, Minus, Star, Clock, Flame } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const MenuItemCard = ({ item }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  
  // Check if item is already in cart
  const cartItem = cart.find(i => i.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200">
      
      {/* Food Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300';
          }}
        />
        
        {/* Badges on image */}
        <div className="absolute top-2 left-2 flex gap-1">
          {/* Veg/Non-veg indicator */}
          <span className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center ${item.isVeg ? 'border-green-500' : 'border-red-500'}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></span>
          </span>
        </div>

        {/* Bestseller badge */}
        {item.isBestseller && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
            🏆 Bestseller
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="p-3">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
          {item.name}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-xs mb-2 line-clamp-2">
          {item.description}
        </p>

        {/* Rating, Time, Spicy */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-600 dark:text-gray-300">{item.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-600 dark:text-gray-300">{item.prepTime}m</span>
          </div>
          {item.isSpicy && (
            <div className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-red-400" />
              <span className="text-xs text-red-400">Spicy</span>
            </div>
          )}
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-orange-500 text-base">
            ₹{item.price}
          </span>

          {/* Add/Remove buttons */}
          {quantity === 0 ? (
            <button
              onClick={() => addToCart(item)}
              className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, quantity - 1)}
                className="w-7 h-7 bg-orange-100 hover:bg-orange-200 text-orange-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-gray-900 dark:text-white w-4 text-center">
                {quantity}
              </span>
              <button
                onClick={() => addToCart(item)}
                className="w-7 h-7 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;