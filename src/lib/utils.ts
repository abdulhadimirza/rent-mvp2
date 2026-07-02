import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatRupees(amount: number | string): string {
    const value = typeof amount === 'number' ? amount : Number(amount);
    if (isNaN(value)) return 'Rs. 0';
    return `Rs. ${Math.round(value).toLocaleString()}`;
}

