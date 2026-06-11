'use client';

import { useTransition, useState, useEffect } from 'react';
import { logoutAdmin } from './actions';
import { useRouter } from 'next/navigation';
import { CATEGORIES, Product } from '@/data/products';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Activity, 
  LogOut, 
  Terminal, 
  Wrench, 
  Cpu,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Image as ImageIcon,
  Tag,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Loader2,
  Key,
  Eye,
  Copy,
  Check,
  Heart,
  MapPin,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';

import {
  adminFetchUsers,
  adminResetPassword,
  adminFetchPasswordResets,
  adminDeletePasswordResetRequest,
  adminFetchOrders,
  adminUpdateOrderStatus
} from '@/app/actions/userActions';

interface AdminDashboardProps {
  email: string;
}

export default function AdminDashboard({ email }: AdminDashboardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Dashboard state tabs
  const [activeTab, setActiveTab] = useState<'products' | 'console' | 'users' | 'orders' | 'categories'>('products');
  
  // Dynamic categories list management
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [savingCategoryIndex, setSavingCategoryIndex] = useState<number | null>(null);
  const [uploadingCategoryIndex, setUploadingCategoryIndex] = useState<number | null>(null);

  // Database states
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  
  // Local filtering state
  const [searchQuery, setSearchQuery] = useState('');

  // User Accounts and Reset Requests states
  const [usersList, setUsersList] = useState<any[]>([]);
  const [resetRequests, setResetRequests] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [loadingResets, setLoadingResets] = useState<boolean>(false);
  const [usersSearchQuery, setUsersSearchQuery] = useState('');
  
  // Selected user for View Profile Drawer/Modal
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  
  // Direct password reset form states
  const [resetPasswordEmail, setResetPasswordEmail] = useState<string | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [resettingPw, setResettingPw] = useState(false);
  const [resetPwError, setResetPwError] = useState<string | null>(null);
  const [resetPwSuccess, setResetPwSuccess] = useState<string | null>(null);

  // Orders states
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const [ordersSearchQuery, setOrdersSearchQuery] = useState('');
  const [ordersFilterStatus, setOrdersFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updatingOrderStatus, setUpdatingOrderStatus] = useState<boolean>(false);

  // Copied token state for reset requests
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Editing form states
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isNewProduct, setIsNewProduct] = useState<boolean>(false);
  const [submittingForm, setSubmittingForm] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Form input fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [oldPrice, setOldPrice] = useState<number | ''>('');
  const [image, setImage] = useState('');
  const [imagesText, setImagesText] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [usage, setUsage] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [stock, setStock] = useState<number>(10);
  const [rating, setRating] = useState<number>(5);
  const [reviewsCount, setReviewsCount] = useState<number>(0);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState<number | ''>('');
  const [flavors, setFlavors] = useState<{ name: string; price: number; image: string }[]>([]);
  const [uploadingFlavorIndex, setUploadingFlavorIndex] = useState<number | null>(null);

  // Uploading states
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'primary' | 'gallery') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (target === 'primary') {
      setUploadingPrimary(true);
      setFormError(null);
      try {
        const file = files[0];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setImage(data.url);
        } else {
          const errData = await res.json();
          setFormError(`Primary image upload failed: ${errData.error || 'Unknown error'}`);
        }
      } catch (err: any) {
        console.error('Upload error:', err);
        setFormError(`Primary image upload failed: ${err.message || err}`);
      } finally {
        setUploadingPrimary(false);
      }
    } else {
      setUploadingGallery(true);
      setFormError(null);
      try {
        const urls: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const formData = new FormData();
          formData.append('file', file);

          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (res.ok) {
            const data = await res.json();
            urls.push(data.url);
          } else {
            console.error('Gallery file upload failed:', file.name);
          }
        }

        if (urls.length > 0) {
          const currentText = imagesText.trim();
          const newText = currentText 
            ? `${currentText}\n${urls.join('\n')}` 
            : urls.join('\n');
          setImagesText(newText);
        }
      } catch (err: any) {
        console.error('Gallery upload error:', err);
        setFormError(`Gallery image upload failed: ${err.message || err}`);
      } finally {
        setUploadingGallery(false);
      }
    }
  };

  const handleFlavorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFlavorIndex(index);
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setFlavors(prev => {
          const next = [...prev];
          next[index] = { ...next[index], image: data.url };
          return next;
        });
      } else {
        const errData = await res.json();
        alert(`Flavor image upload failed: ${errData.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('Flavor upload error:', err);
      alert(`Flavor image upload failed: ${err.message || err}`);
    } finally {
      setUploadingFlavorIndex(null);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategoriesList(data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCategoryUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingCategoryIndex(index);
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCategoriesList(prev => {
          const next = [...prev];
          next[index] = { ...next[index], image: data.url };
          return next;
        });
      } else {
        const errData = await res.json();
        alert(`Upload failed: ${errData.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('Category image upload error:', err);
      alert(`Upload failed: ${err.message || err}`);
    } finally {
      setUploadingCategoryIndex(null);
    }
  };

  const handleSaveCategory = async (index: number) => {
    const category = categoriesList[index];
    if (!category) return;

    setSavingCategoryIndex(index);
    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: category.id,
          name: category.name,
          badge: category.badge,
          tagline: category.tagline,
          image: category.image
        })
      });

      if (res.ok) {
        alert('Category card updated successfully!');
        fetchCategories();
      } else {
        const errData = await res.json();
        alert(`Failed to save: ${errData.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('Failed to save category:', err);
      alert(`Failed to save: ${err.message || err}`);
    } finally {
      setSavingCategoryIndex(null);
    }
  };


  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await adminFetchUsers();
      if (res.success && res.users) {
        setUsersList(res.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchResets = async () => {
    try {
      setLoadingResets(true);
      const res = await adminFetchPasswordResets();
      if (res.success && res.requests) {
        setResetRequests(res.requests);
      }
    } catch (err) {
      console.error('Failed to fetch reset requests:', err);
    } finally {
      setLoadingResets(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await adminFetchOrders();
      if (res.success && res.orders) {
        setOrdersList(res.orders);
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderStatus(true);
      const res = await adminUpdateOrderStatus(orderId, newStatus);
      if (res.success) {
        if (selectedOrder && selectedOrder.orderId === orderId) {
          setSelectedOrder((prev: any) => prev ? { ...prev, status: newStatus } : null);
        }
        await fetchOrders();
      } else {
        alert(res.error || "Failed to update order status.");
      }
    } catch (err) {
      console.error("Update status error:", err);
      alert("Connection error. Failed to update status.");
    } finally {
      setUpdatingOrderStatus(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchCategories();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
      fetchResets();
    } else if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'categories') {
      fetchCategories();
    }
  }, [activeTab]);

  const handleCopyLink = (token: string) => {
    const url = `${window.location.origin}/reset-password?token=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => {
      setCopiedToken(null);
    }, 2000);
  };

  const handleDirectPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordEmail || !newPasswordVal.trim()) return;

    setResettingPw(true);
    setResetPwError(null);
    setResetPwSuccess(null);

    try {
      const res = await adminResetPassword(resetPasswordEmail, newPasswordVal);
      if (res.success) {
        setResetPwSuccess(res.message || 'Password updated successfully!');
        setNewPasswordVal('');
        setTimeout(() => {
          setResetPasswordEmail(null);
          setResetPwSuccess(null);
        }, 2000);
      } else {
        setResetPwError(res.error || 'Failed to override password.');
      }
    } catch (err: any) {
      setResetPwError(err.message || 'An error occurred.');
    } finally {
      setResettingPw(false);
    }
  };

  const handleDeleteResetRequest = async (token: string) => {
    if (!confirm('Are you sure you want to delete this password reset request?')) return;
    try {
      const res = await adminDeletePasswordResetRequest(token);
      if (res.success) {
        setResetRequests(prev => prev.filter(r => r.token !== token));
      } else {
        alert(res.error || 'Failed to delete request.');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred.');
    }
  };

  const handleSignOut = () => {
    startTransition(async () => {
      await logoutAdmin();
      router.refresh();
    });
  };

  const handleAddProduct = () => {
    setIsNewProduct(true);
    setEditingProduct({});
    setName('');
    setCategory(CATEGORIES[0]?.id || '');
    setPrice('');
    setOldPrice('');
    setImage('');
    setImagesText('');
    setDescription('');
    setShortDescription('');
    setBenefitsText('');
    setIngredientsText('');
    setUsage('');
    setFeaturesText('');
    setIsBestSeller(false);
    setIsNewArrival(false);
    setIsPopular(false);
    setStock(10);
    setRating(5);
    setReviewsCount(0);
    setPromoCode('');
    setDiscountPercentage('');
    setFlavors([]);
    setFormError(null);
    setFormSuccess(null);
  };

  const handleEditProduct = (prod: Product) => {
    setIsNewProduct(false);
    setEditingProduct(prod);
    setName(prod.name ?? '');
    setCategory(prod.category ?? '');
    setPrice(prod.price ?? '');
    setOldPrice(prod.oldPrice ?? '');
    setImage(prod.image ?? '');
    setImagesText(Array.isArray(prod.images) ? prod.images.join('\n') : '');
    setDescription(prod.description ?? '');
    setShortDescription(prod.shortDescription ?? '');
    setBenefitsText(Array.isArray(prod.benefits) ? prod.benefits.join('\n') : '');
    setIngredientsText(Array.isArray(prod.ingredients) ? prod.ingredients.join(', ') : '');
    setUsage(prod.usage ?? '');
    setFeaturesText(
      Array.isArray(prod.features) 
        ? prod.features.map((f: any) => `${f.label}: ${f.value}`).join('\n') 
        : ''
    );
    setIsBestSeller(!!prod.isBestSeller);
    setIsNewArrival(!!prod.isNewArrival);
    setIsPopular(!!prod.isPopular);
    setStock(prod.stock ?? 0);
    setRating(prod.rating ?? 5);
    setReviewsCount(prod.reviewsCount ?? 0);
    setPromoCode(prod.promoCode ?? '');
    setDiscountPercentage(prod.discountPercentage ?? '');
    setFlavors(Array.isArray(prod.flavors) ? prod.flavors : []);
    setFormError(null);
    setFormSuccess(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to purge this supplement from the Spartan Armory database? This action cannot be undone.')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        const errData = await res.json();
        alert(`Deletion failed: ${errData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Delete product error:', err);
      alert('Network error during deletion.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingForm(true);
    setFormError(null);
    setFormSuccess(null);

    // Validations
    if (!name.trim()) {
      setFormError('Supplement Name is required.');
      setSubmittingForm(false);
      return;
    }
    if (!category) {
      setFormError('Category is required.');
      setSubmittingForm(false);
      return;
    }
    if (price === '' || Number(price) <= 0) {
      setFormError('Price must be a number greater than 0.');
      setSubmittingForm(false);
      return;
    }

    // Parsers
    const parsedBenefits = benefitsText.split('\n').map(b => b.trim()).filter(Boolean);
    const parsedIngredients = ingredientsText.split(',').map(i => i.trim()).filter(Boolean);
    
    const parsedFeatures = featuresText.split('\n')
      .map(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          return { label: parts[0].trim(), value: parts.slice(1).join(':').trim() };
        }
        return null;
      })
      .filter(Boolean) as { label: string; value: string }[];

    const parsedImages = imagesText.split('\n').map(img => img.trim()).filter(Boolean);
    if (image.trim() && !parsedImages.includes(image.trim())) {
      parsedImages.unshift(image.trim());
    }

    const payload = {
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      oldPrice: oldPrice !== '' ? Number(oldPrice) : undefined,
      image: image.trim(),
      images: parsedImages,
      description: description.trim(),
      shortDescription: shortDescription.trim(),
      benefits: parsedBenefits,
      ingredients: parsedIngredients,
      usage: usage.trim(),
      features: parsedFeatures,
      isBestSeller,
      isNewArrival,
      isPopular,
      stock: Number(stock),
      rating: Number(rating),
      reviewsCount: Number(reviewsCount),
      promoCode: promoCode.trim().toUpperCase(),
      discountPercentage: discountPercentage !== '' ? Number(discountPercentage) : undefined,
      flavors: flavors
    };

    try {
      const url = isNewProduct ? '/api/products' : `/api/products/${editingProduct.id}`;
      const method = isNewProduct ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormSuccess(isNewProduct ? 'Supplement added to Spartan Armory!' : 'Supplement details saved!');
        await fetchProducts();
        setTimeout(() => {
          setEditingProduct(null);
        }, 1200);
      } else {
        const errData = await res.json();
        setFormError(errData.error || 'Failed to save product details.');
      }
    } catch (err) {
      console.error('Submit product error:', err);
      setFormError('Network connection error. Failed to save details.');
    } finally {
      setSubmittingForm(false);
    }
  };

  const filteredCatalog = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-spartan-red selection:text-white">
      {/* Top Navigation Bar */}
      <nav className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border border-spartan-red/40 flex items-center justify-center bg-neutral-900 shadow-glow-red">
              <svg className="w-4 h-4 text-spartan-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <span className="font-bold tracking-widest text-sm uppercase font-display block">Spartan Armory</span>
              <span className="text-[10px] tracking-wider text-spartan-gold uppercase block -mt-1 font-semibold">Catalog Control</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-neutral-400 font-semibold">Authenticated Agent</span>
              <span className="text-[11px] font-semibold text-spartan-gold">{email}</span>
            </div>
            <button
              onClick={handleSignOut}
              disabled={isPending}
              className="flex items-center gap-2 px-3.5 py-2 rounded bg-neutral-900 hover:bg-neutral-805 border border-neutral-805 hover:border-spartan-red/40 text-xs text-neutral-300 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50 font-bold uppercase tracking-wider"
            >
              {isPending ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <LogOut className="h-3.5 w-3.5 text-spartan-red" />
              )}
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Dynamic Stat Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Stat 1: Gross Sales */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-5 hover:border-spartan-red/25 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-spartan-red/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Gross Revenue</p>
                <h3 className="text-2xl font-bold mt-2 font-display text-white">
                  Rs. {ordersList.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + (Number(o.total) || 0), 0).toLocaleString()}
                </h3>
              </div>
              <span className="p-2 rounded bg-emerald-950/30 border border-emerald-900/50 text-emerald-400">
                <TrendingUp className="h-4 w-4" />
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-3 flex items-center gap-1.5">
              <span className="text-emerald-400 font-semibold">{ordersList.filter(o => o.status !== 'cancelled').length} orders</span>
              <span>fulfilled and pending</span>
            </div>
          </div>

          {/* Stat 2: Active catalog size */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-5 hover:border-spartan-red/25 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-spartan-red/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Active Catalog</p>
                <h3 className="text-2xl font-bold mt-2 font-display text-white">{loadingProducts ? '...' : products.length} Items</h3>
              </div>
              <span className="p-2 rounded bg-spartan-red/10 border border-spartan-red/25 text-spartan-red">
                <ShoppingBag className="h-4 w-4" />
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-3 flex items-center gap-1.5">
              <span className="text-spartan-gold font-semibold">{products.filter(p => p.stock > 0).length} in stock</span>
              <span>available to order</span>
            </div>
          </div>

          {/* Stat 3: Users */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-5 hover:border-spartan-red/25 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-spartan-red/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Registered Spartans</p>
                <h3 className="text-2xl font-bold mt-2 font-display text-white">{loadingUsers ? '...' : usersList.length}</h3>
              </div>
              <span className="p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                <Users className="h-4 w-4" />
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-3 flex items-center gap-1.5">
              <span className="text-spartan-gold font-semibold">Verified account</span>
              <span>database entries</span>
            </div>
          </div>

          {/* Stat 4: Database State */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-5 hover:border-spartan-red/25 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-spartan-red/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Atlas Node Status</p>
                <h3 className="text-2xl font-bold mt-2 font-display text-white">Online</h3>
              </div>
              <span className="p-2 rounded bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 animate-pulse">
                <Activity className="h-4 w-4" />
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-3 flex items-center gap-1.5">
              <span className="text-emerald-400 font-semibold">Ping 84ms</span>
              <span>cluster connection green</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-900">
          <button
            onClick={() => { setActiveTab('products'); setEditingProduct(null); }}
            className={`pb-4 px-6 text-xs font-bold uppercase tracking-wider relative transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'products' ? 'text-spartan-red' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            Products Catalog ({products.length})
            {activeTab === 'products' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-spartan-red" />
            )}
          </button>
          <button
            onClick={() => { setActiveTab('users'); setEditingProduct(null); }}
            className={`pb-4 px-6 text-xs font-bold uppercase tracking-wider relative transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'users' ? 'text-spartan-red' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Users className="h-4 w-4" />
            User Accounts ({loadingUsers ? '...' : usersList.length})
            {activeTab === 'users' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-spartan-red" />
            )}
          </button>
          <button
            onClick={() => { setActiveTab('orders'); setEditingProduct(null); }}
            className={`pb-4 px-6 text-xs font-bold uppercase tracking-wider relative transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders' ? 'text-spartan-red' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            Orders Fulfillment ({loadingOrders ? '...' : ordersList.length})
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-spartan-red" />
            )}
          </button>
          <button
            onClick={() => { setActiveTab('categories'); setEditingProduct(null); }}
            className={`pb-4 px-6 text-xs font-bold uppercase tracking-wider relative transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'categories' ? 'text-spartan-red' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            Category Cards
            {activeTab === 'categories' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-spartan-red" />
            )}
          </button>
          <button
            onClick={() => { setActiveTab('console'); setEditingProduct(null); }}
            className={`pb-4 px-6 text-xs font-bold uppercase tracking-wider relative transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'console' ? 'text-spartan-red' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Terminal className="h-4 w-4" />
            System Console
            {activeTab === 'console' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-spartan-red" />
            )}
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {editingProduct === null ? (
              // 1. Catalog List View
              <>
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-950 p-4 border border-neutral-900 rounded-xl">
                  <div className="relative w-full sm:max-w-xs">
                    <input
                      type="text"
                      placeholder="Search catalog by name/category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded py-2 pl-9 pr-4 text-xs font-semibold text-white focus:outline-none transition-all"
                    />
                    <svg className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      onClick={fetchProducts}
                      disabled={loadingProducts}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 text-xs font-bold text-neutral-400 hover:text-white transition-all cursor-pointer disabled:opacity-50 uppercase tracking-wider"
                    >
                      <RefreshCw className={`h-3 w-3 ${loadingProducts ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                    <button
                      onClick={handleAddProduct}
                      className="flex items-center gap-1.5 px-4 py-2 rounded bg-spartan-red hover:bg-spartan-red-dark border border-spartan-red text-xs font-bold text-white transition-all cursor-pointer shadow-glow-red uppercase tracking-wider"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Supplement</span>
                    </button>
                  </div>
                </div>

                {loadingProducts ? (
                  <div className="flex flex-col items-center justify-center py-24 border border-neutral-900 rounded-xl bg-neutral-950/40">
                    <Loader2 className="h-8 w-8 animate-spin text-spartan-red" />
                    <p className="text-xs text-neutral-500 mt-4 font-bold uppercase tracking-wider">Accessing Spartan Archives...</p>
                  </div>
                ) : filteredCatalog.length === 0 ? (
                  <div className="text-center py-20 bg-neutral-950 border border-neutral-900 rounded-xl p-8">
                    <AlertTriangle className="h-8 w-8 text-spartan-gold mx-auto mb-3" />
                    <p className="text-sm text-neutral-400 font-bold uppercase tracking-wide">No Supplements Found</p>
                    <p className="text-xs text-neutral-500 mt-1">Initialize the active armory by creating a new supplement entry.</p>
                    <button
                      onClick={handleAddProduct}
                      className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded bg-spartan-red hover:bg-spartan-red-dark text-xs font-bold text-white transition-all cursor-pointer shadow-glow-red uppercase tracking-wider"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Create First Product</span>
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-neutral-900 rounded-xl bg-neutral-950/40">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-900 bg-neutral-950 font-display uppercase text-[10px] tracking-wider text-neutral-500 select-none">
                          <th className="p-4">Supplement</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Pricing</th>
                          <th className="p-4 text-center">Stock</th>
                          <th className="p-4">Tags</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900 text-sm">
                        {filteredCatalog.map((prod) => (
                          <tr key={prod.id} className="hover:bg-neutral-900/40 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                              <div className="w-10 h-10 rounded bg-black border border-neutral-800 overflow-hidden flex items-center justify-center p-1.5 shrink-0">
                                <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain" />
                              </div>
                              <div className="font-semibold text-white max-w-[240px] truncate" title={prod.name}>
                                {prod.name}
                              </div>
                            </td>
                            <td className="p-4 text-neutral-400 text-xs font-semibold capitalize">
                              {prod.category.replace('-', ' ')}
                            </td>
                            <td className="p-4 text-xs font-semibold">
                              <span className="font-bold text-white">Rs. {prod.price.toLocaleString()}</span>
                              {prod.oldPrice && (
                                <span className="text-[10px] text-neutral-500 line-through block">Rs. {prod.oldPrice.toLocaleString()}</span>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                prod.stock <= 0 
                                  ? 'bg-spartan-red/10 border-spartan-red/25 text-spartan-red' 
                                  : prod.stock <= 5 
                                    ? 'bg-spartan-gold/10 border-spartan-gold/25 text-spartan-gold'
                                    : 'bg-emerald-950/10 border-emerald-900/50 text-emerald-400'
                              }`}>
                                {prod.stock <= 0 ? 'Out of Stock' : `${prod.stock} units`}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {prod.isBestSeller && <span className="px-1.5 py-0.5 rounded bg-spartan-red/10 border border-spartan-red/25 text-[8px] font-bold text-spartan-red uppercase">Best</span>}
                                {prod.isNewArrival && <span className="px-1.5 py-0.5 rounded bg-emerald-950/20 border border-emerald-900/50 text-[8px] font-bold text-emerald-400 uppercase">New</span>}
                                {prod.isPopular && <span className="px-1.5 py-0.5 rounded bg-spartan-gold/10 border border-spartan-gold/25 text-[8px] font-bold text-spartan-gold uppercase">Popular</span>}
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleEditProduct(prod)}
                                  className="p-1.5 rounded hover:bg-neutral-800 border border-transparent hover:border-neutral-700 hover:text-spartan-gold text-neutral-400 transition-all cursor-pointer"
                                  title="Edit Supplement"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id)}
                                  className="p-1.5 rounded hover:bg-neutral-800 border border-transparent hover:border-neutral-700 hover:text-spartan-red text-neutral-400 transition-all cursor-pointer"
                                  title="Purge/Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              // 2. Add/Edit Form Panel
              <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-center border-b border-neutral-900 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-spartan-gold">
                      {isNewProduct ? <Plus className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider font-display">
                        {isNewProduct ? 'Add New Supplement' : `Edit Supplement: ${editingProduct.name}`}
                      </h3>
                      <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
                        {isNewProduct ? 'Database Insertion Console' : `MongoDB ID: ${editingProduct.id}`}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="p-1.5 rounded hover:bg-neutral-900 border border-neutral-850 hover:border-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {formError && (
                    <div className="p-3 bg-spartan-red/10 border border-spartan-red/20 rounded flex items-center gap-2 text-xs text-spartan-red">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{formError}</span>
                    </div>
                  )}
                  {formSuccess && (
                    <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded flex items-center gap-2 text-xs text-emerald-400 animate-pulse">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{formSuccess}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column: Essential details */}
                    <div className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Supplement Name *</label>
                        <input
                          type="text"
                          required
                          value={name ?? ''}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Spartan Whey Protein 2lb"
                          className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded p-2.5 text-xs text-white focus:outline-none transition-all"
                        />
                      </div>

                      {/* Category & Stock */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Category *</label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded p-2.5 text-xs text-white focus:outline-none transition-all"
                          >
                            {CATEGORIES.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Stock Units</label>
                          <input
                            type="number"
                            min="0"
                            value={stock ?? ''}
                            onChange={(e) => setStock(Number(e.target.value))}
                            className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded p-2.5 text-xs text-white focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Prices */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Sale Price (Rs.) *</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={price ?? ''}
                            onChange={(e) => setPrice(e.target.value !== '' ? Number(e.target.value) : '')}
                            placeholder="e.g. 13500"
                            className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded p-2.5 text-xs text-white focus:outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Original Price (Optional)</label>
                          <input
                            type="number"
                            min="0"
                            value={oldPrice ?? ''}
                            onChange={(e) => setOldPrice(e.target.value !== '' ? Number(e.target.value) : '')}
                            placeholder="e.g. 15000"
                            className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded p-2.5 text-xs text-white focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Primary Image */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Primary Image</label>
                          <span className="text-[9px] text-neutral-500 uppercase font-semibold">AVIF, PNG, JPEG, WEBP</span>
                        </div>
                        
                        <div className="space-y-2">
                          {/* File Uploader */}
                          <div className="flex items-center gap-3 bg-neutral-900/40 p-2.5 border border-neutral-850 rounded">
                            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 hover:text-white text-xs font-bold text-neutral-300 transition-all cursor-pointer select-none">
                              <Plus className="h-3.5 w-3.5 text-spartan-gold" />
                              <span>Upload local file</span>
                              <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/gif"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, 'primary')}
                              />
                            </label>
                            {uploadingPrimary ? (
                              <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                                <Loader2 className="h-3 w-3 animate-spin text-spartan-red" />
                                Uploading file...
                              </span>
                            ) : (
                              <span className="text-[10px] text-neutral-500">
                                Supports AVIF, PNG, JPEG, and WebP
                              </span>
                            )}
                          </div>

                          {/* Direct URL input */}
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                value={image ?? ''}
                                onChange={(e) => setImage(e.target.value)}
                                placeholder="Direct web link to image (e.g. /uploads/filename.webp)"
                                className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded p-2.5 pl-8 text-xs text-white focus:outline-none transition-all"
                              />
                              <ImageIcon className="h-3.5 w-3.5 text-neutral-500 absolute left-2.5 top-3.5" />
                            </div>
                            {image && image.trim() && (
                              <div className="w-[38px] h-[38px] rounded border border-neutral-800 bg-black flex items-center justify-center p-0.5 overflow-hidden shrink-0">
                                <img src={image} alt="Preview" className="max-h-full max-w-full object-contain" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Extra Images URL Gallery */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Gallery Images</label>
                          <label className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-[9px] font-bold text-neutral-300 transition-all cursor-pointer select-none">
                            <Plus className="h-2.5 w-2.5 text-spartan-gold" />
                            <span>Add gallery file</span>
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/gif"
                              multiple
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, 'gallery')}
                            />
                          </label>
                        </div>
                        
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            value={imagesText ?? ''}
                            onChange={(e) => setImagesText(e.target.value)}
                            placeholder="Paste additional gallery links here (one URL per line) or upload files..."
                            className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded p-2.5 text-xs text-white font-mono focus:outline-none transition-all"
                          />
                          {uploadingGallery && (
                            <div className="text-[10px] text-neutral-500 flex items-center gap-1 bg-neutral-900/40 p-2 border border-neutral-850 rounded">
                              <Loader2 className="h-3 w-3 animate-spin text-spartan-red" />
                              Processing gallery files...
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Rating & Reviews */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Initial Rating (1-5)</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            step="0.1"
                            value={rating ?? ''}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded p-2.5 text-xs text-white focus:outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Reviews Count</label>
                          <input
                            type="number"
                            min="0"
                            value={reviewsCount ?? ''}
                            onChange={(e) => setReviewsCount(Number(e.target.value))}
                            className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded p-2.5 text-xs text-white focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Descriptions & Details */}
                    <div className="space-y-4">
                      {/* Short Description */}
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Short Description</label>
                        <textarea
                          rows={2}
                          value={shortDescription}
                          onChange={(e) => setShortDescription(e.target.value)}
                          placeholder="Brief tagline showing below pricing..."
                          className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded p-2.5 text-xs text-white focus:outline-none transition-all"
                        />
                      </div>

                      {/* Detailed Description */}
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span>Full Description</span>
                        </label>
                        <textarea
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Detailed paragraphs explaining the benefits..."
                          className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded p-2.5 text-xs text-white focus:outline-none transition-all"
                        />
                      </div>

                      {/* Benefits & Ingredients */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                            <span>Key Benefits</span>
                            <span className="text-[9px] text-neutral-500 normal-case font-semibold">one per line</span>
                          </label>
                          <textarea
                            rows={3}
                            value={benefitsText}
                            onChange={(e) => setBenefitsText(e.target.value)}
                            placeholder="e.g. Muscle Repair&#10;Lean Growth"
                            className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded p-2.5 text-xs text-white focus:outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                            <span>Ingredients</span>
                            <span className="text-[9px] text-neutral-500 normal-case font-semibold">separated by comma</span>
                          </label>
                          <textarea
                            rows={3}
                            value={ingredientsText}
                            onChange={(e) => setIngredientsText(e.target.value)}
                            placeholder="e.g. Creatine Monohydrate, Whey Concentrate"
                            className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded p-2.5 text-xs text-white focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                       {/* Usage */}
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Recommended Usage</label>
                        <input
                          type="text"
                          value={usage ?? ''}
                          onChange={(e) => setUsage(e.target.value)}
                          placeholder="e.g. Mix 1 scoop with 250ml water 30 minutes before training"
                          className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded p-2.5 text-xs text-white focus:outline-none transition-all"
                        />
                      </div>

                      {/* Promo Settings */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Promo Code (Optional)</label>
                          <input
                            type="text"
                            value={promoCode ?? ''}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="e.g. SPARTAN10"
                            className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded p-2.5 text-xs text-white focus:outline-none transition-all uppercase font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Discount % (Optional)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={discountPercentage ?? ''}
                            onChange={(e) => setDiscountPercentage(e.target.value !== '' ? Number(e.target.value) : '')}
                            placeholder="e.g. 10"
                            className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded p-2.5 text-xs text-white focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Features Specs & Promo Tags */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                            <span>Key Specs / Nutrition</span>
                            <span className="text-[9px] text-neutral-500 normal-case font-semibold">Format: Label: Value (one per line)</span>
                          </label>
                          <textarea
                            rows={3}
                            value={featuresText}
                            onChange={(e) => setFeaturesText(e.target.value)}
                            placeholder="e.g. Servings: 30&#10;Protein: 24g&#10;Carbs: 3g"
                            className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded p-2.5 text-xs text-white font-mono focus:outline-none transition-all"
                          />
                        </div>

                        {/* Promotional Toggles */}
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Campaign Toggles</label>
                          <div className="space-y-2 mt-2 px-3 py-2 border border-neutral-850 rounded bg-black">
                            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-white cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={isBestSeller}
                                onChange={(e) => setIsBestSeller(e.target.checked)}
                                className="w-3.5 h-3.5 accent-spartan-red rounded bg-neutral-900 border-neutral-800 focus:ring-0"
                              />
                              <span className="flex items-center gap-1">
                                <Tag className="h-3 w-3 text-spartan-red" /> Best Seller
                              </span>
                            </label>
                            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-white cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={isNewArrival}
                                onChange={(e) => setIsNewArrival(e.target.checked)}
                                className="w-3.5 h-3.5 accent-spartan-red rounded bg-neutral-900 border-neutral-800 focus:ring-0"
                              />
                              <span className="flex items-center gap-1">
                                <Cpu className="h-3 w-3 text-emerald-400" /> New Arrival
                              </span>
                            </label>
                            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-white cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={isPopular}
                                onChange={(e) => setIsPopular(e.target.checked)}
                                className="w-3.5 h-3.5 accent-spartan-red rounded bg-neutral-900 border-neutral-800 focus:ring-0"
                              />
                              <span className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-spartan-gold" /> Popular Choice
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Flavors Section */}
                  <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-5 space-y-4">
                    <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-spartan-gold">Formulation Flavors</h4>
                        <p className="text-[10px] text-neutral-500 uppercase font-semibold mt-0.5">Define distinct flavors with specific images and pricing rules</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFlavors(prev => [...prev, { name: '', price: Number(price) || 0, image: '' }])}
                        className="flex items-center gap-1 px-3 py-1.5 rounded bg-black hover:bg-neutral-900 border border-neutral-850 hover:border-neutral-800 text-[10px] font-bold text-white uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5 text-spartan-gold" />
                        <span>Add Flavor Option</span>
                      </button>
                    </div>

                    {flavors.length === 0 ? (
                      <div className="py-6 text-center text-xs text-neutral-500 font-medium italic">
                        No flavors defined. This product will default to the standard single price and primary image.
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        {flavors.map((flv, idx) => (
                          <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-black/40 border border-neutral-900 p-3 rounded-lg relative">
                            {/* Flavor Name */}
                            <div className="md:col-span-3 space-y-1">
                              <label className="block text-[9px] uppercase tracking-wider font-bold text-neutral-455">Flavor Name</label>
                              <input
                                type="text"
                                value={flv.name || ''}
                                required
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFlavors(prev => {
                                    const next = [...prev];
                                    next[idx] = { ...next[idx], name: val };
                                    return next;
                                  });
                                }}
                                placeholder="e.g. Double Rich Chocolate"
                                className="w-full bg-black border border-neutral-850 hover:border-neutral-800 focus:border-spartan-red rounded p-2 text-xs font-semibold text-white focus:outline-none transition-all"
                              />
                            </div>

                            {/* Flavor Price */}
                            <div className="md:col-span-2 space-y-1">
                              <label className="block text-[9px] uppercase tracking-wider font-bold text-neutral-455">Price (LKR)</label>
                              <input
                                type="number"
                                value={flv.price ?? ''}
                                required
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setFlavors(prev => {
                                    const next = [...prev];
                                    next[idx] = { ...next[idx], price: val };
                                    return next;
                                  });
                                }}
                                placeholder="e.g. 15500"
                                className="w-full bg-black border border-neutral-850 hover:border-neutral-850 focus:border-spartan-red rounded p-2 text-xs font-semibold text-white focus:outline-none transition-all font-mono"
                              />
                            </div>

                            {/* Flavor Image URL */}
                            <div className="md:col-span-4 space-y-1">
                              <label className="block text-[9px] uppercase tracking-wider font-bold text-neutral-455">Image URL</label>
                              <input
                                type="text"
                                value={flv.image || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFlavors(prev => {
                                    const next = [...prev];
                                    next[idx] = { ...next[idx], image: val };
                                    return next;
                                  });
                                }}
                                placeholder="Paste image URL..."
                                className="w-full bg-black border border-neutral-850 hover:border-neutral-800 focus:border-spartan-red rounded p-2 text-xs font-semibold text-white focus:outline-none transition-all"
                              />
                            </div>

                            {/* Upload image selector */}
                            <div className="md:col-span-2 space-y-1">
                              <label className="block text-[9px] uppercase tracking-wider font-bold text-neutral-455">Or Upload File</label>
                              <div className="relative flex items-center justify-center bg-black border border-dashed border-neutral-800 hover:border-neutral-700 rounded p-2 transition-colors cursor-pointer text-center min-h-[34px]">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFlavorImageUpload(e, idx)}
                                  disabled={uploadingFlavorIndex === idx}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                />
                                {uploadingFlavorIndex === idx ? (
                                  <span className="text-[8px] uppercase tracking-wider font-black text-spartan-red flex items-center gap-1">
                                    <Loader2 className="h-3 w-3 animate-spin" /> Uploading
                                  </span>
                                ) : (
                                  <span className="text-[8px] uppercase tracking-wider font-black text-neutral-500 hover:text-white transition-colors">
                                    Browse...
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Delete Button */}
                            <div className="md:col-span-1 flex justify-end pb-1">
                              <button
                                type="button"
                                onClick={() => setFlavors(prev => prev.filter((_, fIdx) => fIdx !== idx))}
                                className="p-2 rounded bg-neutral-900 hover:bg-neutral-850 border border-transparent hover:border-neutral-750 text-spartan-red transition-all cursor-pointer"
                                title="Remove Flavor"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submission Row */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-neutral-900">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white border border-neutral-850 hover:border-neutral-800 rounded bg-neutral-900 hover:bg-neutral-805 transition-all cursor-pointer uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingForm}
                      className="flex items-center gap-2 px-5 py-2 rounded bg-spartan-red hover:bg-spartan-red-dark text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-50 shadow-glow-red uppercase tracking-wider"
                    >
                      {submittingForm ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Save className="h-3.5 w-3.5" />
                      )}
                      <span>{isNewProduct ? 'Add Supplement' : 'Save Details'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-8 animate-fade-in">
            {/* Registered Customers Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-950 p-4 border border-neutral-900 rounded-xl">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider font-display text-white">Registered Customer Accounts</h3>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Manage registered Spartan warriors</p>
                </div>
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search customers by name, email, phone..."
                    value={usersSearchQuery}
                    onChange={(e) => setUsersSearchQuery(e.target.value)}
                    className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded py-2 pl-9 pr-4 text-xs font-semibold text-white focus:outline-none transition-all"
                  />
                  <svg className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <button
                    onClick={fetchUsers}
                    disabled={loadingUsers}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-neutral-900 border border-neutral-850 hover:border-neutral-800 hover:bg-neutral-800 text-xs font-bold text-neutral-400 hover:text-white transition-all cursor-pointer disabled:opacity-50 uppercase tracking-wider"
                  >
                    <RefreshCw className={`h-3 w-3 ${loadingUsers ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {loadingUsers ? (
                <div className="flex flex-col items-center justify-center py-20 border border-neutral-900 rounded-xl bg-neutral-950/40">
                  <Loader2 className="h-8 w-8 animate-spin text-spartan-red" />
                  <p className="text-xs text-neutral-500 mt-4 font-bold uppercase tracking-wider">Accessing User Registries...</p>
                </div>
              ) : usersList.length === 0 ? (
                <div className="text-center py-16 bg-neutral-950 border border-neutral-900 rounded-xl p-8">
                  <Users className="h-8 w-8 text-neutral-600 mx-auto mb-3" />
                  <p className="text-sm text-neutral-400 font-bold uppercase tracking-wide">No Registered Customers Found</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-neutral-900 rounded-xl bg-neutral-950/40">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-900 bg-neutral-950 font-display uppercase text-[10px] tracking-wider text-neutral-500 select-none">
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Contact Phone</th>
                        <th className="p-4">Full Address</th>
                        <th className="p-4">Registered Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900 text-sm">
                      {usersList
                        .filter(u => 
                          u.name.toLowerCase().includes(usersSearchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(usersSearchQuery.toLowerCase()) ||
                          u.contact.toLowerCase().includes(usersSearchQuery.toLowerCase()) ||
                          u.address.toLowerCase().includes(usersSearchQuery.toLowerCase())
                        )
                        .map((user) => (
                          <tr key={user.id} className="hover:bg-neutral-900/40 transition-colors">
                            <td className="p-4">
                              <div className="font-bold text-white uppercase tracking-wide text-xs">{user.name}</div>
                              <div className="text-xs text-neutral-500 font-semibold">{user.email}</div>
                            </td>
                            <td className="p-4 text-neutral-400 text-xs font-semibold">
                              {user.contact || <span className="text-neutral-600 italic">Not set</span>}
                            </td>
                            <td className="p-4 text-neutral-400 text-xs max-w-xs truncate" title={user.address}>
                              {user.address || <span className="text-neutral-600 italic">Not set</span>}
                            </td>
                            <td className="p-4 text-neutral-400 text-xs font-semibold">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-spartan-gold shrink-0" />
                                <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</span>
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setSelectedUser(user)}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 hover:border-spartan-gold text-xs font-bold text-neutral-350 hover:text-spartan-gold transition-all cursor-pointer uppercase tracking-wider"
                                  title="View Customer Profile"
                                >
                                  <Eye className="h-3.5 w-3.5 text-spartan-gold" />
                                  <span>View Profile</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setResetPasswordEmail(user.email);
                                    setNewPasswordVal('');
                                    setResetPwError(null);
                                    setResetPwSuccess(null);
                                  }}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 hover:border-spartan-red text-xs font-bold text-neutral-355 hover:text-spartan-red transition-all cursor-pointer uppercase tracking-wider"
                                  title="Override Password"
                                >
                                  <Key className="h-3.5 w-3.5 text-spartan-red" />
                                  <span>Reset PW</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Password Reset Requests Section */}
            <div className="space-y-4 pt-6 border-t border-neutral-900">
              <div className="flex justify-between items-center bg-neutral-950 p-4 border border-neutral-900 rounded-xl">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider font-display text-white">Password Reset Requests</h3>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Self-service tokens generated by users</p>
                </div>
                <div>
                  <button
                    onClick={fetchResets}
                    disabled={loadingResets}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-neutral-900 border border-neutral-850 hover:border-neutral-800 hover:bg-neutral-800 text-xs font-bold text-neutral-400 hover:text-white transition-all cursor-pointer disabled:opacity-50 uppercase tracking-wider"
                  >
                    <RefreshCw className={`h-3 w-3 ${loadingResets ? 'animate-spin' : ''}`} />
                    <span>Refresh Requests</span>
                  </button>
                </div>
              </div>

              {loadingResets ? (
                <div className="flex flex-col items-center justify-center py-16 border border-neutral-900 rounded-xl bg-neutral-950/40">
                  <Loader2 className="h-7 w-7 animate-spin text-spartan-red" />
                  <p className="text-xs text-neutral-500 mt-3 font-bold uppercase tracking-wider">Loading Requests...</p>
                </div>
              ) : resetRequests.length === 0 ? (
                <div className="text-center py-12 bg-neutral-950 border border-neutral-900 rounded-xl p-8">
                  <AlertTriangle className="h-7 w-7 text-neutral-600 mx-auto mb-2" />
                  <p className="text-xs text-neutral-500 font-bold uppercase tracking-wide">No Active Reset Requests Found</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-neutral-900 rounded-xl bg-neutral-950/40">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-900 bg-neutral-950 font-display uppercase text-[10px] tracking-wider text-neutral-500 select-none">
                        <th className="p-4">User Email</th>
                        <th className="p-4">Date Requested</th>
                        <th className="p-4">Copyable Reset Link</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900 text-sm">
                      {resetRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-neutral-900/40 transition-colors">
                          <td className="p-4 font-semibold text-white text-xs">{req.email}</td>
                          <td className="p-4 text-neutral-400 text-xs font-semibold">
                            {req.createdAt ? new Date(req.createdAt).toLocaleString() : 'N/A'}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 max-w-xs sm:max-w-md">
                              <span className="text-[10px] font-mono text-neutral-500 truncate block flex-1 bg-black px-2 py-1.5 border border-neutral-900 rounded select-all">
                                {`${window.location.origin}/reset-password?token=${req.token}`}
                              </span>
                              <button
                                onClick={() => handleCopyLink(req.token)}
                                className="px-3 py-1.5 rounded bg-spartan-gold hover:bg-yellow-600 text-[10px] font-black text-black uppercase tracking-wider flex items-center gap-1 transition-all shrink-0 cursor-pointer"
                              >
                                {copiedToken === req.token ? (
                                  <>
                                    <Check className="h-3 w-3" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    <span>Copy Link</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteResetRequest(req.token)}
                              className="px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-850 border border-transparent hover:border-neutral-750 text-xs font-bold text-spartan-red transition-all cursor-pointer uppercase tracking-wider flex items-center gap-1 inline-flex"
                              title="Delete request"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'console' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main system log */}
            <div className="lg:col-span-2 bg-neutral-950 border border-neutral-900 rounded-xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-2 border-b border-neutral-900 pb-4 mb-4">
                <Terminal className="h-4 w-4 text-spartan-red" />
                <h3 className="text-sm font-bold uppercase tracking-wider font-display">System Console Log</h3>
              </div>
              
              <div className="font-mono text-xs text-neutral-500 space-y-2.5 overflow-x-auto">
                <div className="flex items-start gap-2">
                  <span className="text-spartan-gold shrink-0">[2026-06-06 10:14:33]</span>
                  <span className="text-neutral-400 font-medium">INITIALIZE: Secure replica set direct tunnel established to MongoDB Atlas...</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 shrink-0">[SUCCESS]</span>
                  <span className="text-neutral-400 font-medium">CONNECTION: Authenticated inside cluster database `spartan_supplements`</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-spartan-gold shrink-0">[2026-06-06 10:15:10]</span>
                  <span className="text-neutral-400 font-medium">VERIFY: Database indices aligned for `products` and `admins`</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-neutral-500 shrink-0">[INFO]</span>
                  <span className="text-neutral-400 font-medium">STATUS: admins exists, default credentials ready for validation check</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-spartan-red shrink-0">[ALERT]</span>
                  <span className="text-neutral-400 font-medium">SECURITY: Admin cookie session established for user {email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-spartan-gold shrink-0">[CONSOLE]</span>
                  <span className="text-neutral-350 animate-pulse font-medium">&gt; Spartan Armory database initialized. Listening for client requests...</span>
                </div>
              </div>
            </div>

            {/* Development Roadmap Card */}
            <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-6 relative">
              <div className="flex items-center gap-2 border-b border-neutral-900 pb-4 mb-4">
                <Cpu className="h-4 w-4 text-spartan-gold" />
                <h3 className="text-sm font-bold uppercase tracking-wider font-display">System Status</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[10px] text-emerald-400 shrink-0 font-bold">✓</div>
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-350">Catalog CRUD Live</h4>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Admin UI to add, update, delete products, control stock levels, and upload images is active.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[10px] text-neutral-500 shrink-0 font-bold">2</div>
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-300">Order Dispatch</h4>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Fulfillment dashboard to view customer orders, update shipping states, and print logs.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[10px] text-neutral-500 shrink-0 font-bold">3</div>
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-300">Promotions & Coupons</h4>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Tool to create active discounts, campaign percentages, and customer referral codes.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-950 p-4 border border-neutral-900 rounded-xl">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider font-display text-white">Homepage Category Cards</h3>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Change images and information for homepage formulation cards</p>
              </div>
              <button
                type="button"
                onClick={fetchCategories}
                className="px-4 py-2 text-[10px] font-bold text-white border border-neutral-800 hover:border-neutral-700 rounded bg-black transition-all cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reload
              </button>
            </div>

            {loadingCategories ? (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-500 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-spartan-red" />
                <span className="text-xs uppercase tracking-widest font-black">Retrieving Categories...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoriesList.map((cat, idx) => (
                  <div key={cat.id} className="bg-neutral-950 border border-neutral-900 hover:border-spartan-red/35 rounded-xl p-5 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden">
                    {/* Glowing highlight indicator */}
                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-spartan-red/25 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    
                    <div className="space-y-4">
                      {/* Live preview */}
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-neutral-800 bg-black flex items-center justify-center">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-[10px] uppercase font-bold text-neutral-600">No Image Selected</div>
                        )}
                        <span className="absolute top-2 left-2 bg-black/80 text-[8px] uppercase tracking-wider font-black text-spartan-gold px-2 py-0.5 rounded border border-spartan-gold/30">
                          {cat.id}
                        </span>
                      </div>

                      {/* Display name */}
                      <div className="space-y-1">
                        <label className="block text-[9px] uppercase tracking-wider font-bold text-neutral-400">Card Name</label>
                        <input
                          type="text"
                          value={cat.name || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCategoriesList(prev => {
                              const next = [...prev];
                              next[idx] = { ...next[idx], name: val };
                              return next;
                            });
                          }}
                          className="w-full bg-black border border-neutral-850 hover:border-neutral-800 focus:border-spartan-red rounded p-2 text-xs font-semibold text-white focus:outline-none transition-all"
                        />
                      </div>

                      {/* Badge text */}
                      <div className="space-y-1">
                        <label className="block text-[9px] uppercase tracking-wider font-bold text-neutral-400">Badge Text (Top of Card)</label>
                        <input
                          type="text"
                          value={cat.badge || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCategoriesList(prev => {
                              const next = [...prev];
                              next[idx] = { ...next[idx], badge: val };
                              return next;
                            });
                          }}
                          className="w-full bg-black border border-neutral-850 hover:border-neutral-800 focus:border-spartan-red rounded p-2 text-xs font-semibold text-white focus:outline-none transition-all"
                        />
                      </div>

                      {/* Tagline text */}
                      <div className="space-y-1">
                        <label className="block text-[9px] uppercase tracking-wider font-bold text-neutral-400">Tagline Description</label>
                        <input
                          type="text"
                          value={cat.tagline || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCategoriesList(prev => {
                              const next = [...prev];
                              next[idx] = { ...next[idx], tagline: val };
                              return next;
                            });
                          }}
                          className="w-full bg-black border border-neutral-850 hover:border-neutral-800 focus:border-spartan-red rounded p-2 text-xs font-semibold text-white focus:outline-none transition-all"
                        />
                      </div>

                      {/* Image URL input */}
                      <div className="space-y-1">
                        <label className="block text-[9px] uppercase tracking-wider font-bold text-neutral-400">Card Image URL</label>
                        <input
                          type="text"
                          value={cat.image || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCategoriesList(prev => {
                              const next = [...prev];
                              next[idx] = { ...next[idx], image: val };
                              return next;
                            });
                          }}
                          placeholder="Paste custom image URL here..."
                          className="w-full bg-black border border-neutral-850 hover:border-neutral-800 focus:border-spartan-red rounded p-2 text-xs font-semibold text-white focus:outline-none transition-all"
                        />
                      </div>

                      {/* Local File Upload Selector */}
                      <div className="space-y-1">
                        <label className="block text-[9px] uppercase tracking-wider font-bold text-neutral-450">Or Upload New Image</label>
                        <div className="relative flex items-center justify-center bg-black border border-dashed border-neutral-800 hover:border-neutral-700 rounded-lg p-3 transition-colors cursor-pointer group/upload">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleCategoryUpload(e, idx)}
                            disabled={uploadingCategoryIndex === idx}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                          />
                          <div className="flex flex-col items-center gap-1.5 text-center pointer-events-none">
                            {uploadingCategoryIndex === idx ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin text-spartan-red" />
                                <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-500">Uploading File...</span>
                              </>
                            ) : (
                              <>
                                <ImageIcon className="h-4 w-4 text-neutral-500 group-hover/upload:text-white transition-colors" />
                                <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-500 group-hover/upload:text-neutral-300 transition-colors">Choose local file...</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Actions footer */}
                    <div className="pt-4 mt-4 border-t border-neutral-900 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSaveCategory(idx)}
                        disabled={savingCategoryIndex === idx || uploadingCategoryIndex === idx}
                        className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded bg-spartan-red hover:bg-spartan-red-dark text-[10px] font-bold text-white transition-all cursor-pointer disabled:opacity-50 shadow-glow-red uppercase tracking-wider"
                      >
                        {savingCategoryIndex === idx ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Save className="h-3.5 w-3.5" />
                        )}
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            {/* Orders Header Section */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-950 p-4 border border-neutral-900 rounded-xl">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider font-display text-white">Supplement Orders Log</h3>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Dispatch and fulfill client supplement stacks</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
                {/* Search */}
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search by ID, Customer Name..."
                    value={ordersSearchQuery}
                    onChange={(e) => setOrdersSearchQuery(e.target.value)}
                    className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded py-2 pl-9 pr-4 text-xs font-semibold text-white focus:outline-none transition-all"
                  />
                  <svg className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {/* Filter */}
                <select
                  value={ordersFilterStatus}
                  onChange={(e) => setOrdersFilterStatus(e.target.value)}
                  className="bg-black border border-neutral-800 hover:border-neutral-700 text-xs font-bold text-white rounded p-2 focus:outline-none focus:border-spartan-red uppercase tracking-wider cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {/* Refresh */}
                <button
                  onClick={fetchOrders}
                  disabled={loadingOrders}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-neutral-900 border border-neutral-850 hover:border-neutral-800 hover:bg-neutral-800 text-xs font-bold text-neutral-400 hover:text-white transition-all cursor-pointer disabled:opacity-50 uppercase tracking-wider"
                >
                  <RefreshCw className={`h-3 w-3 ${loadingOrders ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {loadingOrders ? (
              <div className="flex flex-col items-center justify-center py-24 border border-neutral-900 rounded-xl bg-neutral-950/40">
                <Loader2 className="h-8 w-8 animate-spin text-spartan-red" />
                <p className="text-xs text-neutral-500 mt-4 font-bold uppercase tracking-wider">Accessing Spartan Order vaults...</p>
              </div>
            ) : ordersList.length === 0 ? (
              <div className="text-center py-20 bg-neutral-950 border border-neutral-900 rounded-xl p-8">
                <ShoppingBag className="h-8 w-8 text-neutral-600 mx-auto mb-3" />
                <p className="text-sm text-neutral-400 font-bold uppercase tracking-wide">No Orders Logged Yet</p>
                <p className="text-xs text-neutral-500 mt-1">Order records will populate automatically upon checkout completion.</p>
              </div>
            ) : (
              (() => {
                const filteredOrders = ordersList.filter(o => {
                  const matchesStatus = ordersFilterStatus === 'all' || o.status === ordersFilterStatus;
                  const matchesSearch = o.orderId.toLowerCase().includes(ordersSearchQuery.toLowerCase()) ||
                    o.fullName.toLowerCase().includes(ordersSearchQuery.toLowerCase()) ||
                    o.email.toLowerCase().includes(ordersSearchQuery.toLowerCase()) ||
                    o.phone.toLowerCase().includes(ordersSearchQuery.toLowerCase());
                  return matchesStatus && matchesSearch;
                });

                if (filteredOrders.length === 0) {
                  return (
                    <div className="text-center py-20 bg-neutral-950 border border-neutral-900 rounded-xl p-8">
                      <AlertTriangle className="h-8 w-8 text-neutral-600 mx-auto mb-3" />
                      <p className="text-sm text-neutral-400 font-bold uppercase tracking-wide">No Matching Orders</p>
                    </div>
                  );
                }

                return (
                  <div className="overflow-x-auto border border-neutral-900 rounded-xl bg-neutral-950/40">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-900 bg-neutral-950 font-display uppercase text-[10px] tracking-wider text-neutral-500 select-none">
                          <th className="p-4">Order ID</th>
                          <th className="p-4">Customer Details</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Total Price</th>
                          <th className="p-4">Payment</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900 text-sm">
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-neutral-900/40 transition-colors">
                            <td className="p-4 font-bold text-spartan-gold font-mono">{order.orderId}</td>
                            <td className="p-4">
                              <div className="font-bold text-white uppercase tracking-wide text-xs">{order.fullName}</div>
                              <div className="text-[10px] text-neutral-500 font-semibold">{order.email}</div>
                              <div className="text-[10px] text-neutral-400 font-medium">{order.phone}</div>
                            </td>
                            <td className="p-4 text-neutral-400 text-xs font-semibold">
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                            </td>
                            <td className="p-4 text-xs font-black text-white">
                              Rs. {order.total.toLocaleString()}
                            </td>
                            <td className="p-4 text-[10px] font-bold text-neutral-450 uppercase font-mono">{order.paymentMethod}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-wider border ${
                                order.status === 'pending'
                                  ? 'bg-spartan-red/10 border-spartan-red/20 text-spartan-red'
                                  : order.status === 'shipped'
                                    ? 'bg-spartan-gold/10 border-spartan-gold/25 text-spartan-gold'
                                    : order.status === 'completed'
                                      ? 'bg-emerald-950/15 border-emerald-900/35 text-emerald-400'
                                      : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 hover:border-spartan-gold text-xs font-bold text-neutral-350 hover:text-spartan-gold transition-all cursor-pointer uppercase tracking-wider ml-auto"
                              >
                                <Wrench className="h-3.5 w-3.5 text-spartan-gold" />
                                <span>Fulfill Order</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()
            )}
          </div>
        )}

      </main>

      {/* 1. VIEW PROFILE DIALOG/DRAWER */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end transition-opacity duration-300 animate-fade-in">
          <div className="w-full max-w-md bg-neutral-950 border-l border-neutral-900 h-full p-6 flex flex-col justify-between overflow-y-auto space-y-6 animate-slide-in relative">
            
            {/* Header */}
            <div>
              <div className="flex justify-between items-center border-b border-neutral-900 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-spartan-gold" />
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider font-display text-white">Customer Profile</h3>
                    <p className="text-[9px] text-neutral-500 uppercase tracking-wider font-semibold">MongoDB record details</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-1.5 rounded hover:bg-neutral-900 border border-neutral-850 hover:border-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Personal Info */}
              <div className="space-y-4">
                <div className="bg-black/40 border border-neutral-900 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider block">Full Name</span>
                    <span className="text-xs font-black uppercase text-spartan-gold tracking-wide">{selectedUser.name}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider block">Email Address</span>
                    <span className="text-xs font-semibold text-white/90">{selectedUser.email}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider block">Contact Number</span>
                    <span className="text-xs font-semibold text-white/95">{selectedUser.contact || 'Not Provided'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider block">Delivery Street Address</span>
                    <span className="text-xs font-semibold text-white/95 whitespace-pre-wrap">{selectedUser.address || 'Not Provided'}</span>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-spartan-gold flex items-center gap-1.5 font-display">
                    <ShoppingBag className="h-3.5 w-3.5 text-spartan-red" />
                    <span>Active Cart Items ({selectedUser.cart?.length || 0})</span>
                  </h4>
                  {(!selectedUser.cart || selectedUser.cart.length === 0) ? (
                    <div className="text-[11px] text-neutral-600 bg-black/20 border border-neutral-900 rounded p-3 text-center font-medium italic">
                      Cart is currently empty.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {selectedUser.cart.map((item: any, idx: number) => {
                        const product = item.product || products.find(p => p.id === item.productId);
                        if (!product) return null;
                        return (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-black/40 border border-neutral-900 rounded">
                            <div className="w-8 h-8 rounded bg-black border border-neutral-850 flex items-center justify-center p-1 shrink-0">
                              <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[11px] font-bold text-white truncate">{product.name}</div>
                              <div className="text-[9px] text-neutral-500">Rs. {product.price?.toLocaleString()}</div>
                            </div>
                            <div className="px-2 py-0.5 rounded bg-spartan-red/10 border border-spartan-red/20 text-[9px] font-bold text-spartan-red shrink-0">
                              Qty: {item.quantity}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Wishlist Items */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-spartan-gold flex items-center gap-1.5 font-display">
                    <Heart className="h-3.5 w-3.5 text-spartan-red" />
                    <span>Wishlist Items ({selectedUser.wishlist?.length || 0})</span>
                  </h4>
                  {(!selectedUser.wishlist || selectedUser.wishlist.length === 0) ? (
                    <div className="text-[11px] text-neutral-600 bg-black/20 border border-neutral-900 rounded p-3 text-center font-medium italic">
                      Wishlist is empty.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {selectedUser.wishlist.map((productId: string) => {
                        const product = products.find(p => p.id === productId);
                        if (!product) return null;
                        return (
                          <div key={productId} className="flex items-center gap-2 p-2 bg-black/40 border border-neutral-900 rounded">
                            <div className="w-8 h-8 rounded bg-black border border-neutral-850 flex items-center justify-center p-1 shrink-0">
                              <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[11px] font-bold text-white truncate">{product.name}</div>
                              <div className="text-[9px] text-neutral-500">Rs. {product.price?.toLocaleString()}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer / Close Button */}
            <div className="pt-4 border-t border-neutral-900">
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-805 hover:border-neutral-750 text-xs font-bold uppercase tracking-wider text-neutral-350 hover:text-white rounded transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DIRECT PASSWORD OVERRIDE MODAL */}
      {resetPasswordEmail && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-neutral-950 border border-neutral-900 rounded-xl p-5 space-y-4 animate-scale-in">
            <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
              <div className="flex items-center gap-2 text-spartan-red">
                <Key className="h-4.5 w-4.5" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-display">Override Password</h3>
              </div>
              <button
                onClick={() => setResetPasswordEmail(null)}
                className="p-1 rounded hover:bg-neutral-900 border border-transparent hover:border-neutral-850 text-neutral-500 hover:text-white transition-all cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <form onSubmit={handleDirectPasswordReset} className="space-y-4">
              <div className="text-[10px] text-neutral-500 uppercase font-semibold">
                You are changing the password for: <span className="text-spartan-gold block mt-0.5 break-all text-xs font-bold">{resetPasswordEmail}</span>
              </div>

              {resetPwError && (
                <div className="p-2.5 bg-spartan-red/10 border border-spartan-red/20 rounded text-[11px] text-spartan-red flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>{resetPwError}</span>
                </div>
              )}

              {resetPwSuccess && (
                <div className="p-2.5 bg-emerald-950/20 border border-emerald-900/40 rounded text-[11px] text-emerald-400 flex items-center gap-1.5 animate-pulse">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>{resetPwSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPasswordVal}
                  onChange={(e) => setNewPasswordVal(e.target.value)}
                  placeholder="Enter secure new password"
                  className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-spartan-red rounded p-2.5 text-xs text-white focus:outline-none transition-all"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={() => setResetPasswordEmail(null)}
                  className="px-3.5 py-2 text-[10px] font-bold text-neutral-400 hover:text-white border border-neutral-850 hover:border-neutral-800 rounded bg-neutral-900 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resettingPw}
                  className="flex items-center gap-1.5 px-4 py-2 rounded bg-spartan-red hover:bg-spartan-red-dark text-[10px] font-bold text-white transition-all cursor-pointer disabled:opacity-50 shadow-glow-red uppercase tracking-wider"
                >
                  {resettingPw ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  <span>Change Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADMIN MANAGE ORDER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-neutral-950 border border-neutral-900 rounded-xl p-5 space-y-4 animate-scale-in relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
              <div className="flex items-center gap-2 text-spartan-gold">
                <ShoppingBag className="h-4.5 w-4.5" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-display">Manage Order: <span className="text-white font-mono">{selectedOrder.orderId}</span></h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded hover:bg-neutral-900 border border-transparent hover:border-neutral-850 text-neutral-500 hover:text-white transition-all cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Shipping Address details */}
              <div className="bg-black/40 border border-neutral-900 rounded-lg p-3 space-y-2 text-xs">
                <h4 className="text-[10px] text-spartan-gold font-bold uppercase tracking-wider">Shipping & Contact Info</h4>
                <div>
                  <span className="text-neutral-500 block font-semibold">Recipient Name:</span>
                  <span className="text-white font-bold">{selectedOrder.fullName}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block font-semibold">Contact Phone:</span>
                  <span className="text-white font-bold">{selectedOrder.phone}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block font-semibold">Delivery Address:</span>
                  <span className="text-white font-medium whitespace-pre-wrap">{selectedOrder.address}, {selectedOrder.city}</span>
                </div>
                {selectedOrder.notes && (
                  <div>
                    <span className="text-neutral-500 block font-semibold">Customer Order Notes:</span>
                    <span className="text-neutral-300 italic">"{selectedOrder.notes}"</span>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <h4 className="text-[10px] text-spartan-gold font-bold uppercase tracking-wider">Items Stack</h4>
                <div className="border border-neutral-900 rounded bg-black/20 p-2 space-y-2">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-xs py-1 first:pt-0 last:pb-0 border-b border-neutral-900/60 last:border-b-0">
                      <div className="w-8 h-8 rounded bg-black border border-neutral-850 flex items-center justify-center p-1 shrink-0">
                        <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white truncate uppercase tracking-wider">{item.name}</div>
                        <div className="text-[9px] text-neutral-500">Price: Rs. {item.price.toLocaleString()}</div>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-neutral-300 font-semibold">Qty: {item.quantity}</span>
                        <span className="font-bold text-white">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order total info */}
              <div className="flex justify-between items-center text-xs bg-neutral-950 p-2.5 rounded border border-neutral-900">
                <div className="text-neutral-500 font-semibold space-y-1 flex-1">
                  <div>Payment method: <span className="text-white font-bold uppercase font-mono">{selectedOrder.paymentMethod}</span></div>
                  {selectedOrder.promoCode && (
                    <div className="text-emerald-450 flex items-center gap-1 mt-1.5 font-semibold">
                      <Tag className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Promo: <span className="text-white font-bold uppercase font-mono bg-emerald-950/40 border border-emerald-900/35 px-1.5 py-0.5 rounded">{selectedOrder.promoCode}</span>
                    </div>
                  )}
                </div>
                <div className="text-right space-y-0.5 shrink-0">
                  <div className="text-neutral-500">Subtotal: Rs. {selectedOrder.subtotal?.toLocaleString()}</div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="text-spartan-red font-semibold">Discount: -Rs. {selectedOrder.discountAmount.toLocaleString()}</div>
                  )}
                  <div className="text-neutral-500">Shipping: {selectedOrder.shipping === 0 ? "FREE" : `Rs. ${selectedOrder.shipping}`}</div>
                  <div className="font-bold text-white">Total: <span className="text-spartan-gold">Rs. {selectedOrder.total.toLocaleString()}</span></div>
                </div>
              </div>

              {/* Status Update selection */}
              <div className="pt-2 border-t border-neutral-900 space-y-2">
                <label className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider">Update Order Status</label>
                <div className="flex gap-2">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateStatus(selectedOrder.orderId, e.target.value)}
                    disabled={updatingOrderStatus}
                    className="flex-1 bg-black border border-neutral-800 hover:border-neutral-700 text-xs font-bold text-white rounded p-2.5 focus:outline-none focus:border-spartan-red uppercase tracking-wider cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {updatingOrderStatus && (
                    <div className="flex items-center justify-center px-3">
                      <Loader2 className="h-4 w-4 animate-spin text-spartan-red" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-neutral-900">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-[10px] font-bold text-neutral-400 hover:text-white border border-neutral-850 hover:border-neutral-850 rounded bg-neutral-900 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
