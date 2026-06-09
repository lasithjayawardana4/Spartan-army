"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";
import { Star, Heart, ShoppingCart, MessageCircle, ArrowLeft, ShieldCheck, CheckCircle2, ChevronRight, ChevronLeft, Loader2, Tag } from "lucide-react";
import Link from "next/link";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({ params }: ProductPageProps) {
  const { id } = React.use(params);
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist } = useCart();
  
  // States
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"description" | "benefits" | "ingredients" | "usage" | "reviews">("description");

  // Fetch product and related products
  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        if (active) {
          setProduct(data);
          setSelectedImage(data.image || "");
          
          // Fetch related products
          fetch("/api/products")
            .then((res) => res.json())
            .then((allProducts) => {
              if (active && Array.isArray(allProducts)) {
                setProducts(allProducts);
              }
            })
            .catch((err) => console.error("Error fetching related products:", err));

          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        if (active) {
          setProduct(null);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-screen bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin text-spartan-red" />
        <p className="text-sm text-white/50 mt-4 uppercase tracking-wider font-bold">Retrieving Warrior Formula...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-white">Product Not Found</h1>
        <p className="text-xs text-white/50 mt-2">The supplement you are looking for does not exist or is out of stock.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded bg-spartan-red hover:bg-spartan-red-dark text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Shop
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  const reviewsList = (product as any).reviews || [];
  const reviewsCount = reviewsList.length || product.reviewsCount || 0;
  const averageRating = reviewsList.length > 0 
    ? (reviewsList.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewsList.length) 
    : (product.rating || 5);
  const roundedRating = Math.round(averageRating);

  // Image switcher handlers
  const handlePrevImage = () => {
    if (!product || !product.images || product.images.length <= 1) return;
    const currentIndex = product.images.indexOf(selectedImage);
    const prevIndex = currentIndex === 0 ? product.images.length - 1 : currentIndex - 1;
    setSelectedImage(product.images[prevIndex]);
  };

  const handleNextImage = () => {
    if (!product || !product.images || product.images.length <= 1) return;
    const currentIndex = product.images.indexOf(selectedImage);
    const nextIndex = currentIndex === product.images.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(product.images[nextIndex]);
  };
  
  // WhatsApp link generator
  const getWhatsAppInquiryUrl = (isRestock: boolean = false) => {
    const text = isRestock
      ? `Hello Spartan Supplements, I would like to inquire about when the product: ${product.name} (Rs. ${product.price.toLocaleString()}) will be restocked.`
      : `Hello Spartan Supplements, I would like to inquire about the product: ${product.name} (Rs. ${product.price.toLocaleString()})`;
    return `https://wa.me/94715520324?text=${encodeURIComponent(text)}`;
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/checkout");
  };

  // Filter related products
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="relative min-h-screen bg-black">
      {/* Continuous Spartan Dragon Background */}
      <div className="absolute top-0 left-0 right-0 h-[100vh] lg:h-full pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/spartan_dragon_bg.png')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 lg:via-black/95 to-black/40 lg:to-black/60 bg-black/30 lg:bg-black/60 backdrop-blur-none lg:backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(179,0,0,0.25)_0%,rgba(0,0,0,0)_85%)] lg:bg-[radial-gradient(circle_at_center,rgba(179,0,0,0.15)_0%,rgba(0,0,0,0)_85%)]" />
        </div>
      </div>

      <div className="relative mx-auto w-full sm:max-w-[94%] px-4 sm:px-6 lg:px-8 py-12 space-y-16 z-10">
        
        {/* Breadcrumbs / Back button */}
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/50">
          <Link href="/" className="hover:text-spartan-red transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/shop" className="hover:text-spartan-red transition-colors">Shop</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-white">{product.name}</span>
        </div>

        {/* Main product card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-spartan-gray/40 border border-white/5 p-6 sm:p-10 rounded-xl backdrop-blur-md">
          
          {/* Gallery column - takes 5 out of 12 columns, max-width constrained */}
          <div className="lg:col-span-5 space-y-4 max-w-[480px] mx-auto w-full">
            <div className="relative">
              {/* Main Image Container with red border and NO overflow-hidden to allow logo breakout */}
              <div className="relative bg-black aspect-square flex items-center justify-center p-6 border-2 border-spartan-red-dark rounded-lg">
                
                {/* Navigation Arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950/80 hover:bg-black text-white hover:text-spartan-gold border border-spartan-red/30 hover:border-spartan-gold active:scale-95 shadow-[0_0_8px_rgba(179,0,0,0.3)] hover:shadow-[0_0_15px_rgba(179,0,0,0.6)] transition-all duration-200 cursor-pointer"
                      title="Previous Image"
                    >
                      <ChevronLeft className="h-4.5 w-4.5 stroke-[2.5px]" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950/80 hover:bg-black text-white hover:text-spartan-gold border border-spartan-red/30 hover:border-spartan-gold active:scale-95 shadow-[0_0_8px_rgba(179,0,0,0.3)] hover:shadow-[0_0_15px_rgba(179,0,0,0.6)] transition-all duration-200 cursor-pointer"
                      title="Next Image"
                    >
                      <ChevronRight className="h-4.5 w-4.5 stroke-[2.5px]" />
                    </button>
                  </>
                )}

                {/* Main image */}
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Brand Logo Helmet Badge sitting on the top-right corner, outside the box */}
              <div className="absolute -top-3 -right-3 md:-top-5 md:-right-5 z-20 pointer-events-none select-none">
                <img
                  src="/images/spartan_logo.png"
                  alt="Spartan Brand Logo"
                  className="h-10 w-10 md:h-16 md:w-16 object-contain filter drop-shadow-[0_0_8px_rgba(179,0,0,0.95)] drop-shadow-[0_0_3px_rgba(255,255,255,0.55)]"
                />
              </div>
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square bg-black border rounded p-1.5 overflow-hidden flex items-center justify-center cursor-pointer transition-colors ${
                      selectedImage === img ? "border-spartan-red" : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <img src={img} alt={`${product.name} gallery ${index}`} className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Column - takes 7 out of 12 columns */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-sm font-bold text-spartan-gold uppercase tracking-wider">
                {product.category.replace("-", " ")}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight mt-1">
                {product.name}
              </h1>
              
              {/* Reviews */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex text-spartan-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < roundedRating ? "fill-current" : "text-white/20"}`} />
                  ))}
                </div>
                <span className="text-sm text-white/50">({reviewsCount} Customer Reviews)</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-center flex-wrap gap-3 border-b border-white/5 pb-4">
              <span className="text-2xl sm:text-3xl font-black text-white">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-white/40 line-through">
                  Rs. {product.oldPrice.toLocaleString()}
                </span>
              )}
              {/* Stock Status Badge */}
              {product.stock <= 0 ? (
                <span className="ml-2 inline-flex items-center px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest bg-zinc-950 border border-spartan-red text-spartan-red animate-pulse">
                  Sold Out
                </span>
              ) : product.stock <= 5 ? (
                <span className="ml-2 inline-flex items-center px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest bg-zinc-950 border border-spartan-gold text-spartan-gold">
                  Low Stock ({product.stock} Left)
                </span>
              ) : (
                <span className="ml-2 inline-flex items-center px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest bg-zinc-950 border border-spartan-gold/60 text-spartan-gold">
                  In Stock
                </span>
              )}
            </div>

            {/* Promo Code Info Banner if available */}
            {product.promoCode && (product.discountPercentage || 0) > 0 && (
              <div className="flex items-center gap-3.5 p-4 my-4 rounded-lg" style={{background:'rgba(212,175,55,0.06)',border:'1px solid rgba(212,175,55,0.30)',boxShadow:'0 0 18px rgba(212,175,55,0.10), inset 0 0 12px rgba(212,175,55,0.04)'}}>
                <Tag className="h-5 w-5 shrink-0" style={{color:'#D4AF37'}} />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider block" style={{color:'#D4AF37'}}>🏷️ Exclusive Promo Available</span>
                  <span className="text-xs sm:text-sm font-semibold mt-0.5 block leading-relaxed text-white/80">
                    Apply your promo code at checkout to unlock a <span className="font-bold" style={{color:'#D4AF37'}}>{product.discountPercentage}% discount</span> on this product!
                  </span>
                </div>
              </div>
            )}

            <p className="text-base text-white/70 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Key Specs */}
            {product.features && product.features.length > 0 && (
              <div className="grid grid-cols-2 gap-4 py-4 px-5 rounded bg-black border border-white/5">
                {product.features.map((feat, i) => (
                  <div key={i} className="text-xs sm:text-sm">
                    <span className="text-white/40 block font-semibold">{feat.label}:</span>
                    <span className="text-white font-bold">{feat.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4 pt-4 border-t border-white/5 max-w-[480px] w-full">
              <div className="flex flex-wrap items-center gap-4">
                
                {/* Qty Selector */}
                <div className={`flex items-center justify-between border border-white/10 rounded bg-black h-12 order-1 flex-1 sm:flex-initial sm:w-auto ${
                  product.stock <= 0 ? "opacity-30 pointer-events-none" : ""
                }`}>
                  <button
                    disabled={product.stock <= 0}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 text-white/60 hover:text-white transition-colors h-full"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-bold text-white min-w-[40px] text-center">
                    {product.stock <= 0 ? 0 : quantity}
                  </span>
                  <button
                    disabled={product.stock <= 0}
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 text-white/60 hover:text-white transition-colors h-full"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  disabled={product.stock <= 0}
                  onClick={() => addToCart(product, quantity)}
                  className={`order-3 w-full sm:order-2 sm:flex-1 h-12 inline-flex items-center justify-center gap-2 rounded font-bold uppercase tracking-wider text-sm transition-all cursor-pointer ${
                    product.stock <= 0
                      ? "bg-zinc-800 text-neutral-500 border border-zinc-700 cursor-not-allowed shadow-none"
                      : "bg-spartan-red hover:bg-spartan-red-dark text-white shadow-glow-red hover:shadow-glow-red-heavy"
                  }`}
                >
                  <ShoppingCart className="h-4.5 w-4.5" />
                  {product.stock <= 0 ? "Sold Out" : "Add to Cart"}
                </button>

                {/* Wishlist button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`order-2 flex-shrink-0 sm:order-3 h-12 w-12 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                    isWishlisted ? "bg-spartan-red border-spartan-red text-white" : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                  title="Wishlist"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              {/* Buy Now & Contact Sellers */}
              {product.stock <= 0 ? (
                <div className="pt-2">
                  <a
                    href={getWhatsAppInquiryUrl(true)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-12 rounded border border-spartan-gold/30 bg-spartan-gold/10 hover:bg-spartan-gold/20 text-spartan-gold font-bold uppercase tracking-wider text-sm sm:text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="h-4.5 w-4.5" />
                    Inquire for Restock
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleBuyNow}
                    className="h-12 rounded bg-white text-black hover:bg-spartan-gold hover:text-black font-bold uppercase tracking-wider text-sm sm:text-base transition-colors cursor-pointer"
                  >
                    Buy it Now
                  </button>
                  <a
                    href={getWhatsAppInquiryUrl(false)}
                    target="_blank"
                    rel="noreferrer"
                    className="h-12 rounded border border-spartan-gold/30 bg-spartan-gold/10 hover:bg-spartan-gold/20 text-spartan-gold font-bold uppercase tracking-wider text-sm sm:text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="h-4.5 w-4.5" />
                    Contact Sellers
                  </a>
                </div>
              )}
            </div>

            {/* Secure / Delivery Badges */}
            <div className="flex items-center gap-6 pt-4 border-t border-white/5 text-xs sm:text-sm text-white/50">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-spartan-gold" />
                <span>Genuine Product Guaranteed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-spartan-red" />
                <span>Islandwide Delivery available</span>
              </div>
            </div>

          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-spartan-gray/40 border border-white/5 rounded-xl p-6 sm:p-10 space-y-6 backdrop-blur-md">
          <div className="flex flex-wrap border-b border-white/10 gap-2 sm:gap-6">
            {(["description", "benefits", "ingredients", "usage", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm sm:text-base font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
                  activeTab === tab ? "text-spartan-red" : "text-white/60 hover:text-white"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-spartan-red" />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="text-base leading-relaxed text-white/70">
            {activeTab === "description" && (
              <div className="space-y-4">
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === "benefits" && (
              <ul className="list-disc list-inside space-y-2">
                {(product.benefits || []).map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            )}

            {activeTab === "ingredients" && (
              <div className="flex flex-wrap gap-2">
                {(product.ingredients || []).map((ing, i) => (
                  <span key={i} className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-sm text-white">
                    {ing}
                  </span>
                ))}
              </div>
            )}

            {activeTab === "usage" && (
              <p>{product.usage}</p>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                  <div className="text-center bg-black/40 border border-white/5 rounded-lg px-6 py-4">
                    <div className="text-3xl font-black text-white">{averageRating.toFixed(1)}</div>
                    <div className="flex text-spartan-gold mt-1 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < roundedRating ? "fill-current" : "text-white/20"}`} />
                      ))}
                    </div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider font-bold mt-1.5">{reviewsCount} Reviews</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase text-white tracking-wider">Customer Feedback Stacks</h4>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed">
                      Verified customer ratings and reviews directly from MongoDB Spartan archives. All reviews represent verified completed purchases.
                    </p>
                  </div>
                </div>

                {reviewsList.length === 0 ? (
                  <div className="text-center py-10 bg-black/20 border border-white/5 rounded-lg">
                    <MessageCircle className="h-8 w-8 text-white/30 mx-auto mb-2" />
                    <p className="text-sm text-white/50 uppercase tracking-wider font-bold">No Reviews Yet</p>
                    <p className="text-xs text-white/35 mt-1">Be the first to order and leave a review once completed.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {reviewsList.map((rev: any) => (
                      <div key={rev.id} className="bg-black/35 border border-white/5 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <span className="text-xs font-black uppercase text-spartan-gold block">{rev.userName}</span>
                            <span className="text-[9px] text-white/35 font-bold uppercase tracking-wider">
                              {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
                            </span>
                          </div>
                          <div className="flex text-spartan-gold">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < rev.rating ? "fill-current" : "text-white/20"}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-white/80 leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
              Related <span className="text-spartan-red">Supplements</span>
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  className="group relative flex flex-col justify-between rounded-lg border border-white/5 bg-spartan-gray hover:border-spartan-red/30 transition-all duration-300"
                >
                  {/* Image Container with red border */}
                  <div className="relative m-2">
                    <div className="relative aspect-square overflow-hidden flex items-center justify-center p-2 sm:p-4 border-2 border-spartan-red-dark rounded-lg bg-black">
                      <Link
                        href={`/product/${p.id}`}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>
                      {p.stock <= 0 && (
                        <span className="absolute top-3 left-3 bg-zinc-800 border border-zinc-700 text-neutral-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full z-10">
                          Sold Out
                        </span>
                      )}
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
                  <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between space-y-3">
                    <div>
                      <Link
                        href={`/product/${p.id}`}
                        className="block font-bold text-xs sm:text-sm uppercase text-white hover:text-spartan-red transition-colors line-clamp-1"
                      >
                        {p.name}
                      </Link>
                      <p className="text-sm font-bold text-spartan-gold mt-1">Rs. {p.price.toLocaleString()}</p>
                    </div>
                    <button
                      disabled={p.stock <= 0}
                      onClick={() => {
                        addToCart(p);
                        setSelectedImage(p.image);
                        setQuantity(1);
                        setActiveTab("description");
                      }}
                      className={`w-full py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        p.stock <= 0
                          ? "bg-zinc-800 text-neutral-500 border border-zinc-700 cursor-not-allowed"
                          : "bg-spartan-red hover:bg-spartan-red-dark text-white"
                      }`}
                    >
                      {p.stock <= 0 ? "Sold Out" : "Quick Add"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
