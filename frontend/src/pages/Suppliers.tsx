import { useState, useEffect } from 'react';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  
  // Forms
  const [supplierForm, setSupplierForm] = useState({ name: '', phone: '', address: '' });
  const [billForm, setBillForm] = useState({ amount: '', description: '', photoUrl: '' });

  const fetchSuppliers = () => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + '/api/suppliers')
      .then(res => res.json())
      .then(data => {
        setSuppliers(data);
        // Update selected supplier if it's currently open
        if (selectedSupplier) {
          const updated = data.find((s:any) => s.id === selectedSupplier.id);
          if (updated) setSelectedSupplier(updated);
        }
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + '/api/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplierForm)
    });
    setShowAddModal(false);
    setSupplierForm({ name: '', phone: '', address: '' });
    fetchSuppliers();
  };

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;
    await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + `/api/suppliers/${selectedSupplier.id}/bills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(billForm)
    });
    setShowBillModal(false);
    setBillForm({ amount: '', description: '', photoUrl: '' });
    fetchSuppliers();
  };

  const handlePayBill = async (billId: string) => {
    await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + `/api/suppliers/bills/${billId}/pay`, { method: 'PUT' });
    fetchSuppliers();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBillForm({...billForm, photoUrl: reader.result as string});
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading Vaypari Data...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 animate-fade-in-down">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-sm">
            Vaypari (Suppliers)
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage your vendors and upload purchase bills.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold shadow-lg shadow-pink-500/30 hover:scale-105 hover:shadow-pink-500/50 transition-all duration-300"
        >
          + Add New Vaypari
        </button>
      </div>

      {!selectedSupplier ? (
        /* SUPPLIER GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
          {suppliers.map(sup => {
            const totalOwed = sup.Bills.filter((b:any) => b.status === 'UNPAID').reduce((acc:any, b:any) => acc + b.amount, 0);
            return (
              <div 
                key={sup.id} 
                onClick={() => setSelectedSupplier(sup)}
                className="group relative bg-white dark:bg-gray-800 rounded-3xl p-6 cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-pink-500/50"
              >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 group-hover:scale-[3] transition-transform duration-700 ease-out"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-600 dark:text-pink-400 flex items-center justify-center text-2xl font-black shadow-inner">
                      {sup.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-pink-500 transition-colors">{sup.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">📞 {sup.phone}</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-700/50 flex justify-between items-end">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Total Due</p>
                      <p className={`text-2xl font-black ${totalOwed > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        ₹{totalOwed.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-pink-500 group-hover:text-white transition-colors duration-300">
                      ➔
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* SUPPLIER DETAIL VIEW */
        <div className="animate-fade-in">
          <button onClick={() => setSelectedSupplier(null)} className="mb-6 text-pink-500 font-bold hover:text-pink-600 flex items-center gap-2 transition-colors">
            ← Back to All Vayparis
          </button>
          
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-500/10 to-transparent rounded-bl-full pointer-events-none"></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 border-b border-gray-100 dark:border-gray-700 pb-8 mb-8">
              <div>
                <h2 className="text-4xl font-black dark:text-white mb-2">{selectedSupplier.name}</h2>
                <div className="flex gap-4 text-gray-500 font-medium">
                  <span>📱 {selectedSupplier.phone}</span>
                  <span>📍 {selectedSupplier.address || 'No address provided'}</span>
                </div>
              </div>
              <button onClick={() => setShowBillModal(true)} className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform duration-300">
                + Upload New Bill
              </button>
            </div>

            <h3 className="text-2xl font-bold mb-6 dark:text-white">Bill History</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
              {selectedSupplier.Bills.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-400 font-medium bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  No bills uploaded yet.
                </div>
              ) : (
                selectedSupplier.Bills.sort((a:any, b:any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((bill:any) => (
                  <div key={bill.id} className="flex gap-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-pink-300 transition-colors">
                    {/* Bill Photo Thumbnail */}
                    <div className="w-32 h-32 rounded-xl bg-gray-200 dark:bg-gray-800 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-inner">
                      {bill.photoUrl ? (
                        <img src={bill.photoUrl} alt="Bill" className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-500" onClick={() => window.open(bill.photoUrl)} />
                      ) : (
                        <span className="text-4xl">📄</span>
                      )}
                    </div>
                    
                    <div className="flex flex-col justify-between flex-1 py-2">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-lg dark:text-white">₹{bill.amount.toLocaleString()}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider ${bill.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700 animate-pulse'}`}>
                            {bill.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{bill.description}</p>
                        <p className="text-xs text-gray-400 mt-2 font-medium">{new Date(bill.date).toLocaleDateString()}</p>
                      </div>
                      
                      {bill.status === 'UNPAID' && (
                        <button onClick={() => handlePayBill(bill.id)} className="self-start mt-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold shadow-md hover:bg-green-600 transition-colors">
                          Mark as Paid ✓
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD SUPPLIER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl transform scale-100 animate-zoom-in">
            <h2 className="text-2xl font-black mb-6 dark:text-white">New Vaypari</h2>
            <form onSubmit={handleAddSupplier} className="space-y-5">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Supplier Name</label>
                <input required type="text" value={supplierForm.name} onChange={e => setSupplierForm({...supplierForm, name: e.target.value})} className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 dark:bg-gray-700 dark:text-white focus:border-pink-500 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Phone Number</label>
                <input required type="text" value={supplierForm.phone} onChange={e => setSupplierForm({...supplierForm, phone: e.target.value})} className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 dark:bg-gray-700 dark:text-white focus:border-pink-500 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">City/Address</label>
                <input type="text" value={supplierForm.address} onChange={e => setSupplierForm({...supplierForm, address: e.target.value})} className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 dark:bg-gray-700 dark:text-white focus:border-pink-500 outline-none transition-colors" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD BILL MODAL */}
      {showBillModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl transform scale-100 animate-zoom-in">
            <h2 className="text-2xl font-black mb-6 dark:text-white">Upload Bill</h2>
            <form onSubmit={handleAddBill} className="space-y-5">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Bill Amount (₹)</label>
                <input required type="number" value={billForm.amount} onChange={e => setBillForm({...billForm, amount: e.target.value})} className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 text-xl font-bold dark:bg-gray-700 dark:text-white focus:border-pink-500 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Description (Parts Bought)</label>
                <input type="text" value={billForm.description} onChange={e => setBillForm({...billForm, description: e.target.value})} className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 dark:bg-gray-700 dark:text-white focus:border-pink-500 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Attach Photo (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center hover:border-pink-500 transition-colors cursor-pointer relative overflow-hidden group">
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  {billForm.photoUrl ? (
                    <img src={billForm.photoUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                  ) : (
                    <div className="py-6">
                      <span className="text-3xl mb-2 block group-hover:scale-125 transition-transform">📸</span>
                      <span className="text-sm font-medium text-gray-500">Tap to snap a photo</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowBillModal(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">Upload Bill</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
