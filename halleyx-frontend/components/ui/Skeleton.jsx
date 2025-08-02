// components/ui/Skeleton.jsx
import React from 'react';

const Skeleton = ({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4',
  rounded = 'rounded',
  animate = true 
}) => {
  return (
    <div
      className={`
        ${width} 
        ${height} 
        ${rounded}
        bg-gray-200 
        dark:bg-gray-700
        ${animate ? 'animate-pulse' : ''}
        ${className}
      `}
    />
  );
};

// Predefined skeleton components
export const ProductCardSkeleton = () => (
  <div className="bg-card-background rounded-border-radius p-4 shadow-card-shadow">
    <Skeleton className="w-full h-48 mb-4" rounded="rounded-lg" />
    <Skeleton className="w-3/4 h-6 mb-2" />
    <Skeleton className="w-1/2 h-4 mb-4" />
    <Skeleton className="w-full h-10" rounded="rounded-lg" />
  </div>
);

export const CartItemSkeleton = () => (
  <div className="flex items-center space-x-4 p-4 bg-card-background rounded-border-radius">
    <Skeleton className="w-16 h-16" rounded="rounded-lg" />
    <div className="flex-1 space-y-2">
      <Skeleton className="w-3/4 h-4" />
      <Skeleton className="w-1/2 h-4" />
    </div>
    <Skeleton className="w-20 h-8" rounded="rounded-lg" />
  </div>
);

export const TableRowSkeleton = ({ columns = 4 }) => (
  <div className="flex space-x-4 p-4">
    {Array.from({ length: columns }).map((_, index) => (
      <Skeleton key={index} className="flex-1 h-4" />
    ))}
  </div>
);

export default Skeleton; 