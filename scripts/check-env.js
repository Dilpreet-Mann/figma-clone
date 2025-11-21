#!/usr/bin/env node

/**
 * Script to check if all required environment variables are set
 * Run with: node scripts/check-env.js
 */

const requiredVars = {
  DATABASE_URL: {
    required: true,
    description: "PostgreSQL database connection string",
    example: "postgresql://user:password@host:port/database",
  },
  AUTH_SECRET: {
    required: process.env.NODE_ENV === "production",
    description: "NextAuth.js secret for session encryption",
    example: "Generate with: openssl rand -base64 32",
  },
  LIVEBLOCKS_PUBLIC_KEY: {
    required: true,
    description: "Liveblocks public key",
    example: "pk_live_...",
  },
  LIVEBLOCKS_SECRET_KEY: {
    required: true,
    description: "Liveblocks secret key",
    example: "sk_live_...",
  },
};

console.log("🔍 Checking environment variables...\n");

const missing = [];
const invalid = [];

for (const [key, config] of Object.entries(requiredVars)) {
  const value = process.env[key];
  
  if (config.required) {
    if (!value || value.trim() === "") {
      missing.push({ key, ...config });
    } else if (key === "DATABASE_URL" && !value.startsWith("postgresql://")) {
      invalid.push({ key, ...config, reason: "Must start with 'postgresql://'" });
    }
  }
}

if (missing.length === 0 && invalid.length === 0) {
  console.log("✅ All required environment variables are set!\n");
  process.exit(0);
}

if (missing.length > 0) {
  console.log("❌ Missing required environment variables:\n");
  missing.forEach(({ key, description, example }) => {
    console.log(`   ${key}`);
    console.log(`   Description: ${description}`);
    if (example) console.log(`   Example: ${example}`);
    console.log("");
  });
}

if (invalid.length > 0) {
  console.log("⚠️  Invalid environment variables:\n");
  invalid.forEach(({ key, reason }) => {
    console.log(`   ${key}: ${reason}\n`);
  });
}

console.log("📖 To fix:");
console.log("   1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables");
console.log("   2. Add each missing variable");
console.log("   3. Select 'Production', 'Preview', and 'Development' environments");
console.log("   4. Save and redeploy\n");

process.exit(1);

