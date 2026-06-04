import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, ShieldCheck, Zap, Instagram, Facebook, Twitter } from 'lucide-react';
import bgVideo from '../assets/issmaye_ki_video_banni_h_me.mp4';

const Typewriter = ({ texts }: { texts: string[] }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? 50 : subIndex === texts[index].length ? 1000 : 100, parseInt((Math.random() * 50).toString())));

    setDisplayText(texts[index].substring(0, subIndex));
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  return (
    <span className="text-blue-400 font-bold border-r-4 border-blue-400 pr-1 animate-pulse">
      {displayText}
    </span>
  );
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showOtpInput && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpInput, timer]);

  const handleSendOtp = async () => {
    const url = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + '/api/auth/send-otp';
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (res.ok) {
      setShowOtpInput(true);
      setTimer(120);
      alert('OTP sent to Admin (9479454314). Please enter it below.');
    } else {
      alert(data.message || 'Error sending OTP');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister && !showOtpInput) {
        await handleSendOtp();
      } else {
        // Step 2: Login or Verify & Register
        const url = isRegister ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + '/api/auth/register' : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + '/api/auth/login';
        const bodyData: any = { email, password };
        if (isRegister) bodyData.otp = otp;

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData)
        });
        const data = await res.json();
        if (res.ok) {
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('user', JSON.stringify(data.user));
          navigate('/');
        } else {
          alert(data.message || (data.error) || 'Error');
        }
      }
    } catch (err: any) {
      console.error("Login/Register Error:", err);
      alert('Error connecting to server: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Side - Dark Premium Dashboard Preview */}
      <div 
        className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#060b14]" 
      >
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
        {/* Lighter overlay to ensure text is readable but video is very clear */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        {/* Subtle Neon Accents */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px] pointer-events-none z-0"></div>
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGg0MHYxSDB6bTAgMHY0MGgxVjB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+Cjwvc3ZnPg==')] opacity-50 z-0"></div>

        <div className="absolute inset-0 flex flex-col justify-center px-16 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-[0_0_40px_rgba(37,99,235,0.3)] mb-8">
              <Wrench className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
              Manage Your Garage <br/>
              <span className="text-gray-400">With </span>
              <Typewriter texts={["Smart AI Reports", "Easy Inventory", "Digital Udhari", "Fast Billing"]} />
            </h1>
            <p className="mt-6 text-xl text-gray-400 font-medium leading-relaxed max-w-lg">
              Shiv Shakti Auto Parts & Workshop admin panel. Streamline your entire workflow from a single, powerful dashboard.
            </p>

            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-4 bg-[#0a101f]/60 backdrop-blur-md border border-gray-800/50 p-4 rounded-2xl w-max shadow-lg">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-white font-bold">Secure Access</p>
                  <p className="text-gray-400 text-sm">Enterprise-grade security</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[#0a101f]/60 backdrop-blur-md border border-gray-800/50 p-4 rounded-2xl w-max ml-12 shadow-lg">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-white font-bold">Lightning Fast</p>
                  <p className="text-gray-400 text-sm">Optimized for speed</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Socials */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-16 z-20 flex items-center gap-6"
        >
          <p className="text-gray-400 text-sm font-medium mr-4">Connect with us:</p>
          {[
            { icon: Instagram, color: 'hover:text-pink-500' },
            { icon: Facebook, color: 'hover:text-blue-500' },
            { icon: Twitter, color: 'hover:text-sky-400' }
          ].map((social, i) => (
            <motion.a 
              key={i}
              href="#"
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.9 }}
              className={`text-gray-400 transition-colors ${social.color}`}
            >
              <social.icon className="w-6 h-6" />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Right Side - Login Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative overflow-hidden bg-[#0b1120]">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-4">
              <Wrench className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Shiv Shakti</h1>
            <p className="text-gray-400 font-medium mt-1">Auto Parts & Workshop</p>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {isRegister ? (showOtpInput ? 'Enter Admin OTP' : 'Create an account') : 'Welcome back'}
            </h2>
            <p className="text-gray-400 mt-2">
              {isRegister ? (showOtpInput ? 'Enter the secure code sent to the admin.' : 'Enter your details to get started.') : 'Please enter your details to sign in.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!showOtpInput ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-300">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full p-3.5 bg-[#131c31] border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 text-white outline-none transition-all shadow-inner placeholder-gray-500"
                    value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@garage.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-300">Password</label>
                  <input 
                    type="password" 
                    className="w-full p-3.5 bg-[#131c31] border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 text-white outline-none transition-all shadow-inner placeholder-gray-500"
                    value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-300">6-Digit OTP Code</label>
                  <input 
                    type="text" 
                    maxLength={6}
                    className="w-full p-4 bg-[#131c31] border border-blue-500/30 rounded-xl focus:ring-2 focus:ring-blue-500 text-white outline-none transition-all shadow-[0_0_15px_rgba(37,99,235,0.15)] text-center text-3xl tracking-[1em] font-mono font-bold"
                    value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} required placeholder="------"
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Didn't receive code?</span>
                  <button 
                    type="button" 
                    onClick={handleSendOtp}
                    disabled={timer > 0}
                    className={`font-bold transition-colors ${timer > 0 ? 'text-gray-500 cursor-not-allowed' : 'text-blue-400 hover:text-blue-300'}`}
                  >
                    {timer > 0 ? `Resend in ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}` : 'Resend OTP'}
                  </button>
                </div>
              </motion.div>
            )}
            
            {!isRegister && (
              <div className="flex justify-end">
                <a href="#" className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
              </div>
            )}

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-4 rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all text-lg mt-4 border border-blue-500/50 flex items-center justify-center gap-2"
            >
              {isRegister ? (showOtpInput ? 'Verify & Secure Registration' : 'Request OTP') : 'Sign In'}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-gray-400">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => {
                setIsRegister(!isRegister);
                setShowOtpInput(false);
                setTimer(0);
              }} 
              className="text-blue-400 font-bold hover:text-blue-300 transition-colors hover:underline"
            >
              {isRegister ? 'Log in' : 'Sign up'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
