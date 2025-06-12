import { useEffect, useState } from 'react';
import api from '../api';

const OrderSidebar = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (isOpen) fetchOrders();
  }, [isOpen]);

  const fetchOrders = () => {
    api.get('/api/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error('Error fetching orders:', err));
  };

  const updateOrderStatus = (id, newStatus) => {
    api.patch(`/api/orders/${id}/status`, { status: newStatus })
      .then(() => fetchOrders())
      .catch(err => console.error('Error updating status:', err));
  };

  const deleteOrder = (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    api.delete(`/api/orders/${id}`)
      .then(() => fetchOrders())
      .catch(err => console.error('Error deleting order:', err));
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">Order Requests</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-black text-2xl">&times;</button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          orders.map((order, idx) => (
            <div key={order._id || idx} className="border p-3 rounded mb-3 shadow-sm">
              <p><strong>Table:</strong> {order.tableId ?? 'N/A'}</p>
              <p><strong>Items:</strong></p>
              <ul className="list-disc ml-6">
                {Array.isArray(order.items) && order.items.length > 0 ? (
                  order.items.map((item, i) => (
                    <li key={i}>{item.name} {item.quantity ? `x${item.quantity}` : ''}</li>
                  ))
                ) : (
                  <li>No items listed</li>
                )}
              </ul>
              <p><strong>Status:</strong> {order.status ?? 'Pending'}</p>
              <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                {order.status !== 'Preparing' && (
                  <button
                    onClick={() => updateOrderStatus(order._id, 'Preparing')}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-3 py-1 rounded"
                  >
                    Mark as Preparing
                  </button>
                )}
                {order.status !== 'Ready' && (
                  <button
                    onClick={() => updateOrderStatus(order._id, 'Ready')}
                    className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
                  >
                    Mark as Ready
                  </button>
                )}
                <button
                  onClick={() => deleteOrder(order._id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderSidebar;
