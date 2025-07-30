/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // Для файлів у папці pages (якщо використовуєте Pages Router)
    "./components/**/*.{js,ts,jsx,tsx}", // Для ваших компонентів
    "./app/**/*.{js,ts,jsx,tsx}", // Для файлів у папці app (якщо використовуєте App Router)
    "./styles/**/*.{js,ts,jsx,tsx}", // Для стилів, якщо використовуєте Tailwind у CSS
    // Додайте інші шляхи, якщо у вас є інші папки з компонентами або сторінками
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

