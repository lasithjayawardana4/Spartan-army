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
  { id: "whey-protein", name: "Whey Protein", image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=600&auto=format&fit=crop", count: 3 },
  { id: "mass-gainers", name: "Mass Gainers", image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=600&auto=format&fit=crop", count: 2 },
  { id: "pre-workout", name: "Pre Workout", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop", count: 2 },
  { id: "creatine", name: "Creatine", image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=600&auto=format&fit=crop", count: 2 },
  { id: "fat-burners", name: "Fat Burners", image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=600&auto=format&fit=crop", count: 2 },
  { id: "bcaas-eaas", name: "BCAAs & EAAs", image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop", count: 1 },
  { id: "vitamins-minerals", name: "Vitamins & Minerals", image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=600&auto=format&fit=crop", count: 2 },
  { id: "testosterone-support", name: "Testosterone Support", image: "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?q=80&w=600&auto=format&fit=crop", count: 1 },
  { id: "recovery-supplements", name: "Recovery Supplements", image: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=600&auto=format&fit=crop", count: 1 },
  { id: "accessories", name: "Accessories", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop", count: 2 },
];

export const PRODUCTS: Product[] = [
  // Whey Protein
  {
    id: "spartan-whey-gold-2lb",
    name: "Spartan Whey Gold 2lb",
    category: "whey-protein",
    price: 13500,
    oldPrice: 15000,
    rating: 4.8,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop"
    ],
    shortDescription: "Ultra-pure Whey Protein Isolate and Concentrate blend for extreme muscle synthesis.",
    description: "Spartan Whey Gold is the ultimate warrior's protein fuel. Combining cross-flow microfiltered whey protein isolate and high-quality concentrate, it delivers rapid absorption to fuel muscle recovery and growth immediately after high-intensity battle.",
    benefits: [
      "24g of Pure Protein per serving",
      "5.5g of naturally occurring BCAAs to fuel protein synthesis",
      "Fast digesting formula for quick post-workout recovery",
      "Zero added sugars and low fat"
    ],
    ingredients: [
      "Whey Protein Isolate",
      "Whey Protein Concentrate",
      "Natural and Artificial Flavors",
      "Soy Lecithin",
      "Sucralose"
    ],
    usage: "Mix 1 scoop with 200-250ml of cold water or skimmed milk in your Spartan shaker. Consume immediately post-workout or first thing in the morning.",
    features: [
      { label: "Servings", value: "28 Servings" },
      { label: "Protein per Serving", value: "24g" },
      { label: "Flavors", value: "Double Rich Chocolate, Gourmet Vanilla" }
    ],
    isBestSeller: true,
    isPopular: true,
    stock: 25
  },
  {
    id: "spartan-whey-gold-5lb",
    name: "Spartan Whey Gold 5lb",
    category: "whey-protein",
    price: 28500,
    oldPrice: 32000,
    rating: 4.9,
    reviewsCount: 318,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=600&auto=format&fit=crop"
    ],
    shortDescription: "Bulk size of our flagship whey protein blend for continuous muscle gains.",
    description: "Fuel your fitness regime with the bulk version of Spartan Whey Gold. Tailored for athletes who require consistent high-protein intake over longer training blocks. Experience premium recovery at a better price per serving.",
    benefits: [
      "24g of Pure Protein per serving",
      "71 servings per container",
      "Excellent solubility and rich milkshake texture",
      "Supports massive muscle hypertrophy"
    ],
    ingredients: [
      "Whey Protein Isolate",
      "Whey Protein Concentrate",
      "Natural and Artificial Flavors",
      "Xanthan Gum",
      "Sucralose"
    ],
    usage: "Take 1-2 scoops daily. Best taken post-workout, or between meals to maintain positive nitrogen balance.",
    features: [
      { label: "Servings", value: "71 Servings" },
      { label: "Protein per Serving", value: "24g" },
      { label: "Flavors", value: "Double Rich Chocolate, Cookies & Cream" }
    ],
    isPopular: true,
    stock: 18
  },
  {
    id: "premium-isolate-protein",
    name: "Premium Isolate Protein",
    category: "whey-protein",
    price: 18000,
    oldPrice: 19500,
    rating: 4.7,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=600&auto=format&fit=crop"
    ],
    shortDescription: "100% Hydrolyzed Whey Protein Isolate with zero carbs and zero fat.",
    description: "The cleanest protein source available. Spartan Premium Isolate goes through advanced filtration to remove all fats, lactose, and sugars, leaving a highly bioavailable source of amino acids for immediate muscle repair.",
    benefits: [
      "25g of 100% Hydrolyzed Whey Isolate",
      "Zero lactose and fat, perfect for sensitive stomachs",
      "Extremely fast digestion and absorption rate",
      "Ideal for cutting phases and lean muscle maintenance"
    ],
    ingredients: [
      "Hydrolyzed Whey Protein Isolate",
      "Natural Cocoa Powder",
      "Stevia Leaf Extract",
      "Sunflower Lecithin"
    ],
    usage: "Mix 1 scoop with 200ml of water. Best taken immediately following intense training.",
    features: [
      { label: "Servings", value: "30 Servings" },
      { label: "Protein per Serving", value: "25g" },
      { label: "Flavors", value: "Chocolate Fudge, Strawberry Blast" }
    ],
    isNewArrival: true,
    stock: 12
  },

  // Creatine
  {
    id: "spartan-creatine-monohydrate-300g",
    name: "Spartan Creatine Monohydrate 300g",
    category: "creatine",
    price: 6500,
    oldPrice: 7500,
    rating: 4.9,
    reviewsCount: 289,
    image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=600&auto=format&fit=crop"
    ],
    shortDescription: "100% Pure micronized creatine monohydrate for explosive power and size.",
    description: "Increase your power, endurance, and muscle volume with Spartan Creatine Monohydrate. Micronized for optimal mixability and rapid utilization by skeletal muscle tissue.",
    benefits: [
      "Increases muscle strength and power output",
      "Enhances ATP production for longer, heavier sets",
      "Micronized for instant mixing and zero grittiness",
      "Supports cellular hydration and volumization"
    ],
    ingredients: [
      "100% Pure Micronized Creatine Monohydrate"
    ],
    usage: "Take 1 scoop (5g) daily. During the loading phase (first 5 days), take 1 scoop 4 times daily. Mix with water or your favorite juice.",
    features: [
      { label: "Servings", value: "60 Servings" },
      { label: "Creatine per Serving", value: "5g" },
      { label: "Unflavored", value: "Yes" }
    ],
    isBestSeller: true,
    stock: 45
  },
  {
    id: "micronized-creatine",
    name: "Micronized Creatine Creapure",
    category: "creatine",
    price: 8500,
    oldPrice: 9500,
    rating: 4.8,
    reviewsCount: 74,
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=600&auto=format&fit=crop"
    ],
    shortDescription: "Premium gold-standard Creapure® creatine for elite athletes.",
    description: "Creapure® is the premium brand for creatine monohydrate worldwide. Synthesized under strict laboratory conditions in Germany, it offers the highest purity and safety standards.",
    benefits: [
      "German-grade Creapure® creatine",
      "99.9% pure HPLC tested",
      "Accelerates post-workout muscle recovery",
      "No bloating or stomach discomfort"
    ],
    ingredients: [
      "Creapure® Creatine Monohydrate"
    ],
    usage: "Take 1 scoop (5g) mixed with cold water or a carbohydrate-rich shake immediately after working out.",
    features: [
      { label: "Servings", value: "60 Servings" },
      { label: "Purity", value: "99.9% Certified" }
    ],
    isNewArrival: true,
    stock: 15
  },

  // Pre Workout
  {
    id: "spartan-rage-pre-workout",
    name: "Spartan Rage Pre Workout",
    category: "pre-workout",
    price: 9500,
    oldPrice: 11000,
    rating: 4.9,
    reviewsCount: 198,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop"
    ],
    shortDescription: "High-stimulant pre-workout for skin-splitting pumps and hyper-focus.",
    description: "Unleash your inner beast. Spartan Rage is formulated with high doses of L-Citrulline, Beta-Alanine, and Caffeine to deliver explosive energy, laser focus, and a pumps that last long after you leave the gym.",
    benefits: [
      "6,000mg L-Citrulline for maximum Nitric Oxide production",
      "3,200mg Beta-Alanine to buffer lactic acid and reduce fatigue",
      "350mg Caffeine for relentless, crash-free energy",
      "Focus enhancers like L-Tyrosine and Alpha-GPC"
    ],
    ingredients: [
      "L-Citrulline Malate",
      "Beta-Alanine",
      "Caffeine Anhydrous",
      "L-Tyrosine",
      "Natural Flavors",
      "Sucralose"
    ],
    usage: "Mix 1 scoop with 250-300ml of cold water. Drink 20-30 minutes prior to training. Assess tolerance with 1/2 scoop first.",
    features: [
      { label: "Servings", value: "30 Servings" },
      { label: "Caffeine per Serving", value: "350mg" },
      { label: "Flavors", value: "Sour Blood Orange, Blue Raspberry" }
    ],
    isBestSeller: true,
    stock: 30
  },
  {
    id: "extreme-energy-formula",
    name: "Extreme Energy Formula",
    category: "pre-workout",
    price: 8800,
    oldPrice: 10000,
    rating: 4.6,
    reviewsCount: 62,
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop"
    ],
    shortDescription: "Clean sustained energy formula without the post-workout crash.",
    description: "Designed for endurance athletes and crossfitters, this formula provides quick energy release followed by sustained carbohydrate metabolism to prevent power drops.",
    benefits: [
      "Contains organic green tea extract caffeine",
      "Infused with electrolytes to prevent cramping",
      "Zero artificial dyes or colorings",
      "Supports cognitive function and agility"
    ],
    ingredients: [
      "Green Coffee Bean Extract",
      "Coconut Water Powder",
      "Taurine",
      "B-Vitamins"
    ],
    usage: "Mix 1 scoop with water. Sip before and during workouts for steady endurance.",
    features: [
      { label: "Servings", value: "40 Servings" },
      { label: "Caffeine", value: "150mg" }
    ],
    stock: 14
  },

  // Mass Gainer
  {
    id: "spartan-mass-builder",
    name: "Spartan Mass Builder 6lb",
    category: "mass-gainers",
    price: 16500,
    oldPrice: 18500,
    rating: 4.7,
    reviewsCount: 154,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=600&auto=format&fit=crop"
    ],
    shortDescription: "High-calorie weight gainer packed with protein, clean carbs, and creatine.",
    description: "Spartan Mass Builder is the ultimate formula for hardgainers looking to pack on serious size. Loaded with clean calories, high quality proteins, and complex carbohydrates to support maximum size gains.",
    benefits: [
      "1,250 Calories per serving to support positive energy balance",
      "50g of premium multi-phase protein blend",
      "250g of clean complex carbohydrates",
      "Enhanced with Creatine and Glutamine for muscle volume"
    ],
    ingredients: [
      "Maltodextrin",
      "Protein Blend (Whey Concentrate, Calcium Caseinate, Egg Albumin)",
      "Creatine Monohydrate",
      "Medium Chain Triglycerides (MCTs)",
      "Cocoa Powder"
    ],
    usage: "Mix 2 scoops with 700ml of cold water or whole milk. Blend for 30-45 seconds. Drink between meals or post-workout.",
    features: [
      { label: "Weight", value: "6 lbs (2.7 kg)" },
      { label: "Calories per Serving", value: "1250" },
      { label: "Protein per Serving", value: "50g" }
    ],
    isPopular: true,
    stock: 20
  },
  {
    id: "hardcore-weight-gainer",
    name: "Hardcore Weight Gainer 12lb",
    category: "mass-gainers",
    price: 27000,
    oldPrice: 30000,
    rating: 4.8,
    reviewsCount: 92,
    image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=600&auto=format&fit=crop"
    ],
    shortDescription: "Giant bulk gainer containing state-of-the-art nutrient profile.",
    description: "Engineered specifically for heavy duty strength lifters. Provides a massive dose of protein, BCAAs, and low-glycemic carbohydrates to trigger anabolic recovery without fat gain.",
    benefits: [
      "Huge 12lb container for long-term bulking",
      "Over 60g protein per serving when mixed with milk",
      "Enriched with digestive enzymes for easy digestion",
      "Loaded with key vitamins and minerals"
    ],
    ingredients: [
      "Organic Oat Flour",
      "Whey Isolate",
      "Micellar Casein",
      "Sweet Potato Powder",
      "Amylase & Protease Enzymes"
    ],
    usage: "Divide serving into 2 parts. Drink one in mid-morning and the second immediately post-training.",
    features: [
      { label: "Weight", value: "12 lbs (5.4 kg)" },
      { label: "Protein", value: "60g" }
    ],
    isNewArrival: true,
    stock: 10
  },

  // Fat Burners
  {
    id: "spartan-thermo-burn",
    name: "Spartan Thermo Burn",
    category: "fat-burners",
    price: 8900,
    oldPrice: 9900,
    rating: 4.8,
    reviewsCount: 115,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=600&auto=format&fit=crop"
    ],
    shortDescription: "Extreme thermogenic shredding agent for metabolic support and appetite suppression.",
    description: "Spartan Thermo Burn is a scientifically formulated fat burner designed to accelerate lipolysis, boost core metabolic rate, suppress cravings, and provide extreme focus during caloric deficits.",
    benefits: [
      "Speeds up fat metabolism through thermogenesis",
      "Provides clean, high-intensity energy and mental focus",
      "Supports natural appetite control and reduces sugar cravings",
      "Enhances water output for high muscular definition"
    ],
    ingredients: [
      "Caffeine Anhydrous",
      "Green Tea Extract (EGCG)",
      "L-Carnitine Tartrate",
      "Cayenne Pepper Extract (Capsimax)",
      "Yohimbine HCl"
    ],
    usage: "Take 1 capsule with water 30 minutes before breakfast. Once tolerance is assessed, take a second capsule 30 minutes before lunch. Do not exceed 2 capsules daily.",
    features: [
      { label: "Capsules", value: "90 Capsules" },
      { label: "Type", value: "Thermogenic Fat Burner" }
    ],
    isBestSeller: true,
    stock: 22
  },

  // Vitamins
  {
    id: "multivitamin-complex",
    name: "Multivitamin Complex",
    category: "vitamins-minerals",
    price: 4500,
    oldPrice: 5200,
    rating: 4.7,
    reviewsCount: 167,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=600&auto=format&fit=crop"
    ],
    shortDescription: "High-potency daily vitamin & mineral blend customized for active individuals.",
    description: "Spartan Multivitamin Complex ensures your body has all the micronutrients required for optimal cellular function, immune defense, and protein metabolism during heavy training cycles.",
    benefits: [
      "Full spectrum of vitamins A, C, D, E, and B-Complex",
      "Essential trace minerals including Zinc and Magnesium",
      "Antioxidants to combat exercise-induced oxidative stress",
      "Supports natural energy levels and immune function"
    ],
    ingredients: [
      "Vitamin Blend",
      "Mineral Complex",
      "Coenzyme Q10",
      "Panax Ginseng Extract"
    ],
    usage: "Take 2 tablets daily with a meal, preferably with breakfast.",
    features: [
      { label: "Servings", value: "60 Servings" },
      { label: "Form", value: "Tablets" }
    ],
    isPopular: true,
    stock: 50
  },
  {
    id: "omega-3-fish-oil",
    name: "Omega 3 Fish Oil",
    category: "vitamins-minerals",
    price: 4200,
    oldPrice: 4800,
    rating: 4.8,
    reviewsCount: 95,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=600&auto=format&fit=crop"
    ],
    shortDescription: "High EPA & DHA concentration for joint support and cardiovascular health.",
    description: "Pure fish oil softgels containing molecularly distilled, mercury-free omega-3 fatty acids. Promotes joint flexibility, reduces inflammation, and boosts cognitive function.",
    benefits: [
      "1,000mg Premium Fish Oil per softgel",
      "High EPA (360mg) and DHA (240mg) concentration",
      "Supports cardiovascular and brain health",
      "Helps lubricate joints and reduces soreness"
    ],
    ingredients: [
      "Molecularly Distilled Fish Oil",
      "Gelatin Softgel Shell",
      "Glycerin",
      "Natural Tocopherols"
    ],
    usage: "Take 1-2 softgels daily with meals.",
    features: [
      { label: "Softgels", value: "120 Softgels" },
      { label: "Source", value: "Wild Caught Anchovies/Sardines" }
    ],
    stock: 35
  }
];
