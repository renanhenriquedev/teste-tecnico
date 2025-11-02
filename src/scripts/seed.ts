import { connectMongo } from '../infra/db/mongoose';
import { ClientModel } from '../infra/db/ClientModel';

async function main() {
  await connectMongo();

  const samples = [
    { name: 'Maria Souza', email: 'maria@example.com', phone: '11999998888' },
    { name: 'João Silva',  email: 'joao@example.com',  phone: '11988887777' },
    { name: 'Ana Lima',    email: 'ana@example.com',   phone: '11977776666' },
  ];

  for (const s of samples) {
    await ClientModel.updateOne(
      { email: s.email },
      { $setOnInsert: s },
      { upsert: true }
    );
  }

  const count = await ClientModel.countDocuments();
  console.log(`[seed] OK. total clientes: ${count}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('[seed] erro:', err);
  process.exit(1);
});
