// src/frontend/src/components/admin/ProductForm.js
import React, { useState } from 'react';
import { createProduct, updateProduct } from '../../api/productsApi';
import './ProductForm.css';

/*
 ProductForm Component -A reusable, secure form for both creating new products and editing existing ones.
 restaurantId - The ID of the restaurant this product belongs to.
 subcategories - Allowed categories for the dropdown menu.
 initialData - If provided, the form acts as an Edit form. If null, it's a Create form.
 onSave - Callback triggered after a successful save/update.
 onCancel - Callback triggered to close the form without saving.
*/
export default function ProductForm({ restaurantId, subcategories = [],products=[], initialData, onSave, onCancel }) {
    const isEditMode = !!initialData;

    // Initialize state. If editing, populate with existing data.
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        category: initialData?.category || '',
        price: initialData?.price || '',
        image: initialData?.image || '',
        isExtra: initialData?.isExtra || false,
        extras: initialData?.extras || [] // Initialize the extras array
    });

    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Filter out the product currently being edited so a product cannot be its own extra
    const availableExtras = products.filter(p => !isEditMode || p.id !== initialData.id);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrorMsg(''); // Clear error on user input
    };

    // Specific handler for toggling products in the extras array
    const handleExtraToggle = (extraId, isChecked) => {
        setFormData(prev => {
            if (isChecked) {
                // Add the ID to the array
                return { ...prev, extras: [...prev.extras, extraId] };
            } else {
                // Remove the ID from the array
                return { ...prev, extras: prev.extras.filter(id => id !== extraId) };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        // PROTECTION 1: Trim whitespaces and check for empty fields
        const trimmedName = formData.name.trim();
        const trimmedDesc = formData.description.trim();
        const trimmedCategory = formData.category.trim();
        const trimmedImage = formData.image.trim();

        if (!trimmedName || !trimmedDesc || !trimmedCategory) {
            setErrorMsg("Required fields cannot be empty or just spaces.");
            return;
        }

        // Price validation
        const priceValue = Number(formData.price);
        if (priceValue <= 0 || isNaN(priceValue)) {
            setErrorMsg("Price must be a valid number greater than 0.");
            return;
        }

        // Basic Image URL validation
        if (trimmedImage && !trimmedImage.startsWith('http://') && !trimmedImage.startsWith('https://')) {
            setErrorMsg("Image URL must start with http:// or https://");
            return;
        }

        setIsSaving(true);

        try {
            const productPayload = {
                name: trimmedName,
                description: trimmedDesc,
                category: trimmedCategory,
                price: priceValue,
                image: trimmedImage,
                isExtra: formData.isExtra === "on" ,
                extras: formData.extras // Send the array of string IDs directly to the backend
            };

            if (isEditMode) {
                // Update existing product
                await updateProduct(restaurantId, initialData.id, productPayload);
                alert("Product updated successfully!");
            } else {
                // Create new product
                await createProduct(restaurantId, productPayload);
                alert("Product created successfully!");
            }

            // Close the form and tell the parent to refresh the list
            onSave();
            
        } catch (error) {
            console.error("Failed to save product:", error);
            const backendMessage = error.response?.data?.message || error.response?.data?.error || "Unknown error occurred.";
            setErrorMsg(`Failed to save: ${backendMessage}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="product-form-container">
            <h3>{isEditMode ? 'Edit Product' : 'Add New Product'}</h3>
            
            {errorMsg && <div className="error-message" style={{ marginBottom: '16px' }}>{errorMsg}</div>}

            <form className="product-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>Product Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    {/* --- UPDATED CATEGORY FIELD --- */}
                <div className="form-group">
                    <label>Category</label>
                    <select 
                        name="category" 
                        value={formData.category} 
                        onChange={handleChange} 
                        required
                        className="form-select"
                    >
                        <option value="">Select a category</option>
                        {subcategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="2" required />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Price (₪)</label>
                        <input type="number" step="0.1" min="0.1" name="price" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input type="url" name="image" value={formData.image} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group checkbox-group">
                    <input 
                        type="checkbox" 
                        name="isExtra" 
                        id="isExtra" 
                        checked={formData.isExtra} 
                        onChange={handleChange} 
                        className="checkbox-input"
                    />
                    <label htmlFor="isExtra" className="checkbox-label">This is an Extra</label>
                </div>

                {/* EXTRAS SELECTION AREA */}
                <div className="form-group" style={{ marginTop: '16px' }}>
                    <label>Add-ons / Extras for this product</label>
                    <div className="extras-list-container">
                        {availableExtras.length === 0 ? (
                            <p className="no-extras-msg">No other products available to add as extras.</p>
                        ) : (
                            availableExtras.map(extraProduct => (
                                <div key={extraProduct.id} className="extra-checkbox-item">
                                    <input 
                                        type="checkbox" 
                                        id={`extra-${extraProduct.id}`}
                                        checked={formData.extras.includes(extraProduct.id)}
                                        onChange={(e) => handleExtraToggle(extraProduct.id, e.target.checked)}
                                    />
                                    <label htmlFor={`extra-${extraProduct.id}`}>
                                        {extraProduct.name} <span style={{ color: '#7a7d82', fontWeight: 'normal' }}>(₪{extraProduct.price})</span>
                                    </label>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="form-actions">
                    <button type="submit" className="save-product-btn" disabled={isSaving}>
                        {isSaving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Product')}
                    </button>
                    <button type="button" className="cancel-btn" onClick={onCancel} disabled={isSaving}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}