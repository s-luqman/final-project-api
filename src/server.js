import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

let specs;
try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const openApiPath = path.resolve(__dirname, '../docs/openapi.yaml');
  specs = yaml.load(fs.readFileSync(openApiPath, 'utf8'));
} catch (error) {
  console.error('Failed to load OpenAPI specification:', error.message);
  specs = null;
}

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

if (specs) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
} else {
  app.get('/api-docs', (req, res) => {
    res.status(503).json({ error: 'API docs are temporarily unavailable' });
  });
}
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  if (!err.status) {
    err.status = 500;
    err.message = 'Internal Server Error';
  }
  res.status(err.status).json({ error: err.message });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

export default app;
