'use client';

import { useState, useEffect } from 'react';
import { addProperty, addTenant, editProperty, editTenant } from './actions';

export function TenantModals({ properties }: { properties: any[] }) {
    const [isPropertyModalOpen, setPropertyModalOpen] = useState(false);
    const [isTenantModalOpen, setTenantModalOpen] = useState(false);

    // Edit Modal states
    const [isEditPropertyModalOpen, setEditPropertyModalOpen] = useState(false);
    const [isEditTenantModalOpen, setEditTenantModalOpen] = useState(false);

    const [selectedPropertyId, setSelectedPropertyId] = useState('');
    const [selectedTenantId, setSelectedTenantId] = useState('');

    // Keep track of which fields are changed (dirty) by the user
    const [dirtyFields, setDirtyFields] = useState<Record<string, boolean>>({});

    const [loading, setLoading] = useState(false);

    // Reset dirty tracking when switching properties/tenants
    useEffect(() => {
        setDirtyFields({});
    }, [selectedPropertyId, selectedTenantId]);

    const handleFieldChange = (fieldName: string) => {
        setDirtyFields((prev) => ({ ...prev, [fieldName]: true }));
    };

    async function handleAddProperty(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        await addProperty(formData);
        setLoading(false);
        setPropertyModalOpen(false);
    }

    async function handleAddTenant(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        await addTenant(formData);
        setLoading(false);
        setTenantModalOpen(false);
    }

    async function handleEditProperty(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const rawFormData = new FormData(e.currentTarget);
        const filteredFormData = new FormData();
        filteredFormData.append('id', selectedPropertyId);

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

        if (hasChanges) {
            await editProperty(filteredFormData);
        }

        setLoading(false);
        setEditPropertyModalOpen(false);
        setSelectedPropertyId('');
    }

    async function handleEditTenant(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const rawFormData = new FormData(e.currentTarget);
        const filteredFormData = new FormData();
        filteredFormData.append('id', selectedTenantId);

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

        if (hasChanges) {
            await editTenant(filteredFormData);
        }

        setLoading(false);
        setEditTenantModalOpen(false);
        setSelectedTenantId('');
    }

    // Prepare lists for modals
    // Properties that don't have any tenants assigned (for Add Tenant dropdown)
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

    // Get existing customer numbers for the selected property
    const getCustomerNumber = (billType: string) => {
        if (!selectedProperty?.property_customer_numbers) return '';
        const numbers = Array.isArray(selectedProperty.property_customer_numbers)
            ? selectedProperty.property_customer_numbers
            : [selectedProperty.property_customer_numbers];
        const record = numbers.find((n: any) => n.bill_type === billType);
        return record ? record.customer_number : '';
    };

    return (
        <>
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => setPropertyModalOpen(true)}
                    className="bg-slate-800 text-white border border-slate-800 px-4 py-2 rounded-md hover:bg-slate-700 transition-colors shadow-sm font-medium"
                >
                    Add Property
                </button>
                <button
                    onClick={() => setTenantModalOpen(true)}
                    className="bg-slate-800 text-white border border-slate-800 px-4 py-2 rounded-md hover:bg-slate-700 transition-colors shadow-sm font-medium"
                >
                    Add Tenant
                </button>

                <div className="w-px h-6 bg-slate-600 mx-2" />

                <button
                    onClick={() => {
                        setSelectedPropertyId('');
                        setEditPropertyModalOpen(true);
                        setDirtyFields({});
                    }}
                    className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors shadow-sm font-medium"
                >
                    Edit Property
                </button>
                <button
                    onClick={() => {
                        setSelectedTenantId('');
                        setEditTenantModalOpen(true);
                        setDirtyFields({});
                    }}
                    className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors shadow-sm font-medium"
                >
                    Edit Tenant
                </button>
            </div>

            {/* ADD PROPERTY MODAL */}
            {isPropertyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm w-screen h-screen">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-screen overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4 text-slate-900">
                            Add Property
                        </h3>
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
                                    className="px-4 py-2 text-slate-600 hover:text-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Property'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT PROPERTY MODAL */}
            {isEditPropertyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm w-screen h-screen">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-screen overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4 text-slate-900">
                            Edit Property
                        </h3>
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
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditPropertyModalOpen(false);
                                            setSelectedPropertyId('');
                                        }}
                                        className="px-4 py-2 text-slate-600 hover:text-slate-800"
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {!selectedProperty && (
                            <div className="flex justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditPropertyModalOpen(false);
                                        setSelectedPropertyId('');
                                    }}
                                    className="px-4 py-2 text-slate-600 hover:text-slate-800"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ADD TENANT MODAL */}
            {isTenantModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm w-screen h-screen">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-screen overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4 text-slate-900">
                            Add Tenant
                        </h3>
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
                                        className="px-4 py-2 text-slate-600 hover:text-slate-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Tenant'}
                                    </button>
                                </div>
                            </form>
                        )}
                        {availableProperties.length === 0 && (
                            <div className="flex justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setTenantModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 hover:text-slate-800"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* EDIT TENANT MODAL */}
            {isEditTenantModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm w-screen h-screen">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-screen overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4 text-slate-900">
                            Edit Tenant
                        </h3>
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
                                        {/* Show available properties PLUS the property currently assigned to this tenant */}
                                        {properties
                                            .filter((p) => {
                                                const tenants = Array.isArray(p.tenants) ? p.tenants : p.tenants ? [p.tenants] : [];
                                                return tenants.length === 0 || p.id === selectedTenant.property_id;
                                            })
                                            .map((p) => (
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
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditTenantModalOpen(false);
                                            setSelectedTenantId('');
                                        }}
                                        className="px-4 py-2 text-slate-600 hover:text-slate-800"
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {!selectedTenant && (
                            <div className="flex justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditTenantModalOpen(false);
                                        setSelectedTenantId('');
                                    }}
                                    className="px-4 py-2 text-slate-600 hover:text-slate-800"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
