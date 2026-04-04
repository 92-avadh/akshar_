import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-purple-100 rounded-t-[3rem] mt-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 w-full max-w-[1440px] mx-auto">
        <div className="space-y-6">
          <div className="text-3xl font-black text-primary-container mb-4 tracking-tighter">ToyVenture</div>
          <p className="text-zinc-700 font-medium">Making every childhood moment a magical adventure through play.</p>
          <div className="flex gap-4">
            <a className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary-container shadow-sm hover:scale-110 transition-transform" href="#">
              <span className="material-symbols-outlined text-lg">share</span>
            </a>
            <a className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary-container shadow-sm hover:scale-110 transition-transform" href="#">
              <span className="material-symbols-outlined text-lg">public</span>
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-black text-on-surface mb-6 uppercase tracking-wider text-sm">Shop Categories</h4>
          <ul className="space-y-4">
            <li><a className="text-zinc-600 hover:underline decoration-2 underline-offset-4" href="#">Metal Cars</a></li>
            <li><a className="text-zinc-600 hover:underline decoration-2 underline-offset-4" href="#">STEM & Learning</a></li>
            <li><a className="text-zinc-600 hover:underline decoration-2 underline-offset-4" href="#">Arts & Crafts</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black text-on-surface mb-6 uppercase tracking-wider text-sm">Support</h4>
          <ul className="space-y-4">
            <li><a className="text-zinc-600 hover:underline decoration-2 underline-offset-4" href="#">Safety Standards</a></li>
            <li><a className="text-zinc-600 hover:underline decoration-2 underline-offset-4" href="#">Shipping Info</a></li>
            <li><a className="text-zinc-600 hover:underline decoration-2 underline-offset-4" href="#">Returns</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black text-on-surface mb-6 uppercase tracking-wider text-sm">Legal</h4>
          <ul className="space-y-4">
            <li><a className="text-zinc-600 hover:underline decoration-2 underline-offset-4" href="#">Privacy Policy</a></li>
            <li><a className="text-zinc-600 hover:underline decoration-2 underline-offset-4" href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-purple-200/50 py-8 px-12 text-center text-zinc-500 font-medium text-sm">
        © 2024 ToyVenture. Play Safe, Dream Big.
      </div>
    </footer>
  );
};

export default Footer;