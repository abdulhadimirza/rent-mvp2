/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useTransition } from 'react';
import dynamic from 'next/dynamic';
import { addProperty, addTenant, editProperty, editTenant, deleteProperty, deleteTenant } from './actions';
import { Modal } from '@/components/ui/modal';

const GlobalRentPaymentModal = dynamic(() => import('./GlobalRentPaymentModal').then((m) => m.GlobalRentPaymentModal), { ssr: false });

function EditPropertyForm({ selectedProperty, onSave, onClose }: any) {
    const [dirtyFields, setDirtyFields] = useState<Record<string, boolean>>({});
    const [isPending, startTransition] = useTransition();

    const handleFieldChange = (fieldName: string) => {
        setDirtyFields((prev) => ({ ...prev, [fieldName]: true }));
    };

    const getCustomerNumber = (billType: string) => {
        if (!selectedProperty?.property_customer_numbers) return '';
        const numbers = Array.isArray(selectedProperty.property_customer_numbers)
            ? selectedProperty.property_customer_numbers
            : [selectedProperty.property_customer_numbers];
        const record = numbers.find((n: any) => n.bill_type === billType);
        return record ? record.customer_number : '';
    };

    async function handleEditProperty(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const rawFormData = new FormData(e.currentTarget);
        const filteredFormData = new FormData();
        filteredFormData.append('id', selectedProperty.id);

        let hasChanges = false;
        if (dirtyFields['name']) {
            filteredFormData.append('name', rawFormData.get('name') as string);
            hasChanges = true;
        }
        if (dirtyFields['address']) {
            filteredFormData.append('address', rawFormData.get('address') as string);
            hasChanges = true;
        }
        if (dirtyFields['electricity_customer_number']) {
            filteredFormData.append('electricity_customer_number', rawFormData.get('electricity_customer_number') as string);
            hasChanges = true;
        }
        if (dirtyFields['gas_customer_number']) {
            filteredFormData.append('gas_customer_number', rawFormData.get('gas_customer_number') as string);
            hasChanges = true;
        }
        if (dirtyFields['water_customer_number']) {
            filteredFormData.append('water_customer_number', rawFormData.get('water_customer_number') as string);
            hasChanges = true;
        }

        startTransition(async () => {
            if (hasChanges) {
                await editProperty(filteredFormData);
            }
            onSave();
        });
    }

    return (
        <form key={selectedProperty.id} onSubmit={handleEditProperty} className="space-y-4">
            <input type="hidden" name="id" value={selectedProperty.id} />
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                        Name
                </label>
                <input
                    required
                    name="name"
                    defaultValue={selectedProperty.name}
                    onChange={() => handleFieldChange('name')}
                    maxLength={100}
                    pattern=".*\S.*"
                    title="Property name cannot be empty or only spaces"
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                    placeholder="e.g. Apartment 4B"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                        Address
                </label>
                <input
                    name="address"
                    defaultValue={selectedProperty.address || ''}
                    onChange={() => handleFieldChange('address')}
                    maxLength={500}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                    placeholder="Full address"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                        Electricity Customer Number
                </label>
                <input
                    name="electricity_customer_number"
                    defaultValue={getCustomerNumber('Electricity')}
                    onChange={() => handleFieldChange('electricity_customer_number')}
                    pattern="[0-9]+"
                    title="Customer number must contain only digits"
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                    placeholder="e.g. 0123456789 (Optional)"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                        Gas Customer Number
                </label>
                <input
                    name="gas_customer_number"
                    defaultValue={getCustomerNumber('Gas')}
                    onChange={() => handleFieldChange('gas_customer_number')}
                    pattern="[0-9]+"
                    title="Customer number must contain only digits"
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                    placeholder="e.g. 0123456789 (Optional)"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                        Water Customer Number
                </label>
                <input
                    name="water_customer_number"
                    defaultValue={getCustomerNumber('Water')}
                    onChange={() => handleFieldChange('water_customer_number')}
                    pattern="[0-9]+"
                    title="Customer number must contain only digits"
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                    placeholder="e.g. 0123456789 (Optional)"
                />
            </div>
            <div className="flex justify-between items-center mt-6">
                <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete this property? This will also delete all associated tenants and bills.')) {
                            startTransition(async () => {
                                await deleteProperty(selectedProperty.id);
                                onSave();
                            });
                        }
                    }}
                    className="px-4 py-2 text-red-600 hover:text-red-800 font-medium disabled:opacity-50 transition-colors"
                >
                        Delete Property
                </button>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50"
                    >
                            Close
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </form>
    );
}

function EditTenantForm({ selectedTenant, properties, onSave, onClose }: any) {
    const [dirtyFields, setDirtyFields] = useState<Record<string, boolean>>({});
    const [isPending, startTransition] = useTransition();

    const handleFieldChange = (fieldName: string) => {
        setDirtyFields((prev) => ({ ...prev, [fieldName]: true }));
    };

    async function handleEditTenant(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const rawFormData = new FormData(e.currentTarget);
        const filteredFormData = new FormData();
        filteredFormData.append('id', selectedTenant.id);

        let hasChanges = false;
        if (dirtyFields['name']) {
            filteredFormData.append('name', rawFormData.get('name') as string);
            hasChanges = true;
        }
        if (dirtyFields['phone_number']) {
            filteredFormData.append('phone_number', rawFormData.get('phone_number') as string);
            hasChanges = true;
        }
        if (dirtyFields['property_id']) {
            filteredFormData.append('property_id', rawFormData.get('property_id') as string);
            hasChanges = true;
        }
        if (dirtyFields['rent_amount']) {
            filteredFormData.append('rent_amount', rawFormData.get('rent_amount') as string);
            hasChanges = true;
        }
        if (dirtyFields['due_date_day']) {
            filteredFormData.append('due_date_day', rawFormData.get('due_date_day') as string);
            hasChanges = true;
        }

        startTransition(async () => {
            if (hasChanges) {
                await editTenant(filteredFormData);
            }
            onSave();
        });
    }

    return (
        <form key={selectedTenant.id} onSubmit={handleEditTenant} className="space-y-4">
            <input type="hidden" name="id" value={selectedTenant.id} />
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                        Name
                </label>
                <input
                    required
                    name="name"
                    defaultValue={selectedTenant.name}
                    onChange={() => handleFieldChange('name')}
                    maxLength={100}
                    pattern=".*\S.*"
                    title="Tenant name cannot be empty or only spaces"
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                    placeholder="John Doe"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                        Phone Number
                </label>
                <input
                    required
                    name="phone_number"
                    defaultValue={selectedTenant.phone_number}
                    onChange={() => handleFieldChange('phone_number')}
                    maxLength={20}
                    pattern="^\+?[0-9]{7,15}$"
                    title="Valid phone number (7-15 digits, optional + prefix)"
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                    placeholder="+923001234567"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                        Property Assignment
                </label>
                <select
                    required
                    name="property_id"
                    defaultValue={selectedTenant.property_id}
                    onChange={() => handleFieldChange('property_id')}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                >
                    <option value="">Select a property</option>
                    {properties
                        .filter((p: any) => {
                            const tenants = Array.isArray(p.tenants) ? p.tenants : p.tenants ? [p.tenants] : [];
                            return tenants.length === 0 || p.id === selectedTenant.property_id;
                        })
                        .map((p: any) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                        Rent Amount
                </label>
                <input
                    required
                    name="rent_amount"
                    type="number"
                    step="0.01"
                    defaultValue={selectedTenant.rent_amount}
                    onChange={() => handleFieldChange('rent_amount')}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                    placeholder="1000.00"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                        Monthly Due Day
                </label>
                <input
                    required
                    name="due_date_day"
                    type="number"
                    min="1"
                    max="31"
                    defaultValue={selectedTenant.due_date_day}
                    onChange={() => handleFieldChange('due_date_day')}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                    placeholder="5"
                />
            </div>
            <div className="flex justify-between items-center mt-6">
                <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete this tenant?')) {
                            startTransition(async () => {
                                await deleteTenant(selectedTenant.id);
                                onSave();
                            });
                        }
                    }}
                    className="px-4 py-2 text-red-600 hover:text-red-800 font-medium disabled:opacity-50 transition-colors"
                >
                        Delete Tenant
                </button>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50"
                    >
                            Close
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </form>
    );
}

export function TenantModals({ properties }: { properties: any[] }) {
    const [isPropertyModalOpen, setPropertyModalOpen] = useState(false);
    const [isTenantModalOpen, setTenantModalOpen] = useState(false);

    const [isEditPropertyModalOpen, setEditPropertyModalOpen] = useState(false);
    const [isEditTenantModalOpen, setEditTenantModalOpen] = useState(false);
    const [isGlobalRentModalOpen, setGlobalRentModalOpen] = useState(false);

    const [selectedPropertyId, setSelectedPropertyId] = useState('');
    const [selectedTenantId, setSelectedTenantId] = useState('');

    const [isPending, startTransition] = useTransition();

    function handleAddProperty(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            await addProperty(formData);
            setPropertyModalOpen(false);
        });
    }

    function handleAddTenant(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            await addTenant(formData);
            setTenantModalOpen(false);
        });
    }

    const availableProperties = properties.filter((p) => {
        const tenants = Array.isArray(p.tenants) ? p.tenants : p.tenants ? [p.tenants] : [];
        return tenants.length === 0;
    });

    const allTenants = properties.flatMap((p) => {
        const tenants = Array.isArray(p.tenants) ? p.tenants : p.tenants ? [p.tenants] : [];
        return tenants.map((t: any) => ({ ...t, property_name: p.name }));
    });

    const selectedProperty = properties.find((p) => p.id === selectedPropertyId);
    const selectedTenant = allTenants.find((t) => t.id === selectedTenantId);

    return (
        <>
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => setGlobalRentModalOpen(true)}
                    className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors shadow-sm font-medium"
                >
                    Record Rent Payment
                </button>

                <button
                    onClick={() => setPropertyModalOpen(true)}
                    className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors shadow-sm font-medium"
                >
                    Add Property
                </button>
                <button
                    onClick={() => setTenantModalOpen(true)}
                    className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors shadow-sm font-medium"
                >
                    Add Tenant
                </button>

                <button
                    onClick={() => {
                        setSelectedPropertyId('');
                        setEditPropertyModalOpen(true);
                    }}
                    className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors shadow-sm font-medium"
                >
                    Edit Property
                </button>
                <button
                    onClick={() => {
                        setSelectedTenantId('');
                        setEditTenantModalOpen(true);
                    }}
                    className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors shadow-sm font-medium"
                >
                    Edit Tenant
                </button>
            </div>

            {isPropertyModalOpen && (
                <Modal title="Add Property">
                    <form onSubmit={handleAddProperty} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Name
                            </label>
                            <input
                                required
                                name="name"
                                maxLength={100}
                                pattern=".*\S.*"
                                title="Property name cannot be empty or only spaces"
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                                placeholder="e.g. Apartment 4B"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Address
                            </label>
                            <input
                                name="address"
                                maxLength={500}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                                placeholder="Full address"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Electricity Customer Number
                            </label>
                            <input
                                name="electricity_customer_number"
                                pattern="[0-9]+"
                                title="Customer number must contain only digits"
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                                placeholder="e.g. 0123456789 (Optional)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Gas Customer Number
                            </label>
                            <input
                                name="gas_customer_number"
                                pattern="[0-9]+"
                                title="Customer number must contain only digits"
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                                placeholder="e.g. 0123456789 (Optional)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Water Customer Number
                            </label>
                            <input
                                name="water_customer_number"
                                pattern="[0-9]+"
                                title="Customer number must contain only digits"
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                                placeholder="e.g. 0123456789 (Optional)"
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setPropertyModalOpen(false)}
                                disabled={isPending}
                                className="px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50"
                            >
                                    Close
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isPending ? 'Saving...' : 'Save Property'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {isEditPropertyModalOpen && (
                <Modal title="Edit Property">
                    {properties.length === 0 ? (
                        <div className="text-slate-600 mb-4">No properties available.</div>
                    ) : (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Select Property to Edit
                            </label>
                            <select
                                value={selectedPropertyId}
                                onChange={(e) => setSelectedPropertyId(e.target.value)}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                            >
                                <option value="">-- Select a property --</option>
                                {properties.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {selectedProperty && (
                        <EditPropertyForm 
                            key={selectedProperty.id} 
                            selectedProperty={selectedProperty} 
                            onSave={() => {
                                setEditPropertyModalOpen(false);
                                setSelectedPropertyId('');
                            }}
                            onClose={() => {
                                setEditPropertyModalOpen(false);
                                setSelectedPropertyId('');
                            }}
                        />
                    )}

                    {!selectedProperty && (
                        <div className="flex justify-end mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditPropertyModalOpen(false);
                                    setSelectedPropertyId('');
                                }}
                                disabled={isPending}
                                className="px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50"
                            >
                                    Close
                            </button>
                        </div>
                    )}
                </Modal>
            )}

            {isTenantModalOpen && (
                <Modal title="Add Tenant">
                    {availableProperties.length === 0 ? (
                        <div className="text-slate-600 mb-4">No properties available for a new tenant. Create a property or free one up first.</div>
                    ) : (
                        <form onSubmit={handleAddTenant} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Name
                                </label>
                                <input
                                    required
                                    name="name"
                                    maxLength={100}
                                    pattern=".*\S.*"
                                    title="Tenant name cannot be empty or only spaces"
                                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Phone Number
                                </label>
                                <input
                                    required
                                    name="phone_number"
                                    maxLength={20}
                                    pattern="^\+?[0-9]{7,15}$"
                                    title="Valid phone number (7-15 digits, optional + prefix)"
                                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                                    placeholder="+923001234567"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Property Assignment
                                </label>
                                <select
                                    required
                                    name="property_id"
                                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                                >
                                    <option value="">Select a property</option>
                                    {availableProperties.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Rent Amount
                                </label>
                                <input
                                    required
                                    name="rent_amount"
                                    type="number"
                                    step="0.01"
                                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                                    placeholder="1000.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Monthly Due Day
                                </label>
                                <input
                                    required
                                    name="due_date_day"
                                    type="number"
                                    min="1"
                                    max="31"
                                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                                    placeholder="5"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setTenantModalOpen(false)}
                                    disabled={isPending}
                                    className="px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50"
                                >
                                        Close
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isPending ? 'Saving...' : 'Save Tenant'}
                                </button>
                            </div>
                        </form>
                    )}
                    {availableProperties.length === 0 && (
                        <div className="flex justify-end mt-6">
                            <button
                                type="button"
                                onClick={() => setTenantModalOpen(false)}
                                disabled={isPending}
                                className="px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50"
                            >
                                    Close
                            </button>
                        </div>
                    )}
                </Modal>
            )}

            {isEditTenantModalOpen && (
                <Modal title="Edit Tenant">
                    {allTenants.length === 0 ? (
                        <div className="text-slate-600 mb-4">No tenants available.</div>
                    ) : (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Select Tenant to Edit
                            </label>
                            <select
                                value={selectedTenantId}
                                onChange={(e) => setSelectedTenantId(e.target.value)}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                            >
                                <option value="">-- Select a tenant --</option>
                                {allTenants.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name} ({t.property_name})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {selectedTenant && (
                        <EditTenantForm 
                            key={selectedTenant.id} 
                            selectedTenant={selectedTenant} 
                            properties={properties}
                            onSave={() => {
                                setEditTenantModalOpen(false);
                                setSelectedTenantId('');
                            }}
                            onClose={() => {
                                setEditTenantModalOpen(false);
                                setSelectedTenantId('');
                            }}
                        />
                    )}

                    {!selectedTenant && (
                        <div className="flex justify-end mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditTenantModalOpen(false);
                                    setSelectedTenantId('');
                                }}
                                disabled={isPending}
                                className="px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50"
                            >
                                    Close
                            </button>
                        </div>
                    )}
                </Modal>
            )}
            
            {isGlobalRentModalOpen && (
                <GlobalRentPaymentModal
                    tenants={allTenants}
                    onClose={() => setGlobalRentModalOpen(false)}
                />
            )}
        </>
    );
}
