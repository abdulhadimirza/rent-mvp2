'use server';

import { createClient } from '@/lib/server';
import { revalidatePath } from 'next/cache';
import { addPropertySchema, addTenantSchema, editPropertySchema, editTenantSchema } from '@/lib/schemas';

export async function addProperty(formData: FormData) {
    const supabase = await createClient();

    const { data: claimsData, error: authError } =
        await supabase.auth.getClaims();

    if (authError || !claimsData?.claims) return { error: 'Not authenticated' };

    const userId = claimsData.claims.sub;

    const parsed = addPropertySchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }
    const { name, address, electricity_customer_number, gas_customer_number, water_customer_number } = parsed.data;

    const customerNumbers: {
        bill_type: string;
        customer_number: string;
    }[] = [];

    if (electricity_customer_number) {
        customerNumbers.push({ bill_type: 'Electricity', customer_number: electricity_customer_number });
    }
    if (gas_customer_number) {
        customerNumbers.push({ bill_type: 'Gas', customer_number: gas_customer_number });
    }
    if (water_customer_number) {
        customerNumbers.push({ bill_type: 'Water', customer_number: water_customer_number });
    }

    const { error } = await supabase.rpc('add_property', {
        p_name: name,
        p_address: address,
        p_landlord_id: userId,
        p_customer_numbers: customerNumbers,
    });

    if (error) {
        console.error('Error adding property:', error);
        return { error: 'Failed to add property. Please try again later.' };
    }

    revalidatePath('/tenants');
    return { success: true };
}

export async function addTenant(formData: FormData) {
    const supabase = await createClient();

    const { data: claimsData, error: authError } =
        await supabase.auth.getClaims();

    if (authError || !claimsData?.claims) return { error: 'Not authenticated' };

    const parsed = addTenantSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }
    const { name, phone_number, property_id, rent_amount, due_date_day } = parsed.data;

    const { error } = await supabase.from('tenants').insert({
        name,
        phone_number,
        property_id,
        rent_amount,
        due_date_day,
    });

    if (error) {
        console.error('Error adding tenant:', error);
        return { error: 'Failed to add tenant. Please try again later.' };
    }

    revalidatePath('/tenants');
    return { success: true };
}

export async function editProperty(formData: FormData) {
    const supabase = await createClient();

    const { data: claimsData, error: authError } = await supabase.auth.getClaims();
    if (authError || !claimsData?.claims) return { error: 'Not authenticated' };
    const userId = claimsData.claims.sub;

    const parsed = editPropertySchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }
    const { id, electricity_customer_number, gas_customer_number, water_customer_number, ...updateDataRaw } = parsed.data;

    const updateData = Object.fromEntries(
        Object.entries(updateDataRaw).filter(([, v]) => v !== undefined)
    );

    const billsToUpsert: { bill_type: string; customer_number: string }[] = [];
    const billsToDelete: string[] = [];

    if (formData.has('electricity_customer_number')) {
        if (electricity_customer_number) billsToUpsert.push({ bill_type: 'Electricity', customer_number: electricity_customer_number });
        else billsToDelete.push('Electricity');
    }
    if (formData.has('gas_customer_number')) {
        if (gas_customer_number) billsToUpsert.push({ bill_type: 'Gas', customer_number: gas_customer_number });
        else billsToDelete.push('Gas');
    }
    if (formData.has('water_customer_number')) {
        if (water_customer_number) billsToUpsert.push({ bill_type: 'Water', customer_number: water_customer_number });
        else billsToDelete.push('Water');
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
        return { error: 'Failed to update property. Please try again later.' };
    }

    revalidatePath('/tenants');
    return { success: true };
}

export async function editTenant(formData: FormData) {
    const supabase = await createClient();

    const { data: claimsData, error: authError } = await supabase.auth.getClaims();
    if (authError || !claimsData?.claims) return { error: 'Not authenticated' };

    const parsed = editTenantSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }
    const { id, ...updateDataRaw } = parsed.data;

    const updateData = Object.fromEntries(
        Object.entries(updateDataRaw).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(updateData).length > 0) {
        const { error } = await supabase
            .from('tenants')
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error('Error editing tenant:', error);
            return { error: 'Failed to update tenant. Please try again later.' };
        }
    }

    revalidatePath('/tenants');
    return { success: true };
}

export async function deleteProperty(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) {
        console.error('Error deleting property:', error);
        return { error: 'Failed to delete property. Please try again later.' };
    }
    revalidatePath('/tenants');
    return { success: true };
}

export async function deleteTenant(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('tenants').delete().eq('id', id);
    if (error) {
        console.error('Error deleting tenant:', error);
        return { error: 'Failed to delete tenant. Please try again later.' };
    }
    revalidatePath('/tenants');
    return { success: true };
}

export async function getUnpaidRentCycles(tenantId: string) {
    const supabase = await createClient();
    const { data: claimsData, error: authError } = await supabase.auth.getClaims();
    if (authError || !claimsData?.claims) return { error: 'Not authenticated' };

    const { data, error } = await supabase
        .from('rent_cycles')
        .select(`*, rent_payments(amount_paid), tenants(name, properties(name))`)
        .eq('tenant_id', tenantId)
        .neq('status', 'paid')
        .order('due_date', { ascending: true });

    if (error) {
        console.error('Error fetching unpaid rent cycles:', error);
        return { error: 'Failed to fetch rent cycles' };
    }

    return { data };
}
