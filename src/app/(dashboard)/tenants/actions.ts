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

export async function editProperty(formData: FormData) {
    const supabase = await createClient();

    const { data: claimsData, error: authError } = await supabase.auth.getClaims();
    if (authError || !claimsData?.claims) return { error: 'Not authenticated' };
    const userId = claimsData.claims.sub;

    const id = formData.get('id') as string;
    
    const updateData: Record<string, any> = {};
    if (formData.has('name')) {
        updateData.name = formData.get('name') as string;
    }
    if (formData.has('address')) {
        updateData.address = formData.get('address') as string;
    }

    if (Object.keys(updateData).length > 0) {
        const { error } = await supabase
            .from('properties')
            .update(updateData)
            .eq('id', id)
            .eq('landlord_id', userId);

        if (error) {
            console.error('Error editing property:', error);
            return { error: error.message };
        }
    }

    const digitRegex = /^[0-9]+$/;
    
    // Helper to process each bill type
    async function processCustomerNumber(billType: string, formKey: string) {
        if (formData.has(formKey)) {
            const value = formData.get(formKey) as string;
            if (value && value.trim()) {
                const val = value.trim();
                if (!digitRegex.test(val)) {
                    throw new Error(`${billType} customer number must contain only digits.`);
                }
                await supabase.from('property_customer_numbers').upsert({
                    landlord_id: userId,
                    property_id: id,
                    bill_type: billType,
                    customer_number: val,
                }, { onConflict: 'property_id, bill_type' });
            } else {
                await supabase.from('property_customer_numbers')
                    .delete()
                    .eq('property_id', id)
                    .eq('bill_type', billType);
            }
        }
    }

    try {
        await processCustomerNumber('Electricity', 'electricity_customer_number');
        await processCustomerNumber('Gas', 'gas_customer_number');
        await processCustomerNumber('Water', 'water_customer_number');
    } catch (err: any) {
        return { error: err.message };
    }

    revalidatePath('/tenants');
    return { success: true };
}

export async function editTenant(formData: FormData) {
    const supabase = await createClient();

    const { data: claimsData, error: authError } = await supabase.auth.getClaims();
    if (authError || !claimsData?.claims) return { error: 'Not authenticated' };

    const id = formData.get('id') as string;
    
    const updateData: Record<string, any> = {};
    if (formData.has('name')) {
        updateData.name = formData.get('name') as string;
    }
    if (formData.has('phone_number')) {
        updateData.phone_number = formData.get('phone_number') as string;
    }
    if (formData.has('property_id')) {
        updateData.property_id = formData.get('property_id') as string;
    }
    if (formData.has('rent_amount')) {
        updateData.rent_amount = Number(formData.get('rent_amount'));
    }
    if (formData.has('due_date_day')) {
        updateData.due_date_day = Number(formData.get('due_date_day'));
    }

    if (Object.keys(updateData).length > 0) {
        const { error } = await supabase
            .from('tenants')
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error('Error editing tenant:', error);
            return { error: error.message };
        }
    }

    revalidatePath('/tenants');
    return { success: true };
}
