import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { adminAPI } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const response = await adminAPI.getSettings();
      setSettings(response.data.settings);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminAPI.updateSettings(settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-full py-20">
        <div className="text-center">
          <div className="text-4xl animate-bounce mb-4">⚙️</div>
          <p className="text-gray-500">Loading settings...</p>
        </div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="p-6 max-w-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Restaurant Settings
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Update your restaurant information
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-5 py-2.5 rounded-xl font-semibold transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="space-y-4">

          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              {[
                { key: 'name', label: 'Restaurant Name', placeholder: 'Spice Garden' },
                { key: 'tagline', label: 'Tagline', placeholder: 'Authentic Indian Cuisine' },
                { key: 'address', label: 'Address', placeholder: '123 Food Street' },
                { key: 'phone', label: 'Phone', placeholder: '+91 98765 43210' },
                { key: 'email', label: 'Email', placeholder: 'info@restaurant.com' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={settings?.[field.key] || ''}
                    onChange={e => setSettings({...settings, [field.key]: e.target.value})}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">
              Business Hours
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Opening Time
                </label>
                <input
                  type="time"
                  value={settings?.openTime || '11:00'}
                  onChange={e => setSettings({...settings, openTime: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Closing Time
                </label>
                <input
                  type="time"
                  value={settings?.closeTime || '23:00'}
                  onChange={e => setSettings({...settings, closeTime: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Open/Closed Toggle */}
            <div className="mt-4 flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Restaurant Status</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Toggle to open or close restaurant
                </p>
              </div>
              <button
                onClick={() => setSettings({...settings, isOpen: !settings.isOpen})}
                className={`w-14 h-7 rounded-full transition-colors relative ${
                  settings?.isOpen ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${
                  settings?.isOpen ? 'left-8' : 'left-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Tax Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">
              Tax & Charges
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  GST Percentage (%)
                </label>
                <input
                  type="number"
                  value={settings?.gstPercent || 5}
                  onChange={e => setSettings({...settings, gstPercent: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Service Charge (%)
                </label>
                <input
                  type="number"
                  value={settings?.serviceCharge || 0}
                  onChange={e => setSettings({...settings, serviceCharge: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;