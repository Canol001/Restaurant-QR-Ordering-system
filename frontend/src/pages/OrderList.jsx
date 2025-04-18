import { useEffect, useState } from 'react';
import api from '../api';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/api/orders').then((res) => setOrders(res.data)).catch((err) => console.error(err));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/api/orders/${id}`, { status });
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
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded shadow">
              <p className="font-bold text-lg">Table: {order.tableId}</p>
              <p className="text-gray-600">Status: {order.status}</p>
              <p className="text-gray-600">
                Items:{' '}
                {order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}
              </p>
              <p className="font-semibold">Total: ${order.total.toFixed(2)}</p>
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => updateStatus(order._id, 'Preparing')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                  disabled={order.status !== 'Pending'}
                >
                  Mark as Preparing
                </button>
                <button
                  onClick={() => updateStatus(order._id, 'Ready')}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:bg-gray-400"
                  disabled={order.status !== 'Preparing'}
                >
                  Mark as Ready
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;