import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

export function mountSwagger(app: Express) {
  const specPath = path.join(process.cwd(), 'src', 'app', 'openapi.json');
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
}
