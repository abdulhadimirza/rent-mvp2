'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/server';

const isDev = process.env.NODE_ENV === 'development';

import { headers } from 'next/headers';

export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        if (isDev) {
            console.error(error.message);
        }
        return redirect('/login?message=Could not authenticate user');
    }

    revalidatePath('/', 'layout');
    redirect('/dashboard');
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const origin = (await headers()).get('origin');

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/confirm`,
        },
    });

    if (error) {
        if (isDev) {
            console.error(error.message);
        }
        return redirect('/login?mode=signup&message=Could not sign up user');
    }

    redirect(
        '/login?message=Check your email to verify your account before logging in.',
    );
}
