"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/5 pt-16 pb-8 text-white/60">
      <div className="mx-auto max-w-[94%] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-11 w-11 items-center justify-center transition-all duration-300 group-hover:scale-105">
                <img
                  src="/images/spartan_logo.png"
                  alt="Spartan Supplements Footer Logo"
                  className="h-full w-full object-contain filter drop-shadow-[0_2px_6px_rgba(179,0,0,0.4)]"
                />
              </div>
              <span className="text-lg font-black tracking-wider uppercase text-white group-hover:text-spartan-red transition-colors duration-300">
                SPARTAN <span className="text-spartan-gold">SUPPS</span>
              </span>
            </Link>
            <p className="text-sm md:text-base leading-relaxed text-white/50">
              Fuel your inner warrior. High-quality supplements for strength, power, recovery, and discipline. Built for athletes who demand the absolute best.
            </p>
            {/* Socials */}
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded bg-white/5 text-white/70 hover:bg-spartan-red hover:text-white hover:shadow-glow-red transition-all duration-200"
                aria-label="Facebook Link"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded bg-white/5 text-white/70 hover:bg-spartan-red hover:text-white hover:shadow-glow-red transition-all duration-200"
                aria-label="Instagram Link"
              >
                <svg className="h-4 w-4 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded bg-white/5 text-white/70 hover:bg-spartan-red hover:text-white hover:shadow-glow-red transition-all duration-200"
                aria-label="TikTok Link"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.73 4.12 1.12 1.09 2.63 1.63 4.18 1.67v3.93c-1.74-.02-3.42-.58-4.78-1.68-.23-.2-.44-.41-.65-.63v7.03c.05 2.14-.73 4.29-2.22 5.82-1.72 1.78-4.29 2.53-6.73 1.95-2.44-.55-4.49-2.33-5.32-4.69-.94-2.58-.33-5.61 1.62-7.59 1.6-1.65 3.95-2.29 6.13-1.71v3.98c-1.13-.34-2.43-.07-3.32.74-.9.78-1.2 2.06-.75 3.16.43 1.12 1.56 1.84 2.76 1.83 1.57.06 2.94-1.08 3.12-2.63.02-.24.03-.49.03-.73V.02h-.3z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/94715520324"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded bg-white/5 text-white/70 hover:bg-spartan-red hover:text-white hover:shadow-glow-red transition-all duration-200"
                aria-label="WhatsApp Link"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold text-white uppercase tracking-wider mb-6">Quick Links</h4>
            <ul className="space-y-3.5 text-sm md:text-base">
              <li>
                <Link href="/" className="hover:text-spartan-red transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-spartan-red transition-colors">Shop All Products</Link>
              </li>
              <li>
                <Link href="/shop?category=whey-protein" className="hover:text-spartan-red transition-colors">Product Categories</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-spartan-red transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-spartan-red transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-base font-bold text-white uppercase tracking-wider mb-6">Categories</h4>
            <ul className="space-y-3.5 text-sm md:text-base">
              <li>
                <Link href="/shop?category=whey-protein" className="hover:text-spartan-red transition-colors">Whey Protein</Link>
              </li>
              <li>
                <Link href="/shop?category=creatine" className="hover:text-spartan-red transition-colors">Creatine</Link>
              </li>
              <li>
                <Link href="/shop?category=pre-workout" className="hover:text-spartan-red transition-colors">Pre Workout</Link>
              </li>
              <li>
                <Link href="/shop?category=mass-gainers" className="hover:text-spartan-red transition-colors">Mass Gainers</Link>
              </li>
              <li>
                <Link href="/shop?category=fat-burners" className="hover:text-spartan-red transition-colors">Fat Burners</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-base font-bold text-white uppercase tracking-wider mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm md:text-base">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-spartan-gold flex-shrink-0 mt-0.5" />
                <span className="text-white/70 leading-relaxed">
                  129/35 Anagarika Dharmapala Road, Kandy, Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-spartan-gold flex-shrink-0" />
                <a href="tel:+94715520324" className="text-white/70 hover:text-white transition-colors">
                  +94 71 552 0324
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-spartan-gold flex-shrink-0" />
                <a href="mailto:info@spartansupplements.lk" className="text-white/70 hover:text-white transition-colors">
                  info@spartansupplements.lk
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>© 2026 Spartan Supplements. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/contact" className="hover:text-white transition-colors">Store Hours</Link>
            <Link href="/shop" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/shop" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
