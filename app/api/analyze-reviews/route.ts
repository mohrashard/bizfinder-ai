import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    let data_id = searchParams.get('data_id') || '';
    const place_id = searchParams.get('place_id') || '';
    const q = searchParams.get('q') || '';

    const serpKey = request.headers.get('x-serp-key') || process.env.SERP_API_KEY;

    if (!data_id && !place_id && !q) {
        return NextResponse.json({ error: 'Missing data_id, place_id, or search query.' }, { status: 400 });
    }

    if (!serpKey) {
        return NextResponse.json({ error: 'No SerpAPI Key provided. Configure it in Finder Settings.' }, { status: 401 });
    }

    try {
        // -----------------------------------------------------------
        // Step 0: If we don't have data_id or place_id, find it first
        // -----------------------------------------------------------
        if (!data_id && !place_id && q) {
            console.log("[analyze-reviews] No data_id/place_id, searching Google Maps for:", q);
            const findUrl = `https://serpapi.com/search?engine=google_maps&q=${encodeURIComponent(q)}&api_key=${serpKey}`;
            const findRes = await fetch(findUrl);
            const findData = await findRes.json();

            if (findData.error) {
                console.error("[analyze-reviews] Maps search error:", findData.error);
                return NextResponse.json({ error: `Maps search failed: ${findData.error}` }, { status: 400 });
            }

            const firstResult = findData.local_results?.[0] || findData.place_results;
            if (firstResult) {
                data_id = firstResult.data_id || '';
                console.log("[analyze-reviews] Found data_id:", data_id);
            }

            if (!data_id) {
                return NextResponse.json({
                    error: "Could not find this business on Google Maps. Try a more specific search."
                }, { status: 404 });
            }
        }

        // -----------------------------------------------------------
        // Step 1: Fetch Reviews from SerpApi
        // -----------------------------------------------------------
        const reviewParams = new URLSearchParams({
            engine: 'google_maps_reviews',
            api_key: serpKey,
            sort_by: 'newestFirst',
        });

        if (data_id) {
            reviewParams.set('data_id', data_id);
        } else if (place_id) {
            reviewParams.set('place_id', place_id);
        }

        const serpUrl = `https://serpapi.com/search?${reviewParams.toString()}`;
        console.log("[analyze-reviews] Fetching reviews...");

        const serpRes = await fetch(serpUrl);
        const serpData = await serpRes.json();

        if (serpData.error) {
            console.error("[analyze-reviews] SerpApi reviews error:", serpData.error);
            return NextResponse.json({ error: `SerpApi: ${serpData.error}` }, { status: 400 });
        }

        const reviews = serpData.reviews || [];
        console.log("[analyze-reviews] Got", reviews.length, "reviews");

        if (reviews.length === 0) {
            return NextResponse.json({ reviews: [], reviews_count: 0 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const reviewTexts: string[] = reviews.slice(0, 20).map((r: any) => {
            return r.snippet || r.text || r.extract || '';
        }).filter((t: string) => t.length > 10);

        return NextResponse.json({
            reviews: reviewTexts,
            reviews_count: reviews.length,
        });

    } catch (error: any) {
        console.error("[analyze-reviews] Unhandled error:", error?.message || error);
        return NextResponse.json({ error: `Server error: ${error?.message || 'Failed to fetch reviews'}` }, { status: 500 });
    }
}
