import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 font-sans text-black dark:bg-black dark:text-zinc-50">
            <div className="text-center">
                <p className="text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                    404 Error
                </p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                    Page not found
                </h1>
                <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
                    Sorry, we couldn't find the page you're looking for.
                </p>
                <div className="mt-8 flex justify-center">
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
                    >
                        <Home className="h-4 w-4" />
                        Go back home
                    </Link>
                </div>
            </div>
        </div>
    );
}
