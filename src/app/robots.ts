import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rent-mvp2.vercel.app/';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api', '/auth', '/bills', '/dashboard', '/rent', '/tenants', '/upload',],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
