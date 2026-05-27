import { useNavigate, useParams } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { orderAPI } from '../../utils/api';
import { useState } from 'react';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [placing, setPlacing] = useState(false);

  const gst = cartTotal * 0.05;
  const grandTotal = cartTotal + gst;

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    setPlacing(true);
    try {
      const orderData = {
        tableId: tableId || localStorage.getItem('tableId') || 'table1',
        customerName: customerName || 'Guest',
        specialInstructions: instructions,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      };

      const response = await orderAPI.placeOrder(orderData);
      const orderId = response.data.order.id;
      
      clearCart();
      toast.success('🎉 Order placed successfully!');
      navigate(`/order-tracking/${orderId}`);

    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="font-bold text-gray-900 dark:text-white text-lg">Your Cart</h1>
        <span className="ml-auto text-sm text-gray-500">{cart.length} items</span>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">

        {cart.length === 0 ? (
          /* Empty cart */
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium text-lg">Your cart is empty</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-3 mb-4">
              {cart.map(item => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                  
                  {/* Item info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {item.name}
                    </h3>
                    <p className="text-orange-500 font-bold">₹{item.price}</p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-orange-100 text-orange-500 rounded-lg flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-gray-900 dark:text-white w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Item total + delete */}
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                      ₹{item.price * item.quantity}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-500 mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Customer Name */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-sm">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                Your Name (Optional)
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Special Instructions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-sm">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                placeholder="Any allergies or special requests?"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              />
            </div>

            {/* Bill Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Bill Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>GST (5%)</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-2 flex justify-between font-bold text-gray-900 dark:text-white text-base">
                  <span>Total</span>
                  <span className="text-orange-500">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment note */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 mb-4 text-center">
              <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                💳 Pay at counter or via UPI after meal
              </p>
            </div>

            {/* Place Order Button */}
            <button
              onClick={placeOrder}
              disabled={placing}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-4 rounded-2xl text-lg transition-all active:scale-95"
            >
              {placing ? '⏳ Placing Order...' : `🛒 Place Order • ₹${grandTotal.toFixed(2)}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;