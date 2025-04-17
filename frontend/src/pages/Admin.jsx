import React, { useEffect, useState } from 'react';
import api from '../api';
import OrderForm from '../components/OrderForm';

const Admin = () => {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    api.get('/api/menu').then((res) => setMenu(res.data)).catch((err) => console.error(err));
  }, []);

  const addMenuItem = (item) => {
    setMenu([...menu, item]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <OrderForm onAdd={addMenuItem} />
      <h2 className="text-xl font-semibold mt-6">Menu Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {menu.map((item) => (
          <div key={item._id} className="border p-4 rounded">
            <h3 className="text-lg font-bold">{item.name}</h3>
            <p>{item.description}</p>
            <p>Ksh. {item.price}</p>
            <p>Category: {item.category}</p>
            {item.image && <img src={item.image} alt={item.name} className="w-full h-40 object-cover mt-2" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;