import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSendOtpMutation, useVerifyOtpMutation } from '../features/api/apiSlice';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // Step 1: Send OTP | Step 2: Verify OTP
  
  const [identifier, setIdentifier] = useState(''); // Handles both Email and Phone
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Using the OTP mutations you added to your apiSlice
  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();

  // Parse the URL to see if they were kicked out of a restricted page
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  // If they are already logged in, send them directly to their destination
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect]);

  // Helper to determine if the input is purely numeric
  const isPhone = /^\d+$/.test(identifier);

  const handleIdentifierChange = (e) => {
    const val = e.target.value;
    // If user is typing only numbers, restrict it to max 10 digits
    if (/^\d+$/.test(val) && val.length > 10) {
      return; 
    }
    setIdentifier(val);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    // Enforce exactly 10 digits if they are using a mobile number
    if (isPhone && identifier.length < 10) {
      alert('Mobile number must be exactly 10 digits.');
      return;
    }

    try {
      // FIX: Changed 'phone' to 'mobileNumber' to match your backend database schema
      const payload = isPhone ? { mobileNumber: identifier } : { email: identifier };
      
      // If registering, pass the name along
      if (!isLogin) {
        payload.name = name;
      }

      await sendOtp(payload).unwrap();
      
      alert(`OTP sent successfully to your ${isPhone ? 'mobile number' : 'email'}!`);
      setStep(2); // Move to OTP verification screen
    } catch (err) {
      alert(err?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      // FIX: Changed 'phone' to 'mobileNumber' here as well
      const payload = isPhone ? { mobileNumber: identifier, otp } : { email: identifier, otp };
      
      // Let backend know if this is a registration or login attempt
      if (!isLogin) {
        payload.name = name;
        payload.isRegister = true; 
      } else {
        payload.isLogin = true;
      }

      const res = await verifyOtp(payload).unwrap();
      
      // Save credentials and token
      localStorage.setItem('userInfo', JSON.stringify(res));
      
      // Bounce them to the dashboard (or home if no redirect is set)
      navigate(redirect);
      window.location.reload(); // Refresh to update Navbars/Redux state
    } catch (err) {
      alert(err?.data?.message || 'Invalid OTP. Please check the code and try again.');
    }
  };

  return (
    <main className="pt-32 pb-24 min-h-screen bg-surface flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      <div className="card-surface p-8 md:p-12 rounded-[3rem] shadow-soft w-full max-w-md relative z-10 border border-white animate-[fadeIn_0.3s_ease-out]">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-container text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
             <span className="material-symbols-outlined text-[32px]">
               {step === 1 ? (isLogin ? 'lock_open' : 'person_add') : 'dialpad'}
             </span>
          </div>
          
          <h1 className="text-3xl font-black text-zinc-800 tracking-tight">
            {step === 1 ? (isLogin ? 'Welcome Back' : 'Create Account') : 'Verification'}
          </h1>
          
          <p className="text-zinc-500 font-bold mt-2">
            {step === 1 
              ? (isLogin ? 'Enter your details below to receive a secure OTP.' : 'Join the magic of ToyVenture with a quick OTP.')
              : `Enter the 6-digit code sent to ${identifier}`
            }
          </p>
        </div>

        {/* STEP 1: SEND OTP FORM */}
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-600 ml-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="John Doe" 
                  className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner font-medium text-zinc-800" 
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-600 ml-1">Email or Mobile Number</label>
              <input 
                type="text" 
                required 
                value={identifier} 
                onChange={handleIdentifierChange} 
                placeholder="hello@toyventure.com OR 9876543210" 
                className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner font-medium text-zinc-800" 
              />
            </div>

            <button type="submit" disabled={isSending || !identifier} className="w-full py-4 mt-4 bg-zinc-900 text-white font-black text-lg rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0">
              {isSending ? 'Sending OTP...' : 'Get Secure OTP'}
              {!isSending && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
            </button>
          </form>

        ) : (

        /* STEP 2: VERIFY OTP FORM */
          <form onSubmit={handleVerifyOtp} className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-600 ml-1">Secure OTP Code</label>
              <input 
                type="text" 
                required 
                maxLength="6"
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                placeholder="••••••" 
                className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner font-black text-zinc-800 text-center text-2xl tracking-[0.5em]" 
              />
            </div>

            <button type="submit" disabled={isVerifying || otp.length < 4} className="w-full py-4 mt-4 bg-primary-container text-white font-black text-lg rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0">
              {isVerifying ? 'Verifying...' : 'Verify & Login'}
              {!isVerifying && <span className="material-symbols-outlined text-[20px]">verified_user</span>}
            </button>

            <div className="text-center mt-4">
              <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-zinc-500 hover:text-zinc-800 transition-colors">
                &larr; Change {isPhone ? 'mobile number' : 'email address'}
              </button>
            </div>
          </form>
        )}

        {/* TOGGLE LOGIN / SIGNUP (Only visible on Step 1) */}
        {step === 1 && (
          <div className="mt-8 text-center border-t border-zinc-100 pt-6">
            <p className="text-sm font-bold text-zinc-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={() => { setIsLogin(!isLogin); setIdentifier(''); }} className="text-primary-container hover:text-orange-600 hover:underline transition-all">
                {isLogin ? 'Sign up here' : 'Login here'}
              </button>
            </p>
          </div>
        )}

      </div>
    </main>
  );
};

export default Auth;