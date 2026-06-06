export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  description: string;
  shortDescription: string;
  benefits: string[];
  ingredients: string[];
  usage: string;
  features: { label: string; value: string }[];
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isPopular?: boolean;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
}

export const CATEGORIES: Category[] = [
  { id: "whey-protein", name: "Whey Protein", image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=600&auto=format&fit=crop", count: 0 },
  { id: "mass-gainers", name: "Mass Gainers", image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=600&auto=format&fit=crop", count: 0 },
  { id: "pre-workout", name: "Pre Workout", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop", count: 0 },
  { id: "creatine", name: "Creatine", image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=600&auto=format&fit=crop", count: 0 },
  { id: "fat-burners", name: "Fat Burners", image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=600&auto=format&fit=crop", count: 0 },
  { id: "bcaas-eaas", name: "BCAAs & EAAs", image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop", count: 0 },
  { id: "vitamins-minerals", name: "Vitamins & Minerals", image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=600&auto=format&fit=crop", count: 0 },
  { id: "testosterone-support", name: "Testosterone Support", image: "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?q=80&w=600&auto=format&fit=crop", count: 0 },
  { id: "recovery-supplements", name: "Recovery Supplements", image: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=600&auto=format&fit=crop", count: 0 },
  { id: "accessories", name: "Accessories", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop", count: 0 },
];

// Empty products array as you are going to create real ones in MongoDB
export const PRODUCTS: Product[] = [];
