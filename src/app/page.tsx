"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";
import { Flame, Star, Shield, Award, Zap, Heart, Eye, ShoppingCart, ArrowRight, Trophy, Search, ChevronLeft, ChevronRight, Truck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface SmokeClick {
  id: number;
  x: number;
  y: number;
}

const CAROUSEL_CATEGORIES = [
  {
    id: "whey-protein",
    name: "Whey Protein",
    badge: "Big Gains. Bigger Nutrition",
    tagline: "Lean muscle growth & rapid repair",
    image: "/images/cat_whey_protein.png",
  },
  {
    id: "mass-gainers",
    name: "Mass Gainers",
    badge: "Mass & Size. Warrior Build",
    tagline: "High calorie fuel for maximum size",
    image: "/images/cat_mass_gainer.png",
  },
  {
    id: "pre-workout",
    name: "Pre Workout",
    badge: "Level up every session.",
    tagline: "Explosive energy & laser focus",
    image: "/images/cat_pre_workout.png",
  },
  {
    id: "creatine",
    name: "Creatine",
    badge: "Pure Strength. Raw Power",
    tagline: "Boost ATP, strength & muscle volume",
    image: "/images/cat_creatine.png",
  },
  {
    id: "fat-burners",
    name: "Fat Burners",
    badge: "Smart. Burn Fast",
    tagline: "Extreme thermogenic metabolic support",
    image: "/images/cat_fat_burner.png",
  },
  {
    id: "vitamins-minerals",
    name: "Vitamins",
    badge: "Shield. Guard. Recover",
    tagline: "Daily micronutrients for elite health",
    image: "/images/cat_vitamins.png",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist, searchQuery, setSearchQuery } = useCart();
  const [activeTab, setActiveTab] = useState<"best-sellers" | "new-arrivals">("best-sellers");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterForm, setNewsletterForm] = useState({ name: "", email: "" });
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

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

  // Smoke clicks state
  const [clicks, setClicks] = useState<SmokeClick[]>([]);

  // Search input local state
  const [localSearch, setLocalSearch] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Intro states for door slide
  const [introStep, setIntroStep] = useState<"showing" | "animating" | "done">("showing");

  // Coverflow states and logic
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev === 2 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrevCategory = () => {
    setCarouselIndex((prev) => (prev === 0 ? CAROUSEL_CATEGORIES.length - 1 : prev - 1));
  };

  const handleNextCategory = () => {
    setCarouselIndex((prev) => (prev === CAROUSEL_CATEGORIES.length - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      handleNextCategory();
    } else if (isRightSwipe) {
      handlePrevCategory();
    }
  };

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setIntroStep("animating");
    }, 2200);

    const doneTimer = setTimeout(() => {
      setIntroStep("done");
    }, 3200);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  const handleSmokeClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement | HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newClick = { id: Date.now() + Math.random(), x, y };
    
    setClicks((prev) => [...prev, newClick]);
    
    setTimeout(() => {
      setClicks((prev) => prev.filter((c) => c.id !== newClick.id));
    }, 850);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch);
      router.push("/shop");
    }
  };

  const featuredProducts = products.filter((p) =>
    activeTab === "best-sellers" ? p.isBestSeller : p.isNewArrival
  );

  const testimonials = [
    {
      name: "Kasun Perera",
      role: "Competitive Bodybuilder",
      quote: "Best supplement store in Kandy. Authentic products and they actually understand sports nutrition.",
      rating: 5,
    },
    {
      name: "Dilini Senanayake",
      role: "Crossfit Athlete",
      quote: "Fast delivery and genuine products. The Spartan Rage pre-workout is insane!",
      rating: 5,
    },
    {
      name: "Ruwan Wijetunga",
      role: "Fitness Enthusiast",
      quote: "Excellent customer service. They helped me pick the right whey protein for my cutting cycle.",
      rating: 5,
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterForm.name && newsletterForm.email) {
      setNewsletterSubmitted(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-hidden relative">
      
      {/* 3D DOUBLE-DOOR SPLIT SLIDE LOADING SCREEN */}
      <AnimatePresence>
        {introStep !== "done" && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="fixed inset-0 z-50 flex overflow-hidden select-none pointer-events-none"
          >
            {/* Left Door */}
            <motion.div
              initial={{ x: 0 }}
              animate={introStep === "animating" ? { x: "-100%" } : { x: 0 }}
              transition={{ type: "spring", stiffness: 45, damping: 15, mass: 1 }}
              className="relative w-1/2 h-full bg-black border-r border-spartan-red/20 overflow-hidden flex justify-end"
            >
              <div 
                className="absolute inset-0 bg-[url('/images/spartan_loader_bg.png')] bg-[length:220vw_auto] md:bg-cover bg-no-repeat"
                style={{
                  backgroundPosition: "center",
                  width: "200%",
                }}
              />
            </motion.div>

            {/* Right Door */}
            <motion.div
              initial={{ x: 0 }}
              animate={introStep === "animating" ? { x: "100%" } : { x: 0 }}
              transition={{ type: "spring", stiffness: 45, damping: 15, mass: 1 }}
              className="relative w-1/2 h-full bg-black border-l border-spartan-red/20 overflow-hidden flex justify-start"
            >
              <div 
                className="absolute inset-0 bg-[url('/images/spartan_loader_bg.png')] bg-[length:220vw_auto] md:bg-cover bg-no-repeat"
                style={{
                  backgroundPosition: "center",
                  width: "200%",
                  left: "-100%"
                }}
              />
            </motion.div>

            {/* Center Loading progress bar sitting under the background image's printed logo */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-40">
              <motion.div
                initial={{ opacity: 1 }}
                animate={introStep === "showing" ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <div className="w-44 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.1, ease: "easeInOut" }}
                    className="h-full bg-spartan-red shadow-[0_0_8px_#B30000]"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COMBINED HERO, SEARCH, CATEGORIES & PRODUCTS ON FIRST SIGHT */}
      <section className="relative min-h-[85vh] flex flex-col justify-start overflow-hidden border-b border-white/5 py-6 px-4 sm:px-6 lg:px-8">
        
        {/* Continuous Spartan Dragon Background */}
        <div className="absolute top-0 left-0 right-0 h-[100vh] lg:h-full pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/spartan_dragon_bg.png')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 lg:via-black/95 to-black/40 lg:to-black/60 bg-black/30 lg:bg-black/60 backdrop-blur-none lg:backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(179,0,0,0.25)_0%,rgba(0,0,0,0)_85%)] lg:bg-[radial-gradient(circle_at_center,rgba(179,0,0,0.15)_0%,rgba(0,0,0,0)_85%)]" />
          </div>
        </div>

        {/* Dynamic Glowing particles */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-spartan-red rounded-full blur-sm animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-spartan-gold rounded-full blur-xs animate-ping" style={{ animationDuration: '6s' }} />
        </div>

        <div className="relative mx-auto w-full sm:max-w-[94%] space-y-6 z-10 pt-2">
          
          {/* Main Title Badge */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-wider text-white uppercase leading-none select-none">
              SPARTAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-spartan-red via-red-500 to-spartan-gold drop-shadow-[0_0_15px_rgba(179,0,0,0.45)]">ARMORY</span>
            </h1>
            <p className="text-xs sm:text-sm tracking-widest text-white/50 max-w-md mx-auto uppercase font-bold">
              Premium Sports Nutrition • Fuel For Warriors
            </p>
          </div>



          {/* 2. Interactive Double-Column Section: 3D Category Coverflow (Left) & Delivery Info (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2 pb-0 md:pb-6 w-full max-w-[96%] mx-auto">
            {/* Left Column: 3D Category Coverflow Slider */}
            <div className="lg:col-span-7 flex flex-col items-center justify-start sm:justify-center relative min-h-[400px] md:min-h-[530px] w-full overflow-hidden pt-1 pb-4 sm:py-4">
              <h3 className="text-xs font-black uppercase text-spartan-gold tracking-widest text-center mb-2 md:mb-6">
                SELECT YOUR FORMULATION
              </h3>
              
              {/* Carousel Container */}
              <div 
                className="relative flex items-center justify-center w-full h-[340px] md:h-[420px] select-none touch-pan-y"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {/* Left Arrow Button */}
                <button
                  type="button"
                  onClick={handlePrevCategory}
                  className="absolute left-2 md:left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950/80 hover:bg-black text-white hover:text-spartan-gold border border-spartan-red/30 hover:border-spartan-gold transition-all duration-300 shadow-[0_0_10px_rgba(179,0,0,0.3)] hover:shadow-[0_0_20px_rgba(179,0,0,0.6)] cursor-pointer active:scale-95"
                  aria-label="Previous Category"
                >
                  <ChevronLeft className="h-5 w-5 stroke-[2.5px]" />
                </button>

                {/* Coverflow Cards */}
                <div className="relative w-full max-w-md md:max-w-lg h-full flex items-center justify-center overflow-visible" style={{ perspective: "1000px" }}>
                  {CAROUSEL_CATEGORIES.map((cat, idx) => {
                    // Calculate relative offset wrapping around
                    let diff = idx - carouselIndex;
                    const N = CAROUSEL_CATEGORIES.length;
                    if (diff < -N / 2) diff += N;
                    if (diff > N / 2) diff -= N;

                    const absDiff = Math.abs(diff);

                    // Skip rendering if too far out of view
                    if (absDiff > 2) return null;                    // Styles based on distance from active center card
                    const xOffsetMobile = diff * 55; // tighter offset in px for mobile
                    const xOffsetDesktop = diff * 90; // tighter offset in px for desktop
                    const scale = 1 - absDiff * 0.10; // larger scale for side cards
                    const opacity = 1 - absDiff * 0.12; // higher opacity for side cards (making back cards more visible)
                    const zIndex = 30 - absDiff * 10;
                    const rotateY = diff * -12; // 3D rotation angle

                    return (
                      <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity,
                          scale,
                          x: isMobile ? xOffsetMobile : xOffsetDesktop,
                          zIndex,
                          rotateY,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        onClick={() => {
                          if (absDiff !== 0) {
                            setCarouselIndex(idx);
                          }
                        }}
                        className={`absolute w-[240px] md:w-[330px] h-[310px] md:h-[410px] rounded-2xl border p-4 md:p-5 flex flex-col justify-between cursor-pointer select-none group transition-all duration-300 ${
                          absDiff === 0 
                            ? "bg-neutral-900/95 border-spartan-red border-2 shadow-[0_0_35px_rgba(179,0,0,0.6),0_15px_30px_rgba(0,0,0,0.7)] backdrop-blur-md" 
                            : "bg-zinc-900/85 border-white/10 hover:border-white/20 shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
                        }`}
                        style={{
                          transformStyle: "preserve-3d",
                        }}
                      >
                        {/* Top Badge */}
                        <div className="flex justify-between items-start z-10">
                          <span className={`text-[8px] md:text-[10px] uppercase font-black tracking-widest px-2 md:px-2.5 py-1 rounded-full border flex items-center gap-1 transition-all duration-300 ${
                            absDiff === 0
                              ? "bg-spartan-red/20 text-white border-spartan-red/35"
                              : "bg-zinc-800/70 text-white/70 border-white/10"
                          }`}>
                            <Flame className={`h-2.5 w-2.5 md:h-3 md:w-3 transition-colors duration-300 ${
                              absDiff === 0 ? "text-spartan-red" : "text-white/50"
                            }`} />
                            {cat.badge}
                          </span>
                        </div>

                        {/* Square Card Image Wrapper */}
                        <div className="relative my-2 w-full z-10">
                          {/* Inner container with red border and overflow hidden to clip image */}
                          <div className={`relative w-full aspect-square rounded-xl overflow-hidden border-2 bg-zinc-950/80 transition-colors duration-300 ${
                            absDiff === 0 ? "border-spartan-red shadow-[0_0_15px_rgba(179,0,0,0.3)]" : "border-spartan-red-dark/70"
                          }`}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent z-10 pointer-events-none" />
                            <motion.img
                              src={cat.image}
                              alt={cat.name}
                              className="w-full h-full object-cover select-none pointer-events-none"
                              whileHover={absDiff === 0 ? { scale: 1.08 } : {}}
                              transition={{ duration: 0.3 }}
                            />
                          </div>

                          {/* Brand Logo Badge sitting on the top-right corner of the image border */}
                          <div className="absolute -top-2.5 -right-2.5 md:-top-4 md:-right-4 z-20 pointer-events-none select-none">
                            <img
                              src="/images/spartan_logo.png"
                              alt="Spartan Brand Logo"
                              className={`h-8 w-8 md:h-12 md:w-12 object-contain filter transition-all duration-300 ${
                                absDiff === 0 
                                  ? "drop-shadow-[0_0_12px_rgba(179,0,0,0.95)] drop-shadow-[0_0_4px_rgba(255,255,255,0.7)] scale-110" 
                                  : "drop-shadow-[0_0_6px_rgba(179,0,0,0.4)] opacity-75"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Card Footer details */}
                        <div className="flex items-end justify-between pt-3 border-t border-white/5 z-10">
                          <div className="flex flex-col text-left">
                            <h4 className={`text-xs md:text-base font-black uppercase tracking-wider leading-tight transition-colors duration-300 ${
                              absDiff === 0 ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : "text-white/80"
                            }`}>
                              {cat.name}
                            </h4>
                            <p className={`text-[8px] md:text-[10px] font-bold leading-tight mt-0.5 transition-colors duration-300 ${
                              absDiff === 0 ? "text-spartan-gold" : "text-white/55"
                            }`}>
                              {cat.tagline}
                            </p>
                          </div>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSmokeClick(e);
                              router.push(`/shop?category=${cat.id}`);
                            }}
                            className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2.5 md:px-3.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                              absDiff === 0
                                ? "bg-white text-black hover:bg-spartan-gold shadow-[0_0_12px_rgba(255,255,255,0.2)] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                                : "bg-zinc-800 text-white/80 border border-white/10 hover:bg-zinc-700 hover:text-white"
                            }`}
                          >
                            View
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Right Arrow Button */}
                <button
                  type="button"
                  onClick={handleNextCategory}
                  className="absolute right-2 md:right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950/80 hover:bg-black text-white hover:text-spartan-gold border border-spartan-red/30 hover:border-spartan-gold transition-all duration-300 shadow-[0_0_10px_rgba(179,0,0,0.3)] hover:shadow-[0_0_20px_rgba(179,0,0,0.6)] cursor-pointer active:scale-95"
                  aria-label="Next Category"
                >
                  <ChevronRight className="h-5 w-5 stroke-[2.5px]" />
                </button>
              </div>

              {/* Swipe to Shop button placed closely under the cards */}
              <div className="mx-auto max-w-[280px] w-full md:hidden mt-2 mb-1 select-none relative z-20">
                <div className="relative h-14 bg-zinc-950/80 border border-white/5 rounded-full flex items-center p-1 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                  {/* Shimmering label text in the background */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-xs font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white/30 via-white/80 to-white/30 bg-[length:200%_100%] animate-shimmer">
                      {isRedirecting ? "Entering Shop..." : "Swipe to Enter Shop"}
                    </span>
                  </div>

                  {/* Slider Knob */}
                  {!isRedirecting && (
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: 0, right: 220 }}
                      dragElastic={0.05}
                      dragMomentum={false}
                      onDragEnd={(event, info) => {
                        if (info.offset.x >= 190) {
                          setIsRedirecting(true);
                          router.push("/shop");
                        }
                      }}
                      className="h-11 w-11 rounded-full bg-gradient-to-r from-spartan-red to-red-700 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-[0_0_10px_rgba(179,0,0,0.5)] border border-spartan-red/30 z-10"
                    >
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ChevronRight className="h-5 w-5 text-white stroke-[3px]" />
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Show loader inside knob area when redirecting */}
                  {isRedirecting && (
                    <div className="h-11 w-11 rounded-full bg-spartan-red flex items-center justify-center shadow-[0_0_10px_rgba(179,0,0,0.5)] border border-spartan-red/30 z-10 animate-pulse ml-auto mr-1">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Delivery Banner + Transparent Spartan Rider (Desktop Only) */}
            <div className="hidden lg:flex lg:col-span-5 flex-col justify-center relative w-full px-4 md:px-8 py-6 min-h-[360px] md:min-h-[420px] overflow-visible">
              {/* Subtle red background glow directly on the page background */}
              <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-spartan-red/10 rounded-full blur-[80px] pointer-events-none" />
              
              {/* Left aligned text contents */}
              <div className="space-y-5 max-w-[60%] sm:max-w-[65%] z-10 text-left relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <span className="inline-flex items-center gap-1.5 bg-spartan-red/15 border border-spartan-red/30 rounded-full px-3.5 py-1.5 text-[10px] font-black text-spartan-red uppercase tracking-widest shadow-lg">
                  <Truck className="h-3.5 w-3.5" />
                  Island-wide Delivery
                </span>
                
                <h3 className="text-2xl md:text-4xl font-black uppercase text-white tracking-wide leading-tight drop-shadow-md">
                  WARRIOR <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-spartan-red via-red-500 to-spartan-gold filter drop-shadow-[0_0_10px_rgba(179,0,0,0.4)]">LOGISTICS</span>
                </h3>
                
                <p className="text-sm md:text-base text-white/90 leading-relaxed font-extrabold drop-shadow">
                  We deliver all around the country Sri Lanka with care within <span className="text-spartan-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">2-4 working days</span>.
                </p>
                
                <div className="pt-2 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-spartan-gold shadow-[0_0_6px_#D4AF37]" />
                    <span className="text-[10px] md:text-xs uppercase font-black tracking-wider text-white/70">Secure Packaging Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-spartan-red shadow-[0_0_6px_#B30000]" />
                    <span className="text-[10px] md:text-xs uppercase font-black tracking-wider text-white/70">Island-wide Live Tracking</span>
                  </div>
                </div>
              </div>

              {/* Right aligned HUGE floating transparent spartan rider image */}
              <div className="absolute bottom-0 right-0 w-[80%] lg:w-[90%] h-[120%] flex items-end justify-end pointer-events-none select-none z-10 overflow-visible">
                <motion.img
                  src="/images/spartan_rider.png"
                  alt="Spartan Delivery Rider"
                  className="max-h-[125%] md:max-h-[140%] w-auto object-contain origin-bottom-right drop-shadow-[0_25px_30px_rgba(0,0,0,0.9)] translate-x-4 md:translate-x-8 translate-y-4"
                  animate={{ 
                    y: [0, -12, 0],
                    rotate: [0, -1.5, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 6, 
                    ease: "easeInOut" 
                  }}
                />
              </div>
            </div>
          </div>

          {/* 3. Products Showcased Immediately - Spacing tightened */}
          <div className="space-y-4 pt-1">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/5 pb-2">
              <h2 className="text-sm sm:text-base font-black uppercase tracking-widest text-white">
                Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-spartan-red to-spartan-gold">Nutrition</span>
              </h2>
              
              {/* Product Tabs */}
              <div className="flex rounded-full bg-zinc-950/80 p-0.5 border border-white/10">
                <button
                  onClick={(e) => {
                    handleSmokeClick(e);
                    setActiveTab("best-sellers");
                  }}
                  className="relative overflow-hidden rounded-full px-5 py-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                  style={{ color: activeTab === "best-sellers" ? "#ffffff" : "rgba(255,255,255,0.5)", backgroundColor: activeTab === "best-sellers" ? "#B30000" : "transparent" }}
                >
                  Best Sellers
                  {clicks.map((click) => (
                    <span
                      key={click.id}
                      className="smoke-particle"
                      style={{ left: click.x, top: click.y }}
                    />
                  ))}
                </button>
                <button
                  onClick={(e) => {
                    handleSmokeClick(e);
                    setActiveTab("new-arrivals");
                  }}
                  className="relative overflow-hidden rounded-full px-5 py-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                  style={{ color: activeTab === "new-arrivals" ? "#ffffff" : "rgba(255,255,255,0.5)", backgroundColor: activeTab === "new-arrivals" ? "#B30000" : "transparent" }}
                >
                  New Arrivals
                  {clicks.map((click) => (
                    <span
                      key={click.id}
                      className="smoke-particle"
                      style={{ left: click.x, top: click.y }}
                    />
                  ))}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {loadingProducts ? (
                <div className="col-span-full py-16 flex flex-col items-center justify-center text-center text-white/50 text-xs">
                  <Loader2 className="h-6 w-6 animate-spin text-spartan-red mb-2" />
                  <span>Loading Spartan Formulations...</span>
                </div>
              ) : featuredProducts.length === 0 ? (
                <div className="col-span-full py-16 flex flex-col items-center justify-center text-center text-white/50 text-xs border border-white/5 rounded-xl bg-zinc-950/20">
                  <Shield className="h-8 w-8 text-spartan-red/40 mb-2" />
                  <span className="font-bold text-white uppercase tracking-wider mb-1">No Formulations Available</span>
                  <span>Awaiting administrator catalog configuration.</span>
                </div>
              ) : (
                featuredProducts.slice(0, 4).map((product) => {
                  const isWishlisted = wishlist.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col justify-between rounded-xl border border-white/5 bg-zinc-900/40 backdrop-blur-md hover:border-spartan-red/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(179,0,0,0.15)]"
                  >
                    {/* Image Area Wrapper */}
                    <div className="relative m-2">
                      {/* Image Area */}
                      <div className="relative aspect-square overflow-hidden flex items-center justify-center p-2 sm:p-5 border-2 border-spartan-red-dark rounded-lg bg-zinc-950/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                        <Link href={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        </Link>
                        {product.stock <= 0 ? (
                          <span className="absolute top-3 left-3 bg-zinc-800 border border-zinc-700 text-neutral-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full z-10">
                            Sold Out
                          </span>
                        ) : product.oldPrice ? (
                          <span className="absolute top-3 left-3 bg-gradient-to-r from-spartan-red to-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-spartan-red/30">
                            Sale
                          </span>
                        ) : null}

                        {/* Heart (wishlist) button absolute-positioned in the top-right corner */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSmokeClick(e);
                            toggleWishlist(product.id);
                          }}
                          className={`absolute bottom-2.5 right-2.5 z-10 flex h-7.5 w-7.5 items-center justify-center rounded-full border border-white/10 transition-all cursor-pointer ${
                            isWishlisted
                              ? "bg-spartan-red text-white"
                              : "bg-black/60 text-white hover:bg-spartan-red hover:text-white"
                          }`}
                          title="Add to Wishlist"
                        >
                          <Heart className={`h-3.5 w-3.5 ${isWishlisted ? "fill-current" : ""}`} />
                          {clicks.map((click) => (
                            <span
                              key={click.id}
                              className="smoke-particle"
                              style={{ left: click.x, top: click.y }}
                            />
                          ))}
                        </button>

                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                          <Link
                            href={`/product/${product.id}`}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black hover:bg-spartan-gold hover:text-black transition-colors"
                            title="Quick View"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={(e) => {
                              handleSmokeClick(e);
                              toggleWishlist(product.id);
                            }}
                            className={`relative overflow-hidden flex h-9 w-9 items-center justify-center rounded-full transition-colors cursor-pointer ${
                              isWishlisted ? "bg-spartan-red text-white" : "bg-white text-black hover:bg-spartan-red hover:text-white"
                            }`}
                            title="Add to Wishlist"
                          >
                            <Heart className="h-4 w-4" />
                            {clicks.map((click) => (
                              <span
                                key={click.id}
                                className="smoke-particle"
                                style={{ left: click.x, top: click.y }}
                              />
                            ))}
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

                    {/* Details Area */}
                    <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between space-y-3">
                      <div>
                        <p className="text-[10px] sm:text-xs font-black tracking-widest text-spartan-gold uppercase">
                          {product.category.replace("-", " ")}
                        </p>
                        <Link
                          href={`/product/${product.id}`}
                          className="block mt-0.5 font-extrabold text-xs sm:text-base uppercase text-white hover:text-spartan-red transition-colors line-clamp-1"
                        >
                          {product.name}
                        </Link>

                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex text-spartan-gold">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-2 w-2 sm:h-2.5 sm:w-2.5 fill-current" />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-white/30">({product.reviewsCount})</span>
                        </div>
                      </div>

                      <div className="flex items-end justify-between pt-2 border-t border-white/5">
                        <div>
                          {product.oldPrice && (
                            <span className="text-[10px] sm:text-xs font-bold text-white/40 line-through">
                              Rs. {product.oldPrice.toLocaleString()}
                            </span>
                          )}
                          <p className="text-xs sm:text-sm md:text-base font-black text-white">
                            Rs. {product.price.toLocaleString()}
                          </p>
                        </div>

                        <button
                          disabled={product.stock <= 0}
                          onClick={(e) => {
                            handleSmokeClick(e);
                            addToCart(product);
                          }}
                          className={`relative overflow-hidden flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full transition-all duration-200 ${
                            product.stock <= 0
                              ? "bg-zinc-800 text-neutral-500 border border-zinc-700 cursor-not-allowed"
                              : "bg-spartan-red hover:bg-spartan-red-dark text-white shadow-glow-red cursor-pointer"
                          }`}
                          title={product.stock <= 0 ? "Sold Out" : "Add to Cart"}
                        >
                          {product.stock <= 0 ? (
                            <span className="text-[8px] font-black uppercase">X</span>
                          ) : (
                            <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          )}
                          {clicks.map((click) => (
                            <span
                              key={click.id}
                              className="smoke-particle"
                              style={{ left: click.x, top: click.y }}
                            />
                          ))}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }))}
            </div>

            <div className="text-center pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-1.5 border-b border-spartan-gold/60 pb-0.5 text-xs sm:text-sm font-black uppercase tracking-widest text-spartan-gold hover:text-white hover:border-white transition-all"
              >
                View Complete Armory Catalog
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Mobile-only Delivery Banner (Warrior Logistics) */}
            <div className="lg:hidden flex flex-col justify-center relative w-full px-4 py-6 min-h-[380px] overflow-hidden mt-4">
              {/* Subtle red background glow */}
              <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-spartan-red/10 rounded-full blur-[80px] pointer-events-none" />
              
              {/* Left aligned text contents */}
              <div className="space-y-4 max-w-[58%] z-10 text-left relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <span className="inline-flex items-center gap-1.5 bg-spartan-red/15 border border-spartan-red/30 rounded-full px-3 py-1.5 text-[10px] font-black text-spartan-red uppercase tracking-widest shadow-lg">
                  <Truck className="h-3.5 w-3.5" />
                  Island-wide Delivery
                </span>
                
                <h3 className="text-2xl font-black uppercase text-white tracking-wide leading-tight drop-shadow-md">
                  WARRIOR <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-spartan-red via-red-500 to-spartan-gold filter drop-shadow-[0_0_10px_rgba(179,0,0,0.45)]">LOGISTICS</span>
                </h3>
                
                <p className="text-xs text-white/90 leading-relaxed font-extrabold drop-shadow">
                  We deliver all around Sri Lanka within <span className="text-spartan-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">2-4 working days</span>.
                </p>
                
                <div className="pt-1 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-spartan-gold shadow-[0_0_6px_#D4AF37] shrink-0" />
                    <span className="text-[10px] uppercase font-black tracking-wider text-white/70">Secure Packaging</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-spartan-red shadow-[0_0_6px_#B30000] shrink-0" />
                    <span className="text-[10px] uppercase font-black tracking-wider text-white/70">Island-wide Tracking</span>
                  </div>
                </div>
              </div>

              {/* Right: Spartan rider image — fitted within bounds, no overflow */}
              <div className="absolute bottom-0 right-0 w-[58%] h-full flex items-end justify-end pointer-events-none select-none z-10">
                <motion.img
                  src="/images/spartan_rider.png"
                  alt="Spartan Delivery Rider"
                  className="w-full h-auto max-h-full object-contain object-bottom drop-shadow-[0_25px_30px_rgba(0,0,0,0.9)]"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, -1, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 6, 
                    ease: "easeInOut" 
                  }}
                />
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* CORE BENEFITS FEATURE */}
      <section className="py-12 bg-black border-t border-b border-white/5">
        <div className="mx-auto w-full sm:max-w-[94%] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap md:grid md:grid-cols-3 gap-4 md:gap-8 justify-center">
            <div className="flex items-center gap-4 p-4 rounded bg-zinc-900/50 border border-white/5 w-[calc(50%-8px)] md:w-auto">
              <div className="flex h-12 w-12 items-center justify-center rounded bg-spartan-red/10 border border-spartan-red/30 shrink-0">
                <Shield className="h-6 w-6 text-spartan-red" />
              </div>
              <div>
                <h3 className="font-bold text-white uppercase tracking-wider text-sm sm:text-base">100% Genuine Products</h3>
                <p className="text-[10px] sm:text-xs text-white/50">Direct from certified distributors.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded bg-zinc-900/50 border border-white/5 w-[calc(50%-8px)] md:w-auto">
              <div className="flex h-12 w-12 items-center justify-center rounded bg-spartan-gold/10 border border-spartan-gold/30 shrink-0">
                <Award className="h-6 w-6 text-spartan-gold" />
              </div>
              <div>
                <h3 className="font-bold text-white uppercase tracking-wider text-sm sm:text-base">Premium Quality</h3>
                <p className="text-[10px] sm:text-xs text-white/50">Elite formulas tested for pure results.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded bg-zinc-900/50 border border-white/5 w-[calc(50%-8px)] md:w-auto">
              <div className="flex h-12 w-12 items-center justify-center rounded bg-spartan-red/10 border border-spartan-red/30 shrink-0">
                <Zap className="h-6 w-6 text-spartan-red" />
              </div>
              <div>
                <h3 className="font-bold text-white uppercase tracking-wider text-sm sm:text-base">Expert Guidance</h3>
                <p className="text-[10px] sm:text-xs text-white/50">Free coaching on supplement stacks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 bg-black relative border-b border-white/5">
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-spartan-red/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wider">
              Spartan <span className="text-spartan-red">Testimonials</span>
            </h2>
            <p className="text-base text-white/50 max-w-md mx-auto">
              Read how elite athletes and local warriors achieve their breakthrough using our products.
            </p>
          </div>

          {/* Desktop View (Standard Grid) */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between p-6 rounded-lg bg-spartan-gray border border-white/5 hover:border-spartan-gold/20 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex text-spartan-gold">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-base text-white/90 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5">
                  <h4 className="font-bold text-white uppercase text-base tracking-wide">{t.name}</h4>
                  <span className="text-sm text-spartan-gold font-medium">{t.role}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View (Swipable Auto-Slider) */}
          <div className="md:hidden relative w-full overflow-hidden px-1">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(e, info) => {
                if (info.offset.x < -50) {
                  setTestimonialIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
                } else if (info.offset.x > 50) {
                  setTestimonialIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
                }
              }}
              animate={{ x: `-${testimonialIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex w-full cursor-grab active:cursor-grabbing"
            >
              {testimonials.map((t, idx) => (
                <div key={idx} className="w-full flex-shrink-0 px-2 select-none">
                  <div className="flex flex-col justify-between p-6 min-h-[220px] rounded-lg bg-spartan-gray border border-white/5 shadow-xl">
                    <div className="space-y-4">
                      <div className="flex text-spartan-gold">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm sm:text-base text-white/90 italic leading-relaxed font-semibold">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/5">
                      <h4 className="font-bold text-white uppercase text-sm tracking-wide">{t.name}</h4>
                      <span className="text-xs text-spartan-gold font-medium">{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
            
            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-5">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestimonialIndex(idx)}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    testimonialIndex === idx ? "bg-spartan-red w-5" : "bg-white/20"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="py-24 bg-gradient-to-b from-spartan-gray to-black">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-spartan-red/10 border border-spartan-red/30">
            <Flame className="h-8 w-8 text-spartan-red animate-pulse" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wider">
              Join the <span className="text-spartan-gold">Spartan Army</span>
            </h2>
            <p className="mx-auto max-w-md text-base text-white/60">
              Subscribe to get exclusive discounts, early drops, and professional fitness stacks guides directly to your inbox.
            </p>
          </div>

          {!newsletterSubmitted ? (
            <form onSubmit={handleNewsletterSubmit} className="mx-auto max-w-md space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Enter Name"
                  required
                  value={newsletterForm.name}
                  onChange={(e) => setNewsletterForm({ ...newsletterForm, name: e.target.value })}
                  className="flex-1 bg-black border border-white/10 rounded px-4 py-3.5 text-base text-white focus:outline-none focus:border-spartan-red"
                />
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  required
                  value={newsletterForm.email}
                  onChange={(e) => setNewsletterForm({ ...newsletterForm, email: e.target.value })}
                  className="flex-grow bg-black border border-white/10 rounded px-4 py-3.5 text-base text-white focus:outline-none focus:border-spartan-red"
                />
              </div>
              <button
                type="submit"
                onClick={handleSmokeClick}
                className="relative overflow-hidden w-full inline-flex items-center justify-center rounded bg-spartan-red hover:bg-spartan-red-dark text-white py-3.5 text-base font-bold uppercase tracking-wider transition-all shadow-glow-red cursor-pointer"
              >
                Subscribe Now
                {clicks.map((click) => (
                  <span
                    key={click.id}
                    className="smoke-particle"
                    style={{ left: click.x, top: click.y }}
                  />
                ))}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-md p-6 rounded bg-spartan-gold/5 border border-spartan-gold/20"
            >
              <h3 className="text-base font-bold text-spartan-gold uppercase tracking-wider">Welcome to the ranks, {newsletterForm.name}!</h3>
              <p className="text-sm text-white/60 mt-1">Check your email for your 10% Spartan welcome discount.</p>
            </motion.div>
          )}
        </div>
      </section>

    </div>
  );
}
