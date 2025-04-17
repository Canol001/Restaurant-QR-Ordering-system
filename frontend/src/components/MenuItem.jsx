import React from 'react';

const MenuItem = ({ item, onAddToCart }) => {
  return (
    <div className="border p-4 rounded shadow">
      {item.image && (
        <img src={item.image} alt={item.name} className="w-full h-40 object-cover mb-2" />
      )}
      <h2 className="text-xl font-semibold">{item.name}</h2>
      <p className="text-gray-600">{item.description}</p>
      <p className="text-lg font-bold">${item.price}</p>
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