// halleyx-frontend/components/CartDisplay.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { useToast } from './ui/Toast';
import LoadingSpinner from './ui/LoadingSpinner';
import Skeleton, { CartItemSkeleton } from './ui/Skeleton';

export default function CartDisplay({ token, refreshKey }) {
  const [cart, setCart] = useState(null);
  const { loading, error, get, patch, post, clearError } = useApi();
  const { showSuccess, showError } = useToast();

  const fetchCart = useCallback(async () => {
    try {
      const data = await get('/cart');
      setCart(data);
    } catch (err) {
      showError('Could not load cart. Please try again.');
    }
  }, [get, showError]);

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token, fetchCart, refreshKey]);

  const updateItemQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 0) return;

    try {
      await patch(`/cart/items/${cartItemId}`, { quantity: newQuantity });
      await fetchCart();
      showSuccess('Cart updated successfully');
    } catch (err) {
      showError('Could not update item quantity.');
    }
  };

  const removeItemByProductId = async (productId) => {
    if (!window.confirm('Are you sure you want to remove this item from your cart?')) {
      return;
    }
    try {
      await post('/cart/remove', { productId });
      await fetchCart();
      showSuccess('Item removed from cart');
    } catch (err) {
      showError('Could not remove item.');
    }
  };

  const clearEntireCart = async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to clear cart');
      }

      await fetchCart();
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err.message || 'Could not clear cart.');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToCheckout = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }

    if (!window.confirm('Are you sure you want to place this order?')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const orderData = await res.json();
      alert(`Order placed successfully! Order ID: ${orderData.id.substring(0, 8)}... Total: $${orderData.totalAmount.toFixed(2)}`);
      await fetchCart(); // Re-fetch cart (should be empty now)
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.message || 'Could not place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <CartItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <button 
          onClick={clearError}
          className="ml-2 underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600">Start shopping to add items to your cart!</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Your Shopping Cart</h2>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.cartItemId} className="flex items-center justify-between border-b last:border-b-0 py-4">
            <div className="flex items-center space-x-4">
              <img
                src={item.product?.imageUrl || `https://placehold.co/100x100/A8E6CF/0A524D?text=${item.productName?.substring(0, 1) || 'P'}`}
                alt={item.productName || 'Product'}
                className="w-20 h-20 object-cover rounded-lg shadow-sm"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/A8E6CF/0A524D?text=No+Image"; }}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{item.productName}</h3>
                <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
                <p className="text-gray-600">Subtotal: ${(item.total).toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => updateItemQuantity(item.cartItemId, item.quantity - 1)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || item.quantity <= 1}
              >
                -
              </button>
              <span className="text-xl font-medium text-gray-800 w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateItemQuantity(item.cartItemId, item.quantity + 1)}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                +
              </button>
              <button
                onClick={() => removeItemByProductId(item.productId)}
                className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                title="Remove Item"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-4 border-t flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Total: ${cart.totalAmount.toFixed(2)}</h3>
        <div className="flex space-x-4">
          <button
            onClick={clearEntireCart}
            className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Clear Cart
          </button>
          <button
            onClick={handleProceedToCheckout}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
