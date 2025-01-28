import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { gadgetRouter } from './routes/gadgetRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/gadgets', gadgetRouter);

const port = process.env.PORT || 3000;


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
