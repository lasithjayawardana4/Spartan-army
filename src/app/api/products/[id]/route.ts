import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifySession } from '@/app/admin/actions';

// Helper to construct query safely checking both ObjectId and string id
function getQueryForId(id: string) {
  if (ObjectId.isValid(id)) {
    return { $or: [{ _id: new ObjectId(id) }, { id: id }] };
  }
  return { id: id };
}

// GET: Fetch a single product
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDb();
    
    const product = await db.collection('products').findOne(getQueryForId(id));
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const productIdStr = product.id || product._id.toString();
    const reviews = await db.collection('reviews').find({ productId: productIdStr }).sort({ createdAt: -1 }).toArray();

    const formattedProduct = {
      ...product,
      id: productIdStr,
      _id: product._id.toString(),
      reviews: reviews.map(r => ({
        id: r._id.toString(),
        orderId: r.orderId,
        productId: r.productId,
        userEmail: r.userEmail,
        userName: r.userName,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt ? r.createdAt.toISOString() : null
      }))
    };

    return NextResponse.json(formattedProduct);
  } catch (error: any) {
    console.error('Fetch single product error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT: Update a product (Admin Only)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const db = await getDb();
    const data = await req.json();

    if (!data.name || !data.category || data.price === undefined) {
      return NextResponse.json({ error: 'Name, category, and price are required' }, { status: 400 });
    }

    const updateFields = {
      name: data.name.trim(),
      category: data.category.trim(),
      price: Number(data.price),
      oldPrice: data.oldPrice ? Number(data.oldPrice) : undefined,
      rating: Number(data.rating || 5),
      reviewsCount: Number(data.reviewsCount || 0),
      image: data.image,
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
      updatedAt: new Date()
    };

    const result = await db.collection('products').updateOne(
      getQueryForId(id), 
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE: Delete a product (Admin Only)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const db = await getDb();

    const result = await db.collection('products').deleteOne(getQueryForId(id));

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
