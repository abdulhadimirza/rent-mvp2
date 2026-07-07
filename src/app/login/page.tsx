import { login, signup } from './actions';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default async function LoginPage(props: {
    searchParams: Promise<{ message?: string; mode?: string }>;
}) {
    const searchParams = await props.searchParams;
    const isSignup = searchParams.mode === 'signup';
    const message = searchParams.message;

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans">
            {/* Left side - Branding/Image */}
            <div className="hidden md:flex flex-col justify-center w-1/2 bg-blue-600 p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-800 opacity-90 z-0"></div>
                <div className="relative z-10 max-w-lg mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-md">
                            <Home className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Rent MVP</h1>
                    </div>
                    <h2 className="text-4xl font-extrabold mb-6 leading-tight text-white">
                        Modern Property Management
                    </h2>
                    <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                        Streamline your rent collection, tenant tracking, and utility bills all in one professional dashboard.
                    </p>
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-500/40 flex items-center justify-center text-sm font-bold border border-blue-400/30">✓</div>
                            <span className="font-medium">Automated Rent Tracking</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-500/40 flex items-center justify-center text-sm font-bold border border-blue-400/30">✓</div>
                            <span className="font-medium">Utility Bill Management</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-500/40 flex items-center justify-center text-sm font-bold border border-blue-400/30">✓</div>
                            <span className="font-medium">Tenant Portfolio Insights</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Auth Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center md:text-left mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {isSignup ? 'Create an account' : 'Welcome back'}
                        </h2>
                        <p className="mt-3 text-base text-slate-600">
                            {isSignup ? 'Sign up to start managing your properties.' : 'Please enter your details to sign in.'}
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" action={isSignup ? signup : login}>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email-address" className="block text-sm font-medium text-slate-700 mb-2">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm bg-slate-50 hover:bg-white"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete={isSignup ? "new-password" : "current-password"}
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm bg-slate-50 hover:bg-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {message && (
                            <div
                                className={`p-4 text-sm rounded-lg border ${message.includes('verify') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                            >
                                {message}
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
                            >
                                {isSignup ? 'Create Account' : 'Sign In'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-600">
                        {isSignup ? (
                            <p>
                                Already have an account?{' '}
                                <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors ml-1">
                                    Sign in
                                </Link>
                            </p>
                        ) : (
                            <p>
                                Don&apos;t have an account?{' '}
                                <Link href="/login?mode=signup" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors ml-1">
                                    Sign up
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
