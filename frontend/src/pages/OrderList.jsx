import React, { useEffect, useState } from 'react';
import api from '../api';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then((res) => setOrders(res.data)).catch((err) => console.error(err));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/orders/${id}`, { status });
      setOrders(orders.map((order) => (order._id === id ? res.data : order)));
      alert(`Order marked as ${status}`);
    } catch (error) {
      alert('Error updating order');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-4 rounded mb-4">
            <p className="font-bold">Table: {order.tableId}</p>
            <p>Status: {order.status}</p>
            <p>
              Items:{' '}
              {order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}
            </p>
            <p>Total: ${order.total.toFixed(2)}</p>
            <div className="mt-2">
              <button
                onClick={() => updateStatus(order._id, 'Preparing')}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                disabled={order.status !== 'Pending'}
              >
                Mark as Preparing
              </button>
              <button
                onClick={() => updateStatus(order._id, 'Ready')}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                disabled={order.status !== 'Preparing'}
              >
                Mark as Ready
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderList;