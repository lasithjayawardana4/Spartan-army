"use client";

import React from "react";
import { Shield, Sparkles, Truck, Target, Eye, Dumbbell, Award, Flame } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const values = [
    {
      icon: <Shield className="h-6 w-6 text-spartan-gold" />,
      title: "100% Authentic Products",
      description: "Every item on our shelves is direct-sourced from authorized brand manufacturers and certified importers."
    },
    {
      icon: <Award className="h-6 w-6 text-spartan-red" />,
      title: "Warrior Discipline",
      description: "We are driven by results. We supply exactly what you need to break plateaus and gain size, power, or speed."
    },
    {
      icon: <Truck className="h-6 w-6 text-spartan-gold" />,
      title: "Islandwide Delivery",
      description: "We deliver across Sri Lanka with rapid tracking, securing your stacks immediately for your next workout cycle."
    }
  ];

  const team = [
    {
      name: "Ranuka De Silva",
      role: "Founder & Head Coach",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Dr. Sanduni Perera",
      role: "Sports Nutrition Consultant",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Thilan Wijesinghe",
      role: "Strength & Conditioning Specialist",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop"
    }
  ];

  return (
    <div className="bg-black py-16 space-y-24">
      
      {/* Hero Header */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(179,0,0,0.15)_0%,rgba(0,0,0,0)_70%)]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center space-y-6 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-spartan-red/10 border border-spartan-red/30 mb-2"
          >
            <Flame className="h-6 w-6 text-spartan-red" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-wider text-white"
          >
            Built for Warriors. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-spartan-red to-spartan-gold">
              Trusted by Athletes.
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base sm:text-lg text-white/70 max-w-xl mx-auto"
          >
            We supply the ammunition. You provide the discipline. Together, we conquer.
          </motion.p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider">
              Our <span className="text-spartan-red">Origin Story</span>
            </h2>
            <p className="text-base leading-relaxed text-white/70">
              Spartan Supplements is dedicated to providing premium-quality sports nutrition products that help athletes, bodybuilders, and fitness enthusiasts achieve their goals. We believe in discipline, consistency, and performance-driven results.
            </p>
            <p className="text-base leading-relaxed text-white/70">
              Founded in the fitness heart of Kandy, Sri Lanka, we recognized a gap in the market for verified, authentic nutritional supplementation. Our goal is to bring world-renowned, elite supplement brands to active individuals seeking optimal physical development.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-lg aspect-[16/10] border border-white/5">
            <img
              src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop"
              alt="Gym training background"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
          
          <div className="p-8 rounded-lg bg-spartan-gray border border-white/5 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-spartan-red/10 border border-spartan-red/30">
              <Target className="h-6 w-6 text-spartan-red" />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-wider text-white">Our Mission</h3>
            <p className="text-sm sm:text-base text-white/60 leading-relaxed">
              To empower athletic training in Sri Lanka by providing direct access to authentic, scientific, and industry-validated supplementation stack lines, removing counterfeit concerns and facilitating ultimate performance.
            </p>
          </div>
 
          <div className="p-8 rounded-lg bg-spartan-gray border border-white/5 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-spartan-gold/10 border border-spartan-gold/30">
              <Eye className="h-6 w-6 text-spartan-gold" />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-wider text-white">Our Vision</h3>
            <p className="text-sm sm:text-base text-white/60 leading-relaxed">
              To establish Spartan Supplements as the premier fitness lifestyle brand in Sri Lanka, championing the values of fitness discipline and sports scientific nutrition stacks across local coaching pipelines.
            </p>
          </div>

        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-spartan-gray/30 py-20 border-t border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider">
              Why Choose <span className="text-spartan-gold">Spartan</span>
            </h2>
            <p className="text-base text-white/50 max-w-md mx-auto">
              We stand apart through our devotion to authenticity, athlete support, and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12">
            {values.map((v, i) => (
              <div key={i} className="bg-black p-6 rounded border border-white/5 hover:border-white/10 transition-colors space-y-4">
                <div className="p-3 bg-white/5 inline-block rounded">{v.icon}</div>
                <h4 className="font-bold text-white uppercase text-base tracking-wide">{v.title}</h4>
                <p className="text-sm leading-relaxed text-white/50">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / Coach Profiles */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider">
            Elite <span className="text-spartan-red">Advisory Squad</span>
          </h2>
          <p className="text-base text-white/50 max-w-md mx-auto">
            Our expert team includes trainers and nutritionists dedicated to helping you achieve your physical limits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
          {team.map((member, i) => (
            <div key={i} className="group overflow-hidden rounded-lg bg-spartan-gray border border-white/5 hover:border-spartan-red/20 transition-all">
              <div className="aspect-[4/5] bg-black overflow-hidden relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-80"
                />
              </div>
              <div className="p-5 text-center">
                <h4 className="font-bold text-white uppercase text-base tracking-wide">{member.name}</h4>
                <p className="text-sm text-spartan-gold mt-1 font-semibold">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
