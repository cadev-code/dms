import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 8080;

dotenv.config(); // Load environment variables

app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // CORS configuration
app.use(cookieParser()); // Middleware for parsing cookies

app.use(express.json()); // Middleware for parsing JSON request bodies

app.listen(PORT, () => {});
