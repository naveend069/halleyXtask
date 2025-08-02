// halleyx-frontend/app/admin/customers/page.js
'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const FrontendRole = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
};

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
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

    try {
      const payload = JSON.parse(atob(storedToken.split('.')[1]));
      setUserRole(payload.role);
      if (payload.role !== FrontendRole.ADMIN) {
        alert('Access Denied: You must be an administrator to view this page.');
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Error decoding token:', err);
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router]);

  // Fetch all customers if user is admin and token is available
  const fetchCustomers = async () => {
    if (!token || userRole !== FrontendRole.ADMIN) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/customers`, { // Assuming this endpoint exists
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch customers');
      }

      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err.message || 'Could not load customers. Please try again.');
      if (err.message.includes('Unauthorized') || err.message.includes('Forbidden')) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [token, userRole]); // Re-fetch when token or userRole changes

  const handleBlockCustomer = async (customerId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    if (!window.confirm(`Are you sure you want to ${newStatus === 'BLOCKED' ? 'block' : 'activate'} this customer?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/customers/${customerId}/block`, { // Assuming this endpoint exists
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to ${newStatus === 'BLOCKED' ? 'block' : 'activate'} customer`);
      }

      alert(`Customer ${customerId.substring(0, 8)}... status updated to ${newStatus}.`);
      fetchCustomers(); // Refresh list
    } catch (err) {
      console.error('Error blocking/activating customer:', err);
      setError(err.message || 'Could not update customer status.');
    }
  };

  const handleRemoveCustomer = async (customerId) => {
    if (!window.confirm(`Are you sure you want to permanently remove customer ${customerId.substring(0, 8)}...? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/customers/${customerId}`, { // Assuming this endpoint exists
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to remove customer');
      }

      alert(`Customer ${customerId.substring(0, 8)}... successfully removed.`);
      fetchCustomers(); // Refresh list
    } catch (err) {
      console.error('Error removing customer:', err);
      setError(err.message || 'Could not remove customer.');
    }
  };

  const handleImpersonateCustomer = async (customerId, customerEmail) => {
    if (!window.confirm(`Are you sure you want to impersonate ${customerEmail}? You will be logged in as this customer.`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/impersonate/${customerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to impersonate customer');
      }

      const data = await res.json();
      
      // Store the impersonation token and original admin token
      localStorage.setItem('impersonationToken', data.token);
      localStorage.setItem('originalAdminToken', token);
      localStorage.setItem('isImpersonating', 'true');
      localStorage.setItem('impersonatedCustomerEmail', customerEmail);
      
      alert(`Successfully impersonating ${customerEmail}. You can now browse as this customer.`);
      router.push('/dashboard'); // Redirect to customer dashboard
    } catch (err) {
      console.error('Error impersonating customer:', err);
      setError(err.message || 'Could not impersonate customer.');
    }
  };

  const handleStopImpersonation = () => {
    if (localStorage.getItem('isImpersonating') === 'true') {
      localStorage.removeItem('impersonationToken');
      localStorage.removeItem('isImpersonating');
      localStorage.removeItem('impersonatedCustomerEmail');
      
      // Restore admin token
      const originalToken = localStorage.getItem('originalAdminToken');
      if (originalToken) {
        localStorage.setItem('token', originalToken);
        localStorage.removeItem('originalAdminToken');
      }
      
      alert('Impersonation stopped. You are now back to admin mode.');
      router.push('/admin');
    }
  };

  if (loading || userRole === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-xl text-gray-900 dark:text-white">Loading customer management...</p>
        </div>
      </div>
    );
  }

  if (userRole !== FrontendRole.ADMIN) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-xl text-red-600 dark:text-red-400">Access Denied</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-xl text-red-600 dark:text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Customer Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage customers and impersonate accounts for support
              </p>
            </div>
            <div className="flex space-x-4">
              {localStorage.getItem('isImpersonating') === 'true' && (
                <button 
                  onClick={handleStopImpersonation}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Stop Impersonation
                </button>
              )}
              <Link 
                href="/admin"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Back to Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Customers</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage customer accounts and impersonate for support</p>
          </div>
          
          <div className="p-6">
            {customers.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No customers</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No customers have registered yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {customers.map((customer) => (
                  <div key={customer.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {customer.firstName} {customer.lastName}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                          Email: {customer.email}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Status: 
                          <span className={`ml-2 font-semibold ${customer.status === 'ACTIVE' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {customer.status}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleImpersonateCustomer(customer.id, customer.email)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                          Impersonate
                        </button>
                        <button
                          onClick={() => handleBlockCustomer(customer.id, customer.status)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            customer.status === 'ACTIVE' 
                              ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          {customer.status === 'ACTIVE' ? 'Block' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleRemoveCustomer(customer.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
