import { useState, useEffect } from 'react';
import { 
  ShoppingBag, TrendingUp, Users, 
  Clock, CheckCircle, DollarSign 
} from 'lucide-react';
import { adminAPI, orderAPI } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, subValue }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
      {value}
    </div>
    <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    {subValue && (
      <div className="text-xs text-green-500 mt-1 font-medium">{subValue}</div>
    )}
  </div>
);

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, ordersRes] = await Promise.all([
        adminAPI.getAnalytics(),
        orderAPI.getOrders()
      ]);
      setAnalytics(analyticsRes.data.analytics);
      setRecentOrders(ordersRes.data.orders.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-blue-100 text-blue-700',
    preparing: 'bg-orange-100 text-orange-700',
    ready: 'bg-green-100 text-green-700',
    delivered: 'bg-gray-100 text-gray-600'
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl animate-bounce mb-4">📊</div>
            <p className="text-gray-500">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <StatCard
                icon={ShoppingBag}
                label="Total Orders"
                value={analytics?.totalOrders || 0}
                color="bg-blue-500"
                subValue={`Today: ${analytics?.todayOrders || 0}`}
              />
              <StatCard
                icon={DollarSign}
                label="Total Revenue"
                value={`₹${analytics?.totalRevenue || 0}`}
                color="bg-green-500"
                subValue={`Today: ₹${analytics?.todayRevenue || 0}`}
              />
              <StatCard
                icon={TrendingUp}
                label="Avg Order Value"
                value={`₹${analytics?.avgOrderValue || 0}`}
                color="bg-orange-500"
              />
              <StatCard
                icon={Clock}
                label="Pending Orders"
                value={analytics?.pendingOrders || 0}
                color="bg-yellow-500"
              />
              <StatCard
                icon={CheckCircle}
                label="Delivered Today"
                value={analytics?.deliveredOrders || 0}
                color="bg-purple-500"
              />
              <StatCard
                icon={Users}
                label="Active Tables"
                value="6"
                color="bg-pink-500"
              />
            </div>

            {/* Two column layout */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* Recent Orders */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="font-bold text-gray-900 dark:text-white">
                    Recent Orders
                  </h2>
                </div>
                <div className="p-4 space-y-3">
                  {recentOrders.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No orders yet</p>
                  ) : (
                    recentOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {order.orderNumber}
                          </p>
                          <p className="text-xs text-gray-500">
                            Table {order.tableId.replace('table', '')} • {order.customerName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-500 text-sm">
                            ₹{order.total.toFixed(2)}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Top Selling Items */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="font-bold text-gray-900 dark:text-white">
                    🏆 Top Selling Items
                  </h2>
                </div>
                <div className="p-4 space-y-3">
                  {analytics?.topItems?.length === 0 || !analytics?.topItems ? (
                    <p className="text-gray-400 text-center py-8">
                      No data yet — place some orders!
                    </p>
                  ) : (
                    analytics.topItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-lg font-bold text-orange-500 w-6">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {item.name}
                          </p>
                          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-orange-500 h-1.5 rounded-full"
                              style={{ width: `${Math.min((item.count / (analytics.topItems[0]?.count || 1)) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          {item.count}x
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;