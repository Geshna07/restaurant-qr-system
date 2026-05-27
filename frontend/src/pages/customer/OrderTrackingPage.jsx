import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, ChefHat, Bell, Package } from 'lucide-react';
import { orderAPI } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    // Auto refresh every 10 seconds
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getOrder(orderId);
      setOrder(response.data.order);
    } catch (error) {
      console.error('Error fetching order');
    } finally {
      setLoading(false);
    }
  };

  // Order status steps
  const steps = [
    { key: 'pending', label: 'Order Placed', icon: CheckCircle, color: 'text-blue-500' },
    { key: 'accepted', label: 'Accepted', icon: Bell, color: 'text-purple-500' },
    { key: 'preparing', label: 'Preparing', icon: ChefHat, color: 'text-orange-500' },
    { key: 'ready', label: 'Ready!', icon: Package, color: 'text-green-500' },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'text-green-600' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order?.status);

  if (loading) return <LoadingSpinner message="Loading your order..." />;

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Order not found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">
            {order.status === 'delivered' ? '🎉' : 
             order.status === 'ready' ? '🔔' : 
             order.status === 'preparing' ? '👨‍🍳' : '✅'}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Order #{order.orderNumber}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Table {order.tableId.replace('table', '')} • {order.customerName}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-4 shadow-sm">
          <h2 className="font-bold text-gray-900 dark:text-white mb-6 text-center">
            Order Status
          </h2>
          
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-600"></div>
            
            <div className="space-y-6">
              {steps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex items-center gap-4 relative">
                    {/* Step icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                      isCompleted
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-orange-200' : ''}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Step label */}
                    <div>
                      <p className={`font-semibold ${
                        isCompleted
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-orange-500 text-xs font-medium animate-pulse">
                          ● Current Status
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">
            Your Order
          </h3>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-100 dark:border-gray-700 pt-2 flex justify-between font-bold">
              <span className="text-gray-900 dark:text-white">Total</span>
              <span className="text-orange-500">₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Auto refresh notice */}
        <p className="text-center text-xs text-gray-400 mb-4">
          🔄 Auto-refreshes every 10 seconds
        </p>

        {/* Back to menu */}
        <button
          onClick={() => navigate(`/menu/${order.tableId}`)}
          className="w-full border-2 border-orange-500 text-orange-500 font-bold py-3 rounded-2xl hover:bg-orange-50 transition-colors"
        >
          Order More Items
        </button>
      </div>
    </div>
  );
};

export default OrderTrackingPage;