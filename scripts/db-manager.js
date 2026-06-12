const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { MongoClient, ObjectId } = require('mongodb');

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      // Remove surrounding quotes if present
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Error: MONGODB_URI is not set in .env.local");
  process.exit(1);
}

// PBKDF2 Password Hashing matching src/app/admin/actions.ts
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

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

// Helper to safely deserialize ObjectId and Date from JSON
function deserializeDocument(doc) {
  if (!doc || typeof doc !== 'object') return doc;
  
  if (Array.isArray(doc)) {
    return doc.map(deserializeDocument);
  }
  
  const newDoc = {};
  for (const [key, value] of Object.entries(doc)) {
    if (key === '_id' && typeof value === 'string' && value.length === 24) {
      newDoc[key] = new ObjectId(value);
    } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        newDoc[key] = parsedDate;
      } else {
        newDoc[key] = value;
      }
    } else if (typeof value === 'object') {
      newDoc[key] = deserializeDocument(value);
    } else {
      newDoc[key] = value;
    }
  }
  return newDoc;
}

// 1. BACKUP DATABASE
async function backup() {
  console.log("Connecting to database for backup...");
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    
    // We backup all core application data collections
    const collections = ['products', 'categories', 'users', 'orders', 'reviews', 'admins'];
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups', `backup-${timestamp}`);
    fs.mkdirSync(backupDir, { recursive: true });
    
    console.log(`\nCreating database backup inside: ${backupDir}\n`);
    
    for (const colName of collections) {
      const data = await db.collection(colName).find({}).toArray();
      const filePath = path.join(backupDir, `${colName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`[BACKUP] Collection: ${colName} -> Saved ${data.length} documents.`);
    }
    
    console.log(`\nSuccess: Database backup completed! Folder name is "backup-${timestamp}"`);
  } catch (err) {
    console.error("Backup process failed:", err);
  } finally {
    await client.close();
  }
}

// 2. RESTORE DATABASE (SAFE MERGE / UPSERT)
async function restore(backupDirName) {
  if (!backupDirName) {
    console.error("Error: Please specify the backup directory folder name.");
    console.log("\nUsage: node scripts/db-manager.js restore <backup-folder-name>");
    console.log("Example: node scripts/db-manager.js restore backup-2026-06-12T13-16-32\n");
    process.exit(1);
  }
  
  const backupDir = path.join(process.cwd(), 'backups', backupDirName);
  if (!fs.existsSync(backupDir)) {
    console.error(`Error: Backup directory does not exist at: ${backupDir}`);
    process.exit(1);
  }
  
  console.log("Connecting to database for restore...");
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    
    console.log(`\nRestoring & Merging database from: ${backupDir}\n`);
    
    const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      const colName = path.basename(file, '.json');
      const filePath = path.join(backupDir, file);
      const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (!Array.isArray(rawData) || rawData.length === 0) {
        console.log(`[RESTORE] Collection ${colName} -> No documents to restore (empty backup).`);
        continue;
      }
      
      console.log(`[RESTORE] Merging ${rawData.length} documents into '${colName}'...`);
      const col = db.collection(colName);
      
      let writeOperations = 0;
      for (const rawDoc of rawData) {
        const doc = deserializeDocument(rawDoc);
        
        // Decide standard filtering based on collection type
        const filter = {};
        if (doc._id) {
          filter._id = doc._id;
        } else if (doc.id) {
          filter.id = doc.id;
        } else if (doc.email) {
          filter.email = doc.email;
        } else {
          // Fallback to inserting directly
          await col.insertOne(doc);
          writeOperations++;
          continue;
        }
        
        // Merge updates using $set so we do not wipe out other properties, with upsert enabled
        await col.updateOne(filter, { $set: doc }, { upsert: true });
        writeOperations++;
      }
      
      console.log(`[RESTORE] Collection ${colName} -> Merged ${writeOperations} documents successfully.`);
    }
    
    console.log("\nSuccess: Database restore and safe merge completed!");
  } catch (err) {
    console.error("Restore process failed:", err);
  } finally {
    await client.close();
  }
}

// 3. SAFE SEED (NON-DESTRUCTIVE)
async function seed() {
  console.log("Connecting to database for seeding...");
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    
    console.log("\nSeeding default database records safely...\n");
    
    // Seed Categories
    const categoriesCol = db.collection('categories');
    let catInsertCount = 0;
    for (const cat of DEFAULT_CATEGORIES) {
      // Check if category exists by ID
      const existing = await categoriesCol.findOne({ id: cat.id });
      if (!existing) {
        await categoriesCol.insertOne({
          ...cat,
          createdAt: new Date()
        });
        catInsertCount++;
      }
    }
    console.log(`[SEED] Categories: Checked default categories. Inserted ${catInsertCount} missing categories.`);
    
    // Seed Admin
    const adminsCol = db.collection('admins');
    const defaultAdminEmail = 'lasith.jayawardana@spartan.supplements';
    const existingAdmin = await adminsCol.findOne({ email: defaultAdminEmail });
    if (!existingAdmin) {
      const defaultPw = 'LAs+GEa20045';
      const salt = generateSalt();
      const passwordHash = hashPassword(defaultPw, salt);
      
      await adminsCol.insertOne({
        email: defaultAdminEmail,
        passwordHash,
        salt,
        createdAt: new Date()
      });
      console.log(`[SEED] Admins: Seeded default admin account (${defaultAdminEmail}).`);
    } else {
      console.log(`[SEED] Admins: Default admin account already exists.`);
    }
    
    console.log("\nSuccess: Seeding complete! Existing data remains safe and unmodified.");
  } catch (err) {
    console.error("Seeding process failed:", err);
  } finally {
    await client.close();
  }
}

// Command dispatcher
const command = process.argv[2];
const arg = process.argv[3];

if (command === 'backup') {
  backup();
} else if (command === 'restore') {
  restore(arg);
} else if (command === 'seed') {
  seed();
} else {
  console.log("\nSpartan Supplements Database Manager Utility");
  console.log("-------------------------------------------");
  console.log("Usage:");
  console.log("  node scripts/db-manager.js backup           - Create backup files of all collections");
  console.log("  node scripts/db-manager.js restore <folder> - Merge backup data into database securely");
  console.log("  node scripts/db-manager.js seed            - Seed default categories/admin safely (no overwrites)");
  console.log("");
}
