// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Обязательно для базового HTML
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Все файлы Vue и TS/JS в src
    // Добавьте другие пути, если нужно
  ],
};
