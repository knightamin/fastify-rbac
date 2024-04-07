import { buildServer } from './server';

export async function shutdown({
    app,
}: {
    app: Awaited<ReturnType<typeof buildServer>>;
}) {
    await app.close();
}
