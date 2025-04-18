import React from 'react';
import defaultImage from '../assets/placehoder.jpg'; // Actual import

const MenuItem = ({ item, onAddToCart }) => {
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevents infinite loop in case default also fails
    e.target.src = defaultImage;
  };

  return (
    <div className="border p-4 rounded shadow">
      <img
        src={item.image || defaultImage}
        alt={item.name}
        className="w-full h-40 object-cover mb-2"
        onError={handleImageError}
      />
      <h2 className="text-xl font-semibold">{item.name}</h2>
      <p className="text-gray-600">{item.description}</p>
      <p className="text-lg font-bold">Ksh. {item.price}</p>
      <button
        onClick={() => onAddToCart(item)}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default MenuItem;
