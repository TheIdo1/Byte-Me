// src/frontend/src/components/admin/EditRestaurantDetails.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateRestaurant, deleteRestaurant } from '../../api/restaurantsApi';
import { CATEGORIES_DATA } from '../CategoryBar';
import './EditRestaurantDetails.css';

/*
EditRestaurantDetails Component
Provides a secure form for editing a restaurant's details.
Includes multiple edge-case protections:
 White-space trimming (prevents empty string submissions).
 URL validation and live image preview.
 Server-side error mapping to UI.
 Safe-Delete mechanism requiring the exact restaurant name.
*/
export default function EditRestaurantDetails({ restaurant, onUpdated }) {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: restaurant.name || '',
        description: restaurant.description || '',
        category: restaurant.category || '',
        phone: restaurant.phone || '',
        email: restaurant.email || '',
        image: restaurant.image || '',
        promotionalMessage: restaurant.promotionalMessage || '',
        city: restaurant.address?.city || '',
        street: restaurant.address?.street || '',
        houseNum: restaurant.address?.houseNum || '',
        lat: restaurant.address?.lat || '',
        long: restaurant.address?.long || '',
        subcategories: restaurant.subcategories ? restaurant.subcategories.join(', ') : '',
        isSponsored: restaurant.isSponsored || false,
        rating: restaurant.rating || 1, 
    });

    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [imageError, setImageError] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        
        setFormData(prev => ({ ...prev, [name]: newValue }));
        setErrorMsg(''); 
        if (name === 'image') setImageError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        //VALIDATION LAYER 

        const trimmedName = formData.name.trim();
        const trimmedDesc = formData.description.trim();
        const trimmedCity = formData.city.trim();
        const trimmedStreet = formData.street.trim();

        if (!trimmedName || !trimmedDesc || !trimmedCity || !trimmedStreet) {
            setErrorMsg("Required fields cannot be empty or contain only spaces.");
            return;
        }

        if (!formData.image.startsWith('http://') && !formData.image.startsWith('https://')) {
            setErrorMsg("Image URL must start with http:// or https://");
            return;
        }

        // PROTECTION: Rating validation (1 to 10)
        const ratingValue = Number(formData.rating);
        if (ratingValue < 1 || ratingValue > 10) {
            setErrorMsg("Rating must be a number between 1 and 10.");
            return;
        }

        // PROTECTION: Subcategories advanced validation
        if (formData.subcategories.trim() !== '') {
            // Regex check: Only allow letters, numbers, spaces, and commas. 
            // \p{L} supports all languages (including Hebrew), \p{N} supports numbers.
            const isValidChars = /^[\p{L}\p{N}\s,]+$/u.test(formData.subcategories);
            if (!isValidChars) {
                setErrorMsg("Subcategories can only contain letters, numbers, spaces, and commas. Do not use asterisks (*), dashes (-), or other symbols.");
                return;
            }

            // Missing commas check: If there are multiple words (more than 2) but no commas.
            // (We allow 2 words without a comma because of valid subcategories like "Street Food").
            const wordCount = formData.subcategories.trim().split(/\s+/).length;
            if (!formData.subcategories.includes(',') && wordCount > 2) {
                setErrorMsg("It looks like you have multiple subcategories but forgot to separate them with commas.");
                return;
            }
        }

        // Convert the string to a clean array
        const subcategoriesArray = formData.subcategories
            .split(',')
            .map(item => item.trim())
            .filter(item => item !== '');

        setIsSaving(true);

        try {
            const updatePayload = {
                name: trimmedName,
                description: trimmedDesc,
                category: formData.category,
                phone: formData.phone.trim(),
                email: formData.email.trim(),
                image: formData.image.trim(),
                promotionalMessage: formData.promotionalMessage.trim(),
                subcategories: subcategoriesArray,
                isSponsored: formData.isSponsored,
                rating: ratingValue, // Updated to use the validated rating
                address: {
                    ...restaurant.address,
                    city: trimmedCity,
                    street: trimmedStreet,
                    houseNum: Number(formData.houseNum),
                    lat: Number(formData.lat),
                    long: Number(formData.long)
                }
            };

            await updateRestaurant(restaurant.id, updatePayload);
            alert("Restaurant updated successfully!");
            if (onUpdated) onUpdated();
            
        } catch (error) {
            console.error("Failed to update restaurant:", error);
            const backendMessage = error.response?.data?.message || error.response?.data?.error || error.message;
            setErrorMsg(`Failed to save: ${backendMessage}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (deleteConfirmation !== restaurant.name) return;

        try {
            await deleteRestaurant(restaurant.id);
            alert("Restaurant deleted permanently.");
            navigate('/manage/restaurants');
        } catch (error) {
            console.error("Failed to delete restaurant:", error);
            alert("Error deleting restaurant.");
        }
    };

    return (
        <div>
            <h2>Restaurant Information</h2>
            
            {errorMsg && <div className="error-message">{errorMsg}</div>}
            
            <form className="edit-restaurant-form" onSubmit={handleSubmit}>
                
                <div className="form-row">
                    <div className="form-group">
                        <label>Restaurant Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select 
                            name="category" 
                            value={formData.category} 
                            onChange={handleChange} 
                            required
                            className="form-select"
                        >
                            {!CATEGORIES_DATA.find(c => c.name === formData.category) && formData.category && (
                                <option value={formData.category}>{formData.category} (Current)</option>
                            )}
                            <option value="">Select a category</option>
                            {CATEGORIES_DATA.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Subcategories (comma separated)</label>
                        <input type="text" name="subcategories" value={formData.subcategories} onChange={handleChange} placeholder="e.g. Burgers, Fries, Drinks" />
                    </div>
                    <div className="form-group">
                        <label>Promotional Message</label>
                        <input type="text" name="promotionalMessage" value={formData.promotionalMessage} onChange={handleChange} placeholder="e.g. Free Delivery on Sundays!" />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        {/* CHANGED: Label and max value updated to 10 */}
                        <label>Rating (1-10)</label>
                        <input type="number" min="1" max="10" step="0.1" name="rating" value={formData.rating} onChange={handleChange} required />
                    </div>
                    
                    <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', marginTop: '28px' }}>
                        <input type="checkbox" name="isSponsored" id="isSponsored" checked={formData.isSponsored} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                        <label htmlFor="isSponsored" style={{ margin: 0, cursor: 'pointer' }}>Sponsored Placement</label>
                    </div>
                </div>

                <div className="form-group">
                    <label>Image URL</label>
                    <input type="url" name="image" value={formData.image} onChange={handleChange} required />
                    
                    <div className="image-preview-container">
                        {formData.image && !imageError ? (
                            <img src={formData.image} alt="Preview" onError={() => setImageError(true)} />
                        ) : (
                            <div className="image-preview-error">
                                {formData.image ? "Invalid Image URL" : "No Image"}
                            </div>
                        )}
                    </div>
                </div>

                <h3>Location & Coordinates</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label>City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Street</label>
                        <input type="text" name="street" value={formData.street} onChange={handleChange} required />
                    </div>
                    <div className="form-group" style={{ flex: '0.5' }}>
                        <label>House Num</label>
                        <input type="number" min="1" name="houseNum" value={formData.houseNum} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Latitude (Lat)</label>
                        <input type="number" step="any" name="lat" value={formData.lat} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Longitude (Long)</label>
                        <input type="number" step="any" name="long" value={formData.long} onChange={handleChange} required />
                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>

            <div className="danger-zone">
                <h3>Danger Zone</h3>
                <p>Deleting this restaurant is permanent. It will remove the restaurant, its products, and order history.</p>
                
                <div className="safe-delete-group">
                    <label>Please type <strong>{restaurant.name}</strong> to confirm:</label>
                    <input 
                        type="text" 
                        value={deleteConfirmation} 
                        onChange={(e) => setDeleteConfirmation(e.target.value)} 
                        placeholder={restaurant.name}
                    />
                </div>

                <button 
                    onClick={handleDelete} 
                    className="delete-btn"
                    disabled={deleteConfirmation !== restaurant.name}
                >
                    I understand, Delete Restaurant
                </button>
            </div>
        </div>
    );
}