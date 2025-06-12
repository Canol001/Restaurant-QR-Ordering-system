import React from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const Cart = ({ cart, setCart, tableId }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const generateRandomUserId = () => {
  return Array.from(crypto.getRandomValues(new Uint8Array(12)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

  const submitOrder = async () => {
  try {
    const payload = {
      tableId,
      items: cart,
      total,
      userId: generateRandomUserId(),
    };

    console.log('📦 Submitting order with payload:', payload);

    const response = await api.post('/api/orders', payload);
    console.log('✅ Order submitted successfully:', response.data);

    // 🔒 Save the order to sessionStorage
    const existingOrders = JSON.parse(sessionStorage.getItem('orders') || '[]');
    sessionStorage.setItem('orders', JSON.stringify([...existingOrders, payload]));

    setCart([]); // clear the cart
    toast.success('Order submitted successfully!');
  } catch (error) {
    console.error('❌ Error submitting order:', error.response?.data || error.message);
    toast.error('Failed to submit order. Try again.');
  }
};


  const updateQuantity = (index, quantity) => {
    const newCart = [...cart];
    newCart[index].quantity = quantity;
    if (quantity === 0) newCart.splice(index, 1);
    setCart(newCart);
  };

  return (
    <div className="mt-6 p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">🛒 Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b">
              <div className="flex-1">
                <p>{item.name}</p>
                <p className="text-sm text-gray-600">Ksh. {item.price.toFixed(2)} each</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => updateQuantity(index, item.quantity - 1)}
                  className="bg-gray-300 px-2 rounded-l"
                >
                  -
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(index, item.quantity + 1)}
                  className="bg-gray-300 px-2 rounded-r"
                >
                  +
                </button>
              </div>
              <p className="ml-4 font-medium">Ksh. {(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="mt-4 flex justify-between items-center font-bold text-lg">
            <span>Total:</span>
            <span>Ksh. {total.toFixed(2)}</span>
          </div>
          <button
            onClick={submitOrder}
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600 transition"
          >
            ✅ Submit Order
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
