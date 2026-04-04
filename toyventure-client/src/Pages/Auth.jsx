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
    // UPDATED WRAPPER: flex-1 ensures it fills the gap between Nav and Footer perfectly
    <div className="flex-1 flex items-center justify-center w-full relative overflow-hidden bg-surface-container-lowest py-24 px-6">
      
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-primary-container/10 blur-3xl rounded-full mix-blend-multiply"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full mix-blend-multiply"></div>
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-[420px] bg-white rounded-[2.5rem] shadow-2xl shadow-purple-900/10 border border-surface-variant p-8 md:p-10 relative z-10">
        
        {/* Close / Keep Shopping Button */}
        <div className="absolute top-6 right-6">
          <Link to="/shop" className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-50 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors" title="Keep Shopping">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </Link>
        </div>

        {/* Brand Logo */}
        <div className="text-center mb-8 mt-2">
          <Link to="/" className="text-4xl font-black text-primary-container italic tracking-tighter block mb-2">
            ToyVenture
          </Link>
          <p className="text-zinc-500 font-medium">
            {step === 1 ? 'Enter your number to continue' : 'Verify your mobile number'}
          </p>
        </div>

        {/* ================= STEP 1: MOBILE NUMBER INPUT ================= */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">Mobile Number</label>
              <div className="flex shadow-sm rounded-xl overflow-hidden border border-zinc-200 focus-within:ring-2 focus-within:ring-primary-container focus-within:border-primary-container transition-all">
                <div className="flex items-center justify-center px-4 bg-zinc-50 border-r border-zinc-200 text-zinc-600 font-black text-base">
                  +91
                </div>
                <input 
                  type="tel" 
                  required 
                  maxLength="10"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit number" 
                  className="w-full bg-white px-4 py-4 text-base font-bold text-zinc-800 tracking-wide outline-none" 
                  autoFocus
                />
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-primary-container text-white font-black text-lg rounded-xl hover:bg-orange-600 hover:shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2">
              Send OTP <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>

            <p className="text-center text-xs font-medium text-zinc-400 mt-6 leading-relaxed px-2">
              By continuing, you agree to ToyVenture's <a href="#" className="underline hover:text-zinc-600">Terms</a> and <a href="#" className="underline hover:text-zinc-600">Privacy Policy</a>.
            </p>
          </form>
        )}

        {/* ================= STEP 2: OTP VERIFICATION ================= */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            
            <div className="text-center mb-2">
              <p className="text-sm font-medium text-zinc-600">
                Code sent to <span className="font-black text-zinc-800">+91 {mobileNumber}</span>
              </p>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="text-xs font-bold text-primary-container mt-2 hover:underline"
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
                  className="w-14 h-16 bg-zinc-50 border border-zinc-200 rounded-xl text-center text-3xl font-black text-zinc-800 focus:bg-white focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all shadow-inner"
                />
              ))}
            </div>

            <button type="submit" className="w-full py-4 bg-zinc-900 text-white font-black text-lg rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
              Verify & Keep Shopping
            </button>

            <div className="text-center">
              <p className="text-sm font-medium text-zinc-500">
                Didn't receive the code? <button type="button" className="font-bold text-primary-container hover:underline ml-1">Resend SMS</button>
              </p>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default Auth;