import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RefreshCw, LogOut, ChefHat, 
  Clock, CheckCircle, Package, Truck 
} from 'lucide-react';
import { orderAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// Status configuration
const STATUS_CONFIG = {
  pending: { 
    label: 'Pending', 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    dot: 'bg-yellow-500',
    next: 'accepted',
    nextLabel: '✅ Accept Order'
  },
  accepted: { 
    label: 'Accepted', 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    next: 'preparing',
    nextLabel: '👨‍🍳 Start Preparing'
  },
  preparing: { 
    label: 'Preparing', 
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    dot: 'bg-orange-500',
    next: 'ready',
    nextLabel: '🔔 Mark Ready'
  },
  ready: { 
    label: 'Ready!', 
    color: 'bg-green-100 text-green-700 border-green-200',
    dot: 'bg-green-500',
    next: 'delivered',
    nextLabel: '🚀 Mark Delivered'
  },
  delivered: { 
    label: 'Delivered', 
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    dot: 'bg-gray-400',
    next: null,
    nextLabel: null
  }
};

// Single Order Card Component
const OrderCard = ({ order, onStatusUpdate }) => {
  const config = STATUS_CONFIG[order.status];
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    if (!config.next) return;
    setUpdating(true);
    try {
      await orderAPI.updateStatus(order.id, config.next);
      toast.success(`Order ${order.orderNumber} → ${config.next}`);
      onStatusUpdate();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl border-2 shadow-sm overflow-hidden transition-all ${
      order.status === 'pending' ? 'border-yellow-300 shadow-yellow-100' :
      order.status === 'preparing' ? 'border-orange-300 shadow-orange-100' :
      order.status === 'ready' ? 'border-green-300 shadow-green-100' :
      'border-gray-200 dark:border-gray-700'
    }`}>
      
      {/* Card Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">
            {order.orderNumber}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🪑 Table {order.tableId.replace('table', '')} • 
            👤 {order.customerName}
          </p>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${config.color}`}>
          <span className={`w-2 h-2 rounded-full ${config.dot} ${order.status === 'pending' ? 'animate-pulse' : ''}`}></span>
          {config.label}
        </div>
      </div>

      {/* Order Items */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="space-y-1">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-orange-500">
                  {item.quantity}x
                </span> {item.name}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Special instructions */}
        {order.specialInstructions && (
          <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              📝 {order.specialInstructions}
            </p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-4 flex items-center justify-between">
        <div>
          <p className="font-bold text-gray-900 dark:text-white">
            ₹{order.total.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>

        {/* Action Button */}
        {config.next && (
          <button
            onClick={handleStatusUpdate}
            disabled={updating}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
          >
            {updating ? '⏳...' : config.nextLabel}
          </button>
        )}

        {order.status === 'delivered' && (
          <span className="text-green-500 font-semibold text-sm">
            ✅ Completed
          </span>
        )}
      </div>
    </div>
  );
};

// Main Staff Orders Page
const StaffOrdersPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('active');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
    // Auto refresh every 15 seconds
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getOrders();
      setOrders(response.data.orders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
    toast.success('Orders refreshed!');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'active') {
      return ['pending', 'accepted', 'preparing', 'ready'].includes(order.status);
    }
    if (activeFilter === 'delivered') return order.status === 'delivered';
    return true;
  });

  // Count by status
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const preparingCount = orders.filter(o => ['accepted', 'preparing'].includes(o.status)).length;
  const readyCount = orders.filter(o => o.status === 'ready').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-lg">
                👨‍🍳 Staff Dashboard
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Welcome, {user?.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Refresh button */}
              <button
                onClick={handleRefresh}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-orange-100 transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4">

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <div className="text-xs text-yellow-600 font-medium">Pending</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">{preparingCount}</div>
            <div className="text-xs text-orange-600 font-medium">Preparing</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{readyCount}</div>
            <div className="text-xs text-green-600 font-medium">Ready</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { key: 'active', label: '🔥 Active' },
            { key: 'delivered', label: '✅ Delivered' },
            { key: 'all', label: '📋 All' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeFilter === tab.key
                  ? 'bg-orange-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 animate-bounce">🍛</div>
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
              {activeFilter === 'active' ? 'No active orders right now!' : 'No orders found'}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Auto-refreshes every 15 seconds
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusUpdate={fetchOrders}
              />
            ))}
          </div>
        )}

        {/* Auto refresh notice */}
        <p className="text-center text-xs text-gray-400 mt-6">
          🔄 Auto-refreshes every 15 seconds
        </p>
      </div>
    </div>
  );
};

export default StaffOrdersPage;