import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for server-side auth
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Rate limiting storage - in production, use Redis or a database
const rateLimitStore = new Map<string, { count: number; resetTime: number; hourlyCount: number; hourlyResetTime: number }>();

// Rate limiting configuration for cart operations (more restrictive due to puppeteer resource usage)
const RATE_LIMIT_PER_MINUTE = 2; // 2 requests per minute
const RATE_LIMIT_PER_HOUR = 8;   // 8 requests per hour
const MINUTE_IN_MS = 60 * 1000;
const HOUR_IN_MS = 60 * 60 * 1000;

// Get user ID from authorization header
async function getUserId(request: NextRequest): Promise<string | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }
    
    return user.id;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
}

function getRateLimitKey(userId: string): string {
  return `user_cart_rate_limit:${userId}`;
}

function checkRateLimit(key: string): { allowed: boolean; message?: string; resetTime?: number } {
  const now = Date.now();
  const data = rateLimitStore.get(key) || { 
    count: 0, 
    resetTime: now + MINUTE_IN_MS,
    hourlyCount: 0,
    hourlyResetTime: now + HOUR_IN_MS
  };
  
  // Reset minute counter if time window expired
  if (now > data.resetTime) {
    data.count = 0;
    data.resetTime = now + MINUTE_IN_MS;
  }
  
  // Reset hourly counter if time window expired
  if (now > data.hourlyResetTime) {
    data.hourlyCount = 0;
    data.hourlyResetTime = now + HOUR_IN_MS;
  }
  
  // Check minute limit
  if (data.count >= RATE_LIMIT_PER_MINUTE) {
    return {
      allowed: false,
      message: `You've reached your cart request limit. Maximum ${RATE_LIMIT_PER_MINUTE} cart additions per minute allowed per user. Try again in ${Math.ceil((data.resetTime - now) / 1000)} seconds.`,
      resetTime: data.resetTime
    };
  }
  
  // Check hourly limit
  if (data.hourlyCount >= RATE_LIMIT_PER_HOUR) {
    return {
      allowed: false,
      message: `Hourly cart request limit exceeded. Maximum ${RATE_LIMIT_PER_HOUR} cart additions per hour allowed per user. Try again in ${Math.ceil((data.hourlyResetTime - now) / (1000 * 60))} minutes.`,
      resetTime: data.hourlyResetTime
    };
  }
  
  // Increment counters
  data.count++;
  data.hourlyCount++;
  rateLimitStore.set(key, data);
  
  return { allowed: true };
}

// Clean up old entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.hourlyResetTime) {
      rateLimitStore.delete(key);
    }
  }
}, HOUR_IN_MS); // Clean up every hour

export async function POST(request: NextRequest) {
  try {
    // Authentication check - get user ID
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { 
          success: false,
          error: "Authentication required. Please log in to add items to cart.",
          type: "AUTHENTICATION_REQUIRED"
        },
        { status: 401 }
      );
    }

    // Rate limiting check (per user)
    const rateLimitKey = getRateLimitKey(userId);
    const rateLimitResult = checkRateLimit(rateLimitKey);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false,
          error: rateLimitResult.message,
          type: "RATE_LIMIT_EXCEEDED"
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.resetTime ? Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString() : '60'
          }
        }
      );
    }

    const { groceries } = await request.json();

    const browser = await puppeteer.launch({
      headless: false, // Show browser for debugging
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    for (const item of groceries) {
      try {
        await page.goto(`https://www.nofrills.ca/search?search-bar=${encodeURIComponent(item.name)}`, { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(res => setTimeout(res, 2000)); // Wait for SPA to settle
        await page.waitForSelector('[data-testid="atc-button"]', { visible: true, timeout: 10000 });
        const buttons = await page.$$('[data-testid="atc-button"]');
        console.log('Found', buttons.length, 'add-to-cart buttons for', item.name);
        if (buttons.length > 0) {
          await buttons[0].click();
          console.log('Clicked the first add-to-cart button for', item.name);
          await new Promise(res => setTimeout(res, 1000)); // Wait for cart update
        }
      } catch (e) {
        console.log('Error for item', item.name, e);
        continue;
      }
    }

    await browser.close();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('No Frills Puppeteer error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
} 