import { NextResponse } from 'next/server';

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

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data from provider' }, { status: 500 });
  }
}