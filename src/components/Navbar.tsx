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
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/90 backdrop-blur-md">
      <div className="mx-auto w-full sm:max-w-[94%] px-4 sm:px-6 lg:px-8">
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
            <div ref={desktopContainerRef} className="hidden md:flex relative items-center md:w-64 lg:w-[400px] xl:w-[480px] bg-zinc-950/90 border border-white/10 hover:border-spartan-gold/45 focus-within:border-spartan-red focus-within:shadow-[0_0_15px_rgba(179,0,0,0.5)] rounded-full px-4.5 py-2.5 transition-all duration-300">
              <button onClick={triggerSearch} className="flex-shrink-0 cursor-pointer">
                <Search className="h-5 w-5 text-spartan-gold" />
              </button>
              <input
                type="text"
                placeholder="Search supplements and stacks..."
                value={localSearch}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setSuggestionsOpen(true)}
                className="w-full bg-transparent border-0 px-3.5 py-0 text-sm md:text-base text-white focus:outline-none focus:ring-0 placeholder-white/30"
              />
              {renderSuggestionsDropdown()}
            </div>


             {/* Expandable Search Bar for Tablet (sm to md) */}
            <div ref={tabletContainerRef} className={`relative hidden sm:flex md:hidden items-center ${searchOpen ? "w-48" : "w-10"} transition-all duration-300 ${suggestionsOpen && searchOpen ? "" : "overflow-hidden"}`}>
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

            {/* User Session profile/login */}
            <div ref={profileContainerRef} className="relative flex items-center">
              {user ? (
                <>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-1.5 p-2 text-white/85 hover:text-spartan-gold transition-colors cursor-pointer"
                    title="View Profile Details"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden lg:inline text-xs font-bold uppercase tracking-wider max-w-[90px] truncate text-white">
                      {user.name.split(" ")[0]}
                    </span>
                  </button>

                  {/* Profile Dropdown Popover */}
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-neutral-950/95 border border-white/10 backdrop-blur-md shadow-2xl rounded-lg overflow-hidden z-50 p-4">
                      {/* User Header */}
                      <div className="space-y-0.5">
                        <div className="text-xs text-neutral-500 uppercase tracking-widest font-black">SPARTAN AGENT</div>
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
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-neutral-900 border border-white/10 hover:border-spartan-gold text-xs font-bold uppercase tracking-wider text-white rounded transition-colors duration-200 cursor-pointer mb-2"
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
                  className="p-2 text-white/80 hover:text-spartan-red transition-colors"
                  title="Log In / Join"
                  aria-label="Login"
                >
                  <User className="h-5 w-5" />
                </Link>
              )}
            </div>

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
        <div className="md:hidden absolute top-full left-4 right-4 mt-2 z-50 bg-neutral-950/98 border border-white/10 shadow-2xl rounded-xl p-4 space-y-3 backdrop-blur-lg">
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
          
          {/* Mobile User session options */}
          {user ? (
            <div className="pt-4 border-t border-white/5 space-y-2">
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
                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-base font-semibold tracking-wide uppercase text-white/80 hover:bg-white/5 hover:text-spartan-gold transition-colors cursor-pointer text-left"
              >
                <ShoppingBag className="h-4 w-4 text-spartan-gold" />
                <span>My Orders</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-base font-semibold tracking-wide uppercase text-white/80 hover:bg-white/5 hover:text-spartan-red transition-colors cursor-pointer text-left"
              >
                <LogOut className="h-4 w-4 text-spartan-red" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-semibold tracking-wide uppercase text-white/80 hover:bg-white/5 hover:text-spartan-red"
            >
              Sign In / Join Army
            </Link>
          )}

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
