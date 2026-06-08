import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import routes
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Shiv Shakti Auto parts and workshop API is running' });
});

import customerRoutes from './routes/customers';
import inventoryRoutes from './routes/inventory';
import jobcardRoutes from './routes/jobcards';
import udhariRoutes from './routes/udhari';
import authRoutes from './routes/auth';
import expensesRoutes from './routes/expenses';
import suppliersRoutes from './routes/suppliers';
import reportsRoutes from './routes/reports';

// Register routes here
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/jobcards', jobcardRoutes);
app.use('/api/udhari', udhariRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/reports', reportsRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
