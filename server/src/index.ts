// server/src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import prisma from './lib/prisma';
import authRoutes from './routes/authRoutes'; // Import auth routes
import eventRoutes from './routes/eventRoutes'; // Import event routes
import cron from 'node-cron'; // <-- Додайте цей імпорт
import axios from 'axios'; // <-- Додайте axios для HTTP-запитів

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000; // Use port 5000 for backend 
const BACKEND_URL = process.env.BACKEND_URL;

// Перевірка, чи встановлено BACKEND_URL, щоб уникнути помилок
if (BACKEND_URL) {
  // Планування завдання: відправляти запит кожні 10 хвилин
  cron.schedule('*/14 * * * *', async () => {
    try {
      console.log('Sending health check to backend...');
      const response = await axios.get(BACKEND_URL); // <-- Відправляємо GET-запит на свій же URL
      console.log(`Health check status: ${response.status}`);
    } catch (error) {
      console.error('Error during health check:', error);
    }
  });
} else {
  console.warn('BACKEND_URL is not set. Cron job for health check will not run.');
}


app.use(cors()); // Enable CORS for all routes (important for frontend communication)
app.use(express.json()); // Enable JSON body parser

// --- API Routes ---
app.use('/api/auth', authRoutes); // Use auth routes with a base path of /api/auth
app.use('/api/events', eventRoutes); 


// Basic route to test the server
app.get('/', (req, res) => {
  res.send('Hello from the Backend API!');
});

app.get('/test-db-connection', async (req, res) => {
  try {
    await prisma.$connect(); // Optional: Explicitly connect for a test
    res.send('Database connection successful!');
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).send('Database connection failed!');
  } finally {
    // await prisma.$disconnect(); // Only disconnect if you don't keep it open for other routes
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// Handle graceful shutdown (optional but good practice)
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});