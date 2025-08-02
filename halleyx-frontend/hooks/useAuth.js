'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedEmail, setImpersonatedEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const storedEmail = localStorage.getItem('email');
    const impersonating = localStorage.getItem('impersonating') === 'true';
    const impersonated = localStorage.getItem('impersonatedEmail');

    if (storedRole && storedEmail) {
      setIsLoggedIn(true);
      setUserRole(storedRole);
      setUserEmail(storedEmail);
      setIsImpersonating(impersonating);
      setImpersonatedEmail(impersonated);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (role, email) => {
    localStorage.setItem('role', role);
    localStorage.setItem('email', email);
    setIsLoggedIn(true);
    setUserRole(role);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    setUserEmail(null);
    setIsImpersonating(false);
    setImpersonatedEmail(null);
    router.push('/');
  };

  const stopImpersonation = () => {
    localStorage.removeItem('impersonating');
    localStorage.removeItem('impersonatedEmail');
    setIsImpersonating(false);
    setImpersonatedEmail(null);
  };

  const requireAuth = (allowedRoles) => {
    if (!isLoading && (!isLoggedIn || !allowedRoles.includes(userRole))) {
      router.push('/');
    }
  };

  const hasRole = (role) => {
    return userRole === role;
  };

  return {
    isLoggedIn,
    userRole,
    userEmail,
    isImpersonating,
    impersonatedEmail,
    isLoading,
    handleLogin,
    handleLogout,
    requireAuth,
    hasRole,
    logout: handleLogout,          // <-- Fix for layout.js
    stopImpersonation,             // <-- Fix for layout.js
  };
};

export default useAuth;
