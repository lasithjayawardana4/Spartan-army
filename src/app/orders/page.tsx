"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { 
  ShoppingBag, 
  Star, 
  MessageCircle, 
  Check, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  ArrowLeft,
  X,
  CreditCard
} from "lucide-react";
import { fetchUserOrdersAndReviews, submitProductReview } from "@/app/actions/userActions";

export default function OrdersPage() {
  const { user, loadingUser: cartLoading } = useCart();
  const router = useRouter();

  // Orders and reviews states
  const [orders, setOrders] = useState<any[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all");

  // Review submission states
  const [selectedReviewProduct, setSelectedReviewProduct] = useState<any | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  const fetchOrdersData = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetchUserOrdersAndReviews();
      if (res.success && res.orders) {
        setOrders(res.orders);
        setUserReviews(res.reviews || []);
      }
    } catch (err) {
      console.error("Failed to fetch user orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrdersData();
    } else if (!cartLoading && !user) {
      setLoadingOrders(false);
    }
  }, [user, cartLoading]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReviewProduct) return;
    if (!reviewComment.trim()) {
      setReviewError("Please enter your review feedback.");
      return;
    }

    setSubmittingReview(true);
    setReviewError(null);
    setReviewSuccess(null);

    try {
      const res = await submitProductReview({
        orderId: selectedReviewProduct.orderId,
        productId: selectedReviewProduct.productId,
        rating: reviewRating,
        comment: reviewComment
      });

      if (res.success) {
        setReviewSuccess(res.message || "Review submitted successfully!");
        setReviewComment("");
        setReviewRating(5);
        await fetchOrdersData();
        setTimeout(() => {
          setSelectedReviewProduct(null);
          setReviewSuccess(null);
        }, 1500);
      } else {
        setReviewError(res.error || "Failed to submit review.");
      }
    } catch (err) {
      console.error("Submit review error:", err);
      setReviewError("Connection error. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const isProductReviewed = (orderId: string, productId: string) => {
    return userReviews.some(r => r.orderId === orderId && r.productId === productId);
  };

  // Filter orders based on active tab
  const filteredOrders = orders.filter(o => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return o.status === "pending" || o.status === "shipped";
    if (activeTab === "completed") return o.status === "completed" || o.status === "cancelled";
    return true;
  });

  // Loading state when waiting for session check
  if (cartLoading || (loadingOrders && orders.length === 0)) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center py-20 px-4">
        <Loader2 className="h-8 w-8 animate-spin text-spartan-red" />
        <p className="text-xs text-neutral-500 mt-4 font-bold uppercase tracking-wider">Loading your Spartan Order vaults...</p>
      </div>
    );
  }

  // Not authenticated state
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white py-16 px-4">
        <div className="max-w-md mx-auto text-center bg-neutral-950 border border-neutral-900 rounded-xl p-8 space-y-6 shadow-glow-red">
          <AlertTriangle className="h-12 w-12 text-spartan-red mx-auto animate-pulse" />
          <div className="space-y-2">
            <h1 className="text-lg font-bold uppercase tracking-wider font-display">Authentication Required</h1>
            <p className="text-xs text-neutral-500">You must be logged in as a registered customer to access order dispatch and purchase history logs.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link 
              href="/login?redirect=/orders" 
              className="py-2.5 rounded bg-spartan-red hover:bg-spartan-red-dark text-xs font-bold text-white uppercase tracking-wider transition-colors duration-200"
            >
              Sign In to Account
            </Link>
            <Link 
              href="/shop" 
              className="py-2.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-neutral-400 hover:text-white uppercase tracking-wider transition-colors duration-200"
            >
              Back to Armory Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8 selection:bg-spartan-red selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-spartan-gold transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Armory Shop</span>
          </Link>
          
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Logged In as</span>
            <span className="text-xs font-black text-spartan-gold uppercase tracking-wide">{user.name}</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="border-b border-neutral-900 pb-6">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider font-display text-white">My Spartan Orders</h1>
          <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mt-1">
            Track your active stacks in transit and review completed supplement orders
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* User Profile Summary Sidecard */}
          <div className="lg:col-span-1 bg-neutral-950 border border-neutral-900 rounded-xl p-5 space-y-4">
            <div className="border-b border-neutral-900 pb-3">
              <span className="text-[10px] text-spartan-gold font-bold uppercase tracking-wider block">Spartan Warrior</span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white truncate">{user.name}</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider block">Email Address</span>
                <span className="text-neutral-350 flex items-center gap-1.5 truncate">
                  <Mail className="h-3.5 w-3.5 text-neutral-600 shrink-0" />
                  {user.email}
                </span>
              </div>

              {user.contact && (
                <div className="space-y-1">
                  <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider block">Contact Phone</span>
                  <span className="text-neutral-350 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-neutral-600 shrink-0" />
                    {user.contact}
                  </span>
                </div>
              )}

              {user.address && (
                <div className="space-y-1">
                  <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider block">Default Delivery Coordinates</span>
                  <span className="text-neutral-350 flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="h-3.5 w-3.5 text-neutral-600 shrink-0 mt-0.5" />
                    <span className="whitespace-pre-wrap">{user.address}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Orders Main Log */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Tabs Filter */}
            <div className="flex border-b border-neutral-900 bg-neutral-950/40 p-1 rounded-lg border border-neutral-900 max-w-md">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex-1 py-2 text-center text-[10px] font-black uppercase tracking-wider rounded transition-all cursor-pointer ${
                  activeTab === "all" 
                    ? "bg-spartan-red text-white shadow-glow-red" 
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab("active")}
                className={`flex-1 py-2 text-center text-[10px] font-black uppercase tracking-wider rounded transition-all cursor-pointer ${
                  activeTab === "active" 
                    ? "bg-spartan-red text-white shadow-glow-red" 
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                Active ({orders.filter(o => o.status === "pending" || o.status === "shipped").length})
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`flex-1 py-2 text-center text-[10px] font-black uppercase tracking-wider rounded transition-all cursor-pointer ${
                  activeTab === "completed" 
                    ? "bg-spartan-red text-white shadow-glow-red" 
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                Fulfillment ({orders.filter(o => o.status === "completed" || o.status === "cancelled").length})
              </button>
            </div>

            {/* Orders Feed */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-20 bg-neutral-950 border border-neutral-900 rounded-xl p-8 space-y-4">
                  <ShoppingBag className="h-10 w-10 text-neutral-700 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wide">No Orders Found</p>
                    <p className="text-[10px] text-neutral-500">You do not have any orders registered under this filter status.</p>
                  </div>
                  <Link 
                    href="/shop" 
                    className="mt-2 inline-flex items-center justify-center px-5 py-2.5 rounded bg-neutral-900 border border-neutral-800 hover:border-spartan-gold text-xs font-bold text-white uppercase tracking-wider transition-all duration-200"
                  >
                    Explore Supplement Stacks
                  </Link>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="bg-neutral-950 border border-neutral-900 hover:border-neutral-800 transition-all duration-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md"
                  >
                    {/* Header Banner */}
                    <div className="bg-black/50 border-b border-neutral-900 px-5 py-4 flex justify-between items-center flex-wrap gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider block">Order Tracking Identification</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-spartan-gold font-mono tracking-wider">{order.orderId}</span>
                          <span className="text-neutral-700 text-xs select-none">|</span>
                          <span className="text-[10px] text-neutral-400 font-bold flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-neutral-650" />
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
                          </span>
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-wider border ${
                        order.status === "pending"
                          ? "bg-spartan-red/10 border-spartan-red/20 text-spartan-red animate-pulse"
                          : order.status === "shipped"
                            ? "bg-spartan-gold/10 border-spartan-gold/25 text-spartan-gold animate-pulse"
                            : order.status === "completed"
                              ? "bg-emerald-950/15 border-emerald-900/30 text-emerald-400"
                              : "bg-neutral-900 border-neutral-800 text-neutral-500"
                      }`}>
                        {order.status === "pending" && "Pending Dispatch"}
                        {order.status === "shipped" && "Shipped / In Transit"}
                        {order.status === "completed" && "Delivered & Complete"}
                        {order.status === "cancelled" && "Cancelled"}
                      </span>
                    </div>

                    {/* Order Details Body */}
                    <div className="p-5 space-y-4">
                      
                      {/* Products Stack */}
                      <div className="divide-y divide-neutral-900/60">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <Link 
                                href={`/product/${item.productId}`}
                                className="w-11 h-11 rounded bg-black border border-neutral-900 flex items-center justify-center p-1.5 shrink-0 hover:border-spartan-gold transition-colors duration-200"
                              >
                                <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                              </Link>
                              <div className="min-w-0 flex-1">
                                <Link 
                                  href={`/product/${item.productId}`}
                                  className="font-bold text-white hover:text-spartan-gold transition-colors truncate uppercase tracking-wide text-xs block"
                                >
                                  {item.name}
                                </Link>
                                <div className="text-[10px] text-neutral-500 mt-0.5">
                                  Qty: {item.quantity} × <span className="font-semibold text-neutral-400">Rs. {item.price.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <span className="font-bold text-white text-xs">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                              {order.status === "completed" && (
                                isProductReviewed(order.orderId, item.productId) ? (
                                  <span className="text-[9px] text-emerald-400 font-extrabold flex items-center gap-0.5 uppercase tracking-wide">
                                    <Check className="h-3 w-3" /> Reviewed
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => setSelectedReviewProduct({
                                      orderId: order.orderId,
                                      productId: item.productId,
                                      productName: item.name
                                    })}
                                    className="px-2.5 py-1 rounded bg-spartan-gold hover:bg-yellow-600 text-[9px] font-black text-black uppercase tracking-wider transition-colors duration-150 cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95"
                                  >
                                    <MessageCircle className="h-3 w-3" />
                                    <span>Write Review</span>
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Recipient Shipping Address & Calculation summary */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-900 text-xs">
                        
                        {/* Shipping Details */}
                        <div className="bg-black/30 border border-neutral-900/60 rounded-lg p-3 space-y-2">
                          <span className="text-[9px] text-spartan-gold font-bold uppercase tracking-wider block">Recipient Shipping Details</span>
                          <div className="space-y-1">
                            <p className="font-bold text-white uppercase tracking-wide">{order.fullName}</p>
                            <p className="text-neutral-400 font-medium flex items-center gap-1.5">
                              <Phone className="h-3 w-3 text-neutral-600" />
                              {order.phone}
                            </p>
                            <p className="text-neutral-400 font-medium flex items-start gap-1.5 leading-relaxed">
                              <MapPin className="h-3 w-3 text-neutral-600 mt-0.5 shrink-0" />
                              <span>{order.address}, {order.city}</span>
                            </p>
                            {order.notes && (
                              <p className="text-neutral-500 italic mt-1 font-semibold">
                                Notes: "{order.notes}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Calculation Summary */}
                        <div className="bg-black/30 border border-neutral-900/60 rounded-lg p-3 flex flex-col justify-between space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">Payment Protocol</span>
                            <span className="font-bold text-white uppercase font-mono text-[10px] flex items-center gap-1">
                              <CreditCard className="h-3 w-3 text-neutral-500" />
                              {order.paymentMethod === "cod" ? "Cash On Delivery (COD)" : "Card Checkout"}
                            </span>
                          </div>
                          
                          <div className="border-t border-neutral-900/40 pt-2 space-y-1.5 text-right font-medium">
                            <div className="flex justify-between text-neutral-500">
                              <span>Subtotal</span>
                              <span>Rs. {order.subtotal?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-neutral-500">
                              <span>Shipping Charge</span>
                              <span>{order.shipping === 0 ? "FREE" : `Rs. ${order.shipping}`}</span>
                            </div>
                            <div className="flex justify-between font-bold text-white border-t border-neutral-900/45 pt-1.5 text-sm">
                              <span>Grand Total</span>
                              <span className="text-spartan-gold">Rs. {order.total?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>

      {/* SUBMIT REVIEW OVERLAY MODAL */}
      {selectedReviewProduct && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-neutral-950 border border-neutral-900 rounded-xl p-5 space-y-4 animate-scale-in">
            <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
              <div className="flex items-center gap-2 text-spartan-gold">
                <MessageCircle className="h-4.5 w-4.5" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-display">Write Product Review</h3>
              </div>
              <button
                onClick={() => setSelectedReviewProduct(null)}
                className="p-1 rounded hover:bg-neutral-900 border border-transparent hover:border-neutral-850 text-neutral-500 hover:text-white transition-all cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="text-[10px] text-neutral-500 uppercase font-semibold">
                Product: <span className="text-white block mt-0.5 text-xs font-extrabold uppercase truncate">{selectedReviewProduct.productName}</span>
              </div>

              {reviewError && (
                <div className="p-2.5 bg-spartan-red/10 border border-spartan-red/20 rounded text-[11px] text-spartan-red flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>{reviewError}</span>
                </div>
              )}

              {reviewSuccess && (
                <div className="p-2.5 bg-emerald-950/20 border border-emerald-900/40 rounded text-[11px] text-emerald-400 flex items-center gap-1.5 animate-pulse">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>{reviewSuccess}</span>
                </div>
              )}

              {/* Star Selector */}
              <div>
                <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Star Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="text-spartan-gold hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    >
                      <Star 
                        className={`h-7 w-7 ${star <= reviewRating ? "fill-current animate-pulse" : "text-neutral-850"}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Input */}
              <div>
                <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Your Feedback Comment</label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this supplement formula..."
                  className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded p-2.5 text-xs text-white focus:outline-none transition-all resize-none"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={() => setSelectedReviewProduct(null)}
                  className="px-3.5 py-2 text-[10px] font-bold text-neutral-400 hover:text-white border border-neutral-850 hover:border-neutral-800 rounded bg-neutral-900 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="flex items-center gap-1.5 px-4 py-2 rounded bg-spartan-red hover:bg-spartan-red-dark text-[10px] font-bold text-white transition-all cursor-pointer disabled:opacity-50 shadow-glow-red uppercase tracking-wider"
                >
                  {submittingReview ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  <span>Submit Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
