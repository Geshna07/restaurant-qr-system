import { useState, useEffect } from 'react';
import { Download, QrCode } from 'lucide-react';
import { adminAPI } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const AdminTablesPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  // Base URL for QR codes
  const BASE_URL = window.location.origin;

  useEffect(() => { fetchTables(); }, []);

  const fetchTables = async () => {
    try {
      const response = await adminAPI.getTables();
      setTables(response.data.tables);
    } catch (error) {
      toast.error('Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  // Generate QR code URL using free QR API
  const getQRUrl = (tableId) => {
    const menuUrl = `${BASE_URL}/menu/${tableId}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(menuUrl)}&bgcolor=ffffff&color=1a1a1a&margin=10`;
  };

  // Get menu URL for a table
  const getMenuUrl = (tableId) => `${BASE_URL}/menu/${tableId}`;

  // Download QR code
  const downloadQR = async (tableId, tableName) => {
    try {
      const qrUrl = getQRUrl(tableId);
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QR-${tableName}.png`;
      a.click();
      toast.success(`QR Code downloaded for ${tableName}!`);
    } catch (error) {
      toast.error('Failed to download QR code');
    }
  };

  // Copy URL to clipboard
  const copyUrl = (tableId) => {
    navigator.clipboard.writeText(getMenuUrl(tableId));
    toast.success('Menu URL copied to clipboard!');
  };

  return (
    <AdminLayout>
      <div className="p-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tables & QR Codes
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Generate and download QR codes for each table
          </p>
        </div>

        {/* How it works banner */}
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-4 mb-6">
          <h3 className="font-bold text-orange-700 dark:text-orange-300 mb-2">
            🔍 How QR Codes Work
          </h3>
          <div className="grid md:grid-cols-4 gap-3 text-sm text-orange-600 dark:text-orange-400">
            <div className="flex items-center gap-2">
              <span className="font-bold">1.</span> Print QR code
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">2.</span> Place on table
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">3.</span> Customer scans it
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">4.</span> Menu opens automatically!
            </div>
          </div>
        </div>

        {/* Tables Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl animate-bounce mb-4">🪑</div>
            <p className="text-gray-500">Loading tables...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map(table => (
              <div
                key={table.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                {/* Table Header */}
                <div className="bg-gray-900 p-4 text-center">
                  <h3 className="font-bold text-white text-lg">{table.name}</h3>
                  <p className="text-gray-400 text-xs">
                    Capacity: {table.capacity} people
                  </p>
                </div>

                {/* QR Code */}
                <div className="p-6 flex flex-col items-center">
                  <div className="bg-white p-3 rounded-xl border-4 border-orange-500 mb-4 shadow-lg">
                    <img
                      src={getQRUrl(table.id)}
                      alt={`QR Code for ${table.name}`}
                      className="w-36 h-36"
                    />
                  </div>

                  {/* Menu URL */}
                  <div
                    onClick={() => copyUrl(table.id)}
                    className="w-full bg-gray-50 dark:bg-gray-700 rounded-xl p-2 mb-4 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center truncate">
                      📋 {getMenuUrl(table.id)}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <button
                      onClick={() => downloadQR(table.id, table.name)}
                      className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => window.open(getMenuUrl(table.id), '_blank')}
                      className="flex items-center justify-center gap-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 py-2 px-3 rounded-xl text-sm font-semibold transition-all"
                    >
                      <QrCode className="w-4 h-4" />
                      Test
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTablesPage;