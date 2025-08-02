// halleyx-frontend/app/ClientLayout.js
'use client'; // This component MUST be a client component

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google'; // Import Inter font here

// Initialize Inter font (this belongs here)
const inter = Inter({ subsets: ['latin'] });

export default function ClientLayout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Effect to read preferred theme from local storage or system preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  // Effect to apply theme class to html element and save preference to local storage
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <html lang="en" className={isDarkMode ? 'dark-mode' : ''}>
      <body className={inter.className}>
        {/* Universal Header */}
        <header className="home-header">
          <div className="logo-section">
            <h1>Naveen Shop</h1>
          </div>
          <nav className="home-nav">
            <Link href="/admin/login" className="nav-link">Admin Login</Link>
            <Link href="/login" className="nav-link">Customer Login</Link>
            <Link href="/register" className="nav-link">Register</Link>
            <button onClick={toggleDarkMode} className="theme-toggle-button" aria-label="Toggle Dark Mode">
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sun">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-moon">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
          </nav>
        </header>

        <div className="main-content-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}
