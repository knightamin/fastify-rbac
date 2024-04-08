import fastify from 'fastify';
import { logger } from './logger';
import { applictionsRoutes } from '../module/applications/applications.routes';
export async function buildServer() {
    const app = fastify({
        logger,
    });

    app.register(applictionsRoutes, { prefix: '/api/applications' });

    return app;
}
