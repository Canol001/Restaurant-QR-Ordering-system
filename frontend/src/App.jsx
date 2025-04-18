import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Admin from './pages/Admin';
import Menu from './pages/Menu';
import OrderList from './pages/OrderList';
import Welcome from './pages/Welcome';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
          <Route path="/welcome" element={<Welcome />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/" element={<Menu />} />
            <Route path="*" element={<h1 className="text-center mt-10">404: Page Not Found</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;