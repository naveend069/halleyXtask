"use client";

import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import ThemeSwitcher from '../components/ThemeSwitcher';
import useAuth from '../hooks/useAuth';
import { useToast, ToastContainer } from '../components/ui/Toast';
import ErrorBoundary from '../components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const {
    isLoggedIn,
    userRole,
    userEmail,
    isImpersonating,
    impersonatedEmail,
    logout,
    stopImpersonation,
  } = useAuth();

  const { toasts, removeToast } = useToast();

  const handleLogout = () => {
    if (isImpersonating) {
      stopImpersonation();
    } else {
      logout();
    }
  };

  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: 'class',
                theme: {
                  extend: {
                    colors: {
                      'primary-color': 'var(--primary-color)',
                      'primary-hover-color': 'var(--primary-hover-color)',
                      'accent-color': 'var(--accent-color)',
                      'text-color': 'var(--text-color)',
                      'secondary-text-color': 'var(--secondary-text-color)',
                      'card-background': 'var(--card-background)',
                      'input-background': 'var(--input-background)',
                      'border-color': 'var(--border-color)',
                      'error-color': 'var(--error-color)',
                      'product-price': 'var(--product-price)',
                    },
                    borderRadius: {
                      'border-radius': 'var(--border-radius)',
                      'border-radius-sm': 'var(--border-radius-sm)',
                    },
                    boxShadow: {
                      'card-shadow': 'var(--card-shadow)',
                      'card-hover-shadow': 'var(--card-hover-shadow)',
                      'button-shadow': 'var(--button-shadow)',
                      'button-hover-shadow': 'var(--button-hover-shadow)',
                    },
                  },
                },
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ErrorBoundary>
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">H</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    HalleyX
                  </span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                  <Link
                    href="/"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
                  >
                    Home
                  </Link>

                  {isLoggedIn ? (
                    <>
                      <Link
                        href={userRole === 'admin' ? '/admin' : '/dashboard'}
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
                      >
                        Dashboard {userEmail ? `(${userEmail})` : ''}
                        {isImpersonating && (
                          <span className="ml-2 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                            Impersonating {impersonatedEmail}
                          </span>
                        )}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                          isImpersonating
                            ? 'bg-orange-600 hover:bg-orange-700 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        {isImpersonating ? 'Stop Impersonation' : 'Logout'}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
                      >
                        Customer Login
                      </Link>
                      <Link
                        href="/admin/login"
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
                      >
                        Admin Login
                      </Link>
                      <Link
                        href="/register"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </nav>

                {/* Theme Switcher */}
                <div className="flex items-center space-x-4">
                  <ThemeSwitcher />
                </div>

                {/* Mobile Menu Button (Placeholder) */}
                <div className="md:hidden">
                  <button className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  &copy; 2025 HalleyX Project. All rights reserved.
                </p>
                <div className="mt-4 flex justify-center space-x-6">
                  <Link
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </ErrorBoundary>

        {/* Toasts */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </body>
    </html>
  );
}
