// client/pages/dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Використовуємо Link з Next.js для навігації
import api from '../utils/api'; // Your API utility
import { Event, EventsResponse } from '../types'; // Import types

// Імпортуємо іконки з lucide-react, які використовуються в хедері та для подій
import { Instagram, Twitter, Mail, Calendar, MapPin, Plus } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Отримуємо userEmail та userId з localStorage
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null; // Додаємо userId

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirect to login if no token
      return;
    }

    const fetchEvents = async () => {
      try {
        const res = await api.get<EventsResponse>('/events/my');
        setEvents(res.data.events);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch events');
        setLoading(false);
        console.error('Fetch events error:', err);
        // If 401, token might be expired, redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userId');
          router.push('/login');
        }
      }
    };

    fetchEvents();
  }, [router]); // Re-run effect if router changes

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  // Стан завантаження та помилки
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
        <p className="text-lg font-light tracking-[0.05em]">Завантаження подій...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">
        <p className="text-lg font-light tracking-[0.05em]">Помилка: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Header - Скопійовано з дизайну Figma для залогіненого користувача */}
      <header className="border-b border-gray-200 w-full">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <Link href="/">
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

            <div className="flex items-center space-x-12">
              <Link href="/" className="text-xs font-light tracking-[0.15em] text-gray-600 hover:text-gray-900 uppercase transition-colors">
                My Events
              </Link>
              <Link href="/create-event">
                <button className="border border-gray-300 px-6 py-2 text-xs font-light tracking-[0.2em] uppercase text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300">
                  Create Event
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-light tracking-[0.15em] text-gray-600 hover:text-gray-900 uppercase transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-8 py-16 w-full">
        <div className="mb-20">
          <h1 className="text-4xl font-extralight tracking-[0.05em] text-gray-900 mb-4">
            Welcome back, {userEmail || 'User'}!
          </h1>
          <p className="text-sm font-light text-gray-600 tracking-[0.02em] max-w-lg">
            Manage your events and connect with your community through sophisticated planning tools.
          </p>
        </div>

        {/* My Events Section */}
        <div>
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-2xl font-extralight tracking-[0.05em] text-gray-900 uppercase">
              My Events
            </h2>
            <Link href="/create-event">
              <button className="border border-gray-300 px-6 py-3 text-xs font-light tracking-[0.2em] uppercase text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 flex items-center space-x-2">
                <Plus className="w-3 h-3" />
                <span>Create New Event</span>
              </button>
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="border border-gray-200 p-20 text-center bg-white">
              <div className="mb-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-extralight tracking-[0.05em] text-gray-900 mb-3">
                  No events yet
                </h3>
                <p className="text-sm font-light text-gray-600 tracking-[0.02em] max-w-md mx-auto">
                  Create your first event to begin building extraordinary experiences for your community.
                </p>
              </div>
              <Link href="/create-event">
                <button className="border border-gray-300 px-8 py-3 text-xs font-light tracking-[0.2em] uppercase text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300">
                  Create Your First Event
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Link key={event.id} href={`/event/${event.id}`}> {/* Посилання на деталі події */}
                  <div className="border border-gray-200 bg-white hover:border-gray-400 transition-all duration-300 cursor-pointer group">
                    <div className="p-8">
                      <div className="mb-6">
                        <h3 className="text-lg font-light tracking-[0.02em] text-gray-900 group-hover:text-gray-600 transition-colors mb-2">
                          {event.title}
                        </h3>
                        <div className="w-8 h-px bg-gray-300 group-hover:bg-gray-900 transition-colors"></div>
                      </div>

                      <p className="text-sm font-light text-gray-600 mb-8 leading-relaxed line-clamp-3">
                        {event.description}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center text-xs font-light text-gray-500 tracking-[0.05em]">
                          <Calendar className="w-3 h-3 mr-3 text-gray-400" />
                          {/* Перевіряємо eventDate та eventTime */}
                          {event.eventDate ? new Date(event.eventDate).toLocaleDateString('uk-UA', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'Невідома дата'}
                          {event.eventTime && ` о ${event.eventTime}`}
                        </div>
                        <div className="flex items-center text-xs font-light text-gray-500 tracking-[0.05em]">
                          <MapPin className="w-3 h-3 mr-3 text-gray-400" />
                          {event.location || 'Невідоме місце'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer - Додаємо футер з фігми, якщо він потрібен. */}
      <footer className="relative z-10 py-12 bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 space-y-4 md:space-y-0">
          <div>© 2025 ConectEvents. All rights reserved.</div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
          </div>
          <div className="flex items-center space-x-4">
            {/*<Linkedin className="w-4 h-4 hover:text-gray-900 cursor-pointer transition-colors" />*/}
            <Twitter className="w-4 h-4 hover:text-gray-900 cursor-pointer transition-colors" />
            <Instagram className="w-4 h-4 hover:text-gray-900 cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
