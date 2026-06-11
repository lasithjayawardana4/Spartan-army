"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { CreditCard, CheckCircle2, ChevronRight, Truck, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { placeOrder } from "@/app/actions/userActions";

export default function CheckoutPage() {
  const { cartItems, cartSubtotal, shipping, cartTotal, clearCart, user } = useCart();
  
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
  const [isPlacing, setIsPlacing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mobileShippingOpen, setMobileShippingOpen] = useState(false);

  // Promo Code States
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);
  const [promoApplied, setPromoApplied] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);

  // Dynamic Calculations
  const discountedSubtotal = cartSubtotal - discountAmount;
  const currentShipping = discountedSubtotal > 15000 || discountedSubtotal === 0 ? 0 : 500;
  const currentTotal = discountedSubtotal + currentShipping;

  // Autofill shipping details if user is logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.contact || "",
        address: prev.address || user.address || "",
      }));
    }
  }, [user]);

  // Auto-apply promo code from localStorage if set (e.g. from product page)
  useEffect(() => {
    const savedPromo = localStorage.getItem("applied_promo_code");
    if (savedPromo && cartItems.length > 0 && !appliedPromo) {
      const code = savedPromo.trim().toUpperCase();
      let totalDiscount = 0;
      let matchingItemsCount = 0;
      const productDiscountedCount: { [key: string]: number } = {};

      cartItems.forEach((item) => {
        if (item.product.promoCode && item.product.promoCode.trim().toUpperCase() === code) {
          const pct = Number(item.product.discountPercentage || 0);
          if (pct > 0) {
            const prodId = item.product.id;
            const currentDiscounted = productDiscountedCount[prodId] || 0;
            const remainingSlots = Math.max(0, 2 - currentDiscounted);
            
            if (remainingSlots > 0) {
              const quantityToDiscount = Math.min(item.quantity, remainingSlots);
              const itemPrice = item.selectedFlavor ? item.selectedFlavor.price : item.product.price;
              const discountPerUnit = itemPrice * (pct / 100);
              totalDiscount += discountPerUnit * quantityToDiscount;
              productDiscountedCount[prodId] = currentDiscounted + quantityToDiscount;
              matchingItemsCount++;
            }
          }
        }
      });
      if (matchingItemsCount > 0 && totalDiscount > 0) {
        setAppliedPromo(code);
        setDiscountAmount(totalDiscount);
        setPromoApplied(true);
        setPromoSuccess(`Promo applied successfully! (Max 2 units discounted) Saved Rs. ${totalDiscount.toLocaleString()}`);
      }
    }
  }, [cartItems, appliedPromo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyPromo = () => {
    setPromoError(null);
    setPromoSuccess(null);

    if (!promoInput.trim()) {
      setPromoError("Please enter a promo code.");
      return;
    }

    const code = promoInput.trim().toUpperCase();
    let totalDiscount = 0;
    let matchingItemsCount = 0;
    const productDiscountedCount: { [key: string]: number } = {};

    cartItems.forEach((item) => {
      if (item.product.promoCode && item.product.promoCode.trim().toUpperCase() === code) {
        const pct = Number(item.product.discountPercentage || 0);
        if (pct > 0) {
          const prodId = item.product.id;
          const currentDiscounted = productDiscountedCount[prodId] || 0;
          const remainingSlots = Math.max(0, 2 - currentDiscounted);
          
          if (remainingSlots > 0) {
            const quantityToDiscount = Math.min(item.quantity, remainingSlots);
            const itemPrice = item.selectedFlavor ? item.selectedFlavor.price : item.product.price;
            const discountPerUnit = itemPrice * (pct / 100);
            totalDiscount += discountPerUnit * quantityToDiscount;
            productDiscountedCount[prodId] = currentDiscounted + quantityToDiscount;
            matchingItemsCount++;
          }
        }
      }
    });

    if (matchingItemsCount > 0 && totalDiscount > 0) {
      setAppliedPromo(code);
      setDiscountAmount(totalDiscount);
      setPromoApplied(true);
      setPromoSuccess(`Promo applied successfully! (Max 2 units discounted) Saved Rs. ${totalDiscount.toLocaleString()}`);
    } else {
      setPromoError("This promo code is invalid or does not apply to any items in your cart.");
    }
  };

  const handleRemovePromo = () => {
    setPromoInput("");
    setAppliedPromo(null);
    setDiscountAmount(0);
    setPromoApplied(false);
    setPromoSuccess(null);
    setPromoError(null);
    localStorage.removeItem("applied_promo_code");
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.email) {
      alert("Please fill in all required fields.");
      return;
    }
    
    setIsPlacing(true);
    setErrorMsg(null);

    const orderPayload = {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      notes: formData.notes,
      paymentMethod,
      items: cartItems.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.selectedFlavor ? item.selectedFlavor.price : item.product.price,
        image: item.selectedFlavor?.image || item.product.image,
        quantity: item.quantity,
        flavor: item.selectedFlavor?.name || undefined
      })),
      subtotal: cartSubtotal,
      shipping: currentShipping,
      total: currentTotal,
      promoCode: appliedPromo || undefined,
      discountAmount: discountAmount
    };

    try {
      const res = await placeOrder(orderPayload);
      if (res.success && res.orderId) {
        setOrderId(res.orderId);
        setFinalTotal(currentTotal);
        setOrderComplete(true);
      } else {
        setErrorMsg(res.error || "Failed to place order.");
      }
    } catch (err) {
      console.error("Place order failed:", err);
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setIsPlacing(false);
    }
  };

  const handleFinish = () => {
    clearCart();
    localStorage.removeItem("applied_promo_code");
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
                Thank you! Your online transaction of <span className="text-white font-bold">Rs. {finalTotal.toLocaleString()}</span> has been securely authorized and completed via PayPal gateways.
              </p>
              <div className="border-t border-white/5 pt-3 text-xs text-white/40">
                Payment Status: <span className="font-bold uppercase" style={{color:'#D4AF37'}}>Paid & Confirmed</span>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-lg bg-black border border-white/10 text-left space-y-4">
              <div className="flex items-center gap-2 text-spartan-red font-bold text-sm uppercase tracking-wider">
                <Truck className="h-4.5 w-4.5" />
                Cash on Delivery (COD)
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Your order of <span className="text-white font-bold">Rs. {finalTotal.toLocaleString()}</span> will be delivered to <span className="text-white font-bold">{formData.address}, {formData.city}</span>. Please prepare the exact cash amount for our courier agent.
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
        <div className="max-w-3xl mx-auto">
          
          {/* Checkout Info fields */}
          <div className="space-y-8">
            <div className="border-b border-white/5 pb-6">
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">Checkout</h1>
              <p className="text-sm text-white/50 mt-1">Provide delivery credentials to seal your supplements order.</p>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-6">
              
              {/* Shipping Form fields */}
              <div className="space-y-4">
                <h3 className="text-base font-bold uppercase tracking-wider text-spartan-gold">1. Shipping Credentials</h3>
                
                {!user ? (
                  <div className="bg-spartan-gray/30 border border-white/5 rounded-lg p-6 text-center space-y-4">
                    <p className="text-sm text-white/60">You must be logged in to specify shipping details and place an order.</p>
                    <div className="flex justify-center gap-3">
                      <Link
                        href="/login?redirect=/checkout"
                        className="px-5 py-2.5 rounded bg-spartan-red hover:bg-spartan-red-dark text-white text-xs font-black uppercase tracking-wider transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup?redirect=/checkout"
                        className="px-5 py-2.5 rounded border border-white/10 hover:border-spartan-gold text-white text-xs font-black uppercase tracking-wider transition-colors"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* On Mobile: toggle button */}
                    <div className="block sm:hidden">
                      <button
                        type="button"
                        onClick={() => setMobileShippingOpen(!mobileShippingOpen)}
                        className="w-full flex items-center justify-between p-4 bg-spartan-gray border border-white/10 hover:border-spartan-gold rounded-lg font-bold text-sm text-white uppercase tracking-wider transition-colors"
                      >
                        <span>{mobileShippingOpen ? "Close Shipping Details" : "+ Add Shipping Details"}</span>
                        <span className="text-spartan-gold text-xs">{mobileShippingOpen ? "▲" : "▼"}</span>
                      </button>
                    </div>

                    <div className={`${mobileShippingOpen ? "block" : "hidden"} sm:block space-y-4`}>
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

                      {/* Mobile Only: Save button */}
                      <div className="block sm:hidden pt-2">
                        <button
                          type="button"
                          onClick={() => setMobileShippingOpen(false)}
                          className="w-full py-3.5 bg-spartan-gold hover:bg-spartan-gold/80 text-black font-black text-xs uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                        >
                          Save Shipping Details
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
 
              {/* Promo Code Section - Gold Glow Treasure */}
              <div className="p-5 rounded-lg bg-spartan-gray border border-white/5 space-y-3 mt-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest" style={{color:'#D4AF37'}}>🏆 Promo Code</span>
                  <div className="flex-1 h-px" style={{background:'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)'}} />
                </div>
                <div
                  className="relative rounded-lg p-[1px] transition-all duration-500"
                  style={{
                    background: promoApplied
                      ? 'linear-gradient(135deg, rgba(212,175,55,0.8), rgba(212,175,55,0.2), rgba(212,175,55,0.8))'
                      : 'linear-gradient(135deg, rgba(212,175,55,0.35), rgba(212,175,55,0.08), rgba(212,175,55,0.35))',
                    boxShadow: promoApplied
                      ? '0 0 22px rgba(212,175,55,0.40), 0 0 45px rgba(212,175,55,0.15)'
                      : '0 0 12px rgba(212,175,55,0.18)'
                  }}
                >
                  <div className="flex rounded-lg overflow-hidden" style={{background:'#0d0d0d'}}>
                    <input
                      type="text"
                      placeholder="Have a promo code? Enter here..."
                      value={promoApplied ? "PROMO ACTIVE" : promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (!promoApplied) handleApplyPromo(); } }}
                      disabled={promoApplied}
                      className="flex-1 bg-transparent px-4 py-3 text-sm font-bold focus:outline-none disabled:opacity-60 placeholder:text-white/25 placeholder:font-normal placeholder:tracking-normal min-w-0"
                      style={{color: promoApplied ? '#D4AF37' : 'white', letterSpacing: promoApplied ? '0.12em' : 'normal'}}
                    />
                    {promoApplied ? (
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="px-3 sm:px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-l border-white/5 whitespace-nowrap"
                        style={{color:'rgba(255,255,255,0.4)', background:'transparent'}}
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-4 sm:px-5 py-2 text-xs font-black uppercase tracking-widest cursor-pointer border-l whitespace-nowrap"
                        style={{background:'rgba(212,175,55,0.12)', borderColor:'rgba(212,175,55,0.25)', color:'#D4AF37'}}
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
                {promoError && (
                  <div className="text-xs text-spartan-red flex items-center gap-1.5 font-semibold">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>{promoError}</span>
                  </div>
                )}
                {promoSuccess && (
                  <div className="text-xs flex items-center gap-1.5 font-bold" style={{color:'#D4AF37'}}>
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>{promoSuccess}</span>
                  </div>
                )}
              </div>
 
              {/* Order Summary Section */}
              <div className="p-6 rounded-lg bg-spartan-gray border border-white/5 space-y-6 mt-6">
                <h3 className="text-base font-bold uppercase tracking-wider text-white border-b border-white/5 pb-3">Order Summary</h3>
                
                <div className="divide-y divide-white/5 overflow-y-auto max-h-[300px] pr-2 space-y-4">
                   {cartItems.map((item) => {
                     const itemPrice = item.selectedFlavor ? item.selectedFlavor.price : item.product.price;
                     const itemImage = item.selectedFlavor?.image || item.product.image;
                     return (
                       <div key={`${item.product.id}-${item.selectedFlavor?.name || ""}`} className="flex gap-4 pt-4 first:pt-0">
                         <div className="h-14 w-14 flex-shrink-0 bg-black rounded overflow-hidden border border-white/10 flex items-center justify-center p-1">
                           <img src={itemImage} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <h4 className="text-sm font-bold text-white uppercase tracking-wide truncate">{item.product.name}</h4>
                           {item.selectedFlavor && (
                             <span className="text-[10px] text-spartan-gold block font-black uppercase tracking-widest mt-0.5">
                               Flavor: {item.selectedFlavor.name}
                             </span>
                           )}
                           <span className="text-xs text-white/50 block mt-0.5">Qty: {item.quantity}</span>
                         </div>
                         <span className="text-sm font-bold text-white">
                           Rs. {(itemPrice * item.quantity).toLocaleString()}
                         </span>
                       </div>
                     );
                   })}
                </div>

                {/* Calculations */}
                <div className="border-t border-white/5 pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span>Rs. {cartSubtotal.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-spartan-red font-semibold">
                      <span>Discount</span>
                      <span>-Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white/70">
                    <span>Shipping</span>
                    <span>{currentShipping === 0 ? <span className="font-bold" style={{color:'#D4AF37'}}>FREE</span> : `Rs. ${currentShipping}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-2.5 border-t border-white/5">
                    <span>Total</span>
                    <span className="text-spartan-gold">Rs. {currentTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods selector */}
              <div className="space-y-4 pt-6 border-t border-white/5">
                <h3 className="text-base font-bold uppercase tracking-wider text-spartan-gold">2. Payment Method</h3>
                
                <div className="p-4 rounded border border-spartan-red bg-spartan-gray flex items-start gap-4">
                  <div className="mt-1 flex h-4 w-4 items-center justify-center rounded-full border border-spartan-red bg-spartan-red/25">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                  <div>
                    <span className="font-bold text-white uppercase text-sm block">Cash on Delivery (COD)</span>
                    <span className="text-xs text-white/50 mt-1 block">Pay in cash upon physical delivery.</span>
                  </div>
                </div>
              </div>
 
              {errorMsg && (
                <div className="p-3 bg-spartan-red/10 border border-spartan-red/20 rounded flex items-center gap-2 text-xs text-spartan-red">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

               {user ? (
                <button
                  type="submit"
                  disabled={isPlacing}
                  className="w-full h-12 inline-flex items-center justify-center rounded bg-spartan-red hover:bg-spartan-red-dark text-white text-sm font-bold uppercase tracking-wider transition-all shadow-glow-red hover:shadow-glow-red-heavy cursor-pointer disabled:opacity-50"
                >
                  {isPlacing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    `Place Order (Rs. ${currentTotal.toLocaleString()})`
                  )}
                </button>
              ) : (
                <div className="space-y-4 pt-2">
                  <div className="p-3 bg-spartan-red/10 border border-spartan-red/20 rounded text-center text-xs text-spartan-red font-semibold">
                    You must be logged in to place an order.
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login?redirect=/checkout"
                      className="w-full h-12 inline-flex items-center justify-center rounded bg-spartan-red hover:bg-spartan-red-dark text-white text-sm font-black uppercase tracking-wider transition-all shadow-glow-red hover:shadow-glow-red-heavy cursor-pointer"
                    >
                      Login / Sign In to Place Order
                    </Link>
                    <Link
                      href="/signup?redirect=/checkout"
                      className="w-full h-12 inline-flex items-center justify-center rounded border border-white/10 hover:border-spartan-gold text-white text-sm font-black uppercase tracking-wider transition-all hover:bg-white/5 cursor-pointer text-center"
                    >
                      Create an Account
                    </Link>
                  </div>
                </div>
              )}

            </form>
          </div>

        </div>
      )}

    </div>
  );
}
