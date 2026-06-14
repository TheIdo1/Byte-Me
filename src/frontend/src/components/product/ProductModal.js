import React, { useState } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import './ProductModal.css';

const ProductModal = () => {
    const navigate = useNavigate();
    const { productId } = useParams(); // get ID from url
    const products = useOutletContext(); // get products array from restaurant page

    const [quantity, setQuantity] = useState(1);

    const [selectedExtras, setSelectedExtras] = useState([]);

    // get spesific product by URL ID parameter
    // mongo supports both id and _.id (for future)
    const product = products?.find(p => p.id === productId || p._id === productId);

    //handle selecting extras
    const handleExtraToggle = (extraId) => {
        setSelectedExtras(prev => {
            // If already selected, remove it
            if (prev.includes(extraId)) {
                return prev.filter(id => id !== extraId);
            }
            // Otherwise, add it to the selected array
            return [...prev, extraId];
        });
    };

    const extrasTotalCost = selectedExtras.reduce((total, extraId) => {
        const extraItem = products?.find(p => p.id === extraId || p._id === extraId);
        return total + (extraItem?.price || 0);
    }, 0);

    const finalPrice = (product.price + extrasTotalCost) * quantity;



    const handleClose = () => {
        navigate(-1);
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    // if product not found, render nothing
    if (!product) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-container" onClick={handleModalClick}>

                <button className="close-modal-btn" onClick={handleClose}>✕</button>

                <div className="modal-scrollable-content">
                    <img src={product.image} alt={product.name} className="modal-hero-image" />

                    <div className="modal-header-info">
                        <h2 className="modal-product-name">{product.name}</h2>
                        <div className="modal-price-row">
                            <span className="modal-price">₪{product.price.toFixed(2)}</span>
                            {product.isPopular && (<span className="popular-badge">Popular</span>)}
                        </div>
                        <p className="modal-description">{product.description}</p>
                    </div>

                    <div className="modal-divider"></div>

                    {/* Extras Section */}
                    <div className="modal-section">
                        <div className="section-header">
                            <h3>Optional Changes In Dish</h3>
                        </div>

                        <div className="extras-list">
                            {product.extras && product.extras.map((extraId, index) => {
                                // Find the actual product object for this extra ID from the main products list
                                const extraProduct = products?.find(p => p.id === extraId || p._id === extraId);

                                // If the extra product is not found in the list, do not render it
                                if (!extraProduct) return null;

                                const actualExtraId = extraProduct.id || extraProduct._id;
                                
                                return (
                                    <label key={index} className="extra-item">
                                        <input type="checkbox" name={extraProduct.name} value={actualExtraId} onChange={()=>{
                                            handleExtraToggle(actualExtraId)
                                        }} />
                                        <span className="extra-name">{extraProduct.name}</span>

                                        {/* if extras cost additional money, display it here */}
                                        {extraProduct.price > 0 && (
                                            <span className="extra-price-tag"> +₪{extraProduct.price.toFixed(2)}</span>
                                        )}
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="recommendations-placeholder">
                        {/* RecommendationsComponent will go here later */}
                    </div>
                </div>

                <div className="modal-sticky-footer">
                    <div className="quantity-selector">
                        <button onClick={decreaseQuantity} className="qty-btn">−</button>
                        <span className="qty-number">{quantity}</span>
                        <button onClick={increaseQuantity} className="qty-btn">+</button>
                    </div>

                    <button className="add-to-order-btn">
                        Add to order ₪{(finalPrice).toFixed(2)}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProductModal;