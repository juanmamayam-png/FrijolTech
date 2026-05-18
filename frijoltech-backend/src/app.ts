import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './interfaces/routes/authRoutes';
import predioRoutes from './interfaces/routes/predioRoutes';
import campañaRoutes from './interfaces/routes/campañaRoutes';
import etapaRoutes from './interfaces/routes/etapaRoutes';
import incidenciaRoutes from './interfaces/routes/incidenciaRoutes';
import { errorMiddleware } from './interfaces/middlewares/errorMiddleware';

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), sistema: 'FrijolTech Backend v1.0' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/predios', predioRoutes);
app.use('/api/v1/campa%C3%B1as', campañaRoutes);
app.use('/api/v1/etapas', etapaRoutes);
app.use('/api/v1/campa%C3%B1as', incidenciaRoutes);

app.use(errorMiddleware);

const PORT = parseInt(process.env.PORT ?? '3000', 10);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[FrijolTech] Servidor corriendo en http://localhost:${PORT}`);
    console.log(`[FrijolTech] Health check: http://localhost:${PORT}/health`);
  });
}

export default app;
