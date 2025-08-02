// components/ProductCard.jsx
import React, { memo } from 'react';
import { useApi } from '../hooks/useApi';
import { useToast } from './ui/Toast';

const ProductCard = memo(({ product, onAddToCart }) => {
  const { post, loading } = useApi();
  const { showSuccess, showError } = useToast();

  const handleAddToCart = async () => {
    try {
      await post('/cart/add', {
        productId: product.id,
        quantity: 1
      });
      showSuccess('Product added to cart!');
      if (onAddToCart) {
        onAddToCart();
      }
    } catch (error) {
      showError('Failed to add product to cart');
    }
  };

  return (
    <div className="bg-card-background rounded-border-radius p-4 shadow-card-shadow hover:shadow-card-hover-shadow transition-all duration-300 transform hover:-translate-y-1">
      <div className="aspect-square mb-4 overflow-hidden rounded-lg">
        <img
          src={product.imageUrl || `https://placehold.co/400x400/A8E6CF/0A524D?text=${product.name?.substring(0, 1) || 'P'}`}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/400x400/A8E6CF/0A524D?text=No+Image";
          }}
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-text-color line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-product-price font-bold text-xl">
          ${product.price.toFixed(2)}
        </p>
        
        <p className="text-secondary-text-color text-sm line-clamp-3">
          {product.description}
        </p>
        
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="w-full bg-primary-color text-button-text-color py-2 px-4 rounded-border-radius-sm font-medium hover:bg-primary-hover-color transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-button-shadow hover:shadow-button-hover-shadow"
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard; 