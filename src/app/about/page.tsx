"use client";

import React, { useEffect, useState } from "react";
import { 
  Shield, 
  Award, 
  Truck, 
  Flame, 
  Scroll, 
  Compass,
  Dumbbell,
  Zap,
  ArrowDown
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function AboutPage() {
  const { scrollY } = useScroll();
  
  // Parallax transform values for hero background and logo
  const heroBgY = useTransform(scrollY, [0, 800], [0, 250]);
  const heroLogoY = useTransform(scrollY, [0, 800], [0, -60]);
  const heroTextY = useTransform(scrollY, [0, 800], [0, 50]);

  // Client-side state to handle interactive client details safely
  const [isMounted, setIsMounted] = useState(false);
  const [embers, setEmbers] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
    // Generate floating fire embers with randomized properties
    const newEmbers = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 15 + 8,
      delay: Math.random() * -15,
      blur: Math.random() * 2
    }));
    setEmbers(newEmbers);
  }, []);

  const pillars = [
    {
      icon: <Shield className="h-7 w-7 text-spartan-gold animate-pulse" />,
      title: "Ironclad Authenticity",
      subtitle: "Uncompromising Stacks",
      description: "Every capsule, powder, and blend we stock is sourced directly from certified global brand manufacturers. We tolerate zero counterfiets. Your body is a temple; we supply the pure marble."
    },
    {
      icon: <Award className="h-7 w-7 text-spartan-red" />,
      title: "Warrior Discipline",
      subtitle: "Pure Result Drive",
      description: "We don't sell shortcuts. We sell ammunition for the dedicated. Our supplements are hand-selected to support the heavy lifts, the long runs, and the grueling conditioning sessions."
    },
    {
      icon: <Truck className="h-7 w-7 text-spartan-gold" />,
      title: "Rapid Deploy Delivery",
      subtitle: "Islandwide Dispatch",
      description: "Across Sri Lanka, we deliver your fitness stacks with tactical speed. No delays, no excuses. From our warehouse in Kandy directly to your training ground, keeping your cycles unbroken."
    }
  ];

  const advisorSquad = [
    {
      name: "Lasith Jayawardana",
      role: "Supreme Commander & Founder",
      discipline: "Tactical Armory Operations",
      image: "/images/commander_lasith.png"
    }
  ];

  const primalFoods = [
    { name: "Grass-Fed Beef", category: "Raw Meat & Muscle", benefit: "Packed with iron, creatine, and pure force." },
    { name: "Wild Honey", category: "Ancient Energy Glycogen", benefit: "Raw fuel sourced from Sri Lankan forests." },
    { name: "Pure Whey & Casein", category: "Anabolic Stacks", benefit: "Fast and slow release molecular building blocks." },
    { name: "Farm Fresh Eggs", category: "Hormonal Foundations", benefit: "Natural fats and dense nitrogen retention." }
  ];

  // Motion variants for scroll triggers
  const titleVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as const, stiffness: 100, damping: 15 } 
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring" as const, stiffness: 90, damping: 14 } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="bg-black text-white overflow-hidden relative selection:bg-spartan-red selection:text-white">
      
      {/* Dynamic Embedded Fire Embers Style Sheet */}
      <style>{`
        @keyframes rise-ember {
          0% {
            transform: translateY(105vh) translateX(0) scale(1) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.75;
          }
          90% {
            opacity: 0.75;
          }
          100% {
            transform: translateY(-10vh) translateX(60px) scale(0.3) rotate(360deg);
            opacity: 0;
          }
        }
        .ember-element {
          position: absolute;
          background: radial-gradient(circle, #D4AF37 0%, #B30000 70%, transparent 100%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      {/* Floating Fire Embers Layer */}
      {isMounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-1">
          {embers.map((ember) => (
            <div 
              key={ember.id}
              className="ember-element animate-rise"
              style={{
                left: ember.left,
                width: `${ember.size}px`,
                height: `${ember.size}px`,
                animation: `rise-ember ${ember.duration}s linear infinite`,
                animationDelay: `${ember.delay}s`,
                filter: `blur(${ember.blur}px)`,
                boxShadow: "0 0 8px #B30000"
              }}
            />
          ))}
        </div>
      )}

      {/* Background radial overlays */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(179,0,0,0.12)_0%,rgba(0,0,0,0)_60%)] z-0" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom,rgba(212,175,55,0.08)_0%,rgba(0,0,0,0)_60%)] z-0" />

      {/* Hero Header (Parallax Enabled) */}
      <section className="relative min-h-[95vh] md:min-h-screen flex items-center justify-center overflow-hidden border-b border-neutral-950 px-4 py-20">
        <motion.div style={{ y: heroBgY }} className="absolute inset-0 z-0">
          <img 
            src="/images/spartan_battleground_gold.png" 
            alt="Spartan Battleground Gold" 
            className="w-full h-full object-cover object-center opacity-75 md:opacity-90 filter brightness-90 contrast-110 saturate-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.2)_0%,rgba(0,0,0,0)_70%)]" />
        </motion.div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
          {/* Floating Brand Logo with Glow */}
          <motion.div
            style={{ y: heroLogoY }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.35 }}
            className="inline-block relative group"
          >
            <div className="absolute -inset-6 bg-gradient-to-r from-spartan-gold via-spartan-red to-spartan-gold rounded-full blur-2xl opacity-80 group-hover:opacity-100 transition duration-500 animate-pulse" />
            <div className="relative h-36 w-36 md:h-48 md:w-48 flex items-center justify-center">
              <img 
                src="/images/spartan_logo.png" 
                alt="Spartan Supplements Brand Logo" 
                className="h-full w-full object-contain filter drop-shadow-[0_0_25px_rgba(212,175,55,0.95)] drop-shadow-[0_0_10px_rgba(179,0,0,0.85)] group-hover:scale-110 transition-transform duration-500 cursor-pointer"
              />
            </div>
          </motion.div>

          <motion.div style={{ y: heroTextY }} className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-wider text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)] font-display"
            >
              LEGENDARY STRENGTH <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-spartan-gold via-yellow-400 to-spartan-red drop-shadow-[0_2px_15px_rgba(212,175,55,0.3)]">
                BORN IN BATTLE
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xs sm:text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-sans tracking-widest leading-relaxed font-semibold uppercase"
            >
              We forge authentic nutritional ammunition. You supply the sweat, the iron discipline, and the warrior blood. Together, we conquer.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
          >
            <a 
              href="/#products"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-spartan-red to-spartan-red-dark border border-spartan-gold/40 rounded-lg text-xs md:text-sm font-black uppercase tracking-widest text-white hover:scale-105 transition-all shadow-glow-red duration-300 text-center cursor-pointer relative group overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              Claim Your Armor
            </a>
            <a 
              href="#lore"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-neutral-800 hover:border-spartan-gold text-xs md:text-sm font-black uppercase tracking-widest text-neutral-300 hover:text-spartan-gold rounded-lg transition-all duration-300 text-center cursor-pointer"
            >
              Read the Lore
            </a>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="pt-12 hidden md:flex flex-col items-center gap-2 text-neutral-500 hover:text-spartan-gold transition-colors cursor-pointer"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest">Scroll to conquer</span>
            <ArrowDown className="h-4 w-4" />
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-10" />
      </section>

      {/* Main Content Areas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 space-y-24 md:space-y-36 relative z-10">

        {/* Section 1: The Warrior Diet (Primal Nutrition Showcase) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Details side */}
          <motion.div 
            variants={titleVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="lg:col-span-6 space-y-6 md:space-y-8 order-2 lg:order-1"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 bg-spartan-red/20 border border-spartan-red/40 text-spartan-red rounded-lg">
                <Flame className="h-5 w-5 text-spartan-red animate-pulse" />
              </span>
              <span className="text-xs md:text-sm font-bold text-spartan-gold uppercase tracking-widest">Primal Physiology</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wider font-display leading-tight">
              THE PRIMAL DIET <br />
              <span className="text-spartan-gold">FUELING LEGENDS</span>
            </h2>

            <p className="text-sm md:text-base text-neutral-400 leading-relaxed font-sans">
              Spartan warriors did not consume artificial placeholders. They thrived on high-protein, nitrogen-dense raw sustenance: flame-kissed wild meats, raw honeycomb, eggs, and dense grains. Our sports science nutritional philosophy honors this ancient foundation. 
            </p>

            <p className="text-sm md:text-base text-neutral-400 leading-relaxed font-sans">
              We bridge the gap between historic brute strength and cutting-edge biophysics. Our stacks provide clean, verified macro profiles designed for pure power output, high-threshold endurance, and rapid cellular repair.
            </p>

            {/* List of primal elements - Responsive 2 columns on mobile */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-4">
              {primalFoods.map((food, idx) => (
                <motion.div 
                  key={idx} 
                  variants={cardVariant}
                  className="p-2.5 sm:p-4 rounded-lg bg-neutral-950 border border-neutral-900 hover:border-spartan-gold/30 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-spartan-red shadow-glow-red shrink-0" />
                      <span className="text-[10px] sm:text-xs font-black uppercase text-white tracking-wider line-clamp-1">{food.name}</span>
                    </div>
                    <div className="text-[8px] sm:text-[10px] text-spartan-gold uppercase font-bold tracking-wider mt-1">{food.category}</div>
                  </div>
                  <p className="text-[9px] sm:text-[11px] text-neutral-500 mt-1 leading-normal">{food.benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Epic Image side (Clean, no frame overlay) */}
          <motion.div 
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="lg:col-span-6 order-1 lg:order-2"
          >
            <div className="relative group overflow-hidden rounded-xl border border-neutral-900 hover:border-spartan-gold/35 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all duration-500">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img 
                  src="/images/primal_protein_diet.png" 
                  alt="Primal Warrior Protein Diet" 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
              </div>
            </div>
          </motion.div>

        </section>

        {/* Section 2: The Scroll of Origin (Ancient Map Scroll) */}
        <section id="lore" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Scroll Map Image Side */}
          <motion.div 
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="relative max-w-sm mx-auto lg:max-w-none">
              {/* Vibrant golden backdrop glow */}
              <div className="absolute -inset-3 bg-gradient-to-r from-spartan-gold via-yellow-500 to-spartan-gold/30 rounded-lg blur-xl opacity-60 animate-pulse" />
              
              <div className="relative rounded-lg overflow-hidden bg-neutral-950 shadow-[0_0_35px_rgba(212,175,55,0.45)]">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img 
                    src="/images/ancient_parchment_map.png" 
                    alt="Ancient Spartan Parchment Battle Map" 
                    className="w-full h-full object-cover object-center opacity-85 contrast-125 saturate-110 filter drop-shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
                  
                  {/* Decorative compass icon overlay */}
                  <div className="absolute top-4 right-4 p-2 bg-black/65 border border-spartan-gold/40 rounded-full text-spartan-gold">
                    <Compass className="h-5 w-5 animate-spin-slow" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Lore/History details */}
          <motion.div 
            variants={titleVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="lg:col-span-7 space-y-6 md:space-y-8"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 bg-spartan-gold/15 border border-spartan-gold/30 text-spartan-gold rounded-lg">
                <Scroll className="h-6 w-6 text-spartan-gold" />
              </span>
              <span className="text-xs md:text-sm font-bold text-spartan-gold uppercase tracking-widest">Origins & Conquest</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wider font-display leading-tight">
              THE CHRONICLES OF <br />
              <span className="text-spartan-gold">SPARTAN ARMORY</span>
            </h2>

            <p className="text-sm md:text-base text-neutral-400 leading-relaxed font-sans">
              Spartan Supplements was forged in the highlands of Kandy, Sri Lanka. Our crusade began with a simple, burning realization: the domestic supplement landscape was filled with diluted formulas, questionable importers, and counterfeit stacks. We decided to draw a line in the sand.
            </p>

            <p className="text-sm md:text-base text-neutral-400 leading-relaxed font-sans">
              Like the heavy hoplites of old Greece, we stood together, pledging to build a secure bridge for athletes to access verified global imports. We eliminated middlemen and verified each batch, securing true laboratory-validated supplements for Sri Lanka's growing legion of powerlifters, rugby giants, combat sports athletes, and bodybuilding warriors.
            </p>

            <div className="p-5 rounded-lg border border-neutral-900 bg-neutral-950/40 relative">
              <div className="absolute top-0 left-4 -translate-y-1/2 bg-spartan-red text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-spartan-gold/30">
                TACTICAL COMMAND
              </div>
              <p className="italic text-xs md:text-sm text-neutral-300 font-medium">
                "We do not promise easy gains. We promise untarnished resources. Our mission ends only when every athlete in Sri Lanka competes on pure fuel."
              </p>
              <p className="text-[10px] text-spartan-gold uppercase tracking-wider font-bold mt-2 text-right">— Commander Lasith Jayawardana</p>
            </div>
          </motion.div>

        </section>

        {/* Section 3: The Spartan Code (Interactive Pillars) */}
        <section className="space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wider font-display">
              THE SPARTAN <span className="text-spartan-red">Pillars</span>
            </h2>
            <p className="text-xs md:text-sm text-neutral-500 uppercase tracking-widest font-semibold">
              The immutable values that dictate our operations
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {pillars.map((p, idx) => (
              <motion.div 
                key={idx}
                variants={cardVariant}
                className="relative group h-full cursor-default"
              >
                {/* Hover back glow */}
                <div className="absolute -inset-1 bg-gradient-to-b from-spartan-red/0 to-spartan-red/25 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
                
                <div className="relative h-full bg-neutral-950 border border-neutral-900 group-hover:border-spartan-gold/45 rounded-xl p-8 transition-all duration-300 space-y-5 flex flex-col justify-between hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-neutral-900 border border-neutral-800 text-spartan-gold rounded-lg group-hover:scale-110 group-hover:bg-spartan-red/10 transition-all duration-300">
                        {p.icon}
                      </div>
                      <div>
                        <h4 className="font-black text-white uppercase text-sm md:text-lg tracking-wider font-display">{p.title}</h4>
                        <p className="text-[9px] text-spartan-gold uppercase tracking-widest font-black">{p.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-sans">
                      {p.description}
                    </p>
                  </div>
                  
                  {/* Decorative badge */}
                  <div className="pt-4 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-neutral-600 group-hover:text-spartan-red transition-colors duration-300">
                    <Zap className="h-3 w-3" /> PILLAR {(idx + 1).toString().padStart(2, '0')}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Section 4: Elite Advisory Council (Team Profiles) */}
        <section className="space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wider font-display">
              TACTICAL <span className="text-spartan-gold">COMMAND</span>
            </h2>
            <p className="text-xs md:text-sm text-neutral-500 uppercase tracking-widest font-semibold">
              The Supreme Commander of the Spartan Supplements Legion
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="flex justify-center items-center"
          >
            {advisorSquad.map((member, idx) => (
              <motion.div 
                key={idx}
                variants={cardVariant}
                className="group relative rounded-xl overflow-hidden bg-neutral-950 border border-neutral-900 hover:border-spartan-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.25)] transition-all duration-500 flex flex-col justify-between max-w-sm w-full"
              >
                <div className="aspect-[4/5] overflow-hidden relative bg-black">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 opacity-75 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                  
                  {/* Top-right floating banner */}
                  <div className="absolute top-4 right-4 bg-black/75 border border-spartan-gold/40 rounded px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-spartan-gold shadow-glow-gold">
                    COMMANDER
                  </div>
                </div>

                <div className="p-6 space-y-3 relative z-10 bg-neutral-950">
                  <div>
                    <h4 className="font-black text-white uppercase text-base tracking-wider font-display">{member.name}</h4>
                    <p className="text-xs text-spartan-red uppercase font-bold tracking-wider mt-0.5">{member.role}</p>
                  </div>
                  <div className="pt-2.5 border-t border-neutral-900 flex items-start gap-2">
                    <Dumbbell className="h-4 w-4 text-spartan-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9px] text-neutral-500 uppercase tracking-wider font-bold">Focus Discipline</p>
                      <p className="text-xs text-neutral-400 font-medium">{member.discipline}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

      </div>
    </div>
  );
}
