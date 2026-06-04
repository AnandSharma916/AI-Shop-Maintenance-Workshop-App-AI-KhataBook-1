import { useState, useEffect } from 'react';

interface InventoryItem {
  id: string;
  partName: string;
  quantity: number;
  price: number;
  minStock: number;
  updatedAt?: string;
}

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', partName: '', quantity: 0, price: 0, minStock: 5 });

  const fetchInventory = () => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + '/api/inventory')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch inventory', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + '/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partName: formData.partName,
          quantity: formData.quantity,
          price: formData.price,
          minStock: formData.minStock
        })
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ id: '', partName: '', quantity: 0, price: 0, minStock: 5 });
        fetchInventory();
      }
    } catch (err) {
      console.error('Failed to add part', err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + `/api/inventory/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partName: formData.partName,
          quantity: formData.quantity,
          price: formData.price,
          minStock: formData.minStock
        })
      });
      if (res.ok) {
        setShowEditModal(false);
        setFormData({ id: '', partName: '', quantity: 0, price: 0, minStock: 5 });
        fetchInventory();
      }
    } catch (err) {
      console.error('Failed to edit part', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this spare part permanently?")) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + `/api/inventory/${id}`, { method: 'DELETE' });
        fetchInventory();
      } catch (err) {
        console.error('Failed to delete part', err);
      }
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Part Name', 'Quantity', 'Price', 'Total Value'];
    const rows = items.map(i => [
      i.id,
      `"${i.partName}"`,
      i.quantity,
      i.price,
      i.quantity * i.price
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredItems = items.filter(i => 
    i.partName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalParts = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const lowStockCount = items.filter(item => item.quantity <= item.minStock).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Spare Parts Inventory</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage stock levels and pricing for spare parts.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2.5 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium flex items-center gap-2">
            ⬇️ Export CSV
          </button>
          <button onClick={() => { setFormData({ id: '', partName: '', quantity: 0, price: 0, minStock: 5 }); setShowModal(true); }} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
            <span>+</span> Add Spare Part
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Items in Stock</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalParts}</p>
            <p className="text-sm text-gray-500">units</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Inventory Value</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">₹ {totalValue}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Low Stock Alerts</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{lowStockCount}</p>
            <p className="text-sm text-gray-500">items need reorder</p>
          </div>
        </div>
      </div>

      {/* Controls & Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">
              🔍
            </span>
            <input 
              type="text" 
              placeholder="Search spare parts by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">Loading inventory...</div>
        ) : filteredItems.length === 0 ? (
          /* Beautiful Empty State */
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="text-6xl mb-4 bg-gray-100 dark:bg-gray-700 h-24 w-24 flex items-center justify-center rounded-full">
              📦
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Parts Found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
              Your inventory is empty or no parts match your search. Add parts like engine oil, filters, and bearings to track your stock.
            </p>
            <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium">
              Add First Spare Part
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Part Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (₹)</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{item.partName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">ID: {item.id.substring(0,8)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300">
                      {item.quantity} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 dark:text-white">
                      ₹ {item.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.quantity <= item.minStock ? (
                        <span className="bg-red-100 text-red-800 text-xs px-3 py-1 font-semibold rounded-full dark:bg-red-900/30 dark:text-red-400">Low Stock</span>
                      ) : (
                        <span className="bg-green-100 text-green-800 text-xs px-3 py-1 font-semibold rounded-full dark:bg-green-900/30 dark:text-green-400">In Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-3 items-center">
                      <button onClick={() => { 
                        setFormData({ 
                          id: item.id, partName: item.partName, quantity: item.quantity, 
                          price: item.price, minStock: item.minStock 
                        }); 
                        setShowEditModal(true); 
                      }} className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 font-semibold underline">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 font-semibold underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Part Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Add Spare Part</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Part Name</label>
                <input required type="text" value={formData.partName} onChange={e => setFormData({...formData, partName: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Engine Oil 5L" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Quantity</label>
                  <input required type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Price (₹)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Minimum Stock Alert</label>
                <input required type="number" value={formData.minStock} onChange={e => setFormData({...formData, minStock: parseInt(e.target.value) || 0})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Alert threshold" />
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">Save Part</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Part Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Edit Spare Part</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Part Name</label>
                <input required type="text" value={formData.partName} onChange={e => setFormData({...formData, partName: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Quantity</label>
                  <input required type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Price (₹)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Minimum Stock Alert</label>
                <input required type="number" value={formData.minStock} onChange={e => setFormData({...formData, minStock: parseInt(e.target.value) || 0})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2.5 text-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors shadow-sm font-medium">Update Part</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
