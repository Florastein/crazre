import React, { useState } from 'react';
import { useAppState } from '../../contexts/StateContext';
import { 
  Eye, EyeOff, ShieldCheck, Mail, Lock, BookOpen, 
  User, ChevronRight, AlertCircle, Key, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LoginPage({ onBackToLanding }) {
  const { login, users, createUser } = useAppState();
  
  // Auth view toggles
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@scrabble.io');
  const [password, setPassword] = useState('password123'); // Preset for mock convenience
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [signupRole, setSignupRole] = useState('student'); // 'student' | 'supervisor'
  
  // Custom interaction states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Developer access keys overlay
  const [showDevAccess, setShowDevAccess] = useState(false);

  // Simulated Google popup window states
  const [showGooglePopup, setShowGooglePopup] = useState(false);
  const [googleLoadingAccount, setGoogleLoadingAccount] = useState(null);

  // Quick Login pre-sets for dev convenience
  const previewUsers = [
    { name: 'Sarah Al-Zaid', email: 'sarah@zaid.edu', role: 'Student' },
    { name: 'Dr. Sterling', email: 'a.sterling@zaid.edu', role: 'Lecturer / Supervisor' },
    { name: 'Dr. Vance', email: 'm.vance@zaid.edu', role: 'HOD / Admin' },
    { name: 'Chancellor Grey', email: 'a.grey@zaid.edu', role: 'Super Admin' },
  ];

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (!email) {
      setError('Please provide an authorized university email address.');
      return;
    }
    setLoading(true);
    setError('');

    setTimeout(() => {
      try {
        login(email, password);
      } catch (err) {
        setError(err.message || 'Verification failed. Credentials did not match archives.');
      } finally {
        setLoading(false);
      }
    }, 600);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!email.toLowerCase().endsWith('@zaid.edu')) {
      setError('Registration is restricted to authorized @zaid.edu email domains.');
      return;
    }
    if (password.length < 6) {
      setError('Security password must contain at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password confirmation does not match the entered password.');
      return;
    }

    setLoading(true);
    setError('');

    // Derive name gracefully from email prefix
    const usernamePart = email.split('@')[0] || 'student';
    const derivedName = usernamePart
      .split(/[._-]/)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');

    setTimeout(() => {
      try {
        // Check if user already exists
        const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          throw new Error('This academic email address is already registered in our archives. Please sign in.');
        }

        // Provision the user in our StateContext (role is always student)
        const indexNum = `CS/2026/${Math.floor(100 + Math.random() * 900)}`;
        createUser(
          derivedName, 
          email, 
          'student', 
          indexNum, 
          'BSc. Computer Science', 
          '400', 
          'Computer Science'
        );

        // Automatically log them in after registration
        login(email, password);
      } catch (err) {
        setError(err.message || 'Could not compile registration. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  const handleQuickLogin = (pEmail) => {
    setEmail(pEmail);
    setPassword('password123');
    setLoading(true);
    setError('');
    setTimeout(() => {
      try {
        login(pEmail, 'password123');
      } catch (err) {
        setError(err.message || 'Invalid academic credentials.');
      } finally {
        setLoading(false);
        setShowDevAccess(false);
      }
    }, 450);
  };

  // Google Simulated Popup Selection Flow
  const triggerGooglePopupSelect = (pEmail) => {
    setGoogleLoadingAccount(pEmail);
    setTimeout(() => {
      try {
        // Provision the mock user if they register via Google, or load directly
        const matched = users.find(u => u.email.toLowerCase() === pEmail.toLowerCase());
        if (matched) {
          login(pEmail, 'password123');
        } else {
          // Auto create client record if missing
          const defaultGoogleName = pEmail.split('@')[0].toUpperCase();
          const pName = defaultGoogleName.charAt(0) + defaultGoogleName.slice(1).toLowerCase() + ' (SSO)';
          createUser(
            pName,
            pEmail,
            'student',
            `SSO/2026/${Math.floor(100 + Math.random() * 900)}`,
            'BSc. Computer Science',
            '400',
            'Computer Science'
          );
          login(pEmail, 'password123');
        }
        setShowGooglePopup(false);
      } catch (err) {
        setError(err.message || 'Google SSO verification failed.');
      } finally {
        setGoogleLoadingAccount(null);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f4f8] p-4 md:p-8 relative overflow-hidden font-sans select-none" id="login_container">

      {/* Return to Landing Page Action */}
      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          className="absolute top-4 left-4 z-30 flex items-center space-x-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white/95 backdrop-blur-xs border border-slate-300 px-3.5 py-2 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </button>
      )}

      {/* Grid / Dot Texture Overlay - replicates screenshot's fine dot background exactly */}
      <div className="absolute inset-0 bg-[#f1f5f9] select-none pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
        backgroundSize: '20px 20px',
        opacity: 0.45
      }} id="login_dot_overlay" />

      {/* GIANT WATERMARK TEXT OVERLAY BEHIND CARD */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.035] z-0" id="login_bg_watermark">
        <span className="text-[20rem] md:text-[35rem] lg:text-[45rem] font-dmsans font-extrabold text-[#0f172a] transform -rotate-12 tracking-tighter leading-none select-none">
          acaDEX
        </span>
      </div>

      {/* MAIN ACADEMIC SPREAD CARD */}
      <div className="w-full max-w-[1020px] bg-white border border-[#cbd5e1] shadow-2xl flex flex-col md:flex-row relative z-10 overflow-hidden min-h-[500px] md:min-h-[580px]" style={{ borderRadius: '0px' }} id="login_card">
        
        {/* LEFT SECTION - Institutional Cover Page */}
        <div className="hidden md:flex w-full md:w-1/2 p-8 md:p-14 lg:p-16 flex-col justify-between relative bg-white md:border-r border-slate-100" id="login_left_panel">
          
          {/* Est. 2026 Stamp */}
          <div className="absolute top-10 right-10 transform rotate-12 origin-top-right border border-emerald-400 border-opacity-70 bg-emerald-500/5 text-emerald-600 font-mono text-[10px] uppercase px-2 py-0.5 tracking-widest leading-none select-none font-bold" id="login_left_stamp">
            EST. 2026
          </div>

          {/* Header Brand Block */}
          <div className="flex items-center space-x-4 text-left" id="login_left_brand">
            <div className="w-12 h-12 bg-[#0c1322] flex items-center justify-center text-white font-serif text-2xl font-bold select-none shrink-0" style={{ borderRadius: '0px' }} id="login_brand_a">
              A
            </div>
            <div className="flex flex-col">
              <h2 className="serif-brand-title text-2xl font-extrabold italic leading-none mb-1">
                acaDEX
              </h2>
              <span className="text-[9px] tracking-widest text-[#8a99ad] font-mono uppercase font-bold leading-none">
                ARCHIVE & SUPERVISION
              </span>
            </div>
          </div>

          {/* Middle Typography Block */}
          <div className="my-auto py-8 space-y-4" id="login_left_middle">
            <div className="space-y-1">
              <span className="font-serif italic text-ink text-[36px] block text-left leading-none">
                Initialize
              </span>
              <span className="font-serif italic font-bold text-emerald-600 text-[36px] block text-left mt-1 leading-none">
                Research Protocol
              </span>
            </div>

            <p className="text-[#64748b] font-sans text-[18px] leading-relaxed text-left py-4 select-none max-w-sm">
              "Enter the secure repository for advanced academic collaboration and milestone synthesis."
            </p>

            {/* Indices/Features block */}
            <div className="space-y-4 pt-4" id="login_left_features">
              
              {/* Feature I */}
              <div className="flex items-start space-x-4 text-left">
                <div className="w-10 h-10 border border-emerald-500 flex items-center justify-center shrink-0" style={{ borderRadius: '0px' }}>
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-[#0f172a] tracking-wider font-sans uppercase">
                    CENTRAL LEDGER
                  </span>
                  <span className="text-slate-500 text-[11px] font-sans mt-0.5 leading-normal">
                    Secure tracking of intellectual property.
                  </span>
                </div>
              </div>

              {/* Feature II */}
              <div className="flex items-start space-x-4 text-left">
                <div className="w-10 h-10 border border-emerald-500 flex items-center justify-center shrink-0" style={{ borderRadius: '0px' }}>
                  <span className="font-mono text-emerald-600 text-sm font-bold">#</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-[#0f172a] tracking-wider font-sans uppercase">
                    INDEXED METADATA
                  </span>
                  <span className="text-slate-500 text-[11px] font-sans mt-0.5 leading-normal">
                    Automated document versioning.
                  </span>
                </div>
              </div>

            </div>
          </div>


        </div>

        {/* RIGHT SECTION - Authentic Interactive Form Panel */}
        <div className="w-full md:w-1/2 p-6 md:p-14 lg:p-16 flex flex-col justify-between relative bg-white" id="login_right_panel">
          
          {/* Portal Entry Tag */}
          <span className="absolute top-6 right-6 md:top-10 md:right-10 text-[9px] text-[#cbd5e1] font-mono tracking-widest uppercase font-bold select-none" id="login_portal_tag">
            PORTAL: ENTRY_01
          </span>

          {/* Authenticated Hub Stamp on Bottom Right */}
          <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 hidden sm:block select-none" id="login_right_stamp">
            <span className="border border-emerald-400 border-opacity-70 bg-emerald-500/5 text-emerald-600 font-mono text-[9px] uppercase px-2 py-0.5 tracking-widest leading-none font-bold transform -rotate-6 inline-block">
              AUTHENTICATED HUB
            </span>
          </div>

          <div className="my-auto py-6 md:py-8 space-y-6 w-full max-w-sm mx-auto" id="login_right_middle">
            
            {/* Header Brand Block for Mobile Only */}
            <div className="flex items-center space-x-4 text-left md:hidden mb-6" id="login_right_mobile_brand">
              <div className="w-10 h-10 bg-[#0c1322] flex items-center justify-center text-white font-serif text-xl font-bold select-none shrink-0" style={{ borderRadius: '0px' }} id="login_mobile_brand_a">
                A
              </div>
              <div className="flex flex-col">
                <h2 className="serif-brand-title text-xl font-extrabold italic leading-none mb-1">
                  acaDEX
                </h2>
                <span className="text-[8px] tracking-widest text-[#8a99ad] font-mono uppercase font-bold leading-none">
                  ARCHIVE & SUPERVISION
                </span>
              </div>
            </div>

            {/* Identity Title Block */}
            <div className="space-y-1 text-left" id="login_right_title">
              <span className="text-[10px] text-[#8a99ad] font-mono tracking-widest font-bold block uppercase">
                AUTHORITY VERIFICATION
              </span>
              <h1 className="font-serif italic text-3xl text-ink leading-tight">
                {isSignUp ? 'Scholastic Enrollment' : 'Authenticate Identity'}
              </h1>
            </div>

            {/* Form Panel */}
            <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-5" id="login_form">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs font-medium text-left" id="login_err_msg">
                  <p className="font-bold uppercase tracking-wider text-[10px] leading-relaxed text-red-700">ALERT KEY ERROR:</p>
                  <p className="mt-0.5">{error}</p>
                </div>
              )}

              {/* Email Address */}
              <div className="space-y-1.5 text-left" id="login_field_email">
                <label className="text-[10px] font-bold text-[#64748b] tracking-wider uppercase block">
                  EMAIL ADDRESS
                </label>
                <div className="bg-[#eef2f6] px-4 py-4 flex items-center space-x-3 w-full">
                  <svg id="Message" width="16" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#8a99ad] shrink-0">
                    <path d="M18.0539 9.38574L12.2899 14.0697L6.5249 9.38574" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"></path>
                    <path d="M6.688 21.5347H2.25V3.53467H22.25V21.5347H10.948" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"></path>
                  </svg>
                  <input 
                    type="email" 
                    required
                    placeholder="admin@scrabble.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-none text-ink text-xs focus:outline-none font-semibold font-sans placeholder:text-muted/50"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5 text-left" id="login_field_password">
                <label className="text-[10px] font-bold text-[#64748b] tracking-wider uppercase block">
                  PASSWORD
                </label>
                <div className="bg-[#eef2f6] px-4 py-4 flex items-center justify-between space-x-3 w-full">
                  <div className="flex items-center space-x-3 w-full">
                    <Lock className="w-4 h-4 text-[#8a99ad] shrink-0" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent border-none text-[#020617] text-xs focus:outline-none font-mono tracking-widest"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#8a99ad] hover:text-[#0c1322] focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (SignUp Only) */}
              {isSignUp && (
                <div className="space-y-1.5 text-left" id="login_field_confirm">
                  <label className="text-[10px] font-bold text-[#64748b] tracking-wider uppercase block">
                    CONFIRM PASSWORD *
                  </label>
                  <div className="bg-[#eef2f6] px-4 py-4 flex items-center justify-between space-x-3 w-full">
                    <div className="flex items-center space-x-3 w-full">
                      <Lock className="w-4 h-4 text-[#8a99ad] shrink-0" />
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-transparent border-none text-ink text-xs focus:outline-none font-mono tracking-widest"
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-[#8a99ad] hover:text-[#0c1322] focus:outline-none cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Main button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#0c1322] hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase py-4 tracking-widest transition-all flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-50 mt-4 shadow-md"
                style={{ borderRadius: '0px' }}
                id="login_submit_btn"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></span>
                ) : (
                  <>
                    <span>{isSignUp ? 'SIGN UP' : 'SIGN IN'}</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </>
                )}
              </button>

            </form>

            {/* Divider "OR" */}
            <div className="relative py-2" id="login_or_divider">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] tracking-widest font-mono uppercase">
                <span className="bg-white px-3 text-[#abbccf] font-bold">OR</span>
              </div>
            </div>

            {/* Sign in with Google */}
            <button
              type="button"
              onClick={() => setShowGooglePopup(true)}
              className="w-full bg-white border border-slate-200 hover:border-slate-400 hover:shadow-xs text-[#0c1322] font-sans text-xs font-bold uppercase py-3.5 tracking-wider flex items-center justify-center space-x-3 cursor-pointer transition-all"
              style={{ borderRadius: '0px' }}
              id="login_google_btn"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.72 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span className="font-mono tracking-widest text-[11px]">SIGN IN WITH GOOGLE</span>
            </button>

            {/* Account Change Link Overlay */}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-[10px] tracking-widest text-[#8a99ad] hover:text-[#0c1322] transition-colors font-bold uppercase font-sans mt-4 focus:outline-none block w-full text-center"
              id="login_signup_toggle_btn"
            >
              {isSignUp ? 'EXISTING ACCOUNT? ACCESS PROTOCOL' : 'NEW RESEARCHER? CREATE ACCOUNT'}
            </button>

          </div>

          <div className="h-4" /> {/* Spacer */}
        </div>
      </div>

      {/* FLOAT DEV PROFILE KEY INDEX UTILITY FLOATER IN BOT-LEFT CORNER */}
      <div className="absolute bottom-4 left-4 z-20" id="login_dev_override_container">
        <button
          type="button"
          onClick={() => setShowDevAccess(!showDevAccess)}
          className="bg-[#0c1322] hover:bg-emerald-700 text-white font-mono text-[10px] tracking-widest uppercase px-3 py-2 flex items-center space-x-1.5 shadow-md border border-slate-700 pointer-events-auto"
          id="login_dev_keys_btn"
        >
          <Key className="w-3.5 h-3.5 text-emerald-400" />
          <span>📖 standard passes</span>
        </button>

        <AnimatePresence>
          {showDevAccess && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-10 left-0 bg-white border border-[#cbd5e1] p-4 shadow-xl w-64 text-left space-y-3 z-30"
              style={{ borderRadius: '0px' }}
              id="login_dev_passes_panel"
            >
              <div className="flex items-center space-x-1.5 text-ink">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-mono font-bold text-[10px] uppercase tracking-wider">TEMP ACCESS KEYPASSES</span>
              </div>
              <div className="space-y-1.5">
                {previewUsers.map(pu => (
                  <button
                    key={pu.email}
                    onClick={() => handleQuickLogin(pu.email)}
                    className="w-full p-2 border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/20 text-left transition-all flex items-center justify-between"
                    style={{ borderRadius: '0px' }}
                  >
                    <div className="truncate pr-2">
                      <p className="font-bold text-xs text-ink truncate leading-tight">{pu.name}</p>
                      <p className="text-[9px] text-[#8a99ad] font-mono leading-tight truncate">{pu.role}</p>
                    </div>
                    <span className="text-emerald-600 font-bold text-xs shrink-0">→</span>
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-muted italic font-serif leading-none text-center">
                Click any pass block above to instantly authenticate.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER TEXT METADATA */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center z-10 select-none pointer-events-none opacity-[0.25]" id="login_squad_footer">
        <span className="text-[10px] tracking-widest text-[#8a99ad] uppercase font-mono font-bold">
          • THE BASTARD SQUAD ™
        </span>
      </div>

      {/* --- SECURE GOOGLE SSO POPUP MODAL WINDOW --- */}
      <AnimatePresence>
        {showGooglePopup && (
          <div className="fixed inset-0 bg-ink/70 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="login_google_popup">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-[#f0f3f6] border border-[#1e293b] shadow-2xl max-w-md w-full overflow-hidden flex flex-col rounded-none font-sans"
            >
              
              {/* Simulated OS Browser Tab Chrome Window Bar */}
              <div className="bg-[#e2e8f0] border-b border-[#cbd5e1] px-4 py-2 flex items-center justify-between select-none">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
                  <span className="w-3 h-3 rounded-full bg-[#eab308]" />
                  <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
                </div>
                
                <div className="bg-white border border-[#cbd5e1] text-[10px] text-[#475569] px-3 py-0.5 rounded-sm w-48 text-center truncate font-mono flex items-center justify-center space-x-1">
                  <span>🔒</span>
                  <span className="truncate">accounts.google.com/o/oauth2/v2/auth</span>
                </div>

                <button 
                  onClick={() => {
                    if (!googleLoadingAccount) setShowGooglePopup(false);
                  }}
                  className="text-[#475569] hover:text-[#0f172a] text-xs font-bold font-mono p-1 leading-none cursor-pointer focus:outline-none"
                >
                  ✕
                </button>
              </div>

              {/* Popup Content */}
              <div className="bg-white p-8 space-y-6 flex-1 text-center flex flex-col items-center">
                
                <svg className="w-10 h-10 select-none" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.72 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>

                <div className="space-y-1">
                  <h3 className="text-md font-bold font-sans text-[#1e293b]">Choose an institutional profile</h3>
                  <p className="text-[#64748b] text-xs font-sans">To authenticate digital dossiers with <strong className="text-emerald-600">acaDEX</strong></p>
                </div>

                {/* Account Selection Lists */}
                <div className="w-full space-y-2 pt-2 text-left">
                  {previewUsers.map(profile => {
                    const isBeingVerified = googleLoadingAccount === profile.email;
                    return (
                      <button
                        key={profile.email}
                        disabled={googleLoadingAccount !== null}
                        onClick={() => triggerGooglePopupSelect(profile.email)}
                        className={`w-full p-3.5 border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 flex items-center justify-between rounded-lg cursor-pointer transition-all ${
                          googleLoadingAccount !== null && !isBeingVerified ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                        style={{ borderRadius: '0px' }}
                      >
                        <div className="flex items-center space-x-3 truncate">
                          <div className="w-8 h-8 rounded-full bg-slate-200 text-[#1e293b] flex items-center justify-center font-bold text-xs select-none shadow-sm">
                            {profile.name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-[#1e293b]">{profile.name}</p>
                            <p className="text-[10px] text-[#64748b] font-mono">{profile.email}</p>
                          </div>
                        </div>

                        {/* Spinner of selection */}
                        {isBeingVerified ? (
                          <div className="w-4 h-4 border-2 border-[#1e293b] border-t-transparent rounded-full animate-spin shrink-0" />
                        ) : (
                          <span className="text-[10px] bg-white border border-[#cbd5e1] text-[#475569] font-mono px-2 py-0.5 rounded">
                            {profile.role.split(' ').pop().toLowerCase()}
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {/* Add external email placeholder */}
                  <button
                    disabled={googleLoadingAccount !== null}
                    onClick={() => triggerGooglePopupSelect('new.candidate@zaid.edu')}
                    className="w-full p-3.5 border border-dashed border-slate-300 bg-white hover:bg-slate-50 text-center rounded-lg cursor-pointer text-xs text-[#475569] font-medium transition-all flex items-center justify-center space-x-2"
                    style={{ borderRadius: '0px' }}
                  >
                    <span>✦ Use another academic account</span>
                  </button>
                </div>

                {/* Google Safety Note */}
                <div className="pt-4 border-t border-slate-100 w-full text-center">
                  <p className="text-[10px] text-[#94a3b8] font-sans leading-normal">
                    Secure Single Sign-on protocol provided by Google LLC.<br />
                    Access token credentials restricted to acaDEX credentials storage.
                  </p>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
