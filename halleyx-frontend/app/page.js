'use client';

import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <main style={styles.container}>
      <h1 style={styles.heading}>Welcome to N-Bar</h1>
      <p style={styles.tagline}>Fuel Your Body. Nourish Your Life</p>

      <div style={styles.buttonGroup}>
        <Link href="/admin/login" style={styles.button}>
          Admin Login
        </Link>
        <Link href="/login" style={styles.button}>
          Customer Login
        </Link>
        <Link href="/register" style={styles.button}>
          Register
        </Link>
      </div>
    </main>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(to right, #2c3e50, #4ca1af)',
    color: 'white',
    padding: '20px',
  },
  heading: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  tagline: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#2c3e50',
    textDecoration: 'none',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
  },
};
