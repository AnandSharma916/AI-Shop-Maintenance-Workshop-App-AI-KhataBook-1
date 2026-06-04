import { useState, useEffect } from 'react';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', title: '', amount: 0, category: 'BILLS', description: '' });

  const categories = ['WAGES', 'BILLS', 'SUPPLIES', 'FOOD', 'OTHER'];

  const fetchExpenses = () => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + '/api/expenses')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setExpenses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch expenses', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + '/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          amount: formData.amount,
          category: formData.category,
          description: formData.description
        })
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ id: '', title: '', amount: 0, category: 'BILLS', description: '' });
        fetchExpenses();
      }
    } catch (err) {
      console.error('Failed to add expense', err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + `/api/expenses/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          amount: formData.amount,
          category: formData.category,
          description: formData.description
        })
      });
      if (res.ok) {
        setShowEditModal(false);
        setFormData({ id: '', title: '', amount: 0, category: 'BILLS', description: '' });
        fetchExpenses();
      }
    } catch (err) {
      console.error('Failed to edit expense', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense permanently?")) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + `/api/expenses/${id}`, { method: 'DELETE' });
        fetchExpenses();
      } catch (err) {
        console.error('Failed to delete expense', err);
      }
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Title', 'Category', 'Amount', 'Description'];
    const rows = expenses.map(i => [
      i.id,
      new Date(i.date).toLocaleDateString(),
      `"${i.title}"`,
      i.category,
      i.amount,
      `"${i.description || ''}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredExpenses = expenses.filter(i => 
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);
  const wagesAmount = expenses.filter(i => i.category === 'WAGES').reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Expenses (Kharcha)</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track daily shop expenses like wages, tea, bills, etc.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2.5 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium flex items-center gap-2">
            ⬇️ Export CSV
          </button>
          <button onClick={() => { setFormData({ id: '', title: '', amount: 0, category: 'BILLS', description: '' }); setShowModal(true); }} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
            <span>+</span> Log Expense
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Expenses Recorded</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">₹ {totalAmount}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Spent on Wages</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">₹ {wagesAmount}</p>
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
              placeholder="Search expenses by title or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">Loading expenses...</div>
        ) : filteredExpenses.length === 0 ? (
          /* Beautiful Empty State */
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="text-6xl mb-4 bg-gray-100 dark:bg-gray-700 h-24 w-24 flex items-center justify-center rounded-full">
              📉
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Expenses Found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
              Track money going out. Log mechanic wages, electricity bills, or daily tea & snacks.
            </p>
            <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium">
              Log First Expense
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredExpenses.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{item.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{item.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 font-semibold rounded-full dark:bg-gray-700 dark:text-gray-300">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-red-600 dark:text-red-400">
                      - ₹{item.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-3 items-center">
                      <button onClick={() => { 
                        setFormData({ 
                          id: item.id, title: item.title, amount: item.amount, 
                          category: item.category, description: item.description || '' 
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

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Log Expense</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Ramesh Daily Wage" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Amount (₹)</label>
                  <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description (Optional)</label>
                <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Edit Expense</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Amount (₹)</label>
                  <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description (Optional)</label>
                <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2.5 text-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors shadow-sm font-medium">Update Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
