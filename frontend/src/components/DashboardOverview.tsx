import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Clock, AlertTriangle, ArrowRight, Activity, Wrench as WrenchIcon, Banknote, ShieldAlert, CheckCircle, Plus, Package, BookOpen, Wrench } from 'lucide-react';

export default function DashboardOverview() {
  const navigate = useNavigate();
  
  const chartData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 5500 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 8900 },
    { name: 'Sat', revenue: 12000 },
    { name: 'Sun', revenue: 8400 },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button 
            onClick={() => navigate('/reports')}
            whileHover={{ scale: 1.03, y: -2 }} 
            whileTap={{ scale: 0.97 }} 
            className="bg-[#161f2e] border border-gray-700/50 text-gray-200 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-black/20 hover:bg-[#1d283a] hover:border-gray-500/50 transition-all backdrop-blur-sm"
          >
            Download Report
          </motion.button>
          <motion.button 
            onClick={() => navigate('/jobcards')}
            whileHover={{ scale: 1.03, y: -2 }} 
            whileTap={{ scale: 0.97 }} 
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-violet-500/30 transition-all flex items-center gap-2 border border-violet-400/30 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-500 ease-in-out"></div>
            <Plus className="w-4 h-4 relative z-10" /> <span className="relative z-10">New Job Card</span>
          </motion.button>
        </div>
      </div>

      {/* AI Insights Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm animate-pulse">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">AI Daily Insight <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold">Live</span></h3>
            <p className="text-blue-100 mt-1 font-medium leading-relaxed max-w-3xl">
              Based on historical data, we predict a <span className="font-bold text-white">25% increase</span> in Tractor servicing requests this week. 
              We recommend re-stocking <span className="font-bold text-white underline">Engine Oil</span> and <span className="font-bold text-white underline">Filters</span> immediately. 
              Also, 3 customers have pending Udhari crossing 30 days.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between group hover:shadow-xl hover:border-green-200 dark:hover:border-green-900/50 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
            <TrendingUp className="w-24 h-24 text-green-500" />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Revenue</h2>
            <div className="p-2.5 bg-green-100 dark:bg-green-500/20 rounded-xl text-green-600 dark:text-green-400 shadow-inner">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6 relative z-10">
            <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tight font-display">₹ 1,24,500</p>
            <p className="text-sm text-green-600 font-medium mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> 12% from last month</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between group hover:shadow-xl hover:border-red-200 dark:hover:border-red-900/50 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
            <TrendingDown className="w-24 h-24 text-red-500" />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Udhari</h2>
            <div className="p-2.5 bg-red-100 dark:bg-red-500/20 rounded-xl text-red-600 dark:text-red-400 shadow-inner">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6 relative z-10">
            <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tight font-display">₹ 45,000</p>
            <p className="text-sm text-red-500 font-medium mt-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Requires attention</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between group hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
            <WrenchIcon className="w-24 h-24 text-blue-500" />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Job Cards</h2>
            <div className="p-2.5 bg-blue-100 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 shadow-inner">
              <WrenchIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6 relative z-10">
            <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tight font-display">12</p>
            <p className="text-sm text-gray-500 font-medium mt-2 flex items-center gap-1"><Clock className="w-3 h-3" /> 3 completed today</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between group hover:shadow-xl hover:border-yellow-200 dark:hover:border-yellow-900/50 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
            <ShieldAlert className="w-24 h-24 text-yellow-500" />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Low Stock Parts</h2>
            <div className="p-2.5 bg-yellow-100 dark:bg-yellow-500/20 rounded-xl text-yellow-600 dark:text-yellow-400 shadow-inner">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6 relative z-10">
            <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tight font-display">5</p>
            <p className="text-sm text-yellow-600 font-medium mt-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Needs reordering soon</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg"><Activity className="w-5 h-5" /></div>
              <h2 className="text-xl font-bold dark:text-white">Weekly Revenue Analytics</h2>
            </div>
            <select className="text-sm font-medium border-gray-200 rounded-lg shadow-sm dark:bg-gray-700/50 dark:border-gray-600 dark:text-white p-2 outline-none focus:ring-2 focus:ring-blue-500">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="flex-1 w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#6B7280" opacity={0.15} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 13, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 13, fontWeight: 500}} tickFormatter={(value) => `₹${value}`} dx={-10} />
                <Tooltip 
                  cursor={{fill: 'rgba(59, 130, 246, 0.05)'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px 16px', fontWeight: 'bold'}}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold dark:text-white">Recent Activity</h2>
            <Link to="/reports" className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {[
              { title: 'Payment Received', desc: '₹ 5,000 from Ramesh Singh', time: '10 mins ago', Icon: Banknote, color: 'text-green-600 bg-green-100 dark:bg-green-500/20 dark:text-green-400' },
              { title: 'New Job Card', desc: 'Mahindra Tractor Engine Repair', time: '1 hour ago', Icon: Plus, color: 'text-blue-600 bg-blue-100 dark:bg-blue-500/20 dark:text-blue-400' },
              { title: 'Part Added', desc: '5x Engine Oil Filter', time: '3 hours ago', Icon: Package, color: 'text-purple-600 bg-purple-100 dark:bg-purple-500/20 dark:text-purple-400' },
              { title: 'Udhari Updated', desc: '₹ 2,000 added for Suresh', time: '5 hours ago', Icon: BookOpen, color: 'text-orange-600 bg-orange-100 dark:bg-orange-500/20 dark:text-orange-400' },
              { title: 'Job Completed', desc: 'Swaraj Tractor Servicing', time: '1 day ago', Icon: CheckCircle, color: 'text-teal-600 bg-teal-100 dark:bg-teal-500/20 dark:text-teal-400' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start group hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 -m-2 rounded-xl transition-colors cursor-pointer">
                <div className={`p-3 rounded-xl ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                  <item.Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{item.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                  <p className="text-xs text-gray-400 font-medium mt-1.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
