import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://rent-mvp2.vercel.app/'),
    title: {
        default: 'Rent MVP',
        template: '%s | Rent MVP',
    },
    description: 'Automate rent reminders and track payments.',
    keywords: ['rent', 'properties', 'real estate', 'apartments', 'homes'],
    authors: [{ name: 'Abdul Hadi Mirza' }],
    creator: 'Abdul Hadi Mirza',
    publisher: 'Abdul Hadi Mirza',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: 'Rent MVP',
        description: 'Automate rent reminders and track payments.',
        url: 'https://rent-mvp2.vercel.app/',
        siteName: 'Rent MVP',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Rent MVP',
        description: 'Automate rent reminders and track payments.',
        creator: '@rentmvp',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
