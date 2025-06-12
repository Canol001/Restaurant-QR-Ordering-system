import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Admin from './pages/Admin';
import Menu from './pages/Menu';
import OrderList from './pages/OrderList';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast'; // 🚀 Import this

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} /> {/* 🔥 Add this line */}
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Admin Route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* Default routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="*" element={<h1 className="text-center mt-10">404: Page Not Found</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
