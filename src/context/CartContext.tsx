"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Product, Flavor } from "@/data/products";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  syncCartAndWishlist,
} from "@/app/actions/userActions";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedFlavor?: Flavor;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, flavor?: Flavor) => void;
  removeFromCart: (productId: string, flavorName?: string) => void;
  updateQuantity: (productId: string, quantity: number, flavorName?: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  cartSubtotal: number;
  shipping: number;
  cartTotal: number;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  
  // User Session additions
  user: any | null;
  loadingUser: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: any }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  register: (formData: FormData) => Promise<{ success: boolean; error?: string; user?: any }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to merge carts
const mergeCarts = (local: CartItem[], db: CartItem[]): CartItem[] => {
  const merged = [...db];
  for (const localItem of local) {
    const existing = merged.find((item) => 
      item.product.id === localItem.product.id && 
      item.selectedFlavor?.name === localItem.selectedFlavor?.name
    );
    if (existing) {
      existing.quantity += localItem.quantity;
    } else {
      merged.push(localItem);
    }
  }
  return merged;
};

// Helper to merge wishlists
const mergeWishlists = (local: string[], db: string[]): string[] => {
  return Array.from(new Set([...db, ...local]));
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  
  // User auth state
  const [user, setUser] = useState<any | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const initialLoaded = useRef(false);

  // Load user session and merge with local storage on mount
  useEffect(() => {
    async function restoreSession() {
      try {
        const res = await getCurrentUser();
        
        // Retrieve local storage cart and wishlist
        const savedCart = localStorage.getItem("spartan_cart");
        const savedWishlist = localStorage.getItem("spartan_wishlist");
        let localCart: CartItem[] = [];
        let localWishlist: string[] = [];
        
        if (savedCart) {
          try {
            localCart = JSON.parse(savedCart);
          } catch (e) {
            console.error("Failed to parse local cart items", e);
          }
        }
        if (savedWishlist) {
          try {
            localWishlist = JSON.parse(savedWishlist);
          } catch (e) {
            console.error("Failed to parse local wishlist", e);
          }
        }

        if (res.success && res.user) {
          const dbCart = res.user.cart || [];
          const dbWishlist = res.user.wishlist || [];
          
          // Merge local and database states
          const mergedCart = mergeCarts(localCart, dbCart);
          const mergedWishlist = mergeWishlists(localWishlist, dbWishlist);
          
          setCartItems(mergedCart);
          setWishlist(mergedWishlist);
          setUser(res.user);
          
          // Write merged state back to Database
          await syncCartAndWishlist(mergedCart, mergedWishlist);
        } else {
          // If no logged in user, use local storage cart & wishlist directly
          setCartItems(localCart);
          setWishlist(localWishlist);
        }
      } catch (e) {
        console.error("Failed to restore session", e);
      } finally {
        setLoadingUser(false);
        initialLoaded.current = true;
      }
    }
    restoreSession();
  }, []);

  // Sync state to localStorage (Only after initial load is complete to prevent overwriting with empty defaults)
  useEffect(() => {
    if (!initialLoaded.current) return;
    localStorage.setItem("spartan_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (!initialLoaded.current) return;
    localStorage.setItem("spartan_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync to Database on state changes when logged in (debounced)
  useEffect(() => {
    if (!initialLoaded.current || !user) return;

    const delayDebounce = setTimeout(() => {
      syncCartAndWishlist(cartItems, wishlist);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [cartItems, wishlist, user]);

  const login = async (email: string, password: string) => {
    const res = await loginUser(email, password);
    if (res.success && res.user) {
      const dbCart = res.user.cart || [];
      const dbWishlist = res.user.wishlist || [];
      
      // Merge active local storage items with newly logged in user DB cart/wishlist
      const mergedCart = mergeCarts(cartItems, dbCart);
      const mergedWishlist = mergeWishlists(wishlist, dbWishlist);
      
      setCartItems(mergedCart);
      setWishlist(mergedWishlist);
      setUser(res.user);
      
      // Persist merged state immediately
      await syncCartAndWishlist(mergedCart, mergedWishlist);
    }
    return res;
  };

  const register = async (formData: FormData) => {
    const res = await registerUser(formData);
    if (res.success && res.user) {
      setUser(res.user);
      // Sync active local storage items to the newly registered user's record
      await syncCartAndWishlist(cartItems, wishlist);
    }
    return res;
  };

  const logout = async () => {
    const res = await logoutUser();
    if (res.success) {
      setUser(null);
      setCartItems([]);
      setWishlist([]);
      localStorage.removeItem("spartan_cart");
      localStorage.removeItem("spartan_wishlist");
    }
    return res;
  };

  const addToCart = (product: Product, quantity = 1, flavor?: Flavor) => {
    const flavorStock = flavor
      ? (flavor.stock !== undefined ? flavor.stock : 10)
      : product.stock;
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => 
        item.product.id === product.id && 
        item.selectedFlavor?.name === flavor?.name
      );
      if (existingItem) {
        const newQty = Math.min(flavorStock, existingItem.quantity + quantity);
        return prevItems.map((item) =>
          item.product.id === product.id && 
          item.selectedFlavor?.name === flavor?.name
            ? { ...item, quantity: newQty }
            : item
        );
      }
      const newQty = Math.min(flavorStock, quantity);
      return [...prevItems, { product, quantity: newQty, selectedFlavor: flavor }];
    });
    setCartDrawerOpen(true); // Automatically open the drawer on add
  };

  const removeFromCart = (productId: string, flavorName?: string) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => 
        !(item.product.id === productId && item.selectedFlavor?.name === flavorName)
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, flavorName?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, flavorName);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId && item.selectedFlavor?.name === flavorName) {
          const flavorStock = item.selectedFlavor
            ? (item.selectedFlavor.stock !== undefined ? item.selectedFlavor.stock : 10)
            : item.product.stock;
          const newQty = Math.min(flavorStock, quantity);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(productId)) {
        return prevWishlist.filter((id) => id !== productId);
      } else {
        return [...prevWishlist, productId];
      }
    });
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.selectedFlavor ? item.selectedFlavor.price : item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);
  
  // Shipping rule: Free delivery above 15,000 LKR, else 500 LKR flat rate.
  const shipping = cartSubtotal > 15000 || cartSubtotal === 0 ? 0 : 500;
  const cartTotal = cartSubtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        searchQuery,
        setSearchQuery,
        cartCount,
        cartSubtotal,
        shipping,
        cartTotal,
        cartDrawerOpen,
        setCartDrawerOpen,
        user,
        loadingUser,
        login,
        logout,
        register,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
