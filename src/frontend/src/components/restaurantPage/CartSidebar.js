import React, { useState } from 'react';
import { createOrder } from '../../api/ordersApi';
import './CartSidebar.css';

const CartSidebar = ({ cartItems, restaurantId, onRemoveItem, onClearCart, products, isLoggedIn }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState(null);

  const getItemTotal = (item) => {
    const extrasCost = item.selectedExtras.reduce((sum, extraId) => {
      const extra = products.find(p => p.id === extraId || p._id === extraId);
      return sum + (extra?.price || 0);
    }, 0);
    return (item.product.price + extrasCost) * item.quantity;
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + getItemTotal(item), 0);

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);
    setError(null);

    const orderedItems = cartItems.flatMap(item => {
      const ids = [];
      for (let i = 0; i < item.quantity; i++) {
        ids.push(item.product.id || item.product._id);
        item.selectedExtras.forEach(extraId => ids.push(extraId));
      }
      return ids;
    });

    try {
      await createOrder({ restaurantId, orderedItems });
      setOrderSuccess(true);
      onClearCart();
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="cart-sidebar cart-sidebar--success">
        <div className="cart-success">
          <div className="cart-success-icon">✓</div>
          <h3>Order Placed!</h3>
          <p>Your order has been sent to the restaurant.</p>
          <button onClick={() => setOrderSuccess(false)} className="cart-new-order-btn">
            Start New Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-sidebar">
      <div className="cart-header">
        <h3 className="cart-title">Your Order</h3>
        {cartItems.length > 0 && (
          <button className="cart-clear-btn" onClick={onClearCart}>Clear all</button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <p>Add items to start your order</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item, index) => {
              const itemTotal = getItemTotal(item);
              return (
                <div key={index} className="cart-item">
                  <div className="cart-item-top">
                    <span className="cart-item-qty">{item.quantity}×</span>
                    <span className="cart-item-name">{item.product.name}</span>
                    <button className="cart-item-remove" onClick={() => onRemoveItem(index)}>✕</button>
                  </div>
                  {item.selectedExtras.length > 0 && (
                    <div className="cart-item-extras">
                      {item.selectedExtras.map(extraId => {
                        const extra = products.find(p => p.id === extraId || p._id === extraId);
                        return extra ? (
                          <span key={extraId} className="cart-extra-tag">+ {extra.name}</span>
                        ) : null;
                      })}
                    </div>
                  )}
                  <span className="cart-item-price">₪{itemTotal.toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span>₪{totalPrice.toFixed(2)}</span>
            </div>
            {error && <p className="cart-error">{error}</p>}
            {isLoggedIn ? (
              <button
                className="cart-confirm-btn"
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Placing order...' : `Confirm Order · ₪${totalPrice.toFixed(2)}`}
              </button>
            ) : (
              <a href="/login" className="cart-login-prompt">
                Log in to place your order
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CartSidebar;
