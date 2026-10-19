import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

async function start() {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`Servidor corriendo en http://localhost:${env.port}`);
  });
}

start();
