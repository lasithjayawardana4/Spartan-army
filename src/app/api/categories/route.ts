import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifySession } from '@/app/admin/actions';

const DEFAULT_CATEGORIES = [
  {
    id: "whey-protein",
    name: "Whey Protein",
    badge: "Big Gains. Bigger Nutrition",
    tagline: "Lean muscle growth & rapid repair",
    image: "/images/cat_whey_protein.png",
  },
  {
    id: "mass-gainers",
    name: "Mass Gainers",
    badge: "Mass & Size. Warrior Build",
    tagline: "High calorie fuel for maximum size",
    image: "/images/cat_mass_gainer.png",
  },
  {
    id: "pre-workout",
    name: "Pre Workout",
    badge: "Level up every session.",
    tagline: "Explosive energy & laser focus",
    image: "/images/cat_pre_workout.png",
  },
  {
    id: "creatine",
    name: "Creatine",
    badge: "Pure Strength. Raw Power",
    tagline: "Boost ATP, strength & muscle volume",
    image: "/images/cat_creatine.png",
  },
  {
    id: "fat-burners",
    name: "Fat Burners",
    badge: "Smart. Burn Fast",
    tagline: "Extreme thermogenic metabolic support",
    image: "/images/cat_fat_burner.png",
  },
  {
    id: "vitamins-minerals",
    name: "Vitamins",
    badge: "Shield. Guard. Recover",
    tagline: "Daily micronutrients for elite health",
    image: "/images/cat_vitamins.png",
  },
];

// GET: Fetch all category cards (and seed them if collection is empty)
export async function GET() {
  try {
    const db = await getDb();
    const categoriesCol = db.collection('categories');
    
    let categories = await categoriesCol.find({}).toArray();
    
    if (categories.length === 0) {
      await categoriesCol.insertMany(DEFAULT_CATEGORIES.map(c => ({ ...c, createdAt: new Date() })));
      categories = await categoriesCol.find({}).toArray();
    }
    
    const formattedCategories = categories.map(c => ({
      id: c.id,
      name: c.name,
      badge: c.badge,
      tagline: c.tagline,
      image: c.image
    }));
    
    return NextResponse.json(formattedCategories);
  } catch (error: any) {
    console.error('Fetch categories error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// PUT: Update dynamic category configuration (Admin Only)
export async function PUT(req: Request) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const data = await req.json();

    if (!data.id || !data.image) {
      return NextResponse.json({ error: 'Category ID and image URL are required' }, { status: 400 });
    }

    const categoriesCol = db.collection('categories');
    
    // Ensure category exists first, or insert it
    const existing = await categoriesCol.findOne({ id: data.id });
    
    if (!existing) {
      // If it doesn't exist, create it fully
      await categoriesCol.insertOne({
        id: data.id,
        name: data.name || data.id,
        badge: data.badge || '',
        tagline: data.tagline || '',
        image: data.image,
        createdAt: new Date()
      });
    } else {
      // Update existing
      const updateFields: any = { image: data.image };
      if (data.name) updateFields.name = data.name;
      if (data.badge) updateFields.badge = data.badge;
      if (data.tagline) updateFields.tagline = data.tagline;

      await categoriesCol.updateOne(
        { id: data.id },
        { $set: updateFields }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update category error:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}
