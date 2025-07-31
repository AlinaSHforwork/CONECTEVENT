// client/pages/create-event.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Використовуємо Link з Next.js для навігації
import api from '../utils/api'; // Your API utility

// Імпортуємо іконки з lucide-react, які використовуються в хедері
import { Instagram, Twitter, Mail } from 'lucide-react';

// Прибираємо імпорт '../styles/create-event.modules.css'; оскільки ми переходимо на Tailwind CSS

// Визначаємо тип для відповіді API при створенні події
interface CreateEventResponse {
  message: string;
  // Якщо API повертає інші дані про створену подію, їх також слід додати сюди, наприклад:
  // event: {
  //   id: string;
  //   title: string;
  //   description?: string;
  //   eventDate: string;
  //   eventTime: string;
  //   location: string;
  // };
}

const CreateEventPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState(''); // YYYY-MM-DD
  const [eventTime, setEventTime] = useState(''); // HH:MM
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check for token on mount
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login'); // Redirect to login if no token
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // Вказуємо тип для відповіді API
      const res = await api.post<CreateEventResponse>('/events', {
        title,
        description,
        eventDate,
        eventTime,
        location,
      });
      setMessage(res.data.message);
      // Очистити форму після успішного створення
      setTitle('');
      setDescription('');
      setEventDate('');
      setEventTime('');
      setLocation('');
      // Перенаправити на дашборд після успішного створення події
      router.push('/dashboard');

    } catch (err: unknown) {
  if (err instanceof Error) { // Перевірка, чи err є екземпляром Error
    setError(err.message || 'Failed to create event. Please try again.');
    console.error('Create event error:', err);
  } else if (typeof err === 'object' && err !== null && 'response' in err && typeof (err as any).response === 'object' && (err as any).response !== null && 'data' in (err as any).response && typeof ((err as any).response as any).data === 'object' && ((err as any).response as any).data !== null && 'message' in ((err as any).response as any).data) {
    // Якщо помилка є об'єктом з властивостями response.data.message
    setError(((err as any).response.data.message) || 'Failed to create event. Please try again.');
    console.error('Create event error:', err);
  } else {
    // Для інших невідомих типів помилок
    setError('An unknown error occurred. Please try again.');
    console.error('Create event error:', err);
  }
}
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Header - Скопійовано з дизайну Figma */}
      <header className="w-full border-b border-gray-200">
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

      {/* Main Content - Форма створення події */}
      <main className="flex-grow flex items-center justify-center px-8 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extralight tracking-[0.05em] text-gray-900 mb-6">
              CREATE NEW EVENT
            </h1>
            <p className="text-sm font-light text-gray-600 tracking-[0.02em]">
              Fill in the details to create your extraordinary event.
            </p>
          </div>

          <div className="border border-gray-200 bg-white p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Повідомлення про помилку або успіх */}
              {message && (
                <div className="border border-green-200 bg-green-50 text-green-800 p-3 rounded-md">
                  <p className="text-sm font-light">{message}</p>
                </div>
              )}
              {error && (
                <div className="border border-red-200 bg-red-50 text-red-800 p-3 rounded-md">
                  <p className="text-sm font-light">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <label htmlFor="title" className="text-xs font-light tracking-[0.1em] uppercase text-gray-700 block">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter event title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full border-0 border-b border-gray-200 rounded-none bg-transparent px-0 py-3 text-sm font-light focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="description" className="text-xs font-light tracking-[0.1em] uppercase text-gray-700 block">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  placeholder="Describe your event"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border-0 border-b border-gray-200 rounded-none bg-transparent px-0 py-3 text-sm font-light focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 focus:outline-none min-h-[80px] resize-y"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="eventDate" className="text-xs font-light tracking-[0.1em] uppercase text-gray-700 block">
                  Date
                </label>
                <input
                  type="date"
                  id="eventDate"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  className="w-full border-0 border-b border-gray-200 rounded-none bg-transparent px-0 py-3 text-sm font-light focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="eventTime" className="text-xs font-light tracking-[0.1em] uppercase text-gray-700 block">
                  Time
                </label>
                <input
                  type="time"
                  id="eventTime"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  required
                  className="w-full border-0 border-b border-gray-200 rounded-none bg-transparent px-0 py-3 text-sm font-light focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="location" className="text-xs font-light tracking-[0.1em] uppercase text-gray-700 block">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  placeholder="Enter event location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full border-0 border-b border-gray-200 rounded-none bg-transparent px-0 py-3 text-sm font-light focus:border-gray-900 focus:ring-0 placeholder:text-gray-400 focus:outline-none"
                />
              </div>

              <div className="pt-8 flex space-x-4"> {/* Використовуємо flex для кнопок */}
                <button
                  type="submit"
                  className="flex-1 border border-gray-300 px-8 py-4 text-xs font-light tracking-[0.2em] uppercase text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300"
                >
                  Create Event
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 border border-gray-300 px-8 py-4 text-xs font-light tracking-[0.2em] uppercase text-gray-700 hover:bg-gray-700 hover:text-white hover:border-gray-700 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer - Додаємо футер для узгодженості */}
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

export default CreateEventPage;
