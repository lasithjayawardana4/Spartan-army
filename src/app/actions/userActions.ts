'use server';

import { cookies } from 'next/headers';
import crypto from 'crypto';
import { getDb } from '@/lib/mongodb';
import { sendPasswordResetEmail } from '@/lib/mail';
import { ObjectId } from 'mongodb';

// Helper to hash password using PBKDF2
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Generate signed session cookie for customer
function generateUserSessionCookie(email: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not configured');

  // Customer session duration: 7 days
  const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = JSON.stringify({ email, expiry });
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${Buffer.from(payload).toString('base64')}.${signature}`;
}

// Validate customer session cookie
export async function verifyUserSession(): Promise<string | null> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;

  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('spartan_user_session')?.value;
    if (!session) return null;

    const [base64Payload, signature] = session.split('.');
    if (!base64Payload || !signature) return null;

    const payloadStr = Buffer.from(base64Payload, 'base64').toString('utf8');
    const expectedSignature = crypto.createHmac('sha256', secret).update(payloadStr).digest('hex');

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(payloadStr);
    if (payload.expiry < Date.now()) {
      return null; // Expired
    }

    return payload.email;
  } catch (e) {
    return null;
  }
}

// Action: Register User
export async function registerUser(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const contact = formData.get('contact') as string || '';
    const address = formData.get('address') as string || '';

    if (!name || !email || !password) {
      return { success: false, error: 'Name, email, and password are required' };
    }

    const normalizedEmail = email.toLowerCase().trim();
    const db = await getDb();
    const usersCol = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCol.findOne({ email: normalizedEmail });
    if (existingUser) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // Hash password
    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);

    // Create user
    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      salt,
      contact: contact.trim(),
      address: address.trim(),
      cart: [],
      wishlist: [],
      createdAt: new Date()
    };

    await usersCol.insertOne(newUser);

    // Set signed cookie session
    const token = generateUserSessionCookie(normalizedEmail);
    const cookieStore = await cookies();
    cookieStore.set('spartan_user_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return {
      success: true,
      user: {
        name: newUser.name,
        email: newUser.email,
        contact: newUser.contact,
        address: newUser.address,
        cart: [],
        wishlist: []
      }
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed. Please try again later.' };
  }
}

// Action: Login User
export async function loginUser(email: string, password: string) {
  try {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    const normalizedEmail = email.toLowerCase().trim();
    const db = await getDb();
    const usersCol = db.collection('users');

    const user = await usersCol.findOne({ email: normalizedEmail });
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const computedHash = hashPassword(password, user.salt);
    if (computedHash !== user.passwordHash) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Set signed cookie session
    const token = generateUserSessionCookie(normalizedEmail);
    const cookieStore = await cookies();
    cookieStore.set('spartan_user_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return {
      success: true,
      user: {
        name: user.name,
        email: user.email,
        contact: user.contact || '',
        address: user.address || '',
        cart: user.cart || [],
        wishlist: user.wishlist || []
      }
    };
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed. Please try again later.' };
  }
}

// Action: Logout User
export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('spartan_user_session');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Failed to sign out' };
  }
}

// Action: Get Current User
export async function getCurrentUser() {
  try {
    const email = await verifyUserSession();
    if (!email) {
      return { success: true, user: null };
    }

    const db = await getDb();
    const usersCol = db.collection('users');
    const user = await usersCol.findOne({ email });

    if (!user) {
      // Cookie exists but user was deleted
      return { success: true, user: null };
    }

    return {
      success: true,
      user: {
        name: user.name,
        email: user.email,
        contact: user.contact || '',
        address: user.address || '',
        cart: user.cart || [],
        wishlist: user.wishlist || []
      }
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return { success: false, user: null };
  }
}

// Action: Sync Cart and Wishlist
export async function syncCartAndWishlist(cart: any[], wishlist: string[]) {
  try {
    const email = await verifyUserSession();
    if (!email) {
      return { success: false, error: 'Not authenticated' };
    }

    const db = await getDb();
    const usersCol = db.collection('users');

    await usersCol.updateOne(
      { email },
      { $set: { cart, wishlist } }
    );

    return { success: true };
  } catch (error) {
    console.error('Sync error:', error);
    return { success: false, error: 'Sync failed' };
  }
}

// Action: Request Password Reset
export async function requestPasswordReset(email: string) {
  try {
    if (!email) {
      return { success: false, error: 'Email is required' };
    }

    const normalizedEmail = email.toLowerCase().trim();
    const db = await getDb();
    const usersCol = db.collection('users');

    // Check if user exists
    const user = await usersCol.findOne({ email: normalizedEmail });
    if (!user) {
      // Return success even if user not found for email enumeration security
      return { success: true, message: 'If this email is registered, a password reset link has been sent.' };
    }

    // Generate random reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // Save in password_resets collection
    const resetsCol = db.collection('password_resets');
    await resetsCol.updateOne(
      { email: normalizedEmail },
      { $set: { token, expiresAt } },
      { upsert: true }
    );

    // Send email
    await sendPasswordResetEmail(normalizedEmail, token);

    return { success: true, message: 'If this email is registered, a password reset link has been sent.' };
  } catch (error) {
    console.error('Request password reset error:', error);
    return { success: false, error: 'Failed to process request. Please try again later.' };
  }
}

// Action: Reset Password with Token
export async function resetPasswordWithToken(token: string, newPassword: string) {
  try {
    if (!token || !newPassword) {
      return { success: false, error: 'Token and new password are required' };
    }

    const db = await getDb();
    const resetsCol = db.collection('password_resets');

    // Validate token
    const resetRecord = await resetsCol.findOne({ token });
    if (!resetRecord) {
      return { success: false, error: 'Invalid or expired recovery token' };
    }

    if (new Date() > resetRecord.expiresAt) {
      await resetsCol.deleteOne({ token });
      return { success: false, error: 'The recovery token has expired. Please request a new one.' };
    }

    const usersCol = db.collection('users');
    const salt = generateSalt();
    const passwordHash = hashPassword(newPassword, salt);

    // Update user's password
    const result = await usersCol.updateOne(
      { email: resetRecord.email },
      { $set: { passwordHash, salt } }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'User associated with this token could not be found' };
    }

    // Delete the token
    await resetsCol.deleteOne({ token });

    return { success: true, message: 'Password has been successfully updated.' };
  } catch (error) {
    console.error('Reset password error:', error);
    return { success: false, error: 'Failed to reset password. Please try again later.' };
  }
}

// =========================================================================
// ADMIN ONLY OPERATIONS (Validated via spartan_admin_session)
// =========================================================================

// Validate admin session cookie locally
async function verifyAdminSession(): Promise<string | null> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;

  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('spartan_admin_session')?.value;
    if (!session) return null;

    const [base64Payload, signature] = session.split('.');
    if (!base64Payload || !signature) return null;

    const payloadStr = Buffer.from(base64Payload, 'base64').toString('utf8');
    const expectedSignature = crypto.createHmac('sha256', secret).update(payloadStr).digest('hex');

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(payloadStr);
    if (payload.expiry < Date.now()) {
      return null; // Expired
    }

    return payload.email;
  } catch (e) {
    return null;
  }
}

// Fetch all registered customers
export async function adminFetchUsers() {
  try {
    const adminEmail = await verifyAdminSession();
    if (!adminEmail) {
      return { success: false, error: 'Unauthorized. Admin session required.' };
    }

    const db = await getDb();
    const usersCol = db.collection('users');
    
    // Fetch all users sorted by createdAt descending
    const users = await usersCol.find({}).sort({ createdAt: -1 }).toArray();

    // Map _id to string and omit password hash/salt for security
    const mappedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name || '',
      email: user.email || '',
      contact: user.contact || '',
      address: user.address || '',
      cart: user.cart || [],
      wishlist: user.wishlist || [],
      createdAt: user.createdAt ? user.createdAt.toISOString() : null
    }));

    return { success: true, users: mappedUsers };
  } catch (error: any) {
    console.error('Admin fetch users error:', error);
    return { success: false, error: error.message || 'Failed to fetch users' };
  }
}

// Override customer password directly
export async function adminResetPassword(email: string, newPassword: string) {
  try {
    if (!email || !newPassword) {
      return { success: false, error: 'Email and new password are required' };
    }

    const adminEmail = await verifyAdminSession();
    if (!adminEmail) {
      return { success: false, error: 'Unauthorized. Admin session required.' };
    }

    const normalizedEmail = email.toLowerCase().trim();
    const db = await getDb();
    const usersCol = db.collection('users');

    const salt = generateSalt();
    const passwordHash = hashPassword(newPassword, salt);

    const result = await usersCol.updateOne(
      { email: normalizedEmail },
      { $set: { passwordHash, salt } }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'Customer account could not be found' };
    }

    return { success: true, message: `Password for ${email} has been successfully overridden.` };
  } catch (error: any) {
    console.error('Admin reset password error:', error);
    return { success: false, error: error.message || 'Failed to reset password' };
  }
}

// Fetch active password reset requests
export async function adminFetchPasswordResets() {
  try {
    const adminEmail = await verifyAdminSession();
    if (!adminEmail) {
      return { success: false, error: 'Unauthorized. Admin session required.' };
    }

    const db = await getDb();
    const resetsCol = db.collection('password_resets');

    const requests = await resetsCol.find({}).sort({ expiresAt: -1 }).toArray();
    
    const mappedRequests = requests.map(req => ({
      id: req._id.toString(),
      email: req.email || '',
      token: req.token || '',
      expiresAt: req.expiresAt ? req.expiresAt.toISOString() : null,
      createdAt: req.expiresAt ? new Date(req.expiresAt.getTime() - 60 * 60 * 1000).toISOString() : null
    }));

    return { success: true, requests: mappedRequests };
  } catch (error: any) {
    console.error('Admin fetch resets error:', error);
    return { success: false, error: error.message || 'Failed to fetch password reset requests' };
  }
}

// Delete an active password reset request
export async function adminDeletePasswordResetRequest(token: string) {
  try {
    if (!token) {
      return { success: false, error: 'Token is required' };
    }

    const adminEmail = await verifyAdminSession();
    if (!adminEmail) {
      return { success: false, error: 'Unauthorized. Admin session required.' };
    }

    const db = await getDb();
    const resetsCol = db.collection('password_resets');

    const result = await resetsCol.deleteOne({ token });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Reset request not found' };
    }

    return { success: true, message: 'Password reset request has been deleted.' };
  } catch (error: any) {
    console.error('Admin delete reset request error:', error);
    return { success: false, error: error.message || 'Failed to delete request' };
  }
}

// 1. PLACE ORDER ACTION
export async function placeOrder(orderData: {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes?: string;
  paymentMethod: 'cod' | 'card';
  items: {
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
}) {
  try {
    const db = await getDb();
    const email = await verifyUserSession();
    
    let userId = null;
    if (email) {
      const user = await db.collection('users').findOne({ email });
      if (user) {
        userId = user._id.toString();
      }
    }

    // Generate unique order ID
    const orderId = `SPN-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = {
      orderId,
      email: orderData.email.toLowerCase().trim(),
      userId,
      fullName: orderData.fullName.trim(),
      phone: orderData.phone.trim(),
      address: orderData.address.trim(),
      city: orderData.city.trim(),
      notes: (orderData.notes || '').trim(),
      paymentMethod: orderData.paymentMethod,
      items: orderData.items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: Number(item.price),
        image: item.image,
        quantity: Number(item.quantity)
      })),
      subtotal: Number(orderData.subtotal),
      shipping: Number(orderData.shipping),
      total: Number(orderData.total),
      status: 'pending', // pending, shipped, completed, cancelled
      createdAt: new Date()
    };

    await db.collection('orders').insertOne(newOrder);

    // Clear user DB cart on successful order
    if (email) {
      await db.collection('users').updateOne(
        { email },
        { $set: { cart: [] } }
      );
    }

    return { success: true, orderId };
  } catch (error: any) {
    console.error('Place order error:', error);
    return { success: false, error: 'Failed to place order. Please try again.' };
  }
}

// 2. FETCH USER ORDERS AND REVIEWS
export async function fetchUserOrdersAndReviews() {
  try {
    const email = await verifyUserSession();
    if (!email) {
      return { success: false, error: 'Not authenticated' };
    }

    const db = await getDb();
    const ordersCol = db.collection('orders');
    const reviewsCol = db.collection('reviews');

    const orders = await ordersCol.find({ email }).sort({ createdAt: -1 }).toArray();
    const reviews = await reviewsCol.find({ userEmail: email }).toArray();

    return {
      success: true,
      orders: orders.map(o => ({
        id: o._id.toString(),
        orderId: o.orderId,
        email: o.email,
        fullName: o.fullName,
        phone: o.phone,
        address: o.address,
        city: o.city,
        notes: o.notes,
        paymentMethod: o.paymentMethod,
        items: o.items,
        subtotal: o.subtotal,
        shipping: o.shipping,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt ? o.createdAt.toISOString() : null
      })),
      reviews: reviews.map(r => ({
        id: r._id.toString(),
        orderId: r.orderId,
        productId: r.productId,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt ? r.createdAt.toISOString() : null
      }))
    };
  } catch (error: any) {
    console.error('Fetch user orders error:', error);
    return { success: false, error: 'Failed to retrieve order history' };
  }
}

// 3. SUBMIT PRODUCT REVIEW (VERIFIED PURCHASERS ONLY)
export async function submitProductReview(reviewData: {
  orderId: string;
  productId: string;
  rating: number;
  comment: string;
}) {
  try {
    const email = await verifyUserSession();
    if (!email) {
      return { success: false, error: 'Not authenticated. Session expired.' };
    }

    const db = await getDb();
    const usersCol = db.collection('users');
    const user = await usersCol.findOne({ email });
    if (!user) {
      return { success: false, error: 'User profile not found.' };
    }

    // Verify order is completed and belongs to this user
    const order = await db.collection('orders').findOne({
      orderId: reviewData.orderId,
      email: email,
      status: 'completed'
    });

    if (!order) {
      return { success: false, error: 'Product reviews are restricted to completed verified purchases.' };
    }

    const productInOrder = order.items.some((item: any) => item.productId === reviewData.productId);
    if (!productInOrder) {
      return { success: false, error: 'This product was not found in your order.' };
    }

    // Check if user has already reviewed this product for this order
    const existingReview = await db.collection('reviews').findOne({
      orderId: reviewData.orderId,
      productId: reviewData.productId,
      userEmail: email
    });

    if (existingReview) {
      return { success: false, error: 'You have already submitted a review for this product.' };
    }

    // Insert the new review
    const newReview = {
      orderId: reviewData.orderId,
      productId: reviewData.productId,
      userEmail: email,
      userName: user.name || 'Spartan Customer',
      rating: Number(reviewData.rating),
      comment: reviewData.comment.trim(),
      createdAt: new Date()
    };

    await db.collection('reviews').insertOne(newReview);

    // Recalculate average rating and review count
    const allReviews = await db.collection('reviews').find({ productId: reviewData.productId }).toArray();
    const reviewsCount = allReviews.length;
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount;

    const productQuery = ObjectId.isValid(reviewData.productId) 
      ? { $or: [{ _id: new ObjectId(reviewData.productId) }, { id: reviewData.productId }] }
      : { id: reviewData.productId };

    await db.collection('products').updateOne(
      productQuery,
      {
        $set: {
          rating: Number(avgRating.toFixed(1)),
          reviewsCount: reviewsCount
        }
      }
    );

    return { success: true, message: 'Your review has been successfully submitted.' };
  } catch (error: any) {
    console.error('Submit review error:', error);
    return { success: false, error: 'Failed to submit review. Please try again.' };
  }
}

// 4. ADMIN: FETCH ALL ORDERS
export async function adminFetchOrders() {
  try {
    const adminEmail = await verifyAdminSession();
    if (!adminEmail) {
      return { success: false, error: 'Unauthorized. Admin session required.' };
    }

    const db = await getDb();
    const orders = await db.collection('orders').find({}).sort({ createdAt: -1 }).toArray();

    return {
      success: true,
      orders: orders.map(o => ({
        id: o._id.toString(),
        orderId: o.orderId,
        email: o.email,
        fullName: o.fullName,
        phone: o.phone,
        address: o.address,
        city: o.city,
        notes: o.notes,
        paymentMethod: o.paymentMethod,
        items: o.items,
        subtotal: o.subtotal,
        shipping: o.shipping,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt ? o.createdAt.toISOString() : null
      }))
    };
  } catch (error: any) {
    console.error('Admin fetch orders error:', error);
    return { success: false, error: 'Failed to fetch orders' };
  }
}

// 5. ADMIN: UPDATE ORDER STATUS
export async function adminUpdateOrderStatus(orderId: string, status: string) {
  try {
    if (!orderId || !status) {
      return { success: false, error: 'Order ID and status are required' };
    }

    const adminEmail = await verifyAdminSession();
    if (!adminEmail) {
      return { success: false, error: 'Unauthorized. Admin session required.' };
    }

    const db = await getDb();
    const result = await db.collection('orders').updateOne(
      { orderId },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'Order not found' };
    }

    return { success: true, message: `Order ${orderId} status updated to ${status}.` };
  } catch (error: any) {
    console.error('Admin update order status error:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}

