import Link from "next/link";
import { Building2, Heart, Shield, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-auto">
      <div className="w-full px-4 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-extrabold text-xl">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Building2 className="w-4 h-4" />
              </div>
              Dwell<span className="text-indigo-400">io</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India&apos;s modern real estate platform inspired by 99acres. Buy, rent, and sell verified apartments, villas, and residential plots.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/properties?listingType=sale" className="hover:text-white transition">Buy Property</Link></li>
              <li><Link href="/properties?listingType=rent" className="hover:text-white transition">Rent Property</Link></li>
              <li><Link href="/properties?propertyType=apartment" className="hover:text-white transition">Apartments / Flats</Link></li>
              <li><Link href="/properties?propertyType=villa" className="hover:text-white transition">Villas & Independent Houses</Link></li>
              <li><Link href="/dashboard/properties/new" className="hover:text-emerald-400 text-emerald-400 transition font-semibold">Post Free Property Ad</Link></li>
            </ul>
          </div>

          {/* Top Cities */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Top Cities</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/properties?city=Mumbai" className="hover:text-white transition">Properties in Mumbai</Link></li>
              <li><Link href="/properties?city=Bangalore" className="hover:text-white transition">Properties in Bangalore</Link></li>
              <li><Link href="/properties?city=Gurgaon" className="hover:text-white transition">Properties in Gurgaon (Delhi NCR)</Link></li>
              <li><Link href="/properties?city=Pune" className="hover:text-white transition">Properties in Pune</Link></li>
              <li><Link href="/properties?city=Hyderabad" className="hover:text-white transition">Properties in Hyderabad</Link></li>
            </ul>
          </div>

          {/* Account & Support */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Account & Admin</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/login" className="hover:text-white transition">User Login</Link></li>
              <li><Link href="/register" className="hover:text-white transition">Register Account</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition">Owner / Agent Dashboard</Link></li>
              <li><Link href="/favorites" className="hover:text-white transition">Saved Favorites</Link></li>
              <li><Link href="/admin/properties" className="hover:text-amber-400 transition">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Dwellio Platform. Built with Next.js & Sequelize.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-indigo-400" /> Verified Listings</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
