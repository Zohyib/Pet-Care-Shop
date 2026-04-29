import Link from 'next/link';
import { PawPrint, Globe, MessageCircle, Share2, Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-premium p-2 rounded-xl text-white shadow-lg shadow-indigo-500/25">
                <PawPrint className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                PetCare<span className="text-indigo-600 dark:text-indigo-400">Shop</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              The intelligent ecosystem for your pet's life. Connect with top veterinarians, book appointments instantly, and shop premium products.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all">
                <Heart className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Quick Links</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</Link></li>
              <li><Link href="/shop" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Marketplace</Link></li>
              <li><Link href="/doctors" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Find a Doctor</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Legal</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/terms" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Contact Us</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-slate-500 dark:text-slate-400">123 Pet Care Lane, Innovation City, PC 90210</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="text-slate-500 dark:text-slate-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="text-slate-500 dark:text-slate-400">support@petcareshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © {new Date().getFullYear()} PetCareShop. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Made with ❤️ for pets.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
