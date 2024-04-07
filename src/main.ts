import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { buildServer } from './app/server';
import { shutdown } from './app/shutdown';
import { env } from './config/env';
import { db } from './db';

async function main() {
    const app = await buildServer();

    await app.listen({
        port: env.PORT,
        host: env.HOST,
    });

    await migrate(db, {
        migrationsFolder: './migrations',
    });

    const signals = ['SIGINT', 'SIGTERM'];

    for (const signal of signals) {
        process.on(signal, () => {
            shutdown({ app });
        });
    }
}

main();
