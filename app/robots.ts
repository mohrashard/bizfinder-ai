import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://thebizfinderai.vercel.app';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/'], // Hide API routes and internal paths
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
