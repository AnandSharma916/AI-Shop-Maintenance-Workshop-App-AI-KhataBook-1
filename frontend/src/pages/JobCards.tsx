import { useState, useEffect } from 'react';

export default function JobCards() {
  const [jobCards, setJobCards] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    customerId: '',
    tractorModel: '',
    registrationNo: '',
    issueDescription: '',
    status: 'PENDING',
    totalCost: 0
  });

  // Invoice State
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const fetchJobCards = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + '/api/jobcards');
      const data = await res.json();
      if (Array.isArray(data)) setJobCards(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobCards();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + '/api/jobcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: formData.customerId,
          tractorModel: formData.tractorModel,
          registrationNo: formData.registrationNo,
          issue: formData.issueDescription,
          status: 'PENDING',
          totalCost: 0
        })
      });
      setShowModal(false);
      setFormData({ id: '', customerId: '', tractorModel: '', registrationNo: '', issueDescription: '', status: 'PENDING', totalCost: 0 });
      fetchJobCards();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + `/api/jobcards/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tractorModel: formData.tractorModel,
          registrationNo: formData.registrationNo,
          issue: formData.issueDescription,
          status: formData.status,
          totalCost: formData.totalCost
        })
      });
      setShowEditModal(false);
      setFormData({ id: '', customerId: '', tractorModel: '', registrationNo: '', issueDescription: '', status: 'PENDING', totalCost: 0 });
      fetchJobCards();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this Job Card permanently?")) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + `/api/jobcards/${id}`, { method: 'DELETE' });
        fetchJobCards();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePrint = (job: any) => {
    setSelectedInvoice(job);
    setTimeout(() => {
      window.print();
      setSelectedInvoice(null);
    }, 100);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Customer Name', 'Phone', 'Tractor', 'Issue', 'Status', 'Total Cost'];
    const rows = jobCards.map(j => [
      j.id,
      new Date(j.createdAt).toLocaleDateString(),
      `"${j.customer?.name || ''}"`,
      `"${j.customer?.phone || ''}"`,
      `"${j.tractorModel}"`,
      `"${j.issue}"`,
      j.status,
      j.totalCost
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "jobcards_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredJobs = jobCards.filter(job => 
    job.tractorModel?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    job.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Hide all standard UI when printing */}
      <div className="print:hidden space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Job Cards (Repairs)</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage ongoing and past tractor repairs.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2.5 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium flex items-center gap-2">
              ⬇️ Export CSV
            </button>
            <button onClick={() => { setFormData({ id: '', customerId: '', tractorModel: '', registrationNo: '', issueDescription: '', status: 'PENDING', totalCost: 0 }); setShowModal(true); }} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
              <span>+</span> New Job Card
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Jobs</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{jobCards.length}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pending Repairs</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{jobCards.filter(j => j.status === 'PENDING').length}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completed Today</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{jobCards.filter(j => j.status === 'COMPLETED').length}</p>
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
                placeholder="Search by customer name or tractor model..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-2">
              <select className="border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-gray-700 dark:text-white outline-none">
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            /* Beautiful Empty State */
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="text-6xl mb-4 bg-gray-100 dark:bg-gray-700 h-24 w-24 flex items-center justify-center rounded-full">
                🛠️
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Job Cards Found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                Looks like there are no tractor repairs logged yet. Open a new job card to start tracking services and spare parts used.
              </p>
              <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium">
                Create First Job Card
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tractor & Issue</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">{job.customer?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{job.customer?.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{job.tractorModel} <span className="text-xs font-normal text-gray-500 bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded ml-2">{job.registrationNo}</span></div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs truncate">{job.issue}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          job.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                          job.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                        ₹ {job.totalCost || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-3 items-center">
                        {job.status === 'COMPLETED' ? (
                          <button onClick={() => handlePrint(job)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 font-semibold underline flex items-center gap-1">
                            🖨️ Bill
                          </button>
                        ) : (
                          <span className="text-gray-400 cursor-not-allowed flex items-center gap-1" title="Complete job to print bill">
                            🖨️ Bill
                          </span>
                        )}
                        <button onClick={() => { 
                          setFormData({ 
                            id: job.id, customerId: job.customerId, tractorModel: job.tractorModel, 
                            registrationNo: job.registrationNo || '', issueDescription: job.issue, 
                            status: job.status, totalCost: job.totalCost 
                          }); 
                          setShowEditModal(true); 
                        }} className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 font-semibold underline">Edit</button>
                        <button onClick={() => handleDelete(job.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 font-semibold underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Open New Job Card</h2>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Customer ID</label>
                  <input type="text" required value={formData.customerId} onChange={(e) => setFormData({...formData, customerId: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter Customer UUID" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Tractor Model</label>
                  <input type="text" required value={formData.tractorModel} onChange={(e) => setFormData({...formData, tractorModel: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Mahindra 575 DI" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Registration Number (Optional)</label>
                  <input type="text" value={formData.registrationNo} onChange={(e) => setFormData({...formData, registrationNo: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. MP-09-AB-1234" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Issue Description</label>
                  <textarea required value={formData.issueDescription} onChange={(e) => setFormData({...formData, issueDescription: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows={3} placeholder="Describe the problem..." />
                </div>
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">Open Job</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Edit Job Card</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Tractor Model</label>
                  <input type="text" required value={formData.tractorModel} onChange={(e) => setFormData({...formData, tractorModel: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Issue Description</label>
                  <textarea required value={formData.issueDescription} onChange={(e) => setFormData({...formData, issueDescription: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="PENDING">PENDING</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Total Cost (₹)</label>
                    <input type="number" value={formData.totalCost} onChange={(e) => setFormData({...formData, totalCost: parseFloat(e.target.value) || 0})} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2.5 text-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors shadow-sm font-medium">Update Job</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Printable Invoice Template (Hidden from screen, visible only in print) */}
      {selectedInvoice && (
        <div className="hidden print:block fixed inset-0 bg-white z-50 text-black p-8 font-sans">
          <div className="text-center mb-8 border-b-2 border-black pb-4">
            <h1 className="text-4xl font-bold mb-2">SHIV SHAKTI AUTO PARTS AND WORKSHOP</h1>
            <p className="text-sm">Main Road, City, District</p>
            <p className="text-sm">Phone: +91 9876543210</p>
            <h2 className="text-2xl font-bold mt-4">TAX INVOICE</h2>
          </div>
          
          <div className="flex justify-between mb-8">
            <div>
              <p className="font-bold mb-1">Billed To:</p>
              <p>{selectedInvoice.customer?.name || 'Customer'}</p>
              <p>Ph: {selectedInvoice.customer?.phone || '-'}</p>
            </div>
            <div className="text-right">
              <p><span className="font-bold">Invoice Date:</span> {new Date().toLocaleDateString()}</p>
              <p><span className="font-bold">Job Card Date:</span> {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
              <p><span className="font-bold">Job ID:</span> #{selectedInvoice.id.substring(0,8).toUpperCase()}</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="font-bold mb-1">Vehicle Details:</p>
            <p>Tractor Model: {selectedInvoice.tractorModel}</p>
            <p>Registration No: {selectedInvoice.registrationNo || 'N/A'}</p>
            <p>Issue: {selectedInvoice.issue}</p>
          </div>

          <table className="w-full mb-8 border-collapse border border-black">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-black p-2 text-left">Description</th>
                <th className="border border-black p-2 text-right">Qty</th>
                <th className="border border-black p-2 text-right">Price</th>
                <th className="border border-black p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2">Repair Services & Labour</td>
                <td className="border border-black p-2 text-right">1</td>
                <td className="border border-black p-2 text-right">₹ {selectedInvoice.totalCost || 0}</td>
                <td className="border border-black p-2 text-right">₹ {selectedInvoice.totalCost || 0}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end mb-16">
            <div className="w-64 border-t-2 border-black pt-2">
              <div className="flex justify-between font-bold text-xl">
                <span>Grand Total:</span>
                <span>₹ {selectedInvoice.totalCost || 0}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-16 pt-8 text-center text-sm">
            <div>
              <div className="border-b border-black w-48 mx-auto mb-2"></div>
              <p>Customer Signature</p>
            </div>
            <div>
              <div className="border-b border-black w-48 mx-auto mb-2"></div>
              <p>Authorized Signatory</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
