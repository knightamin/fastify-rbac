import fastify from 'fastify';
import { logger } from './logger';
import { applictionsRoutes } from '../module/applications/applications.routes';
import { usersRoutes } from '../module/users/users.routes';
export async function buildServer() {
    const app = fastify({
        logger,
    });

    app.register(applictionsRoutes, { prefix: '/api/applications' });
    app.register(usersRoutes, { prefix: '/api/users' });

    return app;
}
