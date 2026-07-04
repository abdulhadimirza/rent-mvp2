'use server';

import { createClient } from '@/lib/server';
import { revalidatePath } from 'next/cache';

export async function addProperty(formData: FormData) {
    const supabase = await createClient();

    const { data: claimsData, error: authError } =
        await supabase.auth.getClaims();

    if (authError || !claimsData?.claims) return { error: 'Not authenticated' };

    const userId = claimsData.claims.sub;

    const nameRaw = formData.get('name');
    const addressRaw = formData.get('address');

    if (typeof nameRaw !== 'string' || nameRaw.trim().length === 0) {
        return { error: 'Property name is required and cannot be empty.' };
    }
    const name = nameRaw.trim();
    if (name.length > 100) {
        return { error: 'Property name cannot exceed 100 characters.' };
    }

    let address = null;
    if (addressRaw !== null) {
        if (typeof addressRaw !== 'string') {
            return { error: 'Invalid address format.' };
        }
        address = addressRaw.trim();
        if (address.length > 500) {
            return { error: 'Address cannot exceed 500 characters.' };
        }
    }

    const customerNumbers: {
        bill_type: string;
        customer_number: string;
    }[] = [];
    const digitRegex = /^[0-9]+$/;

    const processCustomerNumberAdd = (valRaw: FormDataEntryValue | null, billType: string) => {
        if (valRaw !== null && valRaw !== '') {
            if (typeof valRaw !== 'string') {
                throw new Error(`Invalid ${billType} customer number format.`);
            }
            const val = valRaw.trim();
            if (val.length > 0) {
                if (val.length > 30) {
                    throw new Error(`${billType} customer number cannot exceed 30 digits.`);
                }
                if (!digitRegex.test(val)) {
                    throw new Error(`${billType} customer number must contain only digits.`);
                }
                customerNumbers.push({
                    bill_type: billType,
                    customer_number: val,
                });
            }
        }
    };

    try {
        processCustomerNumberAdd(formData.get('electricity_customer_number'), 'Electricity');
        processCustomerNumberAdd(formData.get('gas_customer_number'), 'Gas');
        processCustomerNumberAdd(formData.get('water_customer_number'), 'Water');
    } catch (err: any) {
        return { error: err.message };
    }

    const { error } = await supabase.rpc('add_property', {
        p_name: name,
        p_address: address,
        p_landlord_id: userId,
        p_customer_numbers: customerNumbers,
    });

    if (error) {
        console.error('Error adding property:', error);
        return { error: error.message };
    }

    revalidatePath('/tenants');
    return { success: true };
}

export async function addTenant(formData: FormData) {
    const supabase = await createClient();

    const { data: claimsData, error: authError } =
        await supabase.auth.getClaims();

    if (authError || !claimsData?.claims) return { error: 'Not authenticated' };

    const nameRaw = formData.get('name');
    if (typeof nameRaw !== 'string' || nameRaw.trim().length === 0) {
        return { error: 'Tenant name is required and cannot be empty.' };
    }
    const name = nameRaw.trim();
    if (name.length > 100) {
        return { error: 'Tenant name cannot exceed 100 characters.' };
    }

    const phoneRaw = formData.get('phone_number');
    if (typeof phoneRaw !== 'string' || phoneRaw.trim().length === 0) {
        return { error: 'Phone number is required.' };
    }
    const phone_number = phoneRaw.trim();
    if (phone_number.length > 20) {
        return { error: 'Phone number cannot exceed 20 characters.' };
    }
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(phone_number)) {
        return { error: 'Invalid phone number format.' };
    }

    const propertyIdRaw = formData.get('property_id');
    if (typeof propertyIdRaw !== 'string' || propertyIdRaw.trim().length === 0) {
        return { error: 'Property assignment is required.' };
    }
    const property_id = propertyIdRaw.trim();

    const rentAmountRaw = formData.get('rent_amount');
    const rent_amount = Number(rentAmountRaw);
    if (isNaN(rent_amount) || rent_amount < 0) {
        return { error: 'Rent amount must be a valid positive number.' };
    }

    const dueDayRaw = formData.get('due_date_day');
    const due_date_day = Number(dueDayRaw);
    if (isNaN(due_date_day) || due_date_day < 1 || due_date_day > 31) {
        return { error: 'Due day must be a number between 1 and 31.' };
    }

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
        const nameRaw = formData.get('name');
        if (typeof nameRaw !== 'string' || nameRaw.trim().length === 0) {
            return { error: 'Property name is required and cannot be empty.' };
        }
        const name = nameRaw.trim();
        if (name.length > 100) {
            return { error: 'Property name cannot exceed 100 characters.' };
        }
        updateData.name = name;
    }
    if (formData.has('address')) {
        const addressRaw = formData.get('address');
        if (typeof addressRaw !== 'string') {
            return { error: 'Invalid address format.' };
        }
        const address = addressRaw.trim();
        if (address.length > 500) {
            return { error: 'Address cannot exceed 500 characters.' };
        }
        updateData.address = address;
    }

    const billsToUpsert: { bill_type: string; customer_number: string }[] = [];
    const billsToDelete: string[] = [];
    const digitRegex = /^[0-9]+$/;

    // Helper to process each bill type
    function processCustomerNumber(billType: string, formKey: string) {
        if (formData.has(formKey)) {
            const valRaw = formData.get(formKey);
            if (valRaw !== null && valRaw !== '') {
                if (typeof valRaw !== 'string') {
                    throw new Error(`Invalid ${billType} customer number format.`);
                }
                const val = valRaw.trim();
                if (val.length > 0) {
                    if (val.length > 30) {
                        throw new Error(`${billType} customer number cannot exceed 30 digits.`);
                    }
                    if (!digitRegex.test(val)) {
                        throw new Error(`${billType} customer number must contain only digits.`);
                    }
                    billsToUpsert.push({
                        bill_type: billType,
                        customer_number: val,
                    });
                    return;
                }
            }
            // If empty or null but field is present, we delete the record
            billsToDelete.push(billType);
        }
    }

    try {
        processCustomerNumber('Electricity', 'electricity_customer_number');
        processCustomerNumber('Gas', 'gas_customer_number');
        processCustomerNumber('Water', 'water_customer_number');
    } catch (err: any) {
        return { error: err.message };
    }

    const { error } = await supabase.rpc('edit_property', {
        p_property_id: id,
        p_landlord_id: userId,
        p_update_data: updateData,
        p_bills_to_upsert: billsToUpsert,
        p_bills_to_delete: billsToDelete,
    });

    if (error) {
        console.error('Error editing property:', error);
        return { error: error.message };
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
        const nameRaw = formData.get('name');
        if (typeof nameRaw !== 'string' || nameRaw.trim().length === 0) {
            return { error: 'Tenant name is required and cannot be empty.' };
        }
        const name = nameRaw.trim();
        if (name.length > 100) {
            return { error: 'Tenant name cannot exceed 100 characters.' };
        }
        updateData.name = name;
    }
    if (formData.has('phone_number')) {
        const phoneRaw = formData.get('phone_number');
        if (typeof phoneRaw !== 'string' || phoneRaw.trim().length === 0) {
            return { error: 'Phone number is required.' };
        }
        const phone_number = phoneRaw.trim();
        if (phone_number.length > 20) {
            return { error: 'Phone number cannot exceed 20 characters.' };
        }
        const phoneRegex = /^\+?[0-9]{7,15}$/;
        if (!phoneRegex.test(phone_number)) {
            return { error: 'Invalid phone number format.' };
        }
        updateData.phone_number = phone_number;
    }
    if (formData.has('property_id')) {
        const propertyIdRaw = formData.get('property_id');
        if (typeof propertyIdRaw !== 'string' || propertyIdRaw.trim().length === 0) {
            return { error: 'Property assignment is required.' };
        }
        updateData.property_id = propertyIdRaw.trim();
    }
    if (formData.has('rent_amount')) {
        const rent_amount = Number(formData.get('rent_amount'));
        if (isNaN(rent_amount) || rent_amount < 0) {
            return { error: 'Rent amount must be a valid positive number.' };
        }
        updateData.rent_amount = rent_amount;
    }
    if (formData.has('due_date_day')) {
        const due_date_day = Number(formData.get('due_date_day'));
        if (isNaN(due_date_day) || due_date_day < 1 || due_date_day > 31) {
            return { error: 'Due day must be a number between 1 and 31.' };
        }
        updateData.due_date_day = due_date_day;
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
