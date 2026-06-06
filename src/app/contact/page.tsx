"use client";

import React, { useState } from "react";
import { MapPin, Phone, MessageSquare, Clock, Send, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setFormSubmitted(true);
    }
  };

  const details = [
    {
      icon: <MapPin className="h-6 w-6 text-spartan-red" />,
      title: "Store Location",
      value: "Spartan Supplements",
      desc: "129/35 Anagarika Dharmapala Road, Kandy, Sri Lanka"
    },
    {
      icon: <Phone className="h-6 w-6 text-spartan-gold" />,
      title: "Phone & WhatsApp",
      value: "+94 71 552 0324",
      desc: "Call or text us for direct stock inquiry."
    },
    {
      icon: <Clock className="h-6 w-6 text-spartan-red" />,
      title: "Business Hours",
      value: "Mon - Sat: 8:00 AM - 8:00 PM",
      desc: "Sunday: 9:00 AM - 5:00 PM"
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Title */}
      <div className="border-b border-white/5 pb-8">
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wider">
          Contact <span className="text-spartan-gold">The Outpost</span>
        </h1>
        <p className="text-base text-white/50 mt-2">
          Connect with us. Get guidance, stack suggestions, or locate our physical supplement store.
        </p>
      </div>

      {/* Grid: Info details & Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 items-start">
        
        {/* Info detail Cards */}
        <div className="lg:col-span-1 space-y-6">
          {details.map((d, i) => (
            <div key={i} className="p-6 rounded-lg bg-spartan-gray border border-white/5 space-y-4">
              <div className="p-3 bg-black/40 inline-block rounded border border-white/5">{d.icon}</div>
              <div>
                <span className="text-xs text-white/40 block font-bold uppercase tracking-wider">{d.title}</span>
                <span className="font-bold text-white uppercase text-base block mt-1">{d.value}</span>
                <span className="text-sm text-white/50 mt-1 block leading-relaxed">{d.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 p-8 rounded-lg bg-spartan-gray border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-spartan-red/5 rounded-full blur-2xl pointer-events-none" />
          
          <h3 className="text-lg font-bold uppercase tracking-wider text-white mb-6">Send A Message</h3>
          
          {!formSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/50 uppercase">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded px-4 py-3.5 text-base text-white focus:outline-none focus:border-spartan-red"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/50 uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded px-4 py-3.5 text-base text-white focus:outline-none focus:border-spartan-red"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
 
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50 uppercase">Phone Number (Optional)</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded px-4 py-3.5 text-base text-white focus:outline-none focus:border-spartan-red"
                  placeholder="Enter phone number"
                />
              </div>
 
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50 uppercase">Your Message</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded px-4 py-3.5 text-base text-white focus:outline-none focus:border-spartan-red resize-none"
                  placeholder="Describe your training goals or question..."
                />
              </div>
 
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 inline-flex items-center justify-center gap-2 rounded bg-spartan-red hover:bg-spartan-red-dark text-white text-sm font-bold uppercase tracking-wider transition-all shadow-glow-red cursor-pointer"
              >
                Send Message
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-4"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30 text-green-500">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-white uppercase tracking-wider text-base">Message Dispatched</h4>
                <p className="text-sm text-white/50 mt-1 max-w-sm mx-auto">
                  Thank you, {form.name}. A Spartan Nutrition Coach will review your request and get back to you shortly.
                </p>
              </div>
              <button
                onClick={() => { setFormSubmitted(false); setForm({ name: "", email: "", phone: "", message: "" }); }}
                className="text-sm text-spartan-gold font-bold uppercase tracking-wider border-b border-spartan-gold pb-0.5 hover:text-white hover:border-white transition-colors"
              >
                Send Another Message
              </button>
            </motion.div>
          )}

        </div>
      </div>

      {/* Embedded Maps Section */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold uppercase tracking-wider text-white">Find Us On Google Maps</h3>
        <div className="w-full h-[400px] rounded-lg overflow-hidden border border-white/5 shadow-inner bg-spartan-gray">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.591244031627!2d80.6358356!3d7.2917711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3662d55555555%3A0x647e3bf8e2e285d8!2sAnagarika%20Dharmapala%20Mawatha%2C%20Kandy!5e0!3m2!1sen!2slk!4v1717387200000!5m2!1sen!2slk"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Spartan Supplements Location Map"
          />
        </div>
      </section>

    </div>
  );
}
