import { NextResponse } from 'next/server';

// Helper to extract email and socials with timeout
async function extractContactInfo(url: string): Promise<{ email?: string, socials?: any }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout per site

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) return {};
    const text = await response.text();
    const result: { email?: string, socials: any } = { socials: {} };

    // --- Email Extraction ---
    // 1. Look for mailto links (Highest confidence)
    const mailtoMatch = text.match(/href=["']mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})["']/i);
    if (mailtoMatch && mailtoMatch[1]) {
      result.email = mailtoMatch[1];
    } else {
      // 2. Look for raw emails in text
      const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
      const matches = text.match(emailRegex);
      if (matches) {
        const validEmails = matches.filter(e => {
          const lower = e.toLowerCase();
          // Exclude common file extensions that might look like emails
          if (lower.match(/\.(png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2)$/)) return false;
          // Exclude specific junk
          if (lower.includes('sentry') || lower.includes('example') || lower.includes('domain')) return false;
          return true;
        });
        if (validEmails.length > 0) result.email = validEmails[0];
      }
    }

    // --- Social Media Extraction ---
    // Helper to extract specific social links
    const extractLink = (patterns: string[]) => {
      for (const domain of patterns) {
        // Regex to capture full URL starting with http/https containing the domain
        const regex = new RegExp(`href=["']((?:https?:\\/\\/)?(?:www\\.)?${domain}[^"']*)["']`, 'i');
        const match = text.match(regex);
        if (match && match[1]) return match[1];
      }
      return undefined;
    };

    const fb = extractLink(['facebook\\.com']);
    if (fb) result.socials.facebook = fb;

    const insta = extractLink(['instagram\\.com']);
    if (insta) result.socials.instagram = insta;

    const tw = extractLink(['twitter\\.com', 'x\\.com']);
    if (tw) result.socials.twitter = tw;

    const li = extractLink(['linkedin\\.com']);
    if (li) result.socials.linkedin = li;

    return result;

  } catch (e) {
    return { socials: {} }; // Fail silently
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
      // Select items that have a website (to check for missing email OR socials)
      const tasks = data.local_results.map(async (item: any) => {
        if (item.website) {
          const info = await extractContactInfo(item.website);

          if (info.email && !item.email) {
            item.email = info.email; // Inject found email
          }

          if (info.socials && Object.keys(info.socials).length > 0) {
            item.extracted_socials = info.socials; // Inject found socials
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