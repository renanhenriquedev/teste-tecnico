import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'express-async-errors';
import { connectMongo } from '../infra/db/mongoose';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT ?? 3000);

connectMongo()  // Conectar ao MongoDB
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error starting the server:', err);
  });
