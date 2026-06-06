"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Search, Menu, X, Heart, Phone } from "lucide-react";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, wishlist, searchQuery, setSearchQuery, setCartDrawerOpen } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (pathname !== "/shop") {
      router.push("/shop");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/90 backdrop-blur-md">
      <div className="mx-auto max-w-[94%] px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-20 w-20 md:h-[90px] md:w-[90px] items-center justify-center transition-all duration-300 group-hover:scale-110 -my-4 z-20">
              {/* Subtle backglow behind the helmet to make it stand out from black background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(179,0,0,0.4)_0%,transparent_70%)] rounded-full filter blur-xs pointer-events-none" />
              <img
                src="/images/spartan_logo.png"
                alt="Spartan Supplements Logo"
                className="h-full w-full object-contain filter drop-shadow-[0_0_10px_rgba(179,0,0,0.95)] drop-shadow-[0_0_3px_rgba(255,255,255,0.45)] transition-all duration-300"
              />
            </div>
            <span className="text-sm sm:text-xl md:text-2xl font-black tracking-wider uppercase text-white group-hover:text-spartan-red transition-colors duration-300">
              SPARTAN <span className="text-spartan-gold hidden sm:inline">SUPPLEMENTS</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-base font-semibold tracking-wide uppercase transition-colors duration-200 hover:text-spartan-red ${
                    isActive ? "text-spartan-red font-bold" : "text-white/80"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-4">
            
            {/* Permanent Desktop Search Bar - Enlarged and styled with red glow & gold hover */}
            <div className="hidden md:flex items-center md:w-64 lg:w-[400px] xl:w-[480px] bg-zinc-950/90 border border-white/10 hover:border-spartan-gold/45 focus-within:border-spartan-red focus-within:shadow-[0_0_15px_rgba(179,0,0,0.5)] rounded-full px-4.5 py-2.5 transition-all duration-300">
              <Search className="h-5 w-5 text-spartan-gold flex-shrink-0" />
              <input
                type="text"
                placeholder="Search supplements and stacks..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-transparent border-0 px-3.5 py-0 text-sm md:text-base text-white focus:outline-none focus:ring-0 placeholder-white/30"
              />
            </div>


             {/* Expandable Search Bar for Tablet (sm to md) */}
            <div className={`relative hidden sm:flex md:hidden items-center ${searchOpen ? "w-48" : "w-10"} transition-all duration-300 overflow-hidden`}>
              {searchOpen && (
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-white/5 border border-white/10 rounded-md py-1.5 pl-3 pr-8 text-sm text-white placeholder-white/40 focus:outline-none focus:border-spartan-red"
                  autoFocus
                />
              )}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="absolute right-0 p-2 text-white/80 hover:text-spartan-red transition-colors"
                aria-label="Search button"
              >
                <Search className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Expandable Search Button for Mobile (below sm) */}
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (!searchOpen && pathname !== "/shop") {
                  router.push("/shop");
                }
              }}
              className="p-2 text-white/80 hover:text-spartan-red transition-colors sm:hidden"
              aria-label="Mobile Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/shop?filter=wishlist"
              className="relative p-2 text-white/80 hover:text-spartan-red transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-spartan-gold text-[10px] font-bold text-black">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2 text-white/80 hover:text-spartan-red transition-colors cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-spartan-red text-[10px] font-bold text-white shadow-[0_0_8px_rgba(179,0,0,0.6)]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/80 hover:text-spartan-red transition-colors md:hidden"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input expanded underneath header */}
        {searchOpen && (
          <div className="pb-4 px-2 sm:hidden">
            <input
              type="text"
              placeholder="Search Supplements..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-base text-white placeholder-white/40 focus:outline-none focus:border-spartan-red"
            />
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-black px-4 py-4 space-y-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-semibold tracking-wide uppercase ${
                  isActive ? "bg-white/5 text-spartan-red" : "text-white/80 hover:bg-white/5 hover:text-spartan-red"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-white/5 px-3">
            <a
              href="tel:+94715520324"
              className="flex items-center gap-2 text-base text-white/60 hover:text-spartan-gold transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>+94 71 552 0324</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
