import { useState, useEffect } from 'react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  createdAt: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', phone: '', address: '' });
  
  // Profile Modal State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerProfile, setCustomerProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchCustomers = () => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + '/api/customers')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCustomers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch customers', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openProfile = async (id: string) => {
    setSelectedCustomerId(id);
    setProfileLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + `/api/customers/${id}`);
      const data = await res.json();
      setCustomerProfile(data);
    } catch (err) {
      console.error(err);
    }
    setProfileLoading(false);
  };

  const closeProfile = () => {
    setSelectedCustomerId(null);
    setCustomerProfile(null);
  };

  const handleUploadDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedCustomerId) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const title = prompt('Enter document title (e.g. Tractor RC, Bill Photo):') || 'Document';
        await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + `/api/customers/${selectedCustomerId}/documents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, photoUrl: reader.result })
        });
        openProfile(selectedCustomerId);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (confirm('Delete this document?')) {
      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + `/api/customers/documents/${docId}`, { method: 'DELETE' });
      if (selectedCustomerId) openProfile(selectedCustomerId);
    }
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const msg = encodeURIComponent(`Hello ${name}, this is a message from Shiv Shakti Auto parts and workshop.`);
    const p = phone.startsWith("91") ? phone : `91${phone}`;
    window.open(`https://wa.me/${p}?text=${msg}`, '_blank');
  };

  const handleGenerateInvoice = () => {
    window.print();
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + '/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, phone: formData.phone, address: formData.address })
      });
      if (res.ok) {
        setShowAddModal(false);
        setFormData({ id: '', name: '', phone: '', address: '' });
        fetchCustomers();
      }
    } catch (err) {
      console.error('Failed to add customer', err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + `/api/customers/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, phone: formData.phone, address: formData.address })
      });
      if (res.ok) {
        setShowEditModal(false);
        setFormData({ id: '', name: '', phone: '', address: '' });
        fetchCustomers();
      }
    } catch (err) {
      console.error('Failed to edit customer', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this customer? This will also delete all their Job Cards and Udhari records permanently.")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + `/api/customers/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          fetchCustomers();
        } else {
          alert('Failed to delete customer');
        }
      } catch (err) {
        console.error('Failed to delete customer', err);
      }
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'Address', 'Created At'];
    const rows = customers.map(c => [
      c.id, 
      `"${c.name}"`, 
      `"${c.phone}"`, 
      `"${c.address || ''}"`, 
      new Date(c.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Customer Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage your garage's customer base.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2.5 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium flex items-center gap-2">
            ⬇️ Export CSV
          </button>
          <button onClick={() => { setFormData({ id: '', name: '', phone: '', address: '' }); setShowAddModal(true); }} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
            <span>+</span> Add Customer
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Customers</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{customers.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active This Month</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{Math.min(customers.length, 12)}</p>
            <p className="text-sm text-gray-500">estimated</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Top Customer</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white truncate">{customers[0]?.name || '-'}</p>
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
              placeholder="Search by name or phone number..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">Loading customers...</div>
        ) : filteredCustomers.length === 0 ? (
          /* Beautiful Empty State */
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="text-6xl mb-4 bg-gray-100 dark:bg-gray-700 h-24 w-24 flex items-center justify-center rounded-full">
              👥
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Customers Found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
              You haven't added any customers yet, or no customer matches your search. Add a new customer to start managing their records.
            </p>
            <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium">
              Add First Customer
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{customer.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">ID: {customer.id.substring(0,8)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300">
                      {customer.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {customer.address || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3">
                      <button onClick={() => openProfile(customer.id)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-semibold underline">Profile</button>
                      <button onClick={() => { setFormData({ id: customer.id, name: customer.name, phone: customer.phone, address: customer.address || '' }); setShowEditModal(true); }} className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 font-semibold underline">Edit</button>
                      <button onClick={() => handleDelete(customer.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 font-semibold underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Add New Customer</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ramesh Singh" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Phone Number</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="9876543210" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Address (Optional)</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Village Name, District" />
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 text-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Edit Customer</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Phone Number</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Address (Optional)</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2.5 text-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors shadow-sm font-medium">Update Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detailed Customer Profile Modal */}
      {selectedCustomerId && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl transform transition-all">
            {profileLoading || !customerProfile ? (
              <div className="p-12 text-center text-gray-500 dark:text-gray-400">Loading Profile...</div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-2xl font-bold uppercase">
                      {customerProfile.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold dark:text-white">{customerProfile.name}</h2>
                      <p className="text-gray-500 dark:text-gray-400 mt-1 flex gap-4">
                        <span>📞 {customerProfile.phone}</span>
                        <span>📍 {customerProfile.address || 'No Address'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 print:hidden">
                    <button onClick={() => handleWhatsApp(customerProfile.phone, customerProfile.name)} className="bg-green-500 text-white px-3 py-2 rounded-lg font-bold shadow hover:bg-green-600 transition-colors">
                      📱 WhatsApp
                    </button>
                    <button onClick={handleGenerateInvoice} className="bg-purple-600 text-white px-3 py-2 rounded-lg font-bold shadow hover:bg-purple-700 transition-colors">
                      🧾 Print Invoice
                    </button>
                    <button onClick={closeProfile} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full p-2 ml-4">
                      ✕
                    </button>
                  </div>
                </div>

                {/* Print Template */}
                <div className="hidden print:block bg-white z-50 p-8 fixed inset-0">
                  <div className="text-center mb-8 border-b-2 border-black pb-4">
                    <h1 className="text-4xl font-bold mb-2">SHIV SHAKTI AUTO PARTS AND WORKSHOP</h1>
                    <p>Customer Statement</p>
                  </div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2">{customerProfile.name}</h2>
                    <p>Phone: {customerProfile.phone}</p>
                    <p>Address: {customerProfile.address}</p>
                  </div>
                </div>

                {/* Modal Body with Scroll */}
                <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Job Cards Section */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      🛠️ Repair History ({customerProfile.JobCards?.length || 0})
                    </h3>
                    <div className="space-y-3">
                      {customerProfile.JobCards?.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">No job cards found for this customer.</p>
                      ) : (
                        customerProfile.JobCards?.map((job: any) => (
                          <div key={job.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-semibold dark:text-white">{job.tractorModel}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</p>
                              </div>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                job.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>{job.status}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{job.issue}</p>
                            <p className="text-sm font-bold mt-3 text-gray-900 dark:text-white border-t border-gray-100 dark:border-gray-700 pt-2">
                              Bill: ₹ {job.totalCost || 0}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Udhari Section */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        📓 Udhari Khata
                      </h3>
                      {(() => {
                        const totalCredit = customerProfile.Udhari?.filter((i:any) => i.type === 'CREDIT').reduce((sum:number, i:any) => sum + i.amount, 0) || 0;
                        const totalPayment = customerProfile.Udhari?.filter((i:any) => i.type === 'PAYMENT').reduce((sum:number, i:any) => sum + i.amount, 0) || 0;
                        const pending = totalCredit - totalPayment;
                        return (
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${pending > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            Balance: ₹ {pending > 0 ? pending : 0}
                          </span>
                        );
                      })()}
                    </div>
                    <div className="space-y-3">
                      {customerProfile.Udhari?.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">No transactions recorded.</p>
                      ) : (
                        customerProfile.Udhari?.map((txn: any) => (
                          <div key={txn.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm">
                            <div>
                              <p className="font-semibold dark:text-white">{txn.description}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(txn.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold ${txn.type === 'CREDIT' ? 'text-red-500' : 'text-green-500'}`}>
                                {txn.type === 'CREDIT' ? '-' : '+'} ₹ {txn.amount}
                              </p>
                              <p className="text-xs text-gray-400">{txn.type}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Document Vault */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 print:hidden">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">📸 Document Vault</h3>
                    <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors text-sm">
                      + Upload Photo
                      <input type="file" accept="image/*" className="hidden" onChange={handleUploadDocument} />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {customerProfile.Documents && customerProfile.Documents.length > 0 ? (
                      customerProfile.Documents.map((doc: any) => (
                        <div key={doc.id} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                          <img src={doc.photoUrl} alt={doc.title} className="w-full h-24 object-cover cursor-pointer hover:scale-105 transition-transform" onClick={() => window.open(doc.photoUrl)} />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-1 text-xs truncate text-center">
                            {doc.title}
                          </div>
                          <button onClick={() => handleDeleteDocument(doc.id)} className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs">✕</button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-6 text-gray-500 text-sm border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                        No documents uploaded. Click 'Upload Photo' to add bills or tractor photos.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
