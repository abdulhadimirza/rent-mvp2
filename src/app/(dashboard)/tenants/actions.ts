'use server';

import { createClient } from '@/lib/server';
import { revalidatePath } from 'next/cache';

export async function addProperty(formData: FormData) {
    const supabase = await createClient();

    const { data: claimsData, error: authError } =
        await supabase.auth.getClaims();
    if (authError || !claimsData?.claims) return { error: 'Not authenticated' };
    const userId = claimsData.claims.sub;

    const name = formData.get('name') as string;
    const address = formData.get('address') as string;

    const { data: propertyData, error } = await supabase
        .from('properties')
        .insert({
            name,
            address,
            landlord_id: userId,
        })
        .select('id')
        .single();

    if (error) {
        console.error('Error adding property:', error);
        return { error: error.message };
    }

    const electricityCustomerNumber = formData.get('electricity_customer_number') as string;
    const gasCustomerNumber = formData.get('gas_customer_number') as string;
    const waterCustomerNumber = formData.get('water_customer_number') as string;

    const customerNumbers = [];
    const digitRegex = /^[0-9]+$/;

    if (electricityCustomerNumber && electricityCustomerNumber.trim()) {
        const val = electricityCustomerNumber.trim();
        if (!digitRegex.test(val)) {
            return { error: 'Electricity customer number must contain only digits.' };
        }
        customerNumbers.push({
            landlord_id: userId,
            property_id: propertyData.id,
            bill_type: 'Electricity',
            customer_number: val,
        });
    }
    if (gasCustomerNumber && gasCustomerNumber.trim()) {
        const val = gasCustomerNumber.trim();
        if (!digitRegex.test(val)) {
            return { error: 'Gas customer number must contain only digits.' };
        }
        customerNumbers.push({
            landlord_id: userId,
            property_id: propertyData.id,
            bill_type: 'Gas',
            customer_number: val,
        });
    }
    if (waterCustomerNumber && waterCustomerNumber.trim()) {
        const val = waterCustomerNumber.trim();
        if (!digitRegex.test(val)) {
            return { error: 'Water customer number must contain only digits.' };
        }
        customerNumbers.push({
            landlord_id: userId,
            property_id: propertyData.id,
            bill_type: 'Water',
            customer_number: val,
        });
    }

    if (customerNumbers.length > 0) {
        const { error: customerNumbersError } = await supabase
            .from('property_customer_numbers')
            .insert(customerNumbers);

        if (customerNumbersError) {
            console.error('Error adding customer numbers:', customerNumbersError);
            return { error: customerNumbersError.message };
        }
    }

    revalidatePath('/tenants');
    return { success: true };
}

export async function addTenant(formData: FormData) {
    const supabase = await createClient();

    const { data: claimsData, error: authError } =
        await supabase.auth.getClaims();
    if (authError || !claimsData?.claims) return { error: 'Not authenticated' };

    const name = formData.get('name') as string;
    const phone_number = formData.get('phone_number') as string;
    const property_id = formData.get('property_id') as string;
    const rent_amount = Number(formData.get('rent_amount'));
    const due_date_day = Number(formData.get('due_date_day'));

    const { error } = await supabase.from('tenants').insert({
        name,
        phone_number,
        property_id,
        rent_amount,
        due_date_day,
    });

    if (error) {
        console.error('Error adding tenant:', error);
        return { error: error.message };
    }

    revalidatePath('/tenants');
    return { success: true };
}
