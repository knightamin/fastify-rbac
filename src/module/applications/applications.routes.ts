import { FastifyInstance } from 'fastify';
import {
    createApplicationHandler,
    getApplicationHandler,
} from './applications.controllers';
import { createApplicationJsonSchema } from './application.schemas';

export async function applictionsRoutes(app: FastifyInstance) {
    app.post(
        '/',
        {
            schema: createApplicationJsonSchema,
        },
        createApplicationHandler
    );

    app.get('/', getApplicationHandler);
}
