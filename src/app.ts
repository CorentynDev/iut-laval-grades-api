import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { httpLogger } from './middleware/httpLogger';
import { swaggerSpec } from './config/swagger';
import { studentRoutes } from './routes/students';
import { courseRoutes } from './routes/courses';
import { gradeRoutes } from './routes/grades';
import { authRoutes } from './routes/auth';
import { statsRoutes } from './routes/stats';
import { setupUnhandledErrors } from './middleware/unhandledErrors';

setupUnhandledErrors();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(helmet({
    contentSecurityPolicy: false,
}));

app.use(httpLogger);
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);

app.use('/api/students', authMiddleware, studentRoutes);
app.use('/api/courses', authMiddleware, courseRoutes);
app.use('/api/grades', authMiddleware, gradeRoutes);
app.use('/api/stats', authMiddleware, statsRoutes);

app.use(errorHandler);

export default app;
