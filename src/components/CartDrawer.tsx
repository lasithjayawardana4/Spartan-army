"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CartDrawer = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    shipping,
    cartTotal,
    cartDrawerOpen,
    setCartDrawerOpen,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCartDrawerOpen(false);
      }
    };
    if (cartDrawerOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Lock page scroll
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = ""; // Reset page scroll
    };
  }, [cartDrawerOpen, setCartDrawerOpen]);

  // Click outside drawer to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
      setCartDrawerOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="relative flex h-full w-full max-w-md flex-col bg-spartan-gray shadow-[0_0_50px_rgba(0,0,0,0.8)] border-l border-white/5 z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 sm:px-6 py-5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-spartan-gold" />
                <h2 className="text-lg font-bold tracking-wider uppercase text-white">Your Cart</h2>
                <span className="rounded-full bg-spartan-red/20 px-2.5 py-0.5 text-sm font-semibold text-spartan-red border border-spartan-red/30">
                  {cartItems.length}
                </span>
              </div>
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="rounded-full p-2 text-white/60 hover:bg-white/5 hover:text-white transition-colors"
                aria-label="Close Cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content / Items List */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-white/5 p-6 mb-4">
                    <ShoppingBag className="h-12 w-12 text-white/20" />
                  </div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">Your cart is empty</h3>
                  <p className="mt-2 text-sm text-white/50 max-w-[250px]">
                    Arm yourself with premium supplements to unleash your inner spartan.
                  </p>
                  <button
                    onClick={() => setCartDrawerOpen(false)}
                    className="mt-6 inline-flex items-center justify-center rounded bg-spartan-red hover:bg-spartan-red-dark text-white px-6 py-2.5 text-base font-bold uppercase tracking-wider transition-all shadow-glow-red hover:shadow-glow-red-heavy"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    {/* Image */}
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-black border border-white/10">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-sm font-bold text-white uppercase tracking-wide line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-white/40 hover:text-spartan-red transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-spartan-gold font-bold mt-1">
                          Rs. {item.product.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center rounded border border-white/10 bg-black">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-1 text-white/60 hover:text-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-sm font-semibold text-white min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-1 text-white/60 hover:text-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-white">
                          Rs. {(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="border-t border-white/10 bg-black/60 px-4 sm:px-6 py-6 space-y-4">
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm md:text-base text-white/70">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white">Rs. {cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base text-white/70">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-500 font-medium">FREE</span> : `Rs. ${shipping}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-spartan-gold font-medium">
                      * Add Rs. {(15000 - cartSubtotal).toLocaleString()} more for free shipping!
                    </p>
                  )}
                  <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-white/5">
                    <span>Total</span>
                    <span className="text-spartan-gold">Rs. {cartTotal.toLocaleString()}</span>
                  </div>
                </div>
 
                <div className="flex gap-3 pt-2">
                  <Link
                    href="/checkout"
                    onClick={() => setCartDrawerOpen(false)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded bg-spartan-red hover:bg-spartan-red-dark text-white py-3.5 text-base font-bold uppercase tracking-wider transition-all shadow-glow-red hover:shadow-glow-red-heavy"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default CartDrawer;
