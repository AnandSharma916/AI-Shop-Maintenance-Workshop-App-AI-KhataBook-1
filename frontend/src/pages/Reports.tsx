import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

export default function Reports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + '/api/reports')
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">Generating AI Analytics...</p>
      </div>
    );
  }

  // Format Data for Charts
  const profitData = [
    { name: 'Revenue', amount: data.summary.totalRevenue },
    { name: 'Expenses', amount: data.summary.totalExpenses },
    { name: 'Net Profit', amount: data.summary.netProfit }
  ];

  const expenseData = Object.entries(data.expenseByCategory).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const inventoryData = [
    { name: 'Total Invested', value: data.summary.inventoryCost },
    { name: 'Projected Value', value: data.summary.inventoryValue },
    { name: 'Potential Profit', value: data.summary.inventoryValue - data.summary.inventoryCost }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
            <span className="text-4xl">🤖</span> AI Analytics Engine
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Advanced reporting and business intelligence.</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg shadow hover:opacity-90 transition-opacity font-medium flex items-center gap-2">
          Download PDF Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-green-100 font-medium text-sm tracking-wider uppercase mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold">₹{data.summary.totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 text-white opacity-20 text-8xl">📈</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-rose-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-red-100 font-medium text-sm tracking-wider uppercase mb-1">Total Expenses</p>
            <h3 className="text-3xl font-bold">₹{data.summary.totalExpenses.toLocaleString()}</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 text-white opacity-20 text-8xl">📉</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-blue-100 font-medium text-sm tracking-wider uppercase mb-1">Net Profit</p>
            <h3 className="text-3xl font-bold">₹{data.summary.netProfit.toLocaleString()}</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 text-white opacity-20 text-8xl">💰</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-fuchsia-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-purple-100 font-medium text-sm tracking-wider uppercase mb-1">Pending Udhari</p>
            <h3 className="text-3xl font-bold">₹{data.summary.pendingUdhari.toLocaleString()}</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 text-white opacity-20 text-8xl">📓</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profit vs Loss Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-6 dark:text-white">Business Health (Revenue vs Expense)</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} formatter={(value: any) => [`₹${value}`, 'Amount']} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {profitData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : index === 1 ? '#EF4444' : '#3B82F6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
          <h2 className="text-xl font-bold mb-2 dark:text-white">Expense Distribution</h2>
          <div className="flex-1 h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`₹${value}`, 'Amount']} contentStyle={{borderRadius: '8px'}} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Analytics */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2">
          <h2 className="text-xl font-bold mb-6 dark:text-white">Inventory Profitability Forecast</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inventoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <Tooltip formatter={(value: any) => [`₹${value}`, 'Amount']} contentStyle={{borderRadius: '8px'}} />
                <Area type="monotone" dataKey="value" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
