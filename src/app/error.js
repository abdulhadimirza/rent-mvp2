'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home } from 'lucide-react';

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 font-sans text-black dark:bg-black dark:text-zinc-50">
            <div className="text-center">
                <p className="text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                    500 Error
                </p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                    Something went wrong
                </h1>
                <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
                    An unexpected server or application error occurred.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <button
                        onClick={() => reset()}
                        className="flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200 cursor-pointer"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-900"
                    >
                        <Home className="h-4 w-4" />
                        Go back home
                    </Link>
                </div>
            </div>
        </div>
    );
}
