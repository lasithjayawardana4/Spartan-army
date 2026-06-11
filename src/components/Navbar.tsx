"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Search, Menu, X, Heart, Phone, User, LogOut, MapPin, Mail } from "lucide-react";

import { CATEGORIES, Product } from "@/data/products";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [localSearch, setLocalSearch] = useState("");

  const { cartCount, wishlist, searchQuery, setSearchQuery, setCartDrawerOpen, user, logout } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const tabletContainerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const profileContainerRef = useRef<HTMLDivElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);



  // Fetch products for autocomplete suggestions
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch((err) => console.error("Error fetching products in Navbar:", err));
  }, []);

  // Reset search, mobile menu, and suggestion states on pathname changes
  useEffect(() => {
    setSearchOpen(false);
    setMobileMenuOpen(false);
    setSuggestionsOpen(false);
    setCartDrawerOpen(false);
    if (pathname !== "/shop") {
      setSearchQuery("");
    }
  }, [pathname, setCartDrawerOpen, setSearchQuery]);

  // Sync localSearch with global searchQuery
  useEffect(() => {
    if (pathname === "/shop") {
      setLocalSearch(searchQuery);
    } else {
      setLocalSearch("");
    }
  }, [pathname, searchQuery]);

  // Click outside to close suggestion dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInside = 
        (desktopContainerRef.current && desktopContainerRef.current.contains(target)) ||
        (tabletContainerRef.current && tabletContainerRef.current.contains(target)) ||
        (mobileContainerRef.current && mobileContainerRef.current.contains(target));
      
      if (!clickedInside) {
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutsideProfile = (event: MouseEvent) => {
      if (profileContainerRef.current && !profileContainerRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideProfile);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideProfile);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    setSuggestionsOpen(true);
    if (pathname === "/shop") {
      setSearchQuery(val);
    }
  };

  const triggerSearch = () => {
    setSuggestionsOpen(false);
    setSearchQuery(localSearch);
    if (pathname !== "/shop") {
      router.push("/shop");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      triggerSearch();
    }
  };

  const query = localSearch.trim().toLowerCase();
  
  const filteredSuggestions = useMemo(() => {
    if (!query) return { products: [], categories: [] };
    
    const matchedProducts = products.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(query);
      const categoryMatch = p.category?.toLowerCase().replace("-", " ").includes(query);
      const descMatch = p.description?.toLowerCase().includes(query) || p.shortDescription?.toLowerCase().includes(query);
      return nameMatch || categoryMatch || descMatch;
    }).slice(0, 5);

    const matchedCategories = CATEGORIES.filter((c) => {
      return c.name.toLowerCase().includes(query) || c.id.toLowerCase().replace("-", " ").includes(query);
    }).slice(0, 3);

    return { products: matchedProducts, categories: matchedCategories };
  }, [products, query]);

  const renderSuggestionsDropdown = () => {
    if (!suggestionsOpen || localSearch.trim() === "") return null;

    return (
      <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-lg border border-white/10 bg-black/95 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden max-h-[400px] overflow-y-auto">
        {filteredSuggestions.categories.length === 0 && filteredSuggestions.products.length === 0 ? (
          <div className="p-4 text-center text-xs text-white/40">
            No results found for "{localSearch}"
          </div>
        ) : (
          <>
            {/* Categories Section */}
            {filteredSuggestions.categories.length > 0 && (
              <div className="p-3 border-b border-white/5">
                <h4 className="text-[10px] font-black text-spartan-gold uppercase tracking-wider mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {filteredSuggestions.categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setLocalSearch("");
                        setSearchQuery("");
                        setSuggestionsOpen(false);
                        router.push(`/shop?category=${cat.id}`);
                      }}
                      className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:border-spartan-red hover:text-spartan-red text-white transition-all cursor-pointer uppercase font-semibold tracking-wider text-left"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Products Section */}
            <div className="p-2">
              <h4 className="text-[10px] font-black text-spartan-gold uppercase tracking-wider px-2 py-1 mb-1">Products</h4>
              {filteredSuggestions.products.length === 0 ? (
                <p className="text-xs text-white/40 px-2 py-2">No matching products found</p>
              ) : (
                <div className="space-y-1">
                  {filteredSuggestions.products.map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/product/${prod.id}`}
                      onClick={() => {
                        setLocalSearch("");
                        setSuggestionsOpen(false);
                      }}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-10 h-10 rounded bg-black border border-white/10 flex items-center justify-center p-1 flex-shrink-0">
                        <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-white text-xs sm:text-sm truncate group-hover:text-spartan-red transition-colors">
                            {prod.name}
                          </span>
                          <span className="text-xs font-black text-white whitespace-nowrap">
                            Rs. {prod.price.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center mt-0.5">
                          <span className="text-[10px] text-white/50 uppercase tracking-wider">
                            {prod.category.replace("-", " ")}
                          </span>
                          {prod.stock <= 0 ? (
                            <span className="text-[9px] font-black text-spartan-red uppercase tracking-wider">
                              Sold Out
                            </span>
                          ) : (
                            <span className="text-[9px] font-black text-green-500 uppercase tracking-wider">
                              In Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-black/85 backdrop-blur-xl border-b border-neutral-900 transition-all duration-300 relative">
      {/* Animated thin colored border line at the absolute bottom of the navbar */}
      <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-spartan-gold/30 to-transparent pointer-events-none" />

      <div className="mx-auto w-full sm:max-w-[94%] px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative py-2">
            <div className="relative flex h-14 w-14 items-center justify-center transition-all duration-300 group-hover:scale-108 z-20">
              {/* Backglow behind the helmet to make it stand out */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.35)_0%,transparent_70%)] rounded-full filter blur-xs pointer-events-none group-hover:scale-125 transition-all duration-300" />
              <img
                src="/images/spartan_logo.png"
                alt="Spartan Supplements Logo"
                className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(212,175,55,0.7)] drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] transition-all duration-300"
              />
            </div>
            <span className="hidden sm:inline-block text-lg md:text-xl font-black tracking-widest uppercase text-white font-display">
              SPARTAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-spartan-gold to-yellow-500 group-hover:text-spartan-red transition-all duration-300">SUPPLEMENTS</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-bold tracking-widest uppercase relative py-2 transition-colors duration-300 group ${
                    isActive ? "text-spartan-gold" : "text-white/75 hover:text-white"
                  }`}
                >
                  {link.name}
                  {/* Sliding underline on hover/active */}
                  <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-spartan-red to-spartan-gold transition-transform duration-300 origin-left ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`} />
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Permanent Desktop Search Bar - Enlarged and styled with red glow & gold hover */}
            <div ref={desktopContainerRef} className="hidden lg:flex relative items-center lg:w-[350px] xl:w-[420px] bg-zinc-950/90 border border-neutral-900 hover:border-spartan-gold/30 focus-within:border-spartan-red focus-within:shadow-[0_0_15px_rgba(179,0,0,0.3)] rounded-full px-4 py-2 transition-all duration-300">
              <button onClick={triggerSearch} className="flex-shrink-0 cursor-pointer">
                <Search className="h-4.5 w-4.5 text-spartan-gold" />
              </button>
              <input
                type="text"
                placeholder="Search supplements and stacks..."
                value={localSearch}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setSuggestionsOpen(true)}
                className="w-full bg-transparent border-0 px-3.5 py-0 text-sm text-white focus:outline-none focus:ring-0 placeholder-white/30"
              />
              {renderSuggestionsDropdown()}
            </div>

             {/* Expandable Search Bar for Tablet (sm to lg) */}
            <div ref={tabletContainerRef} className={`relative hidden sm:flex lg:hidden items-center ${searchOpen ? "w-48" : "w-10"} transition-all duration-300 ${suggestionsOpen && searchOpen ? "" : "overflow-hidden"}`}>
              {searchOpen && (
                <input
                  type="text"
                  placeholder="Search..."
                  value={localSearch}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setSuggestionsOpen(true)}
                  className="w-full bg-white/5 border border-white/10 rounded-md py-1.5 pl-3 pr-8 text-sm text-white placeholder-white/40 focus:outline-none focus:border-spartan-red"
                  autoFocus
                />
              )}
              <button
                onClick={() => {
                  if (searchOpen) {
                    triggerSearch();
                  } else {
                    setSearchOpen(true);
                  }
                }}
                className="absolute right-0 p-2 text-white/80 hover:text-spartan-red transition-colors"
                aria-label="Search button"
              >
                <Search className="h-4.5 w-4.5" />
              </button>
              {renderSuggestionsDropdown()}
            </div>

            {/* Expandable Search Button for Mobile (below sm) */}
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
              }}
              className="p-2.5 text-white/80 hover:text-spartan-red hover:scale-105 transition-all sm:hidden rounded-full bg-white/5 border border-white/10"
              aria-label="Mobile Search"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/shop?filter=wishlist"
              className="relative p-2.5 text-white/80 hover:text-spartan-gold hover:scale-105 transition-all duration-250 hidden lg:inline-flex rounded-full bg-white/5 border border-white/10"
              aria-label="Wishlist"
            >
              <Heart className="h-4.5 w-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-spartan-gold text-[9px] font-black text-black">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2.5 text-white/80 hover:text-spartan-gold hover:scale-105 transition-all duration-200 cursor-pointer rounded-full bg-white/5 border border-white/10 hover:border-spartan-gold/30 shadow-sm"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-spartan-red text-[8px] font-black text-white shadow-glow-red animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Session profile/login */}
            <div ref={profileContainerRef} className="relative flex items-center">
              {user ? (
                <>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-1.5 p-2 px-3 text-white/85 hover:text-spartan-gold hover:scale-102 transition-all duration-200 cursor-pointer rounded-full bg-white/5 border border-white/10"
                    title="View Profile Details"
                  >
                    <User className="h-4 w-4 text-spartan-gold" />
                    <span className="hidden lg:inline text-[10px] font-black uppercase tracking-wider max-w-[90px] truncate text-white">
                      {user.name.split(" ")[0]}
                    </span>
                  </button>

                  {/* Profile Dropdown Popover */}
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-3 w-72 bg-neutral-950/95 border border-neutral-900 backdrop-blur-xl shadow-[0_15px_40px_rgba(212,175,55,0.15)] rounded-xl overflow-hidden z-50 p-4">
                      {/* User Header */}
                      <div className="space-y-0.5">
                        <div className="text-[9px] text-neutral-500 uppercase tracking-widest font-black">SPARTAN AGENT</div>
                        <div className="font-extrabold text-sm text-spartan-gold uppercase tracking-wider truncate">{user.name}</div>
                        <div className="text-xs text-white/60 flex items-center gap-1.5 truncate">
                          <Mail className="h-3 w-3 shrink-0 text-white/40" />
                          <span>{user.email}</span>
                        </div>
                      </div>

                      <div className="border-t border-white/5 my-3" />

                      {/* Profile details */}
                      <div className="space-y-3">
                        <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Delivery Details</div>
                        <div className="space-y-2 text-xs text-white/80">
                          <div className="flex items-start gap-2">
                            <Phone className="h-3.5 w-3.5 shrink-0 text-spartan-gold mt-0.5" />
                            <div>
                              <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">Contact Number</div>
                              <div className="font-medium text-white/90">{user.contact || 'Not Provided'}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-spartan-gold mt-0.5" />
                            <div>
                              <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">Delivery Address</div>
                              <div className="font-medium text-white/90 whitespace-pre-wrap">{user.address || 'Not Provided'}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-white/5 my-3.5" />

                      {/* Actions */}
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          router.push("/orders");
                        }}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-neutral-900 border border-neutral-805 hover:border-spartan-gold text-xs font-bold uppercase tracking-wider text-white rounded transition-colors duration-200 cursor-pointer mb-2"
                      >
                        <ShoppingBag className="h-3.5 w-3.5 text-spartan-gold" />
                        <span>My Orders</span>
                      </button>

                      <button
                        onClick={async () => {
                          setProfileOpen(false);
                          await logout();
                        }}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-spartan-red hover:bg-spartan-red-dark text-xs font-bold uppercase tracking-wider text-white rounded transition-colors duration-200 cursor-pointer"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-black uppercase tracking-wider text-white border border-white/10 hover:border-spartan-gold hover:text-spartan-gold rounded-full bg-white/5 transition-all duration-300"
                  title="Log In / Join"
                  aria-label="Login / Signup"
                >
                  <User className="h-3.5 w-3.5 text-spartan-gold" />
                  <span className="hidden sm:inline">Join Army</span>
                  <span className="sm:hidden">Join</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-white/80 hover:text-spartan-gold hover:scale-105 transition-all lg:hidden rounded-full bg-white/5 border border-white/10"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input expanded underneath header */}
        {searchOpen && (
          <div ref={mobileContainerRef} className="pb-4 px-2 sm:hidden relative">
            <input
              type="text"
              placeholder="Search Supplements..."
              value={localSearch}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setSuggestionsOpen(true)}
              className="w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-base text-white placeholder-white/40 focus:outline-none focus:border-spartan-red"
            />
            {renderSuggestionsDropdown()}
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu (floating card style overlay) */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-4 right-4 mt-3 z-50 bg-neutral-950/95 border border-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-xl p-5 space-y-4 backdrop-blur-xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-bold tracking-wider uppercase transition-all ${
                  isActive ? "bg-white/5 text-spartan-gold" : "text-white/85 hover:bg-white/5 hover:text-spartan-gold"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Wishlist Link inside mobile menu */}
          <Link
            href="/shop?filter=wishlist"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-bold tracking-wider uppercase text-white/80 hover:bg-white/5 hover:text-spartan-gold transition-colors cursor-pointer text-left"
          >
            <div className="relative flex items-center">
              <Heart className="h-4 w-4 text-spartan-gold" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-spartan-red text-[8px] font-bold text-white shadow-[0_0_6px_rgba(179,0,0,0.6)]">
                  {wishlist.length}
                </span>
              )}
            </div>
            <span className="ml-0.5">Wishlist</span>
          </Link>
          
          {/* Mobile User session options */}
          {user ? (
            <div className="pt-4 border-t border-neutral-900 space-y-2">
              <div className="px-3 pb-1">
                <span className="text-xs font-bold text-spartan-gold uppercase tracking-wider truncate block">
                  {user.name}
                </span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/orders");
                }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-bold tracking-wider uppercase text-white/80 hover:bg-white/5 hover:text-spartan-gold transition-colors cursor-pointer text-left"
              >
                <ShoppingBag className="h-4 w-4 text-spartan-gold" />
                <span>My Orders</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-bold tracking-wider uppercase text-white/80 hover:bg-white/5 hover:text-spartan-red transition-colors cursor-pointer text-left"
              >
                <LogOut className="h-4 w-4 text-spartan-red" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-bold tracking-wider uppercase text-white/80 hover:bg-white/5 hover:text-spartan-gold"
            >
              Join Army
            </Link>
          )}

          <div className="pt-4 border-t border-neutral-900 px-3">
            <a
              href="tel:+94715520324"
              className="flex items-center gap-2 text-xs font-bold text-white/60 hover:text-spartan-gold transition-colors"
            >
              <Phone className="h-4 w-4 text-spartan-gold" />
              <span>+94 71 552 0324</span>
            </a>
          </div>
        </div>
      )}

    </header>
  );
};
export default Navbar;
