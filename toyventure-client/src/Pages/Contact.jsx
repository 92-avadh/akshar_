import React, { useState } from 'react';
import { useSubmitContactMessageMutation } from '../features/api/apiSlice';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  
  const [submitMessage, { isLoading }] = useSubmitContactMessageMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitMessage(formData).unwrap();
      setStatus('Thanks for reaching out! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' }); // Clear form
    } catch (err) {
      setStatus('Sorry, something went wrong. Please try again.');
    }
  };

  return (
    <main className="pt-28 pb-24 min-h-screen bg-[#fafafa] relative overflow-hidden selection:bg-orange-200">
      {/* Ambient Gradients matching your premium theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full pointer-events-none opacity-30 z-0" style={{ background: 'radial-gradient(circle, rgba(253,186,116,0.5) 0%, rgba(253,186,116,0) 70%)' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full pointer-events-none opacity-20 z-0" style={{ background: 'radial-gradient(circle, rgba(191,219,254,0.6) 0%, rgba(191,219,254,0) 70%)' }}></div>

      <div className="max-w-[1100px] mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        
        {/* Contact Information */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 italic">Connect!</span>
          </h1>
          <p className="text-slate-600 font-medium text-lg mb-10 leading-relaxed">
            Have a question about an order, a specific toy, or just want to say hello? Our friendly team at ToyBlix is always here to help you out.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">location_on</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Our Store</h4>
                <p className="text-sm font-medium text-slate-500">ToyBlix, Surat, Gujarat</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">call</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Phone Support</h4>
                <p className="text-sm font-medium text-slate-500">+91 98765 43210 (Mon-Sat, 9AM-6PM)</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">mail</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Email Us</h4>
                <p className="text-sm font-medium text-slate-500">support@toyblix.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl border border-slate-100">
          <h3 className="text-2xl font-black text-slate-900 mb-8">Send us a message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className="w-full bg-slate-50 p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 outline-none transition-all font-medium text-slate-900" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className="w-full bg-slate-50 p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 outline-none transition-all font-medium text-slate-900" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Your Message</label>
              <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" placeholder="How can we help you today?" className="w-full bg-slate-50 p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 outline-none transition-all font-medium text-slate-900 resize-none"></textarea>
            </div>

            {status && (
              <p className={`font-bold text-sm p-3 rounded-xl ${status.includes('wrong') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {status}
              </p>
            )}

            <button type="submit" disabled={isLoading} className="w-full py-4 bg-slate-900 text-white font-black text-lg rounded-2xl hover:bg-orange-500 transition-colors shadow-lg disabled:opacity-50">
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      {/* INTERACTIVE STORE LOCATION MAP */}
      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        <div className="bg-white p-4 rounded-[3rem] shadow-md border border-slate-100 overflow-hidden h-[400px] md:h-[500px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.41709462828!2d72.73989495147572!3d21.159340298313175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e59411d1563%3A0xfe4558290938b042!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-[2.5rem] opacity-90 grayscale hover:grayscale-0 transition-all duration-500"
          ></iframe>
        </div>
      </div>
    </main>
  );
};

export default Contact;