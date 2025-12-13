import { NextResponse } from 'next/server';

// Helper to extract email with timeout
async function extractEmail(url: string): Promise<string | undefined> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout per site

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) return undefined;
    const text = await response.text();

    // 1. Look for mailto links (Highest confidence)
    const mailtoMatch = text.match(/href=["']mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})["']/i);
    if (mailtoMatch && mailtoMatch[1]) return mailtoMatch[1];

    // 2. Look for raw emails in text
    // Filter to avoid false positives (like image filenames being mistaken for emails)
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const matches = text.match(emailRegex);

    if (matches) {
      // detailed filter for obviously bad matches
      const validEmails = matches.filter(e => {
        const lower = e.toLowerCase();
        // Exclude common file extensions that might look like emails
        if (lower.match(/\.(png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2)$/)) return false;
        // Exclude specific junk
        if (lower.includes('sentry') || lower.includes('example') || lower.includes('domain')) return false;
        return true;
      });
      if (validEmails.length > 0) return validEmails[0];
    }
    return undefined;
  } catch (e) {
    return undefined; // Fail silently
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const type = searchParams.get('type') || 'search';
  const start = searchParams.get('start') || '0';

  // 1. Try to get the key from the User (passed from frontend header)
  const userKey = request.headers.get('x-serp-key');

  // 2. Fallback to Server Environment Variable (if you want to pay for usage)
  const finalKey = userKey || process.env.SERP_API_KEY;

  if (!q) return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  if (!finalKey) return NextResponse.json({ error: 'No API Key provided. Please add a key in Settings.' }, { status: 401 });

  // 3. Call SerpAPI from the Server (No CORS issues here)
  const url = `https://serpapi.com/search?engine=google_maps&q=${encodeURIComponent(q)}&api_key=${finalKey}&type=${type}&start=${start}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    // 4. Enrich results with emails (Parallel Fetching)
    if (data.local_results && Array.isArray(data.local_results)) {
      // Select only items that have a website but NO email
      const tasks = data.local_results.map(async (item: any) => {
        if (!item.email && item.website) {
          const fetchedEmail = await extractEmail(item.website);
          if (fetchedEmail) {
            item.email = fetchedEmail; // Inject found email
          }
        }
        return item; // Return enriched item
      });

      // Wait for all enrichments to complete (or fail/timeout)
      await Promise.all(tasks);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch data from provider' }, { status: 500 });
  }
}