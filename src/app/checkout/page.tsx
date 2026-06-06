"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { CreditCard, CheckCircle2, ChevronRight, Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const { cartItems, cartSubtotal, shipping, cartTotal, clearCart } = useCart();
  
  // Checkout Form States
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: ""
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      alert("Please fill in all required fields.");
      return;
    }
    
    // Generate a random order number
    const generatedId = `SPN-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setOrderComplete(true);
  };

  const handleFinish = () => {
    clearCart();
    window.location.href = "/";
  };

  // If cart is empty and order is not complete, prompt user
  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-white">Your Cart is Empty</h1>
        <p className="text-sm text-white/50 mt-2">Add supplements from the store to proceed to checkout.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded bg-spartan-red hover:bg-spartan-red-dark text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Go to Armory
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Checkout Success Screen */}
      {orderComplete ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto bg-spartan-gray border border-white/5 p-8 sm:p-12 rounded-xl text-center space-y-8"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30 text-green-500">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
              Order Confirmed!
            </h1>
            <p className="text-sm text-white/50">
              Your training supplements are reserved. Order ID: <span className="text-spartan-gold font-bold">{orderId}</span>
            </p>
          </div>
 
          {/* Payment Method Specific Instructions */}
          {paymentMethod === "card" ? (
            <div className="p-6 rounded-lg bg-black border border-white/10 text-left space-y-4">
              <div className="flex items-center gap-2 text-spartan-gold font-bold text-sm uppercase tracking-wider">
                <CreditCard className="h-4.5 w-4.5" />
                Online Card Payment Confirmed
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Thank you! Your online transaction of <span className="text-white font-bold">Rs. {cartTotal.toLocaleString()}</span> has been securely authorized and completed via PayPal gateways.
              </p>
              <div className="border-t border-white/5 pt-3 text-xs text-white/40">
                Payment Status: <span className="text-emerald-400 font-bold uppercase">Paid & Confirmed</span>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-lg bg-black border border-white/10 text-left space-y-4">
              <div className="flex items-center gap-2 text-spartan-red font-bold text-sm uppercase tracking-wider">
                <Truck className="h-4.5 w-4.5" />
                Cash on Delivery (COD)
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Your order of <span className="text-white font-bold">Rs. {cartTotal.toLocaleString()}</span> will be delivered to <span className="text-white font-bold">{formData.address}, {formData.city}</span>. Please prepare the exact cash amount for our courier agent.
              </p>
            </div>
          )}
 
          <div className="text-sm text-white/40 max-w-sm mx-auto">
            A confirmation receipt containing details has been sent to <span className="text-white">{formData.email}</span>. Thank you for choosing Spartan Supplements.
          </div>

          <button
            onClick={handleFinish}
            className="w-full inline-flex items-center justify-center rounded bg-spartan-red hover:bg-spartan-red-dark text-white py-3.5 text-sm font-bold uppercase tracking-wider transition-all shadow-glow-red hover:shadow-glow-red-heavy cursor-pointer"
          >
            Return to Storefront
          </button>
        </motion.div>
      ) : (
        /* Checkout Forms */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* Checkout Info fields - Col span 7 */}
          <div className="lg:col-span-7 space-y-8">
            <div className="border-b border-white/5 pb-6">
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">Checkout</h1>
              <p className="text-sm text-white/50 mt-1">Provide delivery credentials to seal your supplements order.</p>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-6">
              
              {/* Shipping Form fields */}
              <div className="space-y-4">
                <h3 className="text-base font-bold uppercase tracking-wider text-spartan-gold">1. Shipping Credentials</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white/50 uppercase">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-spartan-gray border border-white/10 rounded px-4 py-3.5 text-base text-white focus:outline-none focus:border-spartan-red"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white/50 uppercase">Phone Number *</label>
                    <input
                      type="text"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-spartan-gray border border-white/10 rounded px-4 py-3.5 text-base text-white focus:outline-none focus:border-spartan-red"
                      placeholder="07X XXX XXXX"
                    />
                  </div>
                </div>
 
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/50 uppercase">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-spartan-gray border border-white/10 rounded px-4 py-3.5 text-base text-white focus:outline-none focus:border-spartan-red"
                    placeholder="Enter email address"
                  />
                </div>
 
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-white/50 uppercase">Delivery Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-spartan-gray border border-white/10 rounded px-4 py-3.5 text-base text-white focus:outline-none focus:border-spartan-red"
                      placeholder="Street address, building number"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white/50 uppercase">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-spartan-gray border border-white/10 rounded px-4 py-3.5 text-base text-white focus:outline-none focus:border-spartan-red"
                      placeholder="Kandy, Colombo, etc."
                    />
                  </div>
                </div>
 
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/50 uppercase">Order Notes (Optional)</label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full bg-spartan-gray border border-white/10 rounded px-4 py-3.5 text-base text-white focus:outline-none focus:border-spartan-red resize-none"
                    placeholder="Delivery instructions, gate codes, etc."
                  />
                </div>
              </div>

              {/* Payment Methods selector */}
              <div className="space-y-4 pt-6 border-t border-white/5">
                <h3 className="text-base font-bold uppercase tracking-wider text-spartan-gold">2. Payment Method</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* COD */}
                  <label className={`flex items-start gap-4 p-4 rounded border cursor-pointer transition-colors bg-spartan-gray ${
                    paymentMethod === "cod" ? "border-spartan-red" : "border-white/5"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="mt-1 accent-spartan-red"
                    />
                    <div>
                      <span className="font-bold text-white uppercase text-sm block">Cash on Delivery (COD)</span>
                      <span className="text-xs text-white/50 mt-1 block">Pay in cash upon physical delivery.</span>
                    </div>
                  </label>
 
                  {/* Credit Card / PayPal */}
                  <label className={`flex items-start gap-4 p-4 rounded border cursor-pointer transition-colors bg-spartan-gray ${
                    paymentMethod === "card" ? "border-spartan-red" : "border-white/5"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="mt-1 accent-spartan-red"
                    />
                    <div>
                      <span className="font-bold text-white uppercase text-sm block flex items-center gap-1.5">
                        Credit Card / PayPal
                      </span>
                      <span className="text-xs text-white/50 mt-1 block font-medium">Pay securely with Visa, MasterCard, or PayPal.</span>
                    </div>
                  </label>
                </div>

                {/* Inline Card Details Form */}
                {paymentMethod === "card" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-5 rounded-lg bg-black border border-white/5 space-y-4 mt-4"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-spartan-gold" />
                        Secure Payment Details
                      </span>
                      <div className="flex gap-1">
                        <img src="https://img.icons8.com/color/36/000000/visa.png" alt="Visa" className="h-5 object-contain" />
                        <img src="https://img.icons8.com/color/36/000000/mastercard.png" alt="MasterCard" className="h-5 object-contain" />
                        <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" className="h-5 object-contain" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase">Card Number</label>
                        <input
                          type="text"
                          required={paymentMethod === "card"}
                          maxLength={19}
                          placeholder="4111 2222 3333 4444"
                          className="w-full bg-spartan-gray border border-white/10 rounded px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-spartan-red font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase">Expiration Date</label>
                          <input
                            type="text"
                            required={paymentMethod === "card"}
                            maxLength={5}
                            placeholder="MM/YY"
                            className="w-full bg-spartan-gray border border-white/10 rounded px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-spartan-red font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase">Security Code (CVC)</label>
                          <input
                            type="password"
                            required={paymentMethod === "card"}
                            maxLength={4}
                            placeholder="123"
                            className="w-full bg-spartan-gray border border-white/10 rounded px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-spartan-red font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
 
              <button
                type="submit"
                className="w-full h-12 inline-flex items-center justify-center rounded bg-spartan-red hover:bg-spartan-red-dark text-white text-sm font-bold uppercase tracking-wider transition-all shadow-glow-red hover:shadow-glow-red-heavy cursor-pointer"
              >
                Place Order (Rs. {cartTotal.toLocaleString()})
              </button>

            </form>
          </div>

          {/* Cart Summary Panel - Col span 5 */}
          <aside className="lg:col-span-5 p-6 rounded-lg bg-spartan-gray border border-white/5 space-y-6">
            <h3 className="text-base font-bold uppercase tracking-wider text-white border-b border-white/5 pb-3">Order Summary</h3>
            
            <div className="divide-y divide-white/5 overflow-y-auto max-h-[300px] pr-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex gap-4 pt-4 first:pt-0">
                  <div className="h-14 w-14 flex-shrink-0 bg-black rounded overflow-hidden border border-white/10 flex items-center justify-center p-1">
                    <img src={item.product.image} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide truncate">{item.product.name}</h4>
                    <span className="text-xs text-white/50 block mt-0.5">Qty: {item.quantity}</span>
                  </div>
                  <span className="text-sm font-bold text-white">
                    Rs. {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
 
            {/* Calculations */}
            <div className="border-t border-white/5 pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-white/70">
                <span>Subtotal</span>
                <span>Rs. {cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-500 font-semibold">FREE</span> : `Rs. ${shipping}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2.5 border-t border-white/5">
                <span>Total</span>
                <span className="text-spartan-gold">Rs. {cartTotal.toLocaleString()}</span>
              </div>
            </div>

          </aside>

        </div>
      )}

    </div>
  );
}
