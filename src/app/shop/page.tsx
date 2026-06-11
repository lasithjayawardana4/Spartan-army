"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { CATEGORIES, Product } from "@/data/products";
import { Star, Heart, Eye, ShoppingCart, SlidersHorizontal, Search, RotateCcw, Loader2 } from "lucide-react";
import Link from "next/link";

function ShopContent() {
  const searchParams = useSearchParams();
  const { addToCart, wishlist, toggleWishlist, searchQuery, setSearchQuery } = useCart();

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number>(35000);
  const [sortBy, setSortBy] = useState<string>("default");
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [showWishlistOnly, setShowWishlistOnly] = useState<boolean>(false);

  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Sync with URL query parameters on mount or change
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const filterParam = searchParams.get("filter");
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setShowWishlistOnly(false);
    } else if (filterParam === "wishlist") {
      setShowWishlistOnly(true);
      setSelectedCategory("all");
    } else {
      setSelectedCategory("all");
      setShowWishlistOnly(false);
    }
  }, [searchParams]);

  // Fetch products from API
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
        setLoadingProducts(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setLoadingProducts(false);
      });
  }, []);

  // Reset pagination on filter or sort change
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategory, priceRange, sortBy, searchQuery, showWishlistOnly]);

  // Filter & Sort Logic
  const filteredProducts = products.filter((product) => {
    // 1. Category Filter
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    // 2. Search Query Filter
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.replace("-", " ").toLowerCase().includes(searchQuery.toLowerCase());
      
    // 3. Price Filter
    const matchesPrice = product.price <= priceRange;

    // 4. Wishlist Filter
    const matchesWishlist = !showWishlistOnly || wishlist.includes(product.id);

    return matchesCategory && matchesSearch && matchesPrice && matchesWishlist;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "best-sellers") return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    if (sortBy === "new-arrivals") return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    return 0; // Default
  });

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  // Infinite Scroll Observer Setup
  useEffect(() => {
    if (loadingProducts) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 12, filteredProducts.length));
        }
      },
      {
        rootMargin: "200px",
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadingProducts, filteredProducts.length]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setPriceRange(35000);
    setSortBy("default");
    setSearchQuery("");
    setShowWishlistOnly(false);
  };

  return (
    <div className="w-full mx-auto sm:max-w-[94%] px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      
      {/* Title / Banner */}
      <div className="border-b border-white/5 pb-4 md:pb-8 mb-4 md:mb-10">
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wider">
          {showWishlistOnly ? "My Spartan " : "Spartan "} 
          <span className="text-spartan-red">{showWishlistOnly ? "Wishlist" : "Armory"}</span>
        </h1>
        <p className="text-base text-white/50 mt-2">
          {showWishlistOnly 
            ? "Your saved items. Fuel your next routine." 
            : "Equip yourself with elite performance formulas."}
        </p>
      </div>

      {/* Main Container */}
      <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-8 items-start">
        
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8 glass-panel p-6 rounded-lg">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white uppercase tracking-wider text-base flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-spartan-gold" />
                Filters
              </h3>
              <button 
                onClick={resetFilters}
                className="text-sm text-white/40 hover:text-spartan-red transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>
            
            {/* Wishlist toggle inside sidebar */}
            <button
              onClick={() => setShowWishlistOnly(!showWishlistOnly)}
              className={`w-full text-left py-2 px-3 rounded text-sm font-semibold uppercase tracking-wider border transition-colors ${
                showWishlistOnly 
                  ? "bg-spartan-red/20 border-spartan-red text-spartan-red" 
                  : "border-white/5 hover:border-white/20 text-white/80"
              }`}
            >
              ❤️ Saved Wishlist ({wishlist.length})
            </button>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-white uppercase text-sm tracking-wider mb-4 border-b border-white/5 pb-2">Categories</h4>
            <div className="space-y-2">
              <button
                onClick={() => { setSelectedCategory("all"); setShowWishlistOnly(false); }}
                className={`block w-full text-left text-base py-1 transition-colors ${
                  selectedCategory === "all" && !showWishlistOnly ? "text-spartan-red font-bold" : "text-white/60 hover:text-white"
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setShowWishlistOnly(false); }}
                  className={`block w-full text-left text-base py-1 transition-colors ${
                    selectedCategory === cat.id && !showWishlistOnly ? "text-spartan-red font-bold" : "text-white/60 hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
 
          {/* Price Range */}
          <div>
            <h4 className="font-bold text-white uppercase text-sm tracking-wider mb-4 border-b border-white/5 pb-2">Price Limit</h4>
            <div className="space-y-2">
              <input
                type="range"
                min="3000"
                max="35000"
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-spartan-red"
              />
              <div className="flex justify-between text-sm text-white/50">
                <span>Rs. 3,000</span>
                <span className="font-bold text-spartan-gold">Rs. {priceRange.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Filters Trigger */}
        <div className="w-full grid grid-cols-2 gap-2 sm:gap-4 lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center justify-center gap-1.5 rounded bg-spartan-gray border border-white/10 px-2 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-white w-full transition-colors hover:border-spartan-red/40 cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-spartan-gold flex-shrink-0" />
            <span>Filters</span>
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-spartan-gray border border-white/10 rounded px-2 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-white focus:outline-none w-full text-center transition-colors hover:border-spartan-red/40 cursor-pointer"
          >
            <option value="default">Sort Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="best-sellers">Best Sellers</option>
            <option value="new-arrivals">New Arrivals</option>
          </select>
        </div>
        {/* Mobile Filter Drawer Overlay */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-black/80 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}>
            <div className="relative w-full max-w-xs bg-spartan-gray p-6 border-r border-white/5 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white uppercase tracking-wider text-base">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-sm text-white/50 hover:text-white uppercase font-bold"
                >
                  Close
                </button>
              </div>
 
              {/* Wishlist toggle */}
              <button
                onClick={() => { setShowWishlistOnly(!showWishlistOnly); setShowMobileFilters(false); }}
                className={`w-full text-left py-2 px-3 mb-6 rounded text-sm font-semibold uppercase tracking-wider border transition-colors ${
                  showWishlistOnly 
                    ? "bg-spartan-red/20 border-spartan-red text-spartan-red" 
                    : "border-white/5 text-white/80"
                }`}
              >
                ❤️ Saved Wishlist ({wishlist.length})
              </button>
 
              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-bold text-white uppercase text-sm tracking-wider mb-3 border-b border-white/5 pb-2">Categories</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => { setSelectedCategory("all"); setShowWishlistOnly(false); setShowMobileFilters(false); }}
                    className={`block w-full text-left text-base py-1 ${
                      selectedCategory === "all" && !showWishlistOnly ? "text-spartan-red font-bold" : "text-white/60"
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setShowWishlistOnly(false); setShowMobileFilters(false); }}
                      className={`block w-full text-left text-base py-1 ${
                        selectedCategory === cat.id && !showWishlistOnly ? "text-spartan-red font-bold" : "text-white/60"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
 
              {/* Price range */}
              <div>
                <h4 className="font-bold text-white uppercase text-sm tracking-wider mb-3 border-b border-white/5 pb-2">Price Limit</h4>
                <input
                  type="range"
                  min="3000"
                  max="35000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-spartan-red"
                />
                <div className="flex justify-between text-sm text-white/50 mt-2">
                  <span>Rs. 3,000</span>
                  <span className="font-bold text-spartan-gold">Rs. {priceRange.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Display / List */}
        <div className="flex-1 w-full space-y-0 lg:space-y-6">
          
          {/* Top Sort Bar - Desktop */}
          <div className="hidden lg:flex items-center justify-between bg-spartan-gray p-4 rounded border border-white/5">
            <p className="text-sm text-white/50">
              Showing <span className="text-white font-bold">{filteredProducts.length}</span> Supplements
            </p>

            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-black border border-white/10 rounded px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-white focus:outline-none"
              >
                <option value="default">Sort: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="best-sellers">Best Sellers</option>
                <option value="new-arrivals">New Arrivals</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loadingProducts ? (
            <div className="w-full flex flex-col items-center justify-center py-20 min-h-[550px] bg-spartan-gray/30 border border-white/5 rounded-xl backdrop-blur-md shadow-glow-dark">
              <Loader2 className="h-10 w-10 animate-spin text-spartan-red" />
              <p className="text-sm text-white/50 mt-4 uppercase tracking-wider font-black">Forging the Armory...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center text-center py-20 min-h-[550px] bg-spartan-gray/40 border border-white/5 rounded-xl backdrop-blur-md shadow-glow-dark px-4">
              <div className="relative mb-6">
                {/* Glowing search/filter icon wrapper */}
                <div className="h-16 w-16 rounded-full bg-zinc-950 border border-spartan-gold/30 flex items-center justify-center text-spartan-gold shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                  <SlidersHorizontal className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider mb-2">
                No Supplements Found
              </h3>
              <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed mb-8">
                We couldn't find any warrior formulas matching your current filter selection. Adjust the filters or clear them to view the full armory.
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 rounded bg-spartan-red hover:bg-spartan-red-dark text-white px-8 py-3.5 text-xs font-black uppercase tracking-widest transition-all shadow-glow-red hover:shadow-glow-red-heavy cursor-pointer focus:outline-none"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {visibleProducts.map((product) => {
                const isWishlisted = wishlist.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col justify-between rounded-lg border border-white/5 bg-spartan-gray hover:border-spartan-red/30 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative m-2">
                      <div className="relative aspect-square overflow-hidden flex items-center justify-center p-2 sm:p-4 border-2 border-spartan-red-dark rounded-lg bg-black">
                        <Link href={`/product/${product.id}`} className="flex h-full w-full items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        </Link>
                        
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className={`absolute bottom-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition-all cursor-pointer ${
                            isWishlisted
                              ? "bg-spartan-red text-white"
                              : "bg-black/60 text-white/80 hover:bg-spartan-red hover:text-white"
                          }`}
                          title="Wishlist"
                        >
                          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                        </button>
                        
                        {product.stock <= 0 ? (
                          <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-zinc-800 border border-zinc-700 text-neutral-400 text-[10px] sm:text-sm font-black uppercase tracking-wider px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded z-10">
                            Sold Out
                          </span>
                        ) : product.promoCode ? (
                          <span className="absolute top-3 left-3 sm:top-4 sm:left-4 text-[10px] sm:text-sm font-black uppercase tracking-widest px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded z-10" style={{background:'rgba(212,175,55,0.15)',border:'1px solid rgba(212,175,55,0.55)',color:'#D4AF37',boxShadow:'0 0 10px rgba(212,175,55,0.45), 0 0 20px rgba(212,175,55,0.15)'}}>
                            🏷️ {product.discountPercentage}% OFF
                          </span>
                        ) : product.oldPrice ? (
                          <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-spartan-red text-white text-[10px] sm:text-sm font-black uppercase tracking-wider px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded">
                            Sale
                          </span>
                        ) : null}

                        {/* Actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                          <Link
                            href={`/product/${product.id}`}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:bg-spartan-gold hover:text-black transition-colors"
                            title="Quick View"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                              isWishlisted ? "bg-spartan-red text-white" : "bg-white text-black hover:bg-spartan-red hover:text-white"
                            }`}
                            title="Wishlist"
                          >
                            <Heart className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Brand Logo Badge sitting on the top-right corner, outside the overflow-hidden box */}
                      <div className="absolute -top-3 -right-3 md:-top-6 md:-right-6 z-20 pointer-events-none select-none">
                        <img
                          src="/images/spartan_logo.png"
                          alt="Spartan Brand Logo"
                          className="h-10 w-10 md:h-20 md:w-20 object-contain filter drop-shadow-[0_0_8px_rgba(179,0,0,0.95)] drop-shadow-[0_0_3px_rgba(255,255,255,0.55)]"
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-3 sm:p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div>
                        <p className="text-[10px] sm:text-xs text-spartan-gold font-bold uppercase tracking-wider">
                          {product.category.replace("-", " ")}
                        </p>
                        <Link
                          href={`/product/${product.id}`}
                          className="block mt-1 font-bold text-xs sm:text-base uppercase text-white hover:text-spartan-red transition-colors line-clamp-1"
                        >
                          {product.name}
                        </Link>

                        <div className="flex items-center gap-1 mt-2">
                          <div className="flex text-spartan-gold">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
                            ))}
                          </div>
                          <span className="text-xs text-white/40">({product.reviewsCount})</span>
                        </div>
                      </div>

                      <div className="flex items-end justify-between pt-2 border-t border-white/5">
                        <div>
                          {product.oldPrice && (
                            <span className="text-[10px] sm:text-sm text-white/40 line-through">
                              Rs. {product.oldPrice.toLocaleString()}
                            </span>
                          )}
                          <p className="text-sm sm:text-lg font-black text-white">
                            Rs. {product.price.toLocaleString()}
                          </p>
                        </div>

                        <button
                          disabled={product.stock <= 0}
                          onClick={() => addToCart(product)}
                          className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded transition-all duration-250 ${
                            product.stock <= 0
                              ? "bg-zinc-800 text-neutral-500 border border-zinc-700 cursor-not-allowed"
                              : "bg-spartan-red hover:bg-spartan-red-dark text-white shadow-glow-red cursor-pointer"
                          }`}
                          title={product.stock <= 0 ? "Sold Out" : "Add to Cart"}
                        >
                          {product.stock <= 0 ? (
                            <span className="text-[9px] font-black uppercase">X</span>
                          ) : (
                            <ShoppingCart className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {visibleCount < filteredProducts.length && (
              <div ref={sentinelRef} className="w-full flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-spartan-red" />
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20 min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-spartan-red border-t-transparent" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
