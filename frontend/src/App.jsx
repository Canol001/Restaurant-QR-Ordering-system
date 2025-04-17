import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Admin from './pages/Admin';
import Menu from './pages/Menu';
import OrderList from './pages/OrderList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/menu" element={<Menu />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/" element={<Menu />} /> {/* Default route */}
      </Routes>
    </Router>
  );
}

export default App;