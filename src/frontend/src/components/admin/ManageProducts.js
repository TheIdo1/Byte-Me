// src/frontend/src/components/admin/ManageProducts.js
import React, { useState, useEffect } from 'react';
import { getRestaurantProducts, deleteProduct } from '../../api/productsApi';
import './ManageProducts.css';
import ProductForm from './ProductForm';

/*
 ManageProducts Component
 Displays a list of all products for a specific restaurant and handles deletion.
 Will later integrate a ProductForm for adding and editing products.
*/
export default function ManageProducts({ restaurantId, subcategories }) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // States for controlling the form visibility and identifying which product to edit
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    // Fetch all products for this specific restaurant
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const data = await getRestaurantProducts(restaurantId);
            setProducts(data || []);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Load products on component mount
    useEffect(() => {
        fetchProducts();
    }, [restaurantId]);

    // Handle deleting a single product
    const handleDeleteProduct = async (productId, productName) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${productName}"?`);
        if (!confirmDelete) return;

        try {
            await deleteProduct(restaurantId, productId);
            // Re-fetch the list to update the UI
            fetchProducts();
        } catch (error) {
            console.error("Failed to delete product:", error);
            alert("Error deleting product.");
        }
    };

    // Open form to add a new product
    const handleAddNew = () => {
        setProductToEdit(null); // Null means "Create Mode"
        setIsFormOpen(true);
    };

    // Open form to edit an existing product
    const handleEdit = (product) => {
        setProductToEdit(product); // Passing the object means "Edit Mode"
        setIsFormOpen(true);
    };

    if (isLoading) {
        return <div>Loading menu...</div>;
    }

    // RENDER FORM
    // If the form state is active, we render the ProductForm component instead of the list.
    if (isFormOpen) {
        return (
            <ProductForm 
                restaurantId={restaurantId}
                subcategories={subcategories}
                products={products}
                initialData={productToEdit}
                onSave={() => {
                    setIsFormOpen(false); // Close the form
                    fetchProducts();      // Refresh the product list from the server
                }}
                onCancel={() => setIsFormOpen(false)} // Just close the form
            />
        );
    }

    // MAIN LIST VIEW
    return (
        <div className="manage-products-container">
            <div className="products-header">
                <h2>Menu Items</h2>
                <button className="add-product-btn" onClick={handleAddNew}>
                    + Add Product
                </button>
            </div>

            {products.length === 0 ? (
                <div className="empty-products">
                    <p>No products found for this restaurant.</p>
                </div>
            ) : (
                <div className="products-list">
                    {products.map(product => (
                        <div key={product.id} className="product-admin-card">
                            <img src={product.image} alt={product.name} className="product-admin-img" />
                            <div className="product-admin-info">
                                <h4>{product.name}</h4>
                                <p>{product.description}</p>
                                <span className="product-price">₪{product.price}</span>
                            </div>
                            <div className="product-admin-actions">
                                <button className="edit-btn" onClick={() => handleEdit(product)}>
                                    Edit
                                </button>
                                <button 
                                    className="delete-product-btn" 
                                    onClick={() => handleDeleteProduct(product.id, product.name)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}