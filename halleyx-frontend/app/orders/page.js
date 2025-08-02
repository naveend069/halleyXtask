// halleyx-frontend/app/orders/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link for navigation

const FrontendRole = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
};

const FrontendOrderStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
      return;
    }
    setToken(storedToken);

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/orders`, { // Customer specific endpoint
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch orders');
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Could not load orders. Please try again.');
        if (err.message.includes('Unauthorized') || err.message.includes('Forbidden')) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-cyan-400 font-mono">
        <p className="text-xl animate-pulse">Loading orders data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-900 text-red-300 font-mono">
        <p className="text-xl">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 bg-gradient-to-br from-gray-900 to-black text-gray-100 font-mono">
      {/* Header for consistent navigation - uses global styles */}
      <header className="home-header w-full">
        <div className="logo-section">
          <h1>Naveen Shop</h1>
        </div>
        <nav className="home-nav">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
          <Link href="/orders" className="nav-link">My Orders</Link>
          {/* Admin link will not be present on customer orders page */}
          <button
            onClick={handleLogout}
            className="button bg-gray-700 text-gray-100 hover:bg-gray-600" // Adjusted button style for dark theme
          >
            Logout
          </button>
        </nav>
      </header>

      <div className="w-full max-w-5xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl rounded-2xl shadow-neon border border-blue-500/30 p-8 md:p-12 relative overflow-hidden mt-8">
        <h2 className="text-4xl font-bold text-cyan-400 mb-8 border-b-2 border-cyan-600/50 pb-4 text-center tracking-wide">
          My Order History <span className="text-blue-400">_</span>
        </h2>

        {orders.length === 0 ? (
          <div className="text-center w-full py-10">
            <p className="text-lg text-gray-300 mb-6">You haven't placed any orders yet. Time to explore our products!</p>
            <Link href="/dashboard">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8 w-full">
            {orders.map((order) => (
              <div key={order.id} className="bg-gray-800/50 border border-blue-500/20 rounded-lg p-6 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-400/50">
                {/* Subtle glitch effect on hover (conceptual, requires more CSS for full effect) */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-2 border-b border-gray-700/50">
                  <div>
                    <h3 className="text-xl font-bold text-cyan-300 mb-1">Order ID: <span className="text-blue-400">{order.id.substring(0, 8)}...</span></h3>
                    <p className="text-gray-400 text-sm">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold mt-2 md:mt-0 ${
                    order.status === FrontendOrderStatus.COMPLETED ? 'bg-green-600/30 text-green-300 border border-green-500/50' :
                    order.status === FrontendOrderStatus.PENDING ? 'bg-yellow-600/30 text-yellow-300 border border-yellow-500/50' :
                    order.status === FrontendOrderStatus.CANCELLED ? 'bg-red-600/30 text-red-300 border border-red-500/50' :
                    'bg-gray-600/30 text-gray-300 border border-gray-500/50'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4 w-full">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 bg-gray-700/30 p-3 rounded-md border border-gray-600/20">
                      <img
                        src={item.productImageUrl || `https://placehold.co/80x80/1A202C/E2E8F0?text=${item.productName?.substring(0, 1) || 'P'}`}
                        alt={item.productName || 'Product'}
                        className="w-16 h-16 object-cover rounded-lg shadow-md border border-gray-600/50"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/80x80/1A202C/E2E8F0?text=No+Image"; }}
                      />
                      <div>
                        <p className="font-semibold text-gray-200 text-base">{item.productName}</p>
                        <p className="text-gray-400 text-sm">Quantity: <span className="text-blue-300">{item.quantity}</span> x $<span className="text-blue-300">{item.price.toFixed(2)}</span></p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-right pt-4 border-t border-gray-700/50 w-full">
                  <p className="text-2xl font-bold text-green-400">Total: ${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
