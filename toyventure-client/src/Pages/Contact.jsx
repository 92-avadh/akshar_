import React, { useState } from 'react';

const Contact = () => {
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Thanks for reaching out! We will get back to you soon.');
    e.target.reset();
  };

  return (
    <main className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      <div className="max-w-[1100px] mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        
        {/* Contact Information */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-black text-zinc-800 mb-6 tracking-tight">
            Let's <span className="text-primary-container italic">Connect!</span>
          </h1>
          <p className="text-zinc-600 font-medium text-lg mb-10 leading-relaxed">
            Have a question about an order, a specific toy, or just want to say hello? Our friendly team at Akshar Toys Creation is always here to help you out.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl border border-white shadow-sm">
              <div className="w-12 h-12 bg-primary-container/10 text-primary-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">location_on</span>
              </div>
              <div>
                <h4 className="font-bold text-zinc-800">Our Store</h4>
                <p className="text-sm font-medium text-zinc-500">Akshar Toys Creation, Surat, Gujarat</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl border border-white shadow-sm">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">call</span>
              </div>
              <div>
                <h4 className="font-bold text-zinc-800">Phone Support</h4>
                <p className="text-sm font-medium text-zinc-500">+91 98765 43210 (Mon-Sat, 9AM-6PM)</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl border border-white shadow-sm">
              <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">mail</span>
              </div>
              <div>
                <h4 className="font-bold text-zinc-800">Email Us</h4>
                <p className="text-sm font-medium text-zinc-500">support@akshartoys.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card-surface p-8 md:p-10 rounded-[3rem] shadow-soft border border-white">
          <h3 className="text-2xl font-black text-zinc-800 mb-8">Send us a message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-600 ml-1">Full Name</label>
              <input type="text" required placeholder="John Doe" className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner font-medium text-zinc-800" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-600 ml-1">Email Address</label>
              <input type="email" required placeholder="john@example.com" className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner font-medium text-zinc-800" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-600 ml-1">Your Message</label>
              <textarea required rows="5" placeholder="How can we help you today?" className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner font-medium text-zinc-800 resize-none"></textarea>
            </div>

            {status && <p className="text-green-600 font-bold text-sm bg-green-50 p-3 rounded-xl">{status}</p>}

            <button type="submit" className="w-full py-4 bg-zinc-900 text-white font-black text-lg rounded-2xl hover:bg-black transition-all shadow-lg hover:-translate-y-1 active:scale-95">
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* ========================================== */}
      {/* INTERACTIVE STORE LOCATION MAP             */}
      {/* ========================================== */}
      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        <div className="card-surface p-4 rounded-[3rem] shadow-soft border border-white overflow-hidden h-[400px] md:h-[500px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14877.287484430468!2d72.88586239630665!3d21.219081375299353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f3d785b0825%3A0x9ee7f5c29584ecae!2sAkshar%20Toy%20Yogichowk%20Surat!5e0!3m2!1sen!2sin!4v1775378612318!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-[2.5rem] mix-blend-multiply opacity-90 grayscale hover:grayscale-0 transition-all duration-500"
          ></iframe>
        </div>
      </div>
      
    </main>
  );
};

export default Contact;