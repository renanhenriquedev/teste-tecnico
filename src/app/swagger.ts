import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

export function mountSwagger(app: Express) {
  const isProd = process.env.NODE_ENV === 'production';
  const distSpec = path.join(__dirname, 'openapi.json');
  const srcSpec  = path.join(process.cwd(), 'src', 'app', 'openapi.json');
  const specPath = isProd ? distSpec : srcSpec;

  const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
}
