import { useState, useEffect } from 'react';

export default function Udhari() {
  const [ledger, setLedger] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    customerId: '',
    amount: '',
    type: 'CREDIT',
    description: ''
  });

  const fetchLedger = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + '/api/udhari');
      const data = await res.json();
      if (Array.isArray(data)) setLedger(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + '/api/udhari', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: formData.customerId,
          amount: parseFloat(formData.amount),
          type: formData.type,
          description: formData.description
        })
      });
      setShowModal(false);
      setFormData({ id: '', customerId: '', amount: '', type: 'CREDIT', description: '' });
      fetchLedger();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + `/api/udhari/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          type: formData.type,
          description: formData.description
        })
      });
      setShowEditModal(false);
      setFormData({ id: '', customerId: '', amount: '', type: 'CREDIT', description: '' });
      fetchLedger();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction permanently?")) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + `/api/udhari/${id}`, { method: 'DELETE' });
        fetchLedger();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const sendWhatsApp = (item: any) => {
    if (!item.customer?.phone) {
      alert("No phone number available for this customer.");
      return;
    }
    const amount = item.amount;
    const desc = item.description || "previous dues";
    const typeStr = item.type === 'CREDIT' ? 'pending payment' : 'received payment';
    
    // Creating message
    const msg = encodeURIComponent(`Hello ${item.customer.name}, this is a gentle reminder regarding your ${typeStr} of ₹${amount} for ${desc} at Shiv Shakti Auto parts and workshop. Please process the payment at your earliest convenience.`);
    const phone = item.customer.phone.startsWith("91") ? item.customer.phone : `91${item.customer.phone}`;
    
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Customer Name', 'Phone', 'Type', 'Amount', 'Description'];
    const rows = ledger.map(l => [
      l.id,
      new Date(l.createdAt).toLocaleDateString(),
      `"${l.customer?.name || ''}"`,
      `"${l.customer?.phone || ''}"`,
      l.type,
      l.amount,
      `"${l.description || ''}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "udhari_ledger.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLedger = ledger.filter(item => 
    item.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCredit = ledger.filter(i => i.type === 'CREDIT').reduce((sum, i) => sum + i.amount, 0);
  const totalPayment = ledger.filter(i => i.type === 'PAYMENT').reduce((sum, i) => sum + i.amount, 0);
  const netPending = totalCredit - totalPayment;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Udhari Ledger (Khata)</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track payments and outstanding balances.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2.5 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium flex items-center gap-2">
            ⬇️ Export CSV
          </button>
          <button onClick={() => { setFormData({ id: '', customerId: '', amount: '', type: 'CREDIT', description: '' }); setShowModal(true); }} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
            <span>+</span> Add Transaction
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Given (Credit)</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">₹ {totalCredit}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Received</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">₹ {totalPayment}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Net Pending Balance</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">₹ {netPending > 0 ? netPending : 0}</p>
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
              placeholder="Search transactions by customer or description..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {filteredLedger.length === 0 ? (
          /* Beautiful Empty State */
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="text-6xl mb-4 bg-gray-100 dark:bg-gray-700 h-24 w-24 flex items-center justify-center rounded-full">
              📓
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Transactions Found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
              There are no udhari or payment records here. Start logging transactions to keep track of your shop's ledger.
            </p>
            <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium">
              Log First Transaction
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLedger.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{item.customer?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.customer?.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.type === 'CREDIT' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {item.type === 'CREDIT' ? 'CREDIT (Given)' : 'PAYMENT (Recv)'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                      ₹ {item.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-3 items-center">
                      <button onClick={() => sendWhatsApp(item)} className="text-green-600 hover:text-green-900 dark:text-green-400 font-semibold underline flex items-center gap-1">
                        💬 WhatsApp
                      </button>
                      <button onClick={() => { 
                        setFormData({ 
                          id: item.id, customerId: item.customerId, amount: item.amount.toString(), 
                          type: item.type, description: item.description || '' 
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

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Add Transaction</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Customer ID</label>
                <input type="text" required value={formData.customerId} onChange={(e) => setFormData({...formData, customerId: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter Customer UUID" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Amount (₹)</label>
                <input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="5000" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Transaction Type</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="CREDIT">Credit / Udhar Diya (Reduces Balance)</option>
                  <option value="PAYMENT">Payment / Jama Kiya (Adds Balance)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
                <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. For Tractor Repair" />
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">Save Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Edit Transaction</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Amount (₹)</label>
                <input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Transaction Type</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="CREDIT">Credit / Udhar Diya (Reduces Balance)</option>
                  <option value="PAYMENT">Payment / Jama Kiya (Adds Balance)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
                <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2.5 text-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors shadow-sm font-medium">Update Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
