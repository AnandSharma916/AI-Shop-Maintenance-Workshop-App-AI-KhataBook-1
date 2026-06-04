import { useState, useEffect } from 'react';

export default function Villages() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVillage, setSelectedVillage] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [customerDetails, setCustomerDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + '/api/customers')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCustomers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const fetchCustomerDetails = (id: string) => {
    setLoadingDetails(true);
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + `/api/customers/${id}`)
      .then(res => res.json())
      .then(data => {
        setCustomerDetails(data);
        setLoadingDetails(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingDetails(false);
      });
  };

  const handleUploadDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedCustomer) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const title = prompt('Enter document title (e.g. Tractor RC, Bill Photo):') || 'Document';
        await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + `/api/customers/${selectedCustomer.id}/documents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, photoUrl: reader.result })
        });
        fetchCustomerDetails(selectedCustomer.id);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (confirm('Delete this document?')) {
      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + `/api/customers/documents/${docId}`, { method: 'DELETE' });
      if (selectedCustomer) fetchCustomerDetails(selectedCustomer.id);
    }
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const msg = encodeURIComponent(`Hello ${name}, this is a message from Shiv Shakti Auto parts and workshop.`);
    const p = phone.startsWith("91") ? phone : `91${phone}`;
    window.open(`https://wa.me/${p}?text=${msg}`, '_blank');
  };

  const handleGenerateInvoice = () => {
    // Simple window print for invoice
    window.print();
  };

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    fetchCustomerDetails(customer.id);
  };

  const handleBackToVillages = () => {
    setSelectedVillage(null);
    setSelectedCustomer(null);
    setCustomerDetails(null);
  };

  const handleBackToCustomers = () => {
    setSelectedCustomer(null);
    setCustomerDetails(null);
  };

  // Group customers by address
  const villagesMap = customers.reduce((acc: any, customer) => {
    const address = customer.address?.trim() || 'Unknown Location';
    if (!acc[address]) acc[address] = [];
    acc[address].push(customer);
    return acc;
  }, {});

  const villages = Object.keys(villagesMap).sort();

  if (loading) {
    return <div className="p-12 text-center text-gray-500 dark:text-gray-400">Loading directory...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            {selectedCustomer ? 'Customer Profile' : selectedVillage ? `Customers in ${selectedVillage}` : 'Villages & Cities Directory'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {selectedCustomer ? `Detailed view for ${selectedCustomer.name}` : selectedVillage ? 'Select a customer to view their full profile' : 'Browse customers by their location.'}
          </p>
        </div>
        <div>
          {selectedCustomer ? (
            <button onClick={handleBackToCustomers} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">
              ⬅️ Back to List
            </button>
          ) : selectedVillage ? (
            <button onClick={handleBackToVillages} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">
              ⬅️ Back to Villages
            </button>
          ) : null}
        </div>
      </div>

      {/* VIEW 3: CUSTOMER PROFILE */}
      {selectedCustomer && (
        <div className="space-y-6 animate-fade-in">
          {loadingDetails || !customerDetails ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">Loading profile data...</div>
          ) : (
            <>
              {/* Profile Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 print:hidden">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-3xl font-bold">
                    {customerDetails.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold dark:text-white">{customerDetails.name}</h2>
                    <div className="text-gray-500 dark:text-gray-400 mt-2 flex flex-col sm:flex-row gap-4">
                      <span className="flex items-center gap-1">📞 {customerDetails.phone}</span>
                      <span className="flex items-center gap-1">📍 {customerDetails.address || 'Unknown'}</span>
                      <span className="flex items-center gap-1">🆔 {customerDetails.id.substring(0,8)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => handleWhatsApp(customerDetails.phone, customerDetails.name)} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow flex items-center gap-2 transition-colors">
                    📱 WhatsApp
                  </button>
                  <button onClick={handleGenerateInvoice} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow flex items-center gap-2 transition-colors">
                    🧾 Print Invoice
                  </button>
                </div>
              </div>

              {/* Invoice Print Template (Hidden unless printing) */}
              <div className="hidden print:block fixed inset-0 bg-white z-50 p-8">
                <div className="text-center mb-8 border-b-2 border-black pb-4">
                  <h1 className="text-4xl font-bold mb-2">SHIV SHAKTI AUTO PARTS AND WORKSHOP</h1>
                  <p>Customer Statement</p>
                </div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">{customerDetails.name}</h2>
                  <p>Phone: {customerDetails.phone}</p>
                  <p>Address: {customerDetails.address}</p>
                </div>
                <h3 className="font-bold text-xl mb-4">Pending Udhari</h3>
                {/* Simplified print view */}
                <p>Please clear your pending dues at the earliest. Thank you!</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Udhari Ledger History */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">📓 Udhari Ledger History</h3>
                  </div>
                  <div className="p-4 flex-1 overflow-auto max-h-[400px]">
                    {customerDetails.Udhari && customerDetails.Udhari.length > 0 ? (
                      <div className="space-y-4">
                        {customerDetails.Udhari.sort((a:any, b:any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((u: any) => (
                          <div key={u.id} className="flex justify-between items-center p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{u.description || 'No description'}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(u.date || u.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold ${u.type === 'CREDIT' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                {u.type === 'CREDIT' ? '-' : '+'} ₹{u.amount}
                              </p>
                              <p className="text-[10px] text-gray-500 uppercase">{u.type}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">No ledger records found.</p>
                    )}
                  </div>
                </div>

                {/* Job Cards History */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">🛠️ Tractor Repair History</h3>
                  </div>
                  <div className="p-4 flex-1 overflow-auto max-h-[400px]">
                    {customerDetails.JobCards && customerDetails.JobCards.length > 0 ? (
                      <div className="space-y-4">
                        {customerDetails.JobCards.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((jc: any) => (
                          <div key={jc.id} className="flex justify-between items-center p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{jc.tractorModel}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{jc.issue}</p>
                              <p className="text-xs text-gray-400 mt-1">{new Date(jc.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${jc.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {jc.status}
                              </span>
                              <p className="font-bold text-gray-900 dark:text-white">₹{jc.totalCost}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">No repair history found.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Document Vault */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col print:hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                  <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">📸 Document Vault (Bills/Photos)</h3>
                  <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                    + Upload Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleUploadDocument} />
                  </label>
                </div>
                <div className="p-4">
                  {customerDetails.Documents && customerDetails.Documents.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {customerDetails.Documents.map((doc: any) => (
                        <div key={doc.id} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                          <img src={doc.photoUrl} alt={doc.title} className="w-full h-32 object-cover cursor-pointer hover:scale-105 transition-transform" onClick={() => window.open(doc.photoUrl)} />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs truncate">
                            {doc.title}
                          </div>
                          <button onClick={() => handleDeleteDocument(doc.id)} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                      <span className="text-4xl mb-2 block">📷</span>
                      No documents uploaded. Click 'Upload Photo' to add bills or tractor photos.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* VIEW 2: CUSTOMERS IN VILLAGE */}
      {!selectedCustomer && selectedVillage && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {villagesMap[selectedVillage].map((customer: any) => (
            <div 
              key={customer.id} 
              onClick={() => handleSelectCustomer(customer)}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xl font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{customer.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">📞 {customer.phone}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700/50 flex justify-end">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline">View Profile →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 1: VILLAGES GRID */}
      {!selectedCustomer && !selectedVillage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
          {villages.map((village) => (
            <div 
              key={village} 
              onClick={() => setSelectedVillage(village)}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group flex flex-col items-center text-center gap-3"
            >
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                🏡
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{village}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full inline-block">
                  {villagesMap[village].length} Customers
                </p>
              </div>
            </div>
          ))}
          {villages.length === 0 && !loading && (
            <div className="col-span-full p-12 text-center text-gray-500 dark:text-gray-400">
              No villages found. Add customers to see them here!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
