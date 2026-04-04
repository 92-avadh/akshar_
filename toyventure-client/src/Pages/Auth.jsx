import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Auth = () => {
  const [step, setStep] = useState(1); // Step 1: Mobile, Step 2: OTP
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  
  const navigate = useNavigate(); 
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (mobileNumber.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setStep(2);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      alert("Please enter the complete 4-digit OTP.");
      return;
    }
    alert("Login successful! Let's get back to shopping.");
    navigate('/shop'); 
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 3) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center w-full relative overflow-hidden bg-surface bg-hero-glow py-24 px-6 fade-in">
      
      {/* Decorative Doodle Background */}
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      {/* Main Auth Card */}
      <div className="w-full max-w-[420px] card-surface rounded-[3rem] p-8 md:p-10 relative z-10 shadow-soft">
        
        {/* Close / Keep Shopping Button */}
        <div className="absolute top-6 right-6">
          <Link to="/shop" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 backdrop-blur-sm border border-white text-zinc-500 hover:text-zinc-800 hover:bg-white hover:scale-110 transition-all shadow-sm" title="Keep Shopping">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </Link>
        </div>

        {/* Brand Logo */}
        <div className="text-center mb-10 mt-2">
          <Link to="/" className="text-4xl font-black text-primary-container italic tracking-tighter block mb-3 drop-shadow-sm hover:scale-105 transition-transform inline-block">
            ToyVenture
          </Link>
          <p className="text-zinc-600 font-bold bg-white/50 inline-block px-4 py-1.5 rounded-full border border-white">
            {step === 1 ? 'Enter your number to continue' : 'Verify your mobile number'}
          </p>
        </div>

        {/* ================= STEP 1: MOBILE NUMBER INPUT ================= */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div>
              <label className="block text-sm font-black text-zinc-800 mb-2 ml-1">Mobile Number</label>
              <div className="flex shadow-inner rounded-2xl overflow-hidden border border-white bg-white/60 backdrop-blur-sm focus-within:ring-4 focus-within:ring-primary-container/20 transition-all">
                <div className="flex items-center justify-center px-4 bg-white/80 border-r border-white/60 text-zinc-800 font-black text-base">
                  +91
                </div>
                <input 
                  type="tel" 
                  required 
                  maxLength="10"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit number" 
                  className="w-full bg-transparent px-4 py-4 text-lg font-bold text-zinc-800 tracking-wide outline-none placeholder:text-zinc-400" 
                  autoFocus
                />
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-gradient-to-r from-primary-container to-orange-600 text-white font-black text-lg rounded-2xl hover:shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95">
              Send OTP <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>

            <p className="text-center text-xs font-bold text-zinc-500 mt-6 leading-relaxed px-2">
              By continuing, you agree to ToyVenture's <br/> <a href="#" className="underline hover:text-primary-container transition-colors">Terms</a> and <a href="#" className="underline hover:text-primary-container transition-colors">Privacy Policy</a>.
            </p>
          </form>
        )}

        {/* ================= STEP 2: OTP VERIFICATION ================= */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            
            <div className="text-center mb-2 bg-white/50 p-4 rounded-2xl border border-white">
              <p className="text-sm font-medium text-zinc-600">
                Code sent to <span className="font-black text-zinc-800 tracking-wide">+91 {mobileNumber}</span>
              </p>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="text-xs font-black text-primary-container mt-2 hover:underline bg-primary-container/10 px-3 py-1 rounded-full"
              >
                Change Number
              </button>
            </div>

            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-4">
              {otp.map((data, index) => (
                <input
                  key={index}
                  ref={otpRefs[index]}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onFocus={(e) => e.target.select()}
                  className="w-14 h-16 bg-white/60 backdrop-blur-sm border border-white rounded-2xl text-center text-3xl font-black text-zinc-800 focus:bg-white focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner"
                />
              ))}
            </div>

            <button type="submit" className="w-full py-4 bg-zinc-900 text-white font-black text-lg rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95">
              Verify & Keep Shopping
            </button>

            <div className="text-center">
              <p className="text-sm font-bold text-zinc-500">
                Didn't receive the code? <button type="button" className="font-black text-primary-container hover:underline ml-1">Resend SMS</button>
              </p>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default Auth;