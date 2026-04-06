import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    useSendOtpMutation, 
    useVerifyOtpMutation, 
    useUpdateUserProfileMutation 
} from '../features/api/apiSlice';

const Auth = () => {
  const [step, setStep] = useState(1); 
  
  const [identifier, setIdentifier] = useState(''); 
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    // 1. Clear phone number and otp when the page loads
    setIdentifier('');
    setOtp('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect]);

  const isPhone = /^\d+$/.test(identifier);

  const handleIdentifierChange = (e) => {
    const val = e.target.value;
    if (/^\d+$/.test(val) && val.length > 10) return; 
    setIdentifier(val);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (isPhone && identifier.length < 10) {
      toast.error('Mobile number must be exactly 10 digits.');
      return;
    }

    try {
      const payload = isPhone ? { mobileNumber: identifier } : { email: identifier };
      const res = await sendOtp(payload).unwrap();
      
      toast.success(res.message || `OTP sent successfully!`);
      setStep(2); 
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const payload = isPhone ? { mobileNumber: identifier, otp } : { email: identifier, otp };
      
      const res = await verifyOtp(payload).unwrap();
      
      // Save credentials & token IMMEDIATELY so the next Step 3 API call is authenticated
      localStorage.setItem('userInfo', JSON.stringify(res));
      localStorage.setItem('token', res.token); 
      
      // BUG FIX: Check res.isNewUser directly from the backend response
      if (res.isNewUser) {
          setStep(3);
          toast.success("OTP Verified! Let's set up your profile.");
      } else {
          // Extra safety check in case a returning user's name is somehow missing
          const firstName = res.name ? res.name.split(' ')[0] : 'User';
          toast.success(`Welcome back, ${firstName}!`);
          setTimeout(() => {
              navigate(redirect);
              window.location.reload(); 
          }, 1000);
      }

    } catch (err) {
      toast.error(err?.data?.message || 'Invalid OTP. Please check the code and try again.');
      
      // 2. Clear phone number and otp when OTP is wrong/invalid, and reset to step 1
      setOtp('');
      setIdentifier('');
      setStep(1);
    }
  };

  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
        toast.error("Please enter your name.");
        return;
    }

    try {
        await updateProfile({ name }).unwrap();

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        userInfo.name = name;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        toast.success(`Welcome to ToyVenture, ${name.split(' ')[0]}!`);
        
        setTimeout(() => {
            navigate(redirect);
            window.location.reload(); 
        }, 1000);
    } catch (err) {
        toast.error(err?.data?.message || 'Failed to save name. You can update it later in your profile.');
        setTimeout(() => { navigate(redirect); window.location.reload(); }, 1500);
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
               {step === 1 ? 'waving_hand' : (step === 2 ? 'dialpad' : 'person')}
             </span>
          </div>
          
          <h1 className="text-3xl font-black text-zinc-800 tracking-tight">
            {step === 1 && 'Login or Sign Up'}
            {step === 2 && 'Verification'}
            {step === 3 && 'Almost Done!'}
          </h1>
          
          <p className="text-zinc-500 font-bold mt-2">
            {step === 1 && 'Enter your email or mobile number and log in with a secure OTP to continue.'}
            {step === 2 && `Enter the 6-digit code sent to ${identifier}`}
            {step === 3 && 'What should we call you?'}
          </p>
        </div>

        {/* STEP 1: SEND OTP FORM */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-600 ml-1">Email or Mobile Number</label>
              <input 
                type="text" 
                required 
                value={identifier} 
                onChange={handleIdentifierChange} 
                placeholder="" 
                className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner font-medium text-zinc-800" 
              />
            </div>

            <button type="submit" disabled={isSending || !identifier} className="w-full py-4 mt-4 bg-zinc-900 text-white font-black text-lg rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0">
              {isSending ? 'Sending OTP...' : 'Continue with OTP'}
              {!isSending && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
            </button>
          </form>
        )}

        {/* STEP 2: VERIFY OTP FORM */}
        {step === 2 && (
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
              {isVerifying ? 'Verifying...' : 'Verify & Continue'}
              {!isVerifying && <span className="material-symbols-outlined text-[20px]">verified_user</span>}
            </button>

            <div className="text-center mt-4">
              <button type="button" onClick={() => { setStep(1); setOtp(''); }} className="text-sm font-bold text-zinc-500 hover:text-zinc-800 transition-colors">
                &larr; Change {isPhone ? 'mobile number' : 'email address'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: CAPTURE NAME (Only for New Users) */}
        {step === 3 && (
          <form onSubmit={handleCompleteProfile} className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-600 ml-1">Your Full Name</label>
              <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. John Doe" 
                  className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner font-medium text-zinc-800" 
              />
            </div>

            <button type="submit" disabled={isUpdatingProfile} className="w-full py-4 mt-4 bg-zinc-900 text-white font-black text-lg rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0">
              {isUpdatingProfile ? 'Saving...' : 'Complete Setup'}
              {!isUpdatingProfile && <span className="material-symbols-outlined text-[20px]">check_circle</span>}
            </button>
          </form>
        )}

      </div>
    </main>
  );
};

export default Auth;