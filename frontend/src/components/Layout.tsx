import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Bell, ChevronDown, X, Menu, LayoutDashboard, PieChart as PieChartIcon, Users, Wrench, BookOpen, MapPin, CreditCard, Truck, Package, LogOut } from 'lucide-react';
import AIAssistantWidget from './AIAssistantWidget';
import bgVideo from '../assets/issmaye_ki_video_banni_h_me.mp4';

export default function Layout({ children }: { children: React.ReactNode }) {
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Load theme from localStorage or default
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== 'false';
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
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProfileData(prev => ({...prev, name: user.name || prev.name, email: user.email || prev.email, photo: user.photo || ''}));
      } catch {
        // ignore parsing errors
      }
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
          const count = data.filter((item: { quantity: number; minStock: number }) => item.quantity <= item.minStock).length;
          setLowStockCount(count);
        }
      }).catch(() => {});
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      const body: Record<string, string> = { name: profileData.name, email: profileData.email };
      if (profileData.password) body.password = profileData.password;
      if (profileData.photo) body.photo = profileData.photo;
      
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + '/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.user) sessionStorage.setItem('user', JSON.stringify(data.user));
        alert('Profile updated successfully!');
        setShowProfile(false);
      } else {
        alert('Failed to update profile');
      }
    } catch {
      alert('Error updating profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 flex font-sans">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-[90] backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-[100] transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 flex flex-col flex-shrink-0 shadow-2xl overflow-hidden`}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
        {/* Subtle overlay to keep text readable without hiding the video */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/40 z-0"></div>
        <div className="relative z-10 flex flex-col h-full w-full">
          <div className="p-6 pb-2 text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="leading-tight">Shiv Shakti<br/><span className="text-sm font-bold text-gray-200 md:text-gray-500 md:dark:text-gray-400">Auto Parts & Workshop</span></span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-2 rounded-full hover:bg-black/20 text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto mt-4 custom-scrollbar">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={navLinkClass(item.path)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-800/50 m-2">
            <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-left text-red-400 hover:text-red-500 md:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl font-semibold transition-colors">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50/50 dark:bg-[#0f172a] h-screen overflow-hidden">
        <header className="h-20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 flex items-center justify-between px-4 sm:px-8 flex-shrink-0 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <div className="font-bold text-lg dark:text-white">Shiv Shakti</div>
          </div>
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
        
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
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
