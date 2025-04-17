import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';
import Cart from '../components/Cart';
import MenuItem from '../components/MenuItem';

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const location = useLocation();
  const tableId = new URLSearchParams(location.search).get('table') || 'Unknown';

  useEffect(() => {
    api.get('/menu').then((res) => setMenu(res.data)).catch((err) => console.error(err));
  }, []);

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem._id === item._id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Menu (Table {tableId})</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {menu.map((item) => (
          <MenuItem key={item._id} item={item} onAddToCart={addToCart} />
        ))}
      </div>
      <Cart cart={cart} setCart={setCart} tableId={tableId} />
    </div>
  );
};

export default Menu;