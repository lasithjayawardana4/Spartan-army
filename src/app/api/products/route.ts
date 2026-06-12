import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifySession } from '@/app/admin/actions';

// GET: Fetch all products from MongoDB
export async function GET() {
  try {
    const db = await getDb();
    const products = await db.collection('products').find({}).sort({ createdAt: -1 }).toArray();
    
    // Map MongoDB _id to string id
    const formattedProducts = products.map(p => ({
      ...p,
      id: p.id || p._id.toString(),
      _id: p._id.toString()
    }));
    
    return NextResponse.json(formattedProducts);
  } catch (error: any) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST: Create a new product (Admin Only)
export async function POST(req: Request) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const data = await req.json();

    // Field validation
    if (!data.name || !data.category || data.price === undefined) {
      return NextResponse.json({ error: 'Product name, category, and price are required' }, { status: 400 });
    }

    const newProduct = {
      name: data.name.trim(),
      category: data.category.trim(),
      price: Number(data.price),
      oldPrice: data.oldPrice ? Number(data.oldPrice) : undefined,
      rating: Number(data.rating || 5),
      reviewsCount: Number(data.reviewsCount || 0),
      image: data.image || 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=600&auto=format&fit=crop',
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [data.image].filter(Boolean),
      description: data.description || '',
      shortDescription: data.shortDescription || '',
      benefits: Array.isArray(data.benefits) ? data.benefits : [],
      ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
      usage: data.usage || '',
      features: Array.isArray(data.features) ? data.features : [],
      isBestSeller: !!data.isBestSeller,
      isNewArrival: !!data.isNewArrival,
      isPopular: !!data.isPopular,
      stock: Number(data.stock || 0),
      promoCode: data.promoCode ? data.promoCode.trim().toUpperCase() : undefined,
      discountPercentage: data.discountPercentage ? Number(data.discountPercentage) : undefined,
      flavors: Array.isArray(data.flavors) ? data.flavors.map((f: any) => ({
        name: String(f.name).trim(),
        price: Number(f.price || 0),
        image: String(f.image || ''),
        stock: Number(f.stock !== undefined ? f.stock : 0)
      })) : [],
      createdAt: new Date()
    };

    const result = await db.collection('products').insertOne(newProduct);
    const insertedId = result.insertedId.toString();

    // Ensure the product document has an id property matching its string version
    await db.collection('products').updateOne(
      { _id: result.insertedId },
      { $set: { id: insertedId } }
    );

    return NextResponse.json({ success: true, id: insertedId });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
