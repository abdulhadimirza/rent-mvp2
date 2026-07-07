import { z } from 'zod';

export const commonSchemas = {
    id: z.string().trim().min(1, 'ID is required.'),
    amountDue: z.coerce.number().int().nonnegative('Amount due must be a valid non-negative whole number.'),
    amountPaid: z.coerce.number().int().positive('Payment amount must be a positive integer.'),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format.'),
    billingMonth: z.string().regex(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{4}$/, 'Billing month must be in MMM-YYYY format (e.g., May-2026).'),
    billType: z.enum(['Electricity', 'Gas', 'Water'], { message: 'Invalid bill type. Must be Electricity, Gas, or Water.' }),
    customerNumber: z.string().regex(/^[0-9]+$/, 'Customer number must contain only digits.').max(30, 'Customer number cannot exceed 30 digits.'),
    propertyName: z.string().trim().min(1, 'Property name is required and cannot be empty.').max(100, 'Property name cannot exceed 100 characters.'),
    address: z.string().trim().max(500, 'Address cannot exceed 500 characters.').nullable(),
    tenantName: z.string().trim().min(1, 'Tenant name is required and cannot be empty.').max(100, 'Tenant name cannot exceed 100 characters.'),
    phone: z.string().regex(/^\+?[0-9]{7,15}$/, 'Invalid phone number format.').max(20, 'Phone number cannot exceed 20 characters.'),
    rentAmount: z.coerce.number().nonnegative('Rent amount must be a valid positive number.'),
    dueDay: z.coerce.number().int().min(1, 'Due day must be a number between 1 and 31.').max(31, 'Due day must be a number between 1 and 31.'),
};

export const processBillPaymentSchema = z.object({
    bill_id: commonSchemas.id,
    amount_paid: commonSchemas.amountPaid,
});

export const editBillSchema = z.object({
    id: commonSchemas.id,
    amount_due: commonSchemas.amountDue.optional(),
    due_date: commonSchemas.dueDate.optional(),
    bill_type: commonSchemas.billType.optional(),
    billing_month: commonSchemas.billingMonth.optional(),
});

export const processRentPaymentSchema = z.object({
    rent_cycle_id: commonSchemas.id,
    amount_paid: commonSchemas.amountPaid,
});

export const editRentCycleSchema = z.object({
    id: commonSchemas.id,
    amount_due: commonSchemas.amountDue.optional(),
    due_date: commonSchemas.dueDate.optional(),
    billing_month: commonSchemas.billingMonth.optional(),
});

export const addPropertySchema = z.object({
    name: commonSchemas.propertyName,
    address: commonSchemas.address.optional(),
    electricity_customer_number: commonSchemas.customerNumber.optional().or(z.literal('')),
    gas_customer_number: commonSchemas.customerNumber.optional().or(z.literal('')),
    water_customer_number: commonSchemas.customerNumber.optional().or(z.literal('')),
});

export const editPropertySchema = z.object({
    id: commonSchemas.id,
    name: commonSchemas.propertyName.optional(),
    address: commonSchemas.address.optional(),
    electricity_customer_number: commonSchemas.customerNumber.optional().or(z.literal('')),
    gas_customer_number: commonSchemas.customerNumber.optional().or(z.literal('')),
    water_customer_number: commonSchemas.customerNumber.optional().or(z.literal('')),
});

export const addTenantSchema = z.object({
    name: commonSchemas.tenantName,
    phone_number: commonSchemas.phone,
    property_id: commonSchemas.id,
    rent_amount: commonSchemas.rentAmount,
    due_date_day: commonSchemas.dueDay,
});

export const editTenantSchema = z.object({
    id: commonSchemas.id,
    name: commonSchemas.tenantName.optional(),
    phone_number: commonSchemas.phone.optional(),
    property_id: commonSchemas.id.optional(),
    rent_amount: commonSchemas.rentAmount.optional(),
    due_date_day: commonSchemas.dueDay.optional(),
});

export const extractedBillSchema = z.object({
    bill_type: commonSchemas.billType,
    billing_month: commonSchemas.billingMonth,
    customer_number: commonSchemas.customerNumber,
    amount_due: commonSchemas.amountDue,
    due_date: commonSchemas.dueDate,
});

