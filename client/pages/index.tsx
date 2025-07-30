// client/pages/index.tsx
import React from 'react';
import { useRouter } from 'next/router'; // Використовуємо useRouter з Next.js
// Прибираємо імпорти Link з react-router-dom, User, Event, Button, Card, CardContent, CardDescription, CardHeader, CardTitle
// Прибираємо імпорти іконок, крім тих, що використовуються в хедері та футері (Mail, Twitter, Instagram, Linkedin)
import { Mail, Twitter, Instagram, Linkedin } from 'lucide-react';

// Dot pattern component (залишаємо, оскільки це частина дизайну)
const DotPattern = () => (
  <div className="absolute inset-0 opacity-30">
    <div className="absolute top-20 right-1/4 w-64 h-48">
      {Array.from({ length: 12 }).map((_, row) => (
        <div key={row} className="flex justify-center space-x-3 mb-3">
          {Array.from({ length: 8 }).map((_, col) => (
            <div
              key={col}
              className="w-1 h-1 bg-gray-400 rounded-full"
              style={{
                opacity: Math.random() * 0.8 + 0.2,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

const HomePage: React.FC = () => {
  const router = useRouter(); // Ініціалізуємо useRouter

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 relative overflow-hidden">
      <DotPattern />

      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-900 rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 border border-white rounded-sm"></div>
              </div>
              <h1 className="text-sm font-light tracking-[0.2em] uppercase text-gray-700">
                ConectEvents<br />
                <span className="text-xs">and Partners</span>
              </h1>
            </div>

            {/* Прибираємо навігацію "About", "Services" тощо, залишаємо лише кнопки соціальних мереж, якщо вони потрібні в хедері */}
            <nav className="hidden md:flex items-center space-x-12">
              {/* Якщо вам потрібно залишити пусті посилання, ось як можна */}
              {/* <a href="#" className="text-xs font-light tracking-[0.15em] text-gray-600 hover:text-gray-900 uppercase transition-colors">About</a> */}
              {/* <a href="#" className="text-xs font-light tracking-[0.15em] text-gray-600 hover:text-gray-900 uppercase transition-colors">Services</a> */}
            </nav>

            <div className="flex items-center space-x-4">
              <Instagram className="w-4 h-4 text-gray-500 hover:text-gray-900 cursor-pointer transition-colors" />
              <Twitter className="w-4 h-4 text-gray-500 hover:text-gray-900 cursor-pointer transition-colors" />
              <Mail className="w-4 h-4 text-gray-500 hover:text-gray-900 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="max-w-4xl">
            <div className="mb-8">
              <h1 className="text-6xl lg:text-8xl font-extralight tracking-[0.05em] leading-[0.9] text-gray-900 mb-12">
                COMMUNITY<br />
                EVENT<br />
                <span className="font-light">PLANNING</span>
              </h1>

              <div className="mb-16">
                <p className="text-sm font-light text-gray-600 mb-4 tracking-[0.05em]">
                  Transform your vision into extraordinary experiences that
                </p>
                <p className="text-sm font-light text-gray-600 tracking-[0.05em]">
                  captivate, engage, and inspire your community.
                </p>
              </div>

              <div className="mb-16">
                <p className="text-xs font-light text-gray-500 tracking-[0.2em] uppercase mb-4">
                  July 30, 2025 at 12:00 PM EST
                </p>

                {/* Кнопка "Learn More" тепер перенаправляє на сторінку логіну */}
                <button
                  onClick={handleLoginRedirect}
                  className="border border-gray-300 px-8 py-3 text-xs font-light tracking-[0.2em] uppercase text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300"
                >
                  Learn More {/* Змінив текст кнопки на "Увійти", щоб було зрозуміло */}
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-12 right-8 text-xs font-light text-gray-400">
            ×
          </div>
        </div>
      </main>

      {/* Footer - Додаємо футер з фігми, якщо він потрібен. В оригінальному коді його не було. */}
      {/* Якщо футер потрібен з дизайну, його потрібно додати сюди. */}
      {/* Наприклад: */}
      <footer className="relative z-10 py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center text-xs text-gray-500">
          <div>© 2025 ConectEvents. All rights reserved.</div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
          </div>
          <div className="flex items-center space-x-4">
            <Linkedin className="w-4 h-4 hover:text-gray-900 cursor-pointer transition-colors" />
            <Twitter className="w-4 h-4 hover:text-gray-900 cursor-pointer transition-colors" />
            <Instagram className="w-4 h-4 hover:text-gray-900 cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;