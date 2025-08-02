// halleyx-frontend/app/admin/orders/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const API_BASE_URL = 'http://localhost:5000';

  // Fetch token and user role on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
      return;
    }
    setToken(storedToken);

    // Decode JWT to get user role (client-side only for display/routing)
    try {
      const payload = JSON.parse(atob(storedToken.split('.')[1]));
      setUserRole(payload.role);
      if (payload.role !== FrontendRole.ADMIN) {
        alert('Access Denied: You must be an administrator to view this page.');
        router.push('/dashboard'); // Redirect non-admins
      }
    } catch (err) {
      console.error('Error decoding token:', err);
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router]);

  // Fetch all orders if user is admin and token is available
  useEffect(() => {
    if (token && userRole === FrontendRole.ADMIN) {
      const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`${API_BASE_URL}/orders/admin/all`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch all orders');
          }

          const data = await res.json();
          setOrders(data);
        } catch (err) {
          console.error('Error fetching all orders:', err);
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
    }
  }, [token, userRole, router]);

  // Handle status update
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change order ${orderId.substring(0, 8)}... status to ${newStatus}?`)) {
      return;
    }

    setLoading(true); // Set loading while updating
    try {
      const res = await fetch(`${API_BASE_URL}/orders/admin/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update order status');
      }

      // Refresh orders list after successful update
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert(`Order ${orderId.substring(0, 8)}... status updated to ${newStatus}.`);
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err.message || 'Could not update order status.');
    } finally {
      setLoading(false); // Reset loading
    }
  };


  if (loading || userRole === null) {
    return (
      <div className="auth-page-container">
        <div className="auth-card auth-dashboard-card">
          <p className="auth-link-text text-xl">Loading admin orders...</p>
        </div>
      </div>
    );
  }

  if (userRole !== FrontendRole.ADMIN) {
    return (
      <div className="auth-page-container">
        <div className="auth-card auth-dashboard-card">
          <p className="auth-error text-xl">Access Denied</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-page-container">
        <div className="auth-card auth-dashboard-card">
          <p className="auth-error text-xl">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-container"> {/* Use auth-page-container for consistent background */}
      <div className="auth-card auth-dashboard-card"> {/* Use auth-card for glass effect, wider for content */}
        <h2 className="auth-title mb-8 border-b pb-4 w-full">All Customer Orders (Admin View)</h2> {/* Use auth-title */}

        {orders.length === 0 ? (
          <div className="text-center w-full">
            <p className="auth-link-text text-lg">No orders found in the system.</p>
          </div>
        ) : (
          <div className="space-y-8 w-full">
            {orders.map((order) => (
              <div key={order.id} className="product-item p-6"> {/* Reusing product-item for card-like styling */}
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--product-item-border)]">
                  <div>
                    <h3 className="product-name text-xl">Order ID: {order.id.substring(0, 8)}...</h3> {/* Use product-name */}
                    <p className="auth-link-text text-sm">Customer: {order.customerName} ({order.customerEmail})</p>
                    <p className="auth-link-text text-sm">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === FrontendOrderStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                      order.status === FrontendOrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                      order.status === FrontendOrderStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className="ml-2 p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        borderColor: 'var(--input-border)',
                        color: 'var(--text-color)',
                        transition: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease'
                      }}
                    >
                      {Object.values(FrontendOrderStatus).map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3 mb-4 w-full">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.productImageUrl || `https://placehold.co/80x80/A8E6CF/0A524D?text=${item.productName?.substring(0, 1) || 'P'}`}
                        alt={item.productName || 'Product'}
                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/80x80/A8E6CF/0A524D?text=No+Image"; }}
                      />
                      <div>
                        <p className="product-name text-base">{item.productName}</p> {/* Use product-name */}
                        <p className="auth-link-text text-sm">Quantity: {item.quantity} x ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-right pt-4 border-t border-[var(--product-item-border)] w-full">
                  <p className="product-price text-xl">Total: ${order.totalAmount.toFixed(2)}</p> {/* Use product-price */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
