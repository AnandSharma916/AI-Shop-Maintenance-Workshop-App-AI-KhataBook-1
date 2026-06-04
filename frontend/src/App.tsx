import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Bell, ChevronDown, X } from 'lucide-react';
import Customers from './pages/Customers';
import Inventory from './pages/Inventory';
import Udhari from './pages/Udhari';
import JobCards from './pages/JobCards';
import Expenses from './pages/Expenses';
import Villages from './pages/Villages';
import Login from './pages/Login';
import Reports from './pages/Reports';
import Suppliers from './pages/Suppliers';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

import { TrendingUp, TrendingDown, Clock, AlertTriangle, ArrowRight, Activity, Wrench as WrenchIcon, Banknote, ShieldAlert, CheckCircle, Plus } from 'lucide-react';

function Dashboard() {
  
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
            onClick={() => alert('📥 Downloading Premium PDF Report...')}
            whileHover={{ scale: 1.03, y: -2 }} 
            whileTap={{ scale: 0.97 }} 
            className="bg-[#161f2e] border border-gray-700/50 text-gray-200 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-black/20 hover:bg-[#1d283a] hover:border-gray-500/50 transition-all backdrop-blur-sm"
          >
            Download Report
          </motion.button>
          <motion.button 
            onClick={() => window.location.href = '/jobcards'}
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

import { LayoutDashboard, PieChart as PieChartIcon, Users, Wrench, BookOpen, MapPin, CreditCard, Truck, Package, LogOut } from 'lucide-react';

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/reports', label: 'AI Reports', icon: PieChartIcon },
    { path: '/customers', label: 'Customers', icon: Users },
    { path: '/jobcards', label: 'Job Cards', icon: Wrench },
    { path: '/udhari', label: 'Udhari Ledger', icon: BookOpen },
    { path: '/villages', label: 'Villages & Cities', icon: MapPin },
    { path: '/expenses', label: 'Expenses', icon: CreditCard },
    { path: '/suppliers', label: 'Vaypari (Suppliers)', icon: Truck },
    { path: '/inventory', label: 'Inventory', icon: Package },
  ];

  const navLinkClass = (path: string) => 
    `flex items-center gap-3 p-3 rounded-xl cursor-pointer font-medium transition-all duration-200 ${
      location.pathname === path 
      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 translate-x-1' 
      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
    }`;

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Load theme from localStorage or default
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  
  const [themeColor, setThemeColor] = useState(() => {
    return localStorage.getItem('themeColor') || 'blue';
  });

  const [lowStockCount, setLowStockCount] = useState(0);
  
  const [profileData, setProfileData] = useState({
    name: 'Admin',
    email: 'admin@garage.com',
    password: '',
    photo: ''
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setProfileData(prev => ({...prev, name: user.name || prev.name, email: user.email || prev.email, photo: user.photo || ''}));
      } catch(e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('themeColor', themeColor);
    document.body.className = `theme-${themeColor}`;
  }, [themeColor]);

  // Fetch low stock alerts
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + '/api/inventory')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const count = data.filter((item:any) => item.quantity <= item.minStock).length;
          setLowStockCount(count);
        }
      }).catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const body: any = { name: profileData.name, email: profileData.email };
      if (profileData.password) body.password = profileData.password;
      if (profileData.photo) body.photo = profileData.photo;
      
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + '/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
        alert('Profile updated successfully!');
        setShowProfile(false);
      } else {
        alert('Failed to update profile');
      }
    } catch (err) {
      alert('Error updating profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 flex font-sans">
      <aside className="w-72 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 hidden md:flex flex-col flex-shrink-0 shadow-2xl z-50">
        <div className="p-6 pb-2 text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="leading-tight">Shiv Shakti<br/><span className="text-sm font-bold text-gray-500 dark:text-gray-400">Auto Parts & Workshop</span></span>
        </div>
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto mt-4 custom-scrollbar">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={navLinkClass(item.path)}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-800/50 m-2">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl font-semibold transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50/50 dark:bg-[#0f172a]">
        <header className="h-20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 flex items-center justify-between px-8 flex-shrink-0 sticky top-0 z-40 shadow-sm">
          <div className="font-bold text-lg md:hidden">Shiv Shakti</div>
          <div className="hidden md:block"></div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative flex items-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden pr-2 shadow-sm">
                <select 
                  value={themeColor} 
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="bg-transparent border-none outline-none p-1.5 pl-3 text-sm dark:text-white cursor-pointer appearance-none pr-6 focus:ring-0 [color-scheme:light] dark:[color-scheme:dark]"
                >
                  <option className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white" value="blue">Blue</option>
                  <option className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white" value="green">Green</option>
                  <option className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white" value="purple">Purple</option>
                  <option className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white" value="orange">Orange</option>
                  <option className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white" value="red">Red</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 pointer-events-none" />
              </div>
              
              <button 
                onClick={() => setDarkMode(!darkMode)} 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 shadow-sm flex items-center justify-center"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <Moon className="w-5 h-5 text-blue-400" fill="currentColor" /> : <Sun className="w-5 h-5 text-yellow-500" fill="currentColor" />}
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)} 
                  onBlur={() => setTimeout(() => setShowNotifications(false), 200)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative text-gray-600 dark:text-gray-300 shadow-sm"
                >
                  <Bell className="w-5 h-5" />
                  {lowStockCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                      {lowStockCount}
                    </span>
                  )}
                </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700 font-bold dark:text-white">
                    Notifications
                  </div>
                  <div className="p-2">
                    {lowStockCount > 0 ? (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded cursor-pointer" onClick={() => navigate('/inventory')}>
                        <p className="font-bold">⚠️ Low Stock Alert</p>
                        <p className="text-sm">{lowStockCount} parts are running low. Click to restock.</p>
                      </div>
                    ) : (
                      <p className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">You're all caught up!</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <img src="/images/admin_avatar.png" className="w-9 h-9 rounded-full object-cover border-2 border-blue-500/50" alt="Admin" />
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>

      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Edit Profile</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 bg-blue-500 rounded-full overflow-hidden mb-2 text-white flex items-center justify-center text-2xl font-bold">
                  {profileData.photo ? <img src={profileData.photo} className="w-full h-full object-cover" /> : profileData.name.charAt(0).toUpperCase()}
                </div>
                <label className="cursor-pointer text-sm text-blue-600 hover:underline dark:text-blue-400">
                  Change Photo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setProfileData({...profileData, photo: reader.result as string});
                      reader.readAsDataURL(file);
                    }
                  }} />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Name</label>
                <input type="text" required value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email Address</label>
                <input type="email" required value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">New Password (Optional)</label>
                <input type="password" placeholder="Leave blank to keep same" value={profileData.password} onChange={(e) => setProfileData({...profileData, password: e.target.value})} className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowProfile(false)} className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <AIAssistantWidget />
    </div>
  );
}

function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: 'Hello! I am your Shiv Shakti AI. I can analyze inventory, predict udhari defaults, or summarize job cards. How can I help?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: 'Analyzing... Based on recent data, I recommend re-stocking Engine Oil as it has high demand this week.' }]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-blue-500/20 overflow-hidden flex flex-col h-[450px]"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse"><Wrench className="w-4 h-4" /></div>
                <span className="font-bold">Shiv Shakti AI</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-600'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2">
              <input 
                type="text" 
                value={input} 
                onChange={e => setInput(e.target.value)}
                placeholder="Ask AI anything..." 
                className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-2 outline-none text-sm dark:text-white border border-transparent focus:border-blue-500/50 transition-colors"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-colors shadow-sm"><ArrowRight className="w-5 h-5" /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white flex items-center justify-center shadow-lg shadow-blue-500/40 relative"
      >
        <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20"></span>
        <Wrench className="w-6 h-6" />
      </motion.button>
    </div>
  );
}

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={
        <PrivateRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/udhari" element={<Udhari />} />
              <Route path="/villages" element={<Villages />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/jobcards" element={<JobCards />} />
            </Routes>
          </Layout>
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default App;
