// client/pages/signup.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Використовуємо Link з Next.js для навігації
import api from '../utils/api'; // Your API utility
import { AuthResponse } from '../types'; // Your types

// Імпортуємо іконки з lucide-react, які використовуються в хедері
import { Instagram, Twitter, Mail } from 'lucide-react';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await api.post<AuthResponse>('/auth/signup', { email, password });
      setMessage(res.data.message);
      localStorage.setItem('token', res.data.token); // Store the JWT token
      localStorage.setItem('userEmail', res.data.user.email); // Store user email
      localStorage.setItem('userId', res.data.user.id); // Store user ID
      router.push('/dashboard'); // Redirect to a dashboard page after successful signup
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Header - Скопійовано зі сторінки логіну */}
      <header className="w-full">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-between items-center">
            <Link href="/"> {/* Посилання на головну сторінку */}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-900 rounded-sm flex items-center justify-center">
                  <div className="w-3 h-3 border border-white rounded-sm"></div>
                </div>
                <h1 className="text-sm font-light tracking-[0.2em] uppercase text-gray-700">
                  ConectEvents<br />
                  <span className="text-xs">and Partners</span>
                </h1>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <Instagram className="w-4 h-4 text-gray-500 hover:text-gray-900 cursor-pointer transition-colors" />
              <Twitter className="w-4 h-4 text-gray-500 hover:text-gray-900 cursor-pointer transition-colors" />
              <Mail className="w-4 h-4 text-gray-500 hover:text-gray-900 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Форма реєстрації */}
      <main className="flex-grow flex items-center justify-center px-8 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extralight tracking-[0.05em] text-gray-900 mb-6">
              JOIN CONECTEVENTS
            </h1>
            <p className="text-sm font-light text-gray-600 tracking-[0.02em]">
              Create your account to start building extraordinary events.
            </p>
          </div>

          <div className="border border-gray-200 bg-white p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label htmlFor="email" className="text-xs font-light tracking-[0.1em] uppercase text-gray-700 block">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-0 border-b border-gray-200 rounded-none bg-transparent px-0 py-3 text-sm font-light focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="password" className="text-xs font-light tracking-[0.1em] uppercase text-gray-700 block">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border-0 border-b border-gray-200 rounded-none bg-transparent px-0 py-3 text-sm font-light focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 focus:outline-none"
                />
              </div>

              {/* Повідомлення про помилку або успіх */}
              {error && (
                <div className="border border-red-200 bg-red-50 text-red-800 p-3 rounded-md">
                  <p className="text-sm font-light">{error}</p>
                </div>
              )}
              {message && (
                <div className="border border-green-200 bg-green-50 text-green-800 p-3 rounded-md">
                  <p className="text-sm font-light">{message}</p>
                </div>
              )}

              <div className="pt-8">
                <button
                  type="submit"
                  className="w-full border border-gray-300 px-8 py-4 text-xs font-light tracking-[0.2em] uppercase text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300"
                >
                  Sign Up
                </button>
              </div>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm font-light text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/login" // Посилання на сторінку логіну
                  className="text-gray-900 underline hover:no-underline font-light transition-all"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
