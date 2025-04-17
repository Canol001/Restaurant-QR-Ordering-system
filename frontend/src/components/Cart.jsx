import React from 'react';
import api from '../api';

const Cart = ({ cart, setCart, tableId }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const submitOrder = async () => {
    try {
      await api.post('/api/orders', { tableId, items: cart, total });
      setCart([]);
      alert('Order submitted successfully!');
    } catch (error) {
      alert('Error submitting order');
      console.error(error);
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
      <h2 className="text-xl font-bold">Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between py-2">
              <p>{item.name} x {item.quantity}</p>
              <div>
                <button
                  onClick={() => updateQuantity(index, item.quantity - 1)}
                  className="bg-gray-300 px-2"
                >
                  -
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(index, item.quantity + 1)}
                  className="bg-gray-300 px-2"
                >
                  +
                </button>
              </div>
              <p>Ksh. {(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <p className="font-bold mt-2">Total: Ksh. {total.toFixed(2)}</p>
          <button
            onClick={submitOrder}
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
          >
            Submit Order
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;