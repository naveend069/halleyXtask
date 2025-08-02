'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <nav className="w-full bg-white shadow-md py-3 px-6 flex justify-between items-center sticky top-0 z-50">
      <div className="text-xl font-bold text-black">
        <Link href="/">Halleyx Portal</Link>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-700">
              {user.role === 'ADMIN' ? 'Admin' : 'Customer'}: {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
            >
              Logout
            </button>
            </>
            ) : (
            <>
                <Link href="/login" className="text-sm hover:underline">
                Login
                </Link>
                <Link href="/register" className="text-sm hover:underline">
                Register
                </Link>
            </>
            )}
        </div>
        </nav>
    );
    }
